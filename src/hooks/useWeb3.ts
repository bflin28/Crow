/**
 * React hook for Web3 integration with CrowEscrow contract
 */

import { useState, useEffect, useCallback } from 'react';
import { web3Service } from '../contracts/web3Service';
import type { Web3State, EscrowData, EscrowDetails, EscrowHookReturn } from '../types/web3';

export const useWeb3 = (): Web3State & { 
  connect: () => Promise<void>; 
  web3Service: typeof web3Service 
} => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Web3 connection
  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await web3Service.initialize();
      setIsConnected(true);
      setAccount(web3Service.getAccount());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connect();
          }
        } catch (err) {
          console.log('Not connected');
        }
      }
    };

    checkConnection();
  }, [connect]);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAccount(null);
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [account]);

  return {
    isConnected,
    account,
    loading,
    error,
    connect,
    web3Service
  };
};

export const useEscrow = (): EscrowHookReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createEscrow = useCallback(async (escrowData: EscrowData): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const escrowId = await web3Service.createEscrow(escrowData);
      return escrowId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signEscrow = useCallback(async (escrowId: string, role: 'buyer' | 'seller'): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      let receipt;
      if (role === 'buyer') {
        receipt = await web3Service.buyerSign(escrowId);
      } else {
        receipt = await web3Service.sellerSign(escrowId);
      }
      return receipt;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserEscrows = useCallback(async (userAddress: string | null = null): Promise<EscrowDetails[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const escrows = await web3Service.getUserEscrows(userAddress);
      return escrows;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEscrow = useCallback(async (escrowId: string): Promise<EscrowDetails> => {
    setLoading(true);
    setError(null);
    
    try {
      const escrow = await web3Service.getEscrow(escrowId);
      return escrow;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createEscrow,
    signEscrow,
    getUserEscrows,
    getEscrow
  };
};
