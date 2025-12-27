@echo off
echo Cleaning up temporary files...
cd /d "c:\Users\harsh\cmsi-5350\project\night_club-main\night_club-main"

git add -A
git commit -m "Clean up temporary setup files"
git push origin main

echo Done!
pause
