@echo off
fsutil dirty query %systemdrive% >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Requesting Administrator access...
    powershell -ExecutionPolicy Bypass -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~dpnx0\"\"' -Verb RunAs"
    exit /b
)

echo ===============================================================
echo   ENABLING CUSTOM DOMAIN FOR RAM PRASAD WATCH STORE
echo ===============================================================
echo.

findstr /I /C:"ramprasadwatchstore.in" "%WINDIR%\System32\drivers\etc\hosts" >nul 2>&1
if %errorlevel% neq 0 (
    echo. >> "%WINDIR%\System32\drivers\etc\hosts"
    echo 127.0.0.1 ramprasadwatchstore.in >> "%WINDIR%\System32\drivers\etc\hosts"
    echo 127.0.0.1 admin.ramprasadwatchstore.in >> "%WINDIR%\System32\drivers\etc\hosts"
    echo [SUCCESS] Domains added to Windows hosts file!
) else (
    echo [INFO] Domains are already configured in Windows hosts file!
)

ipconfig /flushdns >nul 2>&1

echo.
echo ===============================================================
echo   ALL SET! YOU CAN NOW OPEN IN YOUR BROWSER:
echo.
echo   1. Storefront Showroom:
echo      http://ramprasadwatchstore.in/#showrooms
echo.
echo   2. Admin Panel:
echo      http://admin.ramprasadwatchstore.in/
echo ===============================================================
echo.
pause
