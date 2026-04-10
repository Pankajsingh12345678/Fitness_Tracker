const mongoose = require('mongoose');

const waterIntakeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Water amount is required'],
    min: 50,
    max: 5000
  },
  unit: {
    type: String,
    enum: ['ml', 'oz'],
    default: 'ml'
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

waterIntakeSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('WaterIntake', waterIntakeSchema);
