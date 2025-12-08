@echo off
REM Install MySQL as Windows Service

echo.
echo ========================================
echo   Installing MySQL as Windows Service
echo ========================================
echo.

set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin

REM Check if MySQL is installed
if not exist "%MYSQL_PATH%\mysqld.exe" (
    echo ❌ MySQL not found at: %MYSQL_PATH%
    echo.
    echo Please check your MySQL installation.
    pause
    exit /b 1
)

echo MySQL found at: %MYSQL_PATH%
echo.

REM Try to install MySQL as a service
echo Installing MySQL as Windows Service...
echo.

"%MYSQL_PATH%\mysqld.exe" --install MySQL80

if %ERRORLEVEL% EQU 0 (
    echo ✅ MySQL service installed successfully!
    echo.
    echo Starting MySQL service...
    net start MySQL80
    
    if %ERRORLEVEL% EQU 0 (
        echo ✅ MySQL service started successfully!
        echo.
        echo You can now run create-database.bat
    ) else (
        echo ⚠️  Service installed but could not start automatically.
        echo Please start it manually from Services (services.msc)
    )
) else (
    echo.
    echo ⚠️  Could not install service. This might mean:
    echo   1. Service already exists
    echo   2. Need to run as Administrator
    echo   3. MySQL is already installed differently
    echo.
    echo Trying to start existing service...
    net start MySQL80
    
    if %ERRORLEVEL% EQU 0 (
        echo ✅ MySQL service started!
    ) else (
        echo.
        echo Please try:
        echo   1. Run this script as Administrator (Right-click → Run as Administrator)
        echo   2. Or start MySQL manually using MySQL Workbench
    )
)

echo.
pause

