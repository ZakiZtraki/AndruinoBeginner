function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3">Arduino Learning Platform</h3>
            <p className="text-sm">
              Interactive 30-day course for Arduino beginners. Learn electronics and programming hands-on.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/lesson/day01" className="hover:text-white transition">Start Course</a></li>
              <li><a href="/dashboard" className="hover:text-white transition">Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.arduino.cc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Arduino.cc</a></li>
              <li><a href="https://wokwi.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Wokwi Simulator</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Arduino Learning Platform. Built with React, Vite, and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
