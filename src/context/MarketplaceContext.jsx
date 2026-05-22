import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const MarketplaceContext = createContext();

// Pre-populated data to make the marketplace look full and beautiful instantly
const INITIAL_SHOPS = [
  {
    id: 'shop-1',
    name: 'Always Remember Clothing & Caps',
    description: 'Inspirational organic custom tees, custom caps, and positive vibe apparel prints!',
    logo: 'https://images.unsplash.com/photo-1596495578065-6e076b8a9dad?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    category: 'T-Shirts',
    contact: 'hello@alwayskind.com',
    social: { instagram: '@alwayskind_tees', twitter: '@alwayskind_shop' },
    address: '123 Sweet Pastel Lane, Cloud City',
    sellerId: 'user-seller-1',
    status: 'approved', // approved, pending, suspended
    rating: 4.8,
    followers: 1240,
    reviews: [
      { id: 'r1', buyerName: 'Alice Johnson', rating: 5, comment: 'Amazing t-shirt print. The colors are very vibrant!' },
      { id: 'r2', buyerName: 'Min-ji', rating: 4, comment: 'Love the Choose Happy cap. Adjusts perfectly.' }
    ]
  },
  {
    id: 'shop-2',
    name: 'Affirmations Paper Art & Prints',
    description: 'Your one-stop destination for motivational quotes wall posters, A4/A3 prints, and positive vibes decor.',
    logo: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1200&auto=format&fit=crop&q=80',
    category: 'Posters',
    contact: 'contact@affirmationprints.co',
    social: { instagram: '@affirmation_prints', pinterest: '@affirmationprints' },
    address: '456 Sakura Boulevard, Stationery Haven',
    sellerId: 'user-seller-2',
    status: 'approved',
    rating: 4.9,
    followers: 890,
    reviews: [
      { id: 'r3', buyerName: 'Liam', rating: 5, comment: 'Excellent poster print card quality. Will buy again!' }
    ]
  },
  {
    id: 'shop-3',
    name: 'Happy Little Things Party & Gifts Studio',
    description: 'Deluxe birthday kits, custom gift baskets, handcrafted mugs, and shell candles that bring joy.',
    logo: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
    category: 'Gifts',
    contact: 'happylittlegifts@gmail.com',
    social: { instagram: '@happylittle_gifts' },
    address: '789 Daisy Meadow Drive, Clay Valley',
    sellerId: 'user-seller-3',
    status: 'pending', // Pending admin approval to demonstrate admin panel
    rating: 0.0,
    followers: 0,
    reviews: []
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Always Remember You Are Braver Unisex Tee',
    description: 'Empower your wardrobe with this beautiful quote graphic t-shirt. Crafted from 100% organic ring-spun combed cotton for ultimate comfort. Features soft vintage typography print.',
    price: 24.99,
    discount: 10,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'T-Shirts',
    subcategory: 'Unisex Graphic Tees',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Classic White', 'Pastel Pink', 'Heather Grey'],
    tags: ['t-shirt', 'quote', 'inspirational', 'organic cotton', 'apparel'],
    deliveryDetails: 'Ships in 1-2 business days. Estimated delivery: 3-5 days.',
    returnPolicy: '7-day return policy for unworn items in original packaging.',
    shopId: 'shop-1',
    sellerId: 'user-seller-1',
    rating: 4.8,
    hidden: false,
    reviews: [
      { id: 'pr1', buyerName: 'Sana Patel', rating: 5, date: '2026-05-10', comment: 'Super soft material and the print is very durable!' }
    ]
  },
  {
    id: 'prod-2',
    name: 'I Am Strong, Brave, Beautiful Poster',
    description: 'A gorgeous typography affirmation wall poster to brighten up your bedroom or study space. Printed on premium 250gsm heavyweight matte cardstock with rich fade-resistant inks.',
    price: 14.99,
    discount: 0,
    stock: 120,
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Posters',
    subcategory: 'Affirmations Wall Art',
    sizes: ['A4 (8.3" x 11.7")', 'A3 (11.7" x 16.5")'],
    colors: ['Warm Blush', 'Sage Teal', 'Creamy White'],
    tags: ['poster', 'art', 'affirmation', 'decor', 'wall art'],
    deliveryDetails: 'Ships in sturdy cardboard mailing tube in 1 business day.',
    returnPolicy: 'Free replacement if damaged in transit.',
    shopId: 'shop-2',
    sellerId: 'user-seller-2',
    rating: 4.9,
    hidden: false,
    reviews: [
      { id: 'pr2', buyerName: 'Maya L.', rating: 5, date: '2026-05-08', comment: 'Looks beautiful above my desk. The print quality is crisp!' }
    ]
  },
  {
    id: 'prod-3',
    name: 'Choose Happy Daisy Embroidered Dad Cap',
    description: 'Bring sunshine wherever you go with this premium washed cotton twill cap. Features high-density daisy floral embroidery and an adjustable brass buckle strap for a customized fit.',
    price: 19.99,
    discount: 15,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Caps',
    subcategory: 'Embroidered Hats',
    sizes: ['Adjustable (One Size)'],
    colors: ['Denim Blue', 'Mustard Yellow', 'Stone Beige'],
    tags: ['cap', 'hat', 'daisy', 'embroidery', 'accessory'],
    deliveryDetails: 'Ships in 1-2 business days.',
    returnPolicy: '30-day money-back guarantee.',
    shopId: 'shop-1',
    sellerId: 'user-seller-1',
    rating: 5.0,
    hidden: false,
    reviews: [
      { id: 'pr3', buyerName: 'Chloe G.', rating: 5, date: '2026-05-15', comment: 'Perfect fit and the color is gorgeous!' }
    ]
  },
  {
    id: 'prod-4',
    name: 'Boba & Bunny Cozy Gift Set',
    description: 'The ultimate cute gift box to surprise your best friends or treat yourself! Includes 1x Hand-painted smiling daisy ceramic mug, 1x Organic lavender-scented wax candle, and 1x cute plush bunny keychain.',
    price: 49.99,
    discount: 5,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Gifts',
    subcategory: 'Gift Boxes',
    sizes: ['Standard Gift Box'],
    colors: ['Pastel Pink Box', 'Warm Lavender Box'],
    tags: ['gift', 'hamper', 'bunny', 'mug', 'candle'],
    deliveryDetails: 'Carefully wrapped in bubble sheets. Ships in 2 business days.',
    returnPolicy: 'Returns accepted within 14 days for unopened boxes.',
    shopId: 'shop-3',
    sellerId: 'user-seller-3',
    rating: 4.7,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-5',
    name: 'Deluxe Pastel Birthday Party Kit',
    description: 'Throw the dreamiest party with our complete matching pastel birthday kit. Contains 1x Gold-foil Happy Birthday banner, 20x Biodegradable pastel latex balloons, 6x pom-pom party hats, and 10x cute cake toppers.',
    price: 34.99,
    discount: 20,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Birthday Kit',
    subcategory: 'Party Packs',
    sizes: ['Standard Kit (Party of 10)'],
    colors: ['Pastel Mix'],
    tags: ['birthday', 'party', 'decorations', 'balloons', 'hats'],
    deliveryDetails: 'Ships in 1 business day.',
    returnPolicy: 'Free return if box is sealed and unused.',
    shopId: 'shop-3',
    sellerId: 'user-seller-3',
    rating: 4.8,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-6',
    name: 'Dream Big Little One Crescent Moon Poster',
    description: 'A whimsical illustration of a sleepy kitten cuddled up on a smiling crescent moon, surrounded by shiny gold stars. Hand-drawn art style, high-definition giclée print.',
    price: 12.50,
    discount: 0,
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Posters',
    subcategory: 'Kids & Nursery Art',
    sizes: ['A4', 'A3'],
    colors: ['Night Blue', 'Soft Lavender'],
    tags: ['poster', 'nursery', 'art print', 'kitten', 'starry'],
    deliveryDetails: 'Ships in 1-2 business days.',
    returnPolicy: '30-day returns accepted.',
    shopId: 'shop-2',
    sellerId: 'user-seller-2',
    rating: 4.6,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-7',
    name: 'Smile More Pastel Embroidered Tee',
    description: 'Spread positive vibes with this cute smiley emblem tee. Features a small high-quality embroidered smiley face on the left chest. Made of ultra-soft 100% combed cotton.',
    price: 26.00,
    discount: 10,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'T-Shirts',
    subcategory: 'Crop & Relaxed Tees',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Buttercup Yellow', 'Sage Green', 'Classic White'],
    tags: ['t-shirt', 'smiley', 'embroidery', 'comfy', 'apparel'],
    deliveryDetails: 'Ships in 1-2 business days.',
    returnPolicy: 'Exchange or refund within 14 days.',
    shopId: 'shop-1',
    sellerId: 'user-seller-1',
    rating: 4.9,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-8',
    name: 'Reversible Daisy Flower Bucket Hat',
    description: 'Two designs in one! Features all-over happy daisy flower prints on one side, and a solid pastel lilac canvas on the other side. Breathable double-sided cotton canvas material.',
    price: 21.99,
    discount: 0,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Caps',
    subcategory: 'Bucket Hats',
    sizes: ['Medium (56-58cm)'],
    colors: ['Pastel Lilac', 'Mint Daisy'],
    tags: ['hat', 'bucket hat', 'daisy', 'reversible', 'accessory'],
    deliveryDetails: 'Ships in 2-3 business days.',
    returnPolicy: 'Refund or exchange within 15 days.',
    shopId: 'shop-1',
    sellerId: 'user-seller-1',
    rating: 4.8,
    hidden: false,
    reviews: []
  },
  // --- T-SHIRTS (prod-9 to prod-13) ---
  {
    id: 'prod-9',
    name: 'Be Kind Always Pastel Graphic Tee',
    description: 'Spread kindness everywhere you go! This ultra-soft 100% organic combed cotton tee features a hand-lettered "Be Kind Always" typography print in a subtle pastel watercolor style. Relaxed unisex fit.',
    price: 22.99,
    discount: 10,
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'T-Shirts',
    subcategory: 'Unisex Graphic Tees',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blush Pink', 'Sky Blue', 'Lavender'],
    tags: ['t-shirt', 'kindness', 'pastel', 'quote', 'organic'],
    deliveryDetails: 'Ships in 1-2 business days.',
    returnPolicy: 'Exchange within 14 days for unworn items.',
    shopId: 'shop-1',
    sellerId: 'user-seller-1',
    rating: 4.9,
    hidden: false,
    reviews: [
      { id: 'pr9a', buyerName: 'Priya K.', rating: 5, date: '2026-05-12', comment: 'Love the pastel colors! So soft and comfy.' }
    ]
  },
  {
    id: 'prod-10',
    name: 'Sunshine & Good Vibes Oversized Tee',
    description: 'An effortlessly cool oversized tee with a retro sunshine graphic. Made from heavyweight 280gsm boxy-fit cotton for that perfect laid-back look. Pre-washed for extra softness.',
    price: 28.50,
    discount: 15,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'T-Shirts',
    subcategory: 'Oversized Tees',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Butter Yellow', 'Sage Green'],
    tags: ['t-shirt', 'sunshine', 'oversized', 'retro', 'apparel'],
    deliveryDetails: 'Ships in 2-3 business days.',
    returnPolicy: 'Exchange or refund within 14 days.',
    shopId: 'shop-1',
    sellerId: 'user-seller-1',
    rating: 4.8,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-11',
    name: 'Dreamer Pastel Lavender Crop Tee',
    description: 'Elevate your off-duty style with this cute lavender crop tee. Features beautiful embroidered cursive script and a lightweight relaxed silhouette that pairs perfectly with high-waisted denim.',
    price: 22.00,
    discount: 0,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'T-Shirts',
    subcategory: 'Crop & Relaxed Tees',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Pastel Lavender', 'Cloud White'],
    tags: ['t-shirt', 'crop top', 'dreamer', 'lavender', 'apparel'],
    deliveryDetails: 'Ships in 1-2 business days.',
    returnPolicy: 'Refund or exchange within 15 days.',
    shopId: 'shop-1',
    sellerId: 'user-seller-1',
    rating: 4.7,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-12',
    name: 'Chasing Rainbows Organic Cotton Tee',
    description: 'A charming minimal rainbow graphic printed with eco-friendly water-based inks on organic ring-spun cotton. High breathability and absolute softness for all-day wear.',
    price: 25.50,
    discount: 0,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'T-Shirts',
    subcategory: 'Unisex Graphic Tees',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Creamy White', 'Heather Grey'],
    tags: ['t-shirt', 'rainbow', 'organic', 'minimalist', 'apparel'],
    deliveryDetails: 'Ships in 1-2 business days.',
    returnPolicy: '30-day money-back guarantee.',
    shopId: 'shop-1',
    sellerId: 'user-seller-1',
    rating: 4.9,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-13',
    name: 'Keep Growing Floral Pocket Tee',
    description: 'A pocket t-shirt featuring a subtle hand-drawn wildflower bouquet peeking out from the front pocket. Crafted from high-density heavy combed cotton.',
    price: 26.99,
    discount: 20,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'T-Shirts',
    subcategory: 'Unisex Graphic Tees',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Olive Green', 'Creamy White', 'Warm Beige'],
    tags: ['t-shirt', 'floral', 'pocket tee', 'wildflower', 'apparel'],
    deliveryDetails: 'Ships in 1-2 business days.',
    returnPolicy: '14-day return window.',
    shopId: 'shop-1',
    sellerId: 'user-seller-1',
    rating: 5.0,
    hidden: false,
    reviews: []
  },

  // --- CAPS (prod-14 to prod-15) ---
  {
    id: 'prod-14',
    name: 'Good Day Vintage Corduroy Cap',
    description: 'Add a touch of retro texture to your look with this high-density corduroy cap. Features beautiful yellow custom typography embroidery and an adjustable strap with an antique brass buckle.',
    price: 21.99,
    discount: 10,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Caps',
    subcategory: 'Embroidered Hats',
    sizes: ['Adjustable (One Size)'],
    colors: ['Forest Green', 'Caramel Brown'],
    tags: ['cap', 'hat', 'corduroy', 'vintage', 'accessory'],
    deliveryDetails: 'Ships in 1-2 business days.',
    returnPolicy: '30-day returns accepted.',
    shopId: 'shop-1',
    sellerId: 'user-seller-1',
    rating: 4.8,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-15',
    name: 'Sunny Side Up Embroidered Dad Hat',
    description: 'A charming washed denim cap featuring a happy sunshine embroidery emblem. Extremely soft crown structure and vintage curved visor for perfect daily vibes.',
    price: 18.50,
    discount: 0,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Caps',
    subcategory: 'Embroidered Hats',
    sizes: ['Adjustable (One Size)'],
    colors: ['Soft Lemon', 'Creamy Beige', 'Baby Blue'],
    tags: ['cap', 'hat', 'sunshine', 'washed canvas', 'accessory'],
    deliveryDetails: 'Ships in 1-2 business days.',
    returnPolicy: 'Free replacement if damaged.',
    shopId: 'shop-1',
    sellerId: 'user-seller-1',
    rating: 4.7,
    hidden: false,
    reviews: []
  },

  // --- POSTERS (prod-16 to prod-20) ---
  {
    id: 'prod-16',
    name: 'Slow Down & Breathe Poster',
    description: 'A soothing abstract landscape print featuring earthy organic shapes and soft minimal typography. The perfect gentle reminder to take a deep breath during busy work or study days.',
    price: 13.99,
    discount: 0,
    stock: 100,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Posters',
    subcategory: 'Affirmations Wall Art',
    sizes: ['A4 (8.3" x 11.7")', 'A3 (11.7" x 16.5")'],
    colors: ['Terracotta', 'Blush Cream', 'Olive'],
    tags: ['poster', 'abstract', 'breathe', 'minimalist', 'decor'],
    deliveryDetails: 'Ships in hard cardboard tube.',
    returnPolicy: '30-day satisfaction guaranteed.',
    shopId: 'shop-2',
    sellerId: 'user-seller-2',
    rating: 4.8,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-17',
    name: 'Self Care First Floral Print',
    description: 'A beautiful retro wildflower illustration featuring positive daily affirmations. Rich vibrant pastel colors printed on ultra-heavy textured paper stock.',
    price: 12.99,
    discount: 15,
    stock: 85,
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Posters',
    subcategory: 'Affirmations Wall Art',
    sizes: ['A4', 'A3'],
    colors: ['Blush Pink', 'Creamy White', 'Warm Ochre'],
    tags: ['poster', 'floral', 'self care', 'affirmation', 'decor'],
    deliveryDetails: 'Ships in 1 business day.',
    returnPolicy: 'Refund or exchange within 14 days.',
    shopId: 'shop-2',
    sellerId: 'user-seller-2',
    rating: 4.9,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-18',
    name: 'You Belong Here Forest Illustration',
    description: 'A gorgeous fairytale forest watercolor print. Adorable woodland animals gather under a warm glowing canopy. Designed to add magical comfort to kids bedrooms and nurseries.',
    price: 14.50,
    discount: 0,
    stock: 90,
    images: [
      'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Posters',
    subcategory: 'Kids & Nursery Art',
    sizes: ['A4', 'A3'],
    colors: ['Sage Green', 'Warm Pine', 'Soft Grey'],
    tags: ['poster', 'nursery', 'woodland', 'animals', 'watercolor'],
    deliveryDetails: 'Ships in sturdy mailing tube.',
    returnPolicy: 'Free replacement if damaged.',
    shopId: 'shop-2',
    sellerId: 'user-seller-2',
    rating: 4.8,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-19',
    name: 'Grow at Your Own Pace Poster',
    description: 'A delightful plant and foliage illustration illustrating the beautiful message of personal growth. Features modern HSL pastel aesthetics and a lovely textured paper finish.',
    price: 11.99,
    discount: 10,
    stock: 150,
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Posters',
    subcategory: 'Affirmations Wall Art',
    sizes: ['A4', 'A3'],
    colors: ['Lilac Breeze', 'Warm Sand', 'Soft Emerald'],
    tags: ['poster', 'plants', 'growth', 'motivation', 'decor'],
    deliveryDetails: 'Ships in 1-2 business days.',
    returnPolicy: '30-day refund window.',
    shopId: 'shop-2',
    sellerId: 'user-seller-2',
    rating: 4.9,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-20',
    name: 'Cute Little Explorer Whimsical Map',
    description: 'A colorful, beautifully illustrated map of imaginary pastel islands, friendly dragons, and tiny treasure ships. Stimulates child imagination and beautifully decorates the playroom.',
    price: 15.99,
    discount: 5,
    stock: 75,
    images: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Posters',
    subcategory: 'Kids & Nursery Art',
    sizes: ['A3 (11.7" x 16.5")'],
    colors: ['Pastel World Mix'],
    tags: ['poster', 'nursery', 'playroom', 'map', 'whimsical'],
    deliveryDetails: 'Ships in 1 business day.',
    returnPolicy: '30-day exchange window.',
    shopId: 'shop-2',
    sellerId: 'user-seller-2',
    rating: 4.7,
    hidden: false,
    reviews: []
  },

  // --- GIFTS (prod-21 to prod-25) ---
  {
    id: 'prod-21',
    name: 'Cute Animal Ceramic Mug Set',
    description: 'Double the cuteness with this set of two hand-painted ceramic mugs. Includes one sweet smiling kitten mug and one cute puppy mug, complete with tiny clay ears and spoon accessories.',
    price: 29.99,
    discount: 10,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Gifts',
    subcategory: 'Mugs & Accessories',
    sizes: ['2-Pack Mug Set (350ml each)'],
    colors: ['Kitten Cream', 'Puppy Brown'],
    tags: ['gift', 'mug', 'ceramic', 'cute animals', 'kitchen'],
    deliveryDetails: 'Packed in high-density foam box. Ships in 2 days.',
    returnPolicy: 'Refund if broken on arrival.',
    shopId: 'shop-3',
    sellerId: 'user-seller-3',
    rating: 4.8,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-22',
    name: 'Aromatherapy Organic Candle Gift Pack',
    description: 'Indulge in absolute relaxation with three organic soy-wax candles. Scented with premium pure essential oils: Calm Lavender, Sweet Rosewater, and Energizing Wild Jasmine.',
    price: 25.00,
    discount: 0,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Gifts',
    subcategory: 'Gift Boxes',
    sizes: ['3x Mini Candles Pack (80g each)'],
    colors: ['Lavender Mix', 'Rose Gold Box'],
    tags: ['gift', 'candle', 'relax', 'soy wax', 'aromatherapy'],
    deliveryDetails: 'Ships in 1-2 business days.',
    returnPolicy: 'Returns for unopened box within 14 days.',
    shopId: 'shop-3',
    sellerId: 'user-seller-3',
    rating: 4.9,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-23',
    name: 'Happy Sunshine Tea & Mug Hamper',
    description: 'The sweetest gift hamper to brighten someones morning. Includes 1x custom daisy ceramic mug, 1x pack of organic loose-leaf chamomile citrus tea, and a mini glass jar of pure meadow honey with a wooden dipper.',
    price: 39.99,
    discount: 12,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Gifts',
    subcategory: 'Gift Boxes',
    sizes: ['Premium Gift Box'],
    colors: ['Warm Honeybox', 'Sweet Citrus'],
    tags: ['gift', 'hamper', 'tea', 'honey', 'mug'],
    deliveryDetails: 'Carefully wrapped. Ships in 2 business days.',
    returnPolicy: 'Returns for unopened kits only.',
    shopId: 'shop-3',
    sellerId: 'user-seller-3',
    rating: 5.0,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-24',
    name: 'Handcrafted Shell Candle Set of 3',
    description: 'A beautiful trio of sea shell shaped candles made of 100% natural soy wax and colored with premium pastel pigments. Makes a gorgeous decorative statement piece on any coffee table.',
    price: 18.99,
    discount: 0,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1602872030219-cbf9086e0a82?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Gifts',
    subcategory: 'Mugs & Accessories',
    sizes: ['Set of 3 Shells'],
    colors: ['Pastel Lilac', 'Baby Pink', 'Warm Sand'],
    tags: ['gift', 'candle', 'shell', 'handmade', 'decor'],
    deliveryDetails: 'Ships in 1-2 business days in cardboard gift wrap.',
    returnPolicy: '15-day exchange policy.',
    shopId: 'shop-3',
    sellerId: 'user-seller-3',
    rating: 4.8,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-25',
    name: 'Pastel Flower Coffee Mug with Coaster',
    description: 'Enjoy your morning brew in this stunning flower-petal ceramic mug. Crafted with a premium glossy glaze and paired with a matching cloud-shaped protective ceramic coaster.',
    price: 15.99,
    discount: 5,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Gifts',
    subcategory: 'Mugs & Accessories',
    sizes: ['350ml Mug'],
    colors: ['Buttercup Yellow', 'Lilac Breeze', 'Blush Cream'],
    tags: ['gift', 'mug', 'flower', 'ceramic', 'cozy'],
    deliveryDetails: 'Ships in 1 business day.',
    returnPolicy: '30-day refund window.',
    shopId: 'shop-3',
    sellerId: 'user-seller-3',
    rating: 4.9,
    hidden: false,
    reviews: []
  },

  // --- BIRTHDAY KIT (prod-26 to prod-30) ---
  {
    id: 'prod-26',
    name: 'Dinosaur Roar Birthday Theme Kit',
    description: 'Take your little explorer back in time! Contains 1x massive Dinosaur garland banner, 15x premium latex forest balloons, 8x cute green party hats, and 12x cartoon dinosaur cake and cupcake toppers.',
    price: 32.99,
    discount: 15,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Birthday Kit',
    subcategory: 'Party Packs',
    sizes: ['Standard Kit (Party of 10)'],
    colors: ['Sage Dinosaur Mix'],
    tags: ['birthday', 'dinosaur', 'party kit', 'decorations', 'balloons'],
    deliveryDetails: 'Ships in 1 business day.',
    returnPolicy: 'Full refund for unopened kit.',
    shopId: 'shop-3',
    sellerId: 'user-seller-3',
    rating: 4.8,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-27',
    name: 'Unicorn Dream Glitter Balloon Set',
    description: 'Transform any room into a magical sky with 30 biodegradable pearl balloons, beautiful iridescent star foil balloons, glitter confetti, and ribbon string.',
    price: 19.99,
    discount: 0,
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Birthday Kit',
    subcategory: 'Balloon Sets',
    sizes: ['30x Balloon Pack'],
    colors: ['Iridescent Pastel Rainbow'],
    tags: ['birthday', 'balloons', 'unicorn', 'decor', 'glitter'],
    deliveryDetails: 'Ships in 1 business day.',
    returnPolicy: '30-day exchange window.',
    shopId: 'shop-3',
    sellerId: 'user-seller-3',
    rating: 4.9,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-28',
    name: 'Sweet Donut Party Decor Set',
    description: 'Life is sweet, eat more donuts! Includes a wooden donut wall display stand, 1x "Grow Up" pastel banner, 10x paper donut plates, and matching napkins for the ultimate dessert station.',
    price: 28.50,
    discount: 10,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Birthday Kit',
    subcategory: 'Party Packs',
    sizes: ['Standard Set'],
    colors: ['Glazed Pastels Mix'],
    tags: ['birthday', 'donut', 'party decor', 'dessert stand', 'plates'],
    deliveryDetails: 'Ships in 2 business days.',
    returnPolicy: 'Refund within 14 days.',
    shopId: 'shop-3',
    sellerId: 'user-seller-3',
    rating: 4.7,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-29',
    name: 'Gold Starry Night Anniversary Banner & Lights',
    description: 'Add absolute elegance to your milestone birthday or anniversary. Contains 1x Gold glitter "Happy Birthday" cursive banner and 5 meters of warm white LED micro-fairy lights.',
    price: 22.00,
    discount: 0,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Birthday Kit',
    subcategory: 'Party Packs',
    sizes: ['LED Banner Set'],
    colors: ['Glitter Gold & White'],
    tags: ['birthday', 'anniversary', 'banner', 'fairy lights', 'decor'],
    deliveryDetails: 'Ships in 1-2 business days. Batteries not included.',
    returnPolicy: '30-day exchange window.',
    shopId: 'shop-3',
    sellerId: 'user-seller-3',
    rating: 4.9,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-30',
    name: 'Under the Sea Birthday Balloon Arch Kit',
    description: 'Build a spectacular marine arch with over 80 pearlized teal, marine blue, and silver chrome balloons, balloon strip tape, glue dots, and seashell paper wall decorations.',
    price: 36.99,
    discount: 20,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Birthday Kit',
    subcategory: 'Balloon Sets',
    sizes: ['Large Arch Kit (80+ Balloons)'],
    colors: ['Ocean Turquoise & Pearl silver'],
    tags: ['birthday', 'balloon arch', 'under the sea', 'party kit', 'balloons'],
    deliveryDetails: 'Ships in 1 business day with inflation guide.',
    returnPolicy: '30-day refund window.',
    shopId: 'shop-3',
    sellerId: 'user-seller-3',
    rating: 4.8,
    hidden: false,
    reviews: []
  },
  {
    id: 'prod-31',
    name: 'Happy Little Things Inspirational Oracle Card Deck',
    description: 'A beautiful deck of 32 pocket-sized inspirational oracle cards designed to bring daily joy, focus on positivity, and help you find serenity in the little things. Features lovely pastel illustrations and gentle mindfulness prompts to brighten your everyday routine.',
    price: 18.99,
    discount: 0,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Gifts',
    subcategory: 'Mindfulness & Oracle Cards',
    sizes: ['Standard Deck (88 x 125 mm)'],
    colors: ['Pastel Rainbow Box'],
    tags: ['oracle cards', 'inspiration', 'gift', 'positivity', 'mindfulness', 'cards'],
    deliveryDetails: 'Ships in 1-2 business days. Packed in a sturdy, gorgeous cardboard slider box.',
    returnPolicy: '30-day return policy for unopened and sealed decks.',
    shopId: 'shop-3',
    sellerId: 'user-seller-3',
    rating: 4.9,
    hidden: false,
    reviews: [
      { id: 'pr31a', buyerName: 'Elena R.', rating: 5, date: '2026-05-18', comment: 'An absolutely gorgeous deck! The cardstock feels very premium and the illustrations make me smile every morning.' }
    ]
  }
];

const INITIAL_USERS = [
  {
    id: 'user-buyer-1',
    name: 'Happy Buyer',
    email: 'buyer@happy.com',
    password: 'password',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    banned: false
  },
  {
    id: 'user-seller-1',
    name: 'Plushie Master',
    email: 'seller@happy.com',
    password: 'password',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    shopId: 'shop-1',
    banned: false
  },
  {
    id: 'user-seller-2',
    name: 'Paper Enthusiast',
    email: 'stationery@happy.com',
    password: 'password',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    shopId: 'shop-2',
    banned: false
  },
  {
    id: 'user-seller-3',
    name: 'Stoneware Artist',
    email: 'clay@happy.com',
    password: 'password',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    shopId: 'shop-3',
    banned: false
  },
  {
    id: 'user-admin-1',
    name: 'Happy Admin',
    email: 'admin@happy.com',
    password: 'password',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    banned: false
  }
];

const INITIAL_CHATS = [
  { id: 'msg-1', senderId: 'user-buyer-1', receiverId: 'user-seller-1', text: 'Hello! Is the Strawberry Bunny Plush coming back in stock soon in large size?', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 'msg-2', senderId: 'user-seller-1', receiverId: 'user-buyer-1', text: 'Hi there! Yes, we are planning to restock the large size next Monday! I can notify you if you like.', timestamp: new Date(Date.now() - 3600000 * 23).toISOString() }
];

export const MarketplaceProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // DB States
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [shops, setShops] = useState(() => {
    const saved = localStorage.getItem('shops');
    return saved ? JSON.parse(saved) : INITIAL_SHOPS;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  // Auth User State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    if (!saved || saved === 'null' || saved === '') return null;
    try { return JSON.parse(saved); } catch { return null; }
  });

  // Shopping States
  const [cart, setCart] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        const saved = localStorage.getItem(`cart_${user.id}`);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        const saved = localStorage.getItem(`wishlist_${user.id}`);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [followedShops, setFollowedShops] = useState(() => {
    const saved = localStorage.getItem('followedShops');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('recentlyViewed');
    return saved ? JSON.parse(saved) : [];
  });

  // Notifications State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'notif-1', userId: 'user-buyer-1', message: 'Welcome to SK Happy Little Things! Find your cute happiness here.', type: 'info', read: false },
      { id: 'notif-2', userId: 'user-seller-1', message: 'Your shop Bunny & Boba Creations is approved and active!', type: 'success', read: false }
    ];
  });

  // global toast alert notification
  const [toasts, setToasts] = useState([]);

  // Apply Theme class to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // On Mount: Sync data and set auth listener
  useEffect(() => {
    // 1. Fetch initial records from Supabase if table exists
    const fetchSupabaseData = async () => {
      try {
        const { data: dbProducts, error: prodErr } = await supabase.from('products').select('*');
        if (!prodErr && dbProducts && dbProducts.length > 0) {
          const parsedProducts = dbProducts.map(p => {
            try {
              const parsed = JSON.parse(p.description);
              if (parsed && typeof parsed === 'object' && ('fullDesc' in parsed || 'variants' in parsed)) {
                return {
                  ...p,
                  description: parsed.fullDesc || '',
                  shortDescription: parsed.shortDesc || '',
                  shortDesc: parsed.shortDesc || '',
                  video: parsed.video || '',
                  currency: parsed.currency || '$',
                  sku: parsed.sku || '',
                  status: parsed.status || 'In stock',
                  weight: parsed.weight || '',
                  dimensions: parsed.dimensions || '',
                  shippingCost: parsed.shippingCost || 0,
                  shippingCountries: parsed.shippingCountries || '',
                  metaTitle: parsed.metaTitle || '',
                  metaDescription: parsed.metaDescription || '',
                  slug: parsed.slug || '',
                  variants: parsed.variants || []
                };
              }
            } catch (e) {
              // Legacy standard string description
            }
            return p;
          });
          setProducts(parsedProducts);
        }
      } catch (err) {
        console.warn('Supabase product query error:', err);
      }

      try {
        const { data: dbShops, error: shopErr } = await supabase.from('shops').select('*');
        if (!shopErr && dbShops && dbShops.length > 0) {
          setShops(dbShops);
        }
      } catch (err) {
        console.warn('Supabase shops query error:', err);
      }
    };
    fetchSupabaseData();

    // 2. Auth session change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = session.user;
        let name = user.user_metadata?.name || 'User';
        let role = user.user_metadata?.role || 'buyer';
        let shopId = user.user_metadata?.shopId || null;

        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (profile) {
            name = profile.name || name;
            role = profile.role || role;
            shopId = profile.shop_id || shopId;
          } else {
            // Self-heal: insert profile if missing
            await supabase.from('profiles').insert([{
              id: user.id,
              name,
              email: user.email,
              role,
              shop_id: shopId
            }]);
          }

          // Self-heal: insert shop if missing
          if (role === 'seller' && shopId) {
            const { data: dbShop } = await supabase
              .from('shops')
              .select('*')
              .eq('id', shopId)
              .maybeSingle();

            if (!dbShop) {
              const defaultShop = {
                id: shopId,
                name: `${name}'s Cute Shop`,
                description: 'Welcome to my cute shop!',
                logo: 'https://images.unsplash.com/photo-1596495578065-6e076b8a9dad?w=200&auto=format&fit=crop&q=80',
                banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
                category: 'T-Shirts',
                contact: user.email,
                social: {},
                address: 'Main St, Cloud Town',
                sellerId: user.id,
                status: 'approved',
                rating: 5.0,
                followers: 0,
                reviews: []
              };

              await supabase.from('shops').insert([defaultShop]);

              // Update local shops state
              setShops(prev => {
                if (!prev.some(s => s.id === shopId)) {
                  return [...prev, defaultShop];
                }
                return prev;
              });
            }
          }
        } catch (err) {
          console.warn('Failed to fetch/heal user profile:', err);
        }

        const matchedUser = {
          id: user.id,
          name,
          email: user.email,
          role,
          shopId,
          avatar: user.user_metadata?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          banned: false
        };
        setCurrentUser(matchedUser);
      } else {
        // Only clear currentUser if it is NOT a local-only (demo) session.
        // Local sessions are tagged with _local:true and have no Supabase session.
        setCurrentUser(prev => {
          if (prev && prev._local) return prev; // keep local session alive
          return null;
        });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sync state to localstorage
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('shops', JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Sync cart & wishlist per logged-in user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser]);

  // Load user-specific cart and wishlist on auth change
  useEffect(() => {
    if (currentUser) {
      const userCart = localStorage.getItem(`cart_${currentUser.id}`);
      setCart(userCart ? JSON.parse(userCart) : []);

      const userWishlist = localStorage.getItem(`wishlist_${currentUser.id}`);
      setWishlist(userWishlist ? JSON.parse(userWishlist) : []);
    } else {
      setCart([]);
      setWishlist([]);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('followedShops', JSON.stringify(followedShops));
  }, [followedShops]);

  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Operations
  const login = async (email, password, role) => {
    // 1. Bypass demo admin email to ease dashboard verification
    if (email.toLowerCase() === 'admin@happy.com') {
      const foundUser = users.find(u => u.email.toLowerCase() === 'admin@happy.com');
      if (foundUser) {
        setCurrentUser({ ...foundUser, _local: true });
        showToast('Logged in as Demo Admin!', 'success');
        return true;
      }
    }

    let authResult = null;
    let authError = null;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      authResult = data;
      authError = error;
    } catch (err) {
      console.warn('Supabase signInWithPassword exception, falling back to local auth:', err);
      authError = err;
    }

    if (authError || !authResult?.user) {
      // Check if user exists but has a different role locally
      const existsWithDiffRole = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (existsWithDiffRole && existsWithDiffRole.role !== role) {
        showToast(`Unauthorized access. This account is registered as a ${existsWithDiffRole.role === 'seller' ? 'Seller' : 'Buyer'}. Please log in via the correct portal.`, 'error');
        return false;
      }

      // Fallback to local memory login for demo accounts if user didn't register them in Supabase auth yet!
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role);
      if (foundUser) {
        if (foundUser.banned) {
          showToast('This account has been banned by the Administrator.', 'error');
          return false;
        }
        // Tag as local session so onAuthStateChange won't wipe it
        setCurrentUser({ ...foundUser, _local: true });
        showToast(`Welcome back, ${foundUser.name}!`, 'success');
        return true;
      }
      showToast(authError?.message || 'Login failed. Please check your credentials.', 'error');
      return false;
    }

    const user = authResult.user;
    let userRole = user.user_metadata?.role || 'buyer';
    let userShopId = user.user_metadata?.shopId || null;
    let userName = user.user_metadata?.name || 'User';

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        userName = profile.name || userName;
        userRole = profile.role || userRole;
        userShopId = profile.shop_id || userShopId;
      }
    } catch (err) {
      console.warn('Failed to fetch user profile in login:', err);
    }

    if (role === 'admin' && userRole !== 'admin') {
      showToast('Unauthorized access. Admin portal requires admin privileges.', 'error');
      await supabase.auth.signOut();
      return false;
    }

    if (role === 'buyer' && userRole !== 'buyer') {
      showToast('Unauthorized access. This account is registered as a Seller. Please log in via the Seller Hub.', 'error');
      await supabase.auth.signOut();
      return false;
    }

    if (role === 'seller' && userRole !== 'seller') {
      showToast('Unauthorized access. This account is registered as a Buyer. Please log in via the Buyer Portal.', 'error');
      await supabase.auth.signOut();
      return false;
    }

    const matchedUser = {
      id: user.id,
      name: userName,
      email: user.email,
      role: userRole,
      shopId: userShopId,
      avatar: user.user_metadata?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      banned: false
    };

    setCurrentUser(matchedUser);
    showToast(`Welcome back, ${matchedUser.name}!`, 'success');
    return true;
  };

  const loginWithGoogle = async (email, role) => {
    // Check if email already exists with a DIFFERENT role
    const existsWithDiffRole = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existsWithDiffRole && existsWithDiffRole.role !== role) {
      showToast(`Unauthorized access. This account is registered as a ${existsWithDiffRole.role === 'seller' ? 'Seller' : 'Buyer'}. Please log in via the correct portal.`, 'error');
      return false;
    }

    // 1. Check if user already exists
    let foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (foundUser) {
      setCurrentUser(foundUser);
      showToast(`Google Login Successful! Welcome ${foundUser.name}!`, 'success');
      return true;
    }

    // 2. Otherwise create a mock user representing Google OAuth response
    const name = email.split('@')[0].replace('.', ' ');
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    const newUser = {
      id: 'user-google-' + Date.now(),
      name: formattedName,
      email: email,
      password: 'google-oauth-pwd',
      role: role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      banned: false
    };

    if (role === 'seller') {
      const shopId = 'shop-' + Date.now();
      newUser.shopId = shopId;
      const newShop = {
        id: shopId,
        name: `${formattedName}'s Cute Shop`,
        description: 'A brand new shop filled with cute items.',
        logo: 'https://images.unsplash.com/photo-1596495578065-6e076b8a9dad?w=200&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
        category: 'Other',
        contact: email,
        social: {},
        address: 'Main St, Cloud Town',
        sellerId: newUser.id,
        status: 'pending',
        rating: 0,
        followers: 0,
        reviews: []
      };
      setShops(prev => [...prev, newShop]);
    }

    setUsers(prev => [...prev, newUser]);
    setCurrentUser({ ...newUser, _local: true });
    showToast(`Google Login Successful! Welcome ${formattedName}!`, 'success');
    return true;
  };

  const logout = async () => {
    // Clear local session flag first
    localStorage.removeItem('currentUser');
    // Attempt Supabase signout (may no-op for local sessions)
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout exception:', e);
    }
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
    showToast('Logged out successfully. See you soon!', 'info');
  };

  const signup = async (name, email, password, role, shopDetails = null) => {
    // Check if email already exists locally first to prevent duplicate accounts
    const localExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (localExists) {
      showToast('An account with this email address already exists.', 'error');
      return false;
    }

    const shopId = role === 'seller' ? 'shop-' + Date.now() : null;

    let authResult = null;
    let authError = null;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            shopId,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          }
        }
      });
      authResult = data;
      authError = error;
    } catch (err) {
      console.warn('Supabase signUp exception, falling back to local registration:', err);
      authError = err;
    }

    if (authError || !authResult?.user) {
      // Fallback: Create a mock user in local memory
      const newUser = {
        id: 'user-' + Date.now(),
        name,
        email,
        password,
        role,
        shopId,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        banned: false
      };

      if (role === 'seller') {
        const newShop = {
          id: shopId,
          name: shopDetails?.shopName || `${name}'s Cute Shop`,
          description: shopDetails?.description || 'Welcome to my cute shop!',
          logo: shopDetails?.logo || 'https://images.unsplash.com/photo-1596495578065-6e076b8a9dad?w=200&auto=format&fit=crop&q=80',
          banner: shopDetails?.banner || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
          category: shopDetails?.category || 'Other',
          contact: shopDetails?.contact || email,
          social: shopDetails?.social || {},
          address: shopDetails?.address || 'Main St, Cloud Town',
          sellerId: newUser.id,
          status: 'pending',
          rating: 0,
          followers: 0,
          reviews: []
        };
        setShops(prev => [...prev, newShop]);
      }

      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      showToast(`Account created (Local Session)! Welcome ${name}!`, 'success');
      return true;
    }

    const user = authResult.user;
    
    // Check if email confirmation is required (session is null on signup)
    if (!authResult.session) {
      showToast('Registration successful! Please check your email to confirm, OR turn off "Confirm email" in your Supabase settings to log in instantly.', 'warning');
      return true;
    }

    const newUser = {
      id: user.id,
      name,
      email,
      role,
      shopId,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      banned: false
    };

    if (role === 'seller' && shopDetails) {
      const newShop = {
        id: shopId,
        name: shopDetails.shopName,
        description: shopDetails.description || 'Welcome to my cute shop!',
        logo: shopDetails.logo || 'https://images.unsplash.com/photo-1596495578065-6e076b8a9dad?w=200&auto=format&fit=crop&q=80',
        banner: shopDetails.banner || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
        category: shopDetails.category || 'Other',
        contact: shopDetails.contact || email,
        social: shopDetails.social || {},
        address: shopDetails.address || 'Address provided at registry',
        sellerId: user.id,
        status: 'pending',
        rating: 0,
        followers: 0,
        reviews: []
      };

      try {
        await supabase.from('shops').insert([{
          id: newShop.id,
          name: newShop.name,
          description: newShop.description,
          logo: newShop.logo,
          banner: newShop.banner,
          category: newShop.category,
          contact: newShop.contact,
          social: newShop.social,
          address: newShop.address,
          "sellerId": user.id,
          status: newShop.status,
          rating: Number(newShop.rating),
          followers: Number(newShop.followers),
          reviews: newShop.reviews
        }]);
      } catch (err) {
        console.warn('Supabase shops table insert failed:', err);
      }
      setShops(prev => [...prev, newShop]);
      addNotification('user-admin-1', `New shop approval request: "${newShop.name}" from ${name}`, 'info');
    }

    try {
      await supabase.from('profiles').insert([{ id: user.id, name, email, role, shop_id: shopId }]);
    } catch (err) {
      console.warn('Supabase profiles table insert failed:', err);
    }

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast('Registration successful! Welcome!', 'success');
    return true;
  };

  const mockForgotPassword = (email) => {
    showToast(`Password reset link sent to ${email}!`, 'info');
    return true;
  };

  // Cart Operations
  const addToCart = (productId, quantity = 1, color = '', size = '') => {
    if (!currentUser) {
      showToast('Please login to add items to your cart!', 'warning');
      return false;
    }
    const product = products.find(p => p.id === productId);
    if (!product) return false;

    if (product.stock < quantity) {
      showToast('Requested quantity exceeds stock!', 'error');
      return false;
    }

    setCart((prev) => {
      const index = prev.findIndex(item => item.productId === productId && item.color === color && item.size === size);
      if (index > -1) {
        const newCart = [...prev];
        const newQty = newCart[index].quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Sorry, only ${product.stock} items left in stock.`, 'error');
          return prev;
        }
        newCart[index].quantity = newQty;
        showToast('Updated quantity in cart!', 'success');
        return newCart;
      } else {
        showToast(`Added ${product.name} to cart!`, 'success');
        return [...prev, { productId, quantity, color, size }];
      }
    });
    return true;
  };

  const updateCartQuantity = (productId, quantity, color = '', size = '') => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (quantity > product.stock) {
      showToast(`Only ${product.stock} items in stock.`, 'warning');
      return;
    }

    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter(item => !(item.productId === productId && item.color === color && item.size === size));
      }
      return prev.map(item => 
        (item.productId === productId && item.color === color && item.size === size)
          ? { ...item, quantity }
          : item
      );
    });
  };

  const removeFromCart = (productId, color = '', size = '') => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.color === color && item.size === size)));
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Operations
  const toggleWishlist = (productId) => {
    if (!currentUser) {
      showToast('Please login to manage your wishlist!', 'warning');
      return;
    }
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist.', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  // Shop Follow System
  const followShop = async (shopId) => {
    if (!currentUser) {
      showToast('Please login to follow shops!', 'warning');
      return;
    }
    
    const exists = followedShops.includes(shopId);
    
    // Safely capture current follower count from local state before setting the state asynchronously
    const currentShop = shops.find(s => s.id === shopId);
    const latestFollowers = exists
      ? Math.max(0, Number(currentShop?.followers || 0) - 1)
      : Number(currentShop?.followers || 0) + 1;
    
    // Update local shops state immediately
    setShops(prevShops => {
      const updated = prevShops.map(s => {
        if (s.id === shopId) {
          return { ...s, followers: latestFollowers };
        }
        return s;
      });
      return updated;
    });

    // Update followedShops list immediately
    setFollowedShops((prev) => {
      if (exists) {
        showToast('Unfollowed shop.', 'info');
        return prev.filter(id => id !== shopId);
      } else {
        showToast('Thank you for following! 🌸', 'success');
        return [...prev, shopId];
      }
    });

    // Sync to Supabase in background (non-blocking)
    if (currentUser && !currentUser._local) {
      try {
        const { error } = await supabase.from('shops').update({ followers: latestFollowers }).eq('id', shopId);
        if (error) console.warn('Supabase followers update error:', error.message);
      } catch (err) {
        console.warn('Supabase followers exception:', err);
      }
    }
  };

  // Recently Viewed
  const addRecentlyViewed = (productId) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 6); // Max 6 items
    });
  };

  // Order Placement
  const placeOrder = (shippingAddress, paymentMethod, couponCode = '') => {
    if (!currentUser) return null;
    if (cart.length === 0) return null;

    // Verify stock and calculate totals
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart) {
      const product = products.find(p => p.id === item.productId);
      if (!product) continue;
      
      if (product.stock < item.quantity) {
        showToast(`Product ${product.name} is out of stock in requested quantity.`, 'error');
        return null;
      }

      const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
      subtotal += discountedPrice * item.quantity;
      
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        finalPrice: discountedPrice,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        shopId: product.shopId,
        sellerId: product.sellerId
      });
    }

    let discountAmount = 0;
    if (couponCode.toUpperCase() === 'HAPPY10') {
      discountAmount = subtotal * 0.1;
      showToast('10% Coupon Applied!', 'success');
    } else if (couponCode.toUpperCase() === 'CUTE20') {
      discountAmount = subtotal * 0.2;
      showToast('20% Coupon Applied!', 'success');
    }

    const total = subtotal - discountAmount;
    const orderId = 'ord-' + Date.now().toString().slice(-6);

    const newOrder = {
      id: orderId,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      items: orderItems,
      subtotal,
      discountAmount,
      total,
      shippingAddress,
      paymentMethod,
      couponCode,
      status: 'pending', // pending, processed, shipped, delivered, cancelled
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
      date: new Date().toISOString()
    };

    // Decrease product stocks
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartItem = cart.find(ci => ci.productId === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      });
    });

    // Save order
    setOrders(prev => [newOrder, ...prev]);

    // Send notifications to sellers
    const uniqueSellers = [...new Set(orderItems.map(item => item.sellerId))];
    uniqueSellers.forEach(sellerId => {
      const sellerItems = orderItems.filter(item => item.sellerId === sellerId);
      const itemsDesc = sellerItems.map(item => `${item.quantity}x ${item.name}`).join(', ');
      addNotification(sellerId, `New order received (#${orderId}): ${itemsDesc}`, 'success');
    });

    // Send notification to buyer
    addNotification(currentUser.id, `Order placed successfully! Track order #${orderId}.`, 'success');
    
    // Clear cart
    setCart([]);
    showToast(`Order placed successfully! Order ID: #${orderId}`, 'success');
    return newOrder;
  };

  // Seller Shop Settings
  const createShop = async (shopData) => {
    if (!currentUser || currentUser.role !== 'seller') return;
    const newShop = {
      id: 'shop-' + Date.now(),
      name: shopData.name,
      description: shopData.description,
      logo: shopData.logo || 'https://images.unsplash.com/photo-1596495578065-6e076b8a9dad?w=200&auto=format&fit=crop&q=80',
      banner: shopData.banner || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      category: shopData.category,
      contact: shopData.contact,
      social: shopData.social || {},
      address: shopData.address,
      sellerId: currentUser.id,
      status: 'pending', // Starts as pending admin approval
      rating: 0,
      followers: 0,
      reviews: []
    };

    try {
      const { error: shopErr } = await supabase.from('shops').insert([{
        id: newShop.id,
        name: newShop.name,
        description: newShop.description,
        logo: newShop.logo,
        banner: newShop.banner,
        category: newShop.category,
        contact: newShop.contact,
        social: newShop.social,
        address: newShop.address,
        sellerId: newShop.sellerId,
        status: newShop.status,
        rating: Number(newShop.rating),
        followers: Number(newShop.followers),
        reviews: newShop.reviews
      }]);

      if (shopErr) {
        console.warn('Supabase create shop error:', shopErr.message);
      }

      const { error: profileErr } = await supabase
        .from('profiles')
        .update({ shop_id: newShop.id })
        .eq('id', currentUser.id);

      if (profileErr) {
        console.warn('Supabase profile shop_id update error:', profileErr.message);
      }
      
      await supabase.auth.updateUser({
        data: { shopId: newShop.id }
      });
    } catch (err) {
      console.warn('Supabase createShop exception:', err);
    }

    setShops(prev => [...prev, newShop]);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, shopId: newShop.id } : u));
    setCurrentUser(prev => ({ ...prev, shopId: newShop.id }));
    addNotification('user-admin-1', `New shop registered: "${newShop.name}" awaits approval.`, 'info');
    showToast('Shop registered! Awaiting admin approval.', 'success');
  };

  const updateShop = async (shopId, shopData) => {
    try {
      const { error } = await supabase
        .from('shops')
        .update({
          name: shopData.name,
          description: shopData.description,
          logo: shopData.logo,
          banner: shopData.banner,
          category: shopData.category,
          contact: shopData.contact,
          address: shopData.address
        })
        .eq('id', shopId);

      if (error) {
        console.warn('Supabase shop update error:', error.message);
      }
    } catch (err) {
      console.warn('Supabase updateShop exception:', err);
    }

    setShops(prev => prev.map(s => s.id === shopId ? { ...s, ...shopData } : s));
    showToast('Shop details updated successfully!', 'success');
  };

  // Helper to sanitize product metadata for Supabase standard schema
  const sanitizeProductForSupabase = (prod) => {
    const descriptionPayload = JSON.stringify({
      fullDesc: prod.description || '',
      shortDesc: prod.shortDescription || prod.shortDesc || '',
      video: prod.video || '',
      currency: prod.currency || '$',
      sku: prod.sku || '',
      status: prod.status || 'In stock',
      weight: prod.weight || '',
      dimensions: prod.dimensions || '',
      shippingCost: Number(prod.shippingCost) || 0,
      shippingCountries: prod.shippingCountries || '',
      metaTitle: prod.metaTitle || '',
      metaDescription: prod.metaDescription || '',
      slug: prod.slug || '',
      variants: prod.variants || []
    });

    return {
      id: prod.id,
      name: prod.name,
      description: descriptionPayload,
      price: Number(prod.price) || 0,
      discount: Number(prod.discount) || 0,
      stock: Number(prod.stock) || 0,
      category: prod.category || '',
      subcategory: prod.subcategory || '',
      images: prod.images || [],
      sizes: prod.sizes || [],
      colors: prod.colors || [],
      tags: prod.tags || [],
      deliveryDetails: prod.deliveryDetails || '',
      returnPolicy: prod.returnPolicy || '',
      shopId: prod.shopId,
      sellerId: prod.sellerId,
      rating: Number(prod.rating) || 5.0,
      reviews: prod.reviews || [],
      hidden: prod.hidden || false
    };
  };

  // Seller Product Operations
  const addProduct = async (prodData) => {
    const newProd = {
      id: 'prod-' + Date.now(),
      ...prodData,
      rating: 5.0,
      reviews: [],
      hidden: false
    };

    if (currentUser && !currentUser._local) {
      try {
        const dbPayload = sanitizeProductForSupabase(newProd);
        const { error } = await supabase.from('products').insert([dbPayload]);
        if (error) {
          console.warn('Supabase products table insert error:', error.message);
        } else {
          showToast(`Product "${newProd.name}" saved to Supabase!`, 'success');
        }
      } catch (err) {
        console.warn('Supabase connection error:', err);
      }
    } else {
      console.log('Skipping Supabase insert for local/demo seller session.');
    }

    setProducts(prev => [newProd, ...prev]);
    showToast(`Product "${newProd.name}" added successfully!`, 'success');
  };

  const updateProduct = async (productId, prodData) => {
    if (currentUser && !currentUser._local) {
      try {
        const dbPayload = sanitizeProductForSupabase({ id: productId, ...prodData });
        const { error } = await supabase.from('products').update(dbPayload).eq('id', productId);
        if (error) {
          console.warn('Supabase product update error:', error.message);
        } else {
          showToast('Product synced to Supabase!', 'success');
        }
      } catch (err) {
        console.warn('Supabase connection error:', err);
      }
    } else {
      console.log('Skipping Supabase update for local/demo seller session.');
    }

    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...prodData } : p));
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = async (productId) => {
    if (currentUser && !currentUser._local) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', productId);
        if (error) {
          console.warn('Supabase product delete error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase connection error:', err);
      }
    } else {
      console.log('Skipping Supabase delete for local/demo seller session.');
    }

    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product deleted.', 'info');
  };

  const toggleHideProduct = (productId) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextState = !p.hidden;
        showToast(nextState ? 'Product hidden from shop.' : 'Product is now visible!', 'info');
        return { ...p, hidden: nextState };
      }
      return p;
    }));
  };

  // Reviews
  const addReview = (productId, rating, comment) => {
    if (!currentUser) return;
    const reviewId = 'rev-' + Date.now();
    const newReview = {
      id: reviewId,
      buyerName: currentUser.name,
      rating: Number(rating),
      date: new Date().toISOString().split('T')[0],
      comment
    };

    setProducts(prevProducts => prevProducts.map(p => {
      if (p.id === productId) {
        const updatedReviews = [newReview, ...p.reviews];
        const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        // Update product reviews
        return {
          ...p,
          reviews: updatedReviews,
          rating: Number(avgRating.toFixed(1))
        };
      }
      return p;
    }));

    showToast('Review submitted! Thank you.', 'success');
  };

  // Chats Operations
  const sendMessage = (receiverId, text) => {
    if (!currentUser) return;
    const newMsg = {
      id: 'msg-' + Date.now(),
      senderId: currentUser.id,
      receiverId,
      text,
      timestamp: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, newMsg]);

    // Send a mock seller response if the buyer initiates a chat, simulating real time interactive reply!
    const receiver = users.find(u => u.id === receiverId);
    if (receiver && receiver.role === 'seller' && currentUser.role === 'buyer') {
      setTimeout(() => {
        const responseMsg = {
          id: 'msg-reply-' + Date.now(),
          senderId: receiverId,
          receiverId: currentUser.id,
          text: `Thank you for your message! This is a automatic cute reply from "${shops.find(s => s.sellerId === receiverId)?.name || 'Seller'}". We will get back to you shortly! ♥`,
          timestamp: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, responseMsg]);
        addNotification(currentUser.id, `New message from ${receiver.name}`, 'info');
      }, 3000);
    }
  };

  // Notification Operations
  const addNotification = (userId, message, type = 'info') => {
    const newNotif = {
      id: 'notif-' + Date.now(),
      userId,
      message,
      type,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = (userId) => {
    setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n));
  };

  // Admin Actions
  const approveShop = (shopId) => {
    setShops(prev => prev.map(s => {
      if (s.id === shopId) {
        addNotification(s.sellerId, `Congratulations! Your shop "${s.name}" has been approved. You can now post products!`, 'success');
        return { ...s, status: 'approved' };
      }
      return s;
    }));
    showToast('Shop approved successfully!', 'success');
  };

  const toggleBanUser = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextState = !u.banned;
        showToast(nextState ? `User ${u.name} has been banned.` : `User ${u.name} unbanned.`, 'info');
        return { ...u, banned: nextState };
      }
      return u;
    }));
  };

  // Update User Profile (name, avatar, etc.)
  const updateUser = async (updates) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };

    if (!currentUser._local) {
      try {
        // 1. Update Supabase Auth user metadata
        const authData = {};
        if (updates.name) authData.name = updates.name;
        if (updates.avatar) authData.avatar = updates.avatar;

        if (Object.keys(authData).length > 0) {
          const { error: authErr } = await supabase.auth.updateUser({
            data: authData
          });
          if (authErr) console.warn('Supabase auth metadata update error:', authErr.message);
        }

        // 2. Update Supabase profiles table
        if (updates.name) {
          const { error: profileErr } = await supabase
            .from('profiles')
            .update({ name: updates.name })
            .eq('id', currentUser.id);
          if (profileErr) console.warn('Supabase profile update error:', profileErr.message);
        }
      } catch (err) {
        console.warn('Supabase updateUser exception:', err);
      }
    }

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updates } : u));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    showToast('Profile updated successfully! 🌸', 'success');
  };

  const toggleDarkMode = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    showToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode!`, 'info');
  };

  return (
    <MarketplaceContext.Provider value={{
      theme,
      toggleDarkMode,
      currentUser,
      users,
      shops,
      products,
      cart,
      wishlist,
      orders,
      chatMessages,
      notifications,
      followedShops,
      recentlyViewed,
      toasts,
      removeToast,
      login,
      loginWithGoogle,
      logout,
      signup,
      mockForgotPassword,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      followShop,
      addRecentlyViewed,
      placeOrder,
      createShop,
      updateShop,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleHideProduct,
      addReview,
      sendMessage,
      markNotificationsAsRead,
      approveShop,
      toggleBanUser,
      updateUser,
      showToast
    }}>
      {children}
      {/* Dynamic Toast Renderer */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '350px'
      }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{
            background: toast.type === 'error' ? 'linear-gradient(135deg, #FF6B6B, #FF8787)' :
                        toast.type === 'warning' ? 'linear-gradient(135deg, #FFA94D, #FFD43B)' :
                        toast.type === 'info' ? 'linear-gradient(135deg, #74C0FC, #A5D8FF)' :
                        'linear-gradient(135deg, #FF758F, #A78BFA)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Quicksand, sans-serif',
            fontWeight: 600,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'between',
            gap: '12px',
            animation: 'slideIn 0.3s ease forwards'
          }}>
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              opacity: 0.8
            }}>×</button>
          </div>
        ))}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slideIn {
            from { transform: translateX(100%) scale(0.9); opacity: 0; }
            to { transform: translateX(0) scale(1); opacity: 1; }
          }
        `}} />
      </div>
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
