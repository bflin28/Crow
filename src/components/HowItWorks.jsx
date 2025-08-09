import './HowItWorks.css'

const HowItWorks = ({ onBack }) => {
  return (
    <div className="how-it-works-container">
      <div className="how-it-works-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Home
        </button>
        <h2>How Crow Escrow Works</h2>
        <p className="subtitle">
          Your money is protected every step of the way. Here's exactly how it works:
        </p>
      </div>

      <div className="security-highlight">
        <h3>🛡️ Your Protection First</h3>
        <p>
          We know sending money online can feel risky. That's why Crow uses smart contracts 
          and professional authenticators to ensure <strong>both parties are protected</strong> 
          throughout the entire transaction.
        </p>
      </div>

      <div className="process-steps">
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Create Escrow Request</h3>
            <p>
              Either the <strong>buyer or seller</strong> can start the process. Simply fill out 
              the product details, price, and delivery information. No commitment yet!
            </p>
            <div className="step-note">
              💡 <em>Think of this like creating a draft contract that both parties need to review</em>
            </div>
          </div>
        </div>

        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Both Parties Agree</h3>
            <p>
              Both buyer and seller review the escrow details and <strong>digitally sign</strong> 
              to agree to the terms. Only when both signatures are collected does the escrow become active.
            </p>
            <div className="step-note">
              🤝 <em>No surprises - everyone knows exactly what they're agreeing to</em>
            </div>
          </div>
        </div>

        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Buyer's Funds Are Secured</h3>
            <p>
              The buyer submits their payment, which goes into a <strong>secure smart contract</strong> 
              (not to the seller yet!). The money even earns interest in a money market fund while it waits.
            </p>
            <div className="step-note">
              🔒 <em>Your money is locked safely away - the seller can't access it until delivery is confirmed</em>
            </div>
          </div>
        </div>

        <div className="step">
          <div className="step-number">4</div>
          <div className="step-content">
            <h3>Item Sent to Authenticator</h3>
            <p>
              The seller ships the item to our <strong>professional authenticator</strong> 
              (not directly to the buyer). Once tracking shows it's shipped, responsibility 
              transfers to the shipping carrier.
            </p>
            <div className="step-note">
              📦 <em>Professional authentication ensures you get exactly what you paid for</em>
            </div>
          </div>
        </div>

        <div className="step">
          <div className="step-number">5</div>
          <div className="step-content">
            <h3>Professional Authentication</h3>
            <p>
              Our trained authenticator inspects the item to verify it matches the description. 
              They check condition, authenticity, and completeness before approving the transaction.
            </p>
            <div className="step-highlight">
              <h4>What if authentication fails?</h4>
              <p>
                If the item doesn't match the description or has issues, the buyer gets their 
                full refund, and the seller covers return shipping costs. No questions asked.
              </p>
            </div>
          </div>
        </div>

        <div className="step">
          <div className="step-number">6</div>
          <div className="step-content">
            <h3>Delivery & Payment Release</h3>
            <p>
              Once authenticated, the item is shipped to the buyer. When tracking confirms 
              delivery, the escrowed funds are <strong>automatically released</strong> to the seller.
            </p>
            <div className="step-note">
              ✨ <em>Completely automatic - no waiting for manual processing</em>
            </div>
          </div>
        </div>
      </div>

      <div className="safety-guarantees">
        <h3>🛡️ Your Safety Guarantees</h3>
        <div className="guarantees-grid">
          <div className="guarantee">
            <h4>For Buyers</h4>
            <ul>
              <li>Money is held securely until delivery is confirmed</li>
              <li>Professional authentication ensures item quality</li>
              <li>Full refund if item doesn't match description</li>
              <li>No payment to seller until you receive your item</li>
            </ul>
          </div>
          <div className="guarantee">
            <h4>For Sellers</h4>
            <ul>
              <li>Guaranteed payment once item is delivered</li>
              <li>Protection against fraudulent buyers</li>
              <li>Professional handling of your valuable items</li>
              <li>Automatic fund release - no payment delays</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="trust-section">
        <h3>Why Trust Crow?</h3>
        <div className="trust-points">
          <div className="trust-point">
            <span className="trust-icon">🔐</span>
            <div>
              <strong>Smart Contract Security</strong>
              <p>Your funds are protected by blockchain technology - not even we can access them inappropriately</p>
            </div>
          </div>
          <div className="trust-point">
            <span className="trust-icon">🎯</span>
            <div>
              <strong>Professional Authentication</strong>
              <p>Trained experts verify every item to ensure authenticity and condition</p>
            </div>
          </div>
          <div className="trust-point">
            <span className="trust-icon">⚡</span>
            <div>
              <strong>Automated Process</strong>
              <p>Smart contracts handle fund release automatically - no human delays or errors</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h3>Ready to Get Started?</h3>
        <p>Join thousands of buyers and sellers who trust Crow for their high-value transactions.</p>
        <button className="primary-button large-button" onClick={onBack}>
          Start Your First Escrow →
        </button>
      </div>
    </div>
  )
}

export default HowItWorks
