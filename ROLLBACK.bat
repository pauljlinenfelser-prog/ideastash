@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
echo ===== IdeaStash rollback =====
echo Saved versions:
for /d %%V in (versions\*) do echo    %%~nxV
echo.
set /p VER=Type the version to restore (e.g. v1): 
if not exist "versions\%VER%\index.html" (echo That version doesn't exist. & pause & exit /b 1)
for %%F in (app\*) do if /i not "%%~nxF"==".git" del /q "%%F"
xcopy /y /q "versions\%VER%\*" "app\" >nul
echo Restored %VER% into the app folder.
echo Run DEPLOY.bat to push it to your phone link.
pause
