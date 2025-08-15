import { useState, useEffect } from 'react'
import './MyAccount.css'
import EscrowDetails from './EscrowDetails'
// @ts-ignore
import { getStatusConfig } from '../utils/escrowHelpers'
import { accountService, UserEscrowData } from '../services/accountService'
import { TABS } from '../constants'

interface MyAccountProps {
  onBack: () => void;
}

const MyAccount = ({ onBack }: MyAccountProps) => {
  const [activeTab, setActiveTab] = useState(TABS.CURRENT)
  const [selectedEscrow, setSelectedEscrow] = useState(null)
  const [currentEscrows, setCurrentEscrows] = useState<UserEscrowData[]>([])
  const [escrowHistory, setEscrowHistory] = useState<UserEscrowData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get current account info
  const currentAccount = accountService.getCurrentAccount()

  // Load user escrows on mount
  useEffect(() => {
    loadUserEscrows()
  }, [])

  const loadUserEscrows = async () => {
    try {
      setLoading(true)
      setError(null)
      const escrows = await accountService.getUserEscrows()
      setCurrentEscrows(escrows.current)
      setEscrowHistory(escrows.history)
    } catch (err) {
      setError('Failed to load escrows. Please try again.')
      console.error('Error loading user escrows:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const config = getStatusConfig(status)
    return <span className={`status-badge ${config.class}`}>{config.text}</span>
  }

  const EscrowCard = ({ escrow, showDate = false }: { escrow: UserEscrowData; showDate?: boolean }) => (
    <div className="escrow-card">
      <div className="escrow-header">
        <div className="escrow-id">#{escrow.id}</div>
        {getStatusBadge(escrow.status)}
      </div>
      
      <div className="escrow-details">
        <h3 className="product-title">{escrow.productTitle}</h3>
        <div className="escrow-meta">
          <div className="meta-item">
            <span className="meta-label">Amount:</span>
            <span className="meta-value price">{escrow.amount}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Role:</span>
            <span className={`meta-value role-${escrow.role}`}>
              {escrow.role === 'buyer' ? '🛒 Buyer' : '🏪 Seller'}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Counterparty:</span>
            <span className="meta-value">{escrow.counterparty}</span>
          </div>
          {showDate && (
            <div className="meta-item">
              <span className="meta-label">Date:</span>
              <span className="meta-value">{escrow.completedDate || escrow.createdDate}</span>
            </div>
          )}
        </div>
      </div>

      <div className="escrow-actions">
        <button 
          className="action-button secondary"
          onClick={() => setSelectedEscrow(escrow as any)}
        >
          View Details
        </button>
        {escrow.status === 'pending_seller_approval' && escrow.role === 'seller' && (
          <button className="action-button primary">Approve Escrow</button>
        )}
        {escrow.status === 'funds_escrowed' && escrow.role === 'seller' && (
          <button className="action-button primary">Ship to Authenticator</button>
        )}
        {escrow.status === 'in_authentication' && (
          <button className="action-button secondary">Track Progress</button>
        )}
      </div>
    </div>
  )

  // Handle loading state
  if (loading) {
    return (
      <div className="my-account">
        <div className="account-header">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <h2>Loading your account...</h2>
        </div>
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="my-account">
        <div className="account-header">
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
          <h2>Error Loading Account</h2>
          <p>{error}</p>
          <button className="primary-button" onClick={loadUserEscrows}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // If an escrow is selected, show the details view
  if (selectedEscrow) {
    return (
      <EscrowDetails 
        escrow={selectedEscrow} 
        onBack={() => setSelectedEscrow(null)} 
      />
    )
  }

  return (
    <div className="my-account">
      <div className="account-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h2>My Account</h2>
        <p className="subtitle">
          Welcome {currentAccount.displayName}! Manage your escrow transactions and view your history.
        </p>
      </div>

      <div className="account-stats">
        <div className="stat-card">
          <div className="stat-number">{currentEscrows.length}</div>
          <div className="stat-label">Active Escrows</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">${currentEscrows.reduce((sum, e) => sum + (parseFloat(e.amount.replace(/[$,]/g, '')) || 0), 0).toLocaleString()}</div>
          <div className="stat-label">Total Value (USD)</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{escrowHistory.filter(e => e.status === 'completed').length}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {escrowHistory.length > 0 
              ? Math.round((escrowHistory.filter(e => e.status === 'completed').length / escrowHistory.length) * 100)
              : 100}%
          </div>
          <div className="stat-label">Success Rate</div>
        </div>
      </div>

      <div className="account-tabs">
        <button 
          className={`tab-button ${activeTab === TABS.CURRENT ? 'active' : ''}`}
          onClick={() => setActiveTab(TABS.CURRENT)}
        >
          Current Escrows ({currentEscrows.length})
        </button>
        <button 
          className={`tab-button ${activeTab === TABS.HISTORY ? 'active' : ''}`}
          onClick={() => setActiveTab(TABS.HISTORY)}
        >
          History ({escrowHistory.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === TABS.CURRENT ? (
          <div className="escrows-list">
            {currentEscrows.length > 0 ? (
              currentEscrows.map(escrow => (
                <EscrowCard key={escrow.id} escrow={escrow} />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🕊️</div>
                <h3>No Active Escrows</h3>
                <p>You don't have any active escrows at the moment.</p>
                <button className="primary-button" onClick={onBack}>
                  Create New Escrow
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="escrows-list">
            {escrowHistory.length > 0 ? (
              escrowHistory.map(escrow => (
                <EscrowCard key={escrow.id} escrow={escrow} showDate={true} />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📜</div>
                <h3>No Transaction History</h3>
                <p>Your completed escrows will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAccount
