# Restart Medusa Backend Server Script
# This script stops all Medusa processes and starts a fresh server

Write-Host "Stopping all Medusa-related Node processes..." -ForegroundColor Yellow

# Kill all node processes related to Medusa
Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object {
    try {
        $processInfo = Get-CimInstance Win32_Process -Filter "ProcessId = $($_.Id)" -ErrorAction SilentlyContinue
        if ($processInfo -and ($processInfo.CommandLine -like '*medusa*' -or $processInfo.CommandLine -like '*npx*')) {
            Write-Host "Killing process $($_.Id): $($processInfo.CommandLine)" -ForegroundColor Cyan
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        }
    } catch {
        Write-Host "Could not check process $($_.Id)" -ForegroundColor Gray
    }
}

Write-Host "Waiting for processes to fully terminate..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Clean up the old log file
Write-Host "Clearing old log file..." -ForegroundColor Yellow
if (Test-Path "../startup_final_v29.log") {
    Remove-Item "../startup_final_v29.log" -Force
}

Write-Host "Starting fresh Medusa server..." -ForegroundColor Green
Write-Host "Log file: ../startup_final_v29.log" -ForegroundColor Cyan
Write-Host ""
Write-Host "To view logs in real-time, open another terminal and run:" -ForegroundColor Yellow
Write-Host "  Get-Content ../startup_final_v29.log -Wait" -ForegroundColor Cyan
Write-Host ""

# Start the server
npx medusa develop > ../startup_final_v29.log 2>&1
