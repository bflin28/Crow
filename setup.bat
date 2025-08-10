@echo off
echo 🚀 Crow Project Setup Script
echo.

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js from nodejs.org first
    pause
    exit /b 1
)

echo ✅ Node.js found!
echo.

echo 📦 Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependencies failed to install
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed!
echo.

echo 📦 Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Backend dependencies failed to install
    pause
    exit /b 1
)
cd ..

echo ✅ Backend dependencies installed!
echo.

echo 🎉 Setup complete! 
echo.
echo Next steps:
echo 1. Get Plaid API keys from dashboard.plaid.com
echo 2. Create backend/.env with your keys
echo 3. Run: npm run dev (frontend)
echo 4. Run: cd backend && npm start (backend)
echo.
pause
