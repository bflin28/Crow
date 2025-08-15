/**
 * Simple escrow service without crypto wallet requirements
 * Now integrated with account abstraction for smart contract deployment
 */

import { accountAbstractionService } from './accountAbstractionService';

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
  contractAddress?: string; // New: store contract address
  transactionHash?: string; // New: store deployment tx hash
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
  // Store escrow metadata in memory (in production, use a database)
  private escrowStorage = new Map<string, EscrowDetails>();

  /**
   * Create escrow (now deploys actual smart contract using account abstraction)
   */
  async createEscrow(escrowData: EscrowData): Promise<string> {
    try {
      console.log('Creating escrow with account abstraction...');
      
      // Deploy smart contract using backend wallet (account abstraction)
      const deploymentResult = await accountAbstractionService.deployEscrowContract({
        buyer: escrowData.buyer,
        seller: escrowData.seller,
        amount: escrowData.amount,
        productTitle: escrowData.productTitle,
        productDescription: escrowData.productDescription,
        deliveryAddress: escrowData.deliveryAddress,
        estimatedDeliveryDays: escrowData.estimatedDeliveryDays
      });

      console.log('Smart contract deployed:', deploymentResult);

      // Create escrow details with contract information
      const escrowDetails: EscrowDetails = {
        id: deploymentResult.escrowId,
        buyer: escrowData.buyer,
        seller: escrowData.seller,
        amount: escrowData.amount,
        productTitle: escrowData.productTitle,
        productDescription: escrowData.productDescription,
        deliveryAddress: escrowData.deliveryAddress,
        estimatedDeliveryDays: escrowData.estimatedDeliveryDays,
        state: 0, // Created
        buyerSigned: false,
        sellerSigned: false,
        createdAt: Date.now(),
        stateText: ESCROW_STATES[0],
        statusForUI: this.getStatusForUI(0),
        contractAddress: deploymentResult.contractAddress,
        transactionHash: deploymentResult.transactionHash
      };

      // Store in memory (in production, save to database)
      this.escrowStorage.set(deploymentResult.escrowId, escrowDetails);

      console.log(`✅ Escrow created with smart contract: ${deploymentResult.escrowId}`);
      return deploymentResult.escrowId;
      
    } catch (error) {
      console.error('Failed to create escrow with smart contract:', error);
      throw new Error(`Failed to create escrow: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Sign escrow (now interacts with actual smart contract)
   */
  async signEscrow(escrowId: string, role: 'buyer' | 'seller', userEmail: string): Promise<any> {
    try {
      console.log(`Signing escrow ${escrowId} as ${role} (${userEmail})`);
      
      // Get escrow details
      const escrowDetails = this.escrowStorage.get(escrowId);
      if (!escrowDetails || !escrowDetails.contractAddress) {
        throw new Error('Escrow not found or no contract deployed');
      }

      // Sign the smart contract using account abstraction
      const txHash = await accountAbstractionService.signEscrowContract(
        escrowDetails.contractAddress,
        userEmail,
        role
      );

      // Update local state
      if (role === 'buyer') {
        escrowDetails.buyerSigned = true;
      } else {
        escrowDetails.sellerSigned = true;
      }

      // Update state based on signatures
      if (escrowDetails.buyerSigned && escrowDetails.sellerSigned) {
        escrowDetails.state = 3; // Active
      } else if (escrowDetails.buyerSigned) {
        escrowDetails.state = 1; // BuyerSigned
      } else if (escrowDetails.sellerSigned) {
        escrowDetails.state = 2; // SellerSigned
      }

      escrowDetails.stateText = ESCROW_STATES[escrowDetails.state];
      escrowDetails.statusForUI = this.getStatusForUI(escrowDetails.state);

      // Update storage
      this.escrowStorage.set(escrowId, escrowDetails);

      console.log(`✅ Escrow signed on-chain: ${txHash}`);
      
      return { success: true, txHash, contractAddress: escrowDetails.contractAddress };
    } catch (error) {
      console.error('Failed to sign escrow:', error);
      throw new Error(`Failed to sign escrow: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get escrow details (combines local data with on-chain state)
   */
  async getEscrow(escrowId: string): Promise<EscrowDetails> {
    try {
      // Try to get from storage first
      const localEscrow = this.escrowStorage.get(escrowId);
      
      if (localEscrow && localEscrow.contractAddress) {
        try {
          // Read current state from blockchain
          const contractState = await accountAbstractionService.getContractState(localEscrow.contractAddress);
          
          // Update with on-chain data
          localEscrow.stateText = ESCROW_STATES[contractState.status] || 'Unknown';
          localEscrow.statusForUI = this.getStatusForUI(contractState.status);
          localEscrow.state = contractState.status;
          
          return localEscrow;
        } catch (error) {
          console.warn('Could not read from blockchain, using local data:', error);
          return localEscrow;
        }
      }

      // Fallback to mock data for development
      console.warn(`Escrow ${escrowId} not found in storage, returning mock data`);
      return this.getMockEscrow(escrowId);
    } catch (error) {
      console.error('Failed to get escrow:', error);
      throw new Error('Failed to load escrow details.');
    }
  }

  /**
   * Get all escrows (for admin purposes or account service)
   */
  async getAllEscrows(): Promise<EscrowDetails[]> {
    try {
      const allEscrows: EscrowDetails[] = [];
      
      for (const [, escrow] of this.escrowStorage) {
        // Try to update with on-chain data
        try {
          if (escrow.contractAddress) {
            const contractState = await accountAbstractionService.getContractState(escrow.contractAddress);
            escrow.state = contractState.status;
            escrow.stateText = ESCROW_STATES[contractState.status] || 'Unknown';
            escrow.statusForUI = this.getStatusForUI(contractState.status);
          }
        } catch (error) {
          console.warn('Could not read contract state for escrow:', escrow.id);
        }
        allEscrows.push(escrow);
      }

      return allEscrows;
    } catch (error) {
      console.error('Failed to get all escrows:', error);
      throw new Error('Failed to load escrows.');
    }
  }

  /**
   * Get user escrows by email
   */
  async getUserEscrows(userEmail: string): Promise<EscrowDetails[]> {
    try {
      console.log('Getting escrows for user:', userEmail);
      
      // Filter escrows from storage for this user
      const userEscrows: EscrowDetails[] = [];
      
      for (const [, escrow] of this.escrowStorage) {
        if (escrow.buyer === userEmail || escrow.seller === userEmail) {
          // Try to update with on-chain data
          try {
            if (escrow.contractAddress) {
              const contractState = await accountAbstractionService.getContractState(escrow.contractAddress);
              escrow.state = contractState.status;
              escrow.stateText = ESCROW_STATES[contractState.status] || 'Unknown';
              escrow.statusForUI = this.getStatusForUI(contractState.status);
            }
          } catch (error) {
            console.warn('Could not read contract state for escrow:', escrow.id);
          }
          userEscrows.push(escrow);
        }
      }

      // If no escrows found, return mock data for development
      if (userEscrows.length === 0) {
        return [
          this.getMockEscrow('demo_1'),
          this.getMockEscrow('demo_2'),
        ];
      }

      return userEscrows;
    } catch (error) {
      console.error('Failed to get user escrows:', error);
      throw new Error('Failed to load user escrows.');
    }
  }

  /**
   * Mock escrow data for development
   */
  private getMockEscrow(escrowId: string): EscrowDetails {
    const randomState = Math.floor(Math.random() * 9);
    return {
      id: escrowId,
      buyer: 'buyer@example.com',
      seller: 'seller@example.com',
      amount: '$1,000',
      productTitle: 'Sample Product',
      productDescription: 'A sample product for testing',
      deliveryAddress: '123 Main St, City, State 12345',
      estimatedDeliveryDays: 3,
      state: randomState,
      buyerSigned: Math.random() > 0.5,
      sellerSigned: Math.random() > 0.5,
      createdAt: Date.now() - (Math.random() * 86400000),
      stateText: ESCROW_STATES[randomState] || 'Unknown',
      statusForUI: this.getStatusForUI(randomState)
    };
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

  /**
   * Get backend wallet information for debugging
   */
  async getBackendWalletInfo() {
    try {
      return await accountAbstractionService.getBackendWalletInfo();
    } catch (error) {
      console.error('Failed to get backend wallet info:', error);
      return null;
    }
  }
}

export const escrowService = new EscrowService();
