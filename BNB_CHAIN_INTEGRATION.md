# 🔗 BNB Chain Soulbound NFT Integration Guide

## **🎯 Overview**
This guide will help you deploy and integrate non-transferable NFTs (Soulbound Tokens) on BNB Smart Chain for the DeSkill platform.

## **📋 Prerequisites**

### **1. Get BNB Testnet Tokens**
- Visit: https://testnet.binance.org/faucet-smart
- Connect your MetaMask wallet
- Request testnet BNB (needed for gas fees)

### **2. Setup MetaMask for BNB Testnet**
Add BNB Smart Chain Testnet to MetaMask:
- **Network Name**: BSC Testnet
- **RPC URL**: https://data-seed-prebsc-1-s1.binance.org:8545/
- **Chain ID**: 97
- **Currency Symbol**: tBNB
- **Block Explorer**: https://testnet.bscscan.com

## **🚀 Step-by-Step Integration**

### **Step 1: Install Contract Dependencies**
```bash
cd contracts
npm install
```

### **Step 2: Configure Environment**
Edit `contracts/.env`:
```env
# Your wallet private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Optional: BscScan API key for verification
BSCSCAN_API_KEY=your_bscscan_api_key_here
```

### **Step 3: Deploy Smart Contract**
```bash
# Deploy to BNB Testnet
npx hardhat run scripts/deploy.js --network bscTestnet

# For mainnet (when ready)
npx hardhat run scripts/deploy.js --network bscMainnet
```

### **Step 4: Update Backend Configuration**
Edit `backend/.env`:
```env
# Add the deployed contract address
CONTRACT_ADDRESS=0x_your_deployed_contract_address_here
BSC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
PRIVATE_KEY=your_private_key_here
```

### **Step 5: Update Frontend Configuration**
Edit `frontend/.env.local`:
```env
# Add the deployed contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x_your_deployed_contract_address_here
NEXT_PUBLIC_BSC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
NEXT_PUBLIC_BSC_CHAIN_ID=97
```

### **Step 6: Setup OpenAI API (Optional)**
For AI-powered assessments, add to `backend/.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## **🎮 Testing the Complete Flow**

### **1. Connect Wallet**
- Open http://localhost:3000
- Click "Connect Wallet"
- Ensure you're on BNB Testnet

### **2. Take Assessment**
- Navigate to Skills page
- Select an assessment (JavaScript, React, Node.js, or Solidity)
- Complete the questions
- Submit for AI evaluation

### **3. Earn Soulbound Badge**
- Pass the assessment (70%+ score)
- Badge will be automatically minted as NFT
- View your badges on the Dashboard

## **🔍 Verification**

### **Check Contract on BscScan**
- Visit: https://testnet.bscscan.com
- Search for your contract address
- View transactions and token transfers

### **Verify Badge Properties**
- Non-transferable (Soulbound)
- Unique metadata on IPFS
- Skill and level information
- Issue date and verification

## **🛠 Troubleshooting**

### **Common Issues**
1. **Insufficient Gas**: Ensure you have testnet BNB
2. **Wrong Network**: Verify MetaMask is on BNB Testnet
3. **Private Key**: Ensure no 0x prefix in .env files
4. **Contract Address**: Must be updated in both backend and frontend

### **Debug Commands**
```bash
# Check contract deployment
npx hardhat verify --network bscTestnet CONTRACT_ADDRESS "DeSkill Skill Badge" "DSKILL"

# Test contract interaction
npx hardhat console --network bscTestnet
```

## **🌐 Production Deployment**

### **For Mainnet**
1. Get real BNB tokens
2. Use `bscMainnet` network
3. Update RPC URLs to mainnet
4. Verify contract on mainnet BscScan

### **Security Checklist**
- [ ] Private keys stored securely
- [ ] Contract verified on BscScan
- [ ] Access controls properly configured
- [ ] Badge issuance permissions set
- [ ] IPFS metadata properly structured

## **📊 Features**

### **Soulbound Token Properties**
- ✅ Non-transferable (cannot be sold/transferred)
- ✅ Skill-based metadata
- ✅ IPFS storage for decentralization
- ✅ Verifiable on-chain
- ✅ AI-powered assessment validation

### **Badge Information**
- Skill name and level
- Assessment score
- Issue date
- Verification method (AI assessment)
- Platform issuer (DeSkill)

## **🎯 Next Steps**
1. Deploy contract to testnet
2. Test complete badge issuance flow
3. Verify badges on BscScan
4. Deploy to mainnet when ready
5. Integrate with portfolio/resume platforms
