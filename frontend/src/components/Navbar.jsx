import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, LogOut, User, Compass, Calendar, Building, HelpCircle, Mail, BarChart, Settings, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Render navigation links dynamically by role
  const renderNavLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <Compass size={18} /> Home
          </Link>
          <Link to="/about" className={`nav-item ${isActive('/about') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <HelpCircle size={18} /> About Us
          </Link>
          <Link to="/contact" className={`nav-item ${isActive('/contact') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <Mail size={18} /> Contact Us
          </Link>
        </>
      );
    }

    if (user.role === 'traveler') {
      return (
        <>
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <Compass size={18} /> Explore
          </Link>
          <Link to="/hotels" className={`nav-item ${isActive('/hotels') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <Building size={18} /> View Hotels
          </Link>
          <Link to="/manage-tours" className={`nav-item ${isActive('/manage-tours') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <Calendar size={18} /> Bookings
          </Link>
          <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <User size={18} /> Profile
          </Link>
        </>
      );
    }

    if (user.role === 'agent') {
      return (
        <>
          <Link to="/agent-dashboard" className={`nav-item ${isActive('/agent-dashboard') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <BarChart size={18} /> Agent Dashboard
          </Link>
          <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <User size={18} /> Hotel Profile
          </Link>
        </>
      );
    }

    if (user.role === 'admin') {
      return (
        <>
          <Link to="/admin-dashboard" className={`nav-item ${isActive('/admin-dashboard') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <Settings size={18} /> Admin Panel
          </Link>
        </>
      );
    }

    return null;
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <Plane size={24} className="plane-logo" />
          <span>JetVoyager</span>
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="navbar-links">
        {renderNavLinks()}
      </div>

      {/* Desktop Auth Controls */}
      <div className="navbar-auth">
        {user ? (
          <div className="auth-profile-group">
            <span className="user-greeting">Welcome, <strong>{user.name.split(' ')[0]}</strong></span>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} /> Log Out
            </button>
          </div>
        ) : (
          <div className="auth-btn-group">
            <Link to="/login" className="login-link">Log In</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Sign Up</Link>
          </div>
        )}
      </div>

      {/* Mobile Burger Toggle */}
      <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay animate-fade-in">
          <div className="mobile-menu-links">
            {renderNavLinks()}
            <hr className="mobile-divider" />
            {user ? (
              <div className="mobile-auth-section">
                <span className="mobile-user-greeting">Logged in as {user.name}</span>
                <button onClick={handleLogout} className="logout-btn" style={{ width: '100%', justifyContent: 'center' }}>
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="login-link" style={{ textAlign: 'center', width: '100%', padding: '10px 0' }} onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                <Link to="/register" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dynamic Styling block for Navbar */}
      <style>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 40px;
          background: rgba(7, 10, 19, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-light);
          transition: var(--transition-smooth);
        }

        .navbar-brand .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          background: linear-gradient(135deg, #ffffff 0%, var(--accent-cyan) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .plane-logo {
          stroke: var(--accent-cyan);
          filter: drop-shadow(0 0 5px rgba(0, 240, 255, 0.4));
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          padding: 6px 4px;
          border-bottom: 2px solid transparent;
          transition: var(--transition-smooth);
        }

        .nav-item:hover, .nav-item.active {
          color: var(--accent-cyan);
          border-color: var(--accent-cyan);
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.35);
        }

        .navbar-auth {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .auth-profile-group {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .user-greeting {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .logout-btn {
          background: rgba(255, 46, 147, 0.1);
          color: var(--accent-rose);
          border: 1px solid rgba(255, 46, 147, 0.2);
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition-smooth);
        }

        .logout-btn:hover {
          background: var(--accent-rose);
          color: var(--text-primary);
          box-shadow: 0 0 15px rgba(255, 46, 147, 0.4);
          transform: translateY(-1px);
        }

        .auth-btn-group {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .login-link {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .login-link:hover {
          color: var(--text-primary);
        }

        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .navbar-links, .navbar-auth {
            display: none;
          }

          .mobile-toggle {
            display: block;
          }

          .navbar-container {
            padding: 16px 20px;
          }

          .mobile-menu-overlay {
            position: fixed;
            top: 73px;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(7, 10, 19, 0.98);
            backdrop-filter: blur(15px);
            z-index: 99;
            padding: 30px;
          }

          .mobile-menu-links {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .mobile-divider {
            border: 0;
            border-top: 1px solid var(--border-light);
            margin: 10px 0;
          }

          .mobile-auth-buttons {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .mobile-user-greeting {
            display: block;
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-bottom: 12px;
            text-align: center;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
