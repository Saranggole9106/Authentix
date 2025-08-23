const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const User = require('../models/User');

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Verify MetaMask signature for authentication
const verifySignature = async (walletAddress, signature, message) => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

// Middleware to verify wallet ownership
const verifyWalletOwnership = async (req, res, next) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address, signature, and message are required'
      });
    }

    const isValidSignature = await verifySignature(walletAddress, signature, message);
    
    if (!isValidSignature) {
      return res.status(401).json({
        success: false,
        message: 'Invalid signature. Wallet ownership verification failed.'
      });
    }

    req.walletAddress = walletAddress.toLowerCase();
    next();
  } catch (error) {
    console.error('Wallet verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Wallet verification failed'
    });
  }
};

// Middleware to check if user exists and attach to request
const attachUser = async (req, res, next) => {
  try {
    if (req.user && req.user.walletAddress) {
      const user = await User.findByWallet(req.user.walletAddress);
      if (user) {
        req.userDoc = user;
      }
    }
    next();
  } catch (error) {
    console.error('Error attaching user:', error);
    next();
  }
};

// Generate authentication message for signing
const generateAuthMessage = (walletAddress, nonce) => {
  return `Welcome to DeSkill!\n\nPlease sign this message to authenticate your wallet.\n\nWallet: ${walletAddress}\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;
};

// Generate JWT token
const generateToken = (walletAddress, userId) => {
  return jwt.sign(
    { 
      walletAddress: walletAddress.toLowerCase(),
      userId: userId
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Middleware to check if user is authorized issuer for smart contract
const checkIssuerAuth = async (req, res, next) => {
  try {
    // In production, you would check if the user's wallet is authorized
    // to issue badges on the smart contract
    const authorizedIssuers = process.env.AUTHORIZED_ISSUERS?.split(',') || [];
    
    if (req.user && authorizedIssuers.includes(req.user.walletAddress)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Not authorized to issue badges'
      });
    }
  } catch (error) {
    console.error('Issuer authorization error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization check failed'
    });
  }
};

module.exports = {
  verifyToken,
  verifySignature,
  verifyWalletOwnership,
  attachUser,
  generateAuthMessage,
  generateToken,
  checkIssuerAuth
};
