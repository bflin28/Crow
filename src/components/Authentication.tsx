import './Authentication.css'

const Authentication = ({ onBack }) => {
  return (
    <div className="authentication-container">
      <div className="auth-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Home
        </button>
        <h2>The Art & Science of Authentication</h2>
        <p className="subtitle">
          Ever wondered how experts tell real from fake? Dive into the fascinating world of professional authentication!
        </p>
      </div>

      <div className="auth-hero">
        <div className="hero-content">
          <h3>🕵️‍♀️ Meet the Authentication Detectives</h3>
          <p>
            Our certified experts are like modern-day Sherlock Holmes, but instead of solving crimes, 
            they're uncovering the truth about luxury goods. Armed with magnifying glasses, UV lights, 
            and years of training, they can spot a fake from a mile away!
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">99.7%</div>
            <div className="stat-label">Accuracy Rate</div>
          </div>
          <div className="stat">
            <div className="stat-number">50,000+</div>
            <div className="stat-label">Items Authenticated</div>
          </div>
          <div className="stat">
            <div className="stat-number">24hrs</div>
            <div className="stat-label">Average Turnaround</div>
          </div>
        </div>
      </div>

      <div className="categories-section">
        <h3>What We Authenticate</h3>
        <div className="categories-grid">
          
          <div className="category-card handbags">
            <div className="category-icon">👜</div>
            <h4>Designer Handbags</h4>
            <div className="auth-points">
              <h5>🔍 What We Check:</h5>
              <ul>
                <li><strong>Stitching:</strong> Real luxury bags have perfectly straight, even stitches. Fakes often have crooked or uneven lines.</li>
                <li><strong>Hardware:</strong> Authentic zippers feel smooth and heavy. Cheap knockoffs use lightweight, scratchy materials.</li>
                <li><strong>Serial Numbers:</strong> Every authentic bag has unique date codes in specific locations.</li>
                <li><strong>Leather Quality:</strong> Real leather smells rich and feels supple. Fake leather often smells chemical-y.</li>
              </ul>
              <div className="fun-fact">
                💡 <strong>Fun Fact:</strong> Louis Vuitton craftsmen spend 100+ hours making a single bag, and they never use glue - only hand-stitching!
              </div>
            </div>
          </div>

          <div className="category-card jewelry">
            <div className="category-icon">💎</div>
            <h4>Fine Jewelry & Watches</h4>
            <div className="auth-points">
              <h5>🔍 What We Check:</h5>
              <ul>
                <li><strong>Hallmarks:</strong> Precious metals have tiny stamps indicating purity (like 18K gold or 925 silver).</li>
                <li><strong>Movement:</strong> Watch movements are like fingerprints - each brand has unique internal mechanics.</li>
                <li><strong>Weight:</strong> Real gold and platinum are surprisingly heavy. Fakes use lightweight alloys.</li>
                <li><strong>Engravings:</strong> Authentic pieces have crisp, deep engravings. Fakes look shallow or blurry.</li>
              </ul>
              <div className="fun-fact">
                💡 <strong>Fun Fact:</strong> A genuine Rolex second hand moves 8 times per second, creating that smooth "sweep." Fakes tick once per second!
              </div>
            </div>
          </div>

          <div className="category-card sneakers">
            <div className="category-icon">👟</div>
            <h4>Limited Edition Sneakers</h4>
            <div className="auth-points">
              <h5>🔍 What We Check:</h5>
              <ul>
                <li><strong>Box & Labels:</strong> Even the packaging has specific fonts, colors, and placement that fakers get wrong.</li>
                <li><strong>Sole Patterns:</strong> The rubber sole has unique textures and patterns that are hard to replicate exactly.</li>
                <li><strong>Stitching & Glue:</strong> Authentic sneakers have minimal, clean glue lines. Fakes often look messy.</li>
                <li><strong>Material Feel:</strong> Real premium leather and suede have distinct textures that experienced hands can identify.</li>
              </ul>
              <div className="fun-fact">
                💡 <strong>Fun Fact:</strong> Some rare Jordan 1s sell for $100,000+, making authentication more valuable than a luxury car inspection!
              </div>
            </div>
          </div>

          <div className="category-card tickets">
            <div className="category-icon">🎫</div>
            <h4>Event Tickets & Collectibles</h4>
            <div className="auth-points">
              <h5>🔍 What We Check:</h5>
              <ul>
                <li><strong>Paper Quality:</strong> Authentic tickets use special cardstock with specific thickness and feel.</li>
                <li><strong>Security Features:</strong> Hidden watermarks, special inks, and holographic elements are hard to forge.</li>
                <li><strong>Print Quality:</strong> Real tickets have sharp, high-resolution printing. Fakes often look pixelated.</li>
                <li><strong>Barcode Verification:</strong> We can verify barcodes against official databases when possible.</li>
              </ul>
              <div className="fun-fact">
                💡 <strong>Fun Fact:</strong> The 2008 Beijing Olympics opening ceremony ticket is now worth $2,000+ - if it's authentic!
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="process-section">
        <h3>🧪 Our Authentication Laboratory</h3>
        <div className="lab-tools">
          <div className="tool">
            <span className="tool-icon">🔬</span>
            <div className="tool-info">
              <h4>Digital Microscopes</h4>
              <p>Magnify details up to 500x to examine stitching, engravings, and material quality invisible to the naked eye.</p>
            </div>
          </div>
          <div className="tool">
            <span className="tool-icon">💡</span>
            <div className="tool-info">
              <h4>UV Light Analysis</h4>
              <p>Reveals hidden security features, adhesive traces, and material authenticity that only show under ultraviolet light.</p>
            </div>
          </div>
          <div className="tool">
            <span className="tool-icon">⚖️</span>
            <div className="tool-info">
              <h4>Precision Scales</h4>
              <p>Measure weight down to 0.1 grams. Authentic luxury items have very specific weight standards.</p>
            </div>
          </div>
          <div className="tool">
            <span className="tool-icon">📏</span>
            <div className="tool-info">
              <h4>Digital Calipers</h4>
              <p>Measure dimensions to 0.01mm accuracy. Fakes often have slightly different proportions than originals.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="timeline-section">
        <h3>⏱️ What Happens During Authentication</h3>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-dot">1</div>
            <div className="timeline-content">
              <h4>Item Received & Logged</h4>
              <p>Your item gets a unique tracking number and photos are taken from every angle.</p>
              <span className="timeline-duration">~30 minutes</span>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot">2</div>
            <div className="timeline-content">
              <h4>Initial Visual Inspection</h4>
              <p>Our experts examine overall construction, materials, and obvious authenticity markers.</p>
              <span className="timeline-duration">~2 hours</span>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot">3</div>
            <div className="timeline-content">
              <h4>Detailed Laboratory Analysis</h4>
              <p>Using specialized tools, we examine microscopic details and run authenticity tests.</p>
              <span className="timeline-duration">~4-6 hours</span>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot">4</div>
            <div className="timeline-content">
              <h4>Cross-Reference & Verification</h4>
              <p>Compare findings against our database of authentic items and manufacturer specifications.</p>
              <span className="timeline-duration">~2 hours</span>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot">5</div>
            <div className="timeline-content">
              <h4>Final Report & Decision</h4>
              <p>Generate detailed authentication certificate with photos and findings.</p>
              <span className="timeline-duration">~1 hour</span>
            </div>
          </div>
        </div>
      </div>

      <div className="counterfeits-section">
        <h3>📊 The Counterfeit Crisis</h3>
        <div className="crisis-stats">
          <div className="crisis-fact">
            <div className="crisis-number">$500B</div>
            <div className="crisis-label">Global counterfeit market size annually</div>
          </div>
          <div className="crisis-fact">
            <div className="crisis-number">2.5M</div>
            <div className="crisis-label">Jobs lost to counterfeiting worldwide</div>
          </div>
          <div className="crisis-fact">
            <div className="crisis-number">70%</div>
            <div className="crisis-label">Of luxury goods sold online are fake</div>
          </div>
        </div>
        <div className="crisis-explanation">
          <h4>Why Authentication Matters</h4>
          <p>
            Beyond protecting your wallet, authentication fights against organized crime, protects workers' 
            livelihoods, and ensures you get the quality you're paying for. When you choose authenticated goods, 
            you're supporting legitimate businesses and artisans who take pride in their craft.
          </p>
        </div>
      </div>

      <div className="cta-section">
        <h3>Ready to Shop with Confidence?</h3>
        <p>With Crow's professional authentication, you'll never have to worry about getting fooled by fakes again.</p>
        <button className="primary-button large-button" onClick={onBack}>
          Start Your Protected Purchase →
        </button>
      </div>
    </div>
  )
}

export default Authentication
