@echo off
chcp 65001 >nul
cls

echo ======================================
echo 🚀 نصب پلتفرم آموزش مدل فارسی
echo ======================================
echo.

REM Check Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js یافت نشد. لطفاً Node.js v18+ را نصب کنید
    echo دانلود از: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node.js نصب است: %NODE_VERSION%
echo.

REM Install dependencies
echo 📦 نصب وابستگی‌ها...
echo ------------------------

echo نصب وابستگی‌های سرور...
call npm install
if %errorlevel% neq 0 (
    echo ❌ خطا در نصب وابستگی‌های سرور
    pause
    exit /b 1
)

echo نصب وابستگی‌های کلاینت...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ❌ خطا در نصب وابستگی‌های کلاینت
    cd ..
    pause
    exit /b 1
)
cd ..

REM Create necessary directories
echo.
echo 📁 ایجاد پوشه‌های مورد نیاز...
echo ------------------------
if not exist "data\models" mkdir "data\models"
if not exist "data\datasets" mkdir "data\datasets"
if not exist "data\training" mkdir "data\training"
if not exist "data\storage" mkdir "data\storage"
if not exist "logs" mkdir "logs"

REM Create .env file if not exists
if not exist ".env" (
    echo.
    echo ⚙️ ایجاد فایل تنظیمات...
    echo ------------------------
    copy ".env.example" ".env" >nul
    echo ✓ فایل .env ایجاد شد
)

REM Success message
echo.
echo ======================================
echo ✅ نصب با موفقیت انجام شد!
echo ======================================
echo.
echo 🎯 برای شروع:
echo ------------------------
echo 1. حالت Development:
echo    npm run dev
echo.
echo 2. حالت Production:
echo    npm run build
echo    npm start
echo.
echo 📍 آدرس‌ها:
echo ------------------------
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3000
echo API Docs: http://localhost:3000/api/health
echo.
echo موفق باشید! 🌟
echo.
pause