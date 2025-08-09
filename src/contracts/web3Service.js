/**
 * Web3 utilities for interacting with the CrowEscrow smart contract
 */

import { ethers } from 'ethers';

// Contract ABI - will be generated after compilation
export const CROW_ESCROW_ABI = [
  // Contract creation
  "function createEscrow(address _buyer, address _seller, uint256 _amount, string _productTitle, string _productDescription, string _deliveryAddress, uint256 _estimatedDeliveryDays, string _ipfsHash) returns (uint256)",
  
  // Signing functions
  "function buyerSign(uint256 _escrowId)",
  "function sellerSign(uint256 _escrowId)",
  
  // Fund management
  "function depositFunds(uint256 _escrowId) payable",
  "function cancelEscrow(uint256 _escrowId, string _reason)",
  
  // View functions
  "function getEscrow(uint256 _escrowId) view returns (address buyer, address seller, uint256 amount, string productTitle, string productDescription, uint8 state, bool buyerSigned, bool sellerSigned, bool fundsDeposited, uint256 createdAt)",
  "function getUserEscrows(address _user) view returns (uint256[])",
  "function getTotalEscrows() view returns (uint256)",
  "function escrowCount() view returns (uint256)",
  "function authenticationFee() view returns (uint256)",
  
  // Events
  "event EscrowCreated(uint256 indexed escrowId, address indexed buyer, address indexed seller, uint256 amount)",
  "event BuyerSigned(uint256 indexed escrowId, address indexed buyer)",
  "event SellerSigned(uint256 indexed escrowId, address indexed seller)",
  "event EscrowActivated(uint256 indexed escrowId, uint256 amount)",
  "event FundsDeposited(uint256 indexed escrowId, uint256 amount)",
  "event EscrowCompleted(uint256 indexed escrowId, address indexed buyer, address indexed seller)",
  "event EscrowCancelled(uint256 indexed escrowId, string reason)",
];

// Escrow states mapping
export const ESCROW_STATES = {
  0: 'Created',
  1: 'BuyerSigned', 
  2: 'SellerSigned',
  3: 'Active',
  4: 'InAuthentication',
  5: 'InTransit',
  6: 'Completed',
  7: 'Disputed',
  8: 'Cancelled'
};

