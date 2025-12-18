import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import useLessonData from '../hooks/useLessonData';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import Footer from '../components/Layout/Footer';
import LessonContent from '../components/Lesson/LessonContent';
import Navigation from '../components/Lesson/Navigation';

function LessonPage() {
  const { dayId } = useParams();
  const { lesson, loading, error } = useLessonData(dayId);

  // Scroll to top when lesson changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [dayId]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {loading && (
              <div className="max-w-4xl mx-auto">
                <div className="animate-pulse space-y-6">
                  <div className="h-12 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <h2 className="text-xl font-semibold text-red-900 mb-2">Error Loading Lesson</h2>
                  <p className="text-red-700">{error}</p>
                  <p className="text-sm text-red-600 mt-2">
                    Please check that the lesson exists and try again.
                  </p>
                </div>
              </div>
            )}

            {!loading && !error && lesson && (
              <>
                <LessonContent lesson={lesson} />
                <Navigation
                  prevLesson={lesson.prevLesson}
                  nextLesson={lesson.nextLesson}
                />
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default LessonPage;
