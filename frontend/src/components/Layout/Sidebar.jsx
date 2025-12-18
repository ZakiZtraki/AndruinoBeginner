import { Link, useParams } from 'react-router-dom';
import { useCourseStructure } from '../../hooks/useCourseStructure';

function Sidebar() {
  const { dayId } = useParams();
  const { courseStructure, loading } = useCourseStructure();

  if (loading || !courseStructure) {
    return (
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Course Content</h2>

        {courseStructure.categories.map((category) => (
          <div key={category.id} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
            </h3>

            <ul className="space-y-1">
              {category.lessons.map((lessonId) => {
                const isActive = dayId === lessonId;
                const dayNum = parseInt(lessonId.replace('day', ''));

                return (
                  <li key={lessonId}>
                    <Link
                      to={`/lesson/${lessonId}`}
                      className={`
                        block px-3 py-2 rounded-lg text-sm transition
                        ${isActive
                          ? 'bg-blue-100 text-blue-900 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <span className="inline-block w-16">Day {dayNum}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
