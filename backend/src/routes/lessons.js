import express from 'express';
import { getAllLessons, getLessonById } from '../controllers/lessonsController.js';

const router = express.Router();

// @route   GET /api/lessons
// @desc    Get all lessons
// @access  Public
router.get('/', getAllLessons);

// @route   GET /api/lessons/:dayId
// @desc    Get specific lesson
// @access  Public
router.get('/:dayId', getLessonById);

export default router;
