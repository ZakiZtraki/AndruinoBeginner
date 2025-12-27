import { useState, useEffect } from 'react';

function WokwiSimulator({ code, board = 'arduino-uno' }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [code, board]);

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <p className="text-red-700">Error loading simulator: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Hardware Simulator
        </h3>
        <span className="text-sm text-gray-600">
          {board === 'arduino-uno' ? 'Arduino Uno' : 'ESP32'}
        </span>
      </div>

      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '500px' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Loading simulator...</p>
            </div>
          </div>
        )}

        {/* Placeholder for Wokwi iframe */}
        {/* In production, this would be an actual Wokwi embed with the code */}
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4">
            <svg className="w-24 h-24 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-gray-700 mb-2">Wokwi Simulator</h4>
          <p className="text-gray-600 mb-4 max-w-md">
            Click &ldquo;Run Code&rdquo; in the editor above to load your Arduino sketch into the Wokwi simulator.
            You&rsquo;ll see a virtual Arduino board with LEDs, sensors, and serial monitor.
          </p>
          <a
            href="https://wokwi.com/projects/new/arduino-uno"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open in Wokwi
          </a>
          <p className="text-xs text-gray-500 mt-3">
            Full simulator integration coming in future update
          </p>
        </div>

      </div>

      <div className="mt-3 text-sm text-gray-600">
        <p>
          💡 <strong>Tip:</strong> The Wokwi simulator lets you test Arduino code without physical hardware.
          You can see LEDs blink, read sensor values, and monitor serial output in real-time.
        </p>
      </div>
    </div>
  );
}

export default WokwiSimulator;
