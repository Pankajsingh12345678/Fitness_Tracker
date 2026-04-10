# 🏗️ FitTrack Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                        │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │           React.js Frontend (Port 3000)           │  │
│  │                                                    │  │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────────┐    │  │
│  │  │  Pages  │  │Components│  │   Context   │    │  │
│  │  │         │  │          │  │             │    │  │
│  │  │ Dashboard│  │ Navbar   │  │  AuthContext│    │  │
│  │  │ Workouts │  │ Forms    │  │             │    │  │
│  │  │ Calories │  │ Cards    │  │             │    │  │
│  │  │ Water    │  │ Charts   │  │             │    │  │
│  │  │ Progress │  │ Routes   │  │             │    │  │
│  │  │ Profile  │  │          │  │             │    │  │
│  │  └─────────┘  └──────────┘  └─────────────┘    │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────┐    │  │
│  │  │         Styling & Animations             │    │  │
│  │  │  - Gradient backgrounds                  │    │  │
│  │  │  - Card layouts                          │    │  │
│  │  │  - Responsive design                     │    │  │
│  │  │  - CSS animations                        │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↕ HTTP/JSON
┌─────────────────────────────────────────────────────────┐
│               SERVER (Node.js/Express - Port 5000)       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Middleware Layer                      │  │
│  │  - CORS                                          │  │
│  │  - Helmet (Security)                             │  │
│  │  - Morgan (Logging)                              │  │
│  │  - JSON Parser                                   │  │
│  │  - Auth (JWT Verification)                       │  │
│  │  - Error Handler                                 │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │               API Routes                           │  │
│  │                                                    │  │
│  │  /api/auth        → Authentication routes         │  │
│  │  /api/workouts    → Workout CRUD                  │  │
│  │  /api/calories    → Calorie tracking              │  │
│  │  /api/water       → Water intake                  │  │
│  │  /api/profile     → User profile                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Controllers & Business Logic           │  │
│  │  - Input validation                              │  │
│  │  - Data processing                               │  │
│  │  - Aggregation pipelines                         │  │
│  │  - Statistics calculation                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────┐
│                  MongoDB Database                        │
│                                                          │
│  ┌────────────┐  ┌──────────┐  ┌──────────┐           │
│  │   Users    │  │ Workouts │  │ Calories │           │
│  │            │  │          │  │          │           │
│  │ - auth     │  │ - logs   │  │ - meals  │           │
│  │ - profile  │  │ - stats  │  │ - macros │           │
│  └────────────┘  └──────────┘  └──────────┘           │
│                                                          │
│  ┌──────────────┐                                      │
│  │ WaterIntakes │                                      │
│  │              │                                      │
│  │ - entries    │                                      │
│  │ - daily sum  │                                      │
│  └──────────────┘                                      │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Registration Flow
```
User Input → Form Validation → POST /api/auth/register
  → Backend Validation → Password Hashing → Create User
  → Generate JWT → Return Token → Store in LocalStorage
  → Redirect to Dashboard
```

### 2. Add Workout Flow
```
User fills form → Form Validation → POST /api/workouts
  → JWT Verification → Validate Input → Create Workout
  → Save to MongoDB → Return Success → Update UI
  → Show Toast Notification
```

### 3. Dashboard Data Flow
```
Component Mount → useEffect Trigger → Parallel API Calls
  → GET /api/workouts/stats
  → GET /api/calories/stats
  → GET /api/water/stats
  → Combine Results → Update State → Render Charts & Cards
```

### 4. Authentication Flow
```
Login → POST /api/auth/login → Verify Credentials
  → Generate JWT → Return Token
  → Store in LocalStorage
  → Attach to all subsequent requests via Axios interceptor
  → Protected routes check token existence
```

## Component Hierarchy

```
App
├── Router
│   ├── AuthProvider (Context)
│   │   ├── Navbar
│   │   │   ├── Logo
│   │   │   ├── NavLinks
│   │   │   └── LogoutButton
│   │   │
│   │   ├── Routes
│   │   │   ├── Public Routes
│   │   │   │   ├── Login
│   │   │   │   └── Register
│   │   │   │
│   │   │   └── Private Routes (Auth Required)
│   │   │       ├── Dashboard
│   │   │       │   ├── StatCards
│   │   │       │   ├── ProgressChart
│   │   │       │   └── QuickActions
│   │   │       │
│   │   │       ├── Workouts
│   │   │       │   ├── WorkoutList
│   │   │       │   └── WorkoutCard
│   │   │       │
│   │   │       ├── AddWorkout
│   │   │       │   └── WorkoutForm
│   │   │       │
│   │   │       ├── Calories
│   │   │       │   ├── CalorieSummary
│   │   │       │   ├── CalorieForm
│   │   │       │   └── CalorieList
│   │   │       │
│   │   │       ├── WaterIntake
│   │   │       │   ├── WaterSummary
│   │   │       │   ├── QuickAddButtons
│   │   │       │   └── WaterList
│   │   │       │
│   │   │       ├── Progress
│   │   │       │   ├── PeriodSelector
│   │   │       │   ├── StatsOverview
│   │   │       │   ├── Charts
│   │   │       │   └── Insights
│   │   │       │
│   │   │       └── Profile
│   │   │           ├── ProfileImage
│   │   │           ├── ProfileStats
│   │   │           └── EditForm
│   │   │
│   │   └── Toaster (Notifications)
```

