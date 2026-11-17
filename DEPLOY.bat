@echo off
setlocal
REM Publishes this project to GitHub Pages (free). Safe to run again any time - it picks up where it left off.
cd /d "%~dp0"
where git >nul 2>nul || (echo Git not found. & pause & exit /b 1)
where gh >nul 2>nul || (echo GitHub CLI "gh" not found. & pause & exit /b 1)

for /f %%U in ('gh api user -q .login') do set GHUSER=%%U
for /f %%I in ('gh api user -q .id') do set GHID=%%I
if "%GHUSER%"=="" (echo Not signed in to GitHub. Run:  gh auth login & pause & exit /b 1)
echo Signed in to GitHub as: %GHUSER%
echo (If that's not pauljlinenfelser-prog, close this window and run:  gh auth switch)
pause
gh auth setup-git >nul 2>nul

if not exist ".git" git init -b main

REM Git needs a name/email to save a commit - use your GitHub identity if none is set
git config user.name >nul 2>nul || git config user.name "%GHUSER%"
git config user.email >nul 2>nul || git config user.email "%GHID%+%GHUSER%@users.noreply.github.com"

git add -A
git commit -q -m "IdeaStash update" >nul 2>nul
git rev-parse --verify HEAD >nul 2>nul || (echo. & echo Could not save a commit. Screenshot this window for Claude. & git commit -m "IdeaStash update" & pause & exit /b 1)

git remote get-url origin >nul 2>nul && goto push
gh repo view %GHUSER%/ideastash >nul 2>nul && goto addremote
echo Creating the ideastash repository on GitHub...
gh repo create ideastash --public --source . --remote origin || (echo Repo creation failed. Screenshot this window for Claude. & pause & exit /b 1)
goto push
:addremote
git remote add origin https://github.com/%GHUSER%/ideastash.git

:push
git push -u origin main || (echo Push failed. Screenshot this window for Claude. & pause & exit /b 1)

gh api repos/%GHUSER%/ideastash/pages >nul 2>nul && goto done
echo Turning on GitHub Pages...
gh api -X POST repos/%GHUSER%/ideastash/pages -f "source[branch]=main" -f "source[path]=/" >nul || (echo Could not turn on Pages. Screenshot this window for Claude. & pause & exit /b 1)

:done
echo.
echo ============================================================
echo  Done. Your phone link (live within 1-2 minutes):
echo    https://%GHUSER%.github.io/ideastash/
echo ============================================================
pause
