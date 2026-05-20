import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { Heart } from 'lucide-react';

export default function Trending() {
  const { products, toggleWishlist, addToCart, wishlist } = useMarketplace();

  // Filter trending products: rating >= 4.5
  const trendingProducts = products.filter(p => p.rating >= 4.5 && !p.hidden);

  return (
    <div className="container trending-page-container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      <div className="text-center" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)' }}>🔥 Trending Now</h2>
        <p className="subtitle" style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
          Check out the absolute favorites loved by our sweet community
        </p>
      </div>

      {trendingProducts.length === 0 ? (
        <div className="card text-center" style={{ padding: '60px 20px' }}>
          <span style={{ fontSize: '3rem' }}>📈💤</span>
          <h4 style={{ marginTop: '15px' }}>No trending products yet!</h4>
          <p className="subtitle">High rating items will populate here soon.</p>
        </div>
      ) : (
        <div className="grid-responsive">
          {trendingProducts.map((product) => {
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
                  <span className="badge badge-primary" style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'var(--primary)', color: 'white', border: 'none' }}>
                    🔥 Top Rated
                  </span>
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