## API Request Flow

```
Frontend Component
  ↓
API Utility (api.js)
  ↓
Axios Instance (with interceptor)
  ↓
Attach JWT Token to Headers
  ↓
HTTP Request → Backend
  ↓
CORS Check
  ↓
Middleware (Helmet, Morgan)
  ↓
Route Handler
  ↓
Auth Middleware (if protected)
  ↓
Input Validation
  ↓
Controller Logic
  ↓
Mongoose Query
  ↓
MongoDB Database
  ↓
Return Response
  ↓
Frontend receives data
  ↓
Update State
  ↓
Re-render Component
```

## Security Layers

```
┌─────────────────────────────────────┐
│   Layer 1: Client-Side Validation   │
│   - Form validation                 │
│   - Required fields                 │
│   - Email format                    │
│   - Password length                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Layer 2: CORS Protection          │
│   - Allowed origins                 │
│   - Allowed methods                 │
│   - Allowed headers                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Layer 3: Helmet Security          │
│   - XSS Protection                  │
│   - Content Security Policy         │
│   - HSTS                            │
│   - Frame protection                │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Layer 4: JWT Authentication       │
│   - Token verification              │
│   - User identity                   │
│   - Access control                  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Layer 5: Server-Side Validation   │
│   - Express Validator               │
│   - Type checking                   │
│   - Range validation                │
│   - Enum validation                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Layer 6: Database Security        │
│   - Password hashing (bcrypt)       │
│   - Query sanitization              │
│   - NoSQL injection prevention      │
└─────────────────────────────────────┘
```

## State Management

```
┌────────────────────────────────────────────┐
│         Global State (Context API)          │
│                                             │
│  AuthContext                                │
│  ├── user (current user data)              │
│  ├── token (JWT token)                     │
│  ├── loading (loading state)               │
│  ├── login() (login function)              │
│  ├── logout() (logout function)            │
│  └── updateUser() (update user data)       │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│      Local Component State (useState)       │
│                                             │
│  Each component manages:                    │
│  ├── Form data                              │
│  ├── Loading states                         │
│  ├── Error states                           │
│  ├── UI states (open/closed)               │
│  └── Fetched data                           │
└────────────────────────────────────────────┘
```

## Database Schema Relationships

```
┌─────────────┐
│    Users    │
│             │
│  _id (PK)   │
│  name       │
│  email      │
│  password   │
│  ...        │
└──────┬──────┘
       │
       │ 1-to-Many
       │
       ├──────────────────┬─────────────────┬──────────────────┐
       ↓                  ↓                 ↓                  ↓
┌─────────────┐   ┌──────────────┐  ┌────────────┐    ┌──────────────┐
│  Workouts   │   │  Calories    │  │   Water    │    │   Profile    │
│             │   │              │  │  Intakes   │    │   (embed)    │
│ user (FK)   │   │ user (FK)    │  │ user (FK)  │    │              │
│ exercise    │   │ meal         │  │ amount     │    │ References   │
│ duration    │   │ foodName     │  │ unit       │    │ user data    │
│ calories    │   │ calories     │  │ notes      │    │              │
│ ...         │   │ macros       │  │ date       │    │              │
└─────────────┘   └──────────────┘  └────────────┘    └──────────────┘
```

## Build & Deployment

```
Development                    Production
─────────                    ──────────

Frontend:                    Frontend:
npm start                    npm run build
  ↓                            ↓
Dev Server                   Static Files
  ↓                            ↓
Hot Reload                   Deploy to hosting platform
  ↓                            ↓
localhost:3000               https://yourdomain.com

Backend:                     Backend:
npm run dev                  npm start
  ↓                            ↓
Nodemon                      Node.js
  ↓                            ↓
Auto-restart                 Process Manager (PM2)
  ↓                            ↓
localhost:5000               Deploy to Heroku/Railway
```

## Performance Optimization Strategy

```
┌──────────────────────────────────────┐
│   Frontend Optimizations             │
│                                      │
│   ✓ Component lazy loading           │
│   ✓ Code splitting                   │
│   ✓ Image optimization               │
│   ✓ CSS minification                 │
│   ✓ Tree shaking                     │
│   ✓ Memoization                      │
│   ✓ Debounced search                 │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│   Backend Optimizations              │
│                                      │
│   ✓ MongoDB indexes                  │
│   ✓ Query optimization               │
│   ✓ Pagination                       │
│   ✓ Aggregation pipelines            │
│   ✓ Compression                      │
│   ✓ Caching ready                    │
│   ✓ Connection pooling               │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│   Network Optimizations              │
│                                      │
│   ✓ Gzip compression                 │
│   ✓ Parallel API calls               │
│   ✓ Minimal payload                  │
│   ✓ CDN for static assets            │
│   ✓ HTTP/2 ready                     │
└──────────────────────────────────────┘
```

---

This architecture ensures:
- ✅ Scalability
- ✅ Security
- ✅ Performance
- ✅ Maintainability
- ✅ User Experience
- ✅ Developer Experience
