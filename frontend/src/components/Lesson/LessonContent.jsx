import ObjectivesList from './ObjectivesList';
import MaterialsTable from './MaterialsTable';
import TheorySection from './TheorySection';
import CodeBlock from './CodeBlock';
import InteractiveCodeSection from '../Interactive/InteractiveCodeSection';
import ActivityPrompt from '../Interactive/ActivityPrompt';
import VideoEmbed from '../Interactive/VideoEmbed';
import Quiz from '../Interactive/Quiz';
import { useProgress } from '../../hooks/useProgress';

function LessonContent({ lesson }) {
  const { submitQuiz, watchVideo } = useProgress(lesson?.id);

  if (!lesson) {
    return null;
  }

  const handleQuizComplete = (quizId, results) => {
    submitQuiz(quizId, results);
  };

  const handleVideoWatched = (videoUrl) => {
    watchVideo(videoUrl);
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Lesson title */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-full">
            Day {lesson.order}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {lesson.category}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {lesson.title}
        </h1>
      </header>

      {/* Learning objectives */}
      <ObjectivesList objectives={lesson.objectives} />

      {/* Materials table */}
      <MaterialsTable materials={lesson.materials} />

      {/* Lesson sections */}
      <div className="lesson-sections">
        {lesson.sections && lesson.sections.map((section, index) => {
          switch (section.type) {
            case 'theory':
              return (
                <TheorySection
                  key={index}
                  title={section.title}
                  content={section.content}
                  citations={section.citations}
                />
              );

            case 'code':
              // Use interactive code editor for Arduino code
              if (section.language === 'cpp' || !section.language) {
                return (
                  <InteractiveCodeSection
                    key={index}
                    code={section.code}
                    language={section.language}
                    explanation={section.explanation}
                    showSimulator={true}
                  />
                );
              }
              // Use simple code block for other languages
              return (
                <CodeBlock
                  key={index}
                  code={section.code}
                  language={section.language}
                  explanation={section.explanation}
                />
              );

            case 'activity':
              return (
                <ActivityPrompt
                  key={index}
                  prompt={section.prompt}
                  id={section.id}
                />
              );

            case 'video':
              return (
                <VideoEmbed
                  key={index}
                  url={section.url}
                  title={section.title}
                  timestamps={section.timestamps}
                  onWatched={handleVideoWatched}
                />
              );

            case 'quiz':
              return (
                <Quiz
                  key={index}
                  questions={section.questions}
                  quizId={section.quizId}
                  onComplete={(results) => handleQuizComplete(section.quizId, results)}
                />
              );

            default:
              console.warn('Unknown section type:', section.type);
              return null;
          }
        })}
      </div>
    </article>
  );
}

export default LessonContent;
