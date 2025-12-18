import { useState, useEffect } from 'react';

/**
 * Custom hook for tracking lesson progress locally
 * In Phase 7, this will integrate with the backend API
 * For now, it uses localStorage
 */
export function useProgress(lessonId) {
  const [progress, setProgress] = useState({
    completedActivities: [],
    quizScores: [],
    watchedVideos: [],
    codeSnapshots: [],
    completed: false
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    if (!lessonId) return;

    const savedProgress = localStorage.getItem(`progress_${lessonId}`);
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, [lessonId]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (!lessonId) return;

    localStorage.setItem(`progress_${lessonId}`, JSON.stringify(progress));
  }, [lessonId, progress]);

  // Mark an activity as complete
  const completeActivity = (activityId) => {
    setProgress(prev => ({
      ...prev,
      completedActivities: prev.completedActivities.includes(activityId)
        ? prev.completedActivities
        : [...prev.completedActivities, activityId]
    }));
  };

  // Uncomplete an activity
  const uncompleteActivity = (activityId) => {
    setProgress(prev => ({
      ...prev,
      completedActivities: prev.completedActivities.filter(id => id !== activityId)
    }));
  };

  // Submit quiz scores
  const submitQuiz = (quizId, results) => {
    setProgress(prev => ({
      ...prev,
      quizScores: [
        ...prev.quizScores.filter(q => q.quizId !== quizId),
        {
          quizId,
          results,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  };

  // Mark video as watched
  const watchVideo = (videoUrl) => {
    setProgress(prev => ({
      ...prev,
      watchedVideos: prev.watchedVideos.includes(videoUrl)
        ? prev.watchedVideos
        : [...prev.watchedVideos, videoUrl]
    }));
  };

  // Save code snapshot
  const saveCode = (editorId, code) => {
    setProgress(prev => ({
      ...prev,
      codeSnapshots: [
        ...prev.codeSnapshots.filter(c => c.editorId !== editorId),
        {
          editorId,
          code,
          timestamp: new Date().toISOString()
        }
      ]
    }));
  };

  // Mark entire lesson as complete
  const completeLesson = () => {
    setProgress(prev => ({
      ...prev,
      completed: true,
      completedAt: new Date().toISOString()
    }));
  };

  // Get overall completion percentage for the lesson
  const getCompletionPercentage = (totalActivities = 0, totalQuizzes = 0, totalVideos = 0) => {
    const activityProgress = totalActivities > 0
      ? (progress.completedActivities.length / totalActivities) * 0.4
      : 0;
    const quizProgress = totalQuizzes > 0
      ? (progress.quizScores.length / totalQuizzes) * 0.4
      : 0;
    const videoProgress = totalVideos > 0
      ? (progress.watchedVideos.length / totalVideos) * 0.2
      : 0;

    return Math.round((activityProgress + quizProgress + videoProgress) * 100);
  };

  return {
    progress,
    completeActivity,
    uncompleteActivity,
    submitQuiz,
    watchVideo,
    saveCode,
    completeLesson,
    getCompletionPercentage
  };
}

export default useProgress;
