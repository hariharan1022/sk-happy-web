import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';

export default function Shops() {
  const { shops, followShop, followedShops } = useMarketplace();

  // Filter approved seller shops
  const approvedShops = shops.filter(s => s.status === 'approved');

  return (
    <div className="container shops-page-container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      <div className="text-center" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)' }}>🎪 Partner Shops</h2>
        <p className="subtitle" style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
          Meet the beautiful creators and local vendors behind our cute catalog listings
        </p>
      </div>

      {approvedShops.length === 0 ? (
        <div className="card text-center" style={{ padding: '60px 20px' }}>
          <span style={{ fontSize: '3rem' }}>🎪💤</span>
          <h4 style={{ marginTop: '15px' }}>No shops available!</h4>
          <p className="subtitle">New sellers will be launched here soon.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {approvedShops.map((shop) => {
            const isFollowing = followedShops.includes(shop.id);
            return (
              <div key={shop.id} className="card shop-list-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <img src={shop.banner} alt="" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                  <img src={shop.logo} alt="" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{shop.name}</h4>
                    <span className="badge badge-secondary" style={{ fontSize: '0.75rem', marginTop: '2px', display: 'inline-block' }}>{shop.category}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1, marginBottom: '15px' }}>{shop.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>👥 {shop.followers} Followers</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => followShop(shop.id)} className={`btn small-btn ${isFollowing ? 'btn-primary' : 'btn-outline'}`}>
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <Link to={`/shop/${shop.id}`} className="btn btn-secondary small-btn">
                      Visit
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
