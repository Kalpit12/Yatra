@echo off
REM Initialize MySQL Data Directory

echo.
echo ========================================
echo   Initializing MySQL Data Directory
echo ========================================
echo.

set "MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.0\bin"
set "MYSQL_DATA=C:\Program Files\MySQL\MySQL Server 8.0\data"

echo This will initialize MySQL data directory.
echo.
echo MySQL Bin: %MYSQL_BIN%
echo MySQL Data: %MYSQL_DATA%
echo.

REM Check if data directory exists
if exist "%MYSQL_DATA%" (
    echo ⚠️  Data directory already exists: %MYSQL_DATA%
    echo.
    echo If you want to reinitialize, delete this folder first.
    echo.
    pause
    exit /b 1
)

echo Creating data directory...
mkdir "%MYSQL_DATA%" 2>nul

echo.
echo Initializing MySQL...
echo This may take a minute...
echo.

REM Initialize MySQL
"%MYSQL_BIN%\mysqld.exe" --initialize-insecure --datadir="%MYSQL_DATA%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ MySQL initialized successfully!
    echo.
    echo 📝 IMPORTANT: MySQL root user has NO PASSWORD initially.
    echo    You can set a password later if needed.
    echo.
    echo Now you can start MySQL:
    echo   1. Run start-mysql-manual.bat
    echo   2. Or use: mysqld.exe --console
    echo.
) else (
    echo.
    echo ❌ Initialization failed.
    echo.
    echo Try running as Administrator:
    echo   Right-click this file → Run as Administrator
    echo.
)

pause

