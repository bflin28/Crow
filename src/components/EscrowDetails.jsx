import { useState } from 'react'
import './EscrowDetails.css'
import { formatCurrency } from '../utils/formatters'
import { getParticipantLabel } from '../utils/escrowHelpers'
import { STATUS_TO_STEP, TABS } from '../constants'

const EscrowDetails = ({ escrow, onBack }) => {
  const [activeTab, setActiveTab] = useState(TABS.PROGRESS)

  // Define the complete process flow
  const processSteps = [
    {
      id: 1,
      title: "Escrow Request Created",
      description: "Initial escrow request with product details and terms",
      icon: "📝",
      participants: ["initiator"],
      completedStatuses: ["pending_seller_approval", "pending_buyer_approval", "funds_escrowed", "in_authentication", "in_transit", "completed"]
    },
    {
      id: 2,
      title: "Both Parties Sign Agreement",
      description: "Buyer and seller review and digitally sign the escrow terms",
      icon: "✍️",
      participants: ["buyer", "seller"],
      completedStatuses: ["funds_escrowed", "in_authentication", "in_transit", "completed"]
    },
    {
      id: 3,
      title: "Funds Secured in Smart Contract",
      description: "Buyer's payment and authenticator fees are held in secure escrow",
      icon: "🔒",
      participants: ["buyer"],
      completedStatuses: ["in_authentication", "in_transit", "completed"]
    },
    {
      id: 4,
      title: "Item Shipped to Authenticator",
      description: "Seller ships item to professional authenticator with tracking",
      icon: "📦",
      participants: ["seller"],
      completedStatuses: ["in_authentication", "in_transit", "completed"]
    },
    {
      id: 5,
      title: "Professional Authentication",
      description: "Expert inspection to verify authenticity and condition",
      icon: "🔍",
      participants: ["authenticator"],
      completedStatuses: ["in_transit", "completed"]
    },
    {
      id: 6,
      title: "Item Shipped to Buyer",
      description: "Authenticated item sent to buyer with tracking confirmation",
      icon: "🚚",
      participants: ["authenticator"],
      completedStatuses: ["completed"]
    },
    {
      id: 7,
      title: "Payment Released to Seller",
      description: "Automatic fund release upon delivery confirmation",
      icon: "💰",
      participants: ["smart_contract"],
      completedStatuses: ["completed"]
    }
  ]

  const getStepStatus = (step) => {
    if (step.completedStatuses.includes(escrow.status)) {
      return 'completed'
    } else if (step.id === getCurrentStepId()) {
      return 'current'
    } else {
      return 'pending'
    }
  }

  const getCurrentStepId = () => {
    return STATUS_TO_STEP[escrow.status] || 1
  }

  const getParticipantLabelForEscrow = (participant) => {
    return getParticipantLabel(participant, escrow.role)
  }

  const getActionForCurrentStep = () => {
    const currentStep = getCurrentStepId()
    const userRole = escrow.role

    const actions = {
      2: {
        buyer: escrow.status === 'pending_buyer_approval' ? 'Sign Agreement' : 'Waiting for seller signature',
        seller: escrow.status === 'pending_seller_approval' ? 'Sign Agreement' : 'Waiting for buyer signature'
      },
      3: {
        buyer: 'Submit Payment to Escrow',
        seller: 'Waiting for buyer payment'
      },
      4: {
        buyer: 'Waiting for seller to ship item',
        seller: 'Ship Item to Authenticator'
      },
      5: {
        buyer: 'Item being authenticated',
        seller: 'Item being authenticated'
      },
      6: {
        buyer: 'Item being shipped to you',
        seller: 'Item being shipped to buyer'
      }
    }

    return actions[currentStep]?.[userRole] || 'No action required'
  }

  const StepCard = ({ step, status }) => (
    <div className={`step-card ${status}`}>
      <div className="step-icon-container">
        <div className="step-icon">{step.icon}</div>
        <div className={`step-connector ${status === 'completed' ? 'completed' : ''}`}></div>
      </div>
      
      <div className="step-content">
        <div className="step-header">
          <h3 className="step-title">{step.title}</h3>
          <div className={`step-status-badge ${status}`}>
            {status === 'completed' && '✓ Complete'}
            {status === 'current' && '🔄 In Progress'}
            {status === 'pending' && '⏳ Pending'}
          </div>
        </div>
        
        <p className="step-description">{step.description}</p>
        
        <div className="step-participants">
          <span className="participants-label">Who's involved:</span>
          {step.participants.map(participant => (
            <span key={participant} className="participant-tag">
              {getParticipantLabelForEscrow(participant)}
            </span>
          ))}
        </div>

        {status === 'current' && (
          <div className="current-action">
            <span className="action-label">Next Action:</span>
            <span className="action-text">{getActionForCurrentStep()}</span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="escrow-details-container">
      <div className="details-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Account
        </button>
        <div className="escrow-title-section">
          <h2>{escrow.productTitle}</h2>
          <div className="escrow-meta-header">
            <span className="escrow-id">#{escrow.id}</span>
            <span className={`status-badge status-${escrow.status}`}>
              {escrow.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        </div>
      </div>

      <div className="escrow-summary">
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Amount</span>
            <span className="summary-value price">{formatCurrency(escrow.price, escrow.currency)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Your Role</span>
            <span className={`summary-value role-${escrow.role}`}>
              {escrow.role === 'buyer' ? '🛒 Buyer' : '🏪 Seller'}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Counterparty</span>
            <span className="summary-value">{escrow.counterparty}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Created</span>
            <span className="summary-value">{escrow.createdDate}</span>
          </div>
        </div>
      </div>

      <div className="details-tabs">
        <button 
          className={`tab-button ${activeTab === TABS.PROGRESS ? 'active' : ''}`}
          onClick={() => setActiveTab(TABS.PROGRESS)}
        >
          📊 Progress Timeline
        </button>
        <button 
          className={`tab-button ${activeTab === TABS.DETAILS ? 'active' : ''}`}
          onClick={() => setActiveTab(TABS.DETAILS)}
        >
          📋 Full Details
        </button>
        <button 
          className={`tab-button ${activeTab === TABS.MESSAGES ? 'active' : ''}`}
          onClick={() => setActiveTab(TABS.MESSAGES)}
        >
          💬 Messages & Updates
        </button>
      </div>

      <div className="tab-content">
        {activeTab === TABS.PROGRESS && (
          <div className="progress-timeline">
            <div className="timeline-header">
              <h3>Escrow Progress</h3>
              <p>Track your escrow from start to finish. Each step is clearly marked with who needs to take action.</p>
            </div>
            
            <div className="steps-container">
              {processSteps.map(step => (
                <StepCard 
                  key={step.id} 
                  step={step} 
                  status={getStepStatus(step)} 
                />
              ))}
            </div>

            {escrow.status !== 'completed' && (
              <div className="next-actions">
                <h4>What happens next?</h4>
                <div className="next-action-card">
                  <p>{escrow.statusMessage}</p>
                  {getActionForCurrentStep().includes('You') && (
                    <button className="action-button primary">
                      {getActionForCurrentStep()}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === TABS.DETAILS && (
          <div className="full-details">
            <div className="details-section">
              <h4>Product Information</h4>
              <div className="detail-item">
                <span className="detail-label">Title:</span>
                <span className="detail-value">{escrow.productTitle}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Description:</span>
                <span className="detail-value">Detailed product description would be shown here...</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Price:</span>
                <span className="detail-value">{formatCurrency(escrow.price, escrow.currency)}</span>
              </div>
            </div>

            <div className="details-section">
              <h4>Delivery Information</h4>
              <div className="detail-item">
                <span className="detail-label">Delivery Address:</span>
                <span className="detail-value">Address would be shown here...</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Estimated Delivery:</span>
                <span className="detail-value">7-10 business days</span>
              </div>
            </div>

            <div className="details-section">
              <h4>Smart Contract</h4>
              <div className="detail-item">
                <span className="detail-label">Contract Address:</span>
                <span className="detail-value">0x1234...abcd (mock)</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Network:</span>
                <span className="detail-value">Ethereum Mainnet</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === TABS.MESSAGES && (
          <div className="messages-timeline">
            <div className="message-item">
              <div className="message-date">{escrow.createdDate}</div>
              <div className="message-content">
                <strong>Escrow Created</strong>
                <p>Your escrow request has been created and sent to the counterparty for approval.</p>
              </div>
            </div>
            
            {escrow.status !== 'pending_seller_approval' && escrow.status !== 'pending_buyer_approval' && (
              <div className="message-item">
                <div className="message-date">{escrow.createdDate}</div>
                <div className="message-content">
                  <strong>Agreement Signed</strong>
                  <p>Both parties have signed the escrow agreement. The escrow is now active.</p>
                </div>
              </div>
            )}
            
            <div className="message-placeholder">
              <p>More updates will appear here as your escrow progresses...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EscrowDetails
