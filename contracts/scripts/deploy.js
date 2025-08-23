const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Deploying SoulboundSkillToken to BNB Smart Chain...");

  // Get the contract factory
  const SoulboundSkillToken = await hre.ethers.getContractFactory("SoulboundSkillToken");

  // Deploy the contract with constructor arguments
  const soulboundToken = await SoulboundSkillToken.deploy(
    process.env.INITIAL_TOKEN_NAME || "DeSkill Skill Badge",
    process.env.INITIAL_TOKEN_SYMBOL || "DSKILL"
  );

  await soulboundToken.deployed();

  const contractAddress = soulboundToken.address;
  console.log("SoulboundSkillToken deployed to:", contractAddress);

  // Get deployer address
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployed by:", deployer.address);
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", hre.network.config.chainId);

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    deployer: deployer.address,
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployedAt: new Date().toISOString(),
    tokenName: process.env.INITIAL_TOKEN_NAME || "DeSkill Skill Badge",
    tokenSymbol: process.env.INITIAL_TOKEN_SYMBOL || "DSKILL"
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Instructions for next steps
  console.log("\n=== Next Steps ===");
  console.log("1. Update your backend .env file with:");
  console.log(`   CONTRACT_ADDRESS=${contractAddress}`);
  console.log("2. Update your frontend .env.local file with:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("3. Verify the contract on BscScan (optional):");
  console.log(`   npx hardhat verify --network ${hre.network.name} ${contractAddress} "${deploymentInfo.tokenName}" "${deploymentInfo.tokenSymbol}"`);

  return contractAddress;
}

main()
  .then((contractAddress) => {
    console.log(`\nDeployment completed successfully!`);
    console.log(`Contract Address: ${contractAddress}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
