import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  ShoppingBag, Heart, Bell, Sun, Moon, Search, Menu, X, User, LogOut, LayoutDashboard, ShoppingCart, MessageSquare 
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentUser, cart, wishlist, notifications, theme, toggleDarkMode, logout, markNotificationsAsRead 
  } = useMarketplace();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const unreadNotifs = notifications.filter(n => !n.read && (!currentUser || n.userId === currentUser.id));

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleNotifClick = () => {
    setNotifDropdownOpen(!notifDropdownOpen);
    setProfileDropdownOpen(false);
    if (currentUser) {
      markNotificationsAsRead(currentUser.id);
    }
  };

  const handleProfileClick = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    setNotifDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container nav-wrapper">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          <span className="logo-sparkle">✨</span>
          <span className="logo-text">SK Happy Little Things</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="nav-search-form">
          <div className="search-input-wrapper">
            <input 
              type="text" 
              placeholder="Search cute things..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Desktop Menu */}
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/?category=T-Shirts">T-Shirts</Link></li>
          <li><Link to="/?category=Birthday%20Kit">Birthday Kit</Link></li>
          <li><Link to="/?category=Caps">Caps</Link></li>
          <li><Link to="/?category=Posters">Posters</Link></li>
          <li><Link to="/?category=Gifts">Gifts</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>

        {/* Right Nav Actions */}
        <div className="nav-actions">
          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="action-icon-btn theme-toggle-btn" aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Wishlist */}
          <Link to="/profile?tab=wishlist" className="action-icon-btn badge-container" aria-label="Wishlist">
            <Heart size={20} />
            {wishlistCount > 0 && <span className="icon-badge badge-sec">{wishlistCount}</span>}
          </Link>

          {/* Cart */}
          <Link to="/checkout?step=cart" className="action-icon-btn badge-container" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="icon-badge badge-prim">{cartCount}</span>}
          </Link>

          {/* Notifications */}
          <div className="dropdown-wrapper">
            <button onClick={handleNotifClick} className="action-icon-btn badge-container" aria-label="Notifications">
              <Bell size={20} />
              {unreadNotifs.length > 0 && <span className="icon-badge badge-warning-dot">{unreadNotifs.length}</span>}
            </button>

            {notifDropdownOpen && (
              <div className="dropdown-menu notif-dropdown card">
                <h4 className="dropdown-title">Notifications</h4>
                {unreadNotifs.length === 0 ? (
                  <p className="no-notif-text">No new notifications. ✨</p>
                ) : (
                  <ul className="notif-list">
                    {unreadNotifs.map((notif) => (
                      <li key={notif.id} className={`notif-item ${notif.type}`}>
                        {notif.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Profile Section */}
          <div className="dropdown-wrapper">
            {currentUser ? (
              <button onClick={handleProfileClick} className="avatar-btn" aria-label="User profile menu">
                <img src={currentUser.avatar} alt={currentUser.name} className="nav-avatar" />
              </button>
            ) : (
              <Link to="/auth" className="btn btn-primary nav-login-btn">Login</Link>
            )}

            {currentUser && profileDropdownOpen && (
              <div className="dropdown-menu profile-dropdown card">
                <div className="profile-dropdown-header">
                  <p className="profile-name">{currentUser.name}</p>
                  <span className="profile-role badge badge-secondary">{currentUser.role}</span>
                </div>
                <hr className="dropdown-divider" />
                <ul className="profile-dropdown-links">
                  {currentUser.role === 'buyer' && (
                    <>
                      <li><Link to="/profile" onClick={() => setProfileDropdownOpen(false)}><User size={16} /> My Profile</Link></li>
                      <li><Link to="/profile?tab=orders" onClick={() => setProfileDropdownOpen(false)}><ShoppingCart size={16} /> My Orders</Link></li>
                      <li><Link to="/chat" onClick={() => setProfileDropdownOpen(false)}><MessageSquare size={16} /> Shop Chats</Link></li>
                    </>
                  )}
                  {currentUser.role === 'seller' && (
                    <>
                      <li><Link to="/seller-dashboard" onClick={() => setProfileDropdownOpen(false)}><LayoutDashboard size={16} /> Seller Panel</Link></li>
                      <li><Link to={currentUser.shopId ? `/shop/${currentUser.shopId}` : '/seller-dashboard'} onClick={() => setProfileDropdownOpen(false)}><ShoppingBag size={16} /> My Shop</Link></li>
                      <li><Link to="/chat" onClick={() => setProfileDropdownOpen(false)}><MessageSquare size={16} /> Buyer Chats</Link></li>
                    </>
                  )}
                  {currentUser.role === 'admin' && (
                    <>
                      <li><Link to="/admin" onClick={() => setProfileDropdownOpen(false)}><LayoutDashboard size={16} /> Admin Panel</Link></li>
                      <li><Link to="/chat" onClick={() => setProfileDropdownOpen(false)}><MessageSquare size={16} /> Support Chats</Link></li>
                    </>
                  )}
                </ul>
                <hr className="dropdown-divider" />
                <button onClick={() => { logout(); setProfileDropdownOpen(false); navigate('/'); }} className="dropdown-logout-btn">
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-toggle-btn" aria-label="Toggle mobile menu">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer card">
          {/* Search bar inside drawer */}
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <div className="search-input-wrapper">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <Search size={18} />
              </button>
            </div>
          </form>

          <ul className="mobile-drawer-links">
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/?category=T-Shirts" onClick={() => setMobileMenuOpen(false)}>T-Shirts</Link></li>
            <li><Link to="/?category=Birthday%20Kit" onClick={() => setMobileMenuOpen(false)}>Birthday Kit</Link></li>
            <li><Link to="/?category=Caps" onClick={() => setMobileMenuOpen(false)}>Caps</Link></li>
            <li><Link to="/?category=Posters" onClick={() => setMobileMenuOpen(false)}>Posters</Link></li>
            <li><Link to="/?category=Gifts" onClick={() => setMobileMenuOpen(false)}>Gifts</Link></li>
            <li><Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link></li>
            <hr className="dropdown-divider" />
            {currentUser ? (
              <>
                {currentUser.role === 'buyer' && (
                  <>
                    <li><Link to="/profile" onClick={() => setMobileMenuOpen(false)}>My Profile</Link></li>
                    <li><Link to="/profile?tab=orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link></li>
                    <li><Link to="/chat" onClick={() => setMobileMenuOpen(false)}>Chat with Sellers</Link></li>
                  </>
                )}
                {currentUser.role === 'seller' && (
                  <>
                    <li><Link to="/seller-dashboard" onClick={() => setMobileMenuOpen(false)}>Seller Dashboard</Link></li>
                    <li><Link to={currentUser.shopId ? `/shop/${currentUser.shopId}` : '/seller-dashboard'} onClick={() => setMobileMenuOpen(false)}>My Shop</Link></li>
                    <li><Link to="/chat" onClick={() => setMobileMenuOpen(false)}>Buyer Chats</Link></li>
                  </>
                )}
                {currentUser.role === 'admin' && (
                  <>
                    <li><Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link></li>
                    <li><Link to="/chat" onClick={() => setMobileMenuOpen(false)}>Support Chats</Link></li>
                  </>
                )}
                <li onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }} className="mobile-logout-link">
                  Log Out
                </li>
              </>
            ) : (
              <li><Link to="/auth" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', textAlign: 'center' }}>Login</Link></li>
            )}
          </ul>
        </div>
      )}

      {/* Embedded CSS specific to Navbar layout for precise cute alignment */}
      <style dangerouslySetInnerHTML={{__html: `
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: var(--bg-nav);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border-bottom: 1px solid var(--border-color);
          z-index: 1000;
          display: flex;
          align-items: center;
          transition: background var(--transition-normal);
        }
        .nav-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--primary);
        }
        .logo-sparkle {
          animation: bounce 2s infinite ease-in-out;
        }
        .logo-text {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-search-form {
          flex: 0 1 350px;
          margin: 0 20px;
        }
        .search-input-wrapper {
          position: relative;
          width: 100%;
        }
        .search-input {
          width: 100%;
          padding: 10px 45px 10px 18px;
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--border-color);
          background: var(--bg-input);
          color: var(--text-primary);
          outline: none;
          font-size: 0.9rem;
          transition: all var(--transition-fast);
        }
        .search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 12px rgba(255, 117, 143, 0.15);
        }
        .search-btn {
          position: absolute;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
          background: var(--primary);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .search-btn:hover {
          background: var(--primary-hover);
        }
        .nav-links {
          display: flex;
          list-style: none;
          gap: 24px;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .nav-links a:hover {
          color: var(--primary);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .action-icon-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: 50%;
          transition: all var(--transition-fast);
        }
        .action-icon-btn:hover {
          color: var(--primary);
          background: var(--primary-light);
        }
        .badge-container {
          position: relative;
        }
        .icon-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          font-size: 0.7rem;
          font-weight: 700;
          color: white;
          border-radius: 50%;
          min-width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
        }
        .badge-prim {
          background: var(--primary);
        }
        .badge-sec {
          background: var(--secondary);
        }
        .badge-warning-dot {
          background: var(--accent-yellow);
          width: 8px;
          height: 8px;
          min-width: 8px;
          top: 2px;
          right: 2px;
        }
        .avatar-btn {
          background: transparent;
          border: 2px solid var(--border-color);
          border-radius: 50%;
          cursor: pointer;
          overflow: hidden;
          width: 36px;
          height: 36px;
          display: flex;
          transition: border-color var(--transition-fast);
        }
        .avatar-btn:hover {
          border-color: var(--primary);
        }
        .nav-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .dropdown-wrapper {
          position: relative;
        }
        .dropdown-menu {
          position: absolute;
          top: 48px;
          right: 0;
          width: 250px;
          z-index: 1010;
          padding: 15px;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-lg);
          border-color: var(--border-hover);
        }
        .notif-dropdown {
          width: 320px;
        }
        .dropdown-title {
          font-size: 1rem;
          margin-bottom: 10px;
        }
        .no-notif-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-align: center;
          padding: 10px 0;
        }
        .notif-list {
          list-style: none;
          max-height: 250px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .notif-item {
          font-size: 0.85rem;
          padding: 8px 10px;
          border-radius: var(--border-radius-xs);
          background: var(--primary-light);
          color: var(--text-secondary);
          border-left: 3px solid var(--primary);
        }
        .notif-item.success {
          background: rgba(16, 185, 129, 0.08);
          border-left-color: #10B981;
        }
        .profile-dropdown-header {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding-bottom: 8px;
        }
        .profile-name {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1rem;
        }
        .profile-role {
          align-self: start;
        }
        .dropdown-divider {
          border: 0;
          border-top: 1px solid var(--border-color);
          margin: 8px 0;
        }
        .profile-dropdown-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .profile-dropdown-links a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: var(--border-radius-xs);
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .profile-dropdown-links a:hover {
          background: var(--primary-light);
          color: var(--primary);
        }
        .dropdown-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: var(--border-radius-xs);
          font-weight: 500;
          font-size: 0.9rem;
          color: #EF4444;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .dropdown-logout-btn:hover {
          background: rgba(239, 68, 68, 0.08);
        }
        .mobile-menu-toggle-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }
        .mobile-drawer {
          display: none;
        }
        
        /* Navbar Responsive Styles */
        @media (max-width: 1024px) {
          .nav-links {
            display: none;
          }
          .nav-search-form {
            display: none;
          }
          .mobile-menu-toggle-btn {
            display: block;
          }
          .mobile-drawer {
            display: block;
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--bg-nav);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border-bottom: 1px solid var(--border-color);
            z-index: 999;
            box-shadow: var(--shadow-lg);
            padding: 30px 20px;
            overflow-y: auto;
            animation: slideDown 0.25s ease-out;
          }
          @keyframes slideDown {
            from { transform: translateY(-15px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .mobile-search-form {
            margin-bottom: 20px;
          }
          .mobile-drawer-links {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 16px;
            font-family: var(--font-heading);
            font-weight: 600;
            font-size: 1.1rem;
          }
          .mobile-logout-link {
            color: #EF4444;
            cursor: pointer;
          }
          .nav-login-btn {
            padding: 6px 14px;
            font-size: 0.85rem;
          }
        }
      `}} />
    </nav>
  );
}
