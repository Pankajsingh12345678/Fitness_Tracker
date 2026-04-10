# 🚀 Quick Start Guide - FitTrack

Get your fitness tracker up and running in under 5 minutes!

## Prerequisites Checklist

- [ ] Node.js installed (v14+)
- [ ] MongoDB installed and running
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

## Step-by-Step Setup

### 1️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

### 2️⃣ Configure Environment Variables

The `.env` file is already configured with default values. Update if needed:

```env
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
PORT=5000
JWT_SECRET=fitness_tracker_secret_key_2024
NODE_ENV=development
```

### 3️⃣ Start MongoDB

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

### 4️⃣ Start Backend Server

```bash
# In backend directory
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
🌍 Environment: development
```

### 5️⃣ Install Frontend Dependencies

Open a **new terminal** window:

```bash
cd frontend
npm install
```

### 6️⃣ Start Frontend Application

```bash
# In frontend directory
npm start
```

The app will automatically open in your browser at:
```
http://localhost:3000
```

## 🎉 You're Ready!

### First Steps

1. **Register a new account** at `/register`
2. **Login** with your credentials
3. **Explore the dashboard**
4. **Add your first workout**
5. **Track your calories and water intake**
6. **View your progress**

## 📱 App Navigation

### Main Features

- **Dashboard** - Overview of your fitness stats
- **Workouts** - Log and view exercise sessions
- **Calories** - Track daily food intake
- **Water** - Monitor hydration levels
- **Progress** - View analytics and charts
- **Profile** - Manage your account settings

## 🔧 Common Issues & Solutions

### Issue: MongoDB Connection Error

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

### Issue: Port Already in Use

**Solution:**
```bash
# Change port in backend/.env
PORT=5001

# Or kill process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: npm Install Fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: CORS Error

**Solution:**
- Ensure backend is running on port 5000
- Check that frontend is making requests to correct URL
- Backend CORS is already configured for localhost:3000

## 🎨 Customization Tips

### Change Theme Colors

Edit `frontend/src/index.css`:
```css
body {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

### Update API Base URL

Edit `frontend/src/utils/api.js`:
```javascript
const API_URL = 'http://localhost:YOUR_PORT/api';
```

### Modify Default Values

- Water daily goal: `frontend/src/pages/WaterIntake.js` (line 73)
- Pagination limits: Backend route files
- JWT expiration: `backend/routes/auth.js` (line 10)

## 📊 Testing the Application

### Create Sample Data

1. Register with test account
2. Add 3-5 workouts of different types
3. Log several calorie entries for different meals
4. Track water intake throughout the day
5. View statistics on Progress page

### Test All Features

- ✅ User registration and login
- ✅ Add/edit/delete workouts
- ✅ Track calories with macros
- ✅ Quick-add water intake
- ✅ View progress charts
- ✅ Update profile information
- ✅ Responsive design on mobile

## 🚀 Production Deployment

### Backend (Heroku/Railway)

1. Set environment variables on platform
2. Use MongoDB Atlas for database
3. Deploy backend code
4. Update frontend API URL

### Frontend

1. Build the app: `npm run build`
2. Deploy the build folder to your hosting platform
3. Set environment variables if needed

## 📚 Next Steps

- Read full documentation in `README.md`
- Check `API_DOCUMENTATION.md` for API details
- Explore the code structure
- Customize features to your needs
- Add new exercises and features

## 💡 Pro Tips

1. **Use Postman** to test API endpoints directly
2. **MongoDB Compass** for visual database browsing
3. **React DevTools** for debugging frontend
4. **Nodemon** auto-restarts backend on changes
5. **Hot Reload** updates frontend instantly

## 🆘 Need Help?

- Check `README.md` for detailed documentation
- Review `API_DOCUMENTATION.md` for API reference
- Inspect browser console for frontend errors
- Check terminal for backend errors
- Verify MongoDB is running properly

---

**Happy Tracking! 🏋️💪**
