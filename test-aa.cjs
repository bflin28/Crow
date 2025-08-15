/**
 * Quick test script to validate account abstraction setup
 */

const { ethers } = require('ethers');
const CrowEscrow = require('./artifacts/contracts/CrowEscrow.sol/CrowEscrow.json');

async function testAccountAbstraction() {
  console.log('🧪 Testing Account Abstraction Setup...\n');
  
  try {
    // Connect to Hardhat local network
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    console.log('✅ Connected to Hardhat network');
    
    // Get the first account (this will be our backend wallet)
    const accounts = await provider.listAccounts();
    const backendWallet = accounts[0];
    const buyerAddress = accounts[1]; // Use second account as buyer
    const sellerAddress = accounts[2]; // Use third account as seller
    console.log(`✅ Backend wallet: ${backendWallet.address}`);
    console.log(`✅ Test buyer: ${buyerAddress.address}`);
    console.log(`✅ Test seller: ${sellerAddress.address}`);
    
    // Check wallet balance
    const balance = await provider.getBalance(backendWallet.address);
    console.log(`✅ Wallet balance: ${ethers.formatEther(balance)} ETH`);
    
    // Test contract deployment
    console.log('\n🚀 Testing Smart Contract Deployment...');
    
    const contractFactory = new ethers.ContractFactory(
      CrowEscrow.abi,
      CrowEscrow.bytecode,
      backendWallet
    );
    
    const contract = await contractFactory.deploy(
      backendWallet.address // authenticator address
    );
    
    console.log(`✅ Contract deployment transaction: ${contract.deploymentTransaction()?.hash}`);
    console.log(`✅ Contract deployed at: ${await contract.getAddress()}`);
    
    // Create an escrow in the deployed contract
    const createEscrowTx = await contract.createEscrow(
      buyerAddress.address, // buyer address
      sellerAddress.address, // seller address
      ethers.parseEther('0.01'),
      'Test Product for Account Abstraction',
      'Test product description',
      '123 Test St, Test City',
      7, // estimated delivery days
      '' // empty IPFS hash
    );
    
    await createEscrowTx.wait();
    console.log(`✅ Escrow created in contract!`);
    
    // Test reading escrow state
    const escrowData = await contract.escrows(0); // First escrow has ID 0
    
    console.log('\n📊 Contract State:');
    console.log(`   Buyer: ${escrowData[0]}`); // buyer address
    console.log(`   Seller: ${escrowData[1]}`); // seller address  
    console.log(`   Authenticator: ${escrowData[2]}`); // authenticator address
    console.log(`   Amount: ${ethers.formatEther(escrowData[3])} ETH`); // amount
    console.log(`   Product: ${escrowData[4]}`); // product title
    console.log(`   Description: ${escrowData[5]}`); // product description
    console.log(`   Delivery Address: ${escrowData[6]}`); // delivery address
    console.log(`   Estimated Delivery: ${escrowData[7]} days`); // estimated delivery days
    console.log(`   Status: ${escrowData[8]} (0=Created, 1=BuyerSigned, 2=SellerSigned, 3=Active, etc.)`); // state enum
    console.log(`   Buyer Signed: ${escrowData[9]}`); // buyerSigned
    console.log(`   Seller Signed: ${escrowData[10]}`); // sellerSigned
    console.log(`   Funds Deposited: ${escrowData[11]}`); // fundsDeposited
    
    console.log('\n🎉 Account Abstraction Test Successful!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testAccountAbstraction();
