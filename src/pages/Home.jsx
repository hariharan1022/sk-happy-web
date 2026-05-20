import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, ArrowRight, Star, Heart, 
  ShoppingBag, Sparkles, Percent, Eye, ChevronLeft, ChevronRight 
} from 'lucide-react';

const BANNER_SLIDES = [
  {
    id: 1,
    title: 'Custom Graphic T-Shirts!',
    desc: 'Empower your aesthetic with our organic cotton printed t-shirts and caps. Use code CUTE20 for 20% off!',
    bg: 'linear-gradient(135deg, #FFE3EC 0%, #F1EAFF 100%)',
    textColor: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
    link: '/?category=T-Shirts'
  },
  {
    id: 2,
    title: 'Inspirational Affirmation Posters!',
    desc: 'Decorate your space with brave, strong, and beautiful printed posters.',
    bg: 'linear-gradient(135deg, #FFE8EA 0%, #FFF5F6 100%)',
    textColor: '#FF758F',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&auto=format&fit=crop&q=80',
    link: '/?category=Posters'
  },
  {
    id: 3,
    title: 'Deluxe Birthday Party Kits!',
    desc: 'Everything you need to celebrate. Balloons, banners, party caps & cake toppers.',
    bg: 'linear-gradient(135deg, #EBFDFB 0%, #FFFDF5 100%)',
    textColor: '#4FD1C5',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&auto=format&fit=crop&q=80',
    link: '/?category=Birthday%20Kit'
  }
];

