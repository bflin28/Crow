/**
 * Test script to verify account setup is working
 */

import { accountService } from '../services/accountService.js';
import { escrowService } from '../services/escrowService.js';

console.log('🧪 Testing Account Setup...\n');

// Test 1: Get current account
console.log('1. Testing current account:');
const account = accountService.getCurrentAccount();
console.log('Account:', account);
console.log('Is logged in:', accountService.isLoggedIn());

// Test 2: Create a test escrow
console.log('\n2. Creating test escrow...');
const testEscrow = {
  buyer: account.email,
  seller: 'seller@example.com',
  amount: '$100',
  productTitle: 'Test Product for Account System',
  productDescription: 'Testing account integration',
  deliveryAddress: '123 Test St, Test City',
  estimatedDeliveryDays: 7
};

try {
  const escrowId = await escrowService.createEscrow(testEscrow);
  console.log('✅ Escrow created:', escrowId);
  
  // Test 3: Check if escrow shows up in user account
  console.log('\n3. Testing user escrows query...');
  const userEscrows = await accountService.getUserEscrows();
  console.log('Current escrows:', userEscrows.current);
  console.log('Escrow history:', userEscrows.history);
  
  console.log('\n✅ Account setup test completed successfully!');
} catch (error) {
  console.error('❌ Test failed:', error);
}
