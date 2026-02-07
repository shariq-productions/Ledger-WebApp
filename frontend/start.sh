#!/bin/bash

# Frontend startup script for macOS/Linux

echo "🚀 Starting Ledger WebApp Frontend..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
fi

# Start the development server
echo "✅ Starting Vite dev server..."
echo "🌐 Frontend will be available at http://localhost:5173"
echo ""
npm run dev
