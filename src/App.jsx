import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OpeningLoader from './components/OpeningLoader';
import Home from './pages/Home';
import About from './pages/About';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import ProductDetails from './pages/ProductDetails';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import BuyerProfile from './pages/BuyerProfile';
import SellerDashboard from './pages/SellerDashboard';
import AdminPanel from './pages/AdminPanel';
import Categories from './pages/Categories';
import Trending from './pages/Trending';
import Shops from './pages/Shops';
import Offers from './pages/Offers';
import BestSellers from './pages/BestSellers';
import Orders from './pages/Orders';
import Tshirts from './pages/Tshirts';
import Gifts from './pages/Gifts';
import BirthdayKits from './pages/BirthdayKits';
import Posters from './pages/Posters';
import Policy from './pages/Policy';
import Contact from './pages/Contact';
import AddProduct from './pages/AddProduct';

// Guard: Only sellers can access this route
function SellerRoute({ children }) {
  const { currentUser } = useMarketplace();
  if (!currentUser) return <Navigate to="/auth?role=seller" replace />;
  if (currentUser.role !== 'seller') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh', gap: '16px',
        fontFamily: 'var(--font-heading)', textAlign: 'center', padding: '40px'
      }}>
        <span style={{ fontSize: '3rem' }}>🚫</span>
        <h2 style={{ color: 'var(--primary)' }}>Seller Access Only</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
          The Seller Dashboard is only accessible to registered seller accounts.
          Your current account is a <strong>{currentUser.role}</strong> account.
        </p>
        <a href="/#/auth?role=seller" style={{
          padding: '10px 24px', background: 'var(--primary)', color: 'white',
          borderRadius: '8px', textDecoration: 'none', fontWeight: '700'
        }}>Login as Seller</a>
      </div>
    );
  }
  return children;
}

// Guard: Only buyers can access this route
function BuyerRoute({ children }) {
  const { currentUser } = useMarketplace();
  if (!currentUser) return <Navigate to="/auth?role=buyer" replace />;
  if (currentUser.role !== 'buyer') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh', gap: '16px',
        fontFamily: 'var(--font-heading)', textAlign: 'center', padding: '40px'
      }}>
        <span style={{ fontSize: '3rem' }}>🚫</span>
        <h2 style={{ color: 'var(--primary)' }}>Buyer Access Only</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
          Your profile page is only accessible to buyer accounts.
          Your current account is a <strong>{currentUser.role}</strong> account.
        </p>
        <a href="/#/auth?role=buyer" style={{
          padding: '10px 24px', background: 'var(--primary)', color: 'white',
          borderRadius: '8px', textDecoration: 'none', fontWeight: '700'
        }}>Login as Buyer</a>
      </div>
    );
  }
  return children;
}

// Guard: Only admins can access this route
function AdminRoute({ children }) {
  const { currentUser } = useMarketplace();
  if (!currentUser) return <Navigate to="/auth" replace />;
  if (currentUser.role !== 'admin') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh', gap: '16px',
        fontFamily: 'var(--font-heading)', textAlign: 'center', padding: '40px'
      }}>
        <span style={{ fontSize: '3rem' }}>🔒</span>
        <h2 style={{ color: 'var(--primary)' }}>Admin Access Only</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
          This area requires administrator privileges.
        </p>
        <a href="/#/" style={{
          padding: '10px 24px', background: 'var(--primary)', color: 'white',
          borderRadius: '8px', textDecoration: 'none', fontWeight: '700'
        }}>Go Home</a>
      </div>
    );
  }
  return children;
}

export default function App() {
  return (
    <MarketplaceProvider>
      <OpeningLoader />
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
              <Route path="/shop/:shopId" element={<Shop />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<BuyerRoute><BuyerProfile /></BuyerRoute>} />
              <Route path="/seller-dashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
              <Route path="/categories" element={<Categories />} />
              <Route style={{ contentVisibility: 'auto' }} path="/trending" element={<Trending />} />
              <Route path="/shops" element={<Shops />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/best-sellers" element={<BestSellers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/tshirts" element={<Tshirts />} />
              <Route path="/gifts" element={<Gifts />} />
              <Route path="/birthday-kits" element={<BirthdayKits />} />
              <Route path="/posters" element={<Posters />} />
              <Route path="/policy" element={<Policy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/add-product" element={<SellerRoute><AddProduct /></SellerRoute>} />
              <Route path="/edit-product/:productId" element={<SellerRoute><AddProduct /></SellerRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </MarketplaceProvider>
  );
}
