import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { Heart, Compass, Send } from 'lucide-react';

export default function Footer() {
  const { showToast } = useMarketplace();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      showToast('Thank you for subscribing to our cute updates! 🌸', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="footer-container">
      <div className="container footer-grid">
        {/* Info Column */}
        <div className="footer-col info-col">
          <Link to="/" className="footer-logo">
            <span>✨</span> SK Happy Little Things
          </Link>
          <p className="footer-about">
            Your premium, cute boutique marketplace. We curate, support, and highlight independent makers of adorable stationery, huggable plushies, and whimsical home ceramics.
          </p>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Pinterest">
              <Compass size={20} />
            </a>
          </div>
        </div>

        {/* Shop Categories Column */}
        <div className="footer-col">
          <h4 className="footer-title">Shop Categories</h4>
          <ul className="footer-links-list">
            <li><Link to="/tshirts">👕 T-Shirts</Link></li>
            <li><Link to="/gifts">🎁 Gifts</Link></li>
            <li><Link to="/birthday-kits">🎂 Birthday Kits</Link></li>
            <li><Link to="/posters">🖼️ Posters</Link></li>
            <li><Link to="/categories">All Categories</Link></li>
          </ul>
        </div>

        {/* Help & Policies Column */}
        <div className="footer-col">
          <h4 className="footer-title">Help & Info</h4>
          <ul className="footer-links-list">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/policy">Shipping Policy</Link></li>
            <li><Link to="/policy">Returns & Refunds</Link></li>
            <li><Link to="/policy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="footer-col newsletter-col">
          <h4 className="footer-title">Cute Newsletter</h4>
          <p className="newsletter-desc">Subscribe to receive sweet discount codes, sneak peeks, and cute stickers!</p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input 
              type="email" 
              placeholder="Your sweet email..." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn" aria-label="Subscribe">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-wrapper">
          <p className="copyright-text">
            © {new Date().getFullYear()} <strong>SK Happy Little Things</strong>. Made with <Heart size={14} className="footer-heart-icon" /> for a happy life.
          </p>
          <p className="footer-disclaimer">All mock payments and products are for demonstration purposes.</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .footer-container {
          background: var(--bg-card);
          border-top: 1px solid var(--border-color);
          padding: 60px 0 20px;
          margin-top: auto;
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          transition: background var(--transition-normal);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1.5fr;
          gap: 40px;
          margin-bottom: 50px;
        }
        .footer-logo {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 16px;
        }
        .footer-about {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }
        .social-links {
          display: flex;
          gap: 12px;
        }
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          transition: all var(--transition-fast);
        }
        .social-icon:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-3px);
          box-shadow: var(--shadow-glow);
        }
        .footer-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 20px;
          position: relative;
          display: inline-block;
        }
        .footer-title::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 28px;
          height: 3px;
          border-radius: 999px;
          background: var(--primary);
        }
        .footer-links-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .footer-links-list a:hover {
          color: var(--primary);
          padding-left: 4px;
        }
        .newsletter-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .newsletter-form {
          display: flex;
          position: relative;
        }
        .newsletter-input {
          width: 100%;
          padding: 12px 50px 12px 16px;
          border-radius: var(--border-radius-md);
          border: 1px solid var(--border-color);
          background: var(--bg-input);
          color: var(--text-primary);
          outline: none;
          font-size: 0.9rem;
          transition: all var(--transition-fast);
        }
        .newsletter-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 10px rgba(255, 117, 143, 0.1);
        }
        .newsletter-btn {
          position: absolute;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
          background: var(--primary);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: var(--border-radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .newsletter-btn:hover {
          background: var(--primary-hover);
        }
        .footer-bottom {
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
        }
        .bottom-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .footer-heart-icon {
          fill: var(--primary);
          color: var(--primary);
          display: inline;
          vertical-align: middle;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        /* Footer Responsiveness */
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .bottom-wrapper {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }
        }
      `}} />
    </footer>
  );
}
