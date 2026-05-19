import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { MarketplaceProvider } from './context/MarketplaceContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

export default function App() {
  return (
    <MarketplaceProvider>
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
              <Route path="/profile" element={<BuyerProfile />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </MarketplaceProvider>
  );
}
