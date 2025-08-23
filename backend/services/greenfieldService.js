const { Client } = require('@bnb-chain/greenfield-js-sdk');
const fs = require('fs');
const path = require('path');

class GreenfieldService {
  constructor() {
    this.client = null;
    this.bucketName = process.env.GREENFIELD_BUCKET_NAME || 'deskill-badges';
    this.endpoint = process.env.GREENFIELD_ENDPOINT || 'https://gnfd-testnet-sp1.bnbchain.org';
    this.chainId = process.env.GREENFIELD_CHAIN_ID || '5600';
  }

  async initialize() {
    try {
      this.client = Client.create(this.endpoint, this.chainId);
      console.log('BNB Greenfield client initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize Greenfield client:', error);
      return false;
    }
  }

  async createBucket() {
    try {
      if (!this.client) await this.initialize();

      const bucketInfo = {
        bucketName: this.bucketName,
        creator: process.env.GREENFIELD_ACCOUNT_ADDRESS,
        visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
        paymentAddress: process.env.GREENFIELD_ACCOUNT_ADDRESS,
        primarySpAddress: process.env.GREENFIELD_SP_ADDRESS,
        chargedReadQuota: '0'
      };

      const result = await this.client.bucket.createBucket(bucketInfo);
      console.log('Bucket created:', result);
      return result;
    } catch (error) {
      console.error('Error creating bucket:', error);
      throw error;
    }
  }

  async uploadBadgeMetadata(tokenId, metadata) {
    try {
      if (!this.client) await this.initialize();

      const fileName = `badge-${tokenId}.json`;
      const objectName = `metadata/${fileName}`;
      
      // Convert metadata to buffer
      const metadataBuffer = Buffer.from(JSON.stringify(metadata, null, 2));

      const uploadInfo = {
        bucketName: this.bucketName,
        objectName: objectName,
        body: metadataBuffer,
        txnHash: ''
      };

      const result = await this.client.object.createObject(uploadInfo);
      
      // Generate public URL
      const publicUrl = `${this.endpoint}/view/${this.bucketName}/${objectName}`;
      
      console.log(`Badge metadata uploaded to Greenfield: ${publicUrl}`);
      
      return {
        success: true,
        url: publicUrl,
        objectName: objectName,
        txnHash: result.txnHash
      };
    } catch (error) {
      console.error('Error uploading to Greenfield:', error);
      throw error;
    }
  }

  async uploadAssessmentData(submissionId, assessmentData) {
    try {
      if (!this.client) await this.initialize();

      const fileName = `assessment-${submissionId}.json`;
      const objectName = `assessments/${fileName}`;
      
      // Include timestamp and verification info
      const fullData = {
        ...assessmentData,
        uploadedAt: new Date().toISOString(),
        platform: 'DeSkill',
        verified: true,
        immutable: true
      };
      
      const dataBuffer = Buffer.from(JSON.stringify(fullData, null, 2));

      const uploadInfo = {
        bucketName: this.bucketName,
        objectName: objectName,
        body: dataBuffer,
        txnHash: ''
      };

      const result = await this.client.object.createObject(uploadInfo);
      
      const publicUrl = `${this.endpoint}/view/${this.bucketName}/${objectName}`;
      
      console.log(`Assessment data uploaded to Greenfield: ${publicUrl}`);
      
      return {
        success: true,
        url: publicUrl,
        objectName: objectName,
        txnHash: result.txnHash
      };
    } catch (error) {
      console.error('Error uploading assessment data to Greenfield:', error);
      throw error;
    }
  }

  async uploadBadgeImage(skillName, level, imageBuffer) {
    try {
      if (!this.client) await this.initialize();

      const fileName = `${skillName.toLowerCase()}-${level.toLowerCase()}.png`;
      const objectName = `images/${fileName}`;

      const uploadInfo = {
        bucketName: this.bucketName,
        objectName: objectName,
        body: imageBuffer,
        txnHash: ''
      };

      const result = await this.client.object.createObject(uploadInfo);
      
      const publicUrl = `${this.endpoint}/view/${this.bucketName}/${objectName}`;
      
      console.log(`Badge image uploaded to Greenfield: ${publicUrl}`);
      
      return {
        success: true,
        url: publicUrl,
        objectName: objectName,
        txnHash: result.txnHash
      };
    } catch (error) {
      console.error('Error uploading badge image to Greenfield:', error);
      throw error;
    }
  }

  async getBadgeMetadata(tokenId) {
    try {
      if (!this.client) await this.initialize();

      const objectName = `metadata/badge-${tokenId}.json`;
      
      const result = await this.client.object.getObject({
        bucketName: this.bucketName,
        objectName: objectName
      });

      return JSON.parse(result.body.toString());
    } catch (error) {
      console.error('Error retrieving badge metadata from Greenfield:', error);
      throw error;
    }
  }

  async getAssessmentData(submissionId) {
    try {
      if (!this.client) await this.initialize();

      const objectName = `assessments/assessment-${submissionId}.json`;
      
      const result = await this.client.object.getObject({
        bucketName: this.bucketName,
        objectName: objectName
      });

      return JSON.parse(result.body.toString());
    } catch (error) {
      console.error('Error retrieving assessment data from Greenfield:', error);
      throw error;
    }
  }

  generateBadgeMetadata(submission, tokenId, imageUrl) {
    return {
      name: `${submission.skillName} - ${submission.skillLevel}`,
      description: `Verified ${submission.skillLevel} level skill in ${submission.skillName}. Score: ${submission.totalScore}%`,
      image: imageUrl,
      external_url: `https://deskill.com/verify/${tokenId}`,
      attributes: [
        {
          trait_type: "Skill",
          value: submission.skillName
        },
        {
          trait_type: "Level",
          value: submission.skillLevel
        },
        {
          trait_type: "Score",
          value: submission.totalScore,
          display_type: "number",
          max_value: 100
        },
        {
          trait_type: "Assessment Type",
          value: submission.assessmentType || "AI Evaluation"
        },
        {
          trait_type: "Issue Date",
          value: new Date().toISOString(),
          display_type: "date"
        },
        {
          trait_type: "Platform",
          value: "DeSkill"
        },
        {
          trait_type: "Blockchain",
          value: "BNB Chain"
        },
        {
          trait_type: "Token Type",
          value: "Soulbound"
        }
      ],
      properties: {
        assessment_score: submission.totalScore,
        skill_verified: true,
        soulbound: true,
        transferable: false,
        storage: "BNB Greenfield"
      }
    };
  }
}

module.exports = new GreenfieldService();
