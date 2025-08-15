import React, { useState } from 'react'
import './App.css'
import EscrowRequestForm from './components/EscrowRequestForm'
import HowItWorks from './components/HowItWorks'
import MyAccount from './components/MyAccount'
import Authentication from './components/Authentication'
import AccountAbstractionDebug from './components/AccountAbstractionDebug'
import { AppProvider } from './contexts/AppContext'

function App(): React.JSX.Element {
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [showMyAccount, setShowMyAccount] = useState(false)
  const [showAuthentication, setShowAuthentication] = useState(false)

  const resetAllViews = () => {
    setShowRequestForm(false)
    setShowHowItWorks(false)
    setShowMyAccount(false)
    setShowAuthentication(false)
  }

  return (
    <AppProvider>
      <div className="app">
        <header className="app-header">
          <div className="logo-container">
            <div className="crow-logo">🐦‍⬛</div>
            <h1>Crow</h1>
          </div>
          <p className="tagline">Secure escrow services</p>
          
          <nav className="main-nav">
            <button 
              className={`nav-button ${!showRequestForm && !showHowItWorks && !showMyAccount && !showAuthentication ? 'active' : ''}`}
              onClick={resetAllViews}
            >
              Home
            </button>
            <button 
              className={`nav-button ${showHowItWorks ? 'active' : ''}`}
              onClick={() => {
                resetAllViews()
                setShowHowItWorks(true)
              }}
            >
              How It Works
            </button>
            <button 
              className={`nav-button ${showAuthentication ? 'active' : ''}`}
              onClick={() => {
                resetAllViews()
                setShowAuthentication(true)
              }}
            >
              Authentication
            </button>
            <button 
              className={`nav-button ${showMyAccount ? 'active' : ''}`}
              onClick={() => {
                resetAllViews()
                setShowMyAccount(true)
              }}
            >
              My Account
            </button>
          </nav>
        </header>

        <main className="main-content">
        {!showRequestForm && !showHowItWorks && !showMyAccount && !showAuthentication ? (
          <div className="landing-section">
            <div className="hero">
              <h2>Safe & Secure Escrow Services</h2>
              <p>
                Whether you're buying or selling, Crow protects both parties with 
                secure escrow services. Both buyer and seller 
                must approve before any transaction is executed.
              </p>
            </div>

            <div className="action-section">
              <button 
                className="primary-button initiate-button"
                onClick={() => setShowRequestForm(true)}
              >
                Initiate New Escrow Request
              </button>
              <p className="help-text">
                Anyone can start an escrow request - buyer or seller
              </p>
              
              <button 
                className="secondary-button how-it-works-button"
                onClick={() => setShowHowItWorks(true)}
              >
                How It Works
              </button>
            </div>

            <div className="features">
              <div className="feature">
                <h3>🔒 Secure</h3>
                <p>Your funds are protected throughout the transaction</p>
              </div>
              <div className="feature">
                <h3>🤝 Bilateral</h3>
                <p>Both parties must approve the agreement</p>
              </div>
              <div className="feature">
                <h3>⚡ Fast</h3>
                <p>Quick setup and execution</p>
              </div>
            </div>
          </div>
        ) : showRequestForm ? (
          <EscrowRequestForm 
            onCancel={() => setShowRequestForm(false)}
          />
        ) : showHowItWorks ? (
          <HowItWorks 
            onBack={() => setShowHowItWorks(false)}
          />
        ) : showAuthentication ? (
          <Authentication 
            onBack={() => setShowAuthentication(false)}
          />
        ) : (
          <MyAccount 
            onBack={resetAllViews}
          />
        )}
        </main>
        
        {/* Debug panel for development */}
        <AccountAbstractionDebug />
      </div>
    </AppProvider>
  )
}

export default App
