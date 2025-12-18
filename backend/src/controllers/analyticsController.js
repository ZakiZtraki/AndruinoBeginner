import Progress from '../models/Progress.js';
import QuizSubmission from '../models/QuizSubmission.js';

export const getUserAnalytics = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Get all user progress
    const allProgress = await Progress.find({ userId });

    // Calculate statistics
    const totalLessons = 30;
    const completedLessons = allProgress.filter(p => p.completed).length;
    const completionPercentage = Math.round((completedLessons / totalLessons) * 100);

    // Get quiz submissions
    const quizSubmissions = await QuizSubmission.find({ userId });
    const averageQuizScore = quizSubmissions.length > 0
      ? quizSubmissions.reduce((acc, sub) => acc + (sub.totalScore / sub.maxScore), 0) / quizSubmissions.length * 100
      : 0;

    // Get recent activity
    const recentProgress = allProgress
      .sort((a, b) => b.lastAccessedAt - a.lastAccessedAt)
      .slice(0, 5)
      .map(p => ({
        lessonId: p.lessonId,
        lastAccessed: p.lastAccessedAt,
        completed: p.completed
      }));

    // Calculate current streak (days with activity)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let checkDate = new Date(today);

    while (true) {
      const hasActivity = allProgress.some(p => {
        const activityDate = new Date(p.lastAccessedAt);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === checkDate.getTime();
      });

      if (!hasActivity) break;

      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    res.json({
      success: true,
      data: {
        totalLessons,
        completedLessons,
        completionPercentage,
        averageQuizScore: Math.round(averageQuizScore),
        currentStreak: streak,
        recentActivity: recentProgress,
        progressByCategory: calculateCategoryProgress(allProgress)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate progress by category
function calculateCategoryProgress(allProgress) {
  const categories = {
    'Foundation': { range: [1, 5], completed: 0, total: 5 },
    'Environmental Sensors': { range: [6, 9], completed: 0, total: 4 },
    'Displays and Motors': { range: [10, 14], completed: 0, total: 5 },
    'Advanced Sensors': { range: [15, 21], completed: 0, total: 7 },
    'Networking and ESP32': { range: [22, 28], completed: 0, total: 7 },
    'Reliability and Capstone': { range: [29, 30], completed: 0, total: 2 }
  };

  allProgress.forEach(p => {
    if (p.completed) {
      const dayNum = parseInt(p.lessonId.replace('day', ''));
      for (const [category, data] of Object.entries(categories)) {
        if (dayNum >= data.range[0] && dayNum <= data.range[1]) {
          data.completed++;
          break;
        }
      }
    }
  });

  return Object.entries(categories).map(([name, data]) => ({
    name,
    completed: data.completed,
    total: data.total,
    percentage: Math.round((data.completed / data.total) * 100)
  }));
}
