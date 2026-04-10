@echo off
echo ============================================
echo   FitTrack - Fitness Tracker Setup
echo ============================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found: 
node --version
echo.

echo [2/5] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)
echo ✓ npm found: v
npm --version
echo.

echo [3/5] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies!
    pause
    exit /b 1
)
cd ..
echo ✓ Backend dependencies installed
echo.

echo [4/5] Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies!
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend dependencies installed
echo.

echo [5/5] Setup Complete!
echo.
echo ============================================
echo   Next Steps:
echo ============================================
echo.
echo 1. Make sure MongoDB is running:
echo    net start MongoDB
echo.
echo 2. Start Backend Server (in one terminal):
echo    cd backend
echo    npm run dev
echo.
echo 3. Start Frontend App (in another terminal):
echo    cd frontend
echo    npm start
echo.
echo 4. Open your browser to:
echo    http://localhost:3000
echo.
echo ============================================
echo   For detailed instructions, see:
echo   - QUICKSTART.md
echo   - README.md
echo ============================================
echo.
pause
