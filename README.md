# DeSkill - Decentralized Skill Verification Platform

A decentralized platform where users complete AI-assessed skill tests and earn Soulbound Tokens (non-transferable NFT badges) on BNB Smart Chain to showcase verified skills.

## 🚀 Features

- **AI-Powered Skill Assessments**: Automated skill testing with AI evaluation
- **Soulbound Tokens (SBTs)**: Non-transferable NFT badges on BNB Smart Chain
- **MetaMask Integration**: Wallet-based authentication and blockchain interaction
- **Decentralized Storage**: BNB Greenfield integration for certificates
- **Interactive UI**: Smooth animations with Framer Motion
- **Real-time Updates**: Live badge and skill tracking

## 🏗️ Architecture

```
deskill/
├── contracts/          # Solidity smart contracts
├── backend/           # Node.js/Express API server
├── frontend/          # Next.js React application
├── docs/             # Documentation
└── scripts/          # Deployment and utility scripts
```

## 🛠️ Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- MetaMask Wallet Integration
- Web3.js for blockchain interaction

### Frontend
- Next.js 14 with React
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Web3Modal for wallet connection
- Ethers.js for blockchain interaction

### Blockchain
- Solidity smart contracts
- BNB Smart Chain (BSC)
- Soulbound Token (ERC-721 based)
- BNB Greenfield for storage

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (or Docker)
- MetaMask wallet
- BNB Smart Chain testnet setup
- OpenAI API key (for AI assessments)

### Quick Start with Docker

1. Clone the repository
```bash
git clone <repo-url>
cd deskill
```

2. Set up environment variables
```bash
# Copy and configure backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Copy and configure frontend environment  
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your configuration
```

3. Start with Docker Compose
```bash
docker-compose up -d
```

4. Seed the database with sample assessments
```bash
docker exec deskill-backend npm run seed
```

5. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Manual Installation

1. Install backend dependencies
```bash
cd backend
npm install
```

2. Install frontend dependencies
```bash
cd ../frontend
npm install
```

3. Set up MongoDB and environment variables

4. Deploy smart contracts
```bash
cd ../contracts
npx hardhat deploy --network bsc-testnet
```

5. Seed sample data
```bash
cd ../backend
npm run seed
```

6. Start the development servers
```bash
# Backend (Terminal 1)
cd backend && npm run dev

# Frontend (Terminal 2)
cd frontend && npm run dev
```

### Environment Configuration

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/deskill
JWT_SECRET=your_super_secret_jwt_key_here
BSC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
PRIVATE_KEY=your_private_key_without_0x_prefix
CONTRACT_ADDRESS=deployed_contract_address_here
OPENAI_API_KEY=your_openai_api_key_here
AUTHORIZED_ISSUERS=your_wallet_address_here
```

#### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address_here
NEXT_PUBLIC_BSC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
NEXT_PUBLIC_BSC_CHAIN_ID=97
```

## 📱 User Flow

1. **Connect Wallet**: User connects MetaMask wallet
2. **Register/Login**: Automatic registration with wallet address
3. **Browse Skills**: View available skill assessments
4. **Take Assessment**: Complete AI-powered skill tests
5. **Earn Badges**: Receive Soulbound Tokens for verified skills
6. **View Portfolio**: Display earned badges and certificates
7. **Share Skills**: Export or share skill verification

## 🔐 Security Features

- Non-transferable Soulbound Tokens
- Wallet-based authentication
- Decentralized certificate storage
- AI-verified skill assessments
- Immutable blockchain records

## 📄 License

MIT License
