import { useState } from 'react';

function Quiz({ questions, quizId, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);

    // Calculate score
    const results = questions.map(q => ({
      questionId: q.id,
      answer: answers[q.id],
      correct: checkAnswer(q, answers[q.id])
    }));

    if (onComplete) {
      onComplete(results);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setShowResults(false);
  };

  const checkAnswer = (question, userAnswer) => {
    if (!userAnswer) return false;

    switch (question.type) {
      case 'multipleChoice':
        return userAnswer === question.correctAnswer;
      case 'trueFalse':
        return userAnswer === question.correctAnswer;
      case 'text':
        // For text answers, do case-insensitive comparison
        return userAnswer.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim();
      default:
        return false;
    }
  };

  const calculateScore = () => {
    const correct = questions.filter(q => checkAnswer(q, answers[q.id])).length;
    return { correct, total: questions.length, percentage: Math.round((correct / questions.length) * 100) };
  };

  const score = submitted ? calculateScore() : null;

  return (
    <div className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-purple-900 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          📝 Knowledge Check
        </h3>
        {showResults && (
          <div className="flex items-center gap-2">
            <span className={`
              px-4 py-2 rounded-full font-semibold text-sm
              ${score.percentage >= 80 ? 'bg-green-100 text-green-800' :
                score.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'}
            `}>
              Score: {score.correct}/{score.total} ({score.percentage}%)
            </span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <span className="flex-shrink-0 w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{question.question}</p>
              </div>
              {submitted && (
                <span className="flex-shrink-0">
                  {checkAnswer(question, answers[question.id]) ? (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </span>
              )}
            </div>

            {/* Multiple Choice */}
            {question.type === 'multipleChoice' && (
              <div className="mt-3 space-y-2">
                {question.options?.map((option, optIndex) => {
                  const isSelected = answers[question.id] === optIndex;
                  const isCorrect = optIndex === question.correctAnswer;
                  const showCorrect = submitted && isCorrect;
                  const showIncorrect = submitted && isSelected && !isCorrect;

                  return (
                    <label
                      key={optIndex}
                      className={`
                        flex items-center p-3 rounded-lg border-2 cursor-pointer transition
                        ${submitted ? 'cursor-not-allowed' : 'hover:bg-gray-50'}
                        ${isSelected && !submitted ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}
                        ${showCorrect ? 'border-green-500 bg-green-50' : ''}
                        ${showIncorrect ? 'border-red-500 bg-red-50' : ''}
                      `}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={optIndex}
                        checked={isSelected}
                        onChange={() => handleAnswerChange(question.id, optIndex)}
                        disabled={submitted}
                        className="mr-3"
                      />
                      <span className={`flex-1 ${showCorrect ? 'font-semibold text-green-900' : ''}`}>
                        {option}
                      </span>
                      {showCorrect && (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            {/* True/False */}
            {question.type === 'trueFalse' && (
              <div className="mt-3 space-y-2">
                {[true, false].map((value) => {
                  const isSelected = answers[question.id] === value;
                  const isCorrect = value === question.correctAnswer;
                  const showCorrect = submitted && isCorrect;
                  const showIncorrect = submitted && isSelected && !isCorrect;

                  return (
                    <label
                      key={String(value)}
                      className={`
                        flex items-center p-3 rounded-lg border-2 cursor-pointer transition
                        ${submitted ? 'cursor-not-allowed' : 'hover:bg-gray-50'}
                        ${isSelected && !submitted ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}
                        ${showCorrect ? 'border-green-500 bg-green-50' : ''}
                        ${showIncorrect ? 'border-red-500 bg-red-50' : ''}
                      `}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={String(value)}
                        checked={isSelected}
                        onChange={() => handleAnswerChange(question.id, value)}
                        disabled={submitted}
                        className="mr-3"
                      />
                      <span className={`flex-1 ${showCorrect ? 'font-semibold text-green-900' : ''}`}>
                        {value ? 'True' : 'False'}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Text Input */}
            {question.type === 'text' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  disabled={submitted}
                  placeholder="Type your answer..."
                  className={`
                    w-full px-4 py-2 border-2 rounded-lg
                    ${submitted
                      ? checkAnswer(question, answers[question.id])
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-purple-500 focus:outline-none'
                    }
                  `}
                />
              </div>
            )}

            {/* Explanation after submission */}
            {submitted && question.explanation && (
              <div className={`
                mt-3 p-3 rounded-lg text-sm
                ${checkAnswer(question, answers[question.id])
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
                }
              `}>
                <p className="font-semibold mb-1">
                  {checkAnswer(question, answers[question.id]) ? '✓ Correct!' : 'ℹ️ Explanation:'}
                </p>
                <p>{question.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit / Retry buttons */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {!submitted && `${Object.keys(answers).length} of ${questions.length} answered`}
          {submitted && score.percentage >= 80 && (
            <span className="text-green-700 font-semibold">🎉 Great job!</span>
          )}
          {submitted && score.percentage < 80 && score.percentage >= 60 && (
            <span className="text-yellow-700 font-semibold">Good effort! Review the material and try again.</span>
          )}
          {submitted && score.percentage < 60 && (
            <span className="text-red-700 font-semibold">Keep learning! Review the lesson and retry.</span>
          )}
        </div>

        <div className="flex gap-2">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== questions.length}
              className={`
                px-6 py-2 rounded-lg font-semibold transition
                ${Object.keys(answers).length === questions.length
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Submit Answers
            </button>
          ) : (
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
