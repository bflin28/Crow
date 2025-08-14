// Type definitions for Web3 and Escrow functionality

export interface EscrowData {
  buyerAddress: string;
  sellerAddress: string;
  amount: string;
  description: string;
  escrowFee?: string;
}

export interface EscrowDetails {
  id: string;
  buyerAddress: string;
  sellerAddress: string;
  amount: string;
  description: string;
  buyerSigned: boolean;
  sellerSigned: boolean;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface Web3State {
  isConnected: boolean;
  account: string | null;
  loading: boolean;
  error: string | null;
}

export interface Web3ContextType extends Web3State {
  connect: () => Promise<void>;
  web3Service: any; // We'll type this more specifically later
  showWeb3Modal: boolean;
  setShowWeb3Modal: (show: boolean) => void;
  requireConnection: () => boolean;
}

export interface EscrowHookReturn {
  loading: boolean;
  error: string | null;
  createEscrow: (escrowData: EscrowData) => Promise<string>;
  signEscrow: (escrowId: string, role: 'buyer' | 'seller') => Promise<any>;
  getUserEscrows: (userAddress?: string | null) => Promise<EscrowDetails[]>;
  getEscrow: (escrowId: string) => Promise<EscrowDetails>;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<any>;
      on: (event: string, handler: (accounts: string[]) => void) => void;
      removeListener: (event: string, handler: (accounts: string[]) => void) => void;
    };
  }
}