export const ESCROW_STATE_MAPPING = {
  'Created': 'pending_seller_approval', // or pending_buyer_approval depending on who created
  'BuyerSigned': 'pending_seller_approval',
  'SellerSigned': 'pending_buyer_approval', 
  'Active': 'funds_escrowed',
  'InAuthentication': 'in_authentication',
  'InTransit': 'in_transit',
  'Completed': 'completed',
  'Disputed': 'disputed',
  'Cancelled': 'cancelled'
};

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
  }

  /**
   * Initialize Web3 connection with MetaMask
   */
  async initialize() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create provider and signer
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        this.account = await this.signer.getAddress();
        
        // Load contract
        await this.loadContract();
        
        console.log('Web3 initialized successfully');
        console.log('Connected account:', this.account);
        
        return true;
      } catch (error) {
        console.error('Failed to initialize Web3:', error);
        throw new Error('Failed to connect to wallet');
      }
    } else {
      throw new Error('MetaMask not found. Please install MetaMask.');
    }
  }

  /**
   * Load the deployed contract
   */
  async loadContract() {
    try {
      // Try to load deployment info
      const deploymentModule = await import('./deployment.json');
      const deployment = deploymentModule.default;
      
      this.contract = new ethers.Contract(
        deployment.contractAddress,
        CROW_ESCROW_ABI,
        this.signer
      );
      
      console.log('Contract loaded:', deployment.contractAddress);
    } catch (error) {
      console.error('Failed to load contract:', error);
      throw new Error('Contract not deployed. Please deploy the contract first.');
    }
  }

  /**
   * Create a new escrow
   */
  async createEscrow(escrowData) {
    if (!this.contract) throw new Error('Contract not loaded');
    
    try {
      const {
        buyer,
        seller, 
        amount,
        productTitle,
        productDescription,
        deliveryAddress,
        estimatedDeliveryDays,
        ipfsHash = ""
      } = escrowData;

      // Convert amount to wei
      const amountWei = ethers.parseEther(amount.toString());
      
      const tx = await this.contract.createEscrow(
        buyer,
        seller,
        amountWei,
        productTitle,
        productDescription,
        deliveryAddress,
        estimatedDeliveryDays,
        ipfsHash
      );
      
      const receipt = await tx.wait();
      
      // Extract escrow ID from events
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed.name === 'EscrowCreated';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsed = this.contract.interface.parseLog(event);
        const escrowId = parsed.args.escrowId.toString();
        console.log('Escrow created with ID:', escrowId);
        return escrowId;
      }
      
      throw new Error('Failed to get escrow ID from transaction');
    } catch (error) {
      console.error('Failed to create escrow:', error);
      throw error;
    }
  }

  /**
   * Sign escrow as buyer
   */
  async buyerSign(escrowId) {
    if (!this.contract) throw new Error('Contract not loaded');
    
    try {
      const tx = await this.contract.buyerSign(escrowId);
      const receipt = await tx.wait();
      
      console.log('Buyer signed escrow:', escrowId);
      return receipt;
    } catch (error) {
      console.error('Failed to sign as buyer:', error);
      throw error;
    }
  }

  /**
   * Sign escrow as seller
   */
  async sellerSign(escrowId) {
    if (!this.contract) throw new Error('Contract not loaded');
    
    try {
      const tx = await this.contract.sellerSign(escrowId);
      const receipt = await tx.wait();
      
      console.log('Seller signed escrow:', escrowId);
      return receipt;
    } catch (error) {
      console.error('Failed to sign as seller:', error);
      throw error;
    }
  }

  /**
   * Deposit funds into escrow
   */
  async depositFunds(escrowId, amount) {
    if (!this.contract) throw new Error('Contract not loaded');
    
    try {
      // Get authentication fee
      const authFee = await this.contract.authenticationFee();
      const amountWei = ethers.parseEther(amount.toString());
      const totalAmount = amountWei + authFee;
      
      const tx = await this.contract.depositFunds(escrowId, { value: totalAmount });
      const receipt = await tx.wait();
      
      console.log('Funds deposited for escrow:', escrowId);
      return receipt;
    } catch (error) {
      console.error('Failed to deposit funds:', error);
      throw error;
    }
  }

  /**
   * Get escrow details
   */
  async getEscrow(escrowId) {
    if (!this.contract) throw new Error('Contract not loaded');
    
    try {
      const escrow = await this.contract.getEscrow(escrowId);
      
      return {
        id: escrowId,
        buyer: escrow.buyer,
        seller: escrow.seller,
        amount: ethers.formatEther(escrow.amount),
        productTitle: escrow.productTitle,
        productDescription: escrow.productDescription,
        state: ESCROW_STATES[escrow.state],
        mappedState: ESCROW_STATE_MAPPING[ESCROW_STATES[escrow.state]],
        buyerSigned: escrow.buyerSigned,
        sellerSigned: escrow.sellerSigned,
        fundsDeposited: escrow.fundsDeposited,
        createdAt: new Date(Number(escrow.createdAt) * 1000).toISOString().split('T')[0]
      };
    } catch (error) {
      console.error('Failed to get escrow:', error);
      throw error;
    }
  }

  /**
   * Get user's escrows
   */
  async getUserEscrows(userAddress = null) {
    if (!this.contract) throw new Error('Contract not loaded');
    
    try {
      const address = userAddress || this.account;
      const escrowIds = await this.contract.getUserEscrows(address);
      
      const escrows = await Promise.all(
        escrowIds.map(id => this.getEscrow(id.toString()))
      );
      
      return escrows;
    } catch (error) {
      console.error('Failed to get user escrows:', error);
      throw error;
    }
  }

  /**
   * Get current connected account
   */
  getAccount() {
    return this.account;
  }

  /**
   * Check if wallet is connected
   */
  isConnected() {
    return !!this.account && !!this.contract;
  }
}

// Create singleton instance
export const web3Service = new Web3Service();
