import mongoose from 'mongoose';

const quizSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: String,
    required: true
  },
  quizId: {
    type: String,
    required: true
  },
  answers: [{
    questionId: String,
    answer: mongoose.Schema.Types.Mixed,
    correct: Boolean,
    points: Number
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
quizSubmissionSchema.index({ userId: 1, lessonId: 1, submittedAt: -1 });

const QuizSubmission = mongoose.model('QuizSubmission', quizSubmissionSchema);

export default QuizSubmission;
