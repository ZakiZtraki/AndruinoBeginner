import express from 'express';
import { getUserAnalytics } from '../controllers/analyticsController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/analytics/:userId/overview
// @desc    Get user analytics overview
// @access  Private
router.get('/:userId/overview', getUserAnalytics);

export default router;
