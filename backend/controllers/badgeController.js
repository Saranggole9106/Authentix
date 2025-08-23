const { ethers } = require('ethers');
const User = require('../models/User');
const AssessmentSubmission = require('../models/AssessmentSubmission');
const contractInteraction = require('../utils/contractInteraction');
const greenfieldService = require('../services/greenfieldService');

// Initialize blockchain connection (using contractInteraction utility)
const initializeContract = () => {
  return contractInteraction;
};

// Issue a Soulbound Token badge
const issueBadge = async (req, res) => {
  try {
    const { submissionId } = req.body;

    if (!submissionId) {
      return res.status(400).json({
        success: false,
        message: 'Submission ID is required'
      });
    }

    // Get the assessment submission
    const submission = await AssessmentSubmission.findById(submissionId)
      .populate('assessmentId');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Assessment submission not found'
      });
    }

    if (!submission.badgeEligible) {
      return res.status(400).json({
        success: false,
        message: 'Submission is not eligible for badge'
      });
    }

    if (submission.badgeIssued) {
      return res.status(400).json({
        success: false,
        message: 'Badge already issued for this submission'
      });
    }

    // Get user
    const user = await User.findById(submission.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    try {
      // Initialize blockchain contract
      const { contract } = initializeContract();

      // Upload assessment data to BNB Greenfield
      const assessmentData = {
        submissionId: submission._id,
        skillName: submission.skillName,
        skillLevel: submission.skillLevel,
        totalScore: submission.totalScore,
        answers: submission.answers,
        submittedAt: submission.submittedAt,
        userId: submission.userId,
        assessmentId: submission.assessmentId
      };

      const assessmentUpload = await greenfieldService.uploadAssessmentData(
        submission._id,
        assessmentData
      );

      // Generate badge image URL (placeholder - you can upload actual images)
      const imageUrl = `https://gnfd-testnet-sp1.bnbchain.org/view/deskill-badges/images/${submission.skillName.toLowerCase()}-${submission.skillLevel.toLowerCase()}.png`;

      // Create metadata for the badge
      const metadata = greenfieldService.generateBadgeMetadata(submission, null, imageUrl);

      // Upload metadata to BNB Greenfield (will get tokenId after minting)
      const tempTokenId = Date.now(); // Temporary ID for upload
      const metadataUpload = await greenfieldService.uploadBadgeMetadata(
        tempTokenId,
        metadata
      );

      const tokenURI = metadataUpload.url;
      const certificateHash = assessmentUpload.url;

      // Calculate expiry date (1 year from now, 0 for non-expiring)
      const expiryDate = 0; // Non-expiring badges

      // Issue the badge on blockchain with assessment score
      const tx = await contract.issueBadge(
        user.walletAddress,
        submission.skillName,
        submission.skillLevel,
        submission.totalScore, // Pass the assessment score
        tokenURI,
        submission.assessmentId.title || 'AI Assessment'
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Extract token ID from transaction logs
      const issueEvent = receipt.logs.find(log => 
        log.topics[0] === ethers.id("BadgeIssued(address,uint256,string,string,uint256)")
      );
      
      const tokenId = parseInt(issueEvent.topics[2], 16);

      // Update submission record
      submission.badgeIssued = true;
      submission.tokenId = tokenId;
      submission.transactionHash = receipt.hash;
      submission.certificateHash = certificateHash;
      submission.badgeIssuedAt = new Date();
      await submission.save();

      // Update user's badges
      const badgeData = {
        tokenId,
        skillName: submission.skillName,
        skillLevel: submission.skillLevel,
        score: submission.totalScore, // Include assessment score
        issueDate: new Date(),
        expiryDate: null,
        certificateHash,
        isActive: true,
        transactionHash: receipt.hash
      };

      await user.addBadge(badgeData);

      res.json({
        success: true,
        data: {
          tokenId,
          transactionHash: receipt.hash,
          badge: badgeData,
          metadata
        }
      });

    } catch (blockchainError) {
      console.error('Blockchain error:', blockchainError);
      res.status(500).json({
        success: false,
        message: 'Failed to issue badge on blockchain',
        error: blockchainError.message
      });
    }

  } catch (error) {
    console.error('Issue badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to issue badge'
    });
  }
};

