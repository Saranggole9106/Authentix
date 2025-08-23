const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Evaluate user submissions with AI
const evaluateWithAI = async (question, userAnswer, questionType) => {
  try {
    let prompt = '';
    
    switch (questionType) {
      case 'coding':
        prompt = `
Evaluate this coding solution:

Question: ${question}
User's Answer: ${userAnswer}

Please provide:
1. Score (0-100)
2. Strengths (array of strings)
3. Weaknesses (array of strings)
4. Recommendations (array of strings)
5. Overall feedback
6. Confidence score (0-100)

Focus on code quality, correctness, efficiency, and best practices.
Return response as JSON.`;
        break;
        
      case 'essay':
        prompt = `
Evaluate this essay/written response:

Question: ${question}
User's Answer: ${userAnswer}

Please provide:
1. Score (0-100)
2. Strengths (array of strings)
3. Weaknesses (array of strings)
4. Recommendations (array of strings)
5. Overall feedback
6. Confidence score (0-100)

Focus on clarity, accuracy, depth of understanding, and relevance.
Return response as JSON.`;
        break;
        
      case 'assessment-summary':
        prompt = `
Provide comprehensive feedback for this skill assessment:

Assessment Details: ${question}
Results: ${userAnswer}

Please provide:
1. Strengths (array of strings)
2. Weaknesses (array of strings)
3. Recommendations for improvement (array of strings)
4. Overall feedback summary
5. Confidence score in the evaluation (0-100)

Return response as JSON.`;
        break;
        
      default:
        throw new Error('Unsupported question type for AI evaluation');
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert skill assessor. Provide detailed, constructive feedback in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
    
  } catch (error) {
    console.error('AI evaluation error:', error);
    
    // Fallback response
    return {
      score: 50,
      strengths: ['Attempted the question'],
      weaknesses: ['Could not be properly evaluated'],
      recommendations: ['Please try again with more detail'],
      feedback: 'Unable to evaluate response automatically. Manual review may be required.',
      confidence: 30
    };
  }
};

// Generate skill assessment questions with AI
const generateAssessmentQuestions = async (skillName, skillLevel, questionCount = 10) => {
  try {
    const prompt = `
Generate ${questionCount} assessment questions for:
Skill: ${skillName}
Level: ${skillLevel}

Include a mix of:
- 60% Multiple choice questions
- 20% Coding questions (if applicable)
- 20% Essay/explanation questions

For each question provide:
1. questionText
2. questionType ('multiple-choice', 'coding', 'essay')
3. options (for multiple choice) with isCorrect boolean
4. correctAnswer (for multiple choice)
5. points (1-10 based on difficulty)
6. difficulty ('easy', 'medium', 'hard')

Return as JSON array of questions.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert curriculum designer. Create comprehensive skill assessments."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
    
  } catch (error) {
    console.error('Question generation error:', error);
    return [];
  }
};

// Analyze skill trends and provide insights
const analyzeSkillTrends = async (skillData) => {
  try {
    const prompt = `
Analyze these skill verification trends:
${JSON.stringify(skillData)}

Provide insights on:
1. Most in-demand skills
2. Skill level distribution
3. Learning recommendations
4. Market trends
5. Career path suggestions

Return as JSON with structured insights.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a career and skills analyst. Provide data-driven insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 1500
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
    
  } catch (error) {
    console.error('Skill analysis error:', error);
    return {
      insights: ['Unable to analyze trends at this time'],
      recommendations: ['Continue building diverse skills']
    };
  }
};

module.exports = {
  evaluateWithAI,
  generateAssessmentQuestions,
  analyzeSkillTrends
};
