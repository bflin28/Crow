/**
 * Debug component to test account functionality
 */

import React, { useState, useEffect } from 'react';
import { accountService } from '../services/accountService';
import { escrowService } from '../services/escrowService';

const AccountDebug: React.FC = () => {
  const [account, setAccount] = useState(accountService.getCurrentAccount());
  const [escrows, setEscrows] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<string>('');

  const testCreateEscrow = async () => {
    setLoading(true);
    setTestStatus('Creating test escrow...');
    
    try {
      const testEscrow = {
        buyer: account.email,
        seller: 'test-seller@example.com',
        amount: '$50',
        productTitle: 'Debug Test Product',
        productDescription: 'Testing account system integration',
        deliveryAddress: '123 Debug Street, Test City',
        estimatedDeliveryDays: 5
      };

      const escrowId = await escrowService.createEscrow(testEscrow);
      setTestStatus(`✅ Test escrow created: ${escrowId}`);
      
      // Refresh escrows
      loadEscrows();
    } catch (error) {
      setTestStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadEscrows = async () => {
    try {
      const userEscrows = await accountService.getUserEscrows();
      setEscrows(userEscrows);
    } catch (error) {
      console.error('Error loading escrows:', error);
    }
  };

  useEffect(() => {
    loadEscrows();
  }, []);

  return (
    <div style={{ padding: '20px', border: '2px solid #ccc', margin: '20px', backgroundColor: '#f9f9f9' }}>
      <h3>🔧 Account Debug Panel</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Current Account:</strong>
        <pre style={{ background: '#fff', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(account, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={testCreateEscrow} 
          disabled={loading}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Creating...' : 'Create Test Escrow'}
        </button>
      </div>

      {testStatus && (
        <div style={{ margin: '10px 0', padding: '10px', backgroundColor: testStatus.includes('✅') ? '#d4edda' : '#f8d7da', borderRadius: '4px' }}>
          {testStatus}
        </div>
      )}

      <div>
        <strong>User Escrows:</strong>
        <pre style={{ background: '#fff', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
          {escrows ? JSON.stringify(escrows, null, 2) : 'Loading...'}
        </pre>
      </div>

      <button 
        onClick={loadEscrows}
        style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Refresh Escrows
      </button>
    </div>
  );
};

export default AccountDebug;
