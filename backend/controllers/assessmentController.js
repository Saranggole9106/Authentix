const Assessment = require('../models/Assessment');
const AssessmentSubmission = require('../models/AssessmentSubmission');
const User = require('../models/User');
const { evaluateWithAI } = require('../services/aiService');

// Get all available assessments
const getAssessments = async (req, res) => {
  try {
    const { skillName, skillLevel, page = 1, limit = 10 } = req.query;
    
    const query = { isActive: true };
    if (skillName) query.skillName = skillName;
    if (skillLevel) query.skillLevel = skillLevel;

    const assessments = await Assessment.find(query)
      .select('-questions.correctAnswer -questions.options.isCorrect')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Assessment.countDocuments(query);

    res.json({
      success: true,
      data: {
        assessments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessments'
    });
  }
};

// Get specific assessment by ID
const getAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const assessment = await Assessment.findById(id)
      .select('-questions.correctAnswer -questions.options.isCorrect');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Check if user has already passed this assessment
    const existingSubmission = await AssessmentSubmission.findOne({
      userId: req.user.userId,
      assessmentId: id,
      passed: true
    });

    res.json({
      success: true,
      data: {
        assessment,
        alreadyPassed: !!existingSubmission,
        existingScore: existingSubmission?.totalScore
      }
    });
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment'
    });
  }
};

// Submit assessment answers
const submitAssessment = async (req, res) => {
  try {
    const { assessmentId, answers, timeSpent } = req.body;

    if (!assessmentId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Assessment ID and answers are required'
      });
    }

    // Get the assessment with correct answers
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Get user
    const user = await User.findByWallet(req.user.walletAddress);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Evaluate answers
    let pointsEarned = 0;
    const evaluatedAnswers = [];

    for (let i = 0; i < answers.length; i++) {
      const userAnswer = answers[i];
      const question = assessment.questions.find(q => q._id.toString() === userAnswer.questionId);
      
      if (!question) continue;

      let isCorrect = false;
      let earnedPoints = 0;

      // Evaluate based on question type
      switch (question.questionType) {
        case 'multiple-choice':
          isCorrect = userAnswer.answer === question.correctAnswer;
          earnedPoints = isCorrect ? question.points : 0;
          break;
        
        case 'coding':
        case 'essay':
          // For coding and essay questions, use AI evaluation
          const aiResult = await evaluateWithAI(question.questionText, userAnswer.answer, question.questionType);
          isCorrect = aiResult.score >= 70; // 70% threshold
          earnedPoints = Math.round((aiResult.score / 100) * question.points);
          break;
        
        default:
          isCorrect = userAnswer.answer === question.correctAnswer;
          earnedPoints = isCorrect ? question.points : 0;
      }

      pointsEarned += earnedPoints;
      evaluatedAnswers.push({
        questionId: question._id,
        userAnswer: userAnswer.answer,
        isCorrect,
        pointsEarned: earnedPoints,
        timeSpent: userAnswer.timeSpent || 0
      });
    }

    // Calculate final score
    const totalScore = Math.round((pointsEarned / assessment.totalPoints) * 100);
    const passed = totalScore >= assessment.passingScore;

    // Generate AI evaluation and feedback
    const aiEvaluation = await evaluateWithAI(
      `Assessment: ${assessment.title}\nSkill: ${assessment.skillName}\nLevel: ${assessment.skillLevel}`,
      JSON.stringify(evaluatedAnswers),
      'assessment-summary'
    );

    // Create submission record
    const submission = new AssessmentSubmission({
      userId: user._id,
      walletAddress: user.walletAddress,
      assessmentId: assessment._id,
      skillName: assessment.skillName,
      skillLevel: assessment.skillLevel,
      answers: evaluatedAnswers,
      totalScore,
      pointsEarned,
      totalPoints: assessment.totalPoints,
      passed,
      timeSpent: timeSpent || 0,
      aiEvaluation: {
        strengths: aiEvaluation.strengths || [],
        weaknesses: aiEvaluation.weaknesses || [],
        recommendations: aiEvaluation.recommendations || [],
        overallFeedback: aiEvaluation.feedback || '',
        confidenceScore: aiEvaluation.confidence || 85
      },
      badgeEligible: passed,
      evaluatedAt: new Date()
    });

    await submission.save();

    // Update user's assessment history
    user.assessments.push({
      assessmentId: assessment._id,
      skillName: assessment.skillName,
      score: totalScore,
      level: assessment.skillLevel,
      completedAt: new Date(),
      aiEvaluation: aiEvaluation.feedback || '',
      badgeEarned: passed
    });

    await user.save();

    res.json({
      success: true,
      data: {
        submission: {
          id: submission._id,
          totalScore,
          passed,
          pointsEarned,
          totalPoints: assessment.totalPoints,
          badgeEligible: passed,
          aiEvaluation: submission.aiEvaluation,
          submittedAt: submission.submittedAt
        }
      }
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit assessment'
    });
  }
};

// Get user's assessment history
const getAssessmentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const submissions = await AssessmentSubmission.find({
      userId: req.user.userId
    })
    .populate('assessmentId', 'title skillName skillLevel')
    .sort({ submittedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await AssessmentSubmission.countDocuments({
      userId: req.user.userId
    });

    res.json({
      success: true,
      data: {
        submissions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get assessment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assessment history'
    });
  }
};

// Get available skills
const getSkills = async (req, res) => {
  try {
    const skills = await Assessment.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$skillName',
          levels: { $addToSet: '$skillLevel' },
          totalAssessments: { $sum: 1 },
          description: { $first: '$description' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: { skills }
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills'
    });
  }
};

module.exports = {
  getAssessments,
  getAssessment,
  submitAssessment,
  getAssessmentHistory,
  getSkills
};
