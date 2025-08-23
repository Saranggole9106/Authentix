const express = require('express');
const router = express.Router();
const { verifyToken, attachUser, checkIssuerAuth } = require('../middleware/auth');
const {
  issueBadge,
  getBadgesFromBlockchain,
  syncBadges,
  getPendingBadges,
  verifyBadge
} = require('../controllers/badgeController');

// Issue a new badge (admin/issuer only)
router.post('/issue', verifyToken, attachUser, checkIssuerAuth, issueBadge);

// Get badges from blockchain for a user
router.get('/blockchain/:walletAddress?', verifyToken, attachUser, getBadgesFromBlockchain);

// Sync badges between database and blockchain
router.post('/sync', verifyToken, attachUser, syncBadges);

// Get pending badge issuances (admin only)
router.get('/pending', verifyToken, attachUser, checkIssuerAuth, getPendingBadges);

// Verify badge authenticity (public endpoint)
router.get('/verify/:tokenId', verifyBadge);

module.exports = router;
