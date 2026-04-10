# Image Integration Guide

## How Images Are Used in FitTrack

### 1. Profile Images

Users can add profile images to personalize their accounts.

#### Current Implementation:
- Profile images are stored as URLs in the database
- Displayed in the Profile page header
- Shows a default icon if no image is set

#### How to Add Profile Images:

**Option 1: URL-based (Current)**
```javascript
// Update profile with image URL
PUT /api/profile
{
  "profileImage": "https://example.com/your-photo.jpg"
}
```

**Option 2: Local Images (Setup Required)**

1. Create images directory:
```bash
mkdir frontend/public/images
```

2. Add your images to the folder

3. Update profile with local path:
```javascript
{
  "profileImage": "/images/profile.jpg"
}
```

---

### 2. Exercise Images

Workout cards can display exercise images for better visual feedback.

#### To Add Exercise Images:

1. **Create image mapping:**
```javascript
// frontend/src/utils/exerciseImages.js
const exerciseImages = {
  'running': '/images/exercises/running.jpg',
  'bench press': '/images/exercises/bench-press.jpg',
  'squats': '/images/exercises/squats.jpg',
  'cycling': '/images/exercises/cycling.jpg',
  // Add more exercises
};

export const getExerciseImage = (name) => {
  return exerciseImages[name.toLowerCase()] || '/images/exercises/default.jpg';
};
```

2. **Update Workout Card:**
```javascript
import { getExerciseImage } from '../utils/exerciseImages';

// In workout card component
<img 
  src={getExerciseImage(workout.exerciseName)} 
  alt={workout.exerciseName}
  className="workout-image"
/>
```

---

### 3. Dashboard Hero Image

The dashboard can feature a background image for visual appeal.

#### To Add Dashboard Background:

**Update `Dashboard.css`:**
```css
.dashboard-header {
  background: linear-gradient(
    rgba(102, 126, 234, 0.8),
    rgba(118, 75, 162, 0.8)
  ),
  url('/images/fitness-hero.jpg');
  background-size: cover;
  background-position: center;
}
```

---

### 4. Meal/Food Images

Calorie tracker can display food images.

#### Implementation:

1. **Create food image mapping:**
```javascript
const foodImages = {
  'chicken': '/images/food/chicken.jpg',
  'rice': '/images/food/rice.jpg',
  'salad': '/images/food/salad.jpg',
  'oatmeal': '/images/food/oatmeal.jpg',
};
```

2. **Update Calorie Card:**
```javascript
<img 
  src={foodImages[entry.foodName.toLowerCase()] || '/images/food/default.jpg'}
  alt={entry.foodName}
  className="food-image"
/>
```

---

## Best Practices for Images

### Image Optimization

1. **Compress images** before adding:
   - Use TinyPNG or similar tools
   - Keep files under 200KB
   - Use WebP format when possible

2. **Recommended dimensions:**
   - Profile images: 400x400px
   - Exercise images: 800x600px
   - Food images: 600x600px
   - Hero banners: 1920x1080px

3. **Use consistent aspect ratios:**
   - Square (1:1) for profile/exercise
   - Landscape (16:9) for banners
   - Portrait (4:5) for food photos

### Image Sources

**Free Stock Photo Sites:**
- Unsplash: https://unsplash.com
- Pexels: https://pexels.com
- Pixabay: https://pixabay.com

**Fitness-Specific:**
- Search: "fitness", "workout", "gym", "exercise"
- Use consistent style and lighting

### File Naming Convention

```
exercise-bench-press.jpg
food-chicken-breast.jpg
profile-default.jpg
background-hero.jpg
```

---

## Advanced: Image Upload Feature

To enable users to upload their own images:

### Backend Setup

1. **Install Multer:**
```bash
cd backend
npm install multer
```

2. **Create upload middleware:**
```javascript
// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

module.exports = upload;
```

3. **Add upload route:**
```javascript
// backend/routes/upload.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

router.post('/upload-image', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  res.json({
    success: true,
    imageUrl: `/uploads/${req.file.filename}`
  });
});

module.exports = router;
```

### Frontend Setup

1. **Create upload component:**
```javascript
const ImageUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUpload(response.data.imageUrl);
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};
```

2. **Serve uploads in backend:**
```javascript
// backend/server.js
app.use('/uploads', express.static('uploads'));
```

---

## Using Reference Images

If you have reference images for the UI design:

### 1. Add to Public Folder
```bash
mkdir frontend/public/reference
# Add your reference images here
```

### 2. Use in Components
```javascript
<img src="/reference/dashboard-design.jpg" alt="Reference" />
```

### 3. Match Design Elements
- Extract color palette using tools like Coolors.co
- Match spacing and padding
- Use similar typography
- Recreate card styles and shadows

---

## Troubleshooting

### Images Not Loading

1. **Check file path:**
   - Use absolute paths from public folder
   - Start with `/images/...`

2. **Verify file exists:**
   - Check spelling and case
   - Ensure file is in correct directory

3. **Check console:**
   - Look for 404 errors
   - Verify network requests

### Large Images Slow Loading

1. **Compress images**
2. **Use lazy loading:**
```javascript
<img loading="lazy" src="..." alt="..." />
```

3. **Implement responsive images:**
```javascript
<picture>
  <source media="(max-width: 768px)" srcSet="small.jpg" />
  <source media="(min-width: 769px)" srcSet="large.jpg" />
  <img src="large.jpg" alt="..." />
</picture>
```

---

## Image Ideas for Fitness App

### Dashboard
- Motivational fitness background
- Athlete in action
- Gym equipment
- Healthy lifestyle imagery

### Exercise Categories
- Cardio: Running, cycling
- Strength: Weight lifting
- Flexibility: Yoga poses
- Sports: Various activities

### Food Images
- Healthy meals
- Fresh ingredients
- Balanced plates
- Meal prep examples

### Icons & Graphics
- Custom fitness icons
- Progress indicators
- Achievement badges
- Water drops for hydration

---

**Remember: Images should enhance the user experience, not distract from it. Use them purposefully and maintain consistency throughout the app.**
