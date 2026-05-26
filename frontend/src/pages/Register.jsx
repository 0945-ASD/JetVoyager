import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Users, Building, Mail, Lock, User, ShieldAlert, Phone, EyeOff, AlertTriangle } from 'lucide-react';

const Register = () => {
  // Tab selector: traveler vs agent
  const [role, setRole] = useState('traveler');

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [nic, setNic] = useState('');

  // Agent specific states
  const [hotelName, setHotelName] = useState('');
  const [locationField, setLocationField] = useState('');
  const [noOfRooms, setNoOfRooms] = useState('');

  const [validationError, setValidationError] = useState('');
  const { register, user, error } = useAuth();
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

    if (!name || !email || !password || !phone || !nic) {
      setValidationError('Please fill in all core fields.');
      return;
    }

    if (role === 'agent' && (!hotelName || !locationField || !noOfRooms)) {
      setValidationError('Please fill in all hotel-specific fields.');
      return;
    }

    const userData = {
      name,
      email,
      password,
      phone,
      nic,
      role,
      hotelName: role === 'agent' ? hotelName : undefined,
      location: role === 'agent' ? locationField : undefined,
      noOfRooms: role === 'agent' ? Number(noOfRooms) : undefined,
    };

    try {
      await register(userData);
    } catch (err) {
      // Handled in Context
    }
  };

  return (
    <div className="register-page container animate-fade-in">
      <div className="register-card-container glass-panel">
        <div className="card-header">
          <UserPlus size={24} style={{ stroke: 'var(--accent-cyan)' }} />
          <h3>Create Account</h3>
        </div>

        {/* Tab Selection */}
        <div className="role-selector">
          <button
            type="button"
            className={`role-tab ${role === 'traveler' ? 'active' : ''}`}
            onClick={() => {
              setRole('traveler');
              setValidationError('');
            }}
          >
            <Users size={16} /> Traveler Account
          </button>
          <button
            type="button"
            className={`role-tab ${role === 'agent' ? 'active' : ''}`}
            onClick={() => {
              setRole('agent');
              setValidationError('');
            }}
          >
            <Building size={16} /> Hotel Agent Partner
          </button>
        </div>

        <form onSubmit={handleSubmit} className="register-grid-form">
          {/* Display Errors */}
          {(validationError || error) && (
            <div className="error-alert full-width">
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{validationError || error}</span>
            </div>
          )}

          {/* Core Personal Details */}
          <div className="form-group">
            <label htmlFor="name">{role === 'agent' ? 'Contact Name' : 'Full Name'}</label>
            <div className="input-with-icon">
              <User size={18} className="field-icon" />
              <input
                type="text"
                id="name"
                className="form-input"
                placeholder={role === 'agent' ? 'Agent in charge' : 'John Smith'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="nic">NIC / Passport Number</label>
            <div className="input-with-icon">
              <ShieldAlert size={18} className="field-icon" />
              <input
                type="text"
                id="nic"
                className="form-input"
                placeholder="991234567V / N88762"
                value={nic}
                onChange={(e) => setNic(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-with-icon">
              <Phone size={18} className="field-icon" />
              <input
                type="tel"
                id="phone"
                className="form-input"
                placeholder="+94 77 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="password">Security Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Conditional Agent Fields */}
          {role === 'agent' && (
            <>
              <div className="full-width-header full-width">
                <h4>Hotel Agent Specific Details</h4>
                <hr style={{ borderColor: 'var(--border-light)', margin: '10px 0' }} />
              </div>

              <div className="form-group">
                <label htmlFor="hotel-name">Hotel Name</label>
                <div className="input-with-icon">
                  <Building size={18} className="field-icon" />
                  <input
                    type="text"
                    id="hotel-name"
                    className="form-input"
                    placeholder="Hilton Grand / Jetwing Elite"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location">City / Location</label>
                <div className="input-with-icon">
                  <EyeOff size={18} className="field-icon" />
                  <input
                    type="text"
                    id="location"
                    className="form-input"
                    placeholder="Paris, France / Negombo, Sri Lanka"
                    value={locationField}
                    onChange={(e) => setLocationField(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="no-of-rooms">Number of Accommodations Offered</label>
                <div className="input-with-icon">
                  <Building size={18} className="field-icon" />
                  <input
                    type="number"
                    id="no-of-rooms"
                    className="form-input"
                    placeholder="e.g. 50"
                    min="1"
                    value={noOfRooms}
                    onChange={(e) => setNoOfRooms(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn-primary full-width" style={{ justifyContent: 'center', marginTop: '15px' }}>
            Register Account
          </button>
        </form>

        <hr className="divider" />

        <p className="login-prompt">
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
      </div>

      <style>{`
        .register-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .register-card-container {
          max-width: 750px;
          width: 100%;
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
          margin-bottom: 30px;
          gap: 4px;
        }

        .role-tab {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 10px 12px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
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

        /* Responsive Form Grid */
        .register-grid-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .full-width {
          grid-column: span 2;
        }

        .full-width-header {
          margin-top: 10px;
        }

        .full-width-header h4 {
          color: var(--accent-gold);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
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
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .divider {
          border: 0;
          border-top: 1px solid var(--border-light);
          margin: 30px 0;
        }

        .login-prompt {
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .login-prompt a {
          color: var(--accent-cyan);
          font-weight: 600;
        }

        .login-prompt a:hover {
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.35);
        }

        @media (max-width: 650px) {
          .register-grid-form {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: span 1;
          }
          .register-card-container {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
