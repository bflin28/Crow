/**
 * Constants and configuration objects used across the application
 */

interface StatusConfig {
  text: string;
  class: string;
}

interface CurrencyConfig {
  symbol: string;
  name: string;
}

/**
 * Escrow status configuration for badges and display
 */
export const ESCROW_STATUS_CONFIG: Record<string, StatusConfig> = {
  'pending_seller_approval': { 
    text: 'Pending Approval', 
    class: 'status-pending' 
  },
  'pending_buyer_approval': { 
    text: 'Pending Approval', 
    class: 'status-pending' 
  },
  'funds_escrowed': { 
    text: 'Payment Processing', 
    class: 'status-active' 
  },
  'in_authentication': { 
    text: 'Authenticating', 
    class: 'status-active' 
  },
  'in_transit': { 
    text: 'In Transit', 
    class: 'status-active' 
  },
  'completed': { 
    text: 'Completed', 
    class: 'status-completed' 
  },
  'cancelled': { 
    text: 'Cancelled', 
    class: 'status-cancelled' 
  },
  'disputed': { 
    text: 'Disputed', 
    class: 'status-disputed' 
  }
}

/**
 * Available currency options for escrow transactions
 * Focused on traditional currencies now that we're using Plaid
 */
export const CURRENCIES: string[] = ['USD']

/**
 * Currency display configuration
 * Simplified for traditional banking
 */
export const CURRENCY_CONFIG: Record<string, CurrencyConfig> = {
  USD: { symbol: '$', name: 'USD ($)' }
}

/**
 * User roles in escrow transactions
 */
export const USER_ROLES: Record<string, string> = {
  BUYER: 'buyer',
  SELLER: 'seller'
}

/**
 * Tab identifiers for navigation
 */
export const TABS: Record<string, string> = {
  CURRENT: 'current',
  HISTORY: 'history',
  PROGRESS: 'progress',
  DETAILS: 'details',
  MESSAGES: 'messages'
}

/**
 * Status to step mapping for escrow progress
 * Updated for traditional payment processing
 */
export const STATUS_TO_STEP: Record<string, number> = {
  'pending_seller_approval': 2,
  'pending_buyer_approval': 2,
  'payment_processing': 3,
  'in_authentication': 5,
  'in_transit': 6,
  'completed': 7
}
