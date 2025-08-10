import React, { useState, useCallback, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';
import './PlaidLinkComponent.css';

const PlaidLinkComponent = ({ onSuccess, onError, onExit }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Create link token
  const createLinkToken = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/plaid/create_link_token', {
        user_id: 'user_' + Date.now(), // In production, use actual user ID
      });
      setLinkToken(response.data.link_token);
    } catch (error) {
      console.error('Error creating link token:', error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    createLinkToken();
  }, [createLinkToken]);

  const handleOnSuccess = useCallback((public_token, metadata) => {
    // Exchange public token for access token
    const exchangeToken = async () => {
      try {
        const response = await axios.post('/api/plaid/exchange_public_token', {
          public_token,
        });
        
        const { access_token, item_id } = response.data;
        
        // Get account info
        const accountsResponse = await axios.post('/api/plaid/accounts', {
          access_token,
        });
        
        onSuccess?.({
          access_token,
          item_id,
          accounts: accountsResponse.data.accounts,
          metadata,
        });
      } catch (error) {
        console.error('Error exchanging token:', error);
        onError?.(error);
      }
    };
    
    exchangeToken();
  }, [onSuccess, onError]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: handleOnSuccess,
    onExit: (err, metadata) => {
      console.log('Plaid Link exited:', err, metadata);
      onExit?.(err, metadata);
    },
    onEvent: (eventName, metadata) => {
      console.log('Plaid Link event:', eventName, metadata);
    },
  });

  const handleClick = () => {
    if (ready) {
      open();
    }
  };

  if (isLoading) {
    return (
      <div className="plaid-loading">
        <div className="spinner"></div>
        <p>Setting up secure bank connection...</p>
      </div>
    );
  }

  return (
    <div className="plaid-link-container">
      <button
        onClick={handleClick}
        disabled={!ready}
        className="plaid-connect-button"
      >
        {ready ? 'Connect Bank Account' : 'Loading...'}
      </button>
      <p className="plaid-security-note">
        🔒 Your banking information is securely encrypted and never stored on our servers.
        Powered by Plaid's bank-grade security.
      </p>
    </div>
  );
};

export default PlaidLinkComponent;
