[CmdletBinding()]
param(
  [string]$StripeUrl,
  [string]$BluevineUrl,
  [switch]$SkipDeployWait
)

$ErrorActionPreference = 'Stop'

$repoRoot = $PSScriptRoot
$setterScript = Join-Path $repoRoot 'set-payment-links.ps1'
if (-not (Test-Path -LiteralPath $setterScript)) {
  throw "Missing required script: $setterScript"
}

Push-Location $repoRoot
try {
  $setterParams = @{}
  if (-not [string]::IsNullOrWhiteSpace($StripeUrl)) { $setterParams.StripeUrl = $StripeUrl }
  if (-not [string]::IsNullOrWhiteSpace($BluevineUrl)) { $setterParams.BluevineUrl = $BluevineUrl }
  & $setterScript @setterParams

  $siteConfigStatus = git --no-pager status --porcelain -- site-config.js
  if ([string]::IsNullOrWhiteSpace($siteConfigStatus)) {
    Write-Host 'site-config.js already up to date. Nothing to commit.'
    return
  }

  git add site-config.js
  git commit -m "Update Stripe and Bluevine payment links" -m "Set public Stripe and Bluevine payment URLs in site-config.js."
  git push origin HEAD:main

  if ($SkipDeployWait) {
    Write-Host 'Pushed to main. Skipping deploy wait by request.'
    return
  }

  $ghExists = Get-Command gh -ErrorAction SilentlyContinue
  if (-not $ghExists) {
    Write-Host 'Pushed to main. GitHub CLI not found, so deploy status was not checked automatically.'
    return
  }

  $runId = gh run list --workflow pages.yml --limit 1 --json databaseId --jq '.[0].databaseId'
  if ([string]::IsNullOrWhiteSpace($runId)) {
    Write-Host 'Pushed to main. Could not determine Pages workflow run ID.'
    return
  }

  gh run watch $runId --exit-status
}
finally {
  Pop-Location
}
