import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { Plus, Store, Sparkles, AlertCircle } from 'lucide-react';

export default function AddProduct() {
  const { 
    currentUser, products, shops, addProduct, updateProduct, showToast 
  } = useMarketplace();
  const navigate = useNavigate();
  const { productId } = useParams();

  const isEditing = !!productId;

  // Product Form states
  const [prodName, setProdName] = useState('');
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodSalePrice, setProdSalePrice] = useState('');
  const [prodDiscount, setProdDiscount] = useState('0');
  const [prodCurrency, setProdCurrency] = useState('$');
  const [prodStock, setProdStock] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodStatus, setProdStatus] = useState('In Stock');
  const [prodCategory, setProdCategory] = useState('T-Shirts');
  const [prodSubcat, setProdSubcat] = useState('');
  const [prodImages, setProdImages] = useState([]);
  const [prodVideo, setProdVideo] = useState('');
  const [prodSizes, setProdSizes] = useState('');
  const [prodColors, setProdColors] = useState('');
  const [prodTags, setProdTags] = useState('');
  const [prodDelivery, setProdDelivery] = useState('Ships in 1-2 business days.');
  const [prodReturn, setProdReturn] = useState('Returns accepted within 7 days.');
  
  // Shipping state
  const [prodWeight, setProdWeight] = useState('');
  const [prodDimensions, setProdDimensions] = useState('');
  const [prodShippingCost, setProdShippingCost] = useState('');
  const [prodShippingCountries, setProdShippingCountries] = useState('Worldwide');
  
  // SEO state
  const [prodMetaTitle, setProdMetaTitle] = useState('');
  const [prodMetaDesc, setProdMetaDesc] = useState('');
  const [prodSlug, setProdSlug] = useState('');
  
  // Variants state
  const [hasVariants, setHasVariants] = useState(false);
  const [prodVariants, setProdVariants] = useState([]);
  
  // Option names & values for variant generator
  const [variantOpt1Name, setVariantOpt1Name] = useState('Size');
  const [variantOpt1Values, setVariantOpt1Values] = useState('S, M, L');
  const [variantOpt2Name, setVariantOpt2Name] = useState('Color');
  const [variantOpt2Values, setVariantOpt2Values] = useState('Red, Black');
  
  // Tab section
  const [formSection, setFormSection] = useState('basic');
  const [isDragging, setIsDragging] = useState(false);

  // Redirect if not logged in or not a seller
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth?role=seller');
      return;
    }
    if (currentUser.role !== 'seller') {
      showToast('Only registered Sellers can access this listing workspace.', 'error');
      navigate('/');
    }
  }, [currentUser, navigate]);

  const sellerShop = shops.find(s => s.sellerId === currentUser?.id);

  // If editing, load product details
  useEffect(() => {
    if (isEditing && products.length > 0) {
      const product = products.find(p => p.id === productId);
      if (product) {
        // Security check: ensure this product belongs to this seller
        if (product.sellerId !== currentUser?.id) {
          showToast('Access denied. You can only edit your own shop products.', 'error');
          navigate('/seller-dashboard');
          return;
        }
        setProdName(product.name);
        setProdShortDesc(product.shortDescription || '');
        setProdDesc(product.description || '');
        setProdPrice(product.price || '');
        setProdDiscount(product.discount !== undefined ? product.discount : '0');
        
        const original = Number(product.price) || 0;
        const discount = Number(product.discount) || 0;
        const sale = discount > 0 ? original * (1 - discount / 100) : original;
        setProdSalePrice(sale.toFixed(2));
        
        setProdCurrency(product.currency || '$');
        setProdStock(product.stock || '');
        setProdSku(product.sku || '');
        setProdStatus(product.status || 'In Stock');
        setProdCategory(product.category || 'T-Shirts');
        setProdSubcat(product.subcategory || '');
        setProdImages(product.images || []);
        setProdVideo(product.video || '');
        setProdSizes(product.sizes ? product.sizes.join(', ') : '');
        setProdColors(product.colors ? product.colors.join(', ') : '');
        setProdTags(product.tags ? product.tags.join(', ') : '');
        setProdDelivery(product.deliveryDetails || '');
        setProdReturn(product.returnPolicy || '');
        
        setProdWeight(product.weight || '');
        setProdDimensions(product.dimensions || '');
        setProdShippingCost(product.shippingCost !== undefined ? product.shippingCost.toString() : '');
        setProdShippingCountries(product.shippingCountries || 'Worldwide');
        
        setProdMetaTitle(product.metaTitle || '');
        setProdMetaDesc(product.metaDescription || '');
        setProdSlug(product.slug || '');
        
        const hasVars = product.variants && product.variants.length > 0;
        setHasVariants(hasVars);
        setProdVariants(product.variants || []);
      }
    }
  }, [productId, products, isEditing, currentUser]);

  // Pricing helper
  const handleOriginalPriceChange = (val) => {
    setProdPrice(val);
    const original = Number(val);
    const discount = Number(prodDiscount);
    if (original > 0 && discount >= 0) {
      const calculatedSale = original * (1 - discount / 100);
      setProdSalePrice(calculatedSale.toFixed(2));
    } else {
      setProdSalePrice(val);
    }
  };

  const handleDiscountChange = (val) => {
    setProdDiscount(val);
    const discount = Number(val);
    const original = Number(prodPrice);
    if (original > 0 && discount >= 0 && discount <= 100) {
      const calculatedSale = original * (1 - discount / 100);
      setProdSalePrice(calculatedSale.toFixed(2));
    }
  };

  // Variants combination generator
  const generateCombinations = () => {
    const opt1Vals = variantOpt1Values.split(',').map(v => v.trim()).filter(Boolean);
    const opt2Vals = variantOpt2Values.split(',').map(v => v.trim()).filter(Boolean);
    
    let combos = [];
    if (opt1Vals.length > 0 && opt2Vals.length > 0) {
      opt1Vals.forEach(v1 => {
        opt2Vals.forEach(v2 => {
          combos.push({
            size: v1,
            color: v2,
            material: 'Standard',
            price: Number(prodPrice) || 0,
            stock: Number(prodStock) || 0,
            sku: `${prodSku || 'SKU'}-${v1}-${v2}`.toUpperCase()
          });
        });
      });
    } else if (opt1Vals.length > 0) {
      opt1Vals.forEach(v1 => {
        combos.push({
          size: v1,
          color: 'Default',
          material: 'Standard',
          price: Number(prodPrice) || 0,
          stock: Number(prodStock) || 0,
          sku: `${prodSku || 'SKU'}-${v1}`.toUpperCase()
        });
      });
    } else if (opt2Vals.length > 0) {
      opt2Vals.forEach(v2 => {
        combos.push({
          size: 'Default',
          color: v2,
          material: 'Standard',
          price: Number(prodPrice) || 0,
          stock: Number(prodStock) || 0,
          sku: `${prodSku || 'SKU'}-${v2}`.toUpperCase()
        });
      });
    }
    
    setProdVariants(combos);
    showToast(`Generated ${combos.length} variant combinations!`, 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sellerShop) {
      showToast('You must activate a maker shop profile inside the dashboard first.', 'error');
      return;
    }

    const imagesArray = Array.isArray(prodImages) ? prodImages.filter(Boolean) : [];
    const sizesArray = prodSizes.split(',').map(s => s.trim()).filter(s => s !== '');
    const colorsArray = prodColors.split(',').map(c => c.trim()).filter(c => c !== '');
    const tagsArray = prodTags.split(',').map(t => t.trim()).filter(t => t !== '');

    const generatedSlug = prodSlug || prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const productData = {
      name: prodName,
      shortDescription: prodShortDesc,
      description: prodDesc,
      price: Number(prodPrice),
      discount: Number(prodDiscount) || 0,
      stock: Number(prodStock),
      category: prodCategory,
      subcategory: prodSubcat,
      images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1559251606-c623743a6d76?w=600&auto=format&fit=crop&q=80'],
      video: prodVideo,
      currency: prodCurrency,
      sku: prodSku,
      status: prodStatus,
      sizes: sizesArray,
      colors: colorsArray,
      tags: tagsArray,
      deliveryDetails: prodDelivery,
      returnPolicy: prodReturn,
      weight: prodWeight,
      dimensions: prodDimensions,
      shippingCost: Number(prodShippingCost) || 0,
      shippingCountries: prodShippingCountries,
      metaTitle: prodMetaTitle || prodName,
      metaDescription: prodMetaDesc || prodShortDesc || prodDesc.slice(0, 150),
      slug: generatedSlug,
      variants: hasVariants ? prodVariants : [],
      shopId: sellerShop.id,
      sellerId: currentUser.id
    };

    if (isEditing) {
      updateProduct(productId, productData);
      showToast('Listing updated successfully!', 'success');
    } else {
      addProduct(productData);
      showToast('New cute listing added successfully!', 'success');
    }

    navigate('/seller-dashboard?tab=products');
  };

  if (!currentUser || currentUser.role !== 'seller') return null;

  return (
    <div className="add-product-page container" style={{ paddingTop: '30px', paddingBottom: '60px', maxWidth: '850px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0 }}>
            {isEditing ? 'Edit Product Listing' : 'Create New Listing'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0' }}>
            List premium handcrafted goods, party kits, posters, or t-shirts.
          </p>
        </div>
        <button 
          onClick={() => navigate('/seller-dashboard?tab=products')}
          className="btn btn-outline"
          style={{ margin: 0 }}
        >
          Cancel & Back
        </button>
      </div>

      {!sellerShop && (
        <div className="card" style={{ background: '#FFF5F6', border: '1px solid #FF8E9E', padding: '20px', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px' }}>
          <AlertCircle size={24} color="#EF4444" />
          <div>
            <strong style={{ color: '#EF4444' }}>Shop Profile Required</strong>
            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              You need to activate your store description and branding inside the dashboard **Settings** tab before publishing products.
            </p>
          </div>
        </div>
      )}

      {/* Standalone Workspace Tabs */}
      <div className="card" style={{ padding: '30px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', background: 'var(--primary-light)', padding: '6px', borderRadius: '12px' }}>
            {[
              { id: 'basic', label: '🌸 Basic Info' },
              { id: 'media', label: '📸 Photo Gallery' },
              { id: 'pricing', label: '💰 Pricing & Stock' },
              { id: 'variants', label: '✨ Variants & Options' },
              { id: 'shipping', label: '🚚 Shipping Specs' },
              { id: 'seo', label: '🔍 SEO Metadata' }
            ].map(sec => (
              <button 
                key={sec.id} 
                type="button" 
                onClick={() => setFormSection(sec.id)} 
                className={`btn small-btn ${formSection === sec.id ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', margin: 0, flex: '1 1 auto' }}
              >
                {sec.label}
              </button>
            ))}
          </div>

          <div style={{ minHeight: '350px' }} className="tab-pane animate-fade">
            {/* 1. BASIC DETAILS */}
            {formSection === 'basic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Product Title</label>
                  <input 
                    type="text" 
                    value={prodName} 
                    onChange={(e) => {
                      setProdName(e.target.value);
                      if (!isEditing) {
                        setProdSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                        setProdMetaTitle(e.target.value);
                      }
                    }}
                    className="form-control"
                    placeholder="e.g. Always Remember Caps"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Short Tagline Description</label>
                  <input 
                    type="text" 
                    value={prodShortDesc} 
                    onChange={(e) => setProdShortDesc(e.target.value)}
                    className="form-control"
                    placeholder="Concise 1-line highlights..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Product Narrative</label>
                  <textarea 
                    value={prodDesc} 
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="form-control"
                    rows={5}
                    placeholder="Describe materials, process, size limits, eco packaging, etc..."
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-responsive-layout">
                  <div className="form-group">
                    <label className="form-label">Store Category</label>
                    <select 
                      value={prodCategory} 
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="form-control"
                    >
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Birthday Kit">Birthday Kit</option>
                      <option value="Caps">Caps</option>
                      <option value="Posters">Posters</option>
                      <option value="Gifts">Gifts</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subcategory</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Graphic Tees" 
                      value={prodSubcat} 
                      onChange={(e) => setProdSubcat(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Search Tags (separated by commas)</label>
                  <input 
                    type="text" 
                    placeholder="cute, organic, pastel, birthday" 
                    value={prodTags} 
                    onChange={(e) => setProdTags(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            )}

            {/* 2. PHOTO GALLERY */}
            {formSection === 'media' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Upload Product Images</label>
                  <div 
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const files = Array.from(e.dataTransfer.files);
                      const promises = files.map(file => {
                        return new Promise((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => resolve(reader.result);
                          reader.readAsDataURL(file);
                        });
                      });
                      Promise.all(promises).then(newImages => {
                        setProdImages(prev => [...prev, ...newImages]);
                        showToast(`Imported ${newImages.length} images!`, 'success');
                      });
                    }}
                    style={{
                      border: '2px dashed var(--primary)',
                      borderRadius: '12px',
                      padding: '40px 20px',
                      textAlign: 'center',
                      background: isDragging ? 'var(--primary-light)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>🌸</span>
                    <strong>Drag and Drop Product Images Here</strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '5px 0 15px' }}>Supports PNG, JPG, JPEG up to 5MB</p>
                    
                    <label className="btn btn-secondary small-btn" style={{ cursor: 'pointer', display: 'inline-flex', margin: 0 }}>
                      Browse Files
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          const promises = files.map(file => {
                            return new Promise((resolve) => {
                              const reader = new FileReader();
                              reader.onloadend = () => resolve(reader.result);
                              reader.readAsDataURL(file);
                            });
                          });
                          Promise.all(promises).then(newImages => {
                            setProdImages(prev => [...prev, ...newImages]);
                            showToast(`Uploaded ${newImages.length} images!`, 'success');
                          });
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Import via URL */}
                <div className="form-group">
                  <label className="form-label">Add Single Photo Link</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      id="newImageUrl"
                      placeholder="Paste image link here (e.g. https://images.unsplash.com/...)..." 
                      className="form-control"
                      style={{ flex: 1 }}
                    />
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      style={{ margin: 0 }}
                      onClick={() => {
                        const input = document.getElementById('newImageUrl');
                        const val = input.value.trim();
                        if (val) {
                          setProdImages(prev => [...prev, val]);
                          input.value = '';
                          showToast('Photo URL added!', 'success');
                        }
                      }}
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Image Previews */}
                {prodImages.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Your Uploaded Gallery ({prodImages.length} photos)</label>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
                      {prodImages.map((img, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            position: 'relative', 
                            width: '90px', 
                            height: '90px', 
                            borderRadius: '12px', 
                            overflow: 'hidden', 
                            border: '3px solid ' + (idx === 0 ? 'var(--primary)' : 'var(--border-color)'),
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {idx === 0 && (
                            <span style={{ 
                              position: 'absolute', bottom: 0, left: 0, right: 0, 
                              background: 'var(--primary)', color: 'white', fontSize: '9px', 
                              textAlign: 'center', fontWeight: 'bold', padding: '2px 0' 
                            }}>
                              Primary
                            </span>
                          )}
                          <button 
                            type="button" 
                            onClick={() => setProdImages(prodImages.filter((_, i) => i !== idx))} 
                            style={{
                              position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white',
                              border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContext: 'center', fontWeight: 'bold'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. PRICING & INVENTORY */}
            {formSection === 'pricing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-responsive-layout">
                  <div className="form-group">
                    <label className="form-label">Currency</label>
                    <select value={prodCurrency} onChange={(e) => setProdCurrency(e.target.value)} className="form-control">
                      <option value="$">US Dollar ($)</option>
                      <option value="€">Euro (€)</option>
                      <option value="£">British Pound (£)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Retail Price</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={prodPrice} 
                      onChange={(e) => handleOriginalPriceChange(e.target.value)}
                      className="form-control"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-responsive-layout">
                  <div className="form-group">
                    <label className="form-label">Discount Percentage (%)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      value={prodDiscount} 
                      onChange={(e) => handleDiscountChange(e.target.value)}
                      className="form-control"
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Calculated Sale Price</label>
                    <input 
                      type="number" 
                      value={prodSalePrice}
                      disabled
                      className="form-control"
                      style={{ background: 'var(--bg-app)', opacity: 0.8 }}
                    />
                  </div>
                </div>

                <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '10px 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }} className="grid-responsive-layout">
                  <div className="form-group">
                    <label className="form-label">Stock Quantity</label>
                    <input 
                      type="number" 
                      value={prodStock} 
                      onChange={(e) => setProdStock(e.target.value)}
                      className="form-control"
                      placeholder="e.g. 50"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Listing SKU</label>
                    <input 
                      type="text" 
                      value={prodSku} 
                      onChange={(e) => setProdSku(e.target.value)}
                      className="form-control"
                      placeholder="e.g. SK-CLD-TEE-02"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock Status</label>
                    <select value={prodStatus} onChange={(e) => setProdStatus(e.target.value)} className="form-control">
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 4. VARIANTS & OPTIONS */}
            {formSection === 'variants' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--primary-light)', padding: '12px 16px', borderRadius: '10px' }}>
                  <input 
                    type="checkbox" 
                    id="hasVariantsBox"
                    checked={hasVariants}
                    onChange={(e) => setHasVariants(e.target.checked)}
                    style={{ transform: 'scale(1.25)', accentColor: 'var(--primary)' }}
                  />
                  <label htmlFor="hasVariantsBox" style={{ fontWeight: '700', margin: 0, cursor: 'pointer' }}>
                    This listing has different sizes, colors, or materials
                  </label>
                </div>

                {hasVariants && (
                  <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', borderStyle: 'dashed' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }} className="grid-responsive-layout">
                      <div className="form-group">
                        <label className="form-label">Option 1 Name</label>
                        <input 
                          type="text" 
                          value={variantOpt1Name} 
                          onChange={(e) => setVariantOpt1Name(e.target.value)}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Values (comma-separated)</label>
                        <input 
                          type="text" 
                          value={variantOpt1Values} 
                          onChange={(e) => setVariantOpt1Values(e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }} className="grid-responsive-layout">
                      <div className="form-group">
                        <label className="form-label">Option 2 Name</label>
                        <input 
                          type="text" 
                          value={variantOpt2Name} 
                          onChange={(e) => setVariantOpt2Name(e.target.value)}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Values (comma-separated)</label>
                        <input 
                          type="text" 
                          value={variantOpt2Values} 
                          onChange={(e) => setVariantOpt2Values(e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={generateCombinations} 
                      className="btn btn-secondary"
                      style={{ alignSelf: 'start', margin: 0 }}
                    >
                      Generate Variants List
                    </button>

                    {prodVariants.length > 0 && (
                      <div className="form-group">
                        <label className="form-label">Combinations Preview ({prodVariants.length} items)</label>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px' }}>
                          <table style={{ width: '100%', fontSize: '0.85rem', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                                <th style={{ padding: '6px' }}>Size</th>
                                <th style={{ padding: '6px' }}>Color</th>
                                <th style={{ padding: '6px' }}>SKU</th>
                                <th style={{ padding: '6px' }}>Price</th>
                                <th style={{ padding: '6px' }}>Stock</th>
                              </tr>
                            </thead>
                            <tbody>
                              {prodVariants.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                  <td style={{ padding: '6px' }}><strong>{item.size}</strong></td>
                                  <td style={{ padding: '6px' }}>{item.color}</td>
                                  <td style={{ padding: '6px' }}>{item.sku}</td>
                                  <td style={{ padding: '6px' }}>${item.price}</td>
                                  <td style={{ padding: '6px' }}>{item.stock} qty</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 5. SHIPPING SPECIFICATIONS */}
            {formSection === 'shipping' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-responsive-layout">
                  <div className="form-group">
                    <label className="form-label">Package Weight (e.g. 0.5 kg)</label>
                    <input 
                      type="text" 
                      value={prodWeight} 
                      onChange={(e) => setProdWeight(e.target.value)}
                      className="form-control"
                      placeholder="e.g. 0.3 kg"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Package Dimensions</label>
                    <input 
                      type="text" 
                      value={prodDimensions} 
                      onChange={(e) => setProdDimensions(e.target.value)}
                      className="form-control"
                      placeholder="e.g. 20cm x 15cm x 10cm"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-responsive-layout">
                  <div className="form-group">
                    <label className="form-label">Standard Shipping Cost ($)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={prodShippingCost} 
                      onChange={(e) => setProdShippingCost(e.target.value)}
                      className="form-control"
                      placeholder="e.g. 5.00"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Deliverable Countries</label>
                    <input 
                      type="text" 
                      value={prodShippingCountries} 
                      onChange={(e) => setProdShippingCountries(e.target.value)}
                      className="form-control"
                      placeholder="Worldwide, Domestic Only..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Fulfillment Delivery Details</label>
                  <input 
                    type="text" 
                    value={prodDelivery} 
                    onChange={(e) => setProdDelivery(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Listing Refund / Return Policy</label>
                  <input 
                    type="text" 
                    value={prodReturn} 
                    onChange={(e) => setProdReturn(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>
            )}

            {/* 6. SEO METADATA */}
            {formSection === 'seo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Google Search Title Tag</label>
                  <input 
                    type="text" 
                    value={prodMetaTitle} 
                    onChange={(e) => setProdMetaTitle(e.target.value)}
                    className="form-control"
                    placeholder="Search snippet header..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Google Search Meta Description</label>
                  <textarea 
                    value={prodMetaDesc} 
                    onChange={(e) => setProdMetaDesc(e.target.value)}
                    className="form-control"
                    rows={3}
                    placeholder="Brief 150-character snippet explaining listing contents..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Custom URL Slug</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/#/product/</span>
                    <input 
                      type="text" 
                      value={prodSlug} 
                      onChange={(e) => setProdSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))}
                      className="form-control"
                      style={{ flex: 1 }}
                      placeholder="cute-printed-cotton-tee"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '15px 0' }} />

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={() => navigate('/seller-dashboard?tab=products')} 
              className="btn btn-outline"
              style={{ margin: 0 }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!sellerShop}
              style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={18} />
              {isEditing ? 'Save Changes' : 'Publish Listing'}
            </button>
          </div>

        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .grid-responsive-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
}
