#!/bin/bash

# Persian ML Platform - Quick Setup Script
# نصب سریع پلتفرم آموزش مدل فارسی

echo "======================================"
echo "🚀 نصب پلتفرم آموزش مدل فارسی"
echo "======================================"

# Check Node.js installation
if ! command -v node &> /dev/null
then
    echo "❌ Node.js یافت نشد. لطفاً Node.js v18+ را نصب کنید"
    echo "دانلود از: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js نصب است: $(node -v)"

# Install dependencies
echo ""
echo "📦 نصب وابستگی‌ها..."
echo "------------------------"

# Install server dependencies
echo "نصب وابستگی‌های سرور..."
npm install

# Install client dependencies
echo "نصب وابستگی‌های کلاینت..."
cd client
npm install
cd ..

# Create necessary directories
echo ""
echo "📁 ایجاد پوشه‌های مورد نیاز..."
echo "------------------------"
mkdir -p data/models
mkdir -p data/datasets
mkdir -p data/training
mkdir -p data/storage
mkdir -p logs

# Create .env file if not exists
if [ ! -f .env ]; then
    echo ""
    echo "⚙️ ایجاد فایل تنظیمات..."
    echo "------------------------"
    cp .env.example .env
    echo "✓ فایل .env ایجاد شد"
fi

# Success message
echo ""
echo "======================================"
echo "✅ نصب با موفقیت انجام شد!"
echo "======================================"
echo ""
echo "🎯 برای شروع:"
echo "------------------------"
echo "1. حالت Development:"
echo "   npm run dev"
echo ""
echo "2. حالت Production:"
echo "   npm run build"
echo "   npm start"
echo ""
echo "📍 آدرس‌ها:"
echo "------------------------"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3000"
echo "API Docs: http://localhost:3000/api/health"
echo ""
echo "موفق باشید! 🌟"