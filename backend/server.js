const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Plaid client configuration
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET_KEY,
    },
  },
});

const client = new PlaidApi(configuration);

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Create Link Token
app.post('/api/plaid/create_link_token', async (req, res) => {
  try {
    const { user_id } = req.body;

    const request = {
      user: {
        client_user_id: user_id,
      },
      client_name: 'Crow Escrow',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    };

    const response = await client.linkTokenCreate(request);
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ 
      error: 'Failed to create link token',
      details: error.response?.data || error.message 
    });
  }
});

// Exchange Public Token for Access Token
app.post('/api/plaid/exchange_public_token', async (req, res) => {
  try {
    const { public_token } = req.body;

    const response = await client.itemPublicTokenExchange({
      public_token: public_token,
    });

    const { access_token, item_id } = response.data;

    // In production, store this access_token securely in your database
    // associated with the user

    res.json({
      access_token,
      item_id,
    });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    res.status(500).json({ 
      error: 'Failed to exchange public token',
      details: error.response?.data || error.message 
    });
  }
});

// Get Account Information
app.post('/api/plaid/accounts', async (req, res) => {
  try {
    const { access_token } = req.body;

    const response = await client.accountsGet({
      access_token: access_token,
    });

    const accounts = response.data.accounts;

    res.json({ accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch accounts',
      details: error.response?.data || error.message 
    });
  }
});

// Get Account Balance
app.post('/api/plaid/balance', async (req, res) => {
  try {
    const { access_token } = req.body;

    const response = await client.accountsBalanceGet({
      access_token: access_token,
    });

    res.json({ accounts: response.data.accounts });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ 
      error: 'Failed to fetch balance',
      details: error.response?.data || error.message 
    });
  }
});

// Initiate ACH Transfer (Mock for now)
app.post('/api/payments/initiate-ach', async (req, res) => {
  try {
    const { access_token, account_id, amount } = req.body;

    // In a real implementation, you would:
    // 1. Use Plaid Transfer API to initiate the ACH transfer
    // 2. Or integrate with a payment processor like Stripe
    // 3. Handle webhooks for transfer status updates

    // For demo purposes, we'll simulate a successful initiation
    const mockTransactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`Mock ACH transfer initiated:`, {
      transaction_id: mockTransactionId,
      account_id,
      amount,
      status: 'pending',
    });

    res.json({
      transaction_id: mockTransactionId,
      status: 'pending',
      amount,
      estimated_completion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
    });
  } catch (error) {
    console.error('Error initiating ACH transfer:', error);
    res.status(500).json({ 
      error: 'Failed to initiate ACH transfer',
      details: error.message 
    });
  }
});

// Get Transfer Status (Mock)
app.get('/api/payments/status/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Mock status check - in real implementation, query your payment processor
    const mockStatuses = ['pending', 'processing', 'completed', 'failed'];
    const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];

    res.json({
      transaction_id: transactionId,
      status: randomStatus,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error checking transfer status:', error);
    res.status(500).json({ 
      error: 'Failed to check transfer status',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Crow backend server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.PLAID_ENV || 'sandbox'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
