const ipfsService = require('./ipfsService');
const contractInteraction = require('./contractInteraction');

class BadgeGenerator {
  // Generate and mint a skill badge
  async generateBadge(submissionData) {
    try {
      const {
        userAddress,
        skillName,
        skillLevel,
        score,
        assessmentId,
        submissionId
      } = submissionData;

      const issueDate = new Date().toISOString();

      // Generate badge metadata
      const metadata = ipfsService.generateBadgeMetadata(
        skillName,
        skillLevel,
        score,
        userAddress,
        issueDate
      );

      // Upload metadata to IPFS
      const metadataResult = await ipfsService.uploadMetadata(metadata);
      if (!metadataResult.success && !metadataResult.fallback) {
        throw new Error('Failed to upload badge metadata to IPFS');
      }

      // Generate certificate data
      const certificateData = ipfsService.generateCertificateData(
        userAddress,
        skillName,
        skillLevel,
        score,
        assessmentId,
        issueDate
      );

      // Upload certificate to IPFS
      const certificateResult = await ipfsService.uploadCertificate(certificateData);
      if (!certificateResult.success && !certificateResult.fallback) {
        throw new Error('Failed to upload certificate to IPFS');
      }

      // Issue badge on blockchain
      const badgeResult = await contractInteraction.issueSkillBadge(
        userAddress,
        skillName,
        skillLevel,
        metadataResult.url,
        certificateResult.hash
      );

      if (!badgeResult.success) {
        throw new Error(`Failed to issue badge on blockchain: ${badgeResult.error}`);
      }

      return {
        success: true,
        tokenId: badgeResult.tokenId,
        transactionHash: badgeResult.transactionHash,
        metadataHash: metadataResult.hash,
        metadataUrl: metadataResult.url,
        certificateHash: certificateResult.hash,
        certificateUrl: certificateResult.url,
        blockNumber: badgeResult.blockNumber,
        gasUsed: badgeResult.gasUsed,
        metadata,
        certificateData
      };

    } catch (error) {
      console.error('Error generating badge:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Batch generate badges for multiple submissions
  async batchGenerateBadges(submissions) {
    const results = [];
    
    for (const submission of submissions) {
      try {
        const result = await this.generateBadge(submission);
        results.push({
          submissionId: submission.submissionId,
          ...result
        });
        
        // Add delay between transactions to avoid nonce issues
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        results.push({
          submissionId: submission.submissionId,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  // Verify badge authenticity
  async verifyBadge(tokenId) {
    try {
      const result = await contractInteraction.verifyBadge(tokenId);
      return result;
    } catch (error) {
      console.error('Error verifying badge:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user's badges with metadata
  async getUserBadgesWithMetadata(userAddress) {
    try {
      const badgesResult = await contractInteraction.getUserBadges(userAddress);
      
      if (!badgesResult.success) {
        return badgesResult;
      }

      const badgesWithMetadata = [];
      
      for (const badge of badgesResult.badges) {
        try {
          // Try to fetch metadata from IPFS
          let metadata = null;
          if (badge.tokenURI) {
            const hash = badge.tokenURI.split('/').pop();
            const metadataResult = await ipfsService.retrieveData(hash);
            if (metadataResult.success) {
              metadata = metadataResult.data;
            }
          }

          badgesWithMetadata.push({
            ...badge,
            metadata
          });
        } catch (error) {
          console.error(`Error fetching metadata for badge ${badge.tokenId}:`, error);
          badgesWithMetadata.push(badge);
        }
      }

      return {
        success: true,
        badges: badgesWithMetadata,
        totalBadges: badgesWithMetadata.length,
        activeBadges: badgesWithMetadata.filter(b => b.isActive).length
      };

    } catch (error) {
      console.error('Error getting user badges with metadata:', error);
      return {
        success: false,
        error: error.message,
        badges: []
      };
    }
  }

  // Generate badge image URL (placeholder implementation)
  generateBadgeImageUrl(skillName, skillLevel) {
    const baseUrl = process.env.BADGE_IMAGE_BASE_URL || 'https://api.deskill.com/badges';
    const skillSlug = skillName.toLowerCase().replace(/\s+/g, '-');
    const levelSlug = skillLevel.toLowerCase();
    
    return `${baseUrl}/${skillSlug}-${levelSlug}.png`;
  }

  // Get badge statistics
  async getBadgeStatistics() {
    try {
      const stats = await contractInteraction.getContractStats();
      return stats;
    } catch (error) {
      console.error('Error getting badge statistics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Create singleton instance
const badgeGenerator = new BadgeGenerator();

module.exports = badgeGenerator;
