import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { Star, Heart, ShoppingBag, Eye, MapPin, Mail, MessageSquare, Plus } from 'lucide-react';

export default function Shop() {
  const { shopId } = useParams();
  const { 
    shops, products, followShop, followedShops, addToCart, toggleWishlist, wishlist 
  } = useMarketplace();

  const shop = shops.find(s => s.id === shopId);

  if (!shop) {
    return (
      <div className="container not-found-container card">
        <h3>Oops! Shop not found. 🎪</h3>
        <p>This seller shop does not exist or has been removed.</p>
        <Link to="/" className="btn btn-primary">Go Back Home</Link>
      </div>
    );
  }

  // Filter products owned by this shop and not hidden
  const shopProducts = products.filter(p => p.shopId === shopId && !p.hidden);
  const isFollowing = followedShops.includes(shopId);

  return (
    <div className="shop-page-wrapper">
      
      {/* 1. Banner */}
      <div className="shop-banner-container">
        <img src={shop.banner} alt="" className="shop-banner-image" />
        <div className="shop-banner-overlay" />
      </div>

      {/* 2. Shop Header / Info */}
      <div className="container shop-header-container">
        <div className="shop-profile-card card">
          <div className="profile-top-row">
            <img src={shop.logo} alt={shop.name} className="shop-profile-logo" />
            <div className="shop-profile-details">
              <h2>{shop.name}</h2>
              <span className="badge badge-secondary">{shop.category}</span>
              <p className="shop-profile-desc">{shop.description}</p>
              
              <div className="shop-profile-meta">
                <div className="rating-badge">
                  <Star size={14} className="star-filled" />
                  <span>{shop.rating || '5.0'} Rating</span>
                </div>
                <span>•</span>
                <span><strong>{shop.followers}</strong> Followers</span>
              </div>
            </div>
            
            <div className="profile-actions">
              <button 
                onClick={() => followShop(shop.id)} 
                className={`btn ${isFollowing ? 'btn-outline' : 'btn-primary'}`}
              >
                {isFollowing ? 'Following Shop' : 'Follow Shop'}
              </button>
              <Link to="/chat" className="btn btn-outline">
                <MessageSquare size={16} /> Contact Seller
              </Link>
            </div>
          </div>

          <hr className="divider" style={{ margin: '20px 0' }} />

          {/* Shop contact info */}
          <div className="shop-contact-info-grid">
            <div className="contact-item-row">
              <MapPin size={16} className="contact-icon" />
              <span>{shop.address || 'Cloud Town'}</span>
            </div>
            <div className="contact-item-row">
              <Mail size={16} className="contact-icon" />
              <span>{shop.contact || 'contact@shop.com'}</span>
            </div>
            {shop.social && Object.keys(shop.social).length > 0 && (
              <div className="contact-item-row">
                <span className="contact-icon">📲</span>
                <span>
                  {Object.entries(shop.social).map(([platform, handle]) => `${platform}: ${handle}`).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Products Grid */}
      <div className="container shop-products-container">
        <div className="shop-section-header">
          <h3>Product Catalog</h3>
          <p>Handmade by {shop.name}</p>
        </div>

        {shopProducts.length === 0 ? (
          <div className="no-products-card card">
            <h3>No products posted yet! 🧸</h3>
            <p>This maker is currently designing new cute creations. Check back soon!</p>
          </div>
        ) : (
          <div className="grid-responsive">
            {shopProducts.map(product => {
              const discPrice = product.price * (1 - (product.discount || 0) / 100);
              const isWishlisted = wishlist.includes(product.id);
              
              return (
                <div className="card card-hover product-card" key={product.id}>
                  <Link to={`/product/${product.id}`} className="prod-img-link">
                    <div className="prod-img-wrapper">
                      <img src={product.images[0]} alt={product.name} className="product-image" />
                      {product.discount > 0 && (
                        <span className="discount-tag">-{product.discount}% Off</span>
                      )}
                    </div>
                  </Link>

                  <div className="product-card-body">
                    <span className="product-card-category">{product.category}</span>
                    <Link to={`/product/${product.id}`} className="prod-name-link">
                      <h4 className="product-card-title">{product.name}</h4>
                    </Link>
                    
                    <div className="rating-row-small">
                      <Star size={12} fill="#FFD43B" color="#FFD43B" />
                      <span>{product.rating || '5.0'}</span>
                    </div>

                    <div className="product-card-footer">
                      <div className="price-stack">
                        {product.discount > 0 ? (
                          <>
                            <span className="old-price-small">${product.price.toFixed(2)}</span>
                            <span className="price-val">${discPrice.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="price-val">${product.price.toFixed(2)}</span>
                        )}
                      </div>

                      <div className="footer-actions">
                        <button 
                          onClick={() => toggleWishlist(product.id)}
                          className={`card-action-btn wish-btn ${isWishlisted ? 'active' : ''}`}
                          aria-label="Add to wishlist"
                        >
                          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                        </button>
                        <button 
                          onClick={() => addToCart(product.id, 1)}
                          disabled={product.stock === 0}
                          className="card-action-btn cart-btn"
                          aria-label="Add to cart"
                        >
                          <ShoppingBag size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Shop Reviews */}
      <div className="container shop-reviews-container">
        <div className="shop-section-header">
          <h3>Shop Feedback</h3>
          <p>Direct buyer reviews of {shop.name}</p>
        </div>

        <div className="shop-reviews-list card">
          {shop.reviews && shop.reviews.length === 0 ? (
            <p className="no-reviews-text">No reviews yet for this shop. Be one of their first buyers! ✨</p>
          ) : (
            <ul className="reviews-list">
              {shop.reviews && shop.reviews.map(review => (
                <li key={review.id} className="review-item" style={{ listStyle: 'none' }}>
                  <div className="review-meta">
                    <span className="reviewer-name">{review.buyerName}</span>
                    <span className="review-stars-small" style={{ display: 'inline-flex', gap: '2px', marginLeft: '10px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} fill={i < review.rating ? '#FFD43B' : 'none'} color="#FFD43B" />
                      ))}
                    </span>
                  </div>
                  <p className="review-comment" style={{ marginTop: '6px' }}>"{review.comment}"</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .shop-page-wrapper {
          padding-bottom: 50px;
        }
        .shop-banner-container {
          height: 250px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        .shop-banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .shop-banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.4) 100%);
        }
        .shop-header-container {
          margin-top: -80px;
          position: relative;
          z-index: 10;
          margin-bottom: 40px;
        }
        .shop-profile-card {
          padding: 30px;
          box-shadow: var(--shadow-lg);
          border-color: var(--border-hover);
        }
        .profile-top-row {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .shop-profile-logo {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--bg-card);
          box-shadow: var(--shadow-md);
        }
        .shop-profile-details {
          flex: 1;
        }
        .shop-profile-details h2 {
          font-size: 1.8rem;
          margin-bottom: 4px;
        }
        .shop-profile-desc {
          margin-top: 8px;
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .shop-profile-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: 8px;
        }
        .rating-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 700;
          color: #B27B00;
        }
        .profile-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: stretch;
          min-width: 180px;
        }
        .shop-contact-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          font-size: 0.88rem;
          color: var(--text-secondary);
        }
        .contact-item-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .contact-icon {
          color: var(--primary);
        }
        .shop-products-container {
          margin-bottom: 40px;
        }
        .shop-section-header {
          margin-bottom: 24px;
        }
        .shop-section-header h3 {
          font-size: 1.4rem;
        }
        .shop-section-header p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .shop-reviews-container {
          max-width: 900px;
        }
        .shop-reviews-list {
          padding: 24px;
        }

        /* Responsive Shop Page Overrides */
        @media (max-width: 1024px) {
          .profile-top-row {
            flex-direction: column;
            text-align: center;
          }
          .shop-profile-logo {
            margin: 0 auto;
          }
          .shop-profile-meta {
            justify-content: center;
          }
          .profile-actions {
            width: 100%;
            margin-top: 15px;
          }
          .shop-contact-info-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}} />
    </div>
  );
}
