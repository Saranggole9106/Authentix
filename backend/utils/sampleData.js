const Assessment = require('../models/Assessment');

// Sample assessment data for different skills
const sampleAssessments = [
  {
    skillName: 'JavaScript',
    title: 'JavaScript Fundamentals',
    skillLevel: 'Beginner',
    description: 'Basic JavaScript programming assessment covering variables, functions, and control structures.',
    duration: 30, // minutes
    passingScore: 70,
    questions: [
      {
        questionText: 'What is the correct way to declare a variable in JavaScript?',
        questionType: 'multiple-choice',
        options: [
          { text: 'var myVar = 5;', isCorrect: true },
          { text: 'variable myVar = 5;', isCorrect: false },
          { text: 'v myVar = 5;', isCorrect: false },
          { text: 'declare myVar = 5;', isCorrect: false }
        ],
        correctAnswer: 'var myVar = 5;',
        points: 5,
        difficulty: 'easy'
      },
      {
        questionText: 'Which of the following is NOT a JavaScript data type?',
        questionType: 'multiple-choice',
        options: [
          { text: 'String', isCorrect: false },
          { text: 'Boolean', isCorrect: false },
          { text: 'Integer', isCorrect: true },
          { text: 'Object', isCorrect: false }
        ],
        correctAnswer: 'Integer',
        points: 5,
        difficulty: 'easy'
      },
      {
        questionText: 'Write a function that takes two numbers and returns their sum.',
        questionType: 'coding',
        points: 10,
        difficulty: 'medium'
      },
      {
        questionText: 'Explain the difference between == and === in JavaScript.',
        questionType: 'essay',
        points: 8,
        difficulty: 'medium'
      }
    ],
    tags: ['programming', 'web-development', 'frontend']
  },
  {
    skillName: 'React',
    title: 'React Components and Hooks',
    description: 'Assess your understanding of React components, state management, and hooks.',
    skillLevel: 'Intermediate',
    duration: 45,
    passingScore: 75,
    questions: [
      {
        questionText: 'What is the purpose of the useEffect hook in React?',
        questionType: 'multiple-choice',
        options: [
          { text: 'To manage component state', isCorrect: false },
          { text: 'To perform side effects in functional components', isCorrect: true },
          { text: 'To create new components', isCorrect: false },
          { text: 'To handle user events', isCorrect: false }
        ],
        correctAnswer: 'To perform side effects in functional components',
        points: 6,
        difficulty: 'medium'
      },
      {
        questionText: 'Create a React component that displays a counter with increment and decrement buttons.',
        questionType: 'coding',
        points: 15,
        difficulty: 'medium'
      },
      {
        questionText: 'Explain the concept of "lifting state up" in React and when you would use it.',
        questionType: 'essay',
        points: 10,
        difficulty: 'hard'
      }
    ],
    tags: ['react', 'frontend', 'javascript', 'hooks']
  },
  {
    skillName: 'Node.js',
    title: 'Node.js Backend Development',
    description: 'Test your knowledge of Node.js server-side development and APIs.',
    skillLevel: 'Intermediate',
    duration: 40,
    passingScore: 75,
    questions: [
      {
        questionText: 'Which module is used to create HTTP servers in Node.js?',
        questionType: 'multiple-choice',
        options: [
          { text: 'fs', isCorrect: false },
          { text: 'http', isCorrect: true },
          { text: 'path', isCorrect: false },
          { text: 'url', isCorrect: false }
        ],
        correctAnswer: 'http',
        points: 5,
        difficulty: 'easy'
      },
      {
        questionText: 'Create an Express.js route that handles POST requests to /api/users and returns a JSON response.',
        questionType: 'coding',
        points: 12,
        difficulty: 'medium'
      },
      {
        questionText: 'Explain the event-driven architecture of Node.js and its benefits.',
        questionType: 'essay',
        points: 10,
        difficulty: 'hard'
      }
    ],
    tags: ['nodejs', 'backend', 'javascript', 'api']
  },
  {
    skillName: 'Solidity',
    title: 'Smart Contract Development',
    description: 'Advanced assessment for Solidity smart contract development on Ethereum.',
    skillLevel: 'Advanced',
    duration: 60,
    passingScore: 80,
    questions: [
      {
        questionText: 'What is the purpose of the "view" keyword in Solidity functions?',
        questionType: 'multiple-choice',
        options: [
          { text: 'It allows the function to modify state', isCorrect: false },
          { text: 'It indicates the function does not modify state', isCorrect: true },
          { text: 'It makes the function private', isCorrect: false },
          { text: 'It enables the function to receive Ether', isCorrect: false }
        ],
        correctAnswer: 'It indicates the function does not modify state',
        points: 8,
        difficulty: 'medium'
      },
      {
        questionText: 'Write a Solidity function that implements a simple voting mechanism with vote counting.',
        questionType: 'coding',
        points: 20,
        difficulty: 'hard'
      },
      {
        questionText: 'Explain the concept of gas optimization in Solidity and provide three specific techniques.',
        questionType: 'essay',
        points: 15,
        difficulty: 'hard'
      }
    ],
    tags: ['solidity', 'blockchain', 'ethereum', 'smart-contracts']
  },
  {
    skillName: 'Python',
    title: 'Python Programming Essentials',
    description: 'Comprehensive assessment of Python programming fundamentals and best practices.',
    skillLevel: 'Beginner',
    duration: 35,
    passingScore: 70,
    questions: [
      {
        questionText: 'Which of the following is the correct way to define a function in Python?',
        questionType: 'multiple-choice',
        options: [
          { text: 'function myFunc():', isCorrect: false },
          { text: 'def myFunc():', isCorrect: true },
          { text: 'define myFunc():', isCorrect: false },
          { text: 'func myFunc():', isCorrect: false }
        ],
        correctAnswer: 'def myFunc():',
        points: 5,
        difficulty: 'easy'
      },
      {
        questionText: 'Write a Python function that finds the largest number in a list.',
        questionType: 'coding',
        points: 10,
        difficulty: 'medium'
      },
      {
        questionText: 'Explain the difference between lists and tuples in Python.',
        questionType: 'essay',
        points: 8,
        difficulty: 'medium'
      }
    ],
    tags: ['python', 'programming', 'data-structures']
  },
  {
    skillName: 'Machine Learning',
    title: 'Machine Learning Fundamentals',
    description: 'Test your understanding of machine learning concepts, algorithms, and applications.',
    skillLevel: 'Intermediate',
    duration: 50,
    passingScore: 75,
    questions: [
      {
        questionText: 'What is the main difference between supervised and unsupervised learning?',
        questionType: 'multiple-choice',
        options: [
          { text: 'Supervised learning uses labeled data, unsupervised does not', isCorrect: true },
          { text: 'Supervised learning is faster than unsupervised', isCorrect: false },
          { text: 'Unsupervised learning is more accurate', isCorrect: false },
          { text: 'There is no difference', isCorrect: false }
        ],
        correctAnswer: 'Supervised learning uses labeled data, unsupervised does not',
        points: 6,
        difficulty: 'medium'
      },
      {
        questionText: 'Implement a simple linear regression model using Python and explain your approach.',
        questionType: 'coding',
        points: 18,
        difficulty: 'hard'
      },
      {
        questionText: 'Describe the bias-variance tradeoff in machine learning and its implications.',
        questionType: 'essay',
        points: 12,
        difficulty: 'hard'
      }
    ],
    tags: ['machine-learning', 'ai', 'data-science', 'algorithms']
  }
];

// Function to seed the database with sample assessments
const seedAssessments = async () => {
  try {
    console.log('Seeding sample assessments...');
    
    // Clear existing assessments
    await Assessment.deleteMany({});
    
    // Insert sample assessments
    for (const assessmentData of sampleAssessments) {
      const assessment = new Assessment(assessmentData);
      await assessment.save();
      console.log(`Created assessment: ${assessment.title}`);
    }
    
    console.log('Sample assessments seeded successfully!');
  } catch (error) {
    console.error('Error seeding assessments:', error);
  }
};

module.exports = {
  sampleAssessments,
  seedAssessments
};
