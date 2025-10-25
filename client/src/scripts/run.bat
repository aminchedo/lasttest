@echo off
REM فایل راه‌اندازی سیستم آموزش مدل فارسی برای Windows
REM Windows Server Batch Script

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║  سیستم آموزش مدل‌های فارسی                                ║
echo ║  Farsi Model Training System                             ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ خطا: Node.js نصب نشده است
    echo ❌ Error: Node.js is not installed
    echo.
    echo لطفاً Node.js را از https://nodejs.org نصب کنید
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Node.js دوجود دارد
echo ✓ Node.js is available
node --version
echo.

REM Check if npm dependencies are installed
if not exist "node_modules" (
    echo ⏳ نصب وابستگی‌ها...
    echo ⏳ Installing dependencies...
    echo.
    call npm install
    if errorlevel 1 (
        echo ❌ خطا در نصب وابستگی‌ها
        echo ❌ Error installing dependencies
        pause
        exit /b 1
    )
)

echo ✓ وابستگی‌ها آماده هستند
echo ✓ Dependencies ready
echo.

REM Check for development or production mode
if "%1"=="dev" (
    echo 🚀 شروع حالت توسعه...
    echo 🚀 Starting development mode...
    echo.
    call npm run dev
) else (
    echo 🚀 شروع حالت تولید...
    echo 🚀 Starting production mode...
    echo.
    call npm start
)

if errorlevel 1 (
    echo.
    echo ❌ خطا در شروع سرور
    echo ❌ Error starting server
    pause
    exit /b 1
)

endlocal
