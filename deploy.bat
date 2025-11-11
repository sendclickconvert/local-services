@echo off
echo ========================================
echo DEPLOY LOCAL-SERVICES TO GITHUB
echo ========================================
echo.

IF "%1"=="" (
    echo ERROR: Please provide your GitHub username
    echo Usage: deploy.bat YOUR_GITHUB_USERNAME
    echo.
    echo Example: deploy.bat sendclickllc
    exit /b 1
)

set GITHUB_USER=%1

echo Step 1: First, create the repository on GitHub:
echo    Go to: https://github.com/new
echo    Repository name: local-services
echo    Make it PUBLIC
echo    DO NOT initialize with README
echo.
echo Press any key when you've created the repository...
pause >nul

echo.
echo Step 2: Adding remote origin...
git remote add origin https://github.com/%GITHUB_USER%/local-services.git

echo.
echo Step 3: Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your repository: https://github.com/%GITHUB_USER%/local-services
echo.
echo NEXT: Enable GitHub Pages:
echo 1. Go to: https://github.com/%GITHUB_USER%/local-services/settings/pages
echo 2. Source: Deploy from branch 'main'
echo 3. Click Save
echo.
echo Your site will be live at:
echo https://%GITHUB_USER%.github.io/local-services/
echo.
pause
