const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Calorie = require('../models/Calorie');
const auth = require('../middleware/auth');

// @route   POST /api/calories
// @desc    Add calorie entry
// @access  Private
router.post('/', auth, [
  body('meal').isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Invalid meal type'),
  body('foodName').trim().notEmpty().withMessage('Food name is required'),
  body('calories').isNumeric().withMessage('Calories must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { meal, foodName, calories, protein, carbs, fat, portion, date } = req.body;

    const calorieEntry = new Calorie({
      user: req.userId,
      meal,
      foodName,
      calories,
      protein,
      carbs,
      fat,
      portion,
      date
    });

    await calorieEntry.save();

    res.status(201).json({
      success: true,
      message: 'Calorie entry added successfully',
      calorieEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding calorie entry',
      error: error.message
    });
  }
});

// @route   GET /api/calories
// @desc    Get all calorie entries
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

    const entries = await Calorie.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Calorie.countDocuments(query);

    res.json({
      success: true,
      entries,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching calorie entries',
      error: error.message
    });
  }
});

// @route   GET /api/calories/stats
// @desc    Get calorie statistics
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

    const stats = await Calorie.aggregate([
      {
        $match: {
          user: req.userId,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          totalCalories: { $sum: '$calories' },
          avgCalories: { $avg: '$calories' },
          totalProtein: { $sum: '$protein' },
          totalCarbs: { $sum: '$carbs' },
          totalFat: { $sum: '$fat' }
        }
      }
    ]);

    const caloriesByMeal = await Calorie.aggregate([
      {
        $match: {
          user: req.userId,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$meal',
          count: { $sum: 1 },
          totalCalories: { $sum: '$calories' }
        }
      }
    ]);

    res.json({
      success: true,
      stats: stats[0] || { totalEntries: 0, totalCalories: 0, avgCalories: 0 },
      caloriesByMeal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching calorie stats',
      error: error.message
    });
  }
});

// @route   PUT /api/calories/:id
// @desc    Update calorie entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const entry = await Calorie.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Calorie entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Calorie entry updated successfully',
      entry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating calorie entry',
      error: error.message
    });
  }
});

// @route   DELETE /api/calories/:id
// @desc    Delete calorie entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await Calorie.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Calorie entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Calorie entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting calorie entry',
      error: error.message
    });
  }
});

module.exports = router;
