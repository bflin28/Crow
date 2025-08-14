/**
 * React hook for escrow operations without crypto wallets
 */

import { useState, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import type { EscrowData, EscrowDetails } from '../services/escrowService';

export interface EscrowHookReturn {
  loading: boolean;
  error: string | null;
  createEscrow: (escrowData: EscrowData) => Promise<string>;
  signEscrow: (escrowId: string, role: 'buyer' | 'seller') => Promise<any>;
  getUserEscrows: (userEmail?: string) => Promise<EscrowDetails[]>;
  getEscrow: (escrowId: string) => Promise<EscrowDetails>;
}

export const useEscrow = (): EscrowHookReturn => {
  const { escrowService, user, setError: setGlobalError } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createEscrow = useCallback(async (escrowData: EscrowData): Promise<string> => {
    setLoading(true);
    setError(null);
    setGlobalError(null);
    
    try {
      const escrowId = await escrowService.createEscrow(escrowData);
      return escrowId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setGlobalError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [escrowService, setGlobalError]);

  const signEscrow = useCallback(async (escrowId: string, role: 'buyer' | 'seller'): Promise<any> => {
    setLoading(true);
    setError(null);
    setGlobalError(null);
    
    try {
      if (!user?.email) {
        throw new Error('User email is required to sign escrow');
      }
      
      const result = await escrowService.signEscrow(escrowId, role, user.email);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setGlobalError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [escrowService, user?.email, setGlobalError]);

  const getUserEscrows = useCallback(async (userEmail?: string): Promise<EscrowDetails[]> => {
    setLoading(true);
    setError(null);
    setGlobalError(null);
    
    try {
      const email = userEmail || user?.email;
      if (!email) {
        throw new Error('User email is required to get escrows');
      }
      
      const escrows = await escrowService.getUserEscrows(email);
      return escrows;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setGlobalError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [escrowService, user?.email, setGlobalError]);

  const getEscrow = useCallback(async (escrowId: string): Promise<EscrowDetails> => {
    setLoading(true);
    setError(null);
    setGlobalError(null);
    
    try {
      const escrow = await escrowService.getEscrow(escrowId);
      return escrow;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setGlobalError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [escrowService, setGlobalError]);

  return {
    loading,
    error,
    createEscrow,
    signEscrow,
    getUserEscrows,
    getEscrow
  };
};
