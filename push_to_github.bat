@echo off
echo ========================================
echo  Pushing Niteways to GitHub
echo ========================================
echo.

cd /d "c:\Users\harsh\cmsi-5350\project\night_club-main\night_club-main"

echo Step 1: Initializing git repository...
git init

echo.
echo Step 2: Adding all files...
git add .

echo.
echo Step 3: Creating commit...
git commit -m "Initial commit - Niteways Platform POC with React Native mobile app, NestJS backend, and React admin dashboard"

echo.
echo Step 4: Setting main branch...
git branch -M main

echo.
echo Step 5: Adding remote origin...
git remote add origin https://github.com/Harshranpura/Niteways.git

echo.
echo Step 6: Pushing to GitHub...
echo This may ask for your GitHub credentials...
git push -u origin main

echo.
echo ========================================
echo  Done! Check https://github.com/Harshranpura/Niteways
echo ========================================
echo.
pause
