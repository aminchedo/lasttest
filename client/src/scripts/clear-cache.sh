#!/bin/bash

# Clear React/Vite Cache Script
echo "🧹 Clearing React/Vite cache and restarting development server..."

# Stop any running processes
echo "🛑 Stopping running processes..."
pkill -f "vite\|node.*dev\|npm.*dev" 2>/dev/null || true

# Clear various caches
echo "🗑️ Clearing caches..."

# Clear Vite cache
if [ -d "node_modules/.vite" ]; then
    rm -rf node_modules/.vite
    echo "✅ Cleared Vite cache"
fi

# Clear ESLint cache
if [ -f ".eslintcache" ]; then
    rm -f .eslintcache
    echo "✅ Cleared ESLint cache"
fi

# Clear npm cache
npm cache clean --force 2>/dev/null || true
echo "✅ Cleared npm cache"

# Clear browser cache instructions
echo "🌐 Please clear your browser cache:"
echo "   - Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)"
echo "   - Or open DevTools > Application > Storage > Clear site data"

# Reinstall dependencies (optional)
read -p "🔄 Reinstall dependencies? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Reinstalling dependencies..."
    rm -rf node_modules package-lock.json
    npm install
    echo "✅ Dependencies reinstalled"
fi

# Start development server
echo "🚀 Starting development server..."
npm run dev
