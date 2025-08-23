const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
let genAI;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const chatWithBot = async (req, res) => {
  try {
    const { message, context, conversationHistory } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Create system prompt with context
    const systemPrompt = `You are Jarvis, a helpful AI assistant for the DeSkill platform - an AI-powered skill verification platform that uses blockchain technology to issue Soulbound Token (NFT) badges.

Platform Overview:
- DeSkill helps users verify their technical skills through AI-powered assessments
- Users earn Soulbound Token badges on BNB Smart Chain for passing assessments (70%+ score)
- Badges are non-transferable NFTs that represent verified skills
- Platform supports skills like JavaScript, React, Node.js, Python, Solidity, Machine Learning

User Context:
${context.isAuthenticated ? `
- User is logged in as: ${context.user.username || 'Anonymous'}
- Skills verified: ${context.user.totalSkillsVerified}
- Active badges: ${context.user.activeBadgesCount}
- Reputation score: ${context.user.reputation}
` : '- User is not logged in'}

Guidelines:
- Be helpful, friendly, and concise
- Focus on DeSkill platform features and blockchain skill verification
- Encourage users to take assessments and earn badges
- Provide guidance on wallet connection, assessments, and skill development
- If asked about technical topics, relate them to available assessments
- Keep responses under 200 words unless detailed explanation is needed
- Use emojis sparingly and professionally

Current conversation context: The user is asking about the DeSkill platform.`;

    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here' || !genAI) {
      console.log('Gemini API key not configured, using fallback responses');
      const fallbackResponse = generateFallbackResponse(message, context);
      return res.json({
        success: true,
        response: fallbackResponse
      });
    }

    console.log('Using Gemini API for chat response');

    // Prepare conversation context for Gemini
    let conversationContext = '';
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = conversationHistory.slice(-4).map(msg => 
        `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');
    }

    // Create full prompt for Gemini
    const fullPrompt = `${systemPrompt}

${conversationContext ? `Previous conversation:\n${conversationContext}\n` : ''}
User: ${message}`;

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate response from Gemini
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const botResponse = response.text();

    res.json({
      success: true,
      response: botResponse
    });

  } catch (error) {
    console.error('Chat error:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('Gemini API key is invalid. Using fallback responses.');
    }
    
    // Fallback response on error
    const fallbackResponse = generateFallbackResponse(req.body.message, req.body.context);
    
    res.json({
      success: true,
      response: fallbackResponse
    });
  }
};

const generateFallbackResponse = (message, context) => {
  const msg = message.toLowerCase();
  
  // Assessment-related queries
  if (msg.includes('assessment') || msg.includes('test') || msg.includes('exam')) {
    return `📝 **About Assessments:**

• Browse available assessments on the Skills or Assessments page
• You need 70%+ score to earn a blockchain badge
• ${context.isAuthenticated ? 'You can start taking assessments right away!' : 'Connect your wallet first to save your progress'}
• AI-powered questions adapt to test your real knowledge

${context.isAuthenticated ? `You currently have ${context.user.totalSkillsVerified} verified skills!` : 'Sign in to track your progress and earn badges.'}`;
  }
  
  // Badge/NFT related queries
  if (msg.includes('badge') || msg.includes('nft') || msg.includes('token') || msg.includes('soulbound')) {
    return `🏆 **About Skill Badges:**

• Soulbound NFTs on BNB Smart Chain testnet
• Non-transferable proof of your verified skills
• Earned by passing assessments with 70%+ score
• Stored permanently on blockchain
• ${context.isAuthenticated ? `You have ${context.user.activeBadgesCount} active badges!` : 'Connect wallet to start earning badges'}

View your badges in the Dashboard after earning them!`;
  }
  
  // Wallet connection queries
  if (msg.includes('wallet') || msg.includes('connect') || msg.includes('metamask')) {
    return `🔗 **Wallet Connection:**

• Click "Connect Wallet" in the header
• Supports MetaMask and WalletConnect
• Make sure you're on BNB Smart Chain testnet
• Required for earning and storing blockchain badges
• Your progress is saved to your wallet address

${context.isAuthenticated ? 'Your wallet is already connected! 🎉' : 'Connect now to start your skill verification journey.'}`;
  }
  
  // Skills and learning queries
  if (msg.includes('skill') || msg.includes('learn') || msg.includes('study')) {
    return `📚 **Available Skills:**

• **Frontend:** JavaScript, React
• **Backend:** Node.js, Python  
• **Blockchain:** Solidity
• **AI/ML:** Machine Learning

Each skill has multiple difficulty levels (Beginner to Expert). Start with assessments that match your current knowledge level!

${context.isAuthenticated ? `Recommended: Check your Dashboard for personalized skill suggestions.` : 'Browse the Skills page to explore all available topics.'}`;
  }
  
  // Platform/general queries
  if (msg.includes('deskill') || msg.includes('platform') || msg.includes('how') || msg.includes('what')) {
    return `🚀 **Welcome to DeSkill!**

DeSkill is an AI-powered skill verification platform that combines:
• Smart assessments that test real knowledge
• Blockchain technology for permanent skill records
• Soulbound NFT badges you can't fake or transfer

**Getting Started:**
1. ${context.isAuthenticated ? '✅ Wallet connected' : 'Connect your wallet'}
2. Browse skills and take assessments
3. Earn blockchain badges for verified skills
4. Build your decentralized professional reputation

${context.isAuthenticated ? `Welcome back, ${context.user.username || 'there'}! Ready to verify more skills?` : 'Ready to start your journey?'}`;
  }
  
  // Default response
  return `👋 Hi! I'm Jarvis, your DeSkill AI assistant. I can help you with:

• **Assessments** - Taking tests and earning badges
• **Skills** - Available topics and learning paths  
• **Blockchain** - Wallet connection and NFT badges
• **Platform** - Navigation and features

${context.isAuthenticated ? `You have ${context.user.totalSkillsVerified} verified skills and ${context.user.activeBadgesCount} badges!` : 'Connect your wallet to start earning blockchain skill badges!'}

What would you like to know more about?`;
};

module.exports = {
  chatWithBot
};
