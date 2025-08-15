/**
 * Account service for managing user accounts and their escrows
 * Currently using hardcoded account, will be email-based in the future
 */

import { escrowService, EscrowDetails } from './escrowService';

export interface UserAccount {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface UserEscrowData {
  id: string;
  role: 'buyer' | 'seller';
  productTitle: string;
  amount: string;
  counterparty: string;
  status: string;
  state: number;
  createdDate: string;
  contractAddress?: string;
  completedDate?: string;
}

class AccountService {
  // Hardcoded account for testing - will be replaced with authentication
  private currentAccount: UserAccount = {
    id: 'test-user-001',
    email: 'test@example.com',
    displayName: 'Test User',
    createdAt: new Date().toISOString()
  };

  /**
   * Get current hardcoded account
   */
  getCurrentAccount(): UserAccount {
    return this.currentAccount;
  }

  /**
   * Check if user is logged in (always true for hardcoded account)
   */
  isLoggedIn(): boolean {
    return true;
  }

  /**
   * Get all escrows for the current account by querying the blockchain
   */
  async getUserEscrows(): Promise<{
    current: UserEscrowData[];
    history: UserEscrowData[];
  }> {
    try {
      console.log('🔍 AccountService: Getting escrows for user:', this.currentAccount.email);
      
      // Get all escrows from our service
      const allEscrows = await escrowService.getAllEscrows();
      console.log('📋 AccountService: Found total escrows:', allEscrows.length);
      
      const userEmail = this.currentAccount.email;
      
      // Filter escrows where user is buyer or seller
      const userEscrows = allEscrows.filter((escrow: EscrowDetails) => 
        escrow.buyer === userEmail || escrow.seller === userEmail
      );
      console.log('👤 AccountService: User escrows found:', userEscrows.length);

      // Convert to UserEscrowData format and separate current vs history
      const mappedEscrows: UserEscrowData[] = userEscrows.map((escrow: EscrowDetails) => {
        const role: 'buyer' | 'seller' = escrow.buyer === userEmail ? 'buyer' : 'seller';
        const counterparty = role === 'buyer' ? escrow.seller : escrow.buyer;
        
        // Map blockchain state to UI status
        const statusMapping: Record<number, string> = {
          0: 'pending_signatures',      // Created
          1: 'pending_signatures',      // BuyerSigned  
          2: 'pending_signatures',      // SellerSigned
          3: 'funds_escrowed',          // Active
          4: 'authenticating',          // InAuthentication
          5: 'in_transit',              // InTransit
          6: 'completed',               // Completed
          7: 'disputed',                // Disputed
          8: 'cancelled'                // Cancelled
        };

        const mapped = {
          id: escrow.id,
          role,
          productTitle: escrow.productTitle,
          amount: escrow.amount,
          counterparty,
          status: statusMapping[escrow.state] || 'pending_signatures',
          state: escrow.state,
          createdDate: new Date(escrow.createdAt * 1000).toLocaleDateString(),
          contractAddress: escrow.contractAddress,
          completedDate: escrow.state === 6 ? new Date().toLocaleDateString() : undefined
        };
        
        console.log('📝 AccountService: Mapped escrow:', mapped);
        return mapped;
      });

      // Separate current (active) vs history (completed/cancelled)
      const current = mappedEscrows.filter(escrow => 
        !['completed', 'cancelled'].includes(escrow.status)
      );
      
      const history = mappedEscrows.filter(escrow => 
        ['completed', 'cancelled'].includes(escrow.status)
      );

      console.log('✅ AccountService: Returning', current.length, 'current and', history.length, 'history');
      return { current, history };
    } catch (error) {
      console.error('❌ AccountService: Error fetching user escrows:', error);
      return { current: [], history: [] };
    }
  }

  /**
   * Get escrow count for the current user
   */
  async getUserEscrowCount(): Promise<{ total: number; active: number; completed: number }> {
    const { current, history } = await this.getUserEscrows();
    return {
      total: current.length + history.length,
      active: current.length,
      completed: history.filter(e => e.status === 'completed').length
    };
  }
}

export const accountService = new AccountService();
