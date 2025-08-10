# Plaid Sandbox Testing Guide

## 🏦 Test Bank Accounts in Plaid Sandbox

When you connect a bank account through Plaid Link in sandbox mode, you'll be presented with a list of test banks. Here are the test credentials you can use:

## 📱 **Step-by-Step Testing Process:**

### 1. **Start Your Servers**
First, you need both servers running:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend  
npm install
npm run dev
```

### 2. **Create an Escrow Request**
1. Go to `http://localhost:5173`
2. Click "Request Escrow" 
3. Fill out the form with test data:
   - Product: "Test iPhone 15"
   - Price: "800"
   - Description: "Testing Plaid integration"
4. Submit the form

### 3. **Choose Bank Payment**
1. Select "Bank Transfer (ACH)" (the recommended option)
2. Click "Connect Bank Account"

### 4. **Plaid Link Opens**
You'll see a popup/modal with test banks. Choose any bank (e.g., "Chase", "Bank of America", "Wells Fargo")

### 5. **Use Test Credentials**

**Most Common Test Accounts:**

#### ✅ **Good Auth (Success)**
- **Username:** `user_good`
- **Password:** `pass_good`
- **Result:** Successfully connects with checking/savings accounts

#### ✅ **Custom User (Multiple Accounts)**
- **Username:** `custom_user`  
- **Password:** `custom_pass`
- **Result:** Shows multiple account types (checking, savings, credit)

#### ❌ **Bad Auth (Test Error Flows)**
- **Username:** `user_bad`
- **Password:** `pass_bad`
- **Result:** Simulates authentication failure

#### 🔄 **Item Login Required**
- **Username:** `user_login_required`
- **Password:** `pass_login_required`
- **Result:** Simulates re-authentication needed

### 6. **Account Selection**
After successful login, you'll see test accounts like:
- "Plaid Checking" - $100.00
- "Plaid Savings" - $200.00  
- "Plaid Money Market" - $500.00

Select any account to connect.

### 7. **Complete the Flow**
Once connected, you should see:
- ✅ Connected Account confirmation
- Account name and type displayed
- "Pay $800" button becomes active

## 🎯 **What You'll See in Testing:**

### **Frontend Behavior:**
```
1. Form submission → Payment method selection
2. "Connect Bank Account" → Plaid Link opens
3. Choose test bank → Enter test credentials  
4. Account selection → Connection confirmed
5. "Pay $800" button → Mock payment processing
6. Success → Smart contract escrow created
```

### **Backend Logs:**
```
Mock ACH transfer initiated: {
  transaction_id: 'txn_1234567890_abc123',
  account_id: 'account_123',
  amount: '800',
  status: 'pending'
}
```

### **Console Logs:**
```javascript
// In browser console:
Bank account connected: {
  access_token: "access-sandbox-xxx",
  accounts: [...],
  metadata: {...}
}

Processing ACH payment for: 800
```

## 🧪 **Advanced Testing Scenarios:**

### **Test Different Account Types:**
```javascript
// The sandbox returns various account types:
{
  account_id: "account_123",
  name: "Plaid Checking", 
  type: "depository",
  subtype: "checking",
  balances: {
    available: 100.00,
    current: 110.00
  }
}
```

### **Test Error Handling:**
1. Use `user_bad` credentials → See error handling
2. Close Plaid Link modal → Test onExit callback
3. Try with empty form → See validation

### **Test Payment Status:**
The mock backend randomly returns different statuses:
```bash
curl http://localhost:3001/api/payments/status/txn_123
# Returns: pending, processing, completed, or failed
```

## 📋 **Verification Checklist:**

- [ ] Backend server starts on port 3001
- [ ] Frontend loads at localhost:5173
- [ ] Can create escrow request form
- [ ] Payment method selection appears
- [ ] Plaid Link modal opens
- [ ] Can select test bank
- [ ] Test credentials work
- [ ] Account selection works
- [ ] Connected account displays
- [ ] Payment button works
- [ ] Mock payment processes
- [ ] Escrow creation completes

## 🔧 **Troubleshooting:**

### **Plaid Link doesn't open:**
- Check backend is running on port 3001
- Verify PLAID_CLIENT_ID and PLAID_SECRET_KEY are set
- Check browser console for errors

### **"Invalid client_id" error:**
- Double-check your Plaid credentials in `backend/.env`
- Make sure you're using sandbox keys, not development/production

### **Network errors:**
- Ensure backend CORS is configured
- Check if ports 3001 and 5173 are available

### **No test banks appear:**
- Verify PLAID_ENV=sandbox in backend
- Check Plaid dashboard for account status

## 💡 **Pro Tips:**

1. **Use browser dev tools** to see network requests to `/api/plaid/*`
2. **Check backend console** for detailed Plaid API responses
3. **Try different browsers** if you encounter issues
4. **Clear browser storage** between tests to simulate new users

The beauty of sandbox mode is that no real money moves, no real accounts are connected, and you can test all the edge cases safely!
