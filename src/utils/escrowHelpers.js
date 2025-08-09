import { ESCROW_STATUS_CONFIG } from '../constants'

/**
 * Get status configuration for escrow status
 * @param {string} status - The escrow status
 * @returns {Object} Status configuration with text and class
 */
export const getStatusConfig = (status) => {
  return ESCROW_STATUS_CONFIG[status] || { 
    text: status, 
    class: 'status-pending' 
  }
}

/**
 * Get participant label for escrow process
 * @param {string} participant - Participant type
 * @param {string} userRole - Current user's role
 * @returns {string} Formatted participant label
 */
export const getParticipantLabel = (participant, userRole) => {
  const labels = {
    'initiator': userRole === 'buyer' ? 'You (Buyer)' : 'You (Seller)',
    'buyer': userRole === 'buyer' ? 'You' : 'Counterparty',
    'seller': userRole === 'seller' ? 'You' : 'Counterparty',
    'authenticator': 'Professional Authenticator',
    'smart_contract': 'Smart Contract (Automatic)'
  }
  return labels[participant] || participant
}
