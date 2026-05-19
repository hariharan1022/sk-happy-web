import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  LayoutDashboard, ShoppingBag, ShoppingCart, Settings, Plus, 
  TrendingUp, Users, DollarSign, Edit, Trash2, EyeOff, Eye, 
  CheckCircle, Truck, Package 
} from 'lucide-react';

export default function SellerDashboard() {
  const { 
    currentUser, products, orders, shops, createShop, updateShop, 
    addProduct, updateProduct, deleteProduct, toggleHideProduct, showToast 
  } = useMarketplace();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'analytics';

  // State for Add/Edit Product Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  
  // Product Form states
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDiscount, setProdDiscount] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodCategory, setProdCategory] = useState('T-Shirts');
  const [prodSubcat, setProdSubcat] = useState('');
  const [prodImages, setProdImages] = useState('');
  const [prodSizes, setProdSizes] = useState('');
  const [prodColors, setProdColors] = useState('');
  const [prodTags, setProdTags] = useState('');
  const [prodDelivery, setProdDelivery] = useState('');
  const [prodReturn, setProdReturn] = useState('');

  // Shop Details Edit States
  const [shopNameForm, setShopNameForm] = useState('');
  const [shopDescForm, setShopDescForm] = useState('');
  const [shopLogoForm, setShopLogoForm] = useState('');
  const [shopBannerForm, setShopBannerForm] = useState('');
  const [shopContactForm, setShopContactForm] = useState('');
  const [shopAddressForm, setShopAddressForm] = useState('');

  // Redirect if not seller
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'seller') {
      navigate('/auth?role=seller');
    }
  }, [currentUser, navigate]);

  const sellerShop = shops.find(s => s.sellerId === currentUser?.id);

  // Sync Shop Edit details
  useEffect(() => {
    if (sellerShop) {
      setShopNameForm(sellerShop.name);
      setShopDescForm(sellerShop.description);
      setShopLogoForm(sellerShop.logo);
      setShopBannerForm(sellerShop.banner);
      setShopContactForm(sellerShop.contact);
      setShopAddressForm(sellerShop.address);
    }
  }, [sellerShop]);

  if (!currentUser || currentUser.role !== 'seller') return null;

  const setActiveTab = (tab) => {
    searchParams.set('tab', tab);
    setSearchParams(searchParams);
  };

  // 1. Gather Seller Products
  const sellerProducts = products.filter(p => p.sellerId === currentUser.id);

  // 2. Gather Seller Orders (any global orders that contain items from this seller)
  const sellerOrders = orders.filter(order => 
    order.items.some(item => item.sellerId === currentUser.id)
  );

  // 3. Analytics Calculations
  const totalRevenue = orders.reduce((sum, order) => {
    const sellerItems = order.items.filter(item => item.sellerId === currentUser.id);
    const orderSellerSum = sellerItems.reduce((s, it) => s + (it.finalPrice * it.quantity), 0);
    // Apply order discount ratio if any
    const discountRatio = order.subtotal > 0 ? (1 - order.discountAmount / order.subtotal) : 1;
    return sum + (orderSellerSum * discountRatio);
  }, 0);

  const totalSoldUnits = orders.reduce((sum, order) => {
    const sellerItems = order.items.filter(item => item.sellerId === currentUser.id);
    return sum + sellerItems.reduce((s, it) => s + it.quantity, 0);
  }, 0);

  // 4. Shop Creation Submit
  const handleCreateShopSubmit = (e) => {
    e.preventDefault();
    if (!shopNameForm) return;
    createShop({
      name: shopNameForm,
      description: shopDescForm,
      logo: shopLogoForm,
      banner: shopBannerForm,
      category: 'T-Shirts',
      contact: shopContactForm,
      address: shopAddressForm
    });
  };

  // 5. Shop Update Submit
  const handleUpdateShopSubmit = (e) => {
    e.preventDefault();
    if (!sellerShop) return;
    updateShop(sellerShop.id, {
      name: shopNameForm,
      description: shopDescForm,
      logo: shopLogoForm,
      banner: shopBannerForm,
      contact: shopContactForm,
      address: shopAddressForm
    });
  };

  // 6. Product Add/Edit Operations
  const openAddProductModal = () => {
    setEditingProductId(null);
    setProdName('');
    setProdDesc('');
    setProdPrice('');
    setProdDiscount('0');
    setProdStock('');
    setProdCategory('T-Shirts');
    setProdSubcat('');
    setProdImages('https://images.unsplash.com/photo-1559251606-c623743a6d76?w=600&auto=format&fit=crop&q=80');
    setProdSizes('Small, Medium, Large');
    setProdColors('Pastel Pink, Creamy White');
    setProdTags('cute, handmade, plushie');
    setProdDelivery('Ships in 1-2 business days.');
    setProdReturn('Returns accepted within 7 days.');
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setEditingProductId(product.id);
    setProdName(product.name);
    setProdDesc(product.description);
    setProdPrice(product.price);
    setProdDiscount(product.discount || 0);
    setProdStock(product.stock);
    setProdCategory(product.category);
    setProdSubcat(product.subcategory || '');
    setProdImages(product.images.join(', '));
    setProdSizes(product.sizes ? product.sizes.join(', ') : '');
    setProdColors(product.colors ? product.colors.join(', ') : '');
    setProdTags(product.tags ? product.tags.join(', ') : '');
    setProdDelivery(product.deliveryDetails || '');
    setProdReturn(product.returnPolicy || '');
    setShowProductModal(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const imagesArray = prodImages.split(',').map(img => img.trim()).filter(img => img !== '');
    const sizesArray = prodSizes.split(',').map(s => s.trim()).filter(s => s !== '');
    const colorsArray = prodColors.split(',').map(c => c.trim()).filter(c => c !== '');
    const tagsArray = prodTags.split(',').map(t => t.trim()).filter(t => t !== '');

    const productData = {
      name: prodName,
      description: prodDesc,
      price: Number(prodPrice),
      discount: Number(prodDiscount) || 0,
      stock: Number(prodStock),
      category: prodCategory,
      subcategory: prodSubcat,
      images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1559251606-c623743a6d76?w=600&auto=format&fit=crop&q=80'],
      sizes: sizesArray,
      colors: colorsArray,
      tags: tagsArray,
      deliveryDetails: prodDelivery,
      returnPolicy: prodReturn,
      shopId: sellerShop.id,
      sellerId: currentUser.id
    };

    if (editingProductId) {
      updateProduct(editingProductId, productData);
    } else {
      addProduct(productData);
    }

    setShowProductModal(false);
  };

  const handleUpdateOrderStatus = (orderId, currentStatus) => {
    // Determine next step
    let nextStatus = 'pending';
    if (currentStatus === 'pending') nextStatus = 'shipped';
    else if (currentStatus === 'shipped') nextStatus = 'delivered';

    // Mutate order globally
    const orderIndex = orders.findIndex(ord => ord.id === orderId);
    if (orderIndex > -1) {
      orders[orderIndex].status = nextStatus;
      localStorage.setItem('orders', JSON.stringify(orders));
      showToast(`Order status updated to "${nextStatus}"`, 'success');
      // Force trigger state sync
      setActiveTab('orders');
    }
  };

  // Render Create Shop panel if seller has no shop registered yet
  if (!sellerShop) {
    return (
      <div className="container seller-dashboard-container">
        <div className="card start-shop-card">
          <h2>Welcome, Creative Maker! 🌸</h2>
          <p>Register your shop profile to begin posting products, accepting orders, and connecting with buyers.</p>
          <hr className="divider" style={{ margin: '20px 0' }} />

          <form onSubmit={handleCreateShopSubmit} className="shop-registration-form">
            <div className="form-group">
              <label className="form-label">Shop Name</label>
              <input 
                type="text" 
                placeholder="e.g. Kawaii Clay Crafts" 
                value={shopNameForm}
                onChange={(e) => setShopNameForm(e.target.value)}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Shop Description</label>
              <textarea 
                placeholder="Tell buyers what you create..." 
                value={shopDescForm}
                onChange={(e) => setShopDescForm(e.target.value)}
                className="form-control"
                rows={3}
                required
              />
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Logo URL</label>
                <input 
                  type="text" 
                  placeholder="Paste direct image link" 
                  value={shopLogoForm}
                  onChange={(e) => setShopLogoForm(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Banner URL</label>
                <input 
                  type="text" 
                  placeholder="Paste direct image link" 
                  value={shopBannerForm}
                  onChange={(e) => setShopBannerForm(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Support Email / Contact</label>
                <input 
                  type="text" 
                  placeholder="contact@myshop.com" 
                  value={shopContactForm}
                  onChange={(e) => setShopContactForm(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Shop Address</label>
                <input 
                  type="text" 
                  placeholder="City, Country" 
                  value={shopAddressForm}
                  onChange={(e) => setShopAddressForm(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Launch My Shop</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container seller-dashboard-container">
      
      {/* Pending Approval Alert */}
      {sellerShop.status === 'pending' && (
        <div className="card pending-approval-alert">
          <span>⚠️</span>
          <div>
            <h4>Shop Pending Approval</h4>
            <p>Your shop "<strong>{sellerShop.name}</strong>" is currently awaiting administrative approval. You can prepare catalog items, but they will become active once your shop is verified.</p>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="dashboard-grid">
        
        {/* Sidebar Controls */}
        <div className="dashboard-sidebar card">
          <div className="shop-identity-header">
            <img src={sellerShop.logo} alt={sellerShop.name} className="sidebar-shop-logo" />
            <h3>{sellerShop.name}</h3>
            <span className="badge badge-primary">{sellerShop.status}</span>
          </div>

          <ul className="dashboard-nav-list">
            <li>
              <button onClick={() => setActiveTab('analytics')} className={`dash-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}>
                <LayoutDashboard size={18} /> Analytics & Reports
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('products')} className={`dash-nav-btn ${activeTab === 'products' ? 'active' : ''}`}>
                <ShoppingBag size={18} /> Product Catalog ({sellerProducts.length})
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('orders')} className={`dash-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}>
                <ShoppingCart size={18} /> Order Manager ({sellerOrders.length})
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('shop-settings')} className={`dash-nav-btn ${activeTab === 'shop-settings' ? 'active' : ''}`}>
                <Settings size={18} /> Shop Settings
              </button>
            </li>
          </ul>
        </div>

        {/* Workspace Display Area */}
        <div className="dashboard-content-pane">
          
          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="tab-pane-view">
              
              {/* Analytics widgets cards */}
              <div className="analytics-widgets-grid">
                <div className="card widget-card">
                  <div className="widget-icon-row">
                    <DollarSign size={24} className="widget-icon color-green" />
                    <span className="badge badge-success">+12%</span>
                  </div>
                  <span className="widget-label">Total Revenue</span>
                  <h3>${totalRevenue.toFixed(2)}</h3>
                </div>

                <div className="card widget-card">
                  <div className="widget-icon-row">
                    <ShoppingCart size={24} className="widget-icon color-blue" />
                    <span className="badge badge-secondary">{sellerOrders.length}</span>
                  </div>
                  <span className="widget-label">Total Orders</span>
                  <h3>{sellerOrders.length} Orders</h3>
                </div>

                <div className="card widget-card">
                  <div className="widget-icon-row">
                    <Package size={24} className="widget-icon color-purple" />
                    <span className="badge badge-primary">{totalSoldUnits}</span>
                  </div>
                  <span className="widget-label">Units Sold</span>
                  <h3>{totalSoldUnits} Items</h3>
                </div>
              </div>

              {/* Analytics Chart Block */}
              <div className="card chart-card">
                <h3>Monthly Revenue & Orders Chart</h3>
                <p className="subtitle">Visual performance stats</p>
                <hr className="divider" style={{ margin: '15px 0' }} />
                
                {/* Custom Interactive SVG Line Chart */}
                <div className="svg-chart-container">
                  <svg viewBox="0 0 500 200" className="revenue-line-chart">
                    {/* Grid Lines */}
                    <line x1="40" y1="20" x2="480" y2="20" stroke="var(--border-color)" strokeDasharray="4 4" />
                    <line x1="40" y1="70" x2="480" y2="70" stroke="var(--border-color)" strokeDasharray="4 4" />
                    <line x1="40" y1="120" x2="480" y2="120" stroke="var(--border-color)" strokeDasharray="4 4" />
                    <line x1="40" y1="170" x2="480" y2="170" stroke="#888" />

                    {/* Chart coordinates points line */}
                    {/* Points: Jan (120), Feb (140), Mar (70), Apr (90), May (40) */}
                    <path 
                      d="M 50 150 L 150 140 L 250 110 L 350 80 L 450 40" 
                      fill="none" 
                      stroke="var(--primary)" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                    />

                    {/* Gradient under line */}
                    <path 
                      d="M 50 150 L 150 140 L 250 110 L 350 80 L 450 40 L 450 170 L 50 170 Z" 
                      fill="url(#chart-grad)"
                      opacity="0.15"
                    />

                    {/* Points markers */}
                    <circle cx="50" cy="150" r="6" fill="var(--primary)" />
                    <circle cx="150" cy="140" r="6" fill="var(--primary)" />
                    <circle cx="250" cy="110" r="6" fill="var(--primary)" />
                    <circle cx="350" cy="80" r="6" fill="var(--primary)" />
                    <circle cx="450" cy="40" r="6" fill="var(--primary)" />

                    {/* Labels */}
                    <text x="50" y="190" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Jan</text>
                    <text x="150" y="190" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Feb</text>
                    <text x="250" y="190" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Mar</text>
                    <text x="350" y="190" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Apr</text>
                    <text x="450" y="190" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">May</text>
                    
                    <text x="30" y="150" fill="var(--text-secondary)" fontSize="9" textAnchor="end">$100</text>
                    <text x="30" y="110" fill="var(--text-secondary)" fontSize="9" textAnchor="end">$300</text>
                    <text x="30" y="70" fill="var(--text-secondary)" fontSize="9" textAnchor="end">$500</text>
                    <text x="30" y="30" fill="var(--text-secondary)" fontSize="9" textAnchor="end">$800</text>

                    {/* Chart Gradient Def */}
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT CATALOG */}
          {activeTab === 'products' && (
            <div className="card tab-pane-card">
              <div className="pane-header">
                <div>
                  <h3>Product Catalog</h3>
                  <p className="subtitle">Add, edit, adjust stock, and manage item visibility</p>
                </div>
                <button onClick={openAddProductModal} className="btn btn-primary">
                  <Plus size={16} /> Add Product
                </button>
              </div>
              <hr className="divider" style={{ margin: '15px 0' }} />

              {sellerProducts.length === 0 ? (
                <div className="empty-tab-view">
                  <span className="empty-emoji">🧸🪄</span>
                  <h4>No Products Added!</h4>
                  <p>Click "Add Product" above to load your first cute listing.</p>
                </div>
              ) : (
                <div className="dashboard-products-table-wrapper">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellerProducts.map(prod => (
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
                          <td>
                            <strong>${prod.price.toFixed(2)}</strong>
                            {prod.discount > 0 && <span className="discount-sub">-{prod.discount}%</span>}
                          </td>
                          <td>
                            <span className={`stock-sub ${prod.stock === 0 ? 'out' : ''}`}>
                              {prod.stock} units
                            </span>
                          </td>
                          <td>⭐ {prod.rating}</td>
                          <td>
                            <div className="table-actions-row">
                              <button onClick={() => openEditProductModal(prod)} className="table-act-btn edit" aria-label="Edit product">
                                <Edit size={14} />
                              </button>
                              <button onClick={() => toggleHideProduct(prod.id)} className="table-act-btn hide" aria-label={prod.hidden ? 'Unhide product' : 'Hide product'}>
                                {prod.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                              <button onClick={() => deleteProduct(prod.id)} className="table-act-btn delete" aria-label="Delete product">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDER MANAGER */}
          {activeTab === 'orders' && (
            <div className="card tab-pane-card">
              <h3>Order Manager</h3>
              <p className="subtitle">View buyer purchases, print labels, and update shipping logs</p>
              <hr className="divider" style={{ margin: '15px 0' }} />

              {sellerOrders.length === 0 ? (
                <div className="empty-tab-view">
                  <span className="empty-emoji">📦💤</span>
                  <h4>No Orders Placed!</h4>
                  <p>When buyers order your items, they will show up here.</p>
                </div>
              ) : (
                <div className="seller-orders-list">
                  {sellerOrders.map(order => {
                    // Extract only items belonging to this seller
                    const myItems = order.items.filter(item => item.sellerId === currentUser.id);
                    const mySum = myItems.reduce((s, it) => s + (it.finalPrice * it.quantity), 0);

                    return (
                      <div key={order.id} className="seller-order-card card">
                        <div className="seller-order-header">
                          <div>
                            <h4>Order #{order.id}</h4>
                            <span className="date">Buyer: {order.buyerName} ({new Date(order.date).toLocaleDateString()})</span>
                          </div>
                          <span className={`status-badge-inline ${order.status}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="order-items-breakdown bg-light">
                          {myItems.map((item, idx) => (
                            <div key={idx} className="item-row">
                              <span><strong>{item.quantity}x</strong> {item.name} {item.color && `(${item.color})`}</span>
                              <span>${(item.finalPrice * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <hr className="divider" style={{ margin: '10px 0' }} />
                        
                        <div className="order-footer">
                          <div className="addr">
                            <span>📍 Shipping to: {order.shippingAddress}</span>
                          </div>
                          <div className="actions">
                            <span className="revenue">Your share: <strong>${mySum.toFixed(2)}</strong></span>
                            {order.status === 'pending' && (
                              <button onClick={() => handleUpdateOrderStatus(order.id, 'pending')} className="btn btn-primary small-btn">
                                <Truck size={12} /> Mark as Shipped
                              </button>
                            )}
                            {order.status === 'shipped' && (
                              <button onClick={() => handleUpdateOrderStatus(order.id, 'shipped')} className="btn btn-secondary small-btn">
                                <CheckCircle size={12} /> Mark as Delivered
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SHOP SETTINGS */}
          {activeTab === 'shop-settings' && (
            <div className="card tab-pane-card">
              <h3>Shop Profile Settings</h3>
              <p className="subtitle">Customize branding, address points, and cover media</p>
              <hr className="divider" style={{ margin: '15px 0' }} />

              <form onSubmit={handleUpdateShopSubmit} className="shop-settings-form">
                <div className="form-group">
                  <label className="form-label">Shop Name</label>
                  <input 
                    type="text" 
                    value={shopNameForm} 
                    onChange={(e) => setShopNameForm(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Shop Description</label>
                  <textarea 
                    value={shopDescForm} 
                    onChange={(e) => setShopDescForm(e.target.value)}
                    className="form-control"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Shop Logo Image URL</label>
                    <input 
                      type="text" 
                      value={shopLogoForm} 
                      onChange={(e) => setShopLogoForm(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Shop Banner Cover URL</label>
                    <input 
                      type="text" 
                      value={shopBannerForm} 
                      onChange={(e) => setShopBannerForm(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Business Contact Email</label>
                    <input 
                      type="email" 
                      value={shopContactForm} 
                      onChange={(e) => setShopContactForm(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dispatch Location Address</label>
                    <input 
                      type="text" 
                      value={shopAddressForm} 
                      onChange={(e) => setShopAddressForm(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">Update Shop Profile</button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content card animate-fade">
            <h3>{editingProductId ? 'Edit Product Details' : 'Add New Product Listing'}</h3>
            <hr className="divider" style={{ margin: '12px 0' }} />

            <form onSubmit={handleProductSubmit} className="modal-product-form">
              <div className="grid-scroll-box">
                
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input 
                    type="text" 
                    value={prodName} 
                    onChange={(e) => setProdName(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Product Description</label>
                  <textarea 
                    value={prodDesc} 
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="form-control"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid-cols-3">
                  <div className="form-group">
                    <label className="form-label">Base Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={prodPrice} 
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discount (%)</label>
                    <input 
                      type="number" 
                      value={prodDiscount} 
                      onChange={(e) => setProdDiscount(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock Qty</label>
                    <input 
                      type="number" 
                      value={prodStock} 
                      onChange={(e) => setProdStock(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Primary Category</label>
                    <select 
                      value={prodCategory} 
                      onChange={(e) => setProdCategory(e.target.value)}
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
                    <label className="form-label">Subcategory</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Cushions" 
                      value={prodSubcat} 
                      onChange={(e) => setProdSubcat(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Images URLs (comma separated links)</label>
                  <input 
                    type="text" 
                    value={prodImages} 
                    onChange={(e) => setProdImages(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Available Sizes (comma separated)</label>
                    <input 
                      type="text" 
                      value={prodSizes} 
                      onChange={(e) => setProdSizes(e.target.value)}
                      className="form-control"
                      placeholder="e.g. A5, A4"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Available Colors (comma separated)</label>
                    <input 
                      type="text" 
                      value={prodColors} 
                      onChange={(e) => setProdColors(e.target.value)}
                      className="form-control"
                      placeholder="e.g. Red, Blue"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Search Tags (comma separated)</label>
                  <input 
                    type="text" 
                    value={prodTags} 
                    onChange={(e) => setProdTags(e.target.value)}
                    className="form-control"
                    placeholder="e.g. washi, sticker"
                  />
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Delivery Timeline Description</label>
                    <input 
                      type="text" 
                      value={prodDelivery} 
                      onChange={(e) => setProdDelivery(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Return Policy Description</label>
                    <input 
                      type="text" 
                      value={prodReturn} 
                      onChange={(e) => setProdReturn(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

              </div>

              <div className="modal-actions-row">
                <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-secondary">Save Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .seller-dashboard-container {
          padding-top: 20px;
          padding-bottom: 50px;
        }
        .start-shop-card {
          max-width: 700px;
          margin: 60px auto;
          padding: 40px;
        }
        .shop-registration-form {
          margin-top: 20px;
        }
        .pending-approval-alert {
          background: #FEF3C7;
          border-color: #F59E0B;
          color: #92400E;
          display: flex;
          gap: 15px;
          align-items: center;
          padding: 16px 20px;
          margin-bottom: 25px;
          border-left: 5px solid #F59E0B;
        }
        .pending-approval-alert span {
          font-size: 1.5rem;
        }
        .pending-approval-alert h4 {
          color: #92400E;
          margin-bottom: 2px;
        }
        .pending-approval-alert p {
          font-size: 0.85rem;
          line-height: 1.4;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 2.5fr;
          gap: 30px;
          align-items: start;
        }
        .dashboard-sidebar {
          padding: 24px;
          text-align: center;
        }
        .shop-identity-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }
        .sidebar-shop-logo {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--border-color);
        }
        .dashboard-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }
        .dash-nav-btn {
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
        .dash-nav-btn:hover {
          background: var(--primary-light);
          color: var(--primary);
        }
        .dash-nav-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: var(--shadow-sm);
        }

        /* Widgets */
        .analytics-widgets-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .widget-card {
          padding: 20px;
        }
        .widget-icon-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .widget-icon {
          padding: 8px;
          border-radius: var(--border-radius-xs);
        }
        .widget-icon.color-green { background: rgba(16, 185, 129, 0.1); color: #10B981; }
        .widget-icon.color-blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
        .widget-icon.color-purple { background: rgba(167, 139, 250, 0.1); color: var(--secondary); }
        .widget-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }
        .widget-card h3 {
          font-size: 1.6rem;
          font-family: var(--font-heading);
          margin-top: 4px;
        }

        /* Chart card */
        .chart-card {
          padding: 25px;
        }
        .svg-chart-container {
          margin-top: 15px;
        }
        .revenue-line-chart {
          width: 100%;
          height: auto;
        }

        /* Products Tab */
        .tab-pane-card {
          padding: 30px;
        }
        .pane-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dashboard-products-table-wrapper {
          overflow-x: auto;
        }
        .dash-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .dash-table th, .dash-table td {
          padding: 15px 12px;
          border-bottom: 1px solid var(--border-color);
        }
        .dash-table th {
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .table-prod-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .table-prod-img {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: var(--border-radius-xs);
          border: 1px solid var(--border-color);
        }
        .cat-sub {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .discount-sub {
          display: block;
          font-size: 0.7rem;
          color: #EF4444;
          font-weight: bold;
        }
        .stock-sub {
          font-weight: 600;
        }
        .stock-sub.out {
          color: #EF4444;
        }
        .row-hidden {
          opacity: 0.65;
        }
        .table-actions-row {
          display: flex;
          gap: 8px;
        }
        .table-act-btn {
          border: none;
          background: var(--bg-app);
          color: var(--text-secondary);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .table-act-btn:hover {
          color: var(--primary);
          background: var(--primary-light);
        }
        .table-act-btn.delete:hover {
          color: white;
          background: #EF4444;
        }

        /* Order Manager */
        .seller-orders-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .seller-order-card {
          padding: 20px;
        }
        .seller-order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .seller-order-header h4 {
          font-size: 1.05rem;
        }
        .seller-order-header .date {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .status-badge-inline {
          padding: 3px 10px;
          font-size: 0.75rem;
          border-radius: 4px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-badge-inline.pending { background: #FEF3C7; color: #D97706; }
        .status-badge-inline.shipped { background: #DBEAFE; color: #2563EB; }
        .status-badge-inline.delivered { background: #D1FAE5; color: #059669; }

        .order-items-breakdown {
          background: var(--bg-app);
          padding: 10px 14px;
          border-radius: var(--border-radius-xs);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .order-items-breakdown .item-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          font-size: 0.85rem;
        }
        .order-footer .addr {
          color: var(--text-muted);
          max-width: 60%;
        }
        .order-footer .actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .order-footer .actions .revenue {
          color: var(--text-secondary);
        }
        .order-footer .actions .revenue strong {
          color: var(--primary);
          font-size: 1rem;
        }
        .small-btn {
          padding: 6px 12px;
          font-size: 0.75rem;
        }

        /* Modal custom scroll */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-content {
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .modal-product-form {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .grid-scroll-box {
          overflow-y: auto;
          flex: 1;
          padding-right: 10px;
          max-height: 60vh;
        }
        .modal-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
        }

        /* Dashboard Responsive */
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .analytics-widgets-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .pane-header {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }
          .order-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .order-footer .actions {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}} />
    </div>
  );
}
