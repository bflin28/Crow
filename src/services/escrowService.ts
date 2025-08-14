/**
 * Simple escrow service without crypto wallet requirements
 */

export interface EscrowData {
  buyer: string;
  seller: string;
  amount: string;
  productTitle: string;
  productDescription: string;
  deliveryAddress: string;
  estimatedDeliveryDays: number;
}

export interface EscrowDetails extends EscrowData {
  id: string;
  state: number;
  buyerSigned: boolean;
  sellerSigned: boolean;
  createdAt: number;
  stateText: string;
  statusForUI: string;
}

export const ESCROW_STATES: Record<number, string> = {
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

class EscrowService {
  /**
   * Create escrow (handled by backend with account abstraction)
   */
  async createEscrow(escrowData: EscrowData): Promise<string> {
    try {
      // In production, this would call your backend API
      // For now, simulate the API call
      console.log('Creating escrow via backend API...', escrowData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock escrow ID
      const escrowId = `escrow_${Date.now()}`;
      console.log('Escrow created with ID:', escrowId);
      return escrowId;
    } catch (error) {
      console.error('Failed to create escrow:', error);
      throw new Error('Failed to create escrow. Please try again.');
    }
  }

  /**
   * Sign escrow (no wallet required)
   */
  async signEscrow(escrowId: string, role: 'buyer' | 'seller', userEmail: string): Promise<any> {
    try {
      console.log(`Signing escrow ${escrowId} as ${role} (${userEmail})`);
      
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, txHash: `mock_tx_${Date.now()}` };
    } catch (error) {
      console.error('Failed to sign escrow:', error);
      throw new Error('Failed to sign escrow. Please try again.');
    }
  }

  /**
   * Get escrow details
   */
  async getEscrow(escrowId: string): Promise<EscrowDetails> {
    try {
      // In production, this would read from the blockchain
      // For now, return mock data
      const mockData: EscrowDetails = {
        id: escrowId,
        buyer: 'buyer@example.com',
        seller: 'seller@example.com',
        amount: '$1,000',
        productTitle: 'Designer Handbag',
        productDescription: 'Authentic Louis Vuitton handbag in excellent condition',
        deliveryAddress: '123 Main St, City, State 12345',
        estimatedDeliveryDays: 3,
        state: Math.floor(Math.random() * 9),
        buyerSigned: Math.random() > 0.5,
        sellerSigned: Math.random() > 0.5,
        createdAt: Date.now() - (Math.random() * 86400000),
        stateText: '',
        statusForUI: ''
      };

      mockData.stateText = ESCROW_STATES[mockData.state] || 'Unknown';
      mockData.statusForUI = this.getStatusForUI(mockData.state);

      return mockData;
    } catch (error) {
      console.error('Failed to get escrow:', error);
      throw new Error('Failed to load escrow details.');
    }
  }

  /**
   * Get user escrows by email
   */
  async getUserEscrows(userEmail: string): Promise<EscrowDetails[]> {
    try {
      console.log('Getting escrows for user:', userEmail);
      
      // Return mock data for now
      const mockEscrows: EscrowDetails[] = [
        await this.getEscrow('escrow_1'),
        await this.getEscrow('escrow_2'),
      ];

      return mockEscrows;
    } catch (error) {
      console.error('Failed to get user escrows:', error);
      throw new Error('Failed to load user escrows.');
    }
  }

  private getStatusForUI(state: number): string {
    const stateMapping: Record<number, string> = {
      0: 'pending_approval',
      1: 'pending_seller_approval',
      2: 'pending_buyer_approval',
      3: 'payment_processing',
      4: 'in_authentication',
      5: 'in_transit',
      6: 'completed',
      7: 'disputed',
      8: 'cancelled'
    };

    return stateMapping[state] || 'unknown';
  }
}

export const escrowService = new EscrowService();
