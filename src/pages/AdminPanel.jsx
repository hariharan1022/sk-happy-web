import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Users, Store, ShoppingBag, DollarSign, Check, Ban, 
  Trash2, EyeOff, Eye, BarChart3, Receipt, ShieldAlert 
} from 'lucide-react';

export default function AdminPanel() {
  const { 
    currentUser, users, shops, products, orders, 
    approveShop, toggleBanUser, deleteProduct, toggleHideProduct 
  } = useMarketplace();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'shops-approval';

  // Guard: Admin only
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/auth?role=admin');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== 'admin') return null;

  const setActiveTab = (tab) => {
    searchParams.set('tab', tab);
    setSearchParams(searchParams);
  };

  // 1. Analytics Calculations
  const buyerCount = users.filter(u => u.role === 'buyer').length;
  const sellerCount = users.filter(u => u.role === 'seller').length;
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);

  // 2. Pending shops approvals
  const pendingShops = shops.filter(s => s.status === 'pending');

  // 3. Platform Users list (excluding current admin to avoid self-ban!)
  const platformUsersList = users.filter(u => u.id !== currentUser.id);

  return (
    <div className="container admin-panel-container">
      
      {/* Overview Analytics Widgets */}
      <div className="admin-widgets-grid">
        <div className="card widget-card">
          <div className="widget-icon-row">
            <Users size={24} className="widget-icon color-blue" />
            <span className="badge badge-primary">{users.length} Users</span>
          </div>
          <span className="widget-label">Total Buyers & Sellers</span>
          <h3>{buyerCount} Buyers / {sellerCount} Sellers</h3>
        </div>

        <div className="card widget-card">
          <div className="widget-icon-row">
            <Store size={24} className="widget-icon color-purple" />
            <span className="badge badge-secondary">{shops.length} Shops</span>
          </div>
          <span className="widget-label">Registered Shops</span>
          <h3>{pendingShops.length} Awaiting Approval</h3>
        </div>

        <div className="card widget-card">
          <div className="widget-icon-row">
            <DollarSign size={24} className="widget-icon color-green" />
            <span className="badge badge-success">Platform Fee (10%)</span>
          </div>
          <span className="widget-label">Total Sales Volume</span>
          <h3>${totalRevenue.toFixed(2)} USD</h3>
        </div>
      </div>

      {/* Grid structure */}
      <div className="admin-layout-grid">
        
        {/* Left Navigation */}
        <div className="admin-sidebar card">
          <h3 className="sidebar-title">🔑 Control Panel</h3>
          <p className="subtitle">Moderation & approval logs</p>
          <hr className="divider" style={{ margin: '15px 0' }} />

          <ul className="admin-nav-list">
            <li>
              <button onClick={() => setActiveTab('shops-approval')} className={`admin-nav-btn ${activeTab === 'shops-approval' ? 'active' : ''}`}>
                <Store size={18} /> Shop Approvals ({pendingShops.length})
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('users')} className={`admin-nav-btn ${activeTab === 'users' ? 'active' : ''}`}>
                <Users size={18} /> User Directory ({platformUsersList.length})
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('moderation')} className={`admin-nav-btn ${activeTab === 'moderation' ? 'active' : ''}`}>
                <ShoppingBag size={18} /> Product Moderation
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('revenue')} className={`admin-nav-btn ${activeTab === 'revenue' ? 'active' : ''}`}>
                <Receipt size={18} /> Platform Sales
              </button>
            </li>
          </ul>
        </div>

        {/* Display panel */}
        <div className="admin-content-pane">
          
          {/* TAB 1: SHOP APPROVALS */}
          {activeTab === 'shops-approval' && (
            <div className="card tab-pane-card">
              <h3>Seller Shops Approval</h3>
              <p className="subtitle">Verify new vendor registrations before public launch</p>
              <hr className="divider" style={{ margin: '15px 0' }} />

              {pendingShops.length === 0 ? (
                <div className="empty-tab-view">
                  <span className="empty-emoji">✨🛡️</span>
                  <h4>All Shops Approved!</h4>
                  <p>There are no pending vendor applications at this time.</p>
                </div>
              ) : (
                <div className="pending-shops-list">
                  {pendingShops.map(shop => (
                    <div key={shop.id} className="pending-shop-card card bg-light">
                      <div className="shop-info-row">
                        <img src={shop.logo} alt="" className="pending-logo" />
                        <div className="shop-details">
                          <h4>{shop.name}</h4>
                          <span className="badge badge-secondary">{shop.category}</span>
                          <p>{shop.description}</p>
                          <div className="contacts">
                            <span>📧 {shop.contact}</span>
                            <span>📍 {shop.address}</span>
                          </div>
                        </div>
                      </div>
                      <div className="action-row">
                        <button 
                          onClick={() => approveShop(shop.id)} 
                          className="btn btn-primary"
                        >
                          <Check size={16} /> Approve & Activate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: USER DIRECTORY */}
          {activeTab === 'users' && (
            <div className="card tab-pane-card">
              <h3>User Directory</h3>
              <p className="subtitle">Manage user permissions and ban accounts due to policy violation</p>
              <hr className="divider" style={{ margin: '15px 0' }} />

              <div className="table-wrapper">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformUsersList.map(user => (
                      <tr key={user.id} className={user.banned ? 'row-banned' : ''}>
                        <td>
                          <div className="table-user-info">
                            <img src={user.avatar} alt="" className="table-user-avatar" />
                            <strong>{user.name}</strong>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td><span className="badge badge-secondary">{user.role}</span></td>
                        <td>
                          {user.banned ? (
                            <span className="badge badge-danger" style={{ background: '#FEE2E2', color: '#EF4444' }}>Banned</span>
                          ) : (
                            <span className="badge badge-success">Active</span>
                          )}
                        </td>
                        <td>
                          <button 
                            onClick={() => toggleBanUser(user.id)} 
                            className={`btn small-btn ${user.banned ? 'btn-primary' : 'btn-outline'}`}
                            style={!user.banned ? { color: '#EF4444', borderColor: '#EF4444' } : {}}
                          >
                            <Ban size={12} /> {user.banned ? 'Unban Account' : 'Ban Account'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCT MODERATION */}
          {activeTab === 'moderation' && (
            <div className="card tab-pane-card">
              <h3>Product Moderation</h3>
              <p className="subtitle">Review platform catalog items. Hide or delete listings</p>
              <hr className="divider" style={{ margin: '15px 0' }} />

              <div className="table-wrapper">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Product Info</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Shop Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(prod => {
                      const prodShop = shops.find(s => s.id === prod.shopId);
                      return (
                        <tr key={prod.id} className={prod.hidden ? 'row-hidden' : ''}>
                          <td>
                            <div className="table-prod-info">
                              <img src={prod.images[0]} alt="" className="table-prod-img" />
                              <div>
                                <strong>{prod.name}</strong>
                                <span className="cat-sub">{prod.category}</span>
                              </div>
                            </div>
                          </td>
                          <td>${prod.price.toFixed(2)}</td>
                          <td>{prod.stock} units</td>
                          <td>{prodShop ? prodShop.name : 'Unknown Shop'}</td>
                          <td>
                            <div className="table-actions-row">
                              <button 
                                onClick={() => toggleHideProduct(prod.id)} 
                                className="table-act-btn hide"
                                aria-label={prod.hidden ? 'Unhide product' : 'Hide product'}
                              >
                                {prod.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                              <button 
                                onClick={() => deleteProduct(prod.id)} 
                                className="table-act-btn delete"
                                aria-label="Delete product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: REVENUE PLATFORM TRANSACTIONS */}
          {activeTab === 'revenue' && (
            <div className="card tab-pane-card">
              <h3>Platform Sales & Revenue</h3>
              <p className="subtitle">Review checkout orders and coupon code utilization</p>
              <hr className="divider" style={{ margin: '15px 0' }} />

              {orders.length === 0 ? (
                <div className="empty-tab-view">
                  <span className="empty-emoji">🧾💸</span>
                  <h4>No Sales Yet!</h4>
                  <p>Transaction records will populate when checkouts succeed.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Buyer</th>
                        <th>Subtotal</th>
                        <th>Grand Total</th>
                        <th>Coupon</th>
                        <th>Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td><strong>#{order.id}</strong></td>
                          <td>{order.buyerName}</td>
                          <td>${order.subtotal.toFixed(2)}</td>
                          <td className="font-bold text-green">${order.total.toFixed(2)}</td>
                          <td>
                            {order.couponCode ? (
                              <span className="badge badge-success">{order.couponCode}</span>
                            ) : (
                              <span className="text-muted">None</span>
                            )}
                          </td>
                          <td><span className="badge badge-secondary">{order.paymentMethod}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .admin-panel-container {
          padding-top: 20px;
          padding-bottom: 50px;
        }
        .admin-widgets-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .admin-layout-grid {
          display: grid;
          grid-template-columns: 1fr 2.5fr;
          gap: 30px;
          align-items: start;
        }
        .admin-sidebar {
          padding: 24px;
        }
        .sidebar-title {
          font-size: 1.25rem;
          margin-bottom: 2px;
        }
        .admin-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .admin-nav-btn {
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
          text-align: left;
        }
        .admin-nav-btn:hover {
          background: var(--primary-light);
          color: var(--primary);
        }
        .admin-nav-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: var(--shadow-sm);
        }

        .bg-light {
          background: var(--bg-app);
          border-color: var(--border-color);
        }

        /* Shops approvals styles */
        .pending-shops-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 15px;
        }
        .pending-shop-card {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .shop-info-row {
          display: flex;
          gap: 16px;
          align-items: center;
          flex: 1;
        }
        .pending-logo {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border-color);
        }
        .shop-details h4 {
          font-size: 1.1rem;
        }
        .shop-details p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 6px 0;
        }
        .shop-details .contacts {
          display: flex;
          gap: 12px;
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .pending-shop-card .action-row {
          margin-left: 20px;
        }

        /* Users table formatting */
        .table-wrapper {
          overflow-x: auto;
          margin-top: 15px;
        }
        .table-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .table-user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
        .row-banned {
          background: rgba(239, 68, 68, 0.03);
          opacity: 0.8;
        }

        /* Responsive admin */
        @media (max-width: 1024px) {
          .admin-layout-grid {
            grid-template-columns: 1fr;
          }
          .admin-widgets-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .pending-shop-card {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          .shop-info-row {
            flex-direction: column;
          }
          .pending-shop-card .action-row {
            width: 100%;
            margin-left: 0;
          }
          .pending-shop-card .action-row button {
            width: 100%;
            justify-content: center;
          }
          .shop-details .contacts {
            justify-content: center;
            flex-direction: column;
            gap: 4px;
          }
        }
      `}} />
    </div>
  );
}
