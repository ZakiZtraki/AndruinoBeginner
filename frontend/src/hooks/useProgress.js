import { useContext } from 'react';
import ProgressContext from '../contexts/ProgressContext';

export function useProgress(lessonId) {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }

  if (lessonId === undefined) {
    return context;
  }

  return {
    progress: context.getLessonProgress(lessonId),
    completeActivity: (activityId) => context.completeActivity(lessonId, activityId),
    submitQuiz: (quizId, answers) => context.submitQuiz(lessonId, quizId, answers),
    watchVideo: (videoUrl) => context.watchVideo(lessonId, videoUrl),
    saveCode: (code, editorId) => context.saveCode(lessonId, code, editorId),
    markComplete: () => context.markLessonComplete(lessonId),
    completionPercentage: context.getCompletionPercentage(lessonId),
    loading: context.loading,
    error: context.error,
    refreshProgress: context.refreshProgress,
    getOverallProgress: context.getOverallProgress,
  };
}

export default useProgress;
