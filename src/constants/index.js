/**
 * Constants and configuration objects used across the application
 */

/**
 * Escrow status configuration for badges and display
 */
export const ESCROW_STATUS_CONFIG = {
  'pending_seller_approval': { 
    text: 'Pending Approval', 
    class: 'status-pending' 
  },
  'pending_buyer_approval': { 
    text: 'Pending Approval', 
    class: 'status-pending' 
  },
  'funds_escrowed': { 
    text: 'Funds Secured', 
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
 */
export const CURRENCIES = ['USD', 'ETH', 'BTC']

/**
 * Currency display configuration
 */
export const CURRENCY_CONFIG = {
  USD: { symbol: '$', name: 'USD ($)' },
  ETH: { symbol: 'ETH', name: 'ETH (Ethereum)' },
  BTC: { symbol: 'BTC', name: 'BTC (Bitcoin)' }
}

/**
 * User roles in escrow transactions
 */
export const USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller'
}

/**
 * Tab identifiers for navigation
 */
export const TABS = {
  CURRENT: 'current',
  HISTORY: 'history',
  PROGRESS: 'progress',
  DETAILS: 'details',
  MESSAGES: 'messages'
}

/**
 * Status to step mapping for escrow progress
 */
export const STATUS_TO_STEP = {
  'pending_seller_approval': 2,
  'pending_buyer_approval': 2,
  'funds_escrowed': 3,
  'in_authentication': 5,
  'in_transit': 6,
  'completed': 7
}
