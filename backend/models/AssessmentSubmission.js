const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  pointsEarned: {
    type: Number,
    required: true,
    min: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  }
});

const assessmentSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  walletAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  skillName: {
    type: String,
    required: true
  },
  skillLevel: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  answers: [answerSchema],
  totalScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  pointsEarned: {
    type: Number,
    required: true,
    min: 0
  },
  totalPoints: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number, // total time in seconds
    required: true
  },
  aiEvaluation: {
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    overallFeedback: String,
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  badgeEligible: {
    type: Boolean,
    default: false
  },
  badgeIssued: {
    type: Boolean,
    default: false
  },
  tokenId: {
    type: Number,
    default: null
  },
  transactionHash: {
    type: String,
    default: null
  },
  certificateHash: {
    type: String,
    default: null
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  evaluatedAt: {
    type: Date,
    default: null
  },
  badgeIssuedAt: {
    type: Date,
    default: null
  }
});

// Index for efficient queries
assessmentSubmissionSchema.index({ userId: 1, submittedAt: -1 });
assessmentSubmissionSchema.index({ walletAddress: 1 });
assessmentSubmissionSchema.index({ skillName: 1, passed: 1 });
assessmentSubmissionSchema.index({ badgeEligible: 1, badgeIssued: 1 });

// Method to calculate final score
assessmentSubmissionSchema.methods.calculateScore = function() {
  if (this.totalPoints === 0) return 0;
  return Math.round((this.pointsEarned / this.totalPoints) * 100);
};

// Method to determine if submission passed
assessmentSubmissionSchema.methods.checkPassed = function(passingScore) {
  return this.totalScore >= passingScore;
};

// Static method to get user's best score for a skill
assessmentSubmissionSchema.statics.getBestScore = function(userId, skillName) {
  return this.findOne({
    userId,
    skillName,
    passed: true
  }).sort({ totalScore: -1 });
};

// Static method to get user's submission history
assessmentSubmissionSchema.statics.getUserHistory = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ submittedAt: -1 })
    .limit(limit)
    .populate('assessmentId', 'title skillName skillLevel');
};

module.exports = mongoose.model('AssessmentSubmission', assessmentSubmissionSchema);
