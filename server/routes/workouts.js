const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

// @route   POST /api/workouts
// @desc    Add a new workout
// @access  Private
router.post('/', auth, [
  body('exerciseName').trim().notEmpty().withMessage('Exercise name is required'),
  body('exerciseType').isIn(['cardio', 'strength', 'flexibility', 'sports', 'other']).withMessage('Invalid exercise type'),
  body('duration').isNumeric().withMessage('Duration must be a number').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      exerciseName,
      exerciseType,
      duration,
      caloriesBurned,
      sets,
      reps,
      weight,
      distance,
      intensity,
      notes,
      date
    } = req.body;

    const workout = new Workout({
      user: req.userId,
      exerciseName,
      exerciseType,
      duration,
      caloriesBurned,
      sets,
      reps,
      weight,
      distance,
      intensity,
      notes,
      date
    });

    await workout.save();

    res.status(201).json({
      success: true,
      message: 'Workout added successfully',
      workout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding workout',
      error: error.message
    });
  }
});

// @route   GET /api/workouts
// @desc    Get all workouts for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, startDate, endDate } = req.query;
    
    const query = { user: req.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const workouts = await Workout.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Workout.countDocuments(query);

    res.json({
      success: true,
      workouts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workouts',
      error: error.message
    });
  }
});

// @route   GET /api/workouts/stats
// @desc    Get workout statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    let startDate;
    const now = new Date();
    
    if (period === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }

    const stats = await Workout.aggregate([
      {
        $match: {
          user: req.userId,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          totalCaloriesBurned: { $sum: '$caloriesBurned' },
          avgDuration: { $avg: '$duration' }
        }
      }
    ]);

    const workoutsByType = await Workout.aggregate([
      {
        $match: {
          user: req.userId,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$exerciseType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: stats[0] || { totalWorkouts: 0, totalDuration: 0, totalCaloriesBurned: 0, avgDuration: 0 },
      workoutsByType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workout stats',
      error: error.message
    });
  }
});

// @route   GET /api/workouts/:id
// @desc    Get single workout
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.json({
      success: true,
      workout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching workout',
      error: error.message
    });
  }
});

// @route   PUT /api/workouts/:id
// @desc    Update workout
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.json({
      success: true,
      message: 'Workout updated successfully',
      workout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating workout',
      error: error.message
    });
  }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete workout
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.json({
      success: true,
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting workout',
      error: error.message
    });
  }
});

module.exports = router;
