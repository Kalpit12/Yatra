@echo off
REM Script to Start MySQL Service

echo.
echo ========================================
echo   Starting MySQL Service
echo ========================================
echo.

REM Try common MySQL service names
echo Attempting to start MySQL service...
echo.

REM Try MySQL80 (most common for MySQL 8.0)
net start MySQL80 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ MySQL80 service started successfully!
    goto :success
)

REM Try MySQL
net start MySQL 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ MySQL service started successfully!
    goto :success
)

REM Try MySQL80 with different case
sc start MySQL80 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ MySQL80 service started successfully!
    goto :success
)

REM If all fail, show available services
echo ❌ Could not start MySQL service automatically.
echo.
echo Please start MySQL service manually:
echo.
echo Option 1: Using Services (GUI)
echo   1. Press Win+R, type: services.msc
echo   2. Find "MySQL80" or "MySQL"
echo   3. Right-click → Start
echo.
echo Option 2: Using Command (Run as Administrator)
echo   net start MySQL80
echo   OR
echo   net start MySQL
echo.
echo Option 3: Using MySQL Workbench
echo   1. Open MySQL Workbench
echo   2. It will prompt to start service if needed
echo.
goto :end

:success
echo.
echo ✅ MySQL is now running!
echo.
echo You can now run create-database.bat to create the database.
echo.

:end
pause

