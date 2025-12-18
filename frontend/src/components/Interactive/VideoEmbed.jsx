import { useState } from 'react';

function VideoEmbed({ url, title, timestamps, onWatched }) {
  const [watched, setWatched] = useState(false);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(url);

  const handleMarkWatched = () => {
    setWatched(true);
    if (onWatched) {
      onWatched(url);
    }
  };

  if (!videoId) {
    return (
      <div className="mb-8">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {title || 'Watch Video'}
        </a>
      </div>
    );
  }

  // Build YouTube embed URL with optional start time
  const startTime = timestamps?.start || 0;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${startTime}`;

  return (
    <div className="mb-8">
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">📹 Video Tutorial</h3>
          {timestamps && timestamps.end && (
            <span className="text-sm text-gray-600">
              Watch: {Math.floor(timestamps.start / 60)}:{(timestamps.start % 60).toString().padStart(2, '0')} - {Math.floor(timestamps.end / 60)}:{(timestamps.end % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>

        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={title || 'YouTube video'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {title && (
          <p className="mt-2 text-sm text-gray-600">{title}</p>
        )}

        {/* Mark as watched button */}
        <div className="mt-3 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={watched}
              onChange={handleMarkWatched}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className={`text-sm ${watched ? 'text-green-700 font-semibold' : 'text-gray-600'}`}>
              {watched ? '✓ Watched' : 'Mark as watched'}
            </span>
          </label>
          {timestamps && timestamps.end && (
            <span className="text-xs text-gray-500">
              Duration: ~{Math.ceil((timestamps.end - timestamps.start) / 60)} min
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoEmbed;
