import { createContext, useState, useEffect, useCallback } from 'react';
import { progressAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserProgress = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await progressAPI.getUserProgress(user.id);

      if (response.success && response.data) {
        const progressMap = {};
        response.data.forEach(record => {
          progressMap[record.lessonId] = {
            completedActivities: record.completedActivities || [],
            quizScores: record.quizScores || [],
            watchedVideos: record.watchedVideos || [],
            codeSnapshots: record.codeSnapshots || [],
            isCompleted: record.isCompleted || false,
            lastAccessedAt: record.lastAccessedAt,
          };
        });

        setProgressData(progressMap);
      }
    } catch (err) {
      console.error('Error loading progress:', err);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserProgress();
    } else {
      setProgressData({});
      setLoading(false);
    }
  }, [isAuthenticated, user, loadUserProgress]);

  const getLessonProgress = (lessonId) => {
    const defaultProgress = {
      completedActivities: [],
      quizScores: [],
      watchedVideos: [],
      codeSnapshots: [],
      isCompleted: false,
    };

    if (!progressData[lessonId]) {
      return defaultProgress;
    }

    return {
      ...defaultProgress,
      ...progressData[lessonId],
    };
  };

  const completeActivity = async (lessonId, activityId) => {
    if (!isAuthenticated) {
      console.warn('User not authenticated, cannot save progress');
      return;
    }

    try {
      const response = await progressAPI.updateActivity(lessonId, activityId);

      if (response.success) {
        // Update local state
        setProgressData(prev => ({
          ...prev,
          [lessonId]: {
            ...prev[lessonId],
            completedActivities: [
              ...(prev[lessonId]?.completedActivities || []),
              activityId,
            ],
          },
        }));
      }
    } catch (err) {
      console.error('Error completing activity:', err);
      setError('Failed to save activity progress');
    }
  };

  const submitQuiz = async (lessonId, quizId, answers) => {
    if (!isAuthenticated) {
      console.warn('User not authenticated, cannot save quiz');
      return;
    }

    try {
      const response = await progressAPI.submitQuiz(lessonId, answers);

      if (response.success) {
        // Update local state with quiz result
        const quizResult = {
          quizId,
          answers,
          timestamp: new Date().toISOString(),
          score: response.data?.score,
        };

        setProgressData(prev => ({
          ...prev,
          [lessonId]: {
            ...prev[lessonId],
            quizScores: [
              ...(prev[lessonId]?.quizScores || []),
              quizResult,
            ],
          },
        }));
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to save quiz results');
    }
  };

  const watchVideo = async (lessonId, videoUrl) => {
    if (!isAuthenticated) {
      console.warn('User not authenticated, cannot save video progress');
      return;
    }

    try {
      // Note: We need to add this endpoint to the backend
      // For now, we'll update local state only
      setProgressData(prev => ({
        ...prev,
        [lessonId]: {
          ...prev[lessonId],
          watchedVideos: [
            ...(prev[lessonId]?.watchedVideos || []),
            videoUrl,
          ],
        },
      }));
    } catch (err) {
      console.error('Error saving video progress:', err);
    }
  };

  const saveCode = async (lessonId, code, editorId = 'default') => {
    if (!isAuthenticated) {
      console.warn('User not authenticated, cannot save code');
      return;
    }

    try {
      const response = await progressAPI.saveCode(lessonId, code, editorId);

      if (response.success) {
        // Update local state
        setProgressData(prev => {
          const existingSnapshots = prev[lessonId]?.codeSnapshots || [];
          const updatedSnapshots = [
            ...existingSnapshots.filter(s => s.editorId !== editorId),
            { editorId, code, timestamp: new Date().toISOString() },
          ];

          return {
            ...prev,
            [lessonId]: {
              ...prev[lessonId],
              codeSnapshots: updatedSnapshots,
            },
          };
        });
      }
    } catch (err) {
      console.error('Error saving code:', err);
      setError('Failed to save code snapshot');
    }
  };

  const markLessonComplete = async (lessonId) => {
    if (!isAuthenticated) {
      console.warn('User not authenticated, cannot mark lesson complete');
      return;
    }

    try {
      const response = await progressAPI.markLessonComplete(lessonId);

      if (response.success) {
        setProgressData(prev => ({
          ...prev,
          [lessonId]: {
            ...prev[lessonId],
            isCompleted: true,
          },
        }));
      }
    } catch (err) {
      console.error('Error marking lesson complete:', err);
      setError('Failed to mark lesson as complete');
    }
  };

  const getCompletionPercentage = (lessonId) => {
    const progress = getLessonProgress(lessonId);

    // Simple calculation: weight activities, quizzes, and videos equally
    const activityWeight = 40;
    const quizWeight = 40;
    const videoWeight = 20;

    // These would ideally come from lesson metadata
    const totalActivities = 3; // TODO: Get from lesson data
    const totalQuizzes = 1;
    const totalVideos = 1;

    const activityScore = Math.min(100, (progress.completedActivities.length / totalActivities) * 100);
    const quizScore = Math.min(100, (progress.quizScores.length / totalQuizzes) * 100);
    const videoScore = Math.min(100, (progress.watchedVideos.length / totalVideos) * 100);

    const totalPercentage = (
      (activityScore * activityWeight / 100) +
      (quizScore * quizWeight / 100) +
      (videoScore * videoWeight / 100)
    );

    return Math.round(totalPercentage);
  };

  const getOverallProgress = () => {
    const lessonIds = Object.keys(progressData);
    if (lessonIds.length === 0) return 0;

    const totalCompleted = lessonIds.filter(id => progressData[id].isCompleted).length;
    return Math.round((totalCompleted / 30) * 100); // 30 total lessons
  };

  const value = {
    progressData,
    loading,
    error,
    getLessonProgress,
    completeActivity,
    submitQuiz,
    watchVideo,
    saveCode,
    markLessonComplete,
    getCompletionPercentage,
    getOverallProgress,
    refreshProgress: loadUserProgress,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export default ProgressContext;
