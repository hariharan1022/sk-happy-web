import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { Star, Heart, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }) {
  const { toggleWishlist, wishlist, addToCart } = useMarketplace();

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const discPrice = product.price * (1 - (product.discount || 0) / 100);

  return (
    <div className="card card-hover product-card" key={product.id}>
      {/* Product Image and Discount Tag */}
      <Link to={`/product/${product.id}`} className="prod-img-link">
        <div className="prod-img-wrapper" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--border-radius-md)' }}>
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="product-image" 
            loading="lazy" 
            style={{ width: '100%', height: '220px', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          />
          {product.discount > 0 && (
            <span className="discount-tag" style={{
              position: 'absolute', top: '12px', left: '12px',
              background: 'var(--primary)', color: 'white',
              padding: '4px 10px', borderRadius: '30px',
              fontSize: '0.75rem', fontWeight: '800',
              boxShadow: 'var(--shadow-sm)', zIndex: 2
            }}>
              -{product.discount}% Off
            </span>
          )}
        </div>
      </Link>

      {/* Product Details Body */}
      <div className="product-card-body" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="product-card-category" style={{
            fontSize: '0.75rem', color: 'var(--text-muted)',
            textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em'
          }}>
            {product.category}
          </span>
          <div className="rating-row-small" style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)'
          }}>
            <Star size={12} fill="#FFD43B" color="#FFD43B" />
            <span>{product.rating || '5.0'}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`} className="prod-name-link" style={{ textDecoration: 'none' }}>
          <h4 className="product-card-title" style={{
            fontSize: '0.95rem', margin: '4px 0 0', fontWeight: '700',
            color: 'var(--text-primary)', lineBreak: 'anywhere',
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            height: '40px', lineHeight: '1.3'
          }}>
            {product.name}
          </h4>
        </Link>

        {/* Pricing and Actions Row */}
        <div className="product-card-footer" style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginTop: '10px'
        }}>
          <div className="price-stack" style={{ display: 'flex', flexDirection: 'column' }}>
            {product.discount > 0 ? (
              <>
                <span className="old-price-small" style={{
                  fontSize: '0.75rem', textDecoration: 'line-through',
                  color: 'var(--text-muted)'
                }}>
                  ${product.price.toFixed(2)}
                </span>
                <span className="price-val" style={{
                  fontSize: '1.1rem', fontWeight: '800',
                  color: 'var(--primary)'
                }}>
                  ${discPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="price-val" style={{
                fontSize: '1.1rem', fontWeight: '800',
                color: 'var(--text-primary)'
              }}>
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="footer-actions" style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => toggleWishlist(product.id)}
              className={`card-action-btn wish-btn ${isWishlisted ? 'active' : ''}`}
              aria-label="Add to wishlist"
              style={{
                background: isWishlisted ? 'var(--secondary-light)' : 'var(--bg-app)',
                border: '1px solid ' + (isWishlisted ? 'var(--secondary)' : 'var(--border-color)'),
                color: isWishlisted ? 'var(--secondary)' : 'var(--text-secondary)',
                borderRadius: '50%', width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all var(--transition-fast)'
              }}
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={() => addToCart(product.id, 1)}
              disabled={product.stock === 0}
              className="card-action-btn cart-btn"
              aria-label="Add to cart"
              style={{
                background: 'var(--primary)', border: 'none',
                color: 'white', borderRadius: '50%',
                width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                opacity: product.stock === 0 ? 0.5 : 1,
                transition: 'all var(--transition-fast)'
              }}
            >
              <ShoppingBag size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .product-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          transition: all var(--transition-normal);
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-light);
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .card-action-btn:hover {
          transform: scale(1.1);
        }
        .wish-btn:hover {
          background: var(--secondary-light) !important;
          color: var(--secondary) !important;
          border-color: var(--secondary) !important;
        }
        .cart-btn:hover {
          background: var(--primary-hover) !important;
          box-shadow: 0 4px 10px rgba(255, 117, 143, 0.3);
        }
      `}} />
    </div>
  );
}
