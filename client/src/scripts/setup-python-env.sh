#!/bin/bash

# Python Environment Setup Script for Farsi Model Trainer
echo "🐍 Setting up Python environment for Farsi Model Trainer..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo "✅ Python version: $PYTHON_VERSION"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv .venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source .venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "📚 Installing Python packages..."
pip install -r requirements.txt

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p artifacts
mkdir -p data/datasets
mkdir -p data/models
mkdir -p data/training

# Set environment variables
echo "🔐 Setting up environment variables..."
if [ ! -f .env ]; then
    cat > .env << EOL
# HuggingFace Token (required)
HF_TOKEN=your_huggingface_token_here

# Python Path
PYTHON_PATH=.venv/bin/python

# Database Path
DB_PATH=./data/app.db

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Origins
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
EOL
    echo "📝 Created .env file. Please update HF_TOKEN with your HuggingFace token."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Python environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Update HF_TOKEN in .env file with your HuggingFace token"
echo "2. Activate the virtual environment: source .venv/bin/activate"
echo "3. Start the server: npm start"
echo ""
echo "To activate the environment manually:"
echo "  source .venv/bin/activate"
echo ""
echo "To deactivate:"
echo "  deactivate"
