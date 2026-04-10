# 🏋️ FitTrack - Complete Fitness Tracker Web Application

A modern, premium fitness tracking web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring a beautiful, responsive UI with advanced tracking capabilities.

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes
- Session management
- Form validation

### 📊 Dashboard
- Real-time fitness statistics
- Weekly progress charts
- Quick action cards
- Summary cards for workouts, calories, and water intake
- Responsive grid layout

### 💪 Workout Tracking
- Add detailed workout logs
- Track exercise type, duration, calories burned
- Monitor sets, reps, and weight
- Intensity levels (low, medium, high)
- Workout history with filtering
- Delete workouts

### 🍎 Calorie Tracking
- Log meals (breakfast, lunch, dinner, snacks)
- Track macronutrients (protein, carbs, fat)
- Daily calorie summary
- Meal-by-meal breakdown
- Entry management

### 💧 Water Intake Tracking
- Quick-add buttons (250ml, 500ml, 750ml)
- Custom amount logging
- Daily progress bar
- Visual progress indicator
- Intake history

### 📈 Progress & Analytics
- Weekly, monthly, yearly views
- Workout distribution charts
- Calorie distribution by meal
- Key insights and statistics
- Interactive charts with Chart.js

### 👤 Profile Management
- Edit personal information
- Track fitness goals
- View member statistics
- Profile image support
- Responsive form layout

## 🎨 UI/UX Design

### Design Features
- **Premium gradient theme** - Purple/blue gradient throughout
- **Modern card layouts** - Rounded corners, subtle shadows
- **Smooth animations** - Fade-in, slide-in effects
- **Responsive design** - Works on mobile, tablet, and desktop
- **Consistent typography** - Inter font family
- **Icon integration** - React Icons for visual consistency
- **Toast notifications** - User feedback on actions

### Color Palette
- Primary: `#667eea` to `#764ba2` (Purple gradient)
- Success: `#48bb78` (Green)
- Warning: `#ed8936` (Orange)
- Danger: `#e53e3e` (Red)
- Water: `#4facfe` to `#00f2fe` (Blue gradient)

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - UI library
- **React Router 6** - Client-side routing
- **Chart.js + react-chartjs-2** - Data visualization
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **Morgan** - HTTP logging
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
fitness-tracker/
├── client/                # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── .env              # Environment variables
│   └── package.json
├── server/                # Express Backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env
│   └── server.js
├── package.json           # Root scripts
└── README.md
```

## 🚀 Installation & Setup

### Quick Start (Local Development)

```bash
# Install all dependencies
npm run install-all

# Run both frontend & backend
npm run dev

# Access the app
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Manual Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

4. **Start MongoDB** (if running locally)
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

5. **Start backend server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
```bash
cd client
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Body: {
  "name": "string",
  "email": "string",
  "password": "string",
  "age": "number (optional)",
  "weight": "number (optional)",
  "height": "number (optional)",
  "gender": "string (optional)",
  "fitnessGoal": "string (optional)"
}
```

#### Login User
```
POST /api/auth/login
Body: {
  "email": "string",
  "password": "string"
}
```

#### Get Current User
```
GET /api/auth/me
Headers: { "Authorization": "Bearer <token>" }
```

### Workout Endpoints

#### Add Workout
```
POST /api/workouts
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "exerciseName": "string",
  "exerciseType": "cardio|strength|flexibility|sports|other",
  "duration": "number (minutes)",
  "caloriesBurned": "number (optional)",
  "sets": "number (optional)",
  "reps": "number (optional)",
  "weight": "number (optional)",
  "distance": "number (optional)",
  "intensity": "low|medium|high",
  "notes": "string (optional)"
}
```

#### Get All Workouts
```
GET /api/workouts?page=1&limit=20&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Headers: { "Authorization": "Bearer <token>" }
```

#### Get Workout Stats
```
GET /api/workouts/stats?period=week|month|year
Headers: { "Authorization": "Bearer <token>" }
```

#### Delete Workout
```
DELETE /api/workouts/:id
Headers: { "Authorization": "Bearer <token>" }
```

### Calorie Endpoints

#### Add Calorie Entry
```
POST /api/calories
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "meal": "breakfast|lunch|dinner|snack",
  "foodName": "string",
  "calories": "number",
  "protein": "number (optional)",
  "carbs": "number (optional)",
  "fat": "number (optional)"
}
```

#### Get Calorie Stats
```
GET /api/calories/stats?period=week|month|year
Headers: { "Authorization": "Bearer <token>" }
```

### Water Intake Endpoints

#### Add Water Entry
```
POST /api/water
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "amount": "number (ml)",
  "unit": "ml|oz (default: ml)",
  "notes": "string (optional)"
}
```

#### Get Water Stats
```
GET /api/water/stats?period=week|month|year
Headers: { "Authorization": "Bearer <token>" }
```

### Profile Endpoints

#### Get Profile
```
GET /api/profile
Headers: { "Authorization": "Bearer <token>" }
```

#### Update Profile
```
PUT /api/profile
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "name": "string",
  "age": "number",
  "weight": "number",
  "height": "number",
  "gender": "male|female|other",
  "fitnessGoal": "weight_loss|muscle_gain|endurance|general_fitness"
}
```

## 🎯 Key Features Implementation

### Image Integration
The application is designed to support image integration in multiple areas:

1. **Profile Pictures**: Users can add profile images (URL-based)
2. **Exercise Images**: Workout cards support exercise images
3. **Hero Sections**: Dashboard features gradient backgrounds
4. **Card Backgrounds**: Visual consistency with gradients

To add custom images:
- Place images in `frontend/public/images/`
- Reference them as `/images/filename.jpg`
- Update profile image URLs in the database

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- Hamburger menu for mobile navigation
- Adaptive grid layouts
- Touch-friendly buttons

### Performance Optimizations
- Lazy loading for routes
- Efficient API calls with Promise.all
- Pagination for large datasets
- Optimized MongoDB queries with indexes
- React memoization where applicable

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication (30-day expiration)
- Protected API routes
- Input validation and sanitization
- Helmet.js security headers
- CORS configuration
- HTTP-only cookies support

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Windows
net start MongoDB

# Verify connection string in .env
MONGODB_URI=mongodb://localhost:27017/fitness-tracker
```

### Port Already in Use
```bash
# Change PORT in backend/.env
PORT=5001

# Change frontend port in package.json scripts
"start": "PORT=3001 react-scripts start"
```

### CORS Errors
Ensure backend CORS is properly configured in `server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## 📝 Future Enhancements

- [ ] Image upload functionality
- [ ] Social features (friends, challenges)
- [ ] Workout plans & templates
- [ ] Nutrition database integration
- [ ] Push notifications
- [ ] Dark mode toggle
- [ ] Export data to CSV/PDF
- [ ] Advanced analytics with AI insights
- [ ] Mobile app (React Native)
- [ ] Wearable device integration

## 👨‍💻 Developer Notes

### Code Quality
- Modular folder structure
- Reusable components
- Consistent naming conventions
- Error handling on all API calls
- Loading states for async operations
- Form validation (frontend + backend)

### Best Practices
- Environment variables for sensitive data
- Async/await for async operations
- Proper HTTP status codes
- RESTful API design
- Component-based architecture
- State management with Context API

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- React.js community
- Chart.js documentation
- MongoDB team
- Express.js contributors
- All open-source library maintainers

---

**Built with ❤️ for fitness enthusiasts**

For support or questions, please open an issue or contact the development team.
