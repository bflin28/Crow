/**
 * Mock data utilities and API simulation
 * In production, these would be replaced with actual API calls
 */

import { USER_ROLES } from '../constants'

/**
 * Mock current escrows data
 */
export const getMockCurrentEscrows = () => [
  {
    id: 'ESC-001',
    productTitle: 'Designer Handbag - Louis Vuitton Speedy 30',
    price: 1250,
    currency: 'USD',
    role: USER_ROLES.BUYER,
    status: 'pending_seller_approval',
    counterparty: 'sarah.seller@email.com',
    createdDate: '2025-08-05',
    statusMessage: 'Waiting for seller to approve escrow terms'
  },
  {
    id: 'ESC-002', 
    productTitle: 'Vintage Rolex Submariner',
    price: 8500,
    currency: 'USD',
    role: USER_ROLES.SELLER,
    status: 'funds_escrowed',
    counterparty: 'watch.collector@email.com',
    createdDate: '2025-08-03',
    statusMessage: 'Funds secured. Please ship item to authenticator'
  },
  {
    id: 'ESC-003',
    productTitle: 'MacBook Pro 16" M3 Max',
    price: 2.5,
    currency: 'ETH',
    role: USER_ROLES.BUYER,
    status: 'in_authentication',
    counterparty: 'tech.seller@email.com',
    createdDate: '2025-08-01',
    statusMessage: 'Item being authenticated by our experts'
  }
]

/**
 * Mock escrow history data
 */
export const getMockEscrowHistory = () => [
  {
    id: 'ESC-H001',
    productTitle: 'iPhone 15 Pro Max',
    price: 1200,
    currency: 'USD',
    role: USER_ROLES.SELLER,
    status: 'completed',
    counterparty: 'phone.buyer@email.com',
    completedDate: '2025-07-28',
    statusMessage: 'Successfully completed'
  },
  {
    id: 'ESC-H002',
    productTitle: 'Gaming PC - RTX 4090 Build',
    price: 1.8,
    currency: 'ETH',
    role: USER_ROLES.BUYER,
    status: 'completed',
    counterparty: 'gamer.seller@email.com',
    completedDate: '2025-07-20',
    statusMessage: 'Successfully completed'
  },
  {
    id: 'ESC-H003',
    productTitle: 'Limited Edition Sneakers',
    price: 850,
    currency: 'USD',
    role: USER_ROLES.SELLER,
    status: 'cancelled',
    counterparty: 'sneaker.head@email.com',
    completedDate: '2025-07-15',
    statusMessage: 'Cancelled by mutual agreement'
  }
]
