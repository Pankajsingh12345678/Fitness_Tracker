# 🚀 Local Setup Guide - FitTrack Fitness Tracker

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for version control)

## Quick Start (Recommended)

### 1️⃣ Install All Dependencies

```bash
npm run install-all
```

This command will install dependencies for:
- Root project (concurrently)
- Client (React frontend)
- Server (Express backend)

### 2️⃣ Start MongoDB

**Windows:**
```bash
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 3️⃣ Run the Application

```bash
npm run dev
```

This will start both the frontend and backend simultaneously:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

The application will automatically open in your default browser.

## Manual Setup

If you prefer to run frontend and backend separately:

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup (in a new terminal)

```bash
cd client
npm install
npm start
```

## Environment Configuration

### Server (.env)

The server `.env` file is already configured with default values:

```env
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
PORT=5000
JWT_SECRET=fitness_tracker_secret_key_2024
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Client (.env)

The client `.env` file is already configured:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## First Time Usage

1. **Register a new account** at http://localhost:3000/register
2. **Login** with your credentials
3. **Explore the dashboard**
4. **Add your first workout**
5. **Track calories and water intake**
6. **View your progress**

## Available Scripts

### Root Level

```bash
npm run install-all    # Install all dependencies
npm run dev            # Run both frontend & backend
npm run dev:server     # Run backend only
npm run dev:client     # Run frontend only
npm run build          # Build frontend for production
npm start              # Run backend in production mode
```

### Client Level

```bash
npm start              # Start development server
npm run build          # Build for production
npm test               # Run tests
```

### Server Level

```bash
npm run dev            # Start with nodemon (auto-reload)
npm start              # Start in production mode
```

## Troubleshooting

### MongoDB Connection Error

**Problem:** Cannot connect to MongoDB

**Solution:**
```bash
# Check if MongoDB is running
# Windows
net start MongoDB

# macOS
brew services list

# Test connection
mongosh
```

### Port Already in Use

**Problem:** Port 3000 or 5000 is already in use

**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

Or change the port in `server/.env`:
```env
PORT=5001
```

### npm Install Fails

**Problem:** Dependency installation fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### CORS Error

**Problem:** CORS errors in browser console

**Solution:**
- Ensure backend is running on port 5000
- Check that `FRONTEND_URL` in `server/.env` is set to `http://localhost:3000`
- Verify client is making requests to `http://localhost:5000/api`

## Project Structure

```
fitness-tracker/
├── client/                # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   └── utils/         # API utilities
│   ├── .env              # Environment variables
│   └── package.json
├── server/                # Express Backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── .env             # Environment variables
│   └── server.js
├── package.json          # Root scripts
└── README.md
```

## Features

- ✅ **User Authentication** - Register, login, JWT tokens
- ✅ **Workout Tracking** - Log exercises, track progress
- ✅ **Calorie Tracking** - Monitor daily food intake
- ✅ **Water Intake** - Track hydration levels
- ✅ **Progress Analytics** - Charts and statistics
- ✅ **Profile Management** - Update user information
- ✅ **Responsive Design** - Works on all devices

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Workouts
- `POST /api/workouts` - Add workout
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/stats` - Get workout statistics
- `DELETE /api/workouts/:id` - Delete workout

### Calories
- `POST /api/calories` - Add calorie entry
- `GET /api/calories` - Get all entries
- `GET /api/calories/stats` - Get calorie statistics

### Water Intake
- `POST /api/water` - Add water entry
- `GET /api/water` - Get all entries
- `GET /api/water/stats` - Get water statistics

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `DELETE /api/profile` - Delete profile

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
- Explore [ARCHITECTURE.md](ARCHITECTURE.md) for system architecture
- Customize features to your needs

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review browser console for frontend errors
3. Check terminal for backend errors
4. Verify MongoDB is running properly
5. Ensure all dependencies are installed

---

**Happy Tracking! 🏋️💪**
