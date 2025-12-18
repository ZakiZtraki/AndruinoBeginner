import { useState, useEffect } from 'react';

/**
 * Custom hook to load course structure metadata
 * @returns {object} - { courseStructure, loading, error }
 */
export function useCourseStructure() {
  const [courseStructure, setCourseStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourseStructure = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await import('../data/courseStructure.json');
        setCourseStructure(data.default || data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading course structure:', err);
        setError('Failed to load course structure');
        setLoading(false);
      }
    };

    loadCourseStructure();
  }, []);

  return { courseStructure, loading, error };
}

export default useCourseStructure;
