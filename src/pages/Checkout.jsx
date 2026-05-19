import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  ShoppingBag, Trash2, MapPin, CreditCard, ChevronRight, 
  CheckCircle, Plus, Minus, ArrowLeft, Truck, ShieldCheck, Ticket 
} from 'lucide-react';

export default function Checkout() {
  const { 
    cart, products, updateCartQuantity, removeFromCart, placeOrder, currentUser 
  } = useMarketplace();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Step state (cart, shipping, payment, success)
  const currentStep = searchParams.get('step') || 'cart';

  // Shipping form fields
  const [shippingName, setShippingName] = useState(currentUser?.name || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');

  // Payment form fields
  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // Razorpay, UPI, COD
  const [upiId, setUpiId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  
  // Placed Order state for step=success
  const [placedOrder, setPlacedOrder] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Cart total calculations
  const cartItemsWithDetails = cart.map(item => {
    const prod = products.find(p => p.id === item.productId);
    return {
      ...item,
      product: prod
    };
  }).filter(item => item.product !== undefined);

  const subtotal = cartItemsWithDetails.reduce((sum, item) => {
    const finalPrice = item.product.price * (1 - (item.product.discount || 0) / 100);
    return sum + (finalPrice * item.quantity);
  }, 0);

  let discountAmount = 0;
  if (appliedCoupon === 'HAPPY10') discountAmount = subtotal * 0.1;
  else if (appliedCoupon === 'CUTE20') discountAmount = subtotal * 0.2;

  const total = subtotal - discountAmount;

  // Set Step URL Helper
  const setStep = (step) => {
    searchParams.set('step', step);
    setSearchParams(searchParams);
  };

  // Auth Guard
  useEffect(() => {
    if (!currentUser && currentStep !== 'cart') {
      navigate('/auth');
    }
  }, [currentUser, currentStep, navigate]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'HAPPY10' || code === 'CUTE20') {
      setAppliedCoupon(code);
    } else {
      alert('Invalid coupon code!');
    }
    setCouponCode('');
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (currentStep === 'shipping') {
      if (!shippingName || !shippingAddress || !shippingCity || !shippingZip || !shippingPhone) {
        alert('Please fill out all shipping details!');
        return;
      }
      setStep('payment');
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'UPI' && !upiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. user@okhdfcbank)!');
      return;
    }

    setLoadingPayment(true);

    // Simulate payment processing loader
    setTimeout(() => {
      setLoadingPayment(false);
      
      const fullAddress = `${shippingAddress}, ${shippingCity} - ${shippingZip}. Phone: ${shippingPhone}`;
      const newOrder = placeOrder(fullAddress, paymentMethod, appliedCoupon);
      
      if (newOrder) {
        setPlacedOrder(newOrder);
        setStep('success');
      }
    }, 2500); // 2.5s payment processor delay
  };

  return (
    <div className="container checkout-page-container">
      {/* Checkout step progress indicators */}
      {currentStep !== 'success' && (
        <div className="checkout-steps-bar card">
          <button onClick={() => setStep('cart')} className={`step-btn ${currentStep === 'cart' ? 'active' : ''}`}>
            <span>1</span> Shopping Cart
          </button>
          <ChevronRight size={16} className="step-arrow" />
          <button onClick={() => cart.length > 0 && setStep('shipping')} disabled={cart.length === 0} className={`step-btn ${currentStep === 'shipping' ? 'active' : ''}`}>
            <span>2</span> Shipping Address
          </button>
          <ChevronRight size={16} className="step-arrow" />
          <button onClick={() => cart.length > 0 && shippingAddress && setStep('payment')} disabled={cart.length === 0 || !shippingAddress} className={`step-btn ${currentStep === 'payment' ? 'active' : ''}`}>
            <span>3</span> Payment details
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="checkout-main-grid">
        
        {/* LEFT COLUMN - FLOW OF PAGES */}
        <div className="checkout-flow-panel">
          
          {/* STEP 1: SHOPPING CART */}
          {currentStep === 'cart' && (
            <div className="card step-card">
              <h3 className="step-title"><ShoppingBag className="icon-pink" /> Review Your Shopping Cart</h3>
              <hr className="divider" />

              {cartItemsWithDetails.length === 0 ? (
                <div className="empty-cart-view">
                  <span className="empty-emoji">🛒🧸</span>
                  <h4>Your Cart is Empty!</h4>
                  <p>Load up your cart with some cute items from the storefront.</p>
                  <Link to="/" className="btn btn-primary">Go Shop Now</Link>
                </div>
              ) : (
                <div className="cart-list">
                  {cartItemsWithDetails.map(item => {
                    const finalPrice = item.product.price * (1 - (item.product.discount || 0) / 100);
                    return (
                      <div key={`${item.productId}-${item.color}-${item.size}`} className="cart-item-row">
                        <img src={item.product.images[0]} alt="" className="cart-item-img" />
                        <div className="cart-item-details">
                          <Link to={`/product/${item.productId}`} className="cart-item-name"><h4>{item.product.name}</h4></Link>
                          <div className="cart-item-meta">
                            {item.color && <span className="meta-tag">Color: {item.color}</span>}
                            {item.size && <span className="meta-tag">Size: {item.size}</span>}
                          </div>
                          
                          <div className="cart-quantity-row">
                            <div className="quantity-selector">
                              <button onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.color, item.size)} className="qty-btn">
                                <Minus size={12} />
                              </button>
                              <span className="qty-value">{item.quantity}</span>
                              <button onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.color, item.size)} className="qty-btn">
                                <Plus size={12} />
                              </button>
                            </div>
                            
                            <button onClick={() => removeFromCart(item.productId, item.color, item.size)} className="remove-item-btn" aria-label="Remove item">
                              <Trash2 size={16} /> Remove
                            </button>
                          </div>
                        </div>

                        <div className="cart-item-price-col">
                          <span className="cart-item-price">${(finalPrice * item.quantity).toFixed(2)}</span>
                          {item.product.discount > 0 && (
                            <span className="cart-item-savings">Saved ${((item.product.price - finalPrice) * item.quantity).toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div className="cart-footer-actions">
                    <Link to="/" className="btn btn-outline"><ArrowLeft size={16} /> Continue Shopping</Link>
                    <button onClick={() => setStep('shipping')} className="btn btn-primary">Proceed to Shipping <ChevronRight size={16} /></button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SHIPPING ADDRESS */}
          {currentStep === 'shipping' && (
            <div className="card step-card">
              <h3 className="step-title"><MapPin className="icon-pink" /> Enter Shipping Address</h3>
              <hr className="divider" />
              
              <form onSubmit={handleCheckoutSubmit} className="shipping-form">
                <div className="form-group">
                  <label className="form-label">Recipient's Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Alice Johnson" 
                    value={shippingName} 
                    onChange={(e) => setShippingName(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input 
                    type="text" 
                    placeholder="Apartment, suite, street name" 
                    value={shippingAddress} 
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">City / Town</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Cloud City" 
                      value={shippingCity} 
                      onChange={(e) => setShippingCity(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP / Postal Code</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 560001" 
                      value={shippingZip} 
                      onChange={(e) => setShippingZip(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number (for courier contact)</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. +91 98765 43210" 
                    value={shippingPhone} 
                    onChange={(e) => setShippingPhone(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="cart-footer-actions" style={{ marginTop: '20px' }}>
                  <button type="button" onClick={() => setStep('cart')} className="btn btn-outline"><ArrowLeft size={16} /> Back to Cart</button>
                  <button type="submit" className="btn btn-primary">Proceed to Payment <ChevronRight size={16} /></button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {currentStep === 'payment' && (
            <div className="card step-card">
              <h3 className="step-title"><CreditCard className="icon-pink" /> Select Payment Method</h3>
              <hr className="divider" />

              {loadingPayment ? (
                <div className="payment-processing-loader">
                  <div className="spinner" />
                  <h4>Simulating Gateway Handshake...</h4>
                  <p>Processing transaction via secure API vault. Do not refresh.</p>
                </div>
              ) : (
                <div className="payment-selections">
                  
                  {/* Method radios */}
                  <div className="payment-methods-grid">
                    <label className={`payment-method-card card ${paymentMethod === 'Razorpay' ? 'active' : ''}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="Razorpay" 
                        checked={paymentMethod === 'Razorpay'} 
                        onChange={() => setPaymentMethod('Razorpay')} 
                        className="radio-input"
                      />
                      <div className="method-details">
                        <h4>💳 Razorpay Checkout</h4>
                        <p>Pay with Cards, Netbanking or Wallet instantly.</p>
                      </div>
                    </label>

                    <label className={`payment-method-card card ${paymentMethod === 'UPI' ? 'active' : ''}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="UPI" 
                        checked={paymentMethod === 'UPI'} 
                        onChange={() => setPaymentMethod('UPI')} 
                        className="radio-input"
                      />
                      <div className="method-details">
                        <h4>📱 UPI Transaction</h4>
                        <p>Pay instantly using PhonePe, GooglePay, or BHIM.</p>
                      </div>
                    </label>

                    <label className={`payment-method-card card ${paymentMethod === 'COD' ? 'active' : ''}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="COD" 
                        checked={paymentMethod === 'COD'} 
                        onChange={() => setPaymentMethod('COD')} 
                        className="radio-input"
                      />
                      <div className="method-details">
                        <h4>📦 Cash On Delivery (COD)</h4>
                        <p>Pay by Cash or UPI scan when courier reaches door.</p>
                      </div>
                    </label>
                  </div>

                  {/* Payment Details Input */}
                  {paymentMethod === 'UPI' && (
                    <div className="upi-input-box card animate-fade">
                      <div className="form-group">
                        <label className="form-label">Enter UPI ID</label>
                        <input 
                          type="text" 
                          placeholder="e.g. username@upi" 
                          value={upiId} 
                          onChange={(e) => setUpiId(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Razorpay' && (
                    <div className="razorpay-notice-box card animate-fade">
                      <ShieldCheck size={28} className="icon-green" />
                      <p>Razorpay standard popup will open when you click the submit button. We simulate verification seamlessly.</p>
                    </div>
                  )}

                  <div className="cart-footer-actions" style={{ marginTop: '20px' }}>
                    <button onClick={() => setStep('shipping')} className="btn btn-outline"><ArrowLeft size={16} /> Shipping Address</button>
                    <button onClick={handlePlaceOrder} className="btn btn-secondary">Submit & Pay ${total.toFixed(2)}</button>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* STEP 4: ORDER SUCCESS & TRACKING */}
          {currentStep === 'success' && placedOrder && (
            <div className="card step-card success-card">
              <CheckCircle size={64} className="icon-success-glow" />
              <h2>Happy Order Placed! 🎉</h2>
              <p className="order-tag">Order ID: <strong>#{placedOrder.id}</strong></p>
              
              <div className="delivery-timeframe">
                <Truck size={24} className="icon-pink" />
                <p>Estimated Delivery: <strong>{new Date(Date.now() + 3600000 * 24 * 5).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</strong></p>
              </div>

              {/* Status Bar */}
              <div className="tracking-status-bar-container">
                <div className="bar-line" />
                <div className="track-step completed">
                  <div className="circle-dot">✓</div>
                  <span>Placed</span>
                </div>
                <div className="track-step active">
                  <div className="circle-dot">●</div>
                  <span>Processed</span>
                </div>
                <div className="track-step">
                  <div className="circle-dot"></div>
                  <span>Shipped</span>
                </div>
                <div className="track-step">
                  <div className="circle-dot"></div>
                  <span>Delivered</span>
                </div>
              </div>

              <div className="order-summary-box card">
                <h4>Items Ordered</h4>
                <div className="success-items-list">
                  {placedOrder.items.map((item, idx) => (
                    <div key={idx} className="success-item-row">
                      <span>{item.quantity}x {item.name} ({item.color || 'Default'})</span>
                      <span>${(item.finalPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <hr className="divider" style={{ margin: '12px 0' }} />
                <div className="success-total-row">
                  <span>Grand Total paid ({placedOrder.paymentMethod}):</span>
                  <strong>${placedOrder.total.toFixed(2)}</strong>
                </div>
              </div>

              <div className="success-footer-actions">
                <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                <Link to="/profile?tab=orders" className="btn btn-outline">Go to Order History</Link>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN - ORDER SUMMARY OVERVIEW PANEL */}
        {currentStep !== 'success' && (
          <div className="checkout-summary-panel">
            <div className="card summary-card">
              <h3>Order Summary</h3>
              <hr className="divider" />

              <div className="summary-items-list">
                {cartItemsWithDetails.length === 0 ? (
                  <p className="no-summary-items">No items in your cart.</p>
                ) : (
                  cartItemsWithDetails.map((item, idx) => (
                    <div key={idx} className="summary-item-row">
                      <div className="sum-item-left">
                        <img src={item.product.images[0]} alt="" className="sum-item-img" />
                        <div>
                          <p className="sum-item-name">{item.product.name}</p>
                          <span className="sum-item-qty">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="sum-item-price">${(item.product.price * (1 - (item.product.discount || 0) / 100) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>

              <hr className="divider" />

              {/* Coupon Applied Form */}
              <form onSubmit={handleApplyCoupon} className="coupon-form">
                <div className="coupon-input-row">
                  <Ticket size={16} className="coupon-icon" />
                  <input 
                    type="text" 
                    placeholder="Coupon Code (e.g. CUTE20)" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="form-control coupon-input"
                    aria-label="Enter Coupon Code"
                  />
                  <button type="submit" className="btn btn-outline coupon-btn">Apply</button>
                </div>
              </form>

              {appliedCoupon && (
                <div className="applied-coupon-tag badge badge-success">
                  Coupon {appliedCoupon} Applied!
                  <button onClick={() => setAppliedCoupon('')} className="remove-coupon-btn">×</button>
                </div>
              )}

              <hr className="divider" />

              {/* Pricing breakdown */}
              <div className="price-breakdown">
                <div className="breakdown-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="breakdown-row">
                  <span>Shipping Fee</span>
                  <span className="text-green font-bold">FREE</span>
                </div>
                {discountAmount > 0 && (
                  <div className="breakdown-row text-green">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <hr className="divider" style={{ margin: '8px 0' }} />
                <div className="breakdown-row grand-total-row">
                  <span>Grand Total</span>
                  <span className="gradient-text font-extra-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Small trust banner */}
              <div className="trust-badge-row">
                <span>🛡️ 100% Safe Payments</span>
                <span>🔒 SSL Encrypted</span>
              </div>
            </div>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .checkout-page-container {
          padding-top: 20px;
          padding-bottom: 50px;
        }
        .checkout-steps-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 30px;
          margin-bottom: 30px;
          border-color: var(--border-color);
        }
        .step-btn {
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
        }
        .step-btn span {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--border-color);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }
        .step-btn.active {
          color: var(--primary);
        }
        .step-btn.active span {
          background: var(--primary);
          color: white;
          box-shadow: var(--shadow-glow);
        }
        .step-arrow {
          color: var(--text-muted);
        }
        .checkout-main-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 30px;
          align-items: start;
        }
        .step-card {
          padding: 30px;
        }
        .step-title {
          font-size: 1.4rem;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .empty-cart-view {
          text-align: center;
          padding: 50px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .empty-emoji {
          font-size: 3rem;
        }
        .cart-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 20px;
        }
        .cart-item-row {
          display: flex;
          align-items: center;
          gap: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
        }
        .cart-item-img {
          width: 80px;
          height: 80px;
          border-radius: var(--border-radius-sm);
          object-fit: cover;
          border: 1px solid var(--border-color);
        }
        .cart-item-details {
          flex: 1;
        }
        .cart-item-name:hover h4 {
          color: var(--primary);
        }
        .cart-item-meta {
          display: flex;
          gap: 10px;
          margin-top: 4px;
        }
        .meta-tag {
          font-size: 0.75rem;
          background: var(--border-color);
          padding: 2px 8px;
          border-radius: 4px;
          color: var(--text-secondary);
        }
        .cart-quantity-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 10px;
        }
        .remove-item-btn {
          background: transparent;
          border: none;
          color: #EF4444;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .cart-item-price-col {
          text-align: right;
        }
        .cart-item-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary);
        }
        .cart-item-savings {
          display: block;
          font-size: 0.75rem;
          color: #10B981;
          font-weight: 600;
        }
        .cart-footer-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        .shipping-form {
          margin-top: 20px;
        }
        .payment-methods-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        }
        .payment-method-card {
          flex-direction: row;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          cursor: pointer;
        }
        .payment-method-card.active {
          border-color: var(--primary);
          background: var(--primary-light);
        }
        .radio-input {
          width: 18px;
          height: 18px;
          accent-color: var(--primary);
        }
        .method-details h4 {
          font-size: 1rem;
        }
        .method-details p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .upi-input-box {
          margin-top: 16px;
          padding: 15px;
        }
        .razorpay-notice-box {
          margin-top: 16px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(16, 185, 129, 0.05);
          border-color: rgba(16, 185, 129, 0.2);
        }
        .razorpay-notice-box p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .icon-green { color: #10B981; }

        .payment-processing-loader {
          text-align: center;
          padding: 50px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid var(--border-color);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Success screen styles */
        .success-card {
          text-align: center;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .icon-success-glow {
          color: #10B981;
          filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.3));
          animation: bounce 2s infinite;
        }
        .order-tag {
          font-size: 1.1rem;
          background: var(--primary-light);
          padding: 6px 16px;
          border-radius: 9999px;
          color: var(--primary);
        }
        .delivery-timeframe {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
        }
        .tracking-status-bar-container {
          display: flex;
          justify-content: space-between;
          width: 100%;
          max-width: 500px;
          margin: 30px auto;
          position: relative;
        }
        .bar-line {
          position: absolute;
          top: 12px;
          left: 10%;
          right: 10%;
          height: 4px;
          background: var(--border-color);
          z-index: 1;
        }
        .track-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 2;
          width: 25%;
        }
        .circle-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--bg-card);
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .track-step span {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .track-step.completed .circle-dot {
          background: #10B981;
          border-color: #10B981;
          color: white;
        }
        .track-step.completed span {
          color: #10B981;
        }
        .track-step.active .circle-dot {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-light);
        }
        .track-step.active span {
          color: var(--primary);
        }
        
        .order-summary-box {
          width: 100%;
          max-width: 500px;
          padding: 20px;
          text-align: left;
          background: var(--bg-app);
        }
        .success-items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 12px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .success-item-row {
          display: flex;
          justify-content: space-between;
        }
        .success-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 1rem;
        }
        .success-footer-actions {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }

        /* Summary panel styles */
        .summary-card {
          padding: 24px;
          position: sticky;
          top: 100px;
        }
        .summary-items-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin: 15px 0;
        }
        .summary-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sum-item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sum-item-img {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: var(--border-radius-xs);
          border: 1px solid var(--border-color);
        }
        .sum-item-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          max-width: 130px;
        }
        .sum-item-qty {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .sum-item-price {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .coupon-form {
          margin-top: 15px;
        }
        .coupon-input-row {
          display: flex;
          position: relative;
          align-items: center;
        }
        .coupon-icon {
          position: absolute;
          left: 10px;
          color: var(--text-muted);
        }
        .coupon-input {
          padding-left: 32px;
          border-radius: var(--border-radius-sm) 0 0 var(--border-radius-sm);
          margin-bottom: 0;
          font-size: 0.8rem;
        }
        .coupon-btn {
          border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
          border-left: none;
          padding: 8px 14px;
          font-size: 0.8rem;
        }
        .applied-coupon-tag {
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .remove-coupon-btn {
          background: transparent;
          border: none;
          color: white;
          font-weight: bold;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .price-breakdown {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.9rem;
          margin-top: 15px;
          color: var(--text-secondary);
        }
        .breakdown-row {
          display: flex;
          justify-content: space-between;
        }
        .grand-total-row {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .text-green { color: #10B981; }
        .font-bold { font-weight: 700; }
        .font-extra-bold { font-weight: 800; }
        .trust-badge-row {
          display: flex;
          justify-content: center;
          gap: 16px;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 20px;
        }

        /* Responsive Checkout Layout */
        @media (max-width: 1024px) {
          .checkout-main-grid {
            grid-template-columns: 1fr;
          }
          .summary-card {
            position: static;
          }
        }
        @media (max-width: 768px) {
          .checkout-steps-bar {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
            padding: 15px;
          }
          .step-arrow {
            display: none;
          }
          .cart-item-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .cart-item-price-col {
            text-align: left;
            margin-top: 10px;
          }
          .cart-footer-actions {
            flex-direction: column;
            gap: 10px;
          }
          .success-footer-actions {
            flex-direction: column;
            width: 100%;
          }
          .success-footer-actions a {
            text-align: center;
          }
        }
      `}} />
    </div>
  );
}
