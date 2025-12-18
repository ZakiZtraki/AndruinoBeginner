import Progress from '../models/Progress.js';

// @desc    Get all progress for a user
export const getUserProgress = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const progress = await Progress.find({ userId }).sort({ lessonId: 1 });

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark an activity as complete
export const updateActivityProgress = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { activityId } = req.body;
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId, lessonId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        lessonId,
        completedActivities: [activityId]
      });
    } else if (!progress.completedActivities.includes(activityId)) {
      progress.completedActivities.push(activityId);
      await progress.save();
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answers
export const submitQuiz = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { answers } = req.body; // Array of { questionId, answer, correct }
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId, lessonId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        lessonId,
        quizScores: answers
      });
    } else {
      // Merge new quiz scores with existing ones
      answers.forEach(answer => {
        const existingIndex = progress.quizScores.findIndex(
          q => q.questionId === answer.questionId
        );
        if (existingIndex >= 0) {
          progress.quizScores[existingIndex] = answer;
        } else {
          progress.quizScores.push(answer);
        }
      });
      await progress.save();
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save code snapshot
export const saveCodeSnapshot = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { code, editorId } = req.body;
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId, lessonId });

    const snapshot = {
      timestamp: new Date(),
      code,
      editorId
    };

    if (!progress) {
      progress = await Progress.create({
        userId,
        lessonId,
        codeSnapshots: [snapshot]
      });
    } else {
      progress.codeSnapshots.push(snapshot);
      // Keep only last 10 snapshots per lesson
      if (progress.codeSnapshots.length > 10) {
        progress.codeSnapshots = progress.codeSnapshots.slice(-10);
      }
      await progress.save();
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark lesson as complete
export const markLessonComplete = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user._id;

    let progress = await Progress.findOne({ userId, lessonId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        lessonId,
        completed: true,
        completedAt: new Date()
      });
    } else {
      progress.completed = true;
      progress.completedAt = new Date();
      await progress.save();
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};
