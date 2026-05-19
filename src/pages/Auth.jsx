import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, Mail, User, Store, ArrowRight, Sparkles } from 'lucide-react';

export default function Auth() {
  const { login, signup, loginWithGoogle, mockForgotPassword, currentUser } = useMarketplace();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL triggers: ?mode=signup or ?role=seller
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';

  const [mode, setMode] = useState(initialMode); // login or signup
  const [role, setRole] = useState(initialRole); // buyer or seller

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Seller specific shop fields
  const [shopName, setShopName] = useState('');
  const [shopCategory, setShopCategory] = useState('T-Shirts');
  const [shopDescription, setShopDescription] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopContact, setShopContact] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'seller') {
        navigate('/seller-dashboard');
      } else if (currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    if (mode === 'login') {
      const success = await login(email, password, role);
      if (success) {
        if (role === 'seller') navigate('/seller-dashboard');
        else if (role === 'admin') navigate('/admin');
        else navigate('/');
      }
    } else {
      if (role === 'buyer') {
        if (!name) return;
        const success = await signup(name, email, password, 'buyer');
        if (success) navigate('/');
      } else {
        if (!name || !shopName) return;
        const shopDetails = {
          shopName,
          category: shopCategory,
          description: shopDescription,
          address: shopAddress,
          contact: shopContact || email
        };
        const success = await signup(name, email, password, 'seller', shopDetails);
        if (success) navigate('/seller-dashboard');
      }
    }
  };

  const handleGoogleLogin = async () => {
    // Generate a quick mock google email
    const mockEmail = email || `${role}_google_user@gmail.com`;
    const success = await loginWithGoogle(mockEmail, role);
    if (success) {
      if (role === 'seller') navigate('/seller-dashboard');
      else navigate('/');
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      alert('Please enter your email first in the email field!');
      return;
    }
    mockForgotPassword(email);
  };

  return (
    <div className="container auth-page-container">
      <div className="auth-wrapper card">
        
        {/* Left Side Info / Cute welcome banner */}
        <div className="auth-info-banner gradient-bg">
          <div className="info-banner-content">
            <span className="banner-sparkle">✨🌸🍭</span>
            <h2>Happy Little Things</h2>
            <p>Step into a world of pastel plushies, hand-crafted mugs, and cute sticker packs.</p>
            <div className="banner-mascot">
              <span className="mascot-emoji">🐰</span>
            </div>
            <p className="mascot-text">"Happiness is handmade!"</p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="auth-form-section">
          {/* Role Tabs */}
          <div className="auth-role-tabs">
            <button 
              className={`role-tab ${role === 'buyer' ? 'active' : ''}`}
              onClick={() => setRole('buyer')}
            >
              Buyer Portal
            </button>
            <button 
              className={`role-tab ${role === 'seller' ? 'active' : ''}`}
              onClick={() => setRole('seller')}
            >
              Seller Hub
            </button>
          </div>

          <div className="auth-header-text">
            <h3>{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</h3>
            <p>{role === 'buyer' ? 'Find cute things that make you smile' : 'Start selling your beautiful handmade crafts'}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-main-form">
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label"><User size={14} /> Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label"><Mail size={14} /> Email Address</label>
              <input 
                type="email" 
                placeholder="you@happy.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label className="form-label"><KeyRound size={14} /> Password</label>
                {mode === 'login' && (
                  <button type="button" onClick={handleForgotPassword} className="forgot-password-btn">
                    Forgot?
                  </button>
                )}
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>

            {/* Seller Specific Sign Up Fields */}
            {mode === 'signup' && role === 'seller' && (
              <div className="seller-signup-fields">
                <h4 className="section-divider">Shop Setup</h4>
                
                <div className="form-group">
                  <label className="form-label"><Store size={14} /> Shop Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Candy Planet Shop" 
                    value={shopName} 
                    onChange={(e) => setShopName(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Shop Category</label>
                  <select 
                    value={shopCategory}
                    onChange={(e) => setShopCategory(e.target.value)}
                    className="form-control"
                  >
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Gifts">Gifts</option>
                    <option value="Posters">Posters</option>
                    <option value="Birthday Kit">Birthday Kit</option>
                    <option value="Caps">Caps</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Shop Description</label>
                  <textarea 
                    placeholder="Describe what you sell in your shop..." 
                    value={shopDescription} 
                    onChange={(e) => setShopDescription(e.target.value)}
                    className="form-control"
                    rows={2}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Shop Contact Email/Phone</label>
                  <input 
                    type="text" 
                    placeholder="e.g. contact@myshop.com" 
                    value={shopContact} 
                    onChange={(e) => setShopContact(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Shop Address</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 12 Flower Rd, Toyland" 
                    value={shopAddress} 
                    onChange={(e) => setShopAddress(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary auth-submit-btn">
              {mode === 'login' ? 'Login' : 'Create Shop & Start'} <ArrowRight size={16} />
            </button>
          </form>

          {/* Social login divider */}
          <div className="social-divider">
            <span>Or Connect With</span>
          </div>

          <button onClick={handleGoogleLogin} className="btn btn-outline google-login-btn">
            <Sparkles size={18} /> Google Login
          </button>

          {/* Toggle Login/Signup mode */}
          <p className="auth-toggle-mode">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="mode-toggle-btn">
              {mode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Demo Credentials:</strong><br />
            Buyer: <code>buyer@happy.com</code> / password<br />
            Seller: <code>seller@happy.com</code> / password<br />
            Admin: <code>admin@happy.com</code> / password
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .auth-page-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 40px;
          padding-bottom: 60px;
        }
        .auth-wrapper {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          max-width: 900px;
          width: 100%;
          padding: 0;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border-color: var(--border-hover);
        }
        .auth-info-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
          color: white;
          position: relative;
        }
        .info-banner-content {
          z-index: 2;
        }
        .banner-sparkle {
          font-size: 2rem;
          display: block;
          margin-bottom: 10px;
        }
        .auth-info-banner h2 {
          font-size: 2.2rem;
          color: white;
          margin-bottom: 12px;
          font-family: var(--font-heading);
        }
        .auth-info-banner p {
          font-size: 0.95rem;
          opacity: 0.9;
          line-height: 1.6;
        }
        .banner-mascot {
          margin: 30px auto;
          background: rgba(255, 255, 255, 0.2);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          animation: float 4s ease-in-out infinite;
        }
        .mascot-emoji {
          font-size: 2.5rem;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .mascot-text {
          font-style: italic;
          font-weight: 500;
        }
        .auth-form-section {
          padding: 40px;
          background: var(--bg-card);
        }
        .auth-role-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
          background: var(--primary-light);
          padding: 5px;
          border-radius: var(--border-radius-md);
        }
        .role-tab {
          flex: 1;
          background: transparent;
          border: none;
          padding: 10px;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: var(--border-radius-sm);
          transition: all var(--transition-fast);
        }
        .role-tab.active {
          background: var(--primary);
          color: white;
          box-shadow: var(--shadow-sm);
        }
        .auth-header-text {
          margin-bottom: 24px;
        }
        .auth-header-text h3 {
          font-size: 1.4rem;
          margin-bottom: 6px;
        }
        .auth-header-text p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .forgot-password-btn {
          background: transparent;
          border: none;
          color: var(--secondary);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }
        .forgot-password-btn:hover {
          color: var(--secondary-hover);
          text-decoration: underline;
        }
        .seller-signup-fields {
          margin-top: 20px;
          padding-top: 10px;
        }
        .section-divider {
          font-family: var(--font-heading);
          font-size: 0.9rem;
          text-transform: uppercase;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 15px;
          padding-bottom: 4px;
          letter-spacing: 0.05em;
        }
        .auth-submit-btn {
          width: 100%;
          margin-top: 10px;
          padding: 12px;
        }
        .social-divider {
          text-align: center;
          margin: 20px 0;
          position: relative;
        }
        .social-divider::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: var(--border-color);
          z-index: 1;
        }
        .social-divider span {
          background: var(--bg-card);
          padding: 0 12px;
          font-size: 0.8rem;
          color: var(--text-muted);
          position: relative;
          z-index: 2;
        }
        .google-login-btn {
          width: 100%;
          padding: 10px;
        }
        .auth-toggle-mode {
          text-align: center;
          margin-top: 20px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .mode-toggle-btn {
          background: transparent;
          border: none;
          color: var(--primary);
          font-weight: 700;
          cursor: pointer;
        }
        .mode-toggle-btn:hover {
          text-decoration: underline;
        }

        /* Responsive Auth Layout */
        @media (max-width: 768px) {
          .auth-wrapper {
            grid-template-columns: 1fr;
          }
          .auth-info-banner {
            padding: 30px;
          }
          .auth-form-section {
            padding: 24px;
          }
        }
      `}} />
    </div>
  );
}
