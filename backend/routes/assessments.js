const express = require('express');
const router = express.Router();
const { verifyToken, attachUser } = require('../middleware/auth');
const {
  getAssessments,
  getAssessment,
  submitAssessment,
  getAssessmentHistory,
  getSkills
} = require('../controllers/assessmentController');

// Get all available assessments
router.get('/', getAssessments);

// Get available skills
router.get('/skills', getSkills);

// Get specific assessment by ID
router.get('/:id', verifyToken, attachUser, getAssessment);

// Submit assessment answers
router.post('/submit', verifyToken, attachUser, submitAssessment);

// Get user's assessment history
router.get('/user/history', verifyToken, attachUser, getAssessmentHistory);

module.exports = router;
