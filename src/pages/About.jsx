import React from 'react';
import { Sparkles, Heart, Users, ShieldCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="about-container container">
      {/* Hero Header */}
      <section className="about-hero card gradient-bg text-center">
        <span className="badge badge-primary"><Sparkles size={14} /> Our Story</span>
        <h1>SK Happy Little Things</h1>
        <p className="hero-lead">
          We believe that small details bring the biggest smiles. Our mission is to connect creative makers
          with lovers of cute, customized goods around the world.
        </p>
      </section>

      {/* Grid of Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="card stat-card text-center">
            <span className="stat-emoji">🌸</span>
            <h3>10,000+</h3>
            <p>Happy Little Customers</p>
          </div>
          <div className="card stat-card text-center">
            <span className="stat-emoji">🎨</span>
            <h3>500+</h3>
            <p>Independent Creators</p>
          </div>
          <div className="card stat-card text-center">
            <span className="stat-emoji">✨</span>
            <h3>20,000+</h3>
            <p>Cute Custom Orders Shipped</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="values-section">
        <h2 className="text-center">Our Core Values</h2>
        <div className="grid-cols-3 values-grid">
          <div className="card value-card">
            <div className="value-icon"><Heart size={24} /></div>
            <h3>Handmade with Love</h3>
            <p>Every plushie, kit, poster, and t-shirt is designed, crafted, and packaged with extreme care to bring a sparkle of joy to your day.</p>
          </div>
          <div className="card value-card">
            <div className="value-icon"><Users size={24} /></div>
            <h3>Supporting Local Makers</h3>
            <p>We empower local crafters, graphic designers, and artists by providing a safe and friendly community store to grow their businesses.</p>
          </div>
          <div className="card value-card">
            <div className="value-icon"><ShieldCheck size={24} /></div>
            <h3>Premium & Eco-friendly</h3>
            <p>We use premium quality, sustainable materials for our custom prints, organic cotton apparel, and biodegradeable birthday packaging.</p>
          </div>
        </div>
      </section>

      {/* Categories Spotlight */}
      <section className="spotlight-section card">
        <h2>What We Make</h2>
        <p>Explore our main curated collections designed to decorate your lifestyle:</p>
        <div className="spotlight-grid">
          <div className="spotlight-item">
            <strong>👕 Graphic T-Shirts</strong>
            <p>Organic cotton tees with vibrant, positive, and cute designs.</p>
          </div>
          <div className="spotlight-item">
            <strong>🎂 Birthday Kits</strong>
            <p>Coordinated party packages containing caps, cute banners, balloons, and cake toppers.</p>
          </div>
          <div className="spotlight-item">
            <strong>🧢 Casual Caps</strong>
            <p>Embroidered pastel cap collections for everyday happy fashion.</p>
          </div>
          <div className="spotlight-item">
            <strong>🖼️ Aesthetic Posters</strong>
            <p>Inspirational wall art and motivational affirmation prints.</p>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .about-container {
          padding-top: 30px;
          padding-bottom: 60px;
          display: flex;
          flex-direction: column;
          gap: 50px;
        }
        .about-hero {
          padding: 60px 40px;
        }
        .about-hero h1 {
          font-size: 3rem;
          margin: 15px 0;
          color: white;
        }
        .hero-lead {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.9);
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .stat-card {
          padding: 30px 20px;
        }
        .stat-emoji {
          font-size: 2.5rem;
          margin-bottom: 10px;
          display: block;
        }
        .stat-card h3 {
          font-size: 2.2rem;
          color: var(--primary);
          margin-bottom: 5px;
        }
        .stat-card p {
          color: var(--text-secondary);
          font-weight: 600;
        }
        .values-section h2 {
          font-size: 2rem;
          margin-bottom: 30px;
        }
        .values-grid {
          gap: 24px;
        }
        .value-card {
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .value-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--border-radius-sm);
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .value-card h3 {
          font-size: 1.25rem;
        }
        .value-card p {
          color: var(--text-secondary);
          line-height: 1.5;
          font-size: 0.95rem;
        }
        .spotlight-section h2 {
          font-size: 1.8rem;
          margin-bottom: 10px;
        }
        .spotlight-section p {
          color: var(--text-secondary);
          margin-bottom: 25px;
        }
        .spotlight-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .spotlight-item {
          padding: 15px;
          background: var(--bg-app);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
        }
        .spotlight-item strong {
          color: var(--primary);
          font-size: 1.05rem;
          display: block;
          margin-bottom: 5px;
        }
        .spotlight-item p {
          font-size: 0.9rem;
          margin-bottom: 0;
          color: var(--text-secondary);
        }
        @media (max-width: 768px) {
          .stats-grid, .values-grid, .spotlight-grid {
            grid-template-columns: 1fr;
          }
          .about-hero h1 {
            font-size: 2.2rem;
          }
          .hero-lead {
            font-size: 1rem;
          }
        }
      `}} />
    </div>
  );
}
