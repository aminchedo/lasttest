#!/bin/bash

# فایل راه‌اندازی سیستم آموزش مدل فارسی برای Linux و macOS
# Farsi Model Training System Launcher for Linux and macOS

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║  سیستم آموزش مدل‌های فارسی                                ║"
echo "║  Farsi Model Training System                             ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ خطا: Node.js نصب نشده است"
    echo "❌ Error: Node.js is not installed"
    echo ""
    echo "لطفاً Node.js را از https://nodejs.org نصب کنید"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js دوجود دارد"
echo "✓ Node.js is available"
node --version
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ خطا: npm نصب نشده است"
    echo "❌ Error: npm is not installed"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "⏳ نصب وابستگی‌ها..."
    echo "⏳ Installing dependencies..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ خطا در نصب وابستگی‌ها"
        echo "❌ Error installing dependencies"
        exit 1
    fi
fi

echo "✓ وابستگی‌ها آماده هستند"
echo "✓ Dependencies ready"
echo ""

# Determine mode (dev or production)
if [ "$1" = "dev" ]; then
    echo "🚀 شروع حالت توسعه..."
    echo "🚀 Starting development mode..."
    echo ""
    npm run dev
else
    echo "🚀 شروع حالت تولید..."
    echo "🚀 Starting production mode..."
    echo ""
    npm start
fi

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ خطا در شروع سرور"
    echo "❌ Error starting server"
    exit 1
fi
