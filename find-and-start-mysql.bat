@echo off
REM Find and Start MySQL Service

echo.
echo ========================================
echo   Finding MySQL Service
echo ========================================
echo.

REM Try to find MySQL service
echo Searching for MySQL service...
echo.

REM Check common service names
set FOUND=0

sc query MySQL80 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Found service: MySQL80
    echo Starting MySQL80...
    net start MySQL80
    if %ERRORLEVEL% EQU 0 (
        echo ✅ MySQL80 started successfully!
        set FOUND=1
    ) else (
        echo ⚠️  Could not start MySQL80 (may need Administrator)
    )
)

if %FOUND% EQU 0 (
    sc query MySQL >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Found service: MySQL
        echo Starting MySQL...
        net start MySQL
        if %ERRORLEVEL% EQU 0 (
            echo ✅ MySQL started successfully!
            set FOUND=1
        ) else (
            echo ⚠️  Could not start MySQL (may need Administrator)
        )
    )
)

if %FOUND% EQU 0 (
    sc query MySQL57 >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Found service: MySQL57
        echo Starting MySQL57...
        net start MySQL57
        if %ERRORLEVEL% EQU 0 (
            echo ✅ MySQL57 started successfully!
            set FOUND=1
        )
    )
)

if %FOUND% EQU 0 (
    echo.
    echo ❌ Could not find or start MySQL service automatically.
    echo.
    echo Please try one of these:
    echo.
    echo METHOD 1: Start MySQL Manually (No Admin needed)
    echo   1. Open Command Prompt
    echo   2. Run these commands:
    echo      cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
    echo      mysqld.exe --console
    echo   3. Keep that window open
    echo   4. Open NEW Command Prompt
    echo   5. Run create-database.bat
    echo.
    echo METHOD 2: Use MySQL Workbench
    echo   1. Open MySQL Workbench
    echo   2. It will start MySQL automatically
    echo.
    echo METHOD 3: Run as Administrator
    echo   1. Right-click this file
    echo   2. Select "Run as Administrator"
    echo   3. Try again
    echo.
) else (
    echo.
    echo ✅ MySQL is now running!
    echo.
    echo You can now run create-database.bat
    echo.
)

pause

