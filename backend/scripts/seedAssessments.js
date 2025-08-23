const mongoose = require('mongoose');
const Assessment = require('../models/Assessment');
require('dotenv').config();

// Sample assessments for different skills
const assessments = [
  {
    skillName: 'JavaScript',
    title: 'JavaScript Fundamentals Assessment',
    description: 'Test your knowledge of JavaScript basics including variables, functions, objects, and ES6 features.',
    skillLevel: 'Beginner',
    duration: 30,
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
        questionText: 'Which method is used to add an element to the end of an array?',
        questionType: 'multiple-choice',
        options: [
          { text: 'push()', isCorrect: true },
          { text: 'pop()', isCorrect: false },
          { text: 'shift()', isCorrect: false },
          { text: 'unshift()', isCorrect: false }
        ],
        correctAnswer: 'push()',
        points: 5,
        difficulty: 'easy'
      },
      {
        questionText: 'Write a function that takes two numbers and returns their sum.',
        questionType: 'coding',
        correctAnswer: 'function add(a, b) { return a + b; }',
        points: 10,
        difficulty: 'medium'
      },
      {
        questionText: 'Explain the difference between let, const, and var in JavaScript.',
        questionType: 'essay',
        correctAnswer: 'let and const are block-scoped, var is function-scoped. const cannot be reassigned.',
        points: 15,
        difficulty: 'medium'
      }
    ],
    tags: ['programming', 'web-development', 'frontend']
  },
  {
    skillName: 'React',
    title: 'React Development Assessment',
    description: 'Evaluate your React skills including components, hooks, state management, and best practices.',
    skillLevel: 'Intermediate',
    duration: 45,
    passingScore: 75,
    questions: [
      {
        questionText: 'What is the correct way to create a functional component in React?',
        questionType: 'multiple-choice',
        options: [
          { text: 'function MyComponent() { return <div>Hello</div>; }', isCorrect: true },
          { text: 'const MyComponent = () => <div>Hello</div>;', isCorrect: true },
          { text: 'class MyComponent extends Component { render() { return <div>Hello</div>; } }', isCorrect: false },
          { text: 'React.createComponent(() => <div>Hello</div>);', isCorrect: false }
        ],
        correctAnswer: 'function MyComponent() { return <div>Hello</div>; }',
        points: 8,
        difficulty: 'medium'
      },
      {
        questionText: 'Create a React component that displays a counter with increment and decrement buttons.',
        questionType: 'coding',
        correctAnswer: 'function Counter() { const [count, setCount] = useState(0); return (<div><button onClick={() => setCount(count - 1)}>-</button><span>{count}</span><button onClick={() => setCount(count + 1)}>+</button></div>); }',
        points: 20,
        difficulty: 'medium'
      },
      {
        questionText: 'Explain the useEffect hook and when you would use it.',
        questionType: 'essay',
        correctAnswer: 'useEffect is used for side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.',
        points: 15,
        difficulty: 'medium'
      }
    ],
    tags: ['react', 'frontend', 'web-development']
  },
  {
    skillName: 'Node.js',
    title: 'Node.js Backend Development',
    description: 'Test your Node.js knowledge including Express, APIs, middleware, and database integration.',
    skillLevel: 'Intermediate',
    duration: 60,
    passingScore: 75,
    questions: [
      {
        questionText: 'What is the correct way to create an Express server?',
        questionType: 'multiple-choice',
        options: [
          { text: 'const express = require("express"); const app = express(); app.listen(3000);', isCorrect: true },
          { text: 'const app = new Express(); app.start(3000);', isCorrect: false },
          { text: 'Express.createServer().listen(3000);', isCorrect: false },
          { text: 'const server = express.Server(); server.run(3000);', isCorrect: false }
        ],
        correctAnswer: 'const express = require("express"); const app = express(); app.listen(3000);',
        points: 8,
        difficulty: 'easy'
      },
      {
        questionText: 'Create a middleware function that logs the request method and URL.',
        questionType: 'coding',
        correctAnswer: 'function logger(req, res, next) { console.log(req.method, req.url); next(); }',
        points: 15,
        difficulty: 'medium'
      },
      {
        questionText: 'Explain the difference between synchronous and asynchronous operations in Node.js.',
        questionType: 'essay',
        correctAnswer: 'Synchronous operations block the execution until completed, while asynchronous operations allow other code to run while waiting for completion.',
        points: 12,
        difficulty: 'medium'
      }
    ],
    tags: ['nodejs', 'backend', 'javascript']
  },
  {
    skillName: 'Solidity',
    title: 'Smart Contract Development',
    description: 'Assess your Solidity programming skills for blockchain and smart contract development.',
    skillLevel: 'Advanced',
    duration: 90,
    passingScore: 80,
    questions: [
      {
        questionText: 'What is the correct way to declare a state variable in Solidity?',
        questionType: 'multiple-choice',
        options: [
          { text: 'uint256 public myVariable;', isCorrect: true },
          { text: 'var myVariable = uint256;', isCorrect: false },
          { text: 'uint256 myVariable = public;', isCorrect: false },
          { text: 'public uint256 myVariable;', isCorrect: false }
        ],
        correctAnswer: 'uint256 public myVariable;',
        points: 10,
        difficulty: 'medium'
      },
      {
        questionText: 'Write a simple smart contract that stores and retrieves a value.',
        questionType: 'coding',
        correctAnswer: 'contract SimpleStorage { uint256 private value; function setValue(uint256 _value) public { value = _value; } function getValue() public view returns (uint256) { return value; } }',
        points: 25,
        difficulty: 'hard'
      },
      {
        questionText: 'Explain the concept of gas in Ethereum and why it\'s important.',
        questionType: 'essay',
        correctAnswer: 'Gas is the fee required to execute operations on Ethereum. It prevents spam and infinite loops while compensating miners.',
        points: 20,
        difficulty: 'hard'
      }
    ],
    tags: ['solidity', 'blockchain', 'ethereum', 'smart-contracts']
  },
  {
    skillName: 'Python',
    title: 'Python Programming Fundamentals',
    description: 'Test your Python programming skills including data structures, functions, and object-oriented programming.',
    skillLevel: 'Beginner',
    duration: 40,
    passingScore: 70,
    questions: [
      {
        questionText: 'What is the correct way to define a function in Python?',
        questionType: 'multiple-choice',
        options: [
          { text: 'def my_function():', isCorrect: true },
          { text: 'function my_function():', isCorrect: false },
          { text: 'def my_function() {', isCorrect: false },
          { text: 'function my_function() {', isCorrect: false }
        ],
        correctAnswer: 'def my_function():',
        points: 5,
        difficulty: 'easy'
      },
      {
        questionText: 'Write a function that returns the factorial of a number.',
        questionType: 'coding',
        correctAnswer: 'def factorial(n): if n <= 1: return 1; return n * factorial(n - 1)',
        points: 15,
        difficulty: 'medium'
      },
      {
        questionText: 'Explain the difference between a list and a tuple in Python.',
        questionType: 'essay',
        correctAnswer: 'Lists are mutable and can be changed after creation, while tuples are immutable and cannot be modified.',
        points: 10,
        difficulty: 'easy'
      }
    ],
    tags: ['python', 'programming', 'backend']
  }
];

async function seedAssessments() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/deskill');
    console.log('Connected to MongoDB');

    // Clear existing assessments
    await Assessment.deleteMany({});
    console.log('Cleared existing assessments');

    // Insert new assessments
    await Assessment.insertMany(assessments);
    console.log(`Inserted ${assessments.length} assessments`);

    console.log('Assessment seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding assessments:', error);
    process.exit(1);
  }
}

// Run the seeding script
if (require.main === module) {
  seedAssessments();
}

module.exports = { assessments, seedAssessments };
