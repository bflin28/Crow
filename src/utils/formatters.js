/**
 * Utility functions for formatting data across the application
 */

/**
 * Format currency amount with appropriate symbol and localization
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency type ('USD', 'ETH', 'BTC')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency) => {
  if (currency === 'USD') {
    return `$${amount.toLocaleString()}`
  } else if (currency === 'ETH') {
    return `${amount} ETH`
  } else if (currency === 'BTC') {
    return `${amount} BTC`
  }
  return `${amount} ${currency}`
}

/**
 * Format date string for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
