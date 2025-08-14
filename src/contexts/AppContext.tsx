/**
 * App Context Provider - manages user state without requiring crypto wallets
 */

import { createContext, useContext, useState, ReactNode } from 'react';
import { escrowService } from '../services/escrowService';

interface User {
  email: string;
  name?: string;
  isAuthenticated: boolean;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  escrowService: typeof escrowService;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    error,
    setError,
    escrowService
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
