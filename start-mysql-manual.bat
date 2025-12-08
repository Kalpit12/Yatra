@echo off
REM Start MySQL Manually (No Admin Required)

echo.
echo ========================================
echo   Starting MySQL Manually
echo ========================================
echo.
echo This will start MySQL in the foreground.
echo Keep this window open while using MySQL.
echo.
echo To stop MySQL, press Ctrl+C in this window.
echo.
echo Starting MySQL...
echo.

set "MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.0\bin"

REM Check if MySQL exists
if not exist "%MYSQL_BIN%\mysqld.exe" (
    echo ❌ MySQL not found at: %MYSQL_BIN%
    echo.
    echo Searching for MySQL in common locations...
    echo.
    
    REM Try alternative paths
    if exist "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysqld.exe" (
        set "MYSQL_BIN=C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin"
        echo ✅ Found MySQL at: %MYSQL_BIN%
    ) else (
        echo ❌ Could not find MySQL automatically.
        echo.
        echo Please find mysqld.exe manually and update the script.
        pause
        exit /b 1
    )
)

echo ✅ MySQL found at: %MYSQL_BIN%
echo.
echo Starting MySQL... (This window must stay open)
echo.
echo ✅ MySQL is running!
echo.
echo 📝 IMPORTANT:
echo    - Keep this window open
echo    - Open a NEW Command Prompt window
echo    - Go to D:\YATRA folder
echo    - Run create-database.bat in the new window
echo.
echo Press Ctrl+C to stop MySQL when done.
echo.

REM Change to MySQL directory and start
cd /d "%MYSQL_BIN%"
mysqld.exe --console

