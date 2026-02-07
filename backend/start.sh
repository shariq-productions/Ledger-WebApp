#!/bin/bash

# Backend startup script for macOS/Linux

echo "🚀 Starting Ledger WebApp Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "venv/.installed" ]; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt || { echo "❌ Failed to install dependencies"; exit 1; }
    touch venv/.installed
fi

# Check if database exists, if not, seed data
if [ ! -f "ledger.db" ]; then
    echo "🌱 Seeding initial data..."
    python seed_data.py
fi

# Start the server
echo "✅ Starting FastAPI server on http://localhost:8000"
echo "📚 API docs available at http://localhost:8000/docs"
echo ""
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
