param([int]$Port=3000)

$env:PORT = $Port
node tools/selftest.js
exit $LASTEXITCODE
