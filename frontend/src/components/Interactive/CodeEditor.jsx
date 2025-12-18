import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ initialCode = '', language = 'cpp', onRun, readOnly = false, height = '400px' }) {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure Monaco for Arduino/C++
    monaco.languages.register({ id: 'arduino' });

    // Add Arduino-specific keywords
    monaco.languages.setMonarchTokensProvider('cpp', {
      keywords: [
        'void', 'int', 'float', 'bool', 'char', 'const', 'unsigned', 'long',
        'setup', 'loop', 'pinMode', 'digitalWrite', 'digitalRead',
        'analogWrite', 'analogRead', 'delay', 'millis', 'Serial',
        'HIGH', 'LOW', 'INPUT', 'OUTPUT', 'INPUT_PULLUP',
        'LED_BUILTIN', 'true', 'false', 'if', 'else', 'for', 'while',
        'return', 'switch', 'case', 'break', 'default'
      ],
      tokenizer: {
        root: [
          [/[a-zA-Z_]\w*/, {
            cases: {
              '@keywords': 'keyword',
              '@default': 'identifier'
            }
          }],
          [/".*?"/, 'string'],
          [/'.*?'/, 'string'],
          [/\/\/.*$/, 'comment'],
          [/\/\*/, 'comment', '@comment'],
          [/\d+/, 'number'],
        ],
        comment: [
          [/[^/*]+/, 'comment'],
          [/\*\//, 'comment', '@pop'],
          [/[/*]/, 'comment']
        ],
      }
    });
  };

  const handleRunCode = () => {
    if (onRun) {
      setIsRunning(true);
      onRun(code);
      setTimeout(() => setIsRunning(false), 1000);
    }
  };

  const handleResetCode = () => {
    setCode(initialCode);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg">
      {/* Editor toolbar */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 font-mono">
            {language === 'cpp' ? 'Arduino/C++' : language}
          </span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!readOnly && (
            <>
              <button
                onClick={handleResetCode}
                className="px-3 py-1 text-sm text-gray-400 hover:text-white transition"
                title="Reset to original code"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1 text-sm text-gray-400 hover:text-white transition"
                title="Copy code"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              {onRun && (
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className={`
                    px-4 py-1 rounded text-sm font-semibold transition
                    ${isRunning
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                    }
                  `}
                  title="Run code in simulator"
                >
                  {isRunning ? (
                    <span className="flex items-center gap-1">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Running...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Run Code
                    </span>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Monaco Editor */}
      <Editor
        height={height}
        defaultLanguage="cpp"
        language={language}
        value={code}
        onChange={(value) => setCode(value || '')}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
        }}
      />
    </div>
  );
}

export default CodeEditor;
