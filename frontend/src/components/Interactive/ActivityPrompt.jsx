function ActivityPrompt({ prompt }) {
  return (
    <div className="mb-8 bg-gradient-to-r from-green-50 to-teal-50 border-l-4 border-green-500 p-6 rounded-r-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            🛠️ Hands-On Activity
          </h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {prompt}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityPrompt;
