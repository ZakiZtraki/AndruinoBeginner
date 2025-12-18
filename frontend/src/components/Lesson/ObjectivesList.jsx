function ObjectivesList({ objectives }) {
  if (!objectives || objectives.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
      <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Learning Objectives
      </h2>
      <ul className="space-y-2">
        {objectives.map((objective, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-600 mr-2 mt-1">•</span>
            <span className="text-gray-700">{objective}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ObjectivesList;
