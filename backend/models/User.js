const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  username: {
    type: String,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  profileImage: {
    type: String,
    default: null
  },
  badges: [{
    tokenId: {
      type: Number,
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
    issueDate: {
      type: Date,
      required: true
    },
    expiryDate: {
      type: Date,
      default: null
    },
    certificateHash: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    transactionHash: {
      type: String,
      required: true
    }
  }],
  assessments: [{
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment'
    },
    skillName: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    level: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    aiEvaluation: {
      type: String,
      required: true
    },
    badgeEarned: {
      type: Boolean,
      default: false
    }
  }],
  totalSkillsVerified: {
    type: Number,
    default: 0
  },
  reputation: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
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

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
userSchema.index({ walletAddress: 1 });
userSchema.index({ 'badges.skillName': 1 });
userSchema.index({ totalSkillsVerified: -1 });
userSchema.index({ reputation: -1 });

// Virtual for active badges count
userSchema.virtual('activeBadgesCount').get(function() {
  return this.badges.filter(badge => badge.isActive && 
    (!badge.expiryDate || badge.expiryDate > new Date())).length;
});

// Method to add a new badge
userSchema.methods.addBadge = function(badgeData) {
  this.badges.push(badgeData);
  this.totalSkillsVerified = this.activeBadgesCount;
  this.reputation += this.calculateReputationBonus(badgeData.skillLevel);
  return this.save();
};

// Method to calculate reputation bonus based on skill level
userSchema.methods.calculateReputationBonus = function(skillLevel) {
  const bonusMap = {
    'Beginner': 10,
    'Intermediate': 25,
    'Advanced': 50,
    'Expert': 100
  };
  return bonusMap[skillLevel] || 0;
};

// Method to get active badges
userSchema.methods.getActiveBadges = function() {
  return this.badges.filter(badge => 
    badge.isActive && (!badge.expiryDate || badge.expiryDate > new Date())
  );
};

// Method to check if user has specific skill
userSchema.methods.hasSkill = function(skillName) {
  return this.badges.some(badge => 
    badge.skillName === skillName && 
    badge.isActive && 
    (!badge.expiryDate || badge.expiryDate > new Date())
  );
};

// Static method to find user by wallet address
userSchema.statics.findByWallet = function(walletAddress) {
  return this.findOne({ walletAddress: walletAddress.toLowerCase() });
};

module.exports = mongoose.model('User', userSchema);
