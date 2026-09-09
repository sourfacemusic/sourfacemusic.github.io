[CmdletBinding()]
param(
  [string]$StripeUrl,
  [string]$BluevineUrl
)

$ErrorActionPreference = 'Stop'

function Read-OrDefault {
  param(
    [string]$Prompt,
    [string]$DefaultValue
  )

  if ([string]::IsNullOrWhiteSpace($DefaultValue)) {
    $value = Read-Host $Prompt
    return $value.Trim()
  }

  $value = Read-Host "$Prompt [$DefaultValue]"
  if ([string]::IsNullOrWhiteSpace($value)) { return $DefaultValue }
  return $value.Trim()
}

function Assert-PublicPaymentUrl {
  param(
    [string]$Url,
    [ValidateSet('stripe', 'bluevine')][string]$Provider
  )

  if ([string]::IsNullOrWhiteSpace($Url)) {
    throw "Missing $Provider URL."
  }

  $uri = $null
  if (-not [System.Uri]::TryCreate($Url, [System.UriKind]::Absolute, [ref]$uri)) {
    throw "Invalid $Provider URL: $Url"
  }

  if ($uri.Scheme -ne 'https') {
    throw "$Provider URL must use https://"
  }

  $urlHost = $uri.Host.ToLowerInvariant()
  $urlPath = $uri.AbsolutePath.ToLowerInvariant()
  $combined = "$urlHost$urlPath"

  if (-not $urlHost.Contains('.')) {
    throw "$Provider URL host must be a real public domain."
  }

  if ($combined -match '(?i)(your[-_]|real[-_]?link|public[-_]?link|placeholder|example)') {
    throw "$Provider URL looks like placeholder text. Use your real public link."
  }

  if ($Provider -eq 'stripe' -and $urlHost -eq 'dashboard.stripe.com') {
    throw "Stripe dashboard URL is private. Use a public Stripe payment link (for example https://buy.stripe.com/... or https://pay.stripe.com/...)."
  }

  if ($Provider -eq 'bluevine' -and $urlHost -eq 'app.bluevine.com' -and $urlPath.StartsWith('/dashboard')) {
    throw "Bluevine dashboard URL is private. Use a public Bluevine payment/transfer link."
  }
}

function Escape-JsSingleQuotedString {
  param([string]$Value)
  return $Value.Replace('\', '\\').Replace("'", "\'")
}

$configPath = Join-Path $PSScriptRoot 'site-config.js'
if (-not (Test-Path -LiteralPath $configPath)) {
  throw "Could not find site-config.js at $configPath"
}

$content = Get-Content -Raw -LiteralPath $configPath
$blockPattern = "(?ms)^\s*paymentLinks:\s*\{\s*stripe:\s*'(?<stripe>[^']*)',\s*bluevine:\s*'(?<bluevine>[^']*)'\s*\},?"
$blockRegex = [regex]::new(
  $blockPattern,
  [System.Text.RegularExpressions.RegexOptions]::Singleline -bor [System.Text.RegularExpressions.RegexOptions]::Multiline
)
$blockMatch = $blockRegex.Match($content)

$currentStripe = if ($blockMatch.Success) { $blockMatch.Groups['stripe'].Value } else { '' }
$currentBluevine = if ($blockMatch.Success) { $blockMatch.Groups['bluevine'].Value } else { '' }

if (-not $PSBoundParameters.ContainsKey('StripeUrl')) {
  $StripeUrl = Read-OrDefault -Prompt 'Enter Stripe public payment link' -DefaultValue $currentStripe
}
if (-not $PSBoundParameters.ContainsKey('BluevineUrl')) {
  $BluevineUrl = Read-OrDefault -Prompt 'Enter Bluevine public payment/transfer link' -DefaultValue $currentBluevine
}

$StripeUrl = $StripeUrl.Trim()
$BluevineUrl = $BluevineUrl.Trim()

Assert-PublicPaymentUrl -Url $StripeUrl -Provider stripe
Assert-PublicPaymentUrl -Url $BluevineUrl -Provider bluevine

$escapedStripe = Escape-JsSingleQuotedString -Value $StripeUrl
$escapedBluevine = Escape-JsSingleQuotedString -Value $BluevineUrl

$newBlock = @"
  paymentLinks: {
    stripe: '$escapedStripe',
    bluevine: '$escapedBluevine'
  },
"@

if ($blockMatch.Success) {
  $content = $blockRegex.Replace($content, $newBlock, 1)
} else {
  $insertPattern = "(?m)^(  fundraiserExternalUrl:\s*'[^']*',\s*)$"
  $insertRegex = [regex]::new($insertPattern)
  if (-not $insertRegex.IsMatch($content)) {
    throw 'Could not locate fundraiserExternalUrl block to insert paymentLinks.'
  }

  $content = $insertRegex.Replace(
    $content,
    [System.Text.RegularExpressions.MatchEvaluator]{
      param($m)
      "$($m.Groups[1].Value)`r`n$newBlock"
    },
    1
  )
}

Set-Content -LiteralPath $configPath -Value $content -Encoding UTF8
Write-Host "Updated paymentLinks in $configPath"
