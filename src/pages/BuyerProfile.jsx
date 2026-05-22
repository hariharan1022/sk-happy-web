import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  User, ShoppingCart, Heart, Store, Edit2, 
  MapPin, CheckCircle, Clock, Trash2, ArrowRight, Camera 
} from 'lucide-react';

export default function BuyerProfile() {
  const { 
    currentUser, orders, wishlist, products, followedShops, 
    shops, toggleWishlist, addToCart, followShop, updateUser, showToast 
  } = useMarketplace();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected tab state: info, orders, wishlist, shops
  const activeTab = searchParams.get('tab') || 'info';

  // Profile Edit fields
  const [name, setName] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  // Sync form fields when currentUser changes (e.g. after login)
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const setActiveTab = (tab) => {
    searchParams.set('tab', tab);
    setSearchParams(searchParams);
  };

  // Handle avatar file upload from device
  const handleAvatarFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image too large! Max 5MB allowed.', 'error');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      showToast('Photo uploaded! Click "Save" to apply.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // Use the proper context function to update user through React state
    updateUser({ name, avatar });
  };

  // Filter orders for logged-in buyer
  const buyerOrders = orders.filter(ord => ord.buyerId === currentUser.id);

  // Filter wishlisted products
  const wishlistProducts = products.filter(p => wishlist.includes(p.id) && !p.hidden);

  // Filter followed shops
  const followedShopsList = shops.filter(s => followedShops.includes(s.id));

  return (
    <div className="container profile-page-container">
      <div className="profile-layout-grid">
        
        {/* Sidebar Nav */}
        <div className="profile-sidebar card">
          <div className="sidebar-user-header">
            <img src={currentUser.avatar} alt={currentUser.name} className="sidebar-avatar" />
            <h3>{currentUser.name}</h3>
            <span className="badge badge-secondary">{currentUser.role}</span>
          </div>

          <ul className="profile-nav-list">
            <li>
              <button 
                onClick={() => setActiveTab('info')} 
                className={`profile-nav-btn ${activeTab === 'info' ? 'active' : ''}`}
              >
                <User size={18} /> My Profile
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('orders')} 
                className={`profile-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
              >
                <ShoppingCart size={18} /> Order History
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('wishlist')} 
                className={`profile-nav-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
              >
                <Heart size={18} /> My Wishlist
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('shops')} 
                className={`profile-nav-btn ${activeTab === 'shops' ? 'active' : ''}`}
              >
                <Store size={18} /> Followed Shops
              </button>
            </li>
          </ul>
        </div>

        {/* Dynamic Display Panel */}
        <div className="profile-content-panel">
          
          {/* TAB 1: PROFILE DETAILS EDIT */}
          {activeTab === 'info' && (
            <div className="card tab-card">
              <h3 className="tab-title"><User className="icon-pink" /> Personal Profile</h3>
              <p className="tab-subtitle">Update your personal credentials and avatar graphics</p>
              <hr className="divider" />

              <form onSubmit={handleUpdateProfile} className="profile-edit-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (Cannot change)</label>
                  <input 
                    type="email" 
                    value={currentUser.email} 
                    className="form-control"
                    disabled
                    style={{ background: 'rgba(0,0,0,0.05)', cursor: 'not-allowed' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Profile Photo</label>
                  
                  {/* Avatar upload area */}
                  <div className="avatar-upload-area" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '16px',
                    background: 'var(--bg-app)',
                    borderRadius: '12px',
                    border: '2px dashed var(--border-color)',
                    marginBottom: '10px'
                  }}>
                    {/* Avatar preview with camera overlay */}
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={avatar} 
                        alt="" 
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid var(--primary)'
                        }}
                      />
                      <label style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        background: 'var(--primary)',
                        color: 'white',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'transform 0.2s ease'
                      }}>
                        <Camera size={14} />
                        <input 
                          type="file" 
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleAvatarFileUpload}
                        />
                      </label>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, marginBottom: '4px', fontSize: '0.95rem' }}>
                        Upload from device
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                        Supports PNG, JPG, JPEG — Max 5MB
                      </p>
                      <label className="btn btn-secondary" style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        cursor: 'pointer', 
                        margin: 0, 
                        padding: '6px 16px', 
                        fontSize: '0.8rem'
                      }}>
                        📂 Choose Photo
                        <input 
                          type="file" 
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleAvatarFileUpload}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Optional URL input fallback */}
                  <div style={{ marginTop: '8px' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Or paste an image URL
                    </label>
                    <input 
                      type="text" 
                      value={avatar} 
                      onChange={(e) => setAvatar(e.target.value)}
                      className="form-control"
                      placeholder="https://example.com/my-photo.jpg"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Save Profile Changes</button>
              </form>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="card tab-card">
              <h3 className="tab-title"><ShoppingCart className="icon-pink" /> Your Order History</h3>
              <p className="tab-subtitle">Track shipping and check invoices for past purchases</p>
              <hr className="divider" />

              {buyerOrders.length === 0 ? (
                <div className="empty-tab-view">
                  <span className="empty-emoji">📦🧸</span>
                  <h4>No Orders Found!</h4>
                  <p>You haven't ordered any cute little things yet.</p>
                  <Link to="/" className="btn btn-primary">Go Shop Now</Link>
                </div>
              ) : (
                <div className="orders-history-list">
                  {buyerOrders.map(order => (
                    <div key={order.id} className="order-history-card card">
                      <div className="order-header-row">
                        <div>
                          <span className="order-number">Order #{order.id}</span>
                          <span className="order-date">Ordered on: {new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div className="order-status-badge">
                          {order.status === 'pending' && <span className="badge badge-warning"><Clock size={12} /> Pending</span>}
                          {order.status === 'shipped' && <span className="badge badge-primary"><Truck size={12} /> Shipped</span>}
                          {order.status === 'delivered' && <span className="badge badge-success"><CheckCircle size={12} /> Delivered</span>}
                        </div>
                      </div>

                      {/* Items loop */}
                      <div className="order-items-sublist">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item-mini-row">
                            <span className="qty-tag">{item.quantity}x</span>
                            <span className="item-name">{item.name} {item.color && `(${item.color})`}</span>
                            <span className="item-price">${(item.finalPrice * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <hr className="divider" style={{ margin: '12px 0' }} />

                      <div className="order-footer-row">
                        <div className="order-shipping-addr">
                          <MapPin size={12} /> <span>{order.shippingAddress}</span>
                        </div>
                        <div className="order-total-price">
                          <span>Total Paid:</span>
                          <strong>${order.total.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="card tab-card">
              <h3 className="tab-title"><Heart className="icon-pink" /> Saved Wishlist</h3>
              <p className="tab-subtitle">Cute little treasures you saved to buy later</p>
              <hr className="divider" />

              {wishlistProducts.length === 0 ? (
                <div className="empty-tab-view">
                  <span className="empty-emoji">❤️✨</span>
                  <h4>Wishlist is Empty!</h4>
                  <p>Save items from trending collections with the heart button.</p>
                  <Link to="/" className="btn btn-primary">Discover Trends</Link>
                </div>
              ) : (
                <div className="grid-responsive">
                  {wishlistProducts.map(product => {
                    const finalPrice = product.price * (1 - (product.discount || 0) / 100);
                    return (
                      <div key={product.id} className="card product-card">
                        <div className="prod-img-wrapper">
                          <img src={product.images[0]} alt={product.name} className="product-image" />
                          <button 
                            onClick={() => toggleWishlist(product.id)}
                            className="wishlist-remove-btn"
                            aria-label="Remove from wishlist"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="product-card-body">
                          <Link to={`/product/${product.id}`}>
                            <h4 className="product-card-title" style={{ height: '2.4rem' }}>{product.name}</h4>
                          </Link>
                          <div className="product-card-footer">
                            <span className="price-val">${finalPrice.toFixed(2)}</span>
                            <button 
                              onClick={() => addToCart(product.id, 1)}
                              disabled={product.stock === 0}
                              className="btn btn-primary"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FOLLOWED SHOPS */}
          {activeTab === 'shops' && (
            <div className="card tab-card">
              <h3 className="tab-title"><Store className="icon-pink" /> Followed Shops</h3>
              <p className="tab-subtitle">Stay connected with your favorite cute makers</p>
              <hr className="divider" />

              {followedShopsList.length === 0 ? (
                <div className="empty-tab-view">
                  <span className="empty-emoji">🎪🌸</span>
                  <h4>Not Following Shops!</h4>
                  <p>Follow makers directly on their shop pages or product detail blocks.</p>
                  <Link to="/" className="btn btn-primary">Find Shops</Link>
                </div>
              ) : (
                <div className="followed-shops-list">
                  {followedShopsList.map(shop => (
                    <div key={shop.id} className="followed-shop-card card">
                      <img src={shop.logo} alt={shop.name} className="followed-shop-logo" />
                      <div className="followed-shop-details">
                        <Link to={`/shop/${shop.id}`}><h4>{shop.name}</h4></Link>
                        <p>{shop.description}</p>
                        <span className="followers-count">👥 {shop.followers} Followers</span>
                      </div>
                      <button 
                        onClick={() => followShop(shop.id)} 
                        className="btn btn-outline unfollow-btn"
                      >
                        Unfollow
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .profile-page-container {
          padding-top: 20px;
          padding-bottom: 50px;
        }
        .profile-layout-grid {
          display: grid;
          grid-template-columns: 1fr 2.5fr;
          gap: 30px;
          align-items: start;
        }
        .profile-sidebar {
          padding: 24px;
          text-align: center;
        }
        .sidebar-user-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }
        .sidebar-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--border-color);
        }
        .profile-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }
        .profile-nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--border-radius-sm);
          border: none;
          background: transparent;
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .profile-nav-btn:hover {
          background: var(--primary-light);
          color: var(--primary);
        }
        .profile-nav-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: var(--shadow-sm);
        }

        .tab-card {
          padding: 30px;
        }
        .tab-title {
          font-size: 1.4rem;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tab-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 15px;
        }
        
        .profile-edit-form {
          margin-top: 20px;
        }
        .avatar-preview-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 10px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .avatar-preview-img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border-color);
        }

        .empty-tab-view {
          text-align: center;
          padding: 50px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        /* Order history items */
        .orders-history-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 20px;
        }
        .order-history-card {
          padding: 20px;
        }
        .order-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .order-number {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.1rem;
          display: block;
        }
        .order-date {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .order-items-sublist {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: var(--bg-app);
          padding: 12px 16px;
          border-radius: var(--border-radius-sm);
        }
        .order-item-mini-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .qty-tag {
          font-weight: bold;
          color: var(--primary);
          margin-right: 6px;
        }
        .item-name {
          flex: 1;
        }
        .order-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          font-size: 0.85rem;
        }
        .order-shipping-addr {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
          max-width: 60%;
        }
        .order-total-price span {
          color: var(--text-muted);
          margin-right: 6px;
        }
        .order-total-price strong {
          font-size: 1.1rem;
          color: var(--primary);
        }

        /* Wishlist customized */
        .wishlist-remove-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.8);
          border: none;
          color: #EF4444;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: background var(--transition-fast);
          z-index: 2;
        }
        .wishlist-remove-btn:hover {
          background: #fff;
        }

        /* Followed shops styles */
        .followed-shops-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        }
        .followed-shop-card {
          flex-direction: row;
          align-items: center;
          gap: 20px;
          padding: 15px 20px;
        }
        .followed-shop-logo {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border-color);
        }
        .followed-shop-details {
          flex: 1;
        }
        .followed-shop-details h4:hover {
          color: var(--primary);
        }
        .followed-shop-details p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 4px 0;
        }
        .followers-count {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .unfollow-btn {
          padding: 6px 14px;
          font-size: 0.8rem;
        }

        /* Profile page responsive */
        @media (max-width: 1024px) {
          .profile-layout-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .followed-shop-card {
            flex-direction: column;
            text-align: center;
          }
          .unfollow-btn {
            width: 100%;
          }
        }
      `}} />
    </div>
  );
}
