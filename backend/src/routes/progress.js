import express from 'express';
import {
  getUserProgress,
  updateActivityProgress,
  submitQuiz,
  saveCodeSnapshot,
  markLessonComplete
} from '../controllers/progressController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/progress/:userId
// @desc    Get all progress for a user
// @access  Private
router.get('/:userId', getUserProgress);

// @route   POST /api/progress/:lessonId/activity
// @desc    Mark an activity as complete
// @access  Private
router.post('/:lessonId/activity', updateActivityProgress);

// @route   POST /api/progress/:lessonId/quiz
// @desc    Submit quiz answers
// @access  Private
router.post('/:lessonId/quiz', submitQuiz);

// @route   POST /api/progress/:lessonId/code
// @desc    Save code snapshot
// @access  Private
router.post('/:lessonId/code', saveCodeSnapshot);

// @route   PUT /api/progress/:lessonId/complete
// @desc    Mark lesson as complete
// @access  Private
router.put('/:lessonId/complete', markLessonComplete);

export default router;
