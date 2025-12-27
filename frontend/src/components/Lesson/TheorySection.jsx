import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function TheorySection({ title, content, citations }) {
  return (
    <section className="mb-8">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      )}

      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom styling for markdown elements
            h3: (props) => (
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3" {...props} />
            ),
            h4: (props) => (
              <h4 className="text-lg font-semibold text-gray-800 mt-4 mb-2" {...props} />
            ),
            p: (props) => (
              <p className="text-gray-700 leading-relaxed mb-4" {...props} />
            ),
            ul: (props) => (
              <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700" {...props} />
            ),
            ol: (props) => (
              <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700" {...props} />
            ),
            li: (props) => (
              <li className="ml-4" {...props} />
            ),
            blockquote: (props) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-600 bg-gray-50 rounded-r" {...props} />
            ),
            code: ({ inline, ...props }) =>
              inline ? (
                <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
              ) : (
                <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono" {...props} />
              ),
            strong: (props) => (
              <strong className="font-semibold text-gray-900" {...props} />
            ),
            a: (props) => (
              <a className="text-blue-600 hover:text-blue-800 hover:underline" {...props} />
            ),
            img: (props) => (
              <img className="rounded-lg shadow-md my-6 max-w-full h-auto" {...props} />
            ),
            table: (props) => (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border border-gray-200 rounded-lg" {...props} />
              </div>
            ),
            th: (props) => (
              <th className="bg-gray-100 px-4 py-2 text-left font-semibold text-gray-700 border-b" {...props} />
            ),
            td: (props) => (
              <td className="px-4 py-2 border-b text-gray-700" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Display citations if present */}
      {citations && citations.length > 0 && (
        <div className="mt-4 text-xs text-gray-500">
          <details className="cursor-pointer">
            <summary className="hover:text-gray-700">References ({citations.length})</summary>
            <ul className="mt-2 space-y-1 ml-4">
              {citations.map((citation, index) => (
                <li key={index} className="font-mono">【{citation}】</li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </section>
  );
}

export default TheorySection;
