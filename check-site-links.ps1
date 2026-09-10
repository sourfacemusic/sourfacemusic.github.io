[CmdletBinding()]
param(
  [string]$RepoPath = $PSScriptRoot,
  [string]$BaseUrl = 'https://sourfacemusic.github.io/',
  [int]$TimeoutSec = 25,
  [int]$MaxRedirects = 8,
  [switch]$IncludeLegacyBackups,
  [switch]$ShowAll
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($RepoPath)) {
  if (-not [string]::IsNullOrWhiteSpace($PSScriptRoot)) {
    $RepoPath = $PSScriptRoot
  } else {
    $RepoPath = (Get-Location).Path
  }
}

function Add-LinkSource {
  param(
    [hashtable]$Map,
    [string]$Url,
    [string]$Source
  )

  if ([string]::IsNullOrWhiteSpace($Url)) { return }
  if (-not $Map.ContainsKey($Url)) {
    $Map[$Url] = New-Object System.Collections.Generic.HashSet[string]
  }
  [void]$Map[$Url].Add($Source)
}

function Convert-ToAbsoluteUrl {
  param(
    [string]$Raw,
    [Uri]$FileBaseUri
  )

  if ($Raw.StartsWith('//')) {
    return "https:$Raw"
  }

  if ($Raw -match '^https?://') {
    return $Raw
  }

  return ([Uri]::new($FileBaseUri, $Raw)).AbsoluteUri
}

