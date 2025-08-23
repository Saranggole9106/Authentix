const express = require('express');
const router = express.Router();
const { verifyToken, attachUser } = require('../middleware/auth');
const {
  generateNonce,
  authenticate,
  getProfile,
  updateProfile,
  getUserBadges
} = require('../controllers/authController');

// Generate nonce for wallet authentication
router.post('/nonce', generateNonce);

// Authenticate with MetaMask signature
router.post('/authenticate', authenticate);

// Get current user profile
router.get('/profile', verifyToken, attachUser, getProfile);

// Update user profile
router.put('/profile', verifyToken, attachUser, updateProfile);

// Get user badges
router.get('/badges/:walletAddress?', verifyToken, attachUser, getUserBadges);

module.exports = router;
