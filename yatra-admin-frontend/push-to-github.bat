@echo off
echo ========================================
echo Pushing Admin Frontend to GitHub
echo ========================================
echo.
echo Step 1: Create a new repository on GitHub
echo Go to: https://github.com/new
echo Name it: Yatra-Admin
echo Don't initialize with README
echo.
pause
echo.
echo Step 2: Adding remote and pushing...
cd /d "%~dp0"
git remote add origin https://github.com/Kalpit12/Yatra-Admin.git
git branch -M main
git push -u origin main
echo.
echo Done! Check your GitHub repository.
pause

