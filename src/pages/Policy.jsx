import React, { useState } from 'react';
import { ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';

export default function Policy() {
  const [activeTab, setActiveTab] = useState('shipping');

  const tabs = [
    { id: 'shipping', label: '🚚 Shipping Policy', icon: <Truck size={16} /> },
    { id: 'returns', label: '🔄 Returns & Refunds', icon: <RotateCcw size={16} /> },
    { id: 'privacy', label: '🔒 Privacy Policy', icon: <ShieldCheck size={16} /> },
    { id: 'terms', label: '📄 Terms of Service', icon: <FileText size={16} /> }
  ];

  return (
    <div className="policy-page container" style={{ paddingTop: '30px', paddingBottom: '60px', maxWidth: '900px' }}>
      <div className="text-center" style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>Store Policies</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Understand our guidelines regarding delivery, refunds, terms, and privacy.</p>
      </div>

      {/* Policies Navigation */}
      <div style={{
        display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center',
        background: 'var(--primary-light)', padding: '8px', borderRadius: '15px',
        marginBottom: '45px'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{
              padding: '10px 20px', borderRadius: '10px', fontSize: '0.9rem',
              margin: 0, display: 'inline-flex', alignItems: 'center', gap: '8px'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Policy Content Area */}
      <div className="card animate-fade" style={{ padding: '40px', lineHeight: '1.7', fontSize: '1.02rem' }}>
        {activeTab === 'shipping' && (
          <div>
            <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>🚚 Delivery & Shipping Policy</h2>
            <p>We work with global small businesses and premium makers who package every single order with immense care. Here are our standard shipping guidelines:</p>
            <h3 style={{ marginTop: '20px', fontSize: '1.2rem' }}>1. Processing Times</h3>
            <p>Since most of our cute products are handmade, custom-printed, or compiled to order, standard processing takes **1 to 3 business days**. During holiday surges, processing may take up to 5 days.</p>
            <h3 style={{ marginTop: '20px', fontSize: '1.2rem' }}>2. Estimated Delivery</h3>
            <ul>
              <li><strong>Domestic Standard Shipping:</strong> 3-7 business days.</li>
              <li><strong>Express Delivery:</strong> 1-3 business days.</li>
              <li><strong>Worldwide International Shipping:</strong> 7-20 business days depending on customs queues.</li>
            </ul>
            <h3 style={{ marginTop: '20px', fontSize: '1.2rem' }}>3. Tracking Your Shipment</h3>
            <p>Once your maker ships your package, you will receive an automatic email with a tracking number. You can also view shipping updates directly inside your **My Orders** portal.</p>
          </div>
        )}

        {activeTab === 'returns' && (
          <div>
            <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>🔄 Returns, Refunds, & Exchange Policy</h2>
            <p>Your absolute happiness is our #1 priority. If a plushie, tee, or poster isn't to your liking, we offer generous return procedures:</p>
            <h3 style={{ marginTop: '20px', fontSize: '1.2rem' }}>1. Return Eligibility Window</h3>
            <p>You can return or exchange any item within **14 days** of receiving your package. To be eligible, the item must be unworn, unused, in its original packaging, and with tags attached.</p>
            <h3 style={{ marginTop: '20px', fontSize: '1.2rem' }}>2. Non-Returnable Listings</h3>
            <p>We are unable to accept returns for **fully customized gift hampers** or custom-named designs once processed, unless they arrive damaged or defective.</p>
            <h3 style={{ marginTop: '20px', fontSize: '1.2rem' }}>3. Refund Handling</h3>
            <p>Once your returned parcel is delivered back to the maker, a full refund will be processed to your original payment method within **3-5 business days**.</p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div>
            <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>🔒 Privacy & Safety Policy</h2>
            <p>At SK Happy Little Things, we respect your confidentiality. We implement strict security layers to ensure your experience is fully safe:</p>
            <h3 style={{ marginTop: '20px', fontSize: '1.2rem' }}>1. Information We Collect</h3>
            <p>We collect essential details to complete your shipping (Name, Address, Email) and to secure your buyer account. We do not store full credit card credentials on our servers.</p>
            <h3 style={{ marginTop: '20px', fontSize: '1.2rem' }}>2. Third-Party Integrations</h3>
            <p>We integrate secure processing channels (Supabase database layers and Stripe OAuth components) to execute checkouts safely. Your data is never sold or distributed to third-party marketing companies.</p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div>
            <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>📄 Terms of Service Agreement</h2>
            <p>Welcome to our cute marketplace! By navigating or buying from our store, you agree to comply with our standard Terms of Service:</p>
            <h3 style={{ marginTop: '20px', fontSize: '1.2rem' }}>1. Authentic Information</h3>
            <p>You agree to supply exact, up-to-date account details when placing orders or registers. Providing fraudulent credentials may result in profile suspensions.</p>
            <h3 style={{ marginTop: '20px', fontSize: '1.2rem' }}>2. Creative Copyrights</h3>
            <p>All wall-art, character illustrations, and caps are the legal copyrights of our creative independent makers. Re-selling or distributing designs without consent is strictly prohibited.</p>
          </div>
        )}
      </div>
    </div>
  );
}
