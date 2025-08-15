/**
 * Debug panel to show account abstraction status and backend wallet info
 */

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import './AccountAbstractionDebug.css';

interface WalletInfo {
  address: string;
  balance: string;
  balanceWei: string;
}

const AccountAbstractionDebug: React.FC = () => {
  const { escrowService } = useAppContext();
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const loadWalletInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const info = await escrowService.getBackendWalletInfo();
      setWalletInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wallet info');
    } finally {
      setLoading(false);
    }
  };

  const testContractDeployment = async () => {
    setLoading(true);
    const timestamp = new Date().toLocaleTimeString();
    
    try {
      // Create a test escrow to trigger contract deployment  
      const testEscrow = {
        buyer: 'test-buyer@example.com',
        seller: 'test-seller@example.com',
        productTitle: `Test Product ${timestamp}`,
        amount: '0.01',
        productDescription: 'This is a test product for account abstraction testing',
        deliveryAddress: '123 Test St, Test City, TC 12345',
        estimatedDeliveryDays: 7
      };

      setTestResults(prev => [...prev, `${timestamp}: Starting test contract deployment...`]);
      
      const escrowId = await escrowService.createEscrow(testEscrow);
      
      if (escrowId) {
        setTestResults(prev => [...prev, `${timestamp}: ✅ Escrow created with ID: ${escrowId}`]);
        
        // Try to get the escrow details to see contract address
        try {
          const details = await escrowService.getEscrow(escrowId);
          if (details?.contractAddress) {
            setTestResults(prev => [...prev, `${timestamp}: ✅ Contract deployed at ${details.contractAddress!.slice(0, 8)}...${details.contractAddress!.slice(-6)}`]);
          }
        } catch (detailsError) {
          setTestResults(prev => [...prev, `${timestamp}: ⚠️ Escrow created but couldn't fetch contract address`]);
        }
      } else {
        setTestResults(prev => [...prev, `${timestamp}: ❌ Deployment failed - no escrow ID returned`]);
      }
      
      // Refresh wallet info to show gas usage
      await loadWalletInfo();
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResults(prev => [...prev, `${timestamp}: ❌ Test failed: ${errorMsg}`]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && !walletInfo) {
      loadWalletInfo();
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="debug-toggle">
        <button 
          className="debug-button"
          onClick={() => setIsVisible(true)}
        >
          🔧 Debug: Account Abstraction
        </button>
      </div>
    );
  }

  return (
    <div className="debug-panel">
      <div className="debug-header">
        <h3>🔧 Account Abstraction Debug Panel</h3>
        <button 
          className="debug-close"
          onClick={() => setIsVisible(false)}
        >
          ×
        </button>
      </div>
      
      <div className="debug-content">
        <div className="debug-section">
          <h4>Backend Wallet Status</h4>
          {loading && <p>Loading wallet info...</p>}
          {error && <p className="error">Error: {error}</p>}
          {walletInfo && (
            <div className="wallet-info">
              <div className="info-row">
                <span className="label">Address:</span>
                <span className="value">
                  {walletInfo.address.slice(0, 8)}...{walletInfo.address.slice(-6)}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Balance:</span>
                <span className="value">{walletInfo.balance} ETH</span>
              </div>
              <div className="info-row">
                <span className="label">Status:</span>
                <span className={`status ${parseFloat(walletInfo.balance) > 0 ? 'funded' : 'empty'}`}>
                  {parseFloat(walletInfo.balance) > 0 ? '✅ Funded' : '❌ Empty'}
                </span>
              </div>
            </div>
          )}
          <button 
            className="refresh-button"
            onClick={loadWalletInfo}
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>

        <div className="debug-section">
          <h4>Account Abstraction Status</h4>
          <div className="aa-info">
            <div className="info-row">
              <span className="label">Gas Payments:</span>
              <span className="value status funded">✅ Backend Handled</span>
            </div>
            <div className="info-row">
              <span className="label">User Interaction:</span>
              <span className="value status funded">✅ No Crypto Required</span>
            </div>
            <div className="info-row">
              <span className="label">Contract Deployment:</span>
              <span className="value status funded">✅ Automated</span>
            </div>
          </div>
        </div>

        <div className="debug-section">
          <h4>Development Notes</h4>
          <ul className="debug-notes">
            <li>Smart contracts are deployed automatically when users create escrows</li>
            <li>Backend wallet pays all gas fees (account abstraction)</li>
            <li>Users interact via email/traditional auth, not crypto wallets</li>
            <li>Blockchain provides transparent state tracking</li>
          </ul>
        </div>

        <div className="debug-section">
          <h4>Contract Deployment Testing</h4>
          <div className="test-controls">
            <button 
              className="test-button"
              onClick={testContractDeployment}
              disabled={loading}
            >
              🧪 Test Contract Deployment
            </button>
            <button 
              className="clear-button"
              onClick={() => setTestResults([])}
              disabled={testResults.length === 0}
            >
              🗑️ Clear Results
            </button>
          </div>
          
          <div className="test-results">
            {testResults.length === 0 && (
              <p className="no-results">No test results yet. Click "Test Contract Deployment" to begin.</p>
            )}
            {testResults.map((result, index) => (
              <div key={index} className="test-result">
                {result}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountAbstractionDebug;
