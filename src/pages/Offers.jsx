import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { Heart } from 'lucide-react';

export default function Offers() {
  const { products, toggleWishlist, addToCart, wishlist } = useMarketplace();

  // Filter items with active discount percentage
  const discountProducts = products.filter(p => p.discount > 0 && !p.hidden);

  return (
    <div className="container offers-page-container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      <div className="text-center" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)' }}>🎁 Offers & Deals</h2>
        <p className="subtitle" style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
          Find amazing, adorable goods with active promotional discounts and markdown prices
        </p>
      </div>

      {discountProducts.length === 0 ? (
        <div className="card text-center" style={{ padding: '60px 20px' }}>
          <span style={{ fontSize: '3rem' }}>🎁💤</span>
          <h4 style={{ marginTop: '15px' }}>No active deals!</h4>
          <p className="subtitle">All products are listed at standard pricing today. Check back later!</p>
        </div>
      ) : (
        <div className="grid-responsive">
          {discountProducts.map((product) => {
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
                  <span className="badge badge-success" style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'var(--secondary)', color: 'white', border: 'none' }}>
                    Save {product.discount}%
                  </span>
                </div>
                <div className="product-card-body">
                  <span className="product-tag">{product.category}</span>
                  <Link to={`/product/${product.id}`}>
                    <h4 className="product-card-title">{product.name}</h4>
                  </Link>
                  <div className="product-card-footer">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="price-val" style={{ color: 'var(--secondary)' }}>${finalPrice.toFixed(2)}</span>
                      <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>${product.price.toFixed(2)}</span>
                    </div>
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
