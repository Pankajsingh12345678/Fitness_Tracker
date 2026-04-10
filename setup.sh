#!/bin/bash

echo "============================================"
echo "  FitTrack - Fitness Tracker Setup"
echo "============================================"
echo ""

echo "[1/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js found: $(node --version)"
echo ""

echo "[2/5] Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed!"
    exit 1
fi
echo "✓ npm found: v$(npm --version)"
echo ""

echo "[3/5] Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies!"
    exit 1
fi
cd ..
echo "✓ Backend dependencies installed"
echo ""

echo "[4/5] Installing Frontend Dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies!"
    exit 1
fi
cd ..
echo "✓ Frontend dependencies installed"
echo ""

echo "[5/5] Setup Complete!"
echo ""
echo "============================================"
echo "  Next Steps:"
echo "============================================"
echo ""
echo "1. Make sure MongoDB is running:"
echo "   sudo systemctl start mongod  (Linux)"
echo "   brew services start mongodb-community  (macOS)"
echo ""
echo "2. Start Backend Server (in one terminal):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. Start Frontend App (in another terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "4. Open your browser to:"
echo "   http://localhost:3000"
echo ""
echo "============================================"
echo "  For detailed instructions, see:"
echo "  - QUICKSTART.md"
echo "  - README.md"
echo "============================================"
echo ""
