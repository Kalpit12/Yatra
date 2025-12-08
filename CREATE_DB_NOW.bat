@echo off
REM Simple Database Creation Script

cd /d "%~dp0"

echo.
echo ========================================
echo   Creating Yatra Database
echo ========================================
echo.

set "MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
set "SCHEMA_PATH=%~dp0database\schema.sql"

echo Current directory: %CD%
echo.

if not exist "%SCHEMA_PATH%" (
    echo ERROR: Schema file not found!
    echo Looking for: %SCHEMA_PATH%
    echo.
    pause
    exit /b 1
)

echo Schema file found: %SCHEMA_PATH%
echo.
echo Enter MySQL root password (press Enter if no password):
set /p MYSQL_PASSWORD=

echo.
echo Creating database and tables...
echo This may take a minute...
echo.

if "%MYSQL_PASSWORD%"=="" (
    "%MYSQL_PATH%" -u root < "%SCHEMA_PATH%"
) else (
    "%MYSQL_PATH%" -u root -p%MYSQL_PASSWORD% < "%SCHEMA_PATH%"
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ Database created successfully!
    echo ========================================
    echo.
    echo Database: yatra_db
    echo All tables created!
    echo Default data inserted!
    echo.
) else (
    echo.
    echo ========================================
    echo   ❌ Error creating database!
    echo ========================================
    echo.
    echo Troubleshooting:
    echo   1. Make sure MySQL is running (start-mysql-user.bat)
    echo   2. Check your password
    echo   3. Make sure you're in D:\YATRA folder
    echo.
)

pause

