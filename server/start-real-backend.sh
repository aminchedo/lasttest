#!/bin/bash

# start-real-backend.sh - Start Real ML Backend Server
echo "🚀 Starting Persian ML Real Backend Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Install Python dependencies
echo "🐍 Installing Python ML dependencies..."
pip3 install -r requirements.txt

# Setup database
echo "🗄️  Setting up real ML database..."
node setup-database.js

# Start the backend server
echo "🚀 Starting real backend server..."
echo "📊 Backend will be available at: http://localhost:3001"
echo "🔍 Health check: http://localhost:3001/api/health"
echo "🤖 ML System: Ready for real training and analysis"
echo ""
echo "Press Ctrl+C to stop the server"

# Start the server
node real-backend.js
