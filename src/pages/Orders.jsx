import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { Clock, CheckCircle, Truck, MapPin } from 'lucide-react';

export default function Orders() {
  const { currentUser, orders } = useMarketplace();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  // Filter orders for logged-in buyer
  const buyerOrders = orders.filter(ord => ord.buyerId === currentUser.id);

  return (
    <div className="container orders-page-container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      <div className="text-center" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)' }}>📦 My Order History</h2>
        <p className="subtitle" style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
          Check dispatch logs and review details of your past purchases
        </p>
      </div>

      {buyerOrders.length === 0 ? (
        <div className="card text-center" style={{ padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
          <span style={{ fontSize: '3rem' }}>📦🧸</span>
          <h4 style={{ marginTop: '15px' }}>No orders found!</h4>
          <p className="subtitle">You haven't ordered any cute little things yet.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '15px', display: 'inline-block' }}>Go Shop Now</Link>
        </div>
      ) : (
        <div className="orders-history-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
          {buyerOrders.map(order => (
            <div key={order.id} className="order-history-card card" style={{ padding: '20px' }}>
              <div className="order-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <span className="order-number" style={{ fontWeight: 'bold', fontSize: '1.1rem', display: 'block' }}>Order #{order.id}</span>
                  <span className="order-date" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ordered on: {new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div className="order-status-badge">
                  {order.status === 'pending' && <span className="badge badge-warning" style={{ background: '#FEF3C7', color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Pending</span>}
                  {order.status === 'shipped' && <span className="badge badge-primary" style={{ background: '#DBEAFE', color: '#2563EB', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Truck size={12} /> Shipped</span>}
                  {order.status === 'delivered' && <span className="badge badge-success" style={{ background: '#D1FAE5', color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Delivered</span>}
                </div>
              </div>

              <div className="order-items-sublist" style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--bg-app)', padding: '12px 16px', borderRadius: '8px' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item-mini-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>
                      <strong style={{ color: 'var(--primary)', marginRight: '6px' }}>{item.quantity}x</strong> 
                      {item.name} {item.color && `(${item.color})`}
                    </span>
                    <span>${(item.finalPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr className="divider" style={{ margin: '15px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

              <div className="order-footer-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div className="order-shipping-addr" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                  <MapPin size={12} /> <span>{order.shippingAddress}</span>
                </div>
                <div className="order-total-price">
                  <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>Total Paid:</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>${order.total.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
