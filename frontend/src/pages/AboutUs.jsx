import React from 'react';
import { Shield, Sparkles, Compass, Users } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="about-us-page container animate-fade-in">
      <h2 className="section-title">The JetVoyager Standard</h2>
      <p className="section-subtitle">Luxury travel defined by privacy, performance, and five-star hospitality</p>

      <div className="about-hero-image glass-panel">
        <img
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
          alt="Luxury Private Flight"
        />
        <div className="overlay"></div>
        <div className="overlay-text">
          <h3>Designed for Discerning Travelers</h3>
          <p>We combine private aviation charter connections with elite hospitality partner portfolios.</p>
        </div>
      </div>

      <div className="brand-values-grid" style={{ marginTop: '50px' }}>
        <div className="value-box glass-panel">
          <Shield size={32} className="val-icon" />
          <h4>Certified Safety</h4>
          <p>All private jet charters and luxury lodging accommodations adhere to global health, security, and maintenance protocols.</p>
        </div>

        <div className="value-box glass-panel">
          <Sparkles size={32} className="val-icon" />
          <h4>Elite Portfolios</h4>
          <p>We work exclusively with certified hotel agents to guarantee five-star ratings, premium penthouses, and bespoke service.</p>
        </div>

        <div className="value-box glass-panel">
          <Compass size={32} className="val-icon" />
          <h4>Global Scouting</h4>
          <p>Whether arriving in Paris, the historical centers of Kyoto, or Rome, our team curates local itineraries for absolute bliss.</p>
        </div>

        <div className="value-box glass-panel">
          <Users size={32} className="val-icon" />
          <h4>VIP Concierge</h4>
          <p>Each registered booking grants you access to our VIP customer support agents to customize airport transfers and details.</p>
        </div>
      </div>

      <style>{`
        .about-hero-image {
          position: relative;
          height: 380px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 50px;
        }

        .about-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .about-hero-image .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 30%, rgba(7, 10, 19, 0.9) 100%);
        }

        .overlay-text {
          position: absolute;
          bottom: 30px;
          left: 40px;
          right: 40px;
          max-width: 600px;
        }

        .overlay-text h3 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .overlay-text p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .brand-values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
        }

        .value-box {
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .val-icon {
          color: var(--accent-cyan);
          stroke-width: 1.5;
        }

        .value-box h4 {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .value-box p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        @media (max-width: 700px) {
          .about-hero-image {
            height: 250px;
          }
          .overlay-text {
            left: 20px;
            right: 20px;
            bottom: 20px;
          }
          .overlay-text h3 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
