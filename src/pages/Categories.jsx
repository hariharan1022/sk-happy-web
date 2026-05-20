import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { Heart, ShoppingBag } from 'lucide-react';

export default function Categories() {
  const { products, toggleWishlist, addToCart, wishlist } = useMarketplace();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { name: 'All', emoji: '🌈', desc: 'Browse all items' },
    { name: 'T-Shirts', emoji: '👕', desc: 'Cute graphic Tees' },
    { name: 'Birthday Kit', emoji: '🎂', desc: 'Party packages' },
    { name: 'Caps', emoji: '🧢', desc: 'Adorable headwear' },
    { name: 'Posters', emoji: '🖼️', desc: 'Aesthetic wall prints' },
    { name: 'Gifts', emoji: '🎁', desc: 'Presents for loved ones' }
  ];

  const filteredProducts = selectedCategory === 'All' 
    ? products.filter(p => !p.hidden)
    : products.filter(p => p.category === selectedCategory && !p.hidden);

  return (
    <div className="container categories-page-container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      <div className="text-center" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)' }}>Browse Categories</h2>
        <p className="subtitle" style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
          Explore cute and aesthetic products curated just for you
        </p>
      </div>

      {/* Category Pills Grid */}
      <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', marginBottom: '40px' }}>
        {categories.map((cat) => (
          <button 
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`card category-pills-card ${selectedCategory === cat.name ? 'active' : ''}`}
            style={{
              padding: '20px 10px',
              textAlign: 'center',
              cursor: 'pointer',
              border: selectedCategory === cat.name ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              background: selectedCategory === cat.name ? 'var(--primary-light)' : 'var(--card-bg)',
              borderRadius: '12px',
              transition: 'all var(--transition-fast)'
            }}
          >
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>{cat.emoji}</span>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: selectedCategory === cat.name ? 'var(--primary)' : 'var(--text-primary)' }}>{cat.name}</strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{cat.desc}</span>
          </button>
        ))}
      </div>

      <h3 style={{ fontSize: '1.4rem', marginBottom: '20px', fontFamily: 'var(--font-heading)' }}>
        Showing {selectedCategory} Items ({filteredProducts.length})
      </h3>

      {filteredProducts.length === 0 ? (
        <div className="card text-center" style={{ padding: '60px 20px' }}>
          <span style={{ fontSize: '3rem' }}>🪄🧸</span>
          <h4 style={{ marginTop: '15px' }}>No products listed!</h4>
          <p className="subtitle">Makers have not uploaded items under this category yet.</p>
        </div>
      ) : (
        <div className="grid-responsive">
          {filteredProducts.map((product) => {
            const finalPrice = product.price * (1 - (product.discount || 0) / 100);
            const isWishlisted = wishlist.includes(product.id);
            return (
              <div key={product.id} className="card product-card">
                <div className="prod-img-wrapper" style={{ position: 'relative' }}>
                  <img src={product.images[0]} alt={product.name} className="product-image" />
                  <button 
                    onClick={() => toggleWishlist(product.id)}
                    className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
                    aria-label="Save to wishlist"
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                  >
                    <Heart size={16} fill={isWishlisted ? 'var(--primary)' : 'none'} />
                  </button>
                </div>
                <div className="product-card-body">
                  <span className="product-tag">{product.category}</span>
                  <Link to={`/product/${product.id}`}>
                    <h4 className="product-card-title">{product.name}</h4>
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
  );
}
