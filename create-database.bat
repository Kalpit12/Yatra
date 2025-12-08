@echo off
REM Batch Script to Create Yatra Database
REM This script will create the database using MySQL

echo.
echo ========================================
echo   Creating Yatra Database
echo ========================================
echo.

REM MySQL path
set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
set SCHEMA_PATH=%~dp0database\schema.sql

REM Check if schema file exists
if not exist "%SCHEMA_PATH%" (
    echo ERROR: Schema file not found: %SCHEMA_PATH%
    pause
    exit /b 1
)

echo Reading schema file: %SCHEMA_PATH%
echo.

REM Prompt for MySQL password
set /p MYSQL_PASSWORD="Enter MySQL root password (press Enter if no password): "

echo.
echo Creating database and tables...
echo.

REM Execute MySQL command
if "%MYSQL_PASSWORD%"=="" (
    "%MYSQL_PATH%" -u root < "%SCHEMA_PATH%"
) else (
    "%MYSQL_PATH%" -u root -p%MYSQL_PASSWORD% < "%SCHEMA_PATH%"
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Database created successfully!
    echo ========================================
    echo.
    echo Next steps:
    echo   1. Create .env file with your MySQL credentials
    echo   2. Run: npm install
    echo   3. Run: npm start
    echo.
) else (
    echo.
    echo ========================================
    echo   Error creating database!
    echo ========================================
    echo.
    echo Troubleshooting:
    echo   - Make sure MySQL server is running
    echo   - Verify your MySQL root password
    echo   - Check MySQL service in Services
    echo.
)

pause

