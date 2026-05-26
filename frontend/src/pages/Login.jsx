import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Shield, Users, Building, Mail, Lock, AlertTriangle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('traveler'); // traveler, agent, admin
  const [validationError, setValidationError] = useState('');
  const { login, user, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || 
        (user.role === 'admin' ? '/admin-dashboard' : 
         user.role === 'agent' ? '/agent-dashboard' : '/');
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please enter both your email and password.');
      return;
    }

    try {
      await login(email, password, role);
      // AuthContext will trigger the useEffect to redirect
    } catch (err) {
      // Handled in Context
    }
  };

  return (
    <div className="login-page container animate-fade-in">
      <div className="login-card-container">
        <div className="login-brand-info">
          <h2>JetVoyager</h2>
          <p className="subtitle">Luxury Private Charters & Hotel Booking</p>
          <div className="features-promo">
            <div className="promo-item">
              <span className="bullet">✦</span> Exclusive access to 5-star villas
            </div>
            <div className="promo-item">
              <span className="bullet">✦</span> Instant booking with certified hotel agents
            </div>
            <div className="promo-item">
              <span className="bullet">✦</span> VIP customer support concierge
            </div>
          </div>
        </div>

        <div className="login-form-card glass-panel">
          <div className="card-header">
            <LogIn size={24} style={{ stroke: 'var(--accent-cyan)' }} />
            <h3>Log In</h3>
          </div>

          {/* Segmented Role Selector */}
          <div className="role-selector">
            <button
              type="button"
              className={`role-tab ${role === 'traveler' ? 'active' : ''}`}
              onClick={() => setRole('traveler')}
            >
              <Users size={16} /> Traveler
            </button>
            <button
              type="button"
              className={`role-tab ${role === 'agent' ? 'active' : ''}`}
              onClick={() => setRole('agent')}
            >
              <Building size={16} /> Agent
            </button>
            <button
              type="button"
              className={`role-tab ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              <Shield size={16} /> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Display Errors */}
            {(validationError || error) && (
              <div className="error-alert">
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>{validationError || error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="field-icon" />
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
              Confirm & Connect
            </button>
          </form>

          <hr className="divider" />
          
          <p className="signup-prompt">
            Don't have an account yet? <Link to="/register">Create one here</Link>
          </p>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-card-container {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          max-width: 950px;
          width: 100%;
          gap: 40px;
          align-items: center;
        }

        .login-brand-info h2 {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ffffff 0%, var(--accent-cyan) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .login-brand-info .subtitle {
          color: var(--accent-gold);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          margin-bottom: 30px;
        }

        .features-promo {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .promo-item {
          color: var(--text-secondary);
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bullet {
          color: var(--accent-cyan);
          font-weight: bold;
        }

        .login-form-card {
          padding: 40px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 25px;
        }

        .card-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
        }

        /* Segmented Controller */
        .role-selector {
          display: flex;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 4px;
          margin-bottom: 25px;
          gap: 4px;
        }

        .role-tab {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: inherit;
          transition: var(--transition-smooth);
        }

        .role-tab:hover {
          color: var(--text-primary);
        }

        .role-tab.active {
          background: var(--bg-secondary);
          color: var(--accent-cyan);
          border: 1px solid rgba(0, 240, 255, 0.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .input-with-icon {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          top: 13px;
          color: var(--text-muted);
        }

        .input-with-icon input {
          padding-left: 45px;
        }

        .error-alert {
          background: rgba(255, 46, 147, 0.1);
          color: var(--accent-rose);
          border: 1px solid rgba(255, 46, 147, 0.2);
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .divider {
          border: 0;
          border-top: 1px solid var(--border-light);
          margin: 25px 0;
        }

        .signup-prompt {
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .signup-prompt a {
          color: var(--accent-cyan);
          font-weight: 600;
        }

        .signup-prompt a:hover {
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.35);
        }

        @media (max-width: 800px) {
          .login-card-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .login-brand-info {
            text-align: center;
          }
          .features-promo {
            align-items: center;
          }
          .login-form-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
