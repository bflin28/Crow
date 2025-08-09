/**
 * Web3 Connection Modal - handles MetaMask connection and setup
 */

import React from 'react';
import './Web3Modal.css';
import { useWeb3Context } from '../contexts/Web3Context';

const Web3Modal = () => {
  const { showWeb3Modal, setShowWeb3Modal, connect, loading, error, isConnected } = useWeb3Context();

  if (!showWeb3Modal) return null;

  const handleConnect = async () => {
    try {
      await connect();
      if (isConnected) {
        setShowWeb3Modal(false);
      }
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const handleClose = () => {
    setShowWeb3Modal(false);
  };

  return (
    <div className="web3-modal-overlay">
      <div className="web3-modal">
        <button className="modal-close" onClick={handleClose}>×</button>
        
        <div className="modal-header">
          <h2>🦅 Connect Your Wallet</h2>
          <p>To use Crow's blockchain-powered escrow, you'll need to connect your Web3 wallet.</p>
        </div>

        <div className="modal-content">
          {!isConnected ? (
            <>
              <div className="wallet-option">
                <div className="wallet-icon">🦊</div>
                <div className="wallet-info">
                  <h3>MetaMask</h3>
                  <p>Connect using browser extension</p>
                </div>
                <button 
                  className="connect-button primary-button"
                  onClick={handleConnect}
                  disabled={loading}
                >
                  {loading ? 'Connecting...' : 'Connect MetaMask'}
                </button>
              </div>

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  <p>{error}</p>
                  {error.includes('MetaMask not found') && (
                    <a 
                      href="https://metamask.io/download/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="install-link"
                    >
                      Install MetaMask →
                    </a>
                  )}
                </div>
              )}

              <div className="setup-instructions">
                <h4>🚀 First time using Web3?</h4>
                <ol>
                  <li>Install MetaMask browser extension</li>
                  <li>Create a new wallet or import existing</li>
                  <li>For testing, switch to "Localhost 8545" network</li>
                  <li>Click "Connect MetaMask" above</li>
                </ol>
                <div className="network-info">
                  <strong>🏠 Local Development Network:</strong><br/>
                  Network: Localhost 8545<br/>
                  RPC URL: http://127.0.0.1:8545<br/>
                  Chain ID: 31337
                </div>
              </div>
            </>
          ) : (
            <div className="connected-state">
              <div className="success-icon">✅</div>
              <h3>Wallet Connected!</h3>
              <p>You're ready to use Crow's secure escrow services.</p>
              <button 
                className="primary-button"
                onClick={handleClose}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Web3Modal;
