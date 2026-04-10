const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseName: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true
  },
  exerciseType: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
    required: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: 1
  },
  caloriesBurned: {
    type: Number,
    min: 0
  },
  sets: {
    type: Number,
    min: 1
  },
  reps: {
    type: Number,
    min: 1
  },
  weight: {
    type: Number,
    min: 0
  },
  distance: {
    type: Number,
    min: 0
  },
  intensity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notes: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

workoutSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Workout', workoutSchema);
