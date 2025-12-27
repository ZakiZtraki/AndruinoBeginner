import { useState } from 'react';
import CodeEditor from './CodeEditor';
import WokwiSimulator from './WokwiSimulator';

function InteractiveCodeSection({ code, language = 'cpp', explanation, showSimulator = true }) {
  const [showSimulatorPanel, setShowSimulatorPanel] = useState(false);
  const [simulatorCode, setSimulatorCode] = useState(code);

  const handleRunCode = (codeToRun) => {
    setSimulatorCode(codeToRun);
    setShowSimulatorPanel(true);
  };

  return (
    <div className="mb-8">
      {/* Code Editor */}
      <CodeEditor
        initialCode={code}
        language={language}
        onRun={showSimulator ? handleRunCode : null}
        height="450px"
      />

      {/* Explanation if provided */}
      {explanation && (
        <div className="mt-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
        </div>
      )}

      {/* Simulator panel (shows when user clicks Run) */}
      {showSimulator && showSimulatorPanel && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-900">Simulation</h4>
            <button
              onClick={() => setShowSimulatorPanel(false)}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <WokwiSimulator code={simulatorCode} />
        </div>
      )}

      {/* Help text */}
      {showSimulator && !showSimulatorPanel && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Click <strong>&ldquo;Run Code&rdquo;</strong> to test this Arduino sketch in the virtual simulator.
              You can modify the code and run it again to see different results.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default InteractiveCodeSection;
