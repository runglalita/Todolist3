# Todolist3 share manager
# Usage:
#   .\share.ps1 start    - start server + public tunnel, copy link to clipboard
#   .\share.ps1 stop     - stop tunnel + server
#   .\share.ps1 status   - show what is running and the public link
#   .\share.ps1 url      - print current public link only
param(
    [ValidateSet("start", "stop", "status", "url")]
    [string]$Action = "start"
)

$ErrorActionPreference = "Stop"
$ProjectRoot   = "C:\Todolist3"
$NodeExe       = Join-Path $env:ProgramFiles "nodejs\node.exe"
$CloudflaredExe = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
$CfLog         = Join-Path $env:TEMP "lileud_cf.log"
$ServerLog     = Join-Path $env:TEMP "lileud_server.log"
$ServerErr     = Join-Path $env:TEMP "lileud_server.err.log"
$LocalUrl      = "http://localhost:8000"

if (-not (Test-Path $NodeExe)) { $NodeExe = "node" }
if (-not (Test-Path $CloudflaredExe)) {
    $cmd = Get-Command cloudflared -ErrorAction SilentlyContinue
    if ($cmd) { $CloudflaredExe = $cmd.Source }
}

function Get-Nodes {
    Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -like '*C:\Todolist3\server.js*' }
}
function Get-Tunnel {
    Get-CimInstance Win32_Process -Filter "Name='cloudflared.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -like '*tunnel*' -and $_.CommandLine -like '*localhost:8000*' }
}
function Get-PublicUrl {
    if (-not (Test-Path $CfLog)) { return "" }
    $hits = Select-String -Path $CfLog -Pattern 'https://[a-z0-9-]+\.trycloudflare\.com' -AllMatches -ErrorAction SilentlyContinue
    if ($hits) { return ($hits | Select-Object -Last 1).Matches[0].Value }
    return ""
}

function Start-Server {
    if (Get-Nodes) { Write-Host "server: already running" -ForegroundColor Yellow; return }
    $p = Start-Process $NodeExe -ArgumentList "$ProjectRoot\server.js" -WindowStyle Hidden `
        -RedirectStandardOutput $ServerLog -RedirectStandardError $ServerErr -PassThru
    Start-Sleep -Seconds 1
    $deadline = (Get-Date).AddSeconds(10)
    while ((Get-Date) -lt $deadline) {
        try { Invoke-WebRequest -Uri $LocalUrl -UseBasicParsing -TimeoutSec 3 | Out-Null }
        catch { Start-Sleep -Milliseconds 500; continue }
        Write-Host "server: running (pid $($p.Id))" -ForegroundColor Green
        return
    }
    Write-Host "server: FAILED to start - see $ServerErr" -ForegroundColor Red
}

function Start-Tunnel {
    if (Get-Tunnel) {
        Write-Host "tunnel: already running" -ForegroundColor Yellow
        $u = Get-PublicUrl
        if ($u) { Show-Url $u }
        return
    }
    Remove-Item $CfLog -ErrorAction SilentlyContinue
    Start-Process $CloudflaredExe -ArgumentList 'tunnel','--url','http://localhost:8000','--no-autoupdate','--logfile',$CfLog,'--loglevel','info' -WindowStyle Hidden
    $deadline = (Get-Date).AddSeconds(90)
    while ((Get-Date) -lt $deadline) {
        Start-Sleep -Seconds 2
        $u = Get-PublicUrl
        if ($u) { Show-Url $u; return }
    }
    Write-Host "tunnel: FAILED - check $CfLog" -ForegroundColor Red
}

function Show-Url([string]$u) {
    Write-Host ""
    Write-Host "  Public link (share this):" -ForegroundColor Cyan
    Write-Host "  $u" -ForegroundColor White
    Write-Host "  Local link: $LocalUrl" -ForegroundColor DarkGray
    $u | Set-Clipboard
    Write-Host ""
    Write-Host "  (copied to clipboard)" -ForegroundColor DarkGray
}

function Stop-All {
    Get-Tunnel | ForEach-Object { Stop-Process -Id $_.ProcessId -Force; Write-Host "tunnel: stopped (pid $($_.ProcessId))" }
    Get-Nodes   | ForEach-Object { Stop-Process -Id $_.ProcessId -Force; Write-Host "server: stopped (pid $($_.ProcessId))" }
}

switch ($Action) {
    "start"  { Start-Server; Start-Tunnel }
    "stop"   { Stop-All }
    "status" {
        if (Get-Nodes)   { Write-Host "server:  running" -ForegroundColor Green }
        else             { Write-Host "server:  not running" -ForegroundColor Red }
        if (Get-Tunnel)  { Write-Host "tunnel:  running"  -ForegroundColor Green }
        else             { Write-Host "tunnel:  not running" -ForegroundColor Red }
        $u = Get-PublicUrl
        if ($u) { Show-Url $u } else { Write-Host "public link: none yet" }
    }
    "url"    { Write-Host (Get-PublicUrl) }
}