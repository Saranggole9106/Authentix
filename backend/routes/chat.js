const express = require('express');
const router = express.Router();
const { chatWithBot } = require('../controllers/chatController');

// POST /api/chat - Chat with AI assistant
router.post('/', chatWithBot);

module.exports = router;
