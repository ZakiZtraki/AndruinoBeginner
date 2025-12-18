import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: String,
    required: true,
    match: /^day\d{2}$/ // Validates format like "day01", "day02", etc.
  },
  completedActivities: [{
    type: String // Activity IDs
  }],
  quizScores: [{
    questionId: String,
    correct: Boolean,
    answer: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  codeSnapshots: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    code: String,
    editorId: String // Which code editor in the lesson
  }],
  watchedVideos: [{
    videoUrl: String,
    watchedAt: {
      type: Date,
      default: Date.now
    }
  }],
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

// Update lastAccessedAt on any modification
progressSchema.pre('save', function(next) {
  this.lastAccessedAt = new Date();
  next();
});

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
