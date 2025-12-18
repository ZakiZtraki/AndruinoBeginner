import { useState } from 'react';

function CodeBlock({ code, language = 'cpp', explanation }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-8">
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        {/* Code header */}
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
          <span className="text-sm text-gray-400 font-mono">
            {language === 'cpp' ? 'Arduino/C++' : language}
          </span>
          <button
            onClick={handleCopy}
            className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>

        {/* Code content */}
        <pre className="p-4 overflow-x-auto">
          <code className="text-sm text-gray-100 font-mono leading-relaxed">
            {code}
          </code>
        </pre>
      </div>

      {/* Explanation if provided */}
      {explanation && (
        <div className="mt-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm text-gray-700">{explanation}</p>
        </div>
      )}
    </div>
  );
}

export default CodeBlock;
