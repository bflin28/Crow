import { useState } from 'react'
import './MyAccount.css'
import EscrowDetails from './EscrowDetails'
import { formatCurrency } from '../utils/formatters'
import { getStatusConfig } from '../utils/escrowHelpers'
import { getMockCurrentEscrows, getMockEscrowHistory } from '../utils/mockData'
import { TABS } from '../constants'

const MyAccount = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState(TABS.CURRENT)
  const [selectedEscrow, setSelectedEscrow] = useState(null)

  // Mock data - in production, this would come from your backend/blockchain
  const mockCurrentEscrows = getMockCurrentEscrows()
  const mockEscrowHistory = getMockEscrowHistory()

  const getStatusBadge = (status) => {
    const config = getStatusConfig(status)
    return <span className={`status-badge ${config.class}`}>{config.text}</span>
  }

  const EscrowCard = ({ escrow, showDate = false }) => (
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
            <span className="meta-value price">{formatCurrency(escrow.price, escrow.currency)}</span>
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
        
        <div className="status-message">
          <span className="status-icon">ℹ️</span>
          {escrow.statusMessage}
        </div>
      </div>

      <div className="escrow-actions">
        <button 
          className="action-button secondary"
          onClick={() => setSelectedEscrow(escrow)}
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
    <div className="account-container">
      <div className="account-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Home
        </button>
        <h2>My Account</h2>
        <p className="subtitle">
          Manage your escrow transactions and view your history
        </p>
      </div>

      <div className="account-stats">
        <div className="stat-card">
          <div className="stat-number">{mockCurrentEscrows.length}</div>
          <div className="stat-label">Active Escrows</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">${mockCurrentEscrows.reduce((sum, e) => sum + (e.currency === 'USD' ? e.price : 0), 0).toLocaleString()}</div>
          <div className="stat-label">Total Value (USD)</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{mockEscrowHistory.filter(e => e.status === 'completed').length}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">98%</div>
          <div className="stat-label">Success Rate</div>
        </div>
      </div>

      <div className="account-tabs">
        <button 
          className={`tab-button ${activeTab === TABS.CURRENT ? 'active' : ''}`}
          onClick={() => setActiveTab(TABS.CURRENT)}
        >
          Current Escrows ({mockCurrentEscrows.length})
        </button>
        <button 
          className={`tab-button ${activeTab === TABS.HISTORY ? 'active' : ''}`}
          onClick={() => setActiveTab(TABS.HISTORY)}
        >
          History ({mockEscrowHistory.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === TABS.CURRENT ? (
          <div className="escrows-list">
            {mockCurrentEscrows.length > 0 ? (
              mockCurrentEscrows.map(escrow => (
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
            {mockEscrowHistory.length > 0 ? (
              mockEscrowHistory.map(escrow => (
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
