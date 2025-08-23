const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user's NFT locations
router.get('/my-nfts', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'User wallet address not found'
      });
    }

    // Return user's badges from database for now
    res.json({
      success: true,
      data: {
        userAddress: user.walletAddress,
        totalNFTs: user.badges ? user.badges.length : 0,
        nfts: user.badges || []
      }
    });
  } catch (error) {
    console.error('Error getting user NFTs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get NFT locations'
    });
  }
});

// Get contract summary
router.get('/summary', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        contractAddress: process.env.CONTRACT_ADDRESS,
        network: 'BNB Smart Chain Testnet',
        bscScanUrl: `https://testnet.bscscan.com/address/${process.env.CONTRACT_ADDRESS}`,
        greenfieldBucket: 'deskill-badges',
        greenfieldUrl: 'https://gnfd-testnet-sp1.bnbchain.org/view/deskill-badges/'
      }
    });
  } catch (error) {
    console.error('Error getting NFTs summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get NFTs summary'
    });
  }
});

module.exports = router;
