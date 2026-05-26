import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertTriangle } from 'lucide-react';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, message }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setError(data.message || 'Failed to submit inquiry.');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-us-page container animate-fade-in">
      <h2 className="section-title">Luxury Concierge</h2>
      <p className="section-subtitle">Get in touch with a JetVoyager client liaison for custom charters and bookings</p>

      <div className="contact-split-grid">
        {/* Left Side: Contact Cards */}
        <div className="contact-info-column">
          <div className="glass-panel info-card">
            <Mail className="card-icon" size={24} />
            <div>
              <h4>Electronic Mail</h4>
              <p className="value">concierge@jetvoyager.com</p>
              <p className="sub">24/7 dedicated traveler inbox</p>
            </div>
          </div>

          <div className="glass-panel info-card">
            <Phone className="card-icon" size={24} />
            <div>
              <h4>Direct Telephone</h4>
              <p className="value">+1 (800) JET-VYGR</p>
              <p className="sub">International charter lines open</p>
            </div>
          </div>

          <div className="glass-panel info-card">
            <MapPin className="card-icon" size={24} />
            <div>
              <h4>Corporate Jetway</h4>
              <p className="value">VIP Terminal, Hangar 4B</p>
              <p className="sub">Private Airport, London, UK</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="glass-panel contact-form-card animate-pulse-glow">
          <div className="form-head">
            <h3>Send a Message</h3>
            <p>Our client liaisons typically respond within 15 minutes.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: '25px' }}>
            {error && (
              <div className="error-alert" style={{ marginBottom: '15px' }}>
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="success-alert" style={{ marginBottom: '15px' }}>
                <CheckCircle size={16} />
                <span>Message received! A VIP liaison will reach out shortly.</span>
              </div>
            )}

            <div className="form-group">
              <label>Your Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Phone (Optional)</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+1 (800) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Message / Inquiries Details</label>
              <textarea
                rows="4"
                className="form-textarea"
                placeholder="Outline details regarding requested flights or destination villas..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
              disabled={loading || success}
            >
              <Send size={16} /> {loading ? 'Transmitting...' : success ? 'Sent!' : 'Transmit Message'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .contact-split-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 40px;
          align-items: start;
        }

        .contact-info-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-card {
          padding: 25px;
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .info-card .card-icon {
          color: var(--accent-cyan);
          filter: drop-shadow(0 0 4px rgba(0, 240, 255, 0.3));
          stroke-width: 1.5;
        }

        .info-card h4 {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .info-card .value {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .info-card .sub {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .contact-form-card {
          padding: 35px;
        }

        .form-head h3 {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .form-head p {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .error-alert {
          background: rgba(255, 46, 147, 0.1);
          color: var(--accent-rose);
          border: 1px solid rgba(255, 46, 147, 0.2);
          padding: 10px 12px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
        }

        .success-alert {
          background: rgba(0, 240, 255, 0.1);
          color: var(--accent-cyan);
          border: 1px solid rgba(0, 240, 255, 0.2);
          padding: 10px 12px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
        }

        @media (max-width: 800px) {
          .contact-split-grid {
            grid-template-columns: 1fr;
          }
          .contact-form-card {
            padding: 25px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactUs;
