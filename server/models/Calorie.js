const mongoose = require('mongoose');

const calorieSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meal: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  foodName: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true
  },
  calories: {
    type: Number,
    required: [true, 'Calories count is required'],
    min: 0
  },
  protein: {
    type: Number,
    min: 0
  },
  carbs: {
    type: Number,
    min: 0
  },
  fat: {
    type: Number,
    min: 0
  },
  portion: {
    type: String,
    default: '1 serving'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

calorieSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Calorie', calorieSchema);
