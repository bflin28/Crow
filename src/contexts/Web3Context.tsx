/**
 * Web3 Context Provider for managing blockchain connection state
 */

import { createContext, useContext, useState, ReactNode } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import type { Web3ContextType } from '../types/web3';

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3Context = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3Context must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const web3Hook = useWeb3();
  const [showWeb3Modal, setShowWeb3Modal] = useState(false);

  // Show connection modal when blockchain functionality is needed
  const requireConnection = () => {
    if (!web3Hook.isConnected) {
      setShowWeb3Modal(true);
      return false;
    }
    return true;
  };

  const value = {
    ...web3Hook,
    showWeb3Modal,
    setShowWeb3Modal,
    requireConnection
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
