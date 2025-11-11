@echo off
echo ========================================
echo FRESH GITHUB PAGES DEPLOYMENT
echo ========================================
echo.

cd /d "C:\Users\bryan_57mqris\OneDrive\Documents\Claude_Content\local-services"

echo Step 1: Removing old git repository...
rmdir /s /q .git 2>nul

echo Step 2: Initializing fresh git repo...
"C:\Program Files\Git\bin\git.exe" init

echo Step 3: Configuring git...
"C:\Program Files\Git\bin\git.exe" config user.name "Bryan"
"C:\Program Files\Git\bin\git.exe" config user.email "bryan@sendclickconvert.com"

echo Step 4: Adding all files...
"C:\Program Files\Git\bin\git.exe" add -A

echo Step 5: Creating commit...
"C:\Program Files\Git\bin\git.exe" commit -m "Initial commit: Professional gutter cleaning SEO landing page"

echo Step 6: Setting branch to main...
"C:\Program Files\Git\bin\git.exe" branch -M main

echo.
echo ========================================
echo NEXT STEPS - DO THESE MANUALLY:
echo ========================================
echo.
echo 1. GO TO: https://github.com/new
echo    - Repository name: local-services
echo    - Visibility: PUBLIC (very important!)
echo    - DO NOT check "Add a README file"
echo    - Click "Create repository"
echo.
echo 2. THEN RUN THESE COMMANDS:
echo    cd "C:\Users\bryan_57mqris\OneDrive\Documents\Claude_Content\local-services"
echo    git remote add origin https://github.com/sendclickllc/local-services.git
echo    git push -u origin main
echo.
echo 3. FINALLY ENABLE GITHUB PAGES:
echo    https://github.com/sendclickllc/local-services/settings/pages
echo    - Source: Deploy from a branch
echo    - Branch: main
echo    - Click Save
echo.
echo ========================================
pause
