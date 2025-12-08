@echo off
REM Start MySQL with User Data Directory

echo.
echo ========================================
echo   Starting MySQL (User Data Directory)
echo ========================================
echo.

set "MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.0\bin"
set "MYSQL_DATA=%USERPROFILE%\MySQLData"

echo Starting MySQL...
echo Data directory: %MYSQL_DATA%
echo.
echo Keep this window open!
echo.

cd /d "%MYSQL_BIN%"
mysqld.exe --datadir="%MYSQL_DATA%" --console

