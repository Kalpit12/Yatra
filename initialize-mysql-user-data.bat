@echo off
REM Initialize MySQL with User Data Directory (No Admin Needed)

echo.
echo ========================================
echo   Initialize MySQL - User Data Directory
echo ========================================
echo.

REM Use user's AppData instead of Program Files (no admin needed)
set "MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.0\bin"
set "MYSQL_DATA=%USERPROFILE%\MySQLData"

echo This will initialize MySQL in your user folder.
echo No Administrator rights needed!
echo.
echo MySQL Bin: %MYSQL_BIN%
echo MySQL Data: %MYSQL_DATA%
echo.

REM Create data directory
if not exist "%MYSQL_DATA%" (
    echo Creating data directory...
    mkdir "%MYSQL_DATA%"
)

echo.
echo Initializing MySQL...
echo This may take 1-2 minutes...
echo.

REM Initialize MySQL with user data directory
"%MYSQL_BIN%\mysqld.exe" --initialize-insecure --datadir="%MYSQL_DATA%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ MySQL initialized successfully!
    echo.
    echo 📝 Data directory: %MYSQL_DATA%
    echo.
    echo Now start MySQL with this command:
    echo   mysqld.exe --datadir="%MYSQL_DATA%" --console
    echo.
    echo Or use: start-mysql-user.bat
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

