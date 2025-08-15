import React, { useState } from 'react'
import './EscrowRequestForm.css'
import { CURRENCIES, USER_ROLES, CURRENCY_CONFIG } from '../constants'
import { useAppContext } from '../contexts/AppContext'
import { useEscrow } from '../hooks/useEscrow'

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
  const { user } = useAppContext()
  const { createEscrow, loading: escrowLoading, error: escrowError } = useEscrow()
  
  const [formData, setFormData] = useState<FormData>({
    initiatorRole: USER_ROLES.BUYER, // 'buyer' or 'seller'
    productTitle: '',
    productDescription: '',
    price: '',
    currency: 'USD', // Changed to USD for Plaid integration
    counterpartyEmail: '',
    deliveryAddress: '',
    estimatedDeliveryDays: '',
    additionalTerms: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    const newErrors: FormErrors = {}

    if (!formData.productTitle.trim()) {
      newErrors.productTitle = 'Product title is required'
    }
    
    if (!formData.productDescription.trim()) {
      newErrors.productDescription = 'Product description is required'
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      try {
        // Use email addresses instead of wallet addresses
        const userEmail = user?.email || 'current-user@example.com' // In production, get from authentication
        
        const escrowData = {
          buyer: formData.initiatorRole === USER_ROLES.BUYER ? userEmail : formData.counterpartyEmail,
          seller: formData.initiatorRole === USER_ROLES.SELLER ? userEmail : formData.counterpartyEmail,
          amount: `$${formData.price}`, // USD amount for Plaid
          productTitle: formData.productTitle,
          productDescription: formData.productDescription,
          deliveryAddress: formData.deliveryAddress,
          estimatedDeliveryDays: parseInt(formData.estimatedDeliveryDays) || 7,
        }

        console.log('Creating escrow request:', escrowData)
        
        const escrowId = await createEscrow(escrowData)
        
        alert(`✅ Escrow Request Created!\nEscrow ID: ${escrowId}\n\nA smart contract has been deployed to track this escrow securely. The counterparty will be notified via email and can sign the agreement to activate the escrow.\n\nPayment will be processed through secure bank transfer (no crypto wallet required by users).`)
        onCancel() // Return to main page
        
      } catch (error) {
        console.error('Failed to create escrow:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        alert(`❌ Failed to create escrow: ${errorMessage}`)
      }
    }
  }

  return (
    <div className="escrow-form-container">
      <div className="form-header">
        <button className="back-button" onClick={onCancel}>
          ← Back
        </button>
        <h2>Create New Escrow Request</h2>
        <p>Create a secure escrow agreement. Both parties must approve before funds are processed via secure bank transfer.</p>
      </div>

      {(escrowLoading || escrowError) && (
        <div className={`status-message ${escrowError ? 'error' : 'loading'}`}>
          {escrowLoading && (
            <>
              <span className="status-icon">⏳</span>
              Deploying smart contract... Our backend is handling all blockchain interactions securely.
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
              rows={4}
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
              <small className="help-text">💳 Payment will be processed securely via bank transfer (no crypto required)</small>
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
                {CURRENCIES.map((currency: string) => (
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
              rows={3}
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
              rows={3}
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
