import React, { useState } from 'react';
import PlaidLinkComponent from './PlaidLinkComponent';
import './PaymentHandler.css';

const PaymentHandler = ({ escrowAmount, onPaymentSuccess, onPaymentError }) => {
  const [paymentMethod, setPaymentMethod] = useState(null); // 'bank' or 'crypto'
  const [bankAccount, setBankAccount] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleBankAccountConnected = async (plaidData) => {
    try {
      setBankAccount(plaidData);
      console.log('Bank account connected:', plaidData);
      
      // Store the access token securely (in production, send to your backend)
      // For now, we'll store the account info for the payment process
      
    } catch (error) {
      console.error('Error handling bank account connection:', error);
      onPaymentError?.(error);
    }
  };

  const handleACHPayment = async () => {
    if (!bankAccount) {
      onPaymentError?.(new Error('No bank account connected'));
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      // In a real implementation, this would:
      // 1. Create an ACH transfer via Plaid or Stripe
      // 2. Wait for the transfer to clear (usually 1-3 business days)
      // 3. Then fund the escrow contract
      
      // For demo purposes, we'll simulate this process
      console.log('Processing ACH payment for:', escrowAmount);
      
      // Simulate API call to initiate ACH transfer
      const response = await fetch('/api/payments/initiate-ach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: bankAccount.access_token,
          account_id: bankAccount.accounts[0].account_id,
          amount: escrowAmount,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to initiate ACH transfer');
      }
      
      const result = await response.json();
      
      onPaymentSuccess?.({
        method: 'ach',
        transactionId: result.transaction_id,
        status: 'pending', // ACH transfers are pending initially
        amount: escrowAmount,
        account: bankAccount.accounts[0],
      });
      
    } catch (error) {
      console.error('Error processing ACH payment:', error);
      onPaymentError?.(error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCryptoPayment = () => {
    // Keep the existing crypto payment flow
    console.log('Processing crypto payment for:', escrowAmount);
    onPaymentSuccess?.({
      method: 'crypto',
      amount: escrowAmount,
    });
  };

  if (!paymentMethod) {
    return (
      <div className="payment-method-selector">
        <h3>Choose Payment Method</h3>
        <p className="payment-amount">Amount: ${escrowAmount}</p>
        
        <div className="payment-options">
          <div 
            className="payment-option recommended"
            onClick={() => setPaymentMethod('bank')}
          >
            <div className="option-icon">🏦</div>
            <div className="option-content">
              <h4>Bank Transfer (ACH)</h4>
              <p>Connect your bank account for easy payments</p>
              <span className="recommended-badge">Recommended</span>
            </div>
          </div>
          
          <div 
            className="payment-option"
            onClick={() => setPaymentMethod('crypto')}
          >
            <div className="option-icon">₿</div>
            <div className="option-content">
              <h4>Cryptocurrency</h4>
              <p>Pay with ETH using MetaMask</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentMethod === 'bank') {
    return (
      <div className="bank-payment-flow">
        <h3>Bank Account Payment</h3>
        <p className="payment-amount">Amount: ${escrowAmount}</p>
        
        {!bankAccount ? (
          <div className="bank-connection-step">
            <p>Connect your bank account to proceed with the payment:</p>
            <PlaidLinkComponent
              onSuccess={handleBankAccountConnected}
              onError={onPaymentError}
            />
          </div>
        ) : (
          <div className="bank-payment-step">
            <div className="connected-account">
              <h4>✅ Connected Account</h4>
              <p>{bankAccount.accounts[0].name}</p>
              <p className="account-type">{bankAccount.accounts[0].subtype}</p>
            </div>
            
            <div className="payment-info">
              <p className="info-text">
                Your payment will be processed via ACH transfer. 
                Funds typically arrive in 1-3 business days.
              </p>
            </div>
            
            <button 
              className="initiate-payment-button"
              onClick={handleACHPayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? 'Processing...' : `Pay $${escrowAmount}`}
            </button>
          </div>
        )}
        
        <button 
          className="back-button"
          onClick={() => setPaymentMethod(null)}
        >
          ← Choose Different Method
        </button>
      </div>
    );
  }

  if (paymentMethod === 'crypto') {
    return (
      <div className="crypto-payment-flow">
        <h3>Cryptocurrency Payment</h3>
        <p className="payment-amount">Amount: ${escrowAmount} (≈ 0.025 ETH)</p>
        
        <div className="crypto-info">
          <p>Connect your MetaMask wallet to proceed with crypto payment:</p>
        </div>
        
        <button 
          className="crypto-pay-button"
          onClick={handleCryptoPayment}
        >
          Connect MetaMask & Pay
        </button>
        
        <button 
          className="back-button"
          onClick={() => setPaymentMethod(null)}
        >
          ← Choose Different Method
        </button>
      </div>
    );
  }

  return null;
};

export default PaymentHandler;
