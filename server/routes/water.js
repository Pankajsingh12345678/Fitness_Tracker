const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const WaterIntake = require('../models/WaterIntake');
const auth = require('../middleware/auth');

// @route   POST /api/water
// @desc    Add water intake entry
// @access  Private
router.post('/', auth, [
  body('amount').isNumeric().withMessage('Amount must be a number')
    .isInt({ min: 50, max: 5000 }).withMessage('Amount must be between 50ml and 5000ml')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { amount, unit, notes, date } = req.body;

    const waterEntry = new WaterIntake({
      user: req.userId,
      amount,
      unit: unit || 'ml',
      notes,
      date
    });

    await waterEntry.save();

    res.status(201).json({
      success: true,
      message: 'Water intake added successfully',
      waterEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding water intake',
      error: error.message
    });
  }
});

// @route   GET /api/water
// @desc    Get all water intake entries
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

    const entries = await WaterIntake.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await WaterIntake.countDocuments(query);

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
      message: 'Error fetching water intake entries',
      error: error.message
    });
  }
});

// @route   GET /api/water/stats
// @desc    Get water intake statistics
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

    const stats = await WaterIntake.aggregate([
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
          totalAmount: { $sum: '$amount' },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);

    // Get daily totals for the past 7 days
    const dailyIntake = await WaterIntake.aggregate([
      {
        $match: {
          user: req.userId,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          totalAmount: { $sum: '$amount' },
          entries: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({
      success: true,
      stats: stats[0] || { totalEntries: 0, totalAmount: 0, avgAmount: 0 },
      dailyIntake
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching water intake stats',
      error: error.message
    });
  }
});

// @route   PUT /api/water/:id
// @desc    Update water intake entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const entry = await WaterIntake.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Water intake entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Water intake updated successfully',
      entry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating water intake',
      error: error.message
    });
  }
});

// @route   DELETE /api/water/:id
// @desc    Delete water intake entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await WaterIntake.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Water intake entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Water intake deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting water intake',
      error: error.message
    });
  }
});

module.exports = router;
