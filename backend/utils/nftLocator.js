const { ethers } = require('ethers');
const contractInteraction = require('./contractInteraction');
const greenfieldService = require('../services/greenfieldService');

class NFTLocator {
  constructor() {
    this.contractAddress = process.env.CONTRACT_ADDRESS;
    this.bscScanUrl = 'https://testnet.bscscan.com';
    this.greenfieldUrl = 'https://gnfd-testnet-sp1.bnbchain.org';
  }

  // Get all NFT locations for a user
  async getUserNFTLocations(userAddress) {
    try {
      const { contract } = contractInteraction;
      
      // Get user's token IDs from contract
      const tokenIds = await contract.getUserTokens(userAddress);
      
      const nftLocations = [];
      
      for (const tokenId of tokenIds) {
        const location = await this.getNFTLocation(tokenId);
        nftLocations.push(location);
      }
      
      return nftLocations;
    } catch (error) {
      console.error('Error getting user NFT locations:', error);
      throw error;
    }
  }

  // Get specific NFT location details
  async getNFTLocation(tokenId) {
    try {
      const { contract } = contractInteraction;
      
      // Get badge data from smart contract
      const badgeData = await contract.getSkillBadge(tokenId);
      
      // Get token URI (Greenfield metadata URL)
      const tokenURI = await contract.tokenURI(tokenId);
      
      return {
        tokenId: tokenId.toString(),
        smartContract: {
          address: this.contractAddress,
          network: 'BNB Smart Chain Testnet',
          bscScanUrl: `${this.bscScanUrl}/token/${this.contractAddress}?a=${tokenId}`,
          readContractUrl: `${this.bscScanUrl}/address/${this.contractAddress}#readContract`
        },
        onChainData: {
          skillName: badgeData.skillName,
          level: badgeData.level,
          score: badgeData.score.toString(),
          issuedAt: new Date(badgeData.issuedAt.toNumber() * 1000).toISOString(),
          issuer: badgeData.issuer,
          assessmentType: badgeData.assessmentType
        },
        greenfieldStorage: {
          metadataUrl: tokenURI,
          bucketName: 'deskill-badges',
          endpoint: this.greenfieldUrl,
          metadataPath: `/view/deskill-badges/metadata/badge-${tokenId}.json`,
          directUrl: `${this.greenfieldUrl}/view/deskill-badges/metadata/badge-${tokenId}.json`
        },
        verification: {
          bscScan: `${this.bscScanUrl}/token/${this.contractAddress}?a=${tokenId}`,
          greenfield: `${this.greenfieldUrl}/view/deskill-badges/metadata/badge-${tokenId}.json`,
          immutable: true,
          transferable: false,
          soulbound: true
        }
      };
    } catch (error) {
      console.error(`Error getting NFT location for token ${tokenId}:`, error);
      throw error;
    }
  }

  // Get assessment data location
  async getAssessmentDataLocation(submissionId) {
    try {
      const assessmentUrl = `${this.greenfieldUrl}/view/deskill-badges/assessments/assessment-${submissionId}.json`;
      
      return {
        submissionId,
        greenfieldStorage: {
          url: assessmentUrl,
          bucketName: 'deskill-badges',
          endpoint: this.greenfieldUrl,
          path: `/assessments/assessment-${submissionId}.json`
        },
        verification: {
          publiclyAccessible: true,
          immutable: true,
          decentralized: true
        }
      };
    } catch (error) {
      console.error(`Error getting assessment data location for ${submissionId}:`, error);
      throw error;
    }
  }

  // Check if NFT exists
  async nftExists(tokenId) {
    try {
      const { contract } = contractInteraction;
      
      // Try to get owner - will throw if token doesn't exist
      const owner = await contract.ownerOf(tokenId);
      return owner !== ethers.constants.AddressZero;
    } catch (error) {
      return false;
    }
  }

  // Get total supply of NFTs
  async getTotalNFTs() {
    try {
      const { contract } = contractInteraction;
      const totalSupply = await contract.totalSupply();
      return totalSupply.toNumber();
    } catch (error) {
      console.error('Error getting total NFT supply:', error);
      return 0;
    }
  }

  // Get all NFT locations summary
  async getAllNFTsSummary() {
    try {
      const totalSupply = await this.getTotalNFTs();
      
      return {
        totalNFTs: totalSupply,
        contractAddress: this.contractAddress,
        network: 'BNB Smart Chain Testnet',
        storageLocations: {
          blockchain: {
            name: 'BNB Smart Chain',
            type: 'On-chain storage',
            url: `${this.bscScanUrl}/address/${this.contractAddress}`,
            immutable: true,
            decentralized: true
          },
          greenfield: {
            name: 'BNB Greenfield',
            type: 'Decentralized storage',
            url: `${this.greenfieldUrl}/view/deskill-badges/`,
            immutable: true,
            decentralized: true
          }
        },
        verification: {
          bscScan: `${this.bscScanUrl}/address/${this.contractAddress}`,
          contractRead: `${this.bscScanUrl}/address/${this.contractAddress}#readContract`,
          greenfieldBucket: `${this.greenfieldUrl}/view/deskill-badges/`
        }
      };
    } catch (error) {
      console.error('Error getting NFTs summary:', error);
      throw error;
    }
  }
}

module.exports = new NFTLocator();
