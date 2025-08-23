const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    required: true,
    enum: ['multiple-choice', 'coding', 'essay', 'practical']
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: String,
  points: {
    type: Number,
    required: true,
    min: 1
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  }
});

const assessmentSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  skillLevel: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  },
  duration: {
    type: Number,
    required: true, // in minutes
    min: 5,
    max: 180
  },
  questions: [questionSchema],
  passingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  prerequisites: [{
    skillName: String,
    minimumLevel: String
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    default: 'AI_SYSTEM'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to calculate total points
assessmentSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((total, question) => total + question.points, 0);
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
assessmentSchema.index({ skillName: 1, skillLevel: 1 });
assessmentSchema.index({ isActive: 1 });

// Static method to find assessments by skill
assessmentSchema.statics.findBySkill = function(skillName, level = null) {
  const query = { skillName, isActive: true };
  if (level) query.skillLevel = level;
  return this.find(query);
};

module.exports = mongoose.model('Assessment', assessmentSchema);
