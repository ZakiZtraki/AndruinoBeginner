# Arduino Learning Platform - 30-Day Beginner Course

An interactive web-based learning platform for the 30-Day Arduino Beginner Course. This platform transforms markdown lessons into an engaging learning experience with interactive code editors, Arduino simulation, progress tracking, and more.

## 🌟 Features

- **Interactive Code Editor**: Write and edit Arduino code with syntax highlighting using Monaco Editor
- **Arduino Simulator**: Run Arduino/ESP32 code directly in the browser using Wokwi
- **Progress Tracking**: Track your learning journey across all 30 lessons
- **Interactive Quizzes**: Test your knowledge with instant feedback
- **Video Integration**: Embedded YouTube tutorials with timestamp controls
- **Responsive Design**: Learn on desktop, tablet, or mobile devices
- **User Authentication**: Personal progress saved to your account

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AndruinoBeginner
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Frontend (.env in `frontend/` directory):
   ```bash
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your API URL
   ```

   Backend (.env in `backend/` directory):
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your MongoDB URI and JWT secret
   ```
   The backend will not start unless `JWT_SECRET` is set.

4. **Start MongoDB**

   If using local MongoDB:
   ```bash
   mongod
   ```

   If using MongoDB Atlas, update the MONGODB_URI in `backend/.env`

5. **Run the development servers**
   ```bash
   npm run dev
   ```

   This starts both frontend (http://localhost:3000) and backend (http://localhost:5000) concurrently.

## 📁 Project Structure

```
AndruinoBeginner/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── data/         # Lesson data (JSON)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── contexts/     # React contexts
│   │   ├── utils/        # Utility functions
│   │   └── styles/       # Global styles
│   └── public/           # Static assets
│
├── backend/              # Node.js/Express API
│   └── src/
│       ├── models/       # MongoDB models
│       ├── routes/       # API routes
│       ├── controllers/  # Route controllers
│       ├── middleware/   # Custom middleware
│       └── config/       # Configuration files
│
├── scripts/              # Build and migration scripts
├── day01/ - day30/       # Original lesson markdown files
└── package.json          # Root workspace configuration
```

## 🛠️ Development

### Available Scripts

**Root level:**
- `npm run dev` - Run both frontend and backend in development mode
- `npm run dev:frontend` - Run only frontend
- `npm run dev:backend` - Run only backend
- `npm run build` - Build frontend for production
- `npm run parse-lessons` - Convert markdown lessons to JSON
- `npm run copy-assets` - Copy images to public folder
- `npm run migrate-data` - Run both parse and copy scripts

**Frontend:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm run dev` - Start server with nodemon
- `npm start` - Start server (production)
- `npm run seed` - Seed database with initial data

## 📚 Adding or Updating Lessons

1. **Edit the markdown file**
   ```bash
   # Edit the lesson file
   code day01/lesson.md
   ```

2. **Regenerate lesson data**
   ```bash
   npm run parse-lessons
   ```

3. **Copy any new images**
   ```bash
   npm run copy-assets
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Update lesson content"
   git push
   ```

The CI/CD pipeline will automatically deploy the changes.

## 🌐 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`
4. Add environment variables (VITE_API_URL)

### Backend (Railway/Render)

1. Connect your GitHub repository
2. Set start command: `cd backend && npm start`
3. Add environment variables (MONGODB_URI, JWT_SECRET, etc.)

### Database (MongoDB Atlas)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string and add to backend environment variables

## 🔧 Technologies Used

### Frontend
- React 18 with Vite
- React Router for routing
- Tailwind CSS for styling
- Monaco Editor for code editing
- Wokwi Embed API for Arduino simulation
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## 📖 Course Content

The course covers 30 days of Arduino learning:
- **Days 1-5**: Foundation (breadboard, LEDs, buttons, PWM, sensors)
- **Days 6-9**: Environmental sensors (DHT, PIR, flame, ultrasonic)
- **Days 10-14**: Displays and motors (7-segment, LCD, servo, DC motor, stepper)
- **Days 15-21**: Advanced sensors and persistence
- **Days 22-28**: Networking and ESP32
- **Days 29-30**: Reliability and capstone project

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting pull requests.

## 📄 License

MIT

## 🙏 Acknowledgments

- Original course content maintained in day01-day30 directories
- Wokwi for Arduino simulation
- Monaco Editor for code editing capabilities

---

For questions or issues, please open a GitHub issue.
