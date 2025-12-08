@echo off
REM Create Database - Using User Data Directory

echo.
echo ========================================
echo   Creating Yatra Database
echo ========================================
echo.

set "MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
set "SCHEMA_PATH=%~dp0database\schema.sql"

if not exist "%SCHEMA_PATH%" (
    echo ERROR: Schema file not found: %SCHEMA_PATH%
    pause
    exit /b 1
)

echo Reading schema file: %SCHEMA_PATH%
echo.

set /p MYSQL_PASSWORD="Enter MySQL root password (press Enter if no password): "

echo.
echo Creating database and tables...
echo.

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
) else (
    echo.
    echo ========================================
    echo   Error creating database!
    echo ========================================
    echo.
    echo Make sure MySQL is running!
    echo Run start-mysql-user.bat first.
    echo.
)

pause

