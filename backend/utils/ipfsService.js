const axios = require('axios');
const FormData = require('form-data');

class IPFSService {
  constructor() {
    this.ipfsUrl = process.env.IPFS_API_URL || 'https://ipfs.infura.io:5001';
    this.projectId = process.env.IPFS_PROJECT_ID;
    this.projectSecret = process.env.IPFS_PROJECT_SECRET;
    this.gatewayUrl = 'https://ipfs.io/ipfs/';
  }

  // Upload JSON metadata to IPFS
  async uploadMetadata(metadata) {
    try {
      const data = JSON.stringify(metadata, null, 2);
      const formData = new FormData();
      formData.append('file', Buffer.from(data), {
        filename: 'metadata.json',
        contentType: 'application/json'
      });

      const config = {
        method: 'post',
        url: `${this.ipfsUrl}/api/v0/add`,
        headers: {
          ...formData.getHeaders(),
        },
        data: formData
      };

      // Add auth if credentials are provided
      if (this.projectId && this.projectSecret) {
        config.auth = {
          username: this.projectId,
          password: this.projectSecret
        };
      }

      const response = await axios(config);
      const hash = response.data.Hash;

      return {
        success: true,
        hash,
        url: `${this.gatewayUrl}${hash}`,
        size: response.data.Size
      };

    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      
      // Fallback: generate a mock hash for development
      const mockHash = `Qm${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      return {
        success: false,
        hash: mockHash,
        url: `${this.gatewayUrl}${mockHash}`,
        error: error.message,
        fallback: true
      };
    }
  }

  // Upload certificate data to IPFS
  async uploadCertificate(certificateData) {
    try {
      const data = JSON.stringify(certificateData, null, 2);
      const formData = new FormData();
      formData.append('file', Buffer.from(data), {
        filename: 'certificate.json',
        contentType: 'application/json'
      });

      const config = {
        method: 'post',
        url: `${this.ipfsUrl}/api/v0/add`,
        headers: {
          ...formData.getHeaders(),
        },
        data: formData
      };

      if (this.projectId && this.projectSecret) {
        config.auth = {
          username: this.projectId,
          password: this.projectSecret
        };
      }

      const response = await axios(config);
      const hash = response.data.Hash;

      return {
        success: true,
        hash,
        url: `${this.gatewayUrl}${hash}`,
        size: response.data.Size
      };

    } catch (error) {
      console.error('Error uploading certificate to IPFS:', error);
      
      // Fallback: generate a mock hash for development
      const mockHash = `QmCert${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      return {
        success: false,
        hash: mockHash,
        url: `${this.gatewayUrl}${mockHash}`,
        error: error.message,
        fallback: true
      };
    }
  }

  // Retrieve data from IPFS
  async retrieveData(hash) {
    try {
      const response = await axios.get(`${this.gatewayUrl}${hash}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error retrieving from IPFS:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate badge metadata
  generateBadgeMetadata(skillName, skillLevel, score, userAddress, issueDate) {
    return {
      name: `${skillName} - ${skillLevel} Skill Badge`,
      description: `Verified ${skillLevel} level competency in ${skillName}. Earned through AI-powered assessment on DeSkill platform.`,
      image: `https://api.deskill.com/badges/${skillName.toLowerCase()}-${skillLevel.toLowerCase()}.png`,
      external_url: `https://deskill.com/verify/${userAddress}`,
      attributes: [
        {
          trait_type: "Skill",
          value: skillName
        },
        {
          trait_type: "Level",
          value: skillLevel
        },
        {
          trait_type: "Score",
          value: score,
          display_type: "number"
        },
        {
          trait_type: "Issue Date",
          value: issueDate,
          display_type: "date"
        },
        {
          trait_type: "Platform",
          value: "DeSkill"
        },
        {
          trait_type: "Verification Method",
          value: "AI Assessment"
        },
        {
          trait_type: "Token Type",
          value: "Soulbound"
        }
      ],
      properties: {
        skill: skillName,
        level: skillLevel,
        score: score,
        issuer: "DeSkill Platform",
        verification: "AI-Powered Assessment",
        blockchain: "BNB Smart Chain",
        soulbound: true
      }
    };
  }

  // Generate certificate data
  generateCertificateData(userAddress, skillName, skillLevel, score, assessmentId, issueDate) {
    return {
      certificateId: `DESKILL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      recipient: userAddress,
      skill: {
        name: skillName,
        level: skillLevel,
        score: score
      },
      assessment: {
        id: assessmentId,
        completedAt: issueDate
      },
      issuer: {
        name: "DeSkill Platform",
        address: process.env.CONTRACT_ADDRESS,
        website: "https://deskill.com"
      },
      verification: {
        method: "AI-Powered Assessment",
        blockchain: "BNB Smart Chain",
        network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet'
      },
      issuedAt: issueDate,
      validUntil: null, // Non-expiring
      metadata: {
        version: "1.0",
        standard: "ERC-721",
        soulbound: true
      }
    };
  }
}

// Create singleton instance
const ipfsService = new IPFSService();

module.exports = ipfsService;
