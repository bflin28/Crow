# Plaid Integration Setup Guide

This guide will help you set up Plaid in sandbox mode for testing the ACH payment functionality in Crow.

## 1. Create a Plaid Account

1. Go to [Plaid Dashboard](https://dashboard.plaid.com/signup)
2. Sign up for a free developer account
3. Verify your email address

## 2. Get Your API Keys

1. Log into your Plaid Dashboard
2. Go to **Keys** in the left sidebar
3. Copy your:
   - **Client ID**
   - **Secret key** (for Sandbox environment)

## 3. Configure Environment Variables

### Frontend (.env in root directory):
```bash
cp .env.example .env
```

Edit `.env` and add:
```bash
VITE_PLAID_ENV=sandbox
```

### Backend (.env in backend directory):
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your Plaid credentials:
```bash
PLAID_CLIENT_ID=your_plaid_client_id_here
PLAID_SECRET_KEY=your_plaid_sandbox_secret_key_here
PLAID_ENV=sandbox
PORT=3001
```

## 4. Install Dependencies

### Backend Dependencies:
```bash
cd backend
npm install
```

### Frontend Dependencies (from project root):
```bash
npm install
```

## 5. Start the Development Servers

### Terminal 1 - Backend Server:
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend Server:
```bash
npm run dev
```

## 6. Testing in Sandbox Mode

When you connect a bank account through Plaid Link, use these test credentials:

### Test Bank Accounts:

**Good Auth (checking account):**
- Username: `user_good`
- Password: `pass_good`

**Good Auth (savings account):**
- Username: `user_good`  
- Password: `pass_good`

**Custom user with multiple accounts:**
- Username: `custom_user`
- Password: `custom_pass`

### Test Scenarios:

1. **Successful Connection**: Use `user_good` credentials
2. **Institution Error**: Use `user_bad` / `pass_bad`
3. **Item Login Required**: Some test accounts will simulate re-authentication flows

## 7. Verify Setup

1. Visit `http://localhost:5173` (frontend)
2. Create a new escrow request
3. Choose "Bank Transfer (ACH)" payment method
4. Click "Connect Bank Account"
5. Select "Chase" or any test bank
6. Use the test credentials above

You should see the Plaid Link flow working and be able to "connect" a test bank account.

## 8. Backend API Endpoints

Your backend server provides these endpoints:

- `POST /api/plaid/create_link_token` - Creates Plaid Link tokens
- `POST /api/plaid/exchange_public_token` - Exchanges public token for access token
- `POST /api/plaid/accounts` - Gets account information
- `POST /api/payments/initiate-ach` - Initiates ACH transfer (mock)
- `GET /api/payments/status/:transactionId` - Checks payment status (mock)

## 9. Production Considerations

When ready for production:

1. Apply for Production access in Plaid Dashboard
2. Get Production API keys
3. Change `PLAID_ENV=production` in your environment variables
4. Implement proper user authentication and access token storage
5. Add proper error handling and webhooks
6. Implement real ACH processing (consider Stripe + Plaid integration)

## 10. Security Notes

- Never expose secret keys in frontend code
- Store access tokens securely in your database
- Use environment variables for all sensitive data
- Implement proper user authentication before storing bank connections

## Troubleshooting

### Common Issues:

1. **"Invalid client_id"**: Double-check your PLAID_CLIENT_ID in backend/.env
2. **"Invalid secret"**: Verify your PLAID_SECRET_KEY is correct
3. **CORS errors**: Make sure backend is running on port 3001
4. **Link Token errors**: Check backend logs for detailed error messages

### Test the Backend:

```bash
curl http://localhost:3001/health
```

Should return: `{"status":"OK","timestamp":"..."}`
