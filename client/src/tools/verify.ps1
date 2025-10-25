param([int]$ServerPort=3000)
$ErrorActionPreference="Stop"
Write-Host "[1/3] npm ci" ; npm ci 2>&1 | Out-Null
Write-Host "[2/3] npm run build" ; npm run build 2>&1 | Out-Null
Write-Host "[3/3] npm start"
$env:PORT=$ServerPort
npm start
