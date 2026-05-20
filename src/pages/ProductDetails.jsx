import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Star, ShoppingBag, Heart, ShieldAlert, Award, 
  Truck, CornerUpLeft, Plus, Minus, Send, MessageSquare 
} from 'lucide-react';

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { 
    products, shops, currentUser, addToCart, toggleWishlist, 
    wishlist, addRecentlyViewed, followShop, followedShops, addReview 
  } = useMarketplace();

  const [activeImage, setActiveImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const product = products.find(p => p.id === productId);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      if (product.images && product.images.length > 0) {
        setActiveImage(product.images[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      // Reset qty
      setQuantity(1);
      
      // Scroll to top
      window.scrollTo(0, 0);
    }
  }, [productId, product]);

  if (!product) {
    return (
      <div className="container not-found-container card">
        <h3>Oops! Product not found. 🧸</h3>
        <p>It looks like this cute little thing is hiding somewhere else.</p>
        <Link to="/" className="btn btn-primary">Go Back Home</Link>
      </div>
    );
  }

  const shop = shops.find(s => s.id === product.shopId);
  const isWishlisted = wishlist.includes(product.id);
  const isFollowingShop = followedShops.includes(product.shopId);

  // AI recommendations (products in the same category, excluding the current one)
  const recommendations = products
    .filter(p => p.category === product.category && p.id !== product.id && !p.hidden)
    .slice(0, 3);

  const matchingVariant = product.variants?.find(v => 
    (!v.size || v.size === selectedSize) && 
    (!v.color || v.color === selectedColor)
  );
  const displayPrice = matchingVariant ? Number(matchingVariant.price) : product.price;
  const discountedPrice = displayPrice * (1 - (product.discount || 0) / 100);

  const handleQtyChange = (val) => {
    const newQty = quantity + val;
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
    const success = addToCart(product.id, quantity, selectedColor, selectedSize);
    if (success) {
      navigate('/checkout?step=shipping');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    if (!reviewComment.trim()) return;

    addReview(product.id, reviewRating, reviewComment);
    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <div className="container details-page-container">
      
      {/* Product Details Section */}
      <div className="product-details-grid card">
        
        {/* Left Side: Images & Video */}
        <div className="details-images-col">
          <div className="main-image-wrapper" style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', aspectRatio: '1', background: '#F8F9FA', border: '1px solid var(--border-color)' }}>
            {activeImage && (activeImage.startsWith('data:video/') || activeImage.endsWith('.mp4') || activeImage.includes('/video/') || activeImage === product.video) ? (
              <video 
                src={activeImage} 
                controls 
                autoPlay 
                muted 
                loop 
                className="main-image" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <img src={activeImage} alt={product.name} className="main-image" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            )}
            {product.discount > 0 && (
              <span className="details-discount-badge">-{product.discount}% Off</span>
            )}
          </div>
          
          <div className="thumbnails-grid" style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
            {product.images && product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(img)}
                className={`thumbnail-btn ${activeImage === img ? 'active' : ''}`}
                style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', padding: 0, border: activeImage === img ? '2px solid var(--primary)' : '1px solid var(--border-color)' }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
            {product.video && (
              <button 
                onClick={() => setActiveImage(product.video)}
                className={`thumbnail-btn video-thumb-btn ${activeImage === product.video ? 'active' : ''}`}
                style={{ 
                  width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', padding: 0,
                  position: 'relative', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: activeImage === product.video ? '2px solid var(--primary)' : '1px solid var(--border-color)'
                }}
              >
                {product.video.startsWith('data:') ? (
                  <video src={product.video} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#333', opacity: 0.8 }} />
                )}
                <span style={{ position: 'absolute', fontSize: '1.2rem', color: 'white', zIndex: 1 }}>🎥</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="details-info-col">
          <div className="details-header">
            <h1 className="product-title">{product.name}</h1>
            <div className="rating-row">
              <div className="stars-badge">
                <Star size={16} className="star-filled" />
                <span>{product.rating || '5.0'}</span>
              </div>
              <span className="reviews-count">({product.reviews.length} customer reviews)</span>
            </div>
            {(product.shortDescription || product.shortDesc) && (
              <p className="product-short-description" style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontStyle: 'italic', margin: '8px 0 15px' }}>
                {product.shortDescription || product.shortDesc}
              </p>
            )}
          </div>

          {/* Pricing Block */}
          <div className="pricing-box">
            {product.discount > 0 ? (
              <div className="discounted-price-row">
                <span className="old-price">{product.currency || '$'}{displayPrice.toFixed(2)}</span>
                <span className="current-price">{product.currency || '$'}{discountedPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="current-price">{product.currency || '$'}{displayPrice.toFixed(2)}</span>
            )}
            
            <div className="stock-status">
              {product.stock > 0 ? (
                product.stock <= 5 ? (
                  <span className="badge badge-warning">Only {product.stock} items left in stock!</span>
                ) : (
                  <span className="badge badge-success">In Stock ({product.stock} available)</span>
                )
              ) : (
                <span className="badge badge-danger" style={{ background: '#FEE2E2', color: '#EF4444' }}>Out of Stock</span>
              )}
            </div>
          </div>

          <p className="product-description" style={{ lineHeight: '1.6', color: 'var(--text-main)' }}>{product.description}</p>

          {product.tags && product.tags.length > 0 && (
            <div className="product-tags-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '15px 0' }}>
              {product.tags.map((tag, idx) => (
                <span key={idx} className="badge badge-primary-light" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          <hr className="divider" />

          {/* Selectors */}
          <div className="selectors-box">
            {product.colors && product.colors.length > 0 && (
              <div className="selector-group">
                <span className="selector-label">Color:</span>
                <div className="options-row">
                  {product.colors.map(color => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`option-btn ${selectedColor === color ? 'active' : ''}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="selector-group">
                <span className="selector-label">Size:</span>
                <div className="options-row">
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`option-btn ${selectedSize === size ? 'active' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="selector-group">
              <span className="selector-label">Quantity:</span>
              <div className="quantity-selector">
                <button onClick={() => handleQtyChange(-1)} disabled={quantity <= 1 || product.stock === 0} className="qty-btn">
                  <Minus size={14} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button onClick={() => handleQtyChange(1)} disabled={quantity >= product.stock || product.stock === 0} className="qty-btn">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="action-buttons-row">
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-primary action-btn"
            >
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="btn btn-secondary action-btn"
            >
              Buy It Now
            </button>
            <button 
              onClick={() => toggleWishlist(product.id)}
              className={`btn btn-outline fav-btn ${isWishlisted ? 'active' : ''}`}
              aria-label="Toggle Wishlist"
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Delivery & Protection */}
          <div className="delivery-card">
            <div className="delivery-row">
              <Truck size={20} className="icon-blue" />
              <div>
                <h5>Fast Delivery Details</h5>
                <p>{product.deliveryDetails}</p>
              </div>
            </div>
            <div className="delivery-row">
              <CornerUpLeft size={20} className="icon-orange" />
              <div>
                <h5>Hassle-Free Returns</h5>
                <p>{product.returnPolicy}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Shop Info Block */}
      {shop && (
        <div className="shop-preview-card card">
          <div className="shop-preview-left">
            <img src={shop.logo} alt={shop.name} className="shop-logo" />
            <div>
              <Link to={`/shop/${shop.id}`} className="shop-name-link"><h3>{shop.name}</h3></Link>
              <p className="shop-desc">{shop.description}</p>
              <div className="shop-stats">
                <span>⭐ {shop.rating || '5.0'} Shop Rating</span>
                <span>•</span>
                <span>👥 {shop.followers} Followers</span>
              </div>
            </div>
          </div>
          <div className="shop-preview-right">
            <button 
              onClick={() => followShop(shop.id)} 
              className={`btn ${isFollowingShop ? 'btn-outline' : 'btn-secondary'}`}
            >
              {isFollowingShop ? 'Following' : 'Follow Shop'}
            </button>
            <Link to="/chat" className="btn btn-outline" style={{ display: 'inline-flex', gap: '8px' }}>
              <MessageSquare size={16} /> Chat Seller
            </Link>
          </div>
        </div>
      )}

      {/* Reviews and AI Recommendations Split */}
      <div className="reviews-recommendations-row">
        
        {/* Reviews Section */}
        <div className="details-reviews-section card">
          <h3>Customer Reviews</h3>
          <hr className="divider" />
          
          {/* Add Review Form */}
          <form onSubmit={handleReviewSubmit} className="add-review-form">
            <h4>Add Your Review</h4>
            <div className="rating-select-row">
              <span>Rating:</span>
              <div className="stars-input-row">
                {[1, 2, 3, 4, 5].map(num => (
                  <button 
                    key={num}
                    type="button"
                    onClick={() => setReviewRating(num)}
                    className="star-input-btn"
                  >
                    <Star size={18} fill={num <= reviewRating ? '#FFD43B' : 'none'} color={num <= reviewRating ? '#FFD43B' : '#ADB5BD'} />
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <textarea 
                placeholder="Share your experience with this cute little thing..." 
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="form-control"
                rows={3}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary submit-review-btn">
              Submit Review <Send size={14} />
            </button>
          </form>

          {/* List of Reviews */}
          <ul className="reviews-list">
            {product.reviews.length === 0 ? (
              <p className="no-reviews-text">No reviews yet. Be the first to share your thoughts! 🌸</p>
            ) : (
              product.reviews.map(review => (
                <li key={review.id} className="review-item">
                  <div className="review-meta">
                    <span className="reviewer-name">{review.buyerName}</span>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <div className="review-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < Math.floor(review.rating) ? '#FFD43B' : 'none'} color="#FFD43B" />
                    ))}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* AI Recommendations */}
        <div className="details-recommendations-section card">
          <h3>Cute Recommendations</h3>
          <p className="subtitle">AI matches based on categories</p>
          <hr className="divider" />
          
          <div className="rec-items-column">
            {recommendations.length === 0 ? (
              <p className="no-rec-text">No other items in this category yet. Check back soon! ✨</p>
            ) : (
              recommendations.map(rec => (
                <Link to={`/product/${rec.id}`} key={rec.id} className="rec-item-card">
                  <img src={rec.images[0]} alt={rec.name} className="rec-img" />
                  <div className="rec-details">
                    <h4 className="rec-title">{rec.name}</h4>
                    <span className="rec-price">{rec.currency || '$'}{rec.price.toFixed(2)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .details-page-container {
          padding-top: 20px;
          padding-bottom: 50px;
        }
        .not-found-container {
          text-align: center;
          max-width: 450px;
          margin: 100px auto;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .product-details-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 40px;
          margin-bottom: 30px;
          padding: 30px;
        }
        .details-images-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .main-image-wrapper {
          position: relative;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          background: #F8F9FA;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
        }
        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .main-image:hover {
          transform: scale(1.05);
        }
        .details-discount-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: var(--primary);
          color: white;
          padding: 6px 14px;
          border-radius: 9999px;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.85rem;
          box-shadow: var(--shadow-sm);
        }
        .thumbnails-grid {
          display: flex;
          gap: 12px;
          overflow-x: auto;
        }
        .thumbnail-btn {
          width: 70px;
          height: 70px;
          border-radius: var(--border-radius-xs);
          border: 2px solid var(--border-color);
          overflow: hidden;
          background: #fff;
          cursor: pointer;
          transition: border-color var(--transition-fast);
          padding: 0;
        }
        .thumbnail-btn.active {
          border-color: var(--primary);
        }
        .thumbnail-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .details-info-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .product-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
        }
        .stars-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--accent-yellow-light);
          color: #B27B00;
          padding: 4px 8px;
          border-radius: var(--border-radius-xs);
          font-weight: 700;
          font-size: 0.85rem;
        }
        .star-filled {
          fill: #FFD43B;
          color: #FFD43B;
        }
        .reviews-count {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .pricing-box {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .old-price {
          font-size: 1.3rem;
          color: var(--text-muted);
          text-decoration: line-through;
        }
        .current-price {
          font-size: 2rem;
          font-weight: 800;
          color: var(--primary);
          font-family: var(--font-heading);
        }
        .product-description {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }
        .divider {
          border: 0;
          border-top: 1px solid var(--border-color);
        }
        .selectors-box {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .selector-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .selector-label {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-secondary);
          min-width: 80px;
        }
        .options-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .option-btn {
          border: 1px solid var(--border-color);
          background: var(--bg-input);
          color: var(--text-secondary);
          padding: 6px 14px;
          border-radius: var(--border-radius-xs);
          cursor: pointer;
          font-weight: 500;
          font-size: 0.85rem;
          transition: all var(--transition-fast);
        }
        .option-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .option-btn.active {
          border-color: var(--primary);
          background: var(--primary-light);
          color: var(--primary);
          font-weight: bold;
        }
        .quantity-selector {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-xs);
          overflow: hidden;
          background: var(--bg-input);
        }
        .qty-btn {
          background: transparent;
          border: none;
          width: 32px;
          height: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: background var(--transition-fast);
        }
        .qty-btn:hover {
          background: var(--border-color);
        }
        .qty-value {
          width: 36px;
          text-align: center;
          font-weight: 700;
          font-size: 0.95rem;
        }
        .action-buttons-row {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }
        .action-btn {
          flex: 1;
          padding: 14px;
        }
        .fav-btn {
          width: 50px;
          height: 50px;
          padding: 0;
          border-radius: var(--border-radius-md);
        }
        .fav-btn.active {
          color: #fff;
          background: var(--primary);
          border-color: var(--primary);
          box-shadow: var(--shadow-glow);
        }
        .delivery-card {
          margin-top: 10px;
          padding: 15px;
          background: var(--primary-light);
          border-radius: var(--border-radius-sm);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .delivery-row {
          display: flex;
          gap: 12px;
        }
        .delivery-row h5 {
          font-size: 0.9rem;
          margin-bottom: 2px;
        }
        .delivery-row p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .icon-blue {
          color: #3B82F6;
        }
        .icon-orange {
          color: #F97316;
        }
        .shop-preview-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 20px;
          border-color: var(--border-hover);
        }
        .shop-preview-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .shop-logo {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--border-color);
        }
        .shop-name-link:hover h3 {
          color: var(--primary);
        }
        .shop-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 4px 0;
        }
        .shop-stats {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: flex;
          gap: 8px;
        }
        .shop-preview-right {
          display: flex;
          gap: 10px;
        }
        .reviews-recommendations-row {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 30px;
        }
        .details-reviews-section {
          padding: 30px;
        }
        .add-review-form {
          background: var(--bg-app);
          padding: 20px;
          border-radius: var(--border-radius-sm);
          margin: 20px 0;
        }
        .add-review-form h4 {
          margin-bottom: 12px;
        }
        .rating-select-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          font-weight: 600;
        }
        .stars-input-row {
          display: flex;
          gap: 4px;
        }
        .star-input-btn {
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .submit-review-btn {
          padding: 8px 18px;
          font-size: 0.85rem;
        }
        .reviews-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .review-item {
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border-color);
        }
        .review-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 4px;
        }
        .reviewer-name {
          font-weight: 700;
          color: var(--text-primary);
        }
        .review-stars {
          margin-bottom: 8px;
        }
        .review-comment {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .no-reviews-text {
          font-size: 0.9rem;
          color: var(--text-muted);
          text-align: center;
          padding: 20px 0;
        }
        .details-recommendations-section {
          padding: 30px;
        }
        .rec-items-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        }
        .rec-item-card {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 10px;
          border-radius: var(--border-radius-sm);
          transition: background var(--transition-fast);
        }
        .rec-item-card:hover {
          background: var(--primary-light);
        }
        .rec-img {
          width: 60px;
          height: 60px;
          border-radius: var(--border-radius-xs);
          object-fit: cover;
        }
        .rec-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .rec-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .rec-price {
          font-size: 0.85rem;
          color: var(--primary);
          font-weight: 700;
        }

        /* Detail Responsiveness */
        @media (max-width: 1024px) {
          .product-details-grid {
            grid-template-columns: 1fr;
          }
          .reviews-recommendations-row {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .product-title {
            font-size: 1.8rem;
          }
          .pricing-box {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .action-buttons-row {
            flex-direction: column;
          }
          .fav-btn {
            width: 100%;
          }
          .shop-preview-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .shop-preview-right {
            width: 100%;
          }
          .shop-preview-right button, .shop-preview-right a {
            flex: 1;
            text-align: center;
            justify-content: center;
          }
        }
      `}} />
    </div>
  );
}
