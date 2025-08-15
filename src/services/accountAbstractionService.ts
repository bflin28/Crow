/**
 * Account Abstraction Service
 * Handles smart contract deployment and interactions using a pre-funded backend account
 */

import { ethers } from 'ethers';

interface ContractDeploymentResult {
  contractAddress: string;
  transactionHash: string;
  escrowId: string;
  gasUsed: string;
}

interface EscrowContractData {
  buyer: string;
  seller: string;
  amount: string;
  productTitle: string;
  productDescription: string;
  deliveryAddress: string;
  estimatedDeliveryDays: number;
}

class AccountAbstractionService {
  private provider: ethers.JsonRpcProvider | null = null;
  private backendWallet: ethers.Wallet | null = null;
  private initialized = false;

  /**
   * Initialize the account abstraction service with pre-funded backend wallet
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize provider (you'd configure this for your target network)
      // For development, we use Hardhat local network
      const rpcUrl = 'http://127.0.0.1:8545'; // Hardhat default
      this.provider = new ethers.JsonRpcProvider(rpcUrl);

      // Initialize backend wallet with private key
      // In production, this should be stored securely (env vars, key management service)
      // For development, we'll use the first Hardhat account
      const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Hardhat account #0
      
      this.backendWallet = new ethers.Wallet(privateKey, this.provider);

      // Verify wallet has funds
      const balance = await this.provider.getBalance(this.backendWallet.address);
      console.log(`Backend wallet initialized with balance: ${ethers.formatEther(balance)} ETH`);

      if (balance === 0n) {
        throw new Error('Backend wallet has no funds for gas payments');
      }

      this.initialized = true;
      console.log('Account abstraction service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize account abstraction service:', error);
      throw error;
    }
  }

  /**
   * Deploy a new escrow smart contract using the backend wallet
   */
  async deployEscrowContract(escrowData: EscrowContractData): Promise<ContractDeploymentResult> {
    await this.initialize();

    if (!this.backendWallet || !this.provider) {
      throw new Error('Backend wallet not initialized');
    }

    try {
      // Import the compiled CrowEscrow contract
      const CrowEscrowArtifact = await import('../../artifacts/contracts/CrowEscrow.sol/CrowEscrow.json');
      
      console.log('Deploying CrowEscrow contract with backend wallet...');
      console.log('Escrow data:', escrowData);

      // Convert email addresses to mock addresses for blockchain
      const buyerAddress = this.emailToMockAddress(escrowData.buyer);
      const sellerAddress = this.emailToMockAddress(escrowData.seller);
      const amountWei = ethers.parseEther(escrowData.amount.replace('$', '').replace(',', ''));

      // Create contract factory with real compiled contract
      const contractFactory = new ethers.ContractFactory(
        CrowEscrowArtifact.abi,
        CrowEscrowArtifact.bytecode,
        this.backendWallet
      );

      // Deploy contract (backend pays gas) - CrowEscrow only needs authenticator address
      const contract = await contractFactory.deploy(
        this.backendWallet.address // Use backend wallet as authenticator for now
      );

      // Wait for deployment
      const deploymentReceipt = await contract.deploymentTransaction()?.wait();
      
      if (!deploymentReceipt) {
        throw new Error('Contract deployment failed');
      }

      console.log(`✅ CrowEscrow contract deployed successfully!`);
      console.log(`Contract Address: ${await contract.getAddress()}`);
      console.log(`Transaction Hash: ${deploymentReceipt.hash}`);

      // Create a properly typed contract instance for calling functions
      const typedContract = new ethers.Contract(
        await contract.getAddress(),
        CrowEscrowArtifact.abi,
        this.backendWallet
      );

      // Now create an escrow in the deployed contract
      // Get the current nonce to ensure proper sequencing
      const currentNonce = await this.provider.getTransactionCount(this.backendWallet.address);
      console.log(`Current nonce for createEscrow: ${currentNonce}`);
      
      const createEscrowTx = await typedContract.createEscrow(
        buyerAddress,
        sellerAddress,
        amountWei,
        escrowData.productTitle,
        escrowData.productDescription,
        escrowData.deliveryAddress,
        escrowData.estimatedDeliveryDays,
        '', // Empty IPFS hash for now
        { nonce: currentNonce } // Explicitly set nonce
      );

      const createEscrowReceipt = await createEscrowTx.wait();
      console.log(`✅ Escrow created in contract! TX: ${createEscrowReceipt.hash}`);

      const escrowId = `escrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log(`Gas Used (Deployment): ${deploymentReceipt.gasUsed.toString()}`);
      console.log(`Gas Used (Create Escrow): ${createEscrowReceipt.gasUsed.toString()}`);
      console.log(`Buyer Address: ${buyerAddress}`);
      console.log(`Seller Address: ${sellerAddress}`);

      return {
        contractAddress: await contract.getAddress(),
        transactionHash: deploymentReceipt.hash,
        escrowId,
        gasUsed: (deploymentReceipt.gasUsed + createEscrowReceipt.gasUsed).toString()
      };

    } catch (error) {
      console.error('Contract deployment failed:', error);
      throw new Error(`Failed to deploy escrow contract: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Sign escrow contract on behalf of user (account abstraction)
   */
  async signEscrowContract(contractAddress: string, userEmail: string, role: 'buyer' | 'seller'): Promise<string> {
    await this.initialize();

    if (!this.backendWallet) {
      throw new Error('Backend wallet not initialized');
    }

    try {
      // Use CrowEscrow ABI for contract interaction
      const escrowABI = [
        "function buyerSign(uint256) public",
        "function sellerSign(uint256) public", 
        "function escrows(uint256) public view returns (address, address, address, uint256, string, string, string, uint256, uint8, bool, bool, bool, uint256, uint256, string)",
        "function escrowCount() public view returns (uint256)"
      ];

      const contract = new ethers.Contract(contractAddress, escrowABI, this.backendWallet);

      console.log(`Signing contract ${contractAddress} as ${role} for user ${userEmail}`);

      // For CrowEscrow, we need to know the escrow ID within the contract
      // For simplicity, we'll assume it's escrow ID 0 (first escrow in the contract)
      const escrowId = 0;

      // Execute signing transaction (backend pays gas)
      const tx = role === 'buyer' ? 
        await contract.buyerSign(escrowId, { gasLimit: 100000 }) : 
        await contract.sellerSign(escrowId, { gasLimit: 100000 });

      const receipt = await tx.wait();
      
      console.log(`✅ Contract signed successfully! TX: ${receipt.hash}`);
      
      return receipt.hash;

    } catch (error) {
      console.error('Contract signing failed:', error);
      throw new Error(`Failed to sign escrow contract: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Read contract state (no gas required)
   */
  async getContractState(contractAddress: string) {
    await this.initialize();

    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      // Use CrowEscrow ABI for reading state
      const escrowABI = [
        "function escrows(uint256) public view returns (address, address, address, uint256, string, string, string, uint256, uint8, bool, bool, bool, uint256, uint256, string)",
        "function escrowCount() public view returns (uint256)"
      ];

      const contract = new ethers.Contract(contractAddress, escrowABI, this.provider);

      // For simplicity, read the first escrow (ID 0) in the contract
      const escrowId = 0;
      const escrowData = await contract.escrows(escrowId);
      
      // CrowEscrow returns a tuple, destructure it
      const [
        buyer,
        seller,
        authenticator,
        amount,
        productTitle,
        productDescription,
        deliveryAddress,
        estimatedDeliveryDays,
        state,
        buyerSigned,
        sellerSigned,
        fundsDeposited,
        createdAt,
        completedAt,
        ipfsHash
      ] = escrowData;

      return {
        buyerAddress: buyer,
        sellerAddress: seller,
        authenticatorAddress: authenticator,
        amount: ethers.formatEther(amount),
        productTitle,
        productDescription,
        deliveryAddress,
        estimatedDeliveryDays: Number(estimatedDeliveryDays),
        status: Number(state),
        buyerSigned,
        sellerSigned,
        fundsDeposited,
        createdAt: Number(createdAt),
        completedAt: Number(completedAt),
        ipfsHash
      };

    } catch (error) {
      console.error('Failed to read contract state:', error);
      throw new Error(`Failed to read contract state: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert email to mock blockchain address for development
   * In production, you'd have a proper mapping service
   */
  private emailToMockAddress(email: string): string {
    // Simple hash-based mock address generation
    const hash = ethers.keccak256(ethers.toUtf8Bytes(email));
    return '0x' + hash.slice(2, 42); // Take first 20 bytes as address
  }

  /**
   * Get backend wallet address and balance info
   */
  async getBackendWalletInfo() {
    await this.initialize();
    
    if (!this.backendWallet || !this.provider) {
      throw new Error('Backend wallet not initialized');
    }

    const address = this.backendWallet.address;
    const balance = await this.provider.getBalance(this.backendWallet.address);

    return {
      address,
      balance: ethers.formatEther(balance),
      balanceWei: balance.toString()
    };
  }
}

export const accountAbstractionService = new AccountAbstractionService();
