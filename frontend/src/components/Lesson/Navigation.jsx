import { Link } from 'react-router-dom';

function Navigation({ prevLesson, nextLesson }) {
  return (
    <nav className="flex items-center justify-between py-8 border-t border-gray-200 mt-12">
      <div className="flex-1">
        {prevLesson && (
          <Link
            to={`/lesson/${prevLesson}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition group"
          >
            <svg
              className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div className="text-left">
              <div className="text-sm text-gray-500">Previous</div>
              <div className="font-semibold">{prevLesson}</div>
            </div>
          </Link>
        )}
      </div>

      <div className="flex-1 text-right">
        {nextLesson && (
          <Link
            to={`/lesson/${nextLesson}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition group"
          >
            <div className="text-right">
              <div className="text-sm text-gray-500">Next</div>
              <div className="font-semibold">{nextLesson}</div>
            </div>
            <svg
              className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
