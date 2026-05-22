import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

export default function Gifts() {
  const { products } = useMarketplace();
  const [sortBy, setSortBy] = useState('popular'); // popular, low-to-high, high-to-low
  const [priceLimit, setPriceLimit] = useState(60);
  const [showFilters, setShowFilters] = useState(false);

  // Filter only Gifts
  const gifts = products.filter(p => p.category === 'Gifts' && !p.hidden);

  const filteredGifts = gifts.filter(p => {
    const finalPrice = p.price * (1 - (p.discount || 0) / 100);
    return finalPrice <= priceLimit;
  });

  const sortedGifts = [...filteredGifts].sort((a, b) => {
    const priceA = a.price * (1 - (a.discount || 0) / 100);
    const priceB = b.price * (1 - (b.discount || 0) / 100);
    if (sortBy === 'low-to-high') return priceA - priceB;
    if (sortBy === 'high-to-low') return priceB - priceA;
    return b.rating - a.rating; // default popular
  });

  return (
    <div className="category-page container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      {/* Premium Hero Banner */}
      <div className="cat-hero card" style={{
        background: 'linear-gradient(135deg, #FFE8EA 0%, #FFFDF5 100%)',
        padding: '50px 40px', borderRadius: 'var(--border-radius-lg)',
        border: '1px solid rgba(255,255,255,0.7)',
        marginBottom: '40px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
          <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
            <Sparkles size={12} /> Curated Joy Baskets
          </span>
          <h1 style={{ fontSize: '2.8rem', margin: '15px 0 10px', color: 'var(--text-primary)', fontWeight: '800' }}>
            Aesthetic Gift Boxes & Sets
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Surprise your loved ones or treat yourself to our cozy hand-painted daisy mugs, lavender relaxation candles, and cute plush bunnies.
          </p>
        </div>
        <div className="cat-hero-mascot" style={{
          position: 'absolute', right: '5%', bottom: '-10px', fontSize: '10rem', opacity: 0.8,
          pointerEvents: 'none', userSelect: 'none', animation: 'float 6s ease-in-out infinite'
        }}>
          🎁
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        padding: '15px 20px', borderRadius: 'var(--border-radius-md)',
        marginBottom: '30px', gap: '15px', flexWrap: 'wrap'
      }}>
        <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
          Showing {sortedGifts.length} curated gift listings
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', margin: 0 }}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="form-control"
            style={{ width: '180px', padding: '8px 12px', margin: 0 }}
            aria-label="Sort gifts by"
          >
            <option value="popular">🔥 Most Popular</option>
            <option value="low-to-high">💰 Price: Low to High</option>
            <option value="high-to-low">💎 Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Filter Drawer */}
      {showFilters && (
        <div className="card" style={{ padding: '20px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ maxWidth: '300px' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Max Price Limit:</span>
              <strong>${priceLimit}</strong>
            </label>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={priceLimit} 
              onChange={(e) => setPriceLimit(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
              aria-label="Filter gifts by maximum price"
            />
          </div>
        </div>
      )}

      {/* Products Grid */}
      {sortedGifts.length === 0 ? (
        <div className="card text-center" style={{ padding: '50px 20px' }}>
          <span style={{ fontSize: '3rem' }}>🎁</span>
          <h3 style={{ margin: '15px 0 10px' }}>No Gifts found in this price range</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try raising your budget limit to explore our premium deluxe hampers.</p>
          <button onClick={() => setPriceLimit(60)} className="btn btn-primary" style={{ marginTop: '10px' }}>Reset Price Filter</button>
        </div>
      ) : (
        <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px' }}>
          {sortedGifts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