const TESTIMONIALS = [
  { id: 1, name: 'Chloe Watson', text: 'I bought the affirmation poster and a choice happy tee. The packaging was so cute, it felt like opening a gift from a friend! 🌸', stars: 5, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Hiroki Takahashi', text: 'The birthday kit was amazing! Came with high-quality caps, decorations, and balloons that held up great.', stars: 5, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Sana Patel', text: 'I requested a custom print gift hamper for my best friend and the seller made it so special. Highly recommend!', stars: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
];

export default function Home() {
  const { products, shops, addToCart, toggleWishlist, wishlist, recentlyViewed } = useMarketplace();
  const [searchParams, setSearchParams] = useSearchParams();

  // Banner State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Search & Filter state
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';
  const [priceRange, setPriceRange] = useState(50); // Max $50
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('trending'); // trending, low-to-high, high-to-low

  // Auto-play Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Smooth scroll helper
  useEffect(() => {
    const scrollTarget = searchParams.get('scroll');
    if (scrollTarget === 'categories') {
      setTimeout(() => {
        document.querySelector('.categories-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    } else if (scrollTarget === 'shops') {
      setTimeout(() => {
        document.querySelector('.shops-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
  }, [searchParams]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  };

  const selectCategory = (cat) => {
    if (categoryQuery === cat) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const selectedFilter = searchParams.get('filter') || 'all';

  // Filter Products
  const filteredProducts = products.filter(product => {
    if (product.hidden) return false;
    
    // Category check
    if (categoryQuery && product.category !== categoryQuery) return false;

    // Offers & Deals check
    if (selectedFilter === 'offers' && !(product.discount > 0)) return false;
    
    // Search check
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const inName = product.name.toLowerCase().includes(query);
      const inDesc = product.description.toLowerCase().includes(query);
      const inTags = product.tags.some(tag => tag.toLowerCase().includes(query));
      if (!inName && !inDesc && !inTags) return false;
    }
    
    // Price check
    const finalPrice = product.price * (1 - (product.discount || 0) / 100);
    if (finalPrice > priceRange) return false;

    // Rating check
    if (product.rating < minRating) return false;

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedFilter === 'trending') return b.rating - a.rating;
    if (selectedFilter === 'best-sellers') return b.rating * (b.stock || 1) - a.rating * (a.stock || 1);

    const priceA = a.price * (1 - (a.discount || 0) / 100);
    const priceB = b.price * (1 - (b.discount || 0) / 100);

    if (sortBy === 'low-to-high') return priceA - priceB;
    if (sortBy === 'high-to-low') return priceB - priceA;
    return b.rating - a.rating; // Default
  });

  // Flash Sale products (discount > 0)
  const flashSaleProducts = products.filter(p => p.discount > 0 && !p.hidden).slice(0, 4);

  // Recently Viewed products list
  const recentProductsList = products.filter(p => recentlyViewed.includes(p.id));

  // Approved shops
  const approvedShops = shops.filter(s => s.status === 'approved').slice(0, 3);

  return (
    <div className="home-container">
      
      {/* 1. Hero Section */}
      <section className="hero-section container">
        <div className="hero-content-wrapper">
          <div className="hero-text-block">
            <span className="hero-badge badge badge-primary"><Sparkles size={14} /> Cute & Premium Marketplace</span>
            <h1>Where Happy Little Crafts Find Happy Homes</h1>
            <p>Discover kawaii stationery, fuzzy handmade plushies, aesthetic tea mugs, and sweet accessories from small independent shops.</p>
            <div className="hero-cta-buttons">
              <a href="#products-grid-anchor" className="btn btn-primary btn-lg">Shop Cute Things <ArrowRight size={18} /></a>
              <Link to="/auth?mode=signup&role=seller" className="btn btn-outline btn-lg">Open Your Shop</Link>
            </div>
          </div>
          <div className="hero-art-block">
            <div className="glass-bubble bounce">🐰</div>
            <div className="glass-bubble bubble-purple bounce" style={{ animationDelay: '0.5s' }}>🧁</div>
            <div className="glass-bubble bubble-mint bounce" style={{ animationDelay: '1s' }}>🌸</div>
            <img src="https://images.unsplash.com/photo-1559251606-c623743a6d76?w=600&auto=format&fit=crop&q=80" alt="Plushies" className="hero-main-img" />
          </div>
        </div>
      </section>

      {/* 2. Banner Slider */}
      <section className="banner-slider-section container">
        <div className="slider-wrapper" style={{ background: BANNER_SLIDES[currentSlide].bg }}>
          <button className="slider-nav-btn prev" onClick={handlePrevSlide} aria-label="Previous Slide">
            <ChevronLeft size={24} />
          </button>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="slide-content"
            >
              <div className="slide-text">
                <span className="slide-tag" style={{ color: BANNER_SLIDES[currentSlide].textColor }}>Promo Code inside! 🌸</span>
                <h2 style={{ color: BANNER_SLIDES[currentSlide].textColor }}>{BANNER_SLIDES[currentSlide].title}</h2>
                <p>{BANNER_SLIDES[currentSlide].desc}</p>
                <Link to={BANNER_SLIDES[currentSlide].link} className="btn btn-primary" style={{ background: BANNER_SLIDES[currentSlide].textColor }}>
                  Explore Now
                </Link>
              </div>
              <img src={BANNER_SLIDES[currentSlide].image} alt="" className="slide-image" />
            </motion.div>
          </AnimatePresence>

          <button className="slider-nav-btn next" onClick={handleNextSlide} aria-label="Next Slide">
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="slider-dots">
            {BANNER_SLIDES.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`slider-dot ${currentSlide === idx ? 'active' : ''}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Categories Circles */}
      <section className="categories-section container">
        <div className="section-header">
          <h2>Shop by Categories</h2>
          <p>Find your happiness in our carefully curated items</p>
        </div>
        <div className="categories-grid">
          {[
            { name: 'T-Shirts', emoji: '👕' },
            { name: 'Gifts', emoji: '🎁' },
            { name: 'Posters', emoji: '🖼️' },
            { name: 'Birthday Kit', emoji: '🎂' },
            { name: 'Caps', emoji: '🧢' }
          ].map(cat => {
            const isActive = categoryQuery === cat.name;
            return (
              <button 
                key={cat.name} 
                onClick={() => selectCategory(cat.name)}
                className={`category-circle-card ${isActive ? 'active' : ''}`}
              >
                <span className="category-emoji">{cat.emoji}</span>
                <span className="category-name">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Flash Sale Countdown */}
      {flashSaleProducts.length > 0 && (
        <section className="flash-sale-section container">
          <div className="flash-sale-banner card gradient-bg">
            <div className="flash-left">
              <span className="flash-badge"><Percent size={14} /> Flash Sale</span>
              <h2>Sweet Limited Discounts!</h2>
              <p>Grab these handmade goods at special markdown rates. Ends in: <strong>03h 42m 12s</strong></p>
            </div>
            <div className="flash-grid">
              {flashSaleProducts.map(prod => {
                const discPrice = prod.price * (1 - prod.discount / 100);
                return (
                  <Link to={`/product/${prod.id}`} key={prod.id} className="flash-item card">
                    <img src={prod.images[0]} alt={prod.name} className="flash-img" />
                    <div className="flash-details">
                      <h4 className="flash-title">{prod.name}</h4>
                      <div className="flash-price-row">
                        <span className="flash-old-price">${prod.price.toFixed(2)}</span>
                        <span className="flash-new-price">${discPrice.toFixed(2)}</span>
                      </div>
                      <span className="flash-off-badge">-{prod.discount}% Off</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. Trending / Product Catalog Anchor */}
      <div id="products-grid-anchor" />
      <section className="catalog-section container">
        <div className="catalog-header section-header">
          <h2>Trending Cute Delights</h2>
          <p>Handpicked, high-quality, and absolutely adorable things</p>
        </div>

        {/* Filter Controls Bar */}
        <div className="catalog-controls card">
          <div className="search-status-bar">
            {searchQuery && (
              <p className="search-result-text">
                Search results for: <strong>"{searchQuery}"</strong> ({sortedProducts.length} items found)
              </p>
            )}
            {categoryQuery && (
              <p className="search-result-text">
                Category: <strong>{categoryQuery}</strong>
              </p>
            )}
            {!searchQuery && !categoryQuery && <p className="search-result-text">All Items ({sortedProducts.length})</p>}
          </div>

          <div className="controls-actions">
            <button onClick={() => setShowFilters(!showFilters)} className="btn btn-outline filter-toggle-btn">
              <SlidersHorizontal size={16} /> Filters
            </button>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="sort-dropdown form-control"
              aria-label="Sort products by"
            >
              <option value="trending">🔥 Trending</option>
              <option value="low-to-high">💰 Price: Low to High</option>
              <option value="high-to-low">💎 Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Expandable Filter Drawer */}
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="filter-drawer card"
          >
            <div className="filter-grid-layout">
              <div className="filter-group">
                <span className="filter-label">Max Price: ${priceRange}</span>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  value={priceRange} 
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="price-slider"
                  aria-label="Maximum Price Limit"
                />
              </div>

              <div className="filter-group">
                <span className="filter-label">Min Rating</span>
                <div className="rating-select-buttons">
                  {[0, 3, 4, 4.5].map(rating => (
                    <button 
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`filter-rating-btn ${minRating === rating ? 'active' : ''}`}
                    >
                      {rating === 0 ? 'All' : `${rating}★ & up`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-reset-col">
                <button 
                  onClick={() => {
                    setPriceRange(50);
                    setMinRating(0);
                    setSearchParams({});
                  }} 
                  className="btn btn-ghost"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Product Cards Grid */}
        {sortedProducts.length === 0 ? (
          <div className="no-products-card card">
            <h3>No products found! 🐰</h3>
            <p>Try resetting filters or search keywords to find happy little items.</p>
            <button 
              onClick={() => {
                setSearchParams({});
                setPriceRange(50);
                setMinRating(0);
              }} 
              className="btn btn-primary"
            >
              Reset All
            </button>
          </div>
        ) : (
          <div className="grid-responsive catalog-grid">
            {sortedProducts.map(product => {
              const discPrice = product.price * (1 - (product.discount || 0) / 100);
              const isWishlisted = wishlist.includes(product.id);
              
              return (
                <div className="card card-hover product-card" key={product.id}>
                  {/* Image */}
                  <Link to={`/product/${product.id}`} className="prod-img-link">
                    <div className="prod-img-wrapper">
                      <img src={product.images[0]} alt={product.name} className="product-image" loading="lazy" />
                      {product.discount > 0 && (
                        <span className="discount-tag">-{product.discount}% Off</span>
                      )}
                    </div>
                  </Link>

                  {/* Body */}
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
      </section>

      {/* 6. Popular Maker Shops */}
      <section className="popular-shops-section container">
        <div className="section-header">
          <h2>Featured Maker Shops</h2>
          <p>Meet the creative designers behind these cute products</p>
        </div>
        <div className="shops-list-grid">
          {approvedShops.map(shop => (
            <div key={shop.id} className="card card-hover shop-mini-card">
              <img src={shop.banner} alt="" className="shop-banner-bg" />
              <div className="shop-mini-body">
                <img src={shop.logo} alt={shop.name} className="shop-mini-logo" />
                <Link to={`/shop/${shop.id}`}><h4>{shop.name}</h4></Link>
                <p className="shop-mini-desc">{shop.description}</p>
                <div className="shop-mini-meta">
                  <span>⭐ {shop.rating}</span>
                  <span>•</span>
                  <span>👥 {shop.followers} Followers</span>
                </div>
                <Link to={`/shop/${shop.id}`} className="btn btn-outline shop-mini-btn">Visit Shop</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Customer Reviews Grid */}
      <section className="customer-reviews-section container">
        <div className="section-header">
          <h2>Loved by Cute Collectors</h2>
          <p>What our happy buyers have to say about their little treats</p>
        </div>
        <div className="grid-cols-3 testimonials-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="card testimonial-card">
              <div className="testimonial-header">
                <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                <div>
                  <h5>{t.name}</h5>
                  <div className="review-stars-small">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={12} fill="#FFD43B" color="#FFD43B" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="testimonial-text">"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Recently Viewed Section */}
      {recentProductsList.length > 0 && (
        <section className="recently-viewed-section container">
          <div className="section-header">
            <h2>Your Recently Viewed Items</h2>
            <p>Pick up right where you left off</p>
          </div>
          <div className="recent-items-grid">
            {recentProductsList.map(prod => (
              <Link to={`/product/${prod.id}`} key={prod.id} className="recent-item-card card card-hover">
                <img src={prod.images[0]} alt={prod.name} className="recent-img" />
                <h4>{prod.name}</h4>
                <span className="recent-price">${prod.price.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .home-container {
          padding-bottom: 50px;
        }
        .hero-section {
          background: linear-gradient(135deg, rgba(255, 240, 243, 0.7) 0%, rgba(243, 235, 255, 0.7) 50%, rgba(230, 247, 255, 0.7) 100%);
          border-radius: var(--border-radius-lg);
          padding: 60px 50px;
          margin-top: 30px;
          margin-bottom: 50px;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 15px 45px rgba(255, 117, 143, 0.08);
          position: relative;
          overflow: hidden;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          top: -30%;
          left: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(255, 182, 193, 0.35) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .hero-section::after {
          content: '';
          position: absolute;
          bottom: -30%;
          right: -20%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .hero-content-wrapper {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          align-items: center;
          gap: 40px;
          position: relative;
          z-index: 1;
        }
        .hero-text-block h1 {
          font-size: 3.5rem;
          line-height: 1.15;
          margin: 18px 0;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-text-block p {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.65;
          margin-bottom: 35px;
        }
        .hero-badge {
          box-shadow: 0 4px 15px rgba(255, 117, 143, 0.2);
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .hero-cta-buttons {
          display: flex;
          gap: 15px;
        }
        .btn-lg {
          padding: 12px 28px;
          font-size: 1.05rem;
        }
        .hero-art-block {
          position: relative;
          display: flex;
          justify-content: center;
        }
        .hero-main-img {
          width: 85%;
          aspect-ratio: 1;
          object-fit: cover;
          border-radius: 50%;
          border: 8px solid var(--bg-card);
          box-shadow: var(--shadow-lg);
          z-index: 1;
          animation: float 6s ease-in-out infinite;
        }
        .glass-bubble {
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          z-index: 2;
          top: 10%;
          left: 5%;
        }
        .bubble-purple {
          top: 60%;
          left: 85%;
          background: rgba(167, 139, 250, 0.2);
        }
        .bubble-mint {
          top: 80%;
          left: 10%;
          background: rgba(79, 209, 197, 0.2);
        }

        /* Banner Slider Styles */
        .banner-slider-section {
          margin-bottom: 50px;
        }
        .slider-wrapper {
          position: relative;
          height: 280px;
          border-radius: var(--border-radius-lg);
          padding: 40px 60px;
          display: flex;
          align-items: center;
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }
        .slide-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 100%;
        }
        .slide-text {
          max-width: 50%;
        }
        .slide-tag {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
        }
        .slide-text h2 {
          font-size: 2rem;
          margin: 8px 0;
        }
        .slide-text p {
          color: var(--text-secondary);
          margin-bottom: 20px;
          font-size: 0.95rem;
        }
        .slide-image {
          width: 250px;
          height: 180px;
          object-fit: cover;
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-sm);
        }
        .slider-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.6);
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          z-index: 3;
          color: var(--text-primary);
        }
        .slider-nav-btn:hover {
          background: #fff;
          transform: translateY(-50%) scale(1.1);
        }
        .slider-nav-btn.prev { left: 15px; }
        .slider-nav-btn.next { right: 15px; }
        
        .slider-dots {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }
        .slider-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.15);
          border: none;
          cursor: pointer;
        }
        .slider-dot.active {
          background: var(--primary);
          width: 20px;
          border-radius: 4px;
        }

        /* Categories Section Styles */
        .categories-section {
          margin-bottom: 60px;
        }
        .section-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .section-header h2 {
          font-size: 2rem;
          margin-bottom: 8px;
        }
        .section-header p {
          color: var(--text-muted);
        }
        .categories-grid {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        .category-circle-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-lg);
          padding: 16px 28px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all var(--transition-normal);
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1rem;
          color: var(--text-secondary);
        }
        .category-circle-card:hover {
          transform: translateY(-3px);
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-light);
        }
        .category-circle-card.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: var(--shadow-glow);
        }
        .category-emoji {
          font-size: 1.5rem;
        }

        /* Flash Sale Section */
        .flash-sale-section {
          margin-bottom: 60px;
        }
        .flash-sale-banner {
          display: grid;
          grid-template-columns: 1fr 2.5fr;
          align-items: center;
          gap: 30px;
          padding: 30px;
        }
        .flash-left {
          color: white;
        }
        .flash-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .flash-left h2 {
          color: white;
          font-size: 1.8rem;
          margin: 10px 0;
        }
        .flash-left p {
          font-size: 0.9rem;
          opacity: 0.9;
        }
        .flash-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .flash-item {
          padding: 10px;
          background: var(--bg-card);
          border: none;
          border-radius: var(--border-radius-sm);
        }
        .flash-img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          border-radius: var(--border-radius-xs);
        }
        .flash-details {
          margin-top: 8px;
          position: relative;
        }
        .flash-title {
          font-size: 0.85rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--text-primary);
        }
        .flash-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }
        .flash-old-price {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-decoration: line-through;
        }
        .flash-new-price {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--primary);
        }
        .flash-off-badge {
          position: absolute;
          top: -30px;
          right: 0;
          background: #EF4444;
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* Catalog Catalog Styles */
        .catalog-section {
          margin-bottom: 60px;
        }
        .catalog-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          margin-bottom: 25px;
        }
        .search-result-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .controls-actions {
          display: flex;
          gap: 12px;
        }
        .filter-toggle-btn {
          padding: 8px 16px;
        }
        .sort-dropdown {
          width: 180px;
          padding: 8px 12px;
          margin-bottom: 0;
          border-radius: var(--border-radius-sm);
        }
        
        /* Filter Drawer */
        .filter-drawer {
          margin-bottom: 25px;
          padding: 20px;
        }
        .filter-grid-layout {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          align-items: center;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .filter-label {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .price-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 5px;
          background: var(--border-color);
          outline: none;
        }
        .price-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
          transition: background 0.15s;
        }
        .rating-select-buttons {
          display: flex;
          gap: 8px;
        }
        .filter-rating-btn {
          padding: 6px 12px;
          border-radius: var(--border-radius-xs);
          border: 1px solid var(--border-color);
          background: var(--bg-input);
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .filter-rating-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .filter-reset-col {
          display: flex;
          justify-content: flex-end;
        }

        .no-products-card {
          text-align: center;
          padding: 50px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        /* Product Cards custom */
        .product-card {
          padding: 12px;
        }
        .prod-img-link {
          display: block;
        }
        .prod-img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          border-radius: var(--border-radius-sm);
          background: #F8F9FA;
        }
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-normal);
        }
        .product-card:hover .product-image {
          transform: scale(1.06);
        }
        .discount-tag {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #EF4444;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 9999px;
        }
        .product-card-body {
          margin-top: 12px;
        }
        .product-card-category {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 700;
        }
        .prod-name-link:hover h4 {
          color: var(--primary);
        }
        .product-card-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 4px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 2.4rem;
        }
        .rating-row-small {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
          margin-bottom: 8px;
        }
        .product-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .price-stack {
          display: flex;
          flex-direction: column;
        }
        .old-price-small {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-decoration: line-through;
          line-height: 1;
        }
        .price-val {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--primary);
        }
        .footer-actions {
          display: flex;
          gap: 6px;
        }
        .card-action-btn {
          border: none;
          background: var(--bg-app);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        .card-action-btn:hover {
          background: var(--primary-light);
          color: var(--primary);
        }
        .wish-btn.active {
          color: var(--primary);
          background: var(--primary-light);
        }

        /* Shops list mini cards */
        .popular-shops-section {
          margin-bottom: 60px;
        }
        .shops-list-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .shop-mini-card {
          padding: 0;
          text-align: center;
          overflow: hidden;
        }
        .shop-banner-bg {
          height: 100px;
          width: 100%;
          object-fit: cover;
        }
        .shop-mini-body {
          padding: 0 20px 20px;
          position: relative;
        }
        .shop-mini-logo {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--bg-card);
          margin: -32px auto 8px;
          display: block;
          box-shadow: var(--shadow-sm);
        }
        .shop-mini-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 6px 0 12px;
          height: 2.6rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .shop-mini-meta {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 16px;
        }
        .shop-mini-btn {
          width: 100%;
        }

        /* Customer reviews section */
        .customer-reviews-section {
          margin-bottom: 60px;
        }
        .testimonial-card {
          padding: 24px;
        }
        .testimonial-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .testimonial-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .review-stars-small {
          display: flex;
          gap: 2px;
        }
        .testimonial-text {
          font-size: 0.9rem;
          line-height: 1.5;
          font-style: italic;
          color: var(--text-secondary);
        }

        /* Recently viewed section */
        .recently-viewed-section {
          margin-bottom: 40px;
        }
        .recent-items-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }
        .recent-item-card {
          padding: 10px;
          text-align: center;
        }
        .recent-img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          border-radius: var(--border-radius-xs);
          margin-bottom: 8px;
        }
        .recent-item-card h4 {
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .recent-price {
          font-size: 0.8rem;
          color: var(--primary);
          font-weight: bold;
        }

        /* Responsive Home Page overrides */
        @media (max-width: 1024px) {
          .hero-content-wrapper {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-badge {
            display: inline-flex;
            margin: 0 auto 15px;
          }
          .hero-cta-buttons {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin: 0 auto;
          }
          .hero-text-block h1 {
            font-size: 2.5rem;
          }
          .hero-art-block {
            order: -1;
            margin-bottom: 20px;
          }
          .hero-main-img {
            max-width: 320px;
            margin: 0 auto;
          }
          .slider-wrapper {
            height: auto;
            padding: 30px;
          }
          .slide-content {
            flex-direction: column;
            gap: 20px;
          }
          .slide-text {
            max-width: 100%;
            text-align: center;
          }
          .slide-image {
            width: 100%;
            height: 150px;
          }
          .flash-sale-banner {
            grid-template-columns: 1fr;
            padding: 20px;
          }
          .shops-list-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .home-container {
            overflow-x: hidden;
          .hero-section {
            padding: 35px 20px;
            margin-top: 15px;
            margin-bottom: 30px;
            border-radius: var(--border-radius-md);
            overflow: hidden;
          }
          .glass-bubble {
            width: 45px;
            height: 45px;
            font-size: 1.4rem;
          }
          .hero-text-block h1 {
            font-size: 2rem;
          }
          .hero-text-block p {
            font-size: 0.95rem;
            margin-bottom: 20px;
          }
          .hero-cta-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 280px;
          }
          .hero-cta-buttons .btn {
            width: 100%;
            text-align: center;
          }
          
          /* Horizontal Swiping Right to Left Scroll Styles */
          .catalog-grid, .flash-grid, .recent-items-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            gap: 16px;
            padding: 10px 5px 20px 5px !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
            scrollbar-color: var(--primary-light) transparent;
          }
          .catalog-grid::-webkit-scrollbar, 
          .flash-grid::-webkit-scrollbar, 
          .recent-items-grid::-webkit-scrollbar {
            height: 6px;
          }
          .catalog-grid::-webkit-scrollbar-thumb,
          .flash-grid::-webkit-scrollbar-thumb,
          .recent-items-grid::-webkit-scrollbar-thumb {
            background-color: var(--primary-light);
            border-radius: 99px;
          }
          
          /* Flex card sizing for swiping */
          .catalog-grid .product-card,
          .flash-grid .flash-item,
          .recent-items-grid .recent-item-card {
            flex: 0 0 230px !important;
            max-width: 230px !important;
            scroll-snap-align: start;
            margin-bottom: 0 !important;
          }
          
          .flash-off-badge {
            top: -24px;
            font-size: 0.65rem;
          }
          
          .categories-grid {
            gap: 10px;
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 10px;
            -webkit-overflow-scrolling: touch;
          }
          .categories-grid::-webkit-scrollbar {
            height: 4px;
          }
          .category-circle-card {
            flex: 0 0 auto;
            padding: 8px 16px;
            font-size: 0.85rem;
          }
          
          .catalog-controls {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }
          .filter-grid-layout {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          .shops-list-grid {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </div>
  );
}
