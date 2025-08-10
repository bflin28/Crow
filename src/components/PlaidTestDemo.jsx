import React, { useState } from 'react';
import './PlaidTestDemo.css';

const PlaidTestDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const testFlow = [
    {
      title: "1. Start Escrow Creation",
      description: "Fill out escrow form with test data",
      screenshot: "📋",
      details: [
        "Product: Test iPhone 15",
        "Price: $800",
        "Role: Buyer",
        "Submit form"
      ]
    },
    {
      title: "2. Choose Payment Method",
      description: "Select Bank Transfer (recommended)",
      screenshot: "🏦",
      details: [
        "Two options: Bank Transfer vs Crypto",
        "Bank Transfer is recommended",
        "Click 'Bank Transfer (ACH)'"
      ]
    },
    {
      title: "3. Plaid Link Opens",
      description: "Choose a test bank from the list",
      screenshot: "🔗",
      details: [
        "Modal popup with bank list",
        "Choose: Chase, Bank of America, Wells Fargo, etc.",
        "Any bank works in sandbox"
      ]
    },
    {
      title: "4. Enter Test Credentials",
      description: "Use Plaid's sandbox credentials",
      screenshot: "🔐",
      details: [
        "Username: user_good",
        "Password: pass_good", 
        "These are Plaid's official test credentials"
      ]
    },
    {
      title: "5. Select Test Account",
      description: "Choose from mock accounts",
      screenshot: "💰",
      details: [
        "Plaid Checking - $100.00",
        "Plaid Savings - $200.00",
        "Select any account to continue"
      ]
    },
    {
      title: "6. Complete Payment",
      description: "Process mock ACH transfer",
      screenshot: "✅",
      details: [
        "See connected account confirmation",
        "Click 'Pay $800' button",
        "Mock payment processes instantly"
      ]
    },
    {
      title: "7. Escrow Created",
      description: "Smart contract escrow is created",
      screenshot: "🎉",
      details: [
        "Success message with escrow ID",
        "Payment method stored in metadata",
        "Ready for counterparty to sign"
      ]
    }
  ];

  const nextStep = () => {
    if (currentStep < testFlow.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentFlowStep = testFlow[currentStep];

  return (
    <div className="plaid-test-demo">
      <div className="demo-header">
        <h2>🧪 Plaid Sandbox Testing Flow</h2>
        <p>Step-by-step guide to testing bank payments</p>
      </div>

      <div className="flow-progress">
        {testFlow.map((step, index) => (
          <div 
            key={index}
            className={`progress-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
          >
            <div className="step-number">{index + 1}</div>
          </div>
        ))}
      </div>

      <div className="flow-step">
        <div className="step-screenshot">
          <div className="screenshot-placeholder">
            {currentFlowStep.screenshot}
          </div>
        </div>
        
        <div className="step-content">
          <h3>{currentFlowStep.title}</h3>
          <p className="step-description">{currentFlowStep.description}</p>
          
          <div className="step-details">
            <h4>What to do:</h4>
            <ul>
              {currentFlowStep.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>

          {currentStep === 3 && (
            <div className="test-credentials">
              <h4>📋 Copy These Test Credentials:</h4>
              <div className="credential-box">
                <div className="credential">
                  <strong>Username:</strong> 
                  <code onClick={() => navigator.clipboard.writeText('user_good')}>
                    user_good
                  </code>
                </div>
                <div className="credential">
                  <strong>Password:</strong> 
                  <code onClick={() => navigator.clipboard.writeText('pass_good')}>
                    pass_good
                  </code>
                </div>
                <small>Click to copy • Works with any test bank</small>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flow-navigation">
        <button 
          onClick={prevStep} 
          disabled={currentStep === 0}
          className="nav-button prev"
        >
          ← Previous
        </button>
        
        <span className="step-counter">
          {currentStep + 1} of {testFlow.length}
        </span>
        
        <button 
          onClick={nextStep} 
          disabled={currentStep === testFlow.length - 1}
          className="nav-button next"
        >
          Next →
        </button>
      </div>

      <div className="quick-links">
        <h4>🔗 Quick Links for Testing:</h4>
        <div className="links">
          <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer">
            Open Frontend
          </a>
          <a href="http://localhost:3001/health" target="_blank" rel="noopener noreferrer">
            Check Backend
          </a>
          <a href="https://dashboard.plaid.com" target="_blank" rel="noopener noreferrer">
            Plaid Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default PlaidTestDemo;
