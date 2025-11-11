@echo off
cd /d "C:\Users\bryan_57mqris\OneDrive\Documents\Claude_Content\local-services"

echo Adding all files...
"C:\Program Files\Git\bin\git.exe" add -A

echo Committing...
"C:\Program Files\Git\bin\git.exe" commit -m "Deploy: Gutter cleaning landing page with test file"

echo Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push -f origin main

echo.
echo Done! Check https://sendclickllc.github.io/local-services/
echo Test page: https://sendclickllc.github.io/local-services/test.html
pause
