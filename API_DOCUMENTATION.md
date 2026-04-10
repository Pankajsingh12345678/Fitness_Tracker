# 📡 FitTrack API Documentation

Complete API reference for the FitTrack Fitness Tracker application.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require an Authorization header with a Bearer token:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register New User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 25,
  "weight": 70,
  "height": 175,
  "gender": "male",
  "fitnessGoal": "muscle_gain"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "profileImage": ""
  }
}
```

### Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "profileImage": ""
  }
}
```

### Get Current User
**GET** `/auth/me`

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "weight": 70,
    "height": 175,
    "gender": "male",
    "fitnessGoal": "muscle_gain",
    "profileImage": "",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 💪 Workout Endpoints

### Add Workout
**POST** `/workouts`

**Headers:** Authorization required

**Request Body:**
```json
{
  "exerciseName": "Bench Press",
  "exerciseType": "strength",
  "duration": 45,
  "caloriesBurned": 250,
  "sets": 4,
  "reps": 12,
  "weight": 80,
  "intensity": "high",
  "notes": "Felt strong today"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Workout added successfully",
  "workout": {
    "_id": "workout_id",
    "exerciseName": "Bench Press",
    "exerciseType": "strength",
    "duration": 45,
    "caloriesBurned": 250,
    "sets": 4,
    "reps": 12,
    "weight": 80,
    "intensity": "high",
    "notes": "Felt strong today",
    "user": "user_id",
    "date": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get All Workouts
**GET** `/workouts?page=1&limit=20&startDate=2024-01-01&endDate=2024-01-31`

**Headers:** Authorization required

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date

**Response (200):**
```json
{
  "success": true,
  "workouts": [...],
  "totalPages": 5,
  "currentPage": 1,
  "total": 100
}
```

### Get Workout Statistics
**GET** `/workouts/stats?period=week`

**Headers:** Authorization required

**Query Parameters:**
- `period`: `week`, `month`, or `year` (default: week)

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalWorkouts": 15,
    "totalDuration": 675,
    "totalCaloriesBurned": 3500,
    "avgDuration": 45
  },
  "workoutsByType": [
    { "_id": "strength", "count": 8 },
    { "_id": "cardio", "count": 5 },
    { "_id": "flexibility", "count": 2 }
  ]
}
```

### Get Single Workout
**GET** `/workouts/:id`

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "workout": { ... }
}
```

### Update Workout
**PUT** `/workouts/:id`

**Headers:** Authorization required

**Request Body:**
```json
{
  "duration": 50,
  "caloriesBurned": 280
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Workout updated successfully",
  "workout": { ... }
}
```

### Delete Workout
**DELETE** `/workouts/:id`

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "message": "Workout deleted successfully"
}
```

---

## 🍎 Calorie Endpoints

### Add Calorie Entry
**POST** `/calories`

**Headers:** Authorization required

**Request Body:**
```json
{
  "meal": "breakfast",
  "foodName": "Oatmeal with Fruits",
  "calories": 350,
  "protein": 12,
  "carbs": 60,
  "fat": 8,
  "portion": "1 bowl"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Calorie entry added successfully",
  "calorieEntry": { ... }
}
```

### Get All Calorie Entries
**GET** `/calories?page=1&limit=20`

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "entries": [...],
  "totalPages": 3,
  "currentPage": 1,
  "total": 50
}
```

### Get Calorie Statistics
**GET** `/calories/stats?period=week`

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalEntries": 25,
    "totalCalories": 8750,
    "avgCalories": 350,
    "totalProtein": 300,
    "totalCarbs": 1200,
    "totalFat": 250
  },
  "caloriesByMeal": [
    { "_id": "breakfast", "count": 7, "totalCalories": 2450 },
    { "_id": "lunch", "count": 7, "totalCalories": 3500 },
    { "_id": "dinner", "count": 7, "totalCalories": 2800 }
  ]
}
```

### Update Calorie Entry
**PUT** `/calories/:id`

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "message": "Calorie entry updated successfully",
  "entry": { ... }
}
```

### Delete Calorie Entry
**DELETE** `/calories/:id`

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "message": "Calorie entry deleted successfully"
}
```

---

## 💧 Water Intake Endpoints

### Add Water Entry
**POST** `/water`

**Headers:** Authorization required

**Request Body:**
```json
{
  "amount": 500,
  "unit": "ml",
  "notes": "After workout"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Water intake added successfully",
  "waterEntry": { ... }
}
```

### Get All Water Entries
**GET** `/water?page=1&limit=20`

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "entries": [...],
  "totalPages": 4,
  "currentPage": 1,
  "total": 70
}
```

### Get Water Statistics
**GET** `/water/stats?period=week`

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalEntries": 21,
    "totalAmount": 15750,
    "avgAmount": 750
  },
  "dailyIntake": [
    {
      "_id": { "year": 2024, "month": 1, "day": 15 },
      "totalAmount": 2500,
      "entries": 4
    }
  ]
}
```

### Update Water Entry
**PUT** `/water/:id`

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "message": "Water intake updated successfully",
  "entry": { ... }
}
```

### Delete Water Entry
**DELETE** `/water/:id`

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "message": "Water intake deleted successfully"
}
```

---

## 👤 Profile Endpoints

### Get Profile
**GET** `/profile`

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "weight": 70,
    "height": 175,
    "gender": "male",
    "fitnessGoal": "muscle_gain",
    "profileImage": "",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Profile
**PUT** `/profile`

**Headers:** Authorization required

**Request Body:**
```json
{
  "name": "John Smith",
  "age": 26,
  "weight": 72,
  "height": 175,
  "gender": "male",
  "fitnessGoal": "endurance"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### Delete Account
**DELETE** `/profile`

**Headers:** Authorization required

**Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## ❌ Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "No authentication token, access denied"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Workout not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## 📊 Data Models

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  age: Number,
  weight: Number,
  height: Number,
  gender: 'male' | 'female' | 'other',
  profileImage: String,
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'general_fitness',
  createdAt: Date
}
```

### Workout
```javascript
{
  user: ObjectId (ref: User),
  exerciseName: String (required),
  exerciseType: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other',
  duration: Number (required, minutes),
  caloriesBurned: Number,
  sets: Number,
  reps: Number,
  weight: Number,
  distance: Number,
  intensity: 'low' | 'medium' | 'high',
  notes: String,
  date: Date
}
```

### Calorie
```javascript
{
  user: ObjectId (ref: User),
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  foodName: String (required),
  calories: Number (required),
  protein: Number,
  carbs: Number,
  fat: Number,
  portion: String,
  date: Date
}
```

### WaterIntake
```javascript
{
  user: ObjectId (ref: User),
  amount: Number (required, ml),
  unit: 'ml' | 'oz',
  notes: String,
  date: Date
}
```

---

## 🔑 Exercise Types

- `cardio` - Running, cycling, swimming
- `strength` - Weight lifting, resistance training
- `flexibility` - Yoga, stretching
- `sports` - Basketball, soccer, tennis
- `other` - Any other activity

## 🍽️ Meal Types

- `breakfast` - Morning meal
- `lunch` - Midday meal
- `dinner` - Evening meal
- `snack` - Between meals

---

**For support, refer to the main README.md or contact the development team.**
