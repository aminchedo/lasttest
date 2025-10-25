@echo off
REM start-real-backend.bat - Start Real ML Backend Server (Windows)
echo 🚀 Starting Persian ML Real Backend Server...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 3 is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Install Node.js dependencies
echo 📦 Installing Node.js dependencies...
npm install

REM Install Python dependencies
echo 🐍 Installing Python ML dependencies...
pip install -r requirements.txt

REM Setup database
echo 🗄️  Setting up real ML database...
node setup-database.js

REM Start the backend server
echo 🚀 Starting real backend server...
echo 📊 Backend will be available at: http://localhost:3001
echo 🔍 Health check: http://localhost:3001/api/health
echo 🤖 ML System: Ready for real training and analysis
echo.
echo Press Ctrl+C to stop the server

REM Start the server
node real-backend.js

pause
