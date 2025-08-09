import hre from "hardhat";
import fs from 'fs';

async function main() {
  // Get the contract factory
  const CrowEscrow = await hre.ethers.getContractFactory("CrowEscrow");
  
  // Deploy the contract with authenticator address
  // For now, we'll use the deployer as the authenticator
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying CrowEscrow contract with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  
  // Deploy with authenticator address (using deployer for now)
  const crowEscrow = await CrowEscrow.deploy(deployer.address);
  
  await crowEscrow.waitForDeployment();
  
  const contractAddress = await crowEscrow.getAddress();
  
  console.log("CrowEscrow deployed to:", contractAddress);
  console.log("Authenticator address:", deployer.address);
  
  // Save deployment info to a file for frontend use
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: hre.network.name,
    deployer: deployer.address,
    authenticator: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    './src/contracts/deployment.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to src/contracts/deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
