const { ethers } = require('ethers');
const contractABI = require('../contracts/SoulboundSkillToken.json');

class ContractInteraction {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.contract = null;
    this.initialized = false;
  }

  // Initialize the contract connection
  async initialize() {
    try {
      if (!process.env.BSC_RPC_URL || !process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
        throw new Error('Missing required environment variables for blockchain interaction');
      }

      // Create provider
      this.provider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);
      
      // Create wallet
      this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      
      // Create contract instance
      this.contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        contractABI.abi,
        this.wallet
      );

      // Test connection
      await this.provider.getNetwork();
      
      this.initialized = true;
      console.log('Blockchain connection initialized successfully');
      
      return true;
    } catch (error) {
      console.error('Failed to initialize blockchain connection:', error);
      return false;
    }
  }

  // Ensure contract is initialized
  async ensureInitialized() {
    if (!this.initialized) {
      const success = await this.initialize();
      if (!success) {
        throw new Error('Failed to initialize blockchain connection');
      }
    }
  }

  // Issue a skill badge NFT
  async issueSkillBadge(recipientAddress, skillName, skillLevel, tokenURI, certificateHash) {
    try {
      await this.ensureInitialized();

      const expiryDate = 0; // Non-expiring badges
      
      // Estimate gas
      const gasEstimate = await this.contract.issueSkillBadge.estimateGas(
        recipientAddress,
        skillName,
        skillLevel,
        expiryDate,
        tokenURI,
        certificateHash
      );

      // Add 20% buffer to gas estimate
      const gasLimit = Math.floor(Number(gasEstimate) * 1.2);

      // Execute transaction
      const tx = await this.contract.issueSkillBadge(
        recipientAddress,
        skillName,
        skillLevel,
        expiryDate,
        tokenURI,
        certificateHash,
        { gasLimit }
      );

      console.log(`Badge issuance transaction sent: ${tx.hash}`);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Extract token ID from events
      const issueEvent = receipt.logs.find(log => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed.name === 'SkillBadgeIssued';
        } catch {
          return false;
        }
      });

      let tokenId = null;
      if (issueEvent) {
        const parsed = this.contract.interface.parseLog(issueEvent);
        tokenId = Number(parsed.args.tokenId);
      }

      return {
        success: true,
        transactionHash: receipt.hash,
        tokenId,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error) {
      console.error('Error issuing skill badge:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user's badges
  async getUserBadges(userAddress) {
    try {
      await this.ensureInitialized();

      const badgeIds = await this.contract.getUserBadges(userAddress);
      const badges = [];

      for (const tokenId of badgeIds) {
        try {
          const badgeData = await this.contract.getSkillBadge(tokenId);
          const tokenURI = await this.contract.tokenURI(tokenId);
          const isExpired = await this.contract.isExpired(tokenId);

          badges.push({
            tokenId: tokenId.toString(),
            skillName: badgeData.skillName,
            skillLevel: badgeData.skillLevel,
            issueDate: new Date(Number(badgeData.issueDate) * 1000),
            expiryDate: Number(badgeData.expiryDate) === 0 ? null : new Date(Number(badgeData.expiryDate) * 1000),
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

      return {
        success: true,
        badges,
        totalBadges: badges.length,
        activeBadges: badges.filter(b => b.isActive).length
      };

    } catch (error) {
      console.error('Error getting user badges:', error);
      return {
        success: false,
        error: error.message,
        badges: []
      };
    }
  }

  // Verify badge authenticity
  async verifyBadge(tokenId) {
    try {
      await this.ensureInitialized();

      const owner = await this.contract.ownerOf(tokenId);
      const badgeData = await this.contract.getSkillBadge(tokenId);
      const isExpired = await this.contract.isExpired(tokenId);

      return {
        success: true,
        tokenId: tokenId.toString(),
        owner,
        skillName: badgeData.skillName,
        skillLevel: badgeData.skillLevel,
        issueDate: new Date(Number(badgeData.issueDate) * 1000),
        expiryDate: Number(badgeData.expiryDate) === 0 ? null : new Date(Number(badgeData.expiryDate) * 1000),
        issuer: badgeData.issuer,
        certificateHash: badgeData.certificateHash,
        isActive: badgeData.isActive,
        isExpired,
        isValid: badgeData.isActive && !isExpired
      };

    } catch (error) {
      console.error('Error verifying badge:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check if user has a specific skill
  async hasActiveSkill(userAddress, skillName) {
    try {
      await this.ensureInitialized();
      
      const hasSkill = await this.contract.hasActiveSkill(userAddress, skillName);
      return {
        success: true,
        hasSkill
      };

    } catch (error) {
      console.error('Error checking active skill:', error);
      return {
        success: false,
        error: error.message,
        hasSkill: false
      };
    }
  }

  // Get contract statistics
  async getContractStats() {
    try {
      await this.ensureInitialized();

      const totalSupply = await this.contract.totalSupply();
      
      return {
        success: true,
        totalBadgesIssued: totalSupply.toString(),
        contractAddress: process.env.CONTRACT_ADDRESS,
        network: (await this.provider.getNetwork()).name
      };

    } catch (error) {
      console.error('Error getting contract stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Authorize a new issuer (only contract owner)
  async authorizeIssuer(issuerAddress) {
    try {
      await this.ensureInitialized();

      const tx = await this.contract.authorizeIssuer(issuerAddress);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        issuerAddress
      };

    } catch (error) {
      console.error('Error authorizing issuer:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Revoke badge (mark as inactive)
  async revokeBadge(tokenId, reason) {
    try {
      await this.ensureInitialized();

      const tx = await this.contract.revokeSkillBadge(tokenId, reason);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        tokenId: tokenId.toString(),
        reason
      };

    } catch (error) {
      console.error('Error revoking badge:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Create singleton instance
const contractInteraction = new ContractInteraction();

module.exports = contractInteraction;
