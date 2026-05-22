import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  LayoutDashboard, ShoppingBag, ShoppingCart, Settings, Plus, 
  TrendingUp, Users, DollarSign, Edit, Trash2, EyeOff, Eye, 
  CheckCircle, Truck, Package, Store, MessageSquare, Star
} from 'lucide-react';

export default function SellerDashboard() {
  const { 
    currentUser, products, orders, shops, createShop, updateShop, 
    addProduct, updateProduct, deleteProduct, toggleHideProduct, showToast 
  } = useMarketplace();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'dashboard';

  // State for Add/Edit Product Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  
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
  
  // New shipping state
  const [prodWeight, setProdWeight] = useState('');
  const [prodDimensions, setProdDimensions] = useState('');
  const [prodShippingCost, setProdShippingCost] = useState('');
  const [prodShippingCountries, setProdShippingCountries] = useState('Worldwide');
  
  // New SEO state
  const [prodMetaTitle, setProdMetaTitle] = useState('');
  const [prodMetaDesc, setProdMetaDesc] = useState('');
  const [prodSlug, setProdSlug] = useState('');
  
  // New Variants state
  const [hasVariants, setHasVariants] = useState(false);
  const [prodVariants, setProdVariants] = useState([]);
  
  // Option names & values for variant generator
  const [variantOpt1Name, setVariantOpt1Name] = useState('Size');
  const [variantOpt1Values, setVariantOpt1Values] = useState('S, M, L');
  const [variantOpt2Name, setVariantOpt2Name] = useState('Color');
  const [variantOpt2Values, setVariantOpt2Values] = useState('Red, Black');
  
  // Tab section within add product form
  const [formSection, setFormSection] = useState('basic');
  const [isDragging, setIsDragging] = useState(false);

  // Shop Details Edit States
  const [shopNameForm, setShopNameForm] = useState('');
  const [shopDescForm, setShopDescForm] = useState('');
  const [shopLogoForm, setShopLogoForm] = useState('');
  const [shopBannerForm, setShopBannerForm] = useState('');
  const [shopContactForm, setShopContactForm] = useState('');
  const [shopAddressForm, setShopAddressForm] = useState('');
  const [shopCategoryForm, setShopCategoryForm] = useState('T-Shirts');

  const handleFileChange = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Redirect if not seller
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'seller') {
      navigate('/auth?role=seller');
    }
  }, [currentUser, navigate]);

  const sellerShop = shops.find(s => s.sellerId === currentUser?.id);

  // Sync Shop Edit details
  useEffect(() => {
    if (sellerShop) {
      setShopNameForm(sellerShop.name);
      setShopDescForm(sellerShop.description);
      setShopLogoForm(sellerShop.logo);
      setShopBannerForm(sellerShop.banner);
      setShopContactForm(sellerShop.contact);
      setShopAddressForm(sellerShop.address);
      setShopCategoryForm(sellerShop.category || 'T-Shirts');
    }
  }, [sellerShop]);

  if (!currentUser || currentUser.role !== 'seller') return null;

  const setActiveTab = (tab) => {
    searchParams.set('tab', tab);
    setSearchParams(searchParams);
  };

  // 1. Gather Seller Products
  const sellerProducts = products.filter(p => p.sellerId === currentUser.id);

  // 2. Gather Seller Orders (any global orders that contain items from this seller)
  const sellerOrders = orders.filter(order => 
    order.items.some(item => item.sellerId === currentUser.id)
  );

  // 3. Analytics Calculations
  const totalRevenue = orders.reduce((sum, order) => {
    const sellerItems = order.items.filter(item => item.sellerId === currentUser.id);
    const orderSellerSum = sellerItems.reduce((s, it) => s + (it.finalPrice * it.quantity), 0);
    // Apply order discount ratio if any
    const discountRatio = order.subtotal > 0 ? (1 - order.discountAmount / order.subtotal) : 1;
    return sum + (orderSellerSum * discountRatio);
  }, 0);

  const totalSoldUnits = orders.reduce((sum, order) => {
    const sellerItems = order.items.filter(item => item.sellerId === currentUser.id);
    return sum + sellerItems.reduce((s, it) => s + it.quantity, 0);
  }, 0);

  // 4. Shop Creation Submit
  const handleCreateShopSubmit = (e) => {
    e.preventDefault();
    if (!shopNameForm) return;
    createShop({
      name: shopNameForm,
      description: shopDescForm,
      logo: shopLogoForm,
      banner: shopBannerForm,
      category: shopCategoryForm,
      contact: shopContactForm,
      address: shopAddressForm
    });
  };

  // 5. Shop Update Submit
  const handleUpdateShopSubmit = (e) => {
    e.preventDefault();
    if (!sellerShop) return;
    updateShop(sellerShop.id, {
      name: shopNameForm,
      description: shopDescForm,
      logo: shopLogoForm,
      banner: shopBannerForm,
      category: shopCategoryForm,
      contact: shopContactForm,
      address: shopAddressForm
    });
  };

  // 6. Product Add/Edit Operations
  const openAddProductModal = () => {
    setEditingProductId(null);
    setProdName('');
    setProdShortDesc('');
    setProdDesc('');
    setProdPrice('');
    setProdSalePrice('');
    setProdDiscount('0');
    setProdCurrency('$');
    setProdStock('');
    setProdSku('');
    setProdStatus('In Stock');
    setProdCategory('T-Shirts');
    setProdSubcat('');
    setProdImages(['https://images.unsplash.com/photo-1559251606-c623743a6d76?w=600&auto=format&fit=crop&q=80']);
    setProdVideo('');
    setProdSizes('S, M, L');
    setProdColors('Red, Black');
    setProdTags('cute, handmade, plushie');
    setProdDelivery('Ships in 1-2 business days.');
    setProdReturn('Returns accepted within 7 days.');
    setProdWeight('0.5 kg');
    setProdDimensions('20cm x 15cm x 10cm');
    setProdShippingCost('5.00');
    setProdShippingCountries('Worldwide');
    setProdMetaTitle('');
    setProdMetaDesc('');
    setProdSlug('');
    setHasVariants(false);
    setProdVariants([]);
    setFormSection('basic');
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setEditingProductId(product.id);
    setProdName(product.name);
    setProdShortDesc(product.shortDescription || '');
    setProdDesc(product.description || '');
    setProdPrice(product.price || '');
    setProdDiscount(product.discount !== undefined ? product.discount : '0');
    
    // Set Sale Price
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
    
    // New Shipping
    setProdWeight(product.weight || '');
    setProdDimensions(product.dimensions || '');
    setProdShippingCost(product.shippingCost !== undefined ? product.shippingCost.toString() : '');
    setProdShippingCountries(product.shippingCountries || 'Worldwide');
    
    // SEO
    setProdMetaTitle(product.metaTitle || '');
    setProdMetaDesc(product.metaDescription || '');
    setProdSlug(product.slug || '');
    
    // Variants
    const hasVars = product.variants && product.variants.length > 0;
    setHasVariants(hasVars);
    setProdVariants(product.variants || []);
    
    setFormSection('basic');
    setShowProductModal(true);
  };

  // Pricing Interactions
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

  const handleSalePriceChange = (val) => {
    setProdSalePrice(val);
    const sale = Number(val);
    const original = Number(prodPrice);
    if (original > 0 && sale > 0 && original >= sale) {
      const calculatedDiscount = ((original - sale) / original) * 100;
      setProdDiscount(Math.round(calculatedDiscount).toString());
    } else if (original > 0 && original < sale) {
      setProdDiscount('0');
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

  // Shopify style dynamic variant combinatorics generator
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

  const handleProductSubmit = (e) => {
    e.preventDefault();
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
      
      // shipping
      weight: prodWeight,
      dimensions: prodDimensions,
      shippingCost: Number(prodShippingCost) || 0,
      shippingCountries: prodShippingCountries,
      
      // seo
      metaTitle: prodMetaTitle || prodName,
      metaDescription: prodMetaDesc || prodShortDesc || prodDesc.slice(0, 150),
      slug: generatedSlug,
      
      // variants
      variants: hasVariants ? prodVariants : [],
      
      shopId: sellerShop.id,
      sellerId: currentUser.id
    };

    if (editingProductId) {
      updateProduct(editingProductId, productData);
    } else {
      addProduct(productData);
    }

    setShowProductModal(false);
  };

  const handleUpdateOrderStatus = (orderId, currentStatus) => {
    // Determine next step
    let nextStatus = 'pending';
    if (currentStatus === 'pending') nextStatus = 'shipped';
    else if (currentStatus === 'shipped') nextStatus = 'delivered';

    // Mutate order globally
    const orderIndex = orders.findIndex(ord => ord.id === orderId);
    if (orderIndex > -1) {
      orders[orderIndex].status = nextStatus;
      localStorage.setItem('orders', JSON.stringify(orders));
      showToast(`Order status updated to "${nextStatus}"`, 'success');
      // Force trigger state sync
      setActiveTab('orders');
    }
  };

  const renderProductFormFields = () => {
    const sections = [
      { id: 'basic', label: '🌸 Basic Details' },
      { id: 'media', label: '📸 Images & Media' },
      { id: 'pricing', label: '💰 Pricing & Stock' },
      { id: 'variants', label: '✨ Shopify Variants' },
      { id: 'shipping', label: '🚚 Shipping' },
      { id: 'seo', label: '🔍 SEO & Slug' }
    ];

    return (
      <div className="premium-form-layout" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Form Section Navigation */}
        <div className="form-section-nav" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', background: 'var(--primary-light)', padding: '6px', borderRadius: '12px' }}>
          {sections.map(sec => (
            <button 
              key={sec.id} 
              type="button" 
              onClick={() => setFormSection(sec.id)} 
              className={`btn small-btn ${formSection === sec.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.8rem', margin: 0 }}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Section Contents */}
        <div className="section-contents-wrapper" style={{ padding: '5px' }}>
          {/* SECTION 1: BASIC DETAILS */}
          {formSection === 'basic' && (
            <div className="section-pane animate-fade">
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input 
                  type="text" 
                  value={prodName} 
                  onChange={(e) => {
                    setProdName(e.target.value);
                    if (!editingProductId) {
                      setProdSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                      setProdMetaTitle(e.target.value);
                    }
                  }}
                  className="form-control"
                  placeholder="e.g. Dreamy Cloud Handwoven Cushion"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Description</label>
                <input 
                  type="text" 
                  value={prodShortDesc} 
                  onChange={(e) => setProdShortDesc(e.target.value)}
                  className="form-control"
                  placeholder="A cute, concise one-line highlight..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Product Description</label>
                <textarea 
                  value={prodDesc} 
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="form-control"
                  rows={4}
                  placeholder="Describe your creative process, material feel, and handcrafted story..."
                  required
                />
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Primary Category</label>
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
                    placeholder="e.g. Cushions" 
                    value={prodSubcat} 
                    onChange={(e) => setProdSubcat(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tags (e.g. #handmade #gift)</label>
                <input 
                  type="text" 
                  placeholder="#handmade, #gift, #cute, #plushie" 
                  value={prodTags} 
                  onChange={(e) => setProdTags(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
          )}

          {/* SECTION 2: IMAGES & MEDIA */}
          {formSection === 'media' && (
            <div className="section-pane animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Drag & Drop Visual Area */}
              <div className="form-group">
                <label className="form-label">Media Upload Zone</label>
                <div 
                  className={`drag-drop-zone ${isDragging ? 'dragging' : ''}`}
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
                      showToast(`Added ${newImages.length} photos successfully!`, 'success');
                    });
                  }}
                  style={{
                    border: '2px dashed var(--primary)',
                    borderRadius: '12px',
                    padding: '30px',
                    textAlign: 'center',
                    background: isDragging ? 'var(--primary-light)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>🌸</span>
                  <strong>Drag & drop product images here</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 12px' }}>Supports PNG, JPG, JPEG, SVG up to 5MB</p>
                  
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

              {/* URL Import */}
              <div className="form-group">
                <label className="form-label">Add Product Image by URL</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    id="newImageUrlField"
                    placeholder="Paste single image link here (e.g., https://...)..." 
                    className="form-control"
                    style={{ flex: 1 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.target.value.trim();
                        if (val) {
                          setProdImages(prev => [...prev, val]);
                          e.target.value = '';
                          showToast('Image URL added!', 'success');
                        }
                      }
                    }}
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    style={{ margin: 0, whiteSpace: 'nowrap' }}
                    onClick={() => {
                      const input = document.getElementById('newImageUrlField');
                      const val = input.value.trim();
                      if (val) {
                        setProdImages(prev => [...prev, val]);
                        input.value = '';
                        showToast('Image URL added!', 'success');
                      }
                    }}
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Gallery Preview Box */}
              {prodImages.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Image Gallery Preview ({prodImages.length} items)</label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '5px' }}>
                    {prodImages.map((img, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          position: 'relative', 
                          width: '80px', 
                          height: '80px', 
                          borderRadius: '10px', 
                          overflow: 'hidden', 
                          border: '2px solid ' + (idx === 0 ? 'var(--primary)' : 'var(--border-color)'),
                          boxShadow: 'var(--shadow-sm)',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {idx === 0 && (
                          <span style={{ 
                            position: 'absolute', bottom: 0, left: 0, right: 0, 
                            background: 'var(--primary)', color: 'white', fontSize: '9px', 
                            textAlign: 'center', fontWeight: 'bold', padding: '2px 0' 
                          }}>
                            Cover
                          </span>
                        )}
                        <button 
                          type="button" 
                          onClick={() => {
                            setProdImages(prodImages.filter((_, index) => index !== idx));
                          }} 
                          style={{
                            position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white',
                            border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Product Video Upload / URL</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Paste mp4 video link or upload below..." 
                    value={prodVideo} 
                    onChange={(e) => setProdVideo(e.target.value)}
                    className="form-control"
                    style={{ flex: 1 }}
                  />
                  <label className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', margin: 0, padding: '0 15px', whiteSpace: 'nowrap' }}>
                    📂 Upload Video
                    <input 
                      type="file" 
                      accept="video/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setProdVideo(reader.result);
                            showToast('Video uploaded successfully!', 'success');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: PRICING & INVENTORY */}
          {formSection === 'pricing' && (
            <div className="section-pane animate-fade">
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <select 
                    value={prodCurrency} 
                    onChange={(e) => setProdCurrency(e.target.value)}
                    className="form-control"
                  >
                    <option value="$">US Dollar ($)</option>
                    <option value="€">Euro (€)</option>
                    <option value="£">British Pound (£)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price</label>
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

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Discount (%)</label>
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
                  <label className="form-label">Sale Price</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={prodSalePrice} 
                    onChange={(e) => handleSalePriceChange(e.target.value)}
                    className="form-control"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <hr className="divider" style={{ margin: '15px 0' }} />

              <div className="grid-cols-3">
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
                  <label className="form-label">SKU (Stock Keeping Unit)</label>
                  <input 
                    type="text" 
                    value={prodSku} 
                    onChange={(e) => setProdSku(e.target.value)}
                    className="form-control"
                    placeholder="e.g. SK-CLD-CUSH-01"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Inventory Status</label>
                  <select 
                    value={prodStatus} 
                    onChange={(e) => setProdStatus(e.target.value)}
                    className="form-control"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: VARIANTS (SHOPIFY STYLE) */}
          {formSection === 'variants' && (
            <div className="section-pane animate-fade">
              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  id="hasVariantsToggle"
                  checked={hasVariants} 
                  onChange={(e) => setHasVariants(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="hasVariantsToggle" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                  This product has multiple variants (e.g. sizes, colors)
                </label>
              </div>

              {hasVariants && (
                <div className="shopify-variants-editor card bg-light" style={{ padding: '15px', marginTop: '10px' }}>
                  <h4>Generate Variants</h4>
                  <p className="subtitle" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Specify options to generate stock combos instantly</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', margin: '15px 0' }}>
                    <div className="form-group">
                      <label className="form-label">Option 1 (e.g. Size)</label>
                      <input 
                        type="text" 
                        value={variantOpt1Name} 
                        onChange={(e) => setVariantOpt1Name(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Option 1 Values (comma separated)</label>
                      <input 
                        type="text" 
                        value={variantOpt1Values} 
                        onChange={(e) => setVariantOpt1Values(e.target.value)}
                        className="form-control"
                        placeholder="e.g. S, M, L"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', margin: '15px 0' }}>
                    <div className="form-group">
                      <label className="form-label">Option 2 (e.g. Color)</label>
                      <input 
                        type="text" 
                        value={variantOpt2Name} 
                        onChange={(e) => setVariantOpt2Name(e.target.value)}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Option 2 Values (comma separated)</label>
                      <input 
                        type="text" 
                        value={variantOpt2Values} 
                        onChange={(e) => setVariantOpt2Values(e.target.value)}
                        className="form-control"
                        placeholder="e.g. Red, Black"
                      />
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={generateCombinations}
                    className="btn btn-secondary small-btn"
                    style={{ width: '100%', marginBottom: '15px' }}
                  >
                    ⚡ Generate Variant Combinations
                  </button>

                  {/* Combination pricing + stock table */}
                  {prodVariants.length > 0 && (
                    <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                      <table className="dash-table compact" style={{ width: '100%', fontSize: '0.85rem' }}>
                        <thead>
                          <tr>
                            <th>Variant Combination</th>
                            <th>Price ({prodCurrency})</th>
                            <th>Stock</th>
                            <th>SKU</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prodVariants.map((v, idx) => (
                            <tr key={idx}>
                              <td>
                                <strong>
                                  {v.size && v.color ? `${v.size} / ${v.color}` : v.size || v.color}
                                </strong>
                              </td>
                              <td>
                                <input 
                                  type="number" 
                                  step="0.01" 
                                  value={v.price} 
                                  onChange={(e) => {
                                    const updated = [...prodVariants];
                                    updated[idx].price = Number(e.target.value);
                                    setProdVariants(updated);
                                  }}
                                  className="form-control compact" 
                                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                                />
                              </td>
                              <td>
                                <input 
                                  type="number" 
                                  value={v.stock} 
                                  onChange={(e) => {
                                    const updated = [...prodVariants];
                                    updated[idx].stock = Number(e.target.value);
                                    setProdVariants(updated);
                                  }}
                                  className="form-control compact" 
                                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                                />
                              </td>
                              <td>
                                <input 
                                  type="text" 
                                  value={v.sku} 
                                  onChange={(e) => {
                                    const updated = [...prodVariants];
                                    updated[idx].sku = e.target.value;
                                    setProdVariants(updated);
                                  }}
                                  className="form-control compact" 
                                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                                />
                              </td>
                              <td>
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    setProdVariants(prodVariants.filter((_, i) => i !== idx));
                                  }}
                                  style={{ border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', fontSize: '1rem' }}
                                >
                                  🗑️
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SECTION 5: SHIPPING */}
          {formSection === 'shipping' && (
            <div className="section-pane animate-fade">
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Weight</label>
                  <input 
                    type="text" 
                    value={prodWeight} 
                    onChange={(e) => setProdWeight(e.target.value)}
                    className="form-control"
                    placeholder="e.g. 0.5 kg"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Dimensions</label>
                  <input 
                    type="text" 
                    value={prodDimensions} 
                    onChange={(e) => setProdDimensions(e.target.value)}
                    className="form-control"
                    placeholder="e.g. 20cm x 15cm x 10cm"
                  />
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Shipping Cost ({prodCurrency})</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={prodShippingCost} 
                    onChange={(e) => setProdShippingCost(e.target.value)}
                    className="form-control"
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Countries Available</label>
                  <input 
                    type="text" 
                    value={prodShippingCountries} 
                    onChange={(e) => setProdShippingCountries(e.target.value)}
                    className="form-control"
                    placeholder="Worldwide, USA, Europe, etc."
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: SEO */}
          {formSection === 'seo' && (
            <div className="section-pane animate-fade">
              <div className="form-group">
                <label className="form-label">Product URL Slug</label>
                <input 
                  type="text" 
                  value={prodSlug} 
                  onChange={(e) => setProdSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))}
                  className="form-control"
                  placeholder="e.g. dreamy-cloud-cushion"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Meta Search Title</label>
                <input 
                  type="text" 
                  value={prodMetaTitle} 
                  onChange={(e) => setProdMetaTitle(e.target.value)}
                  className="form-control"
                  placeholder="Appears on search engine header..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Meta Search Description</label>
                <textarea 
                  value={prodMetaDesc} 
                  onChange={(e) => setProdMetaDesc(e.target.value)}
                  className="form-control"
                  rows={3}
                  placeholder="Appears in search engine descriptions..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Create Shop panel if seller has no shop registered yet
  if (!sellerShop) {
    return (
      <div className="container seller-dashboard-container">
        <div className="card start-shop-card">
          <h2>Welcome, Creative Maker! 🌸</h2>
          <p>Register your shop profile to begin posting products, accepting orders, and connecting with buyers.</p>
          <hr className="divider" style={{ margin: '20px 0' }} />

          <form onSubmit={handleCreateShopSubmit} className="shop-registration-form">
            <div className="form-group">
              <label className="form-label">Shop Name</label>
              <input 
                type="text" 
                placeholder="e.g. Kawaii Clay Crafts" 
                value={shopNameForm}
                onChange={(e) => setShopNameForm(e.target.value)}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Shop Description</label>
              <textarea 
                placeholder="Tell buyers what you create..." 
                value={shopDescForm}
                onChange={(e) => setShopDescForm(e.target.value)}
                className="form-control"
                rows={3}
                required
              />
            </div>

            <div className="grid-cols-2">
              <div className="form-group">
                <label className="form-label">Logo Image</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Paste logo URL or upload from device" 
                    value={shopLogoForm}
                    onChange={(e) => setShopLogoForm(e.target.value)}
                    className="form-control"
                    style={{ flex: 1 }}
                  />
                  <label className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', margin: 0, padding: '0 15px', whiteSpace: 'nowrap' }}>
                    📂 Upload
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileChange(e, setShopLogoForm)}
                    />
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Banner Image</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Paste banner URL or upload from device" 
                    value={shopBannerForm}
                    onChange={(e) => setShopBannerForm(e.target.value)}
                    className="form-control"
                    style={{ flex: 1 }}
                  />
                  <label className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', margin: 0, padding: '0 15px', whiteSpace: 'nowrap' }}>
                    📂 Upload
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileChange(e, setShopBannerForm)}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid-cols-3">
              <div className="form-group">
                <label className="form-label">Shop Category</label>
                <select
                  value={shopCategoryForm}
                  onChange={(e) => setShopCategoryForm(e.target.value)}
                  className="form-control"
                >
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Gifts">Gifts</option>
                  <option value="Posters">Posters</option>
                  <option value="Birthday Kit">Birthday Kit</option>
                  <option value="Caps">Caps</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Support Email / Contact</label>
                <input 
                  type="text" 
                  placeholder="contact@myshop.com" 
                  value={shopContactForm}
                  onChange={(e) => setShopContactForm(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Shop Address</label>
                <input 
                  type="text" 
                  placeholder="City, Country" 
                  value={shopAddressForm}
                  onChange={(e) => setShopAddressForm(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Launch My Shop</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container seller-dashboard-container">
      
      {/* Pending Approval Alert */}
      {sellerShop.status === 'pending' && (
        <div className="card pending-approval-alert">
          <span>⚠️</span>
          <div>
            <h4>Shop Pending Approval</h4>
            <p>Your shop "<strong>{sellerShop.name}</strong>" is currently awaiting administrative approval. You can prepare catalog items, but they will become active once your shop is verified.</p>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="dashboard-grid">
        
        {/* Sidebar Controls */}
        <div className="dashboard-sidebar card">
          <div className="shop-identity-header">
            <img src={sellerShop.logo} alt={sellerShop.name} className="sidebar-shop-logo" />
            <h3>{sellerShop.name}</h3>
            <span className="badge badge-primary">{sellerShop.status}</span>
          </div>

          <ul className="dashboard-nav-list">
            <li>
              <button onClick={() => setActiveTab('dashboard')} className={`dash-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}>
                <LayoutDashboard size={18} /> Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => { openAddProductModal(); setActiveTab('add-product'); }} className={`dash-nav-btn ${activeTab === 'add-product' ? 'active' : ''}`}>
                <Plus size={18} /> Add Product
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('manage-products')} className={`dash-nav-btn ${activeTab === 'manage-products' ? 'active' : ''}`}>
                <ShoppingBag size={18} /> Manage Products ({sellerProducts.length})
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('my-shop')} className={`dash-nav-btn ${activeTab === 'my-shop' ? 'active' : ''}`}>
                <Store size={18} /> My Shop
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('orders')} className={`dash-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}>
                <ShoppingCart size={18} /> Orders ({sellerOrders.length})
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('revenue')} className={`dash-nav-btn ${activeTab === 'revenue' ? 'active' : ''}`}>
                <DollarSign size={18} /> Revenue
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('customer-chat')} className={`dash-nav-btn ${activeTab === 'customer-chat' ? 'active' : ''}`}>
                <MessageSquare size={18} /> Customer Chat
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('reviews')} className={`dash-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}>
                <Star size={18} /> Reviews
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('settings')} className={`dash-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}>
                <Settings size={18} /> Settings
              </button>
            </li>
          </ul>
        </div>

        {/* Workspace Display Area */}
        <div className="dashboard-content-pane">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="tab-pane-view">
              
              {/* Analytics widgets cards */}
              <div className="analytics-widgets-grid">
                <div className="card widget-card">
                  <div className="widget-icon-row">
                    <DollarSign size={24} className="widget-icon color-green" />
                    <span className="badge badge-success">+12%</span>
                  </div>
                  <span className="widget-label">Total Revenue</span>
                  <h3>${totalRevenue.toFixed(2)}</h3>
                </div>

                <div className="card widget-card">
                  <div className="widget-icon-row">
                    <ShoppingCart size={24} className="widget-icon color-blue" />
                    <span className="badge badge-secondary">{sellerOrders.length}</span>
                  </div>
                  <span className="widget-label">Total Orders</span>
                  <h3>{sellerOrders.length} Orders</h3>
                </div>

                <div className="card widget-card">
                  <div className="widget-icon-row">
                    <Package size={24} className="widget-icon color-purple" />
                    <span className="badge badge-primary">{totalSoldUnits}</span>
                  </div>
                  <span className="widget-label">Units Sold</span>
                  <h3>{totalSoldUnits} Items</h3>
                </div>
              </div>

              {/* Analytics Chart Block */}
              <div className="card chart-card" style={{ marginBottom: '20px' }}>
                <h3>Monthly Revenue & Orders Chart</h3>
                <p className="subtitle">Visual performance stats</p>
                <hr className="divider" style={{ margin: '15px 0' }} />
                
                <div className="svg-chart-container">
                  <svg viewBox="0 0 500 200" className="revenue-line-chart">
                    <line x1="40" y1="20" x2="480" y2="20" stroke="var(--border-color)" strokeDasharray="4 4" />
                    <line x1="40" y1="70" x2="480" y2="70" stroke="var(--border-color)" strokeDasharray="4 4" />
                    <line x1="40" y1="120" x2="480" y2="120" stroke="var(--border-color)" strokeDasharray="4 4" />
                    <line x1="40" y1="170" x2="480" y2="170" stroke="#888" />

                    <path 
                      d="M 50 150 L 150 140 L 250 110 L 350 80 L 450 40" 
                      fill="none" 
                      stroke="var(--primary)" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                    />

                    <path 
                      d="M 50 150 L 150 140 L 250 110 L 350 80 L 450 40 L 450 170 L 50 170 Z" 
                      fill="url(#chart-grad)"
                      opacity="0.15"
                    />

                    <circle cx="50" cy="150" r="6" fill="var(--primary)" />
                    <circle cx="150" cy="140" r="6" fill="var(--primary)" />
                    <circle cx="250" cy="110" r="6" fill="var(--primary)" />
                    <circle cx="350" cy="80" r="6" fill="var(--primary)" />
                    <circle cx="450" cy="40" r="6" fill="var(--primary)" />

                    <text x="50" y="190" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Jan</text>
                    <text x="150" y="190" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Feb</text>
                    <text x="250" y="190" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Mar</text>
                    <text x="350" y="190" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">Apr</text>
                    <text x="450" y="190" fill="var(--text-secondary)" fontSize="10" textAnchor="middle">May</text>
                    
                    <text x="30" y="150" fill="var(--text-secondary)" fontSize="9" textAnchor="end">$100</text>
                    <text x="30" y="110" fill="var(--text-secondary)" fontSize="9" textAnchor="end">$300</text>
                    <text x="30" y="70" fill="var(--text-secondary)" fontSize="9" textAnchor="end">$500</text>
                    <text x="30" y="30" fill="var(--text-secondary)" fontSize="9" textAnchor="end">$800</text>

                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="card recent-orders-card">
                <h3>Recent Orders Activity</h3>
                <p className="subtitle">Latest buyer requests</p>
                <hr className="divider" style={{ margin: '15px 0' }} />
                {sellerOrders.length === 0 ? (
                  <p className="text-muted">No recent sales transactions recorded.</p>
                ) : (
                  <div className="table-wrapper">
                    <table className="dash-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Buyer</th>
                          <th>Status</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sellerOrders.slice(0, 3).map(order => {
                          const myItems = order.items.filter(item => item.sellerId === currentUser.id);
                          const mySum = myItems.reduce((s, it) => s + (it.finalPrice * it.quantity), 0);
                          return (
                            <tr key={order.id}>
                              <td><strong>#{order.id}</strong></td>
                              <td>{order.buyerName}</td>
                              <td><span className={`badge badge-${order.status === 'delivered' ? 'success' : 'secondary'}`}>{order.status}</span></td>
                              <td><strong>${mySum.toFixed(2)}</strong></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ADD PRODUCT */}
          {activeTab === 'add-product' && (
            <div className="card tab-pane-card animate-fade">
              <h3>Add New Product Listing</h3>
              <p className="subtitle">List a cute new item in your store catalog</p>
              <hr className="divider" style={{ margin: '15px 0' }} />
 
              <form onSubmit={handleProductSubmit} className="modal-product-form">
                {renderProductFormFields()}
                <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" style={{ width: '200px' }}>Create Listing</button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: MANAGE PRODUCTS */}
          {activeTab === 'manage-products' && (
            <div className="card tab-pane-card">
              <div className="pane-header">
                <div>
                  <h3>Manage Products</h3>
                  <p className="subtitle">Adjust pricing, stock volume, and catalog status</p>
                </div>
                <button onClick={() => { openAddProductModal(); setActiveTab('add-product'); }} className="btn btn-primary">
                  <Plus size={16} /> Add Product
                </button>
              </div>
              <hr className="divider" style={{ margin: '15px 0' }} />

              {sellerProducts.length === 0 ? (
                <div className="empty-tab-view">
                  <span className="empty-emoji">🧸🪄</span>
                  <h4>No Products Added!</h4>
                  <p>Click "Add Product" above to load your first cute listing.</p>
                </div>
              ) : (
                <div className="dashboard-products-table-wrapper">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellerProducts.map(prod => (
                        <tr key={prod.id} className={prod.hidden ? 'row-hidden' : ''}>
                          <td>
                            <div className="table-prod-info">
                              <img src={prod.images[0]} alt="" className="table-prod-img" />
                              <div>
                                <strong>{prod.name}</strong>
                                <span className="cat-sub">{prod.category}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <strong>${prod.price.toFixed(2)}</strong>
                            {prod.discount > 0 && <span className="discount-sub">-{prod.discount}%</span>}
                          </td>
                          <td>
                            <span className={`stock-sub ${prod.stock === 0 ? 'out' : ''}`}>
                              {prod.stock} units
                            </span>
                          </td>
                          <td>⭐ {prod.rating}</td>
                          <td>
                            <div className="table-actions-row">
                              <button onClick={() => openEditProductModal(prod)} className="table-act-btn edit" aria-label="Edit product">
                                <Edit size={14} />
                              </button>
                              <button onClick={() => toggleHideProduct(prod.id)} className="table-act-btn hide" aria-label={prod.hidden ? 'Unhide product' : 'Hide product'}>
                                {prod.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                              <button onClick={() => deleteProduct(prod.id)} className="table-act-btn delete" aria-label="Delete product">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MY SHOP */}
          {activeTab === 'my-shop' && (
            <div className="card tab-pane-card">
              <h3>My Shop Branding</h3>
              <p className="subtitle">View public layout and storefront representation</p>
              <hr className="divider" style={{ margin: '15px 0' }} />

              <div className="shop-preview-card bg-light card" style={{ padding: '20px', marginBottom: '20px' }}>
                <img src={sellerShop.banner} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <img src={sellerShop.logo} alt="" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
                  <div>
                    <h4>{sellerShop.name}</h4>
                    <span className="badge badge-primary">{sellerShop.category}</span>
                    <p style={{ fontSize: '0.85rem', margin: '4px 0 0', color: 'var(--text-secondary)' }}>{sellerShop.description}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => navigate(`/shop/${sellerShop.id}`)} className="btn btn-primary">
                  🌐 Visit Live Storefront
                </button>
                <button onClick={() => setActiveTab('settings')} className="btn btn-outline">
                  ✏️ Edit Details
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: ORDERS */}
          {activeTab === 'orders' && (
            <div className="card tab-pane-card">
              <h3>Order Manager</h3>
              <p className="subtitle">View buyer purchases, print labels, and update shipping logs</p>
              <hr className="divider" style={{ margin: '15px 0' }} />

              {sellerOrders.length === 0 ? (
                <div className="empty-tab-view">
                  <span className="empty-emoji">📦💤</span>
                  <h4>No Orders Placed!</h4>
                  <p>When buyers order your items, they will show up here.</p>
                </div>
              ) : (
                <div className="seller-orders-list">
                  {sellerOrders.map(order => {
                    const myItems = order.items.filter(item => item.sellerId === currentUser.id);
                    const mySum = myItems.reduce((s, it) => s + (it.finalPrice * it.quantity), 0);

                    return (
                      <div key={order.id} className="seller-order-card card">
                        <div className="seller-order-header">
                          <div>
                            <h4>Order #{order.id}</h4>
                            <span className="date">Buyer: {order.buyerName} ({new Date(order.date).toLocaleDateString()})</span>
                          </div>
                          <span className={`status-badge-inline ${order.status}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="order-items-breakdown bg-light">
                          {myItems.map((item, idx) => (
                            <div key={idx} className="item-row">
                              <span><strong>{item.quantity}x</strong> {item.name} {item.color && `(${item.color})`}</span>
                              <span>${(item.finalPrice * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <hr className="divider" style={{ margin: '10px 0' }} />
                        
                        <div className="order-footer">
                          <div className="addr">
                            <span>📍 Shipping to: {order.shippingAddress}</span>
                          </div>
                          <div className="actions">
                            <span className="revenue">Your share: <strong>${mySum.toFixed(2)}</strong></span>
                            {order.status === 'pending' && (
                              <button onClick={() => handleUpdateOrderStatus(order.id, 'pending')} className="btn btn-primary small-btn">
                                <Truck size={12} /> Mark as Shipped
                              </button>
                            )}
                            {order.status === 'shipped' && (
                              <button onClick={() => handleUpdateOrderStatus(order.id, 'shipped')} className="btn btn-secondary small-btn">
                                <CheckCircle size={12} /> Mark as Delivered
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: REVENUE */}
          {activeTab === 'revenue' && (
            <div className="card tab-pane-card">
              <h3>Earnings & Payouts</h3>
              <p className="subtitle">Track transactions, pending clearance, and request transfers</p>
              <hr className="divider" style={{ margin: '15px 0' }} />

              <div className="analytics-widgets-grid">
                <div className="card widget-card bg-light">
                  <span className="widget-label">Available Balance</span>
                  <h2 className="text-green" style={{ margin: '5px 0 0' }}>${(totalRevenue * 0.9).toFixed(2)}</h2>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>After 10% platform fee</span>
                </div>
                <div className="card widget-card bg-light">
                  <span className="widget-label">Pending Settlements</span>
                  <h2 style={{ margin: '5px 0 0', color: 'var(--text-secondary)' }}>$0.00</h2>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cleared after delivery confirmation</span>
                </div>
              </div>

              <div className="card" style={{ marginTop: '20px', background: 'var(--bg-app)' }}>
                <h4>Request Balance Cashout</h4>
                <p className="subtitle">Transfer earnings straight to bank details</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Transfer Method</label>
                    <select className="form-control">
                      <option>PayPal Account</option>
                      <option>Direct Bank Account Link</option>
                      <option>Stripe Payout Connect</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Transfer Sum ($)</label>
                    <input type="number" defaultValue={(totalRevenue * 0.9).toFixed(2)} className="form-control" />
                  </div>
                </div>
                <button onClick={() => alert('Payout transfer of $' + (totalRevenue*0.9).toFixed(2) + ' initiated successfully! 🌸')} className="btn btn-primary" style={{ marginTop: '10px' }}>
                  💸 Initiate Transfer
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: CUSTOMER CHAT */}
          {activeTab === 'customer-chat' && (
            <div className="card tab-pane-card">
              <h3>Customer Chat Center</h3>
              <p className="subtitle">Interact with buyers, answer custom questions, and send cute tips</p>
              <hr className="divider" style={{ margin: '15px 0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', height: '350px' }}>
                <div className="chat-buyers-list bg-light" style={{ borderRadius: '8px', padding: '10px', overflowY: 'auto' }}>
                  <div style={{ padding: '10px', background: 'var(--primary-light)', borderRadius: '6px', cursor: 'pointer', marginBottom: '8px' }}>
                    <strong>Sweet buyer 🎀</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Is the cushion super squishy?</div>
                  </div>
                  <div style={{ padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>
                    <strong>Kawaii Lover ✨</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Love my package!</div>
                  </div>
                </div>

                <div className="chat-window card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '15px', margin: 0 }}>
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '10px' }}>
                    <div style={{ alignSelf: 'flex-start', background: 'var(--border-color)', padding: '8px 12px', borderRadius: '12px 12px 12px 0', fontSize: '0.85rem' }}>
                      Hello! Is the cushion super squishy? I want to buy 2 units.
                    </div>
                    <div style={{ alignSelf: 'flex-end', background: 'var(--primary)', color: 'white', padding: '8px 12px', borderRadius: '12px 12px 0 12px', fontSize: '0.85rem' }}>
                      Yes, it is! Made with premium memory foam and soft velvet plush cover! 🌸
                    </div>
                  </div>
                  <hr className="divider" style={{ margin: '10px 0' }} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="Type cute reply..." className="form-control" style={{ flex: 1 }} />
                    <button className="btn btn-primary" onClick={() => alert('Message Sent!')}>Send</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="card tab-pane-card">
              <h3>Shop & Product Reviews</h3>
              <p className="subtitle">See feedback left by buyers on your items</p>
              <hr className="divider" style={{ margin: '15px 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="review-item-card card bg-light" style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong>Sweet buyer 🎀</strong>
                    <span>⭐⭐⭐⭐⭐</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>The items are incredibly cute! Very fast dispatch and super cute wrapping paper details. Highly recommend this seller!</p>
                </div>
                <div className="review-item-card card bg-light" style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong>Plushie Fanatic 🧸</strong>
                    <span>⭐⭐⭐⭐⭐</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>High quality plush fabric, the pastel color represents exactly the picture details! 🌸</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="card tab-pane-card">
              <h3>Shop Settings & Configuration</h3>
              <p className="subtitle">Customize branding, address points, and cover media</p>
              <hr className="divider" style={{ margin: '15px 0' }} />

              <form onSubmit={handleUpdateShopSubmit} className="shop-settings-form">
                <div className="form-group">
                  <label className="form-label">Shop Name</label>
                  <input 
                    type="text" 
                    value={shopNameForm} 
                    onChange={(e) => setShopNameForm(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Shop Description</label>
                  <textarea 
                    value={shopDescForm} 
                    onChange={(e) => setShopDescForm(e.target.value)}
                    className="form-control"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Shop Logo Image</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="text" 
                        value={shopLogoForm} 
                        onChange={(e) => setShopLogoForm(e.target.value)}
                        className="form-control"
                        style={{ flex: 1 }}
                      />
                      <label className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', margin: 0, padding: '0 15px', whiteSpace: 'nowrap' }}>
                        📂 Upload
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileChange(e, setShopLogoForm)}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Shop Banner Cover</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="text" 
                        value={shopBannerForm} 
                        onChange={(e) => setShopBannerForm(e.target.value)}
                        className="form-control"
                        style={{ flex: 1 }}
                      />
                      <label className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', margin: 0, padding: '0 15px', whiteSpace: 'nowrap' }}>
                        📂 Upload
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileChange(e, setShopBannerForm)}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid-cols-3">
                  <div className="form-group">
                    <label className="form-label">Shop Category</label>
                    <select
                      value={shopCategoryForm}
                      onChange={(e) => setShopCategoryForm(e.target.value)}
                      className="form-control"
                    >
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Gifts">Gifts</option>
                      <option value="Posters">Posters</option>
                      <option value="Birthday Kit">Birthday Kit</option>
                      <option value="Caps">Caps</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business Contact Email</label>
                    <input 
                      type="email" 
                      value={shopContactForm} 
                      onChange={(e) => setShopContactForm(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dispatch Location Address</label>
                    <input 
                      type="text" 
                      value={shopAddressForm} 
                      onChange={(e) => setShopAddressForm(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '15px' }}>Update Shop Profile</button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content card animate-fade" style={{ maxWidth: '750px', width: '90%' }}>
            <h3>{editingProductId ? 'Edit Product Details' : 'Add New Product Listing'}</h3>
            <hr className="divider" style={{ margin: '12px 0' }} />

            <form onSubmit={handleProductSubmit} className="modal-product-form">
              <div className="grid-scroll-box" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '5px' }}>
                {renderProductFormFields()}
              </div>

              <div className="modal-actions-row" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-secondary">Save Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .seller-dashboard-container {
          padding-top: 20px;
          padding-bottom: 50px;
        }
        .start-shop-card {
          max-width: 700px;
          margin: 60px auto;
          padding: 40px;
        }
        .shop-registration-form {
          margin-top: 20px;
        }
        .pending-approval-alert {
          background: #FEF3C7;
          border-color: #F59E0B;
          color: #92400E;
          display: flex;
          gap: 15px;
          align-items: center;
          padding: 16px 20px;
          margin-bottom: 25px;
          border-left: 5px solid #F59E0B;
        }
        .pending-approval-alert span {
          font-size: 1.5rem;
        }
        .pending-approval-alert h4 {
          color: #92400E;
          margin-bottom: 2px;
        }
        .pending-approval-alert p {
          font-size: 0.85rem;
          line-height: 1.4;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 2.5fr;
          gap: 30px;
          align-items: start;
        }
        .dashboard-sidebar {
          padding: 24px;
          text-align: center;
        }
        .shop-identity-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }
        .sidebar-shop-logo {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--border-color);
        }
        .dashboard-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }
        .dash-nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--border-radius-sm);
          border: none;
          background: transparent;
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .dash-nav-btn:hover {
          background: var(--primary-light);
          color: var(--primary);
        }
        .dash-nav-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: var(--shadow-sm);
        }

        /* Widgets */
        .analytics-widgets-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .widget-card {
          padding: 20px;
        }
        .widget-icon-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .widget-icon {
          padding: 8px;
          border-radius: var(--border-radius-xs);
        }
        .widget-icon.color-green { background: rgba(16, 185, 129, 0.1); color: #10B981; }
        .widget-icon.color-blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
        .widget-icon.color-purple { background: rgba(167, 139, 250, 0.1); color: var(--secondary); }
        .widget-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }
        .widget-card h3 {
          font-size: 1.6rem;
          font-family: var(--font-heading);
          margin-top: 4px;
        }

        /* Chart card */
        .chart-card {
          padding: 25px;
        }
        .svg-chart-container {
          margin-top: 15px;
        }
        .revenue-line-chart {
          width: 100%;
          height: auto;
        }

        /* Products Tab */
        .tab-pane-card {
          padding: 30px;
        }
        .pane-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dashboard-products-table-wrapper {
          overflow-x: auto;
        }
        .dash-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .dash-table th, .dash-table td {
          padding: 15px 12px;
          border-bottom: 1px solid var(--border-color);
        }
        .dash-table th {
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .table-prod-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .table-prod-img {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: var(--border-radius-xs);
          border: 1px solid var(--border-color);
        }
        .cat-sub {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .discount-sub {
          display: block;
          font-size: 0.7rem;
          color: #EF4444;
          font-weight: bold;
        }
        .stock-sub {
          font-weight: 600;
        }
        .stock-sub.out {
          color: #EF4444;
        }
        .row-hidden {
          opacity: 0.65;
        }
        .table-actions-row {
          display: flex;
          gap: 8px;
        }
        .table-act-btn {
          border: none;
          background: var(--bg-app);
          color: var(--text-secondary);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .table-act-btn:hover {
          color: var(--primary);
          background: var(--primary-light);
        }
        .table-act-btn.delete:hover {
          color: white;
          background: #EF4444;
        }

        /* Order Manager */
        .seller-orders-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .seller-order-card {
          padding: 20px;
        }
        .seller-order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .seller-order-header h4 {
          font-size: 1.05rem;
        }
        .seller-order-header .date {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .status-badge-inline {
          padding: 3px 10px;
          font-size: 0.75rem;
          border-radius: 4px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-badge-inline.pending { background: #FEF3C7; color: #D97706; }
        .status-badge-inline.shipped { background: #DBEAFE; color: #2563EB; }
        .status-badge-inline.delivered { background: #D1FAE5; color: #059669; }

        .order-items-breakdown {
          background: var(--bg-app);
          padding: 10px 14px;
          border-radius: var(--border-radius-xs);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .order-items-breakdown .item-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          font-size: 0.85rem;
        }
        .order-footer .addr {
          color: var(--text-muted);
          max-width: 60%;
        }
        .order-footer .actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .order-footer .actions .revenue {
          color: var(--text-secondary);
        }
        .order-footer .actions .revenue strong {
          color: var(--primary);
          font-size: 1rem;
        }
        .small-btn {
          padding: 6px 12px;
          font-size: 0.75rem;
        }

        /* Modal custom scroll */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-content {
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .modal-product-form {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .grid-scroll-box {
          overflow-y: auto;
          flex: 1;
          padding-right: 10px;
          max-height: 60vh;
        }
        .modal-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
        }

        /* Dashboard Responsive */
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .analytics-widgets-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .pane-header {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }
          .order-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .order-footer .actions {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}} />
    </div>
  );
}
