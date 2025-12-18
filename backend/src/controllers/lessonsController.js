// In the future, this could query a database or read from files
// For now, we'll return simple responses since lessons are stored as static JSON in frontend

export const getAllLessons = async (req, res, next) => {
  try {
    // This endpoint can be used for search/filtering
    // Lessons are primarily served as static files from frontend
    res.json({
      success: true,
      message: 'Lessons are served as static files from frontend/src/data/lessons',
      data: {
        totalLessons: 30,
        lessonsRange: 'day01 to day30'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getLessonById = async (req, res, next) => {
  try {
    const { dayId } = req.params;

    // Validate lesson ID format
    if (!/^day\d{2}$/.test(dayId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid lesson ID format. Expected format: dayXX (e.g., day01)'
      });
    }

    // In production, could read the JSON file or query database
    res.json({
      success: true,
      message: `Lesson ${dayId} is served from frontend static files`,
      data: {
        lessonId: dayId,
        path: `frontend/src/data/lessons/${dayId}.json`
      }
    });
  } catch (error) {
    next(error);
  }
};
