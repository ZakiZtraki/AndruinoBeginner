import { useState, useEffect } from 'react';

/**
 * Custom hook to load lesson data from JSON files
 * @param {string} lessonId - The lesson ID (e.g., "day01")
 * @returns {object} - { lesson, loading, error }
 */
export function useLessonData(lessonId) {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lessonId) {
      setLoading(false);
      return;
    }

    const loadLesson = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dynamically import the lesson JSON file
        const lessonData = await import(`../data/lessons/${lessonId}.json`);

        setLesson(lessonData.default || lessonData);
        setLoading(false);
      } catch (err) {
        console.error(`Error loading lesson ${lessonId}:`, err);
        setError(`Failed to load lesson: ${lessonId}`);
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonId]);

  return { lesson, loading, error };
}

export default useLessonData;
