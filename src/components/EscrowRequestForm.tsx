import React, { useState } from 'react'
import './EscrowRequestForm.css'
import { CURRENCIES, USER_ROLES, CURRENCY_CONFIG } from '../constants'
import { useWeb3Context } from '../contexts/Web3Context'
import { useEscrow } from '../hooks/useWeb3'

interface EscrowRequestFormProps {
  onCancel: () => void;
}

interface FormData {
  initiatorRole: string;
  productTitle: string;
  productDescription: string;
  price: string;
  currency: string;
  counterpartyEmail: string;
  deliveryAddress: string;
  estimatedDeliveryDays: string;
  additionalTerms: string;
}

interface FormErrors {
  [key: string]: string;
}

const EscrowRequestForm: React.FC<EscrowRequestFormProps> = ({ onCancel }) => {
  const { requireConnection, account } = useWeb3Context()
  const { createEscrow, loading: escrowLoading, error: escrowError } = useEscrow()
  
  const [formData, setFormData] = useState<FormData>({
    initiatorRole: USER_ROLES.BUYER, // 'buyer' or 'seller'
    productTitle: '',
    productDescription: '',
    price: '',
    currency: 'ETH', // Changed to ETH as default for smart contracts
    counterpartyEmail: '',
    deliveryAddress: '',
    estimatedDeliveryDays: '',
    additionalTerms: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.productTitle.trim()) {
      newErrors.productTitle = 'Product title is required'
    }
    
    if (!formData.productDescription.trim()) {
      newErrors.productDescription = 'Product description is required'
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required'
    }
    
    if (!formData.counterpartyEmail.trim()) {
      newErrors.counterpartyEmail = 'Counterparty email is required'
    }
    
    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check Web3 connection first
    if (!requireConnection()) {
      return
    }
    
    if (validateForm()) {
      try {
        // For now, we'll use the current account as both buyer/seller for demo
        // In production, the counterparty address would come from the email/user lookup
        const counterpartyAddress = formData.counterpartyEmail === 'demo@example.com' 
          ? '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' // Demo address from Hardhat
          : '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' // Another demo address

        const escrowData = {
          buyer: formData.initiatorRole === USER_ROLES.BUYER ? account : counterpartyAddress,
          seller: formData.initiatorRole === USER_ROLES.SELLER ? account : counterpartyAddress,
          amount: formData.price,
          productTitle: formData.productTitle,
          productDescription: formData.productDescription,
          deliveryAddress: formData.deliveryAddress,
          estimatedDeliveryDays: parseInt(formData.estimatedDeliveryDays) || 7,
          ipfsHash: '' // Could store additional metadata here
        }

        console.log('Creating smart contract escrow:', escrowData)
        
        const escrowId = await createEscrow(escrowData)
        
        alert(`✅ Smart Contract Escrow Created!\nEscrow ID: ${escrowId}\n\nThe counterparty will now need to sign the agreement to activate the escrow.`)
        onCancel() // Return to main page
        
      } catch (error) {
        console.error('Failed to create escrow:', error)
        alert(`❌ Failed to create escrow: ${error.message}`)
      }
    }
  }

  return (
    <div className="escrow-form-container">
      <div className="form-header">
        <button className="back-button" onClick={onCancel}>
          ← Back
        </button>
        <h2>Create New Smart Contract Escrow</h2>
        <p>This escrow will be secured by blockchain smart contracts. Both parties must sign to activate.</p>
      </div>

      {(escrowLoading || escrowError) && (
        <div className={`status-message ${escrowError ? 'error' : 'loading'}`}>
          {escrowLoading && (
            <>
              <span className="status-icon">⏳</span>
              Creating smart contract escrow... Please confirm the transaction in your wallet.
            </>
          )}
          {escrowError && (
            <>
              <span className="status-icon">❌</span>
              {escrowError}
            </>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="escrow-form">
        <div className="form-section">
          <h3>Your Role</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="initiatorRole"
                value={USER_ROLES.BUYER}
                checked={formData.initiatorRole === USER_ROLES.BUYER}
                onChange={handleChange}
              />
              I am the <strong>Buyer</strong> (purchasing this item)
            </label>
            <label>
              <input
                type="radio"
                name="initiatorRole"
                value={USER_ROLES.SELLER}
                checked={formData.initiatorRole === USER_ROLES.SELLER}
                onChange={handleChange}
              />
              I am the <strong>Seller</strong> (selling this item)
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Product Details</h3>
          
          <div className="form-group">
            <label htmlFor="productTitle">Product Title *</label>
            <input
              type="text"
              id="productTitle"
              name="productTitle"
              value={formData.productTitle}
              onChange={handleChange}
              placeholder="e.g., Designer Handbag - Louis Vuitton"
              className={errors.productTitle ? 'error' : ''}
            />
            {errors.productTitle && <span className="error-message">{errors.productTitle}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="productDescription">Product Description *</label>
            <textarea
              id="productDescription"
              name="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              placeholder="Detailed description of the item, condition, model, etc."
              rows="4"
              className={errors.productDescription ? 'error' : ''}
            />
            {errors.productDescription && <span className="error-message">{errors.productDescription}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                {CURRENCIES.map(currency => (
                  <option key={currency} value={currency}>
                    {CURRENCY_CONFIG[currency].name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Counterparty Information</h3>
          
          <div className="form-group">
            <label htmlFor="counterpartyEmail">
              {formData.initiatorRole === 'buyer' ? 'Seller' : 'Buyer'} Email Address *
            </label>
            <input
              type="email"
              id="counterpartyEmail"
              name="counterpartyEmail"
              value={formData.counterpartyEmail}
              onChange={handleChange}
              placeholder="counterparty@example.com"
              className={errors.counterpartyEmail ? 'error' : ''}
            />
            {errors.counterpartyEmail && <span className="error-message">{errors.counterpartyEmail}</span>}
            <small>They will receive an email to approve this escrow request</small>
          </div>
        </div>

        <div className="form-section">
          <h3>Delivery Details</h3>
          
          <div className="form-group">
            <label htmlFor="deliveryAddress">Delivery Address *</label>
            <textarea
              id="deliveryAddress"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              placeholder="Full delivery address including postal code"
              rows="3"
              className={errors.deliveryAddress ? 'error' : ''}
            />
            {errors.deliveryAddress && <span className="error-message">{errors.deliveryAddress}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="estimatedDeliveryDays">Estimated Delivery (Days)</label>
            <input
              type="number"
              id="estimatedDeliveryDays"
              name="estimatedDeliveryDays"
              value={formData.estimatedDeliveryDays}
              onChange={handleChange}
              placeholder="7"
              min="1"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Terms</h3>
          
          <div className="form-group">
            <label htmlFor="additionalTerms">Additional Terms & Conditions</label>
            <textarea
              id="additionalTerms"
              name="additionalTerms"
              value={formData.additionalTerms}
              onChange={handleChange}
              placeholder="Any additional terms, return policy, warranty info, etc."
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="secondary-button" 
            onClick={onCancel}
            disabled={escrowLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="primary-button"
            disabled={escrowLoading}
          >
            {escrowLoading ? 'Creating Contract...' : 'Create Smart Contract Escrow'}
          </button>
        </div>

        <div className="smart-contract-note">
          <p>
            <strong>🔐 Blockchain Protection:</strong> This creates an Ethereum smart contract 
            requiring both party signatures before activation. Funds are held securely on-chain 
            until delivery is confirmed by our authentication process.
          </p>
        </div>
      </form>
    </div>
  )
}

export default EscrowRequestForm
