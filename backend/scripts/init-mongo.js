// MongoDB initialization script for Docker
db = db.getSiblingDB('deskill');

// Create collections
db.createCollection('users');
db.createCollection('assessments');
db.createCollection('assessmentsubmissions');

// Create indexes for better performance
db.users.createIndex({ "walletAddress": 1 }, { unique: true });
db.users.createIndex({ "totalSkillsVerified": -1 });
db.users.createIndex({ "reputation": -1 });
db.users.createIndex({ "badges.skillName": 1 });

db.assessments.createIndex({ "skillName": 1, "skillLevel": 1 });
db.assessments.createIndex({ "isActive": 1 });

db.assessmentsubmissions.createIndex({ "userId": 1, "submittedAt": -1 });
db.assessmentsubmissions.createIndex({ "walletAddress": 1 });
db.assessmentsubmissions.createIndex({ "skillName": 1, "passed": 1 });
db.assessmentsubmissions.createIndex({ "badgeEligible": 1, "badgeIssued": 1 });

print('Database initialized successfully!');
