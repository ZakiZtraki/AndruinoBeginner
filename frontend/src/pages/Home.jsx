import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              30-Day Arduino Beginner Course
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Learn electronics and microcontroller programming through hands-on lessons,
              interactive code examples, and real hardware projects.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/lesson/day01"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Start Learning
              </Link>
              <Link
                to="/dashboard"
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                View Dashboard
              </Link>
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl mb-2">💻</div>
                <h3 className="font-semibold text-lg mb-2">Interactive Code Editor</h3>
                <p className="text-gray-600">
                  Write and run Arduino code directly in your browser with syntax highlighting and instant feedback.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl mb-2">🔧</div>
                <h3 className="font-semibold text-lg mb-2">Hardware Simulation</h3>
                <p className="text-gray-600">
                  Test your circuits with Wokwi simulator - no physical hardware required to start learning.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold text-lg mb-2">Track Your Progress</h3>
                <p className="text-gray-600">
                  Complete activities, quizzes, and coding challenges while tracking your journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