function Get-LocalRelativeTarget {
  param(
    [string]$Raw,
    [string]$RepoPath,
    [string]$SourceFile
  )

  # Ignore query and hash when checking file existence
  $rawPath = $Raw.Split('#')[0].Split('?')[0]
  if ([string]::IsNullOrWhiteSpace($rawPath)) { return $null }

  if ($rawPath.StartsWith('/')) {
    $candidate = Join-Path $RepoPath $rawPath.TrimStart('/')
    if (Test-Path -LiteralPath $candidate) { return $null }
    return $rawPath.TrimStart('/').Replace('\', '/')
  }

  $sourceDir = Split-Path -Parent $SourceFile
  $candidate = Join-Path $sourceDir $rawPath
  if (Test-Path -LiteralPath $candidate) { return $null }

  $full = [System.IO.Path]::GetFullPath($candidate)
  if ($full.StartsWith([System.IO.Path]::GetFullPath($RepoPath), [System.StringComparison]::OrdinalIgnoreCase)) {
    return $full.Substring([System.IO.Path]::GetFullPath($RepoPath).Length).TrimStart('\').Replace('\', '/')
  }

  return $rawPath.Replace('\', '/')
}

function Test-HttpUrl {
  param(
    [string]$Url,
    [int]$TimeoutSec,
    [int]$MaxRedirects
  )

  $headers = @{ 'User-Agent' = 'Mozilla/5.0 (compatible; sourfacemusic-link-audit/1.0)' }

  foreach ($method in @('Head', 'Get')) {
    try {
      $response = Invoke-WebRequest `
        -Uri $Url `
        -Method $method `
        -Headers $headers `
        -TimeoutSec $TimeoutSec `
        -MaximumRedirection $MaxRedirects `
        -ErrorAction Stop

      $status = [int]$response.StatusCode
      $final = if ($response.BaseResponse -and $response.BaseResponse.ResponseUri) {
        $response.BaseResponse.ResponseUri.AbsoluteUri
      } else {
        $Url
      }

      return [pscustomobject]@{
        Url = $Url
        Status = $status
        Ok = ($status -ge 200 -and $status -lt 400)
        Final = $final
        Method = $method
        Error = $null
      }
    }
    catch [System.Net.WebException] {
      $webException = $_.Exception
      $response = $webException.Response
      if ($response) {
        $status = [int]$response.StatusCode
        if ($method -eq 'Head' -and ($status -in 400, 403, 405)) {
          continue
        }

        return [pscustomobject]@{
          Url = $Url
          Status = $status
          Ok = ($status -ge 200 -and $status -lt 400)
          Final = $Url
          Method = $method
          Error = "HTTP $status"
        }
      }

      if ($method -eq 'Head') { continue }

      return [pscustomobject]@{
        Url = $Url
        Status = $null
        Ok = $false
        Final = $Url
        Method = $method
        Error = $webException.Message
      }
    }
    catch {
      if ($method -eq 'Head') { continue }

      return [pscustomobject]@{
        Url = $Url
        Status = $null
        Ok = $false
        Final = $Url
        Method = $method
        Error = $_.Exception.Message
      }
    }
  }

  return [pscustomobject]@{
    Url = $Url
    Status = $null
    Ok = $false
    Final = $Url
    Method = 'Get'
    Error = 'Unknown failure'
  }
}

function Test-PaymentLinkValue {
  param(
    [string]$Provider,
    [string]$Url
  )

  $errors = @()
  $warnings = @()

  if ([string]::IsNullOrWhiteSpace($Url)) {
    $errors += "Missing $Provider URL in site-config.js paymentLinks."
    return [pscustomobject]@{ Provider = $Provider; Url = $Url; Errors = $errors; Warnings = $warnings }
  }

  $uri = $null
  if (-not [System.Uri]::TryCreate($Url, [System.UriKind]::Absolute, [ref]$uri)) {
    $errors += "Invalid $Provider URL: $Url"
    return [pscustomobject]@{ Provider = $Provider; Url = $Url; Errors = $errors; Warnings = $warnings }
  }

  if ($uri.Scheme -ne 'https') {
    $errors += "$Provider URL must use https:// ($Url)"
  }

  $urlHost = $uri.Host.ToLowerInvariant()
  $urlPath = $uri.AbsolutePath.ToLowerInvariant()
  $combined = "$urlHost$urlPath"

  if (-not $urlHost.Contains('.')) {
    $errors += "$Provider URL host must be a real public domain ($Url)"
  }

  if ($combined -match '(?i)(your[-_]|real[-_]?link|public[-_]?link|placeholder|example|replace-me)') {
    $errors += "$Provider URL looks like placeholder text ($Url)"
  }

  if ($Provider -eq 'stripe') {
    if ($urlHost -eq 'dashboard.stripe.com') {
      $errors += 'Stripe dashboard URL is private; use a public Stripe payment link.'
    }

    if ($urlHost -eq 'stripe.com' -and $urlPath.StartsWith('/payments/payment-links')) {
      $warnings += 'Stripe URL points to Stripe docs, not a direct checkout/payment link.'
    }
  }

  if ($Provider -eq 'bluevine') {
    if ($urlHost -eq 'app.bluevine.com' -and $urlPath.StartsWith('/dashboard')) {
      $errors += 'Bluevine dashboard URL is private; use a public Bluevine payment/transfer link.'
    }

    if ($urlHost -eq 'www.bluevine.com' -or $urlHost -eq 'bluevine.com') {
      $warnings += 'Bluevine URL points to homepage; use a direct public payment/transfer link if available.'
    }
  }

  return [pscustomobject]@{
    Provider = $Provider
    Url = $Url
    Errors = $errors
    Warnings = $warnings
  }
}

$repoFullPath = [System.IO.Path]::GetFullPath($RepoPath)
if (-not (Test-Path -LiteralPath $repoFullPath)) {
  throw "RepoPath does not exist: $repoFullPath"
}

$baseUri = [Uri]$BaseUrl
$linkSources = @{}
$mailtoLinks = New-Object System.Collections.Generic.HashSet[string]
$telLinks = New-Object System.Collections.Generic.HashSet[string]
$anchorIssues = New-Object System.Collections.Generic.List[string]
$localMissing = New-Object System.Collections.Generic.List[string]

$htmlFiles = Get-ChildItem -Path $repoFullPath -Recurse -File -Filter *.html |
  Where-Object {
    if ($IncludeLegacyBackups) { return $true }
    return ($_.FullName -notlike "*\legacy-backups\*")
  }

$attrRegex = '(?:href|src)\s*=\s*[''"]([^''"]+)[''"]'
$idRegex = '\bid\s*=\s*[''"]([^''"]+)[''"]'
$anchorHrefRegex = 'href\s*=\s*[''"]#([^''"]+)[''"]'

foreach ($file in $htmlFiles) {
  $text = Get-Content -Raw -LiteralPath $file.FullName
  $relFile = $file.FullName.Substring($repoFullPath.Length + 1).Replace('\', '/')
  $fileBase = [Uri]::new($baseUri, $relFile)

  $ids = New-Object System.Collections.Generic.HashSet[string]
  [regex]::Matches($text, $idRegex, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase) |
    ForEach-Object { [void]$ids.Add($_.Groups[1].Value) }

  [regex]::Matches($text, $anchorHrefRegex, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase) |
    ForEach-Object {
      $anchorId = $_.Groups[1].Value
      if (-not $ids.Contains($anchorId)) {
        [void]$anchorIssues.Add("$relFile -> #$anchorId")
      }
    }

  [regex]::Matches($text, $attrRegex, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase) |
    ForEach-Object {
      $raw = $_.Groups[1].Value.Trim()
      if ([string]::IsNullOrWhiteSpace($raw)) { return }
      if ($raw.StartsWith('#')) { return }
      if ($raw.StartsWith('javascript:', [System.StringComparison]::OrdinalIgnoreCase)) { return }
      if ($raw.StartsWith('data:', [System.StringComparison]::OrdinalIgnoreCase)) { return }

      if ($raw.StartsWith('mailto:', [System.StringComparison]::OrdinalIgnoreCase)) {
        [void]$mailtoLinks.Add($raw)
        return
      }

      if ($raw.StartsWith('tel:', [System.StringComparison]::OrdinalIgnoreCase)) {
        [void]$telLinks.Add($raw)
        return
      }

      $isRelative = -not ($raw.StartsWith('//') -or ($raw -match '^https?://'))
      if ($isRelative) {
        $missing = Get-LocalRelativeTarget -Raw $raw -RepoPath $repoFullPath -SourceFile $file.FullName
        if ($missing) {
          [void]$localMissing.Add("$relFile -> $raw (missing: $missing)")
        }
      }

      $resolved = Convert-ToAbsoluteUrl -Raw $raw -FileBaseUri $fileBase
      Add-LinkSource -Map $linkSources -Url $resolved -Source $relFile
    }
}

$paymentChecks = @()
$configPath = Join-Path $repoFullPath 'site-config.js'
if (Test-Path -LiteralPath $configPath) {
  $cfg = Get-Content -Raw -LiteralPath $configPath
  $paymentBlock = [regex]::Match($cfg, '(?ms)paymentLinks\s*:\s*\{(?<body>.*?)\}')
  if ($paymentBlock.Success) {
    $body = $paymentBlock.Groups['body'].Value
    foreach ($provider in @('stripe', 'bluevine')) {
      $match = [regex]::Match($body, [string]::Format('(?im)^\s*{0}\s*:\s*[''"](?<u>[^''"]*)[''"]', $provider))
      $urlValue = if ($match.Success) { $match.Groups['u'].Value.Trim() } else { '' }
      $paymentChecks += Test-PaymentLinkValue -Provider $provider -Url $urlValue
      if ($urlValue -match '^https?://') {
        Add-LinkSource -Map $linkSources -Url $urlValue -Source 'site-config.js'
      }
    }
  }

  foreach ($key in @('fundraiserExternalUrl', 'fundraiserUrl')) {
    $m = [regex]::Match($cfg, [string]::Format('(?is)\b{0}\s*:\s*[''"](?<u>https?://[^''"]+)[''"]', $key))
    if ($m.Success) {
      Add-LinkSource -Map $linkSources -Url $m.Groups['u'].Value.Trim() -Source 'site-config.js'
    }
  }
}

$urls = $linkSources.Keys | Sort-Object
$results = foreach ($url in $urls) {
  Test-HttpUrl -Url $url -TimeoutSec $TimeoutSec -MaxRedirects $MaxRedirects
}

$badLinks = $results | Where-Object { -not $_.Ok }
$paymentErrors = $paymentChecks | ForEach-Object { $_.Errors } | Where-Object { $_ }
$paymentWarnings = $paymentChecks | ForEach-Object { $_.Warnings } | Where-Object { $_ }

Write-Host ''
Write-Host "Checked URLs: $($results.Count)"
Write-Host "Healthy: $($results.Count - $badLinks.Count)"
Write-Host "Broken: $($badLinks.Count)"
Write-Host "Anchor issues: $($anchorIssues.Count)"
Write-Host "Missing local files: $($localMissing.Count)"
Write-Host ''

if ($mailtoLinks.Count -gt 0) {
  Write-Host 'Mailto links:'
  foreach ($m in ([string[]]$mailtoLinks | Sort-Object)) { Write-Host "  $m" }
  Write-Host ''
}

if ($telLinks.Count -gt 0) {
  Write-Host 'Tel links:'
  foreach ($t in ([string[]]$telLinks | Sort-Object)) { Write-Host "  $t" }
  Write-Host ''
}

if ($paymentChecks.Count -gt 0) {
  Write-Host 'Payment links in site-config.js:'
  foreach ($p in $paymentChecks) {
    $status = if ($p.Errors.Count -gt 0) { 'ERROR' } elseif ($p.Warnings.Count -gt 0) { 'WARN' } else { 'OK' }
    Write-Host "  [$status] $($p.Provider): $($p.Url)"
    foreach ($err in $p.Errors) { Write-Host "    - $err" }
    foreach ($warn in $p.Warnings) { Write-Host "    - $warn" }
  }
  Write-Host ''
}

if ($badLinks.Count -gt 0) {
  Write-Host 'Broken links:' -ForegroundColor Red
  foreach ($bad in $badLinks) {
    $src = ([string[]]$linkSources[$bad.Url] | Sort-Object) -join ', '
    Write-Host "  [$($bad.Status)] $($bad.Url)"
    Write-Host "    Sources: $src"
    Write-Host "    Error: $($bad.Error)"
  }
  Write-Host ''
}

if ($anchorIssues.Count -gt 0) {
  Write-Host 'Anchor issues:' -ForegroundColor Red
  foreach ($issue in $anchorIssues) { Write-Host "  $issue" }
  Write-Host ''
}

if ($localMissing.Count -gt 0) {
  Write-Host 'Missing local files referenced by relative links:' -ForegroundColor Red
  foreach ($issue in $localMissing) { Write-Host "  $issue" }
  Write-Host ''
}

if ($ShowAll) {
  Write-Host 'All checked URLs:'
  foreach ($r in $results) {
    $src = ([string[]]$linkSources[$r.Url] | Sort-Object) -join ', '
    Write-Host "  [$($r.Status)] ok=$($r.Ok) $($r.Url)"
    Write-Host "    Final: $($r.Final)"
    Write-Host "    Sources: $src"
  }
  Write-Host ''
}

$hasErrors = ($badLinks.Count -gt 0) -or ($anchorIssues.Count -gt 0) -or ($localMissing.Count -gt 0) -or ($paymentErrors.Count -gt 0)

if ($hasErrors) {
  Write-Host 'Audit failed. Fix the items above and run again.' -ForegroundColor Red
  exit 1
}

if ($paymentWarnings.Count -gt 0) {
  Write-Host 'Audit passed with warnings. Consider replacing generic payment URLs with direct public payment links.' -ForegroundColor Yellow
  exit 0
}

Write-Host 'Audit passed. All links are operational.' -ForegroundColor Green
exit 0
