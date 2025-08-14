/**
 * Read-only contract service for tracking escrow state
 * No user wallet required - only reads blockchain state
 */

import { backendService } from '../services/backendService';

interface EscrowData {
  buyer: string;
  seller: string;
  amount: string;
  productTitle: string;
  productDescription: string;
  deliveryAddress: string;
  estimatedDeliveryDays: number;
  ipfsHash?: string;
}

interface EscrowDetails {
  id: string;
  buyer: string;
  seller: string;
  amount: string;
  productTitle: string;
  productDescription: string;
  state: number;
  buyerSigned: boolean;
  sellerSigned: boolean;
  fundsDeposited: boolean;
  createdAt: number;
  stateText?: string;
  statusForUI?: string;
  formattedAmount?: string;
  canBuyerSign?: boolean;
  canSellerSign?: boolean;
  isActive?: boolean;
}

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
  'Created': 'pending_approval',
  'BuyerSigned': 'pending_seller_approval',
  'SellerSigned': 'pending_buyer_approval', 
  'Active': 'payment_processing',
  'InAuthentication': 'in_authentication',
  'InTransit': 'in_transit',
  'Completed': 'completed',
  'Disputed': 'disputed',
  'Cancelled': 'cancelled'
};

class ReadOnlyContractService {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      await backendService.initialize();
      this.initialized = true;
    }
  }

  /**
   * Create escrow through backend (no user wallet needed)
   */
  async createEscrow(escrowData) {
    await this.initialize();
    return await backendService.createEscrow(escrowData);
  }

  /**
   * Sign escrow through backend API
   */
  async signEscrow(escrowId, role, userEmail) {
    await this.initialize();
    return await backendService.signEscrow(escrowId, role, userEmail);
  }

  /**
   * Get escrow details (read-only, no gas fees)
   */
  async getEscrow(escrowId) {
    await this.initialize();
    const escrowData = await backendService.getEscrow(escrowId);
    
    // Add computed fields for UI
    return {
      ...escrowData,
      stateText: ESCROW_STATES[escrowData.state] || 'Unknown',
      statusForUI: ESCROW_STATE_MAPPING[ESCROW_STATES[escrowData.state]] || 'unknown',
      formattedAmount: escrowData.amount, // Will be USD from Plaid, not ETH
      canBuyerSign: !escrowData.buyerSigned && escrowData.state === 0,
      canSellerSign: !escrowData.sellerSigned && (escrowData.state === 0 || escrowData.state === 1),
      isActive: escrowData.buyerSigned && escrowData.sellerSigned
    };
  }

  /**
   * Get all escrows for a user (by email instead of wallet address)
   */
  async getUserEscrows(userEmail) {
    await this.initialize();
    const escrows = await backendService.getUserEscrows(userEmail);
    
    // Process each escrow to add computed fields
    return escrows.map(escrow => ({
      ...escrow,
      stateText: ESCROW_STATES[escrow.state] || 'Unknown',
      statusForUI: ESCROW_STATE_MAPPING[ESCROW_STATES[escrow.state]] || 'unknown',
      formattedAmount: escrow.amount,
    }));
  }

  /**
   * Process payment through Plaid (no crypto involved)
   */
  async processPayment(escrowId, paymentData) {
    await this.initialize();
    return await backendService.processPayment(escrowId, paymentData);
  }
}

export const contractService = new ReadOnlyContractService();
