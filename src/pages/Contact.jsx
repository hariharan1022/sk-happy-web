import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export default function Contact() {
  const { showToast } = useMarketplace();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    setTimeout(() => {
      showToast('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.', 'success');
      setName('');
      setEmail('');
      setMessage('');
      setSubmitting(false);
    }, 1200);
  };

  const faqs = [
    { q: '🌸 How long does processing take?', a: 'Standard orders are compiled, packed, and shipped within 1-3 business days. Custom boxes can take up to 5 days.' },
    { q: '📦 Can I customize my gift set?', a: 'Absolutely! Send a chat directly to the maker or write details in the checkout comments, and they will arrange custom products.' },
    { q: '✨ Do you ship internationally?', a: 'Yes! We ship worldwide. International orders standard shipping takes 7-20 business days.' },
    { q: '👕 What is the t-shirt material?', a: 'Our premium tees are crafted from 100% organic ring-spun cotton, printed with wash-safe eco-friendly dyes.' }
  ];

  return (
    <div className="contact-page container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      <div className="text-center" style={{ marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>Contact Us</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Have questions, custom order queries, or need help? Reach out to our happy support team!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', marginBottom: '60px' }} className="grid-responsive-layout">
        {/* Contact Form */}
        <div className="card" style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            ✉️ Send a Message
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Your name..." 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="example@mail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Your Message</label>
              <textarea 
                className="form-control" 
                rows={5} 
                placeholder="How can we help you bring happy little crafts to your home?" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={submitting}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', padding: '12px 24px', fontSize: '1rem', alignSelf: 'start', margin: 0
              }}
            >
              {submitting ? 'Sending...' : <>Send Message <Send size={16} /></>}
            </button>
          </form>
        </div>

        {/* Contact Info and Hours */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Details */}
          <div className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '5px' }}>Store Details</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-secondary)' }}>
              <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '50%', color: 'var(--primary)', display: 'flex' }}>
                <Mail size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Email Us</span>
                <strong>hello@skhappyweb.com</strong>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-secondary)' }}>
              <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '50%', color: 'var(--primary)', display: 'flex' }}>
                <Phone size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Call Us</span>
                <strong>+1 (800) 123-4567</strong>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-secondary)' }}>
              <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '50%', color: 'var(--primary)', display: 'flex' }}>
                <MapPin size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Location</span>
                <strong>123 Sweet Pastel Lane, Cloud City</strong>
              </div>
            </div>
          </div>

          {/* Operational Hours */}
          <div className="card" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '15px' }}>Operational Hours</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Monday - Friday:</span>
                <strong>9:00 AM - 6:00 PM</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Saturday:</span>
                <strong>10:00 AM - 4:00 PM</strong>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sunday:</span>
                <span style={{ color: 'var(--primary)', fontWeight: '700' }}>Closed (Crafting Day 🌸)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Block */}
      <div className="card" style={{ padding: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <HelpCircle size={22} color="var(--primary)" /> Frequently Asked Questions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: '700' }}>{faq.q}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
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
