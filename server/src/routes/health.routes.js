import express from 'express';

const router = express.Router();

// @desc    Get API Health Status
// @route   GET /api/v1/health
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Banking API running',
    timestamp: new Date().toISOString()
  });
});

export default router;
