@echo off
REM Script to add missing fields to hotels table

echo.
echo ========================================
echo   Adding Hotel Fields to Database
echo ========================================
echo.

REM Try to find MySQL executable
set "MYSQL_BIN="

REM First, try the path from create-database.bat (most likely to work)
set "MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if exist "%MYSQL_PATH%" (
    set "MYSQL_BIN=%MYSQL_PATH%"
)

REM If not found, check other common paths
if "%MYSQL_BIN%"=="" (
    if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
        set "MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
    ) else if exist "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe" (
        set "MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe"
    ) else if exist "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe" (
        set "MYSQL_BIN=C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe"
    ) else if exist "C:\xampp\mysql\bin\mysql.exe" (
        set "MYSQL_BIN=C:\xampp\mysql\bin\mysql.exe"
    ) else if exist "C:\wamp64\bin\mysql" (
        REM Try to find latest MySQL in WAMP
        for /d %%i in ("C:\wamp64\bin\mysql\mysql*") do (
            if exist "%%i\bin\mysql.exe" set "MYSQL_BIN=%%i\bin\mysql.exe"
        )
    )
)

REM If still not found, try PATH
if "%MYSQL_BIN%"=="" (
    where mysql >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        set "MYSQL_BIN=mysql"
    )
)

if "%MYSQL_BIN%"=="" (
    echo ❌ MySQL executable not found!
    echo.
    echo Please either:
    echo   1. Add MySQL to your PATH, OR
    echo   2. Edit this script and set MYSQL_BIN to your MySQL path
    echo.
    echo Common paths:
    echo   C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
    echo   C:\xampp\mysql\bin\mysql.exe
    echo.
    pause
    exit /b 1
)

echo Found MySQL at: %MYSQL_BIN%
echo.

REM Get MySQL credentials
set /p MYSQL_USER="Enter MySQL username (default: root): "
if "%MYSQL_USER%"=="" set MYSQL_USER=root

echo.
set /p HAS_PASSWORD="Do you have a MySQL password? (y/n, default: n): "
if /i "%HAS_PASSWORD%"=="y" (
    echo Enter MySQL password when prompted...
    echo.
    REM Run the SQL script with password prompt
    "%MYSQL_BIN%" -u %MYSQL_USER% -p yatra_db < database\add-hotel-fields.sql
) else (
    echo Running without password...
    echo.
    REM Run the SQL script without password
    "%MYSQL_BIN%" -u %MYSQL_USER% yatra_db < database\add-hotel-fields.sql
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Hotel fields added successfully!
    echo.
    echo The hotels table now has: total_floors, total_rooms, check_in_date, check_out_date, notes
    echo.
) else (
    echo.
    echo ❌ Error running the script.
    echo.
    echo Please check:
    echo   1. MySQL is running
    echo   2. Username and password are correct
    echo   3. Database 'yatra_db' exists
    echo.
)

pause

