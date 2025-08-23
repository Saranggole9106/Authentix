const User = require('../models/User');
const { generateAuthMessage, generateToken, verifySignature } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Store nonces temporarily (in production, use Redis)
const nonces = new Map();

// Generate nonce for wallet authentication
const generateNonce = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    const nonce = uuidv4();
    const message = generateAuthMessage(walletAddress, nonce);

    // Store nonce with expiration (5 minutes)
    nonces.set(walletAddress.toLowerCase(), {
      nonce,
      message,
      timestamp: Date.now(),
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    res.json({
      success: true,
      data: {
        message,
        nonce
      }
    });
  } catch (error) {
    console.error('Generate nonce error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate authentication nonce'
    });
  }
};

// Authenticate user with MetaMask signature
const authenticate = async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address and signature are required'
      });
    }

    const walletLower = walletAddress.toLowerCase();
    const storedData = nonces.get(walletLower);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'No authentication request found. Please request a new nonce.'
      });
    }

    // Check if nonce has expired
    if (Date.now() > storedData.expires) {
      nonces.delete(walletLower);
      return res.status(400).json({
        success: false,
        message: 'Authentication request expired. Please request a new nonce.'
      });
    }

    // Verify signature
    const isValidSignature = await verifySignature(walletAddress, signature, storedData.message);

    if (!isValidSignature) {
      return res.status(401).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    // Clean up used nonce
    nonces.delete(walletLower);

    // Find or create user
    let user = await User.findByWallet(walletAddress);

    if (!user) {
      user = new User({
        walletAddress: walletLower,
        lastLogin: new Date()
      });
      await user.save();
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(walletAddress, user._id);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          totalSkillsVerified: user.totalSkillsVerified,
          reputation: user.reputation,
          activeBadgesCount: user.activeBadgesCount,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByWallet(req.user.walletAddress);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          totalSkillsVerified: user.totalSkillsVerified,
          reputation: user.reputation,
          activeBadgesCount: user.activeBadgesCount,
          badges: user.getActiveBadges(),
          assessments: user.assessments,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByWallet(req.user.walletAddress);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;

    await user.save();

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          totalSkillsVerified: user.totalSkillsVerified,
          reputation: user.reputation
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// Get user badges
const getUserBadges = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const targetWallet = walletAddress || req.user.walletAddress;
    
    const user = await User.findByWallet(targetWallet);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const activeBadges = user.getActiveBadges();

    res.json({
      success: true,
      data: {
        badges: activeBadges,
        totalBadges: activeBadges.length,
        reputation: user.reputation
      }
    });
  } catch (error) {
    console.error('Get user badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user badges'
    });
  }
};

module.exports = {
  generateNonce,
  authenticate,
  getProfile,
  updateProfile,
  getUserBadges
};
