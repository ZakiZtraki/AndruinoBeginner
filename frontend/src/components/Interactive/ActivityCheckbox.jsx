import { useState } from 'react';

function ActivityCheckbox({ activityId, label, onComplete }) {
  const [completed, setCompleted] = useState(false);

  const handleToggle = () => {
    const newState = !completed;
    setCompleted(newState);

    if (onComplete) {
      onComplete(activityId, newState);
    }
  };

  return (
    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition group">
      <div className="flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggle}
          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
        />
      </div>
      <span className={`
        flex-1 text-gray-700 transition
        ${completed ? 'line-through text-gray-500' : 'group-hover:text-gray-900'}
      `}>
        {label}
      </span>
      {completed && (
        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
    </label>
  );
}

export default ActivityCheckbox;