// Get badges from blockchain for a user
const getBadgesFromBlockchain = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const targetWallet = walletAddress || req.user.walletAddress;

    const { contract } = initializeContract();

    // Get user's badge token IDs
    const badgeIds = await contract.getUserBadges(targetWallet);
    const badges = [];

    for (const tokenId of badgeIds) {
      try {
        // Get badge details from contract
        const badgeData = await contract.getSkillBadge(tokenId);
        const tokenURI = await contract.tokenURI(tokenId);
        const isExpired = await contract.isExpired(tokenId);

        badges.push({
          tokenId: tokenId.toString(),
          skillName: badgeData.skillName,
          skillLevel: badgeData.skillLevel,
          issueDate: new Date(badgeData.issueDate.toNumber() * 1000),
          expiryDate: badgeData.expiryDate.toNumber() === 0 ? null : new Date(badgeData.expiryDate.toNumber() * 1000),
          issuer: badgeData.issuer,
          certificateHash: badgeData.certificateHash,
          isActive: badgeData.isActive && !isExpired,
          tokenURI,
          isExpired
        });
      } catch (err) {
        console.error(`Error fetching badge ${tokenId}:`, err);
      }
    }

    res.json({
      success: true,
      data: {
        badges,
        totalBadges: badges.length,
        activeBadges: badges.filter(b => b.isActive).length
      }
    });

  } catch (error) {
    console.error('Get badges from blockchain error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch badges from blockchain'
    });
  }
};

// Sync badges between database and blockchain
const syncBadges = async (req, res) => {
  try {
    const user = await User.findByWallet(req.user.walletAddress);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { contract } = initializeContract();

    // Get badges from blockchain
    const badgeIds = await contract.getUserBadges(user.walletAddress);
    const blockchainBadges = [];

    for (const tokenId of badgeIds) {
      try {
        const badgeData = await contract.getSkillBadge(tokenId);
        const isExpired = await contract.isExpired(tokenId);

        blockchainBadges.push({
          tokenId: tokenId.toString(),
          skillName: badgeData.skillName,
          skillLevel: badgeData.skillLevel,
          issueDate: new Date(badgeData.issueDate.toNumber() * 1000),
          expiryDate: badgeData.expiryDate.toNumber() === 0 ? null : new Date(badgeData.expiryDate.toNumber() * 1000),
          certificateHash: badgeData.certificateHash,
          isActive: badgeData.isActive && !isExpired
        });
      } catch (err) {
        console.error(`Error fetching badge ${tokenId}:`, err);
      }
    }

    // Update user's badges in database
    user.badges = blockchainBadges;
    user.totalSkillsVerified = blockchainBadges.filter(b => b.isActive).length;
    await user.save();

    res.json({
      success: true,
      data: {
        syncedBadges: blockchainBadges.length,
        activeBadges: blockchainBadges.filter(b => b.isActive).length
      }
    });

  } catch (error) {
    console.error('Sync badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync badges'
    });
  }
};

// Get pending badge issuances
const getPendingBadges = async (req, res) => {
  try {
    const pendingSubmissions = await AssessmentSubmission.find({
      badgeEligible: true,
      badgeIssued: false
    })
    .populate('userId', 'walletAddress username')
    .populate('assessmentId', 'title skillName skillLevel')
    .sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: {
        pendingBadges: pendingSubmissions,
        count: pendingSubmissions.length
      }
    });

  } catch (error) {
    console.error('Get pending badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending badges'
    });
  }
};

// Verify badge authenticity
const verifyBadge = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const { contract } = initializeContract();

    // Check if token exists
    const owner = await contract.ownerOf(tokenId);
    const badgeData = await contract.getSkillBadge(tokenId);
    const isExpired = await contract.isExpired(tokenId);

    res.json({
      success: true,
      data: {
        tokenId,
        owner,
        skillName: badgeData.skillName,
        skillLevel: badgeData.skillLevel,
        issueDate: new Date(badgeData.issueDate.toNumber() * 1000),
        expiryDate: badgeData.expiryDate.toNumber() === 0 ? null : new Date(badgeData.expiryDate.toNumber() * 1000),
        issuer: badgeData.issuer,
        isActive: badgeData.isActive,
        isExpired,
        isValid: badgeData.isActive && !isExpired
      }
    });

  } catch (error) {
    console.error('Verify badge error:', error);
    res.status(404).json({
      success: false,
      message: 'Badge not found or invalid'
    });
  }
};

module.exports = {
  issueBadge,
  getBadgesFromBlockchain,
  syncBadges,
  getPendingBadges,
  verifyBadge
};
