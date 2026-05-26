import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, Shield, Building, MapPin, Eye, EyeOff, Save, X, Edit3 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  // Modal Edit states
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [nic, setNic] = useState(user?.nic || '');
  const [password, setPassword] = useState('');
  
  // Agent Edit states
  const [hotelName, setHotelName] = useState(user?.hotelName || '');
  const [location, setLocation] = useState(user?.location || '');
  const [noOfRooms, setNoOfRooms] = useState(user?.noOfRooms || 0);
  const [description, setDescription] = useState(user?.description || '');

  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEditClick = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setNic(user?.nic || '');
    setPassword('');
    setHotelName(user?.hotelName || '');
    setLocation(user?.location || '');
    setNoOfRooms(user?.noOfRooms || 0);
    setDescription(user?.description || '');
    setModalOpen(true);
    setSaveSuccess(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const updatedData = {
      name,
      email,
      phone,
      nic,
      password: password || undefined,
      hotelName: user.role === 'agent' ? hotelName : undefined,
      location: user.role === 'agent' ? location : undefined,
      noOfRooms: user.role === 'agent' ? Number(noOfRooms) : undefined,
      description: user.role === 'agent' ? description : undefined,
    };

    try {
      await updateProfile(updatedData);
      setSaveSuccess(true);
      setTimeout(() => {
        setModalOpen(false);
        setSaveSuccess(false);
      }, 800);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page container animate-fade-in">
      <h2 className="section-title">Your Profile</h2>
      <p className="section-subtitle">Manage your personal credentials and partner options</p>

      <div className="profile-dashboard-grid">
        {/* Core Profile Card */}
        <div className="glass-panel profile-summary-card">
          <div className="avatar-section">
            <div className="avatar-circle">
              <User size={48} className="avatar-icon" />
            </div>
            <h3>{user.name}</h3>
            <span className="badge badge-confirmed" style={{ textTransform: 'capitalize' }}>{user.role}</span>
          </div>

          <hr className="card-divider" />

          <div className="profile-fields-list">
            <div className="field-item">
              <span className="field-label"><Shield size={16} /> NIC Number</span>
              <span className="field-value">{user.nic}</span>
            </div>
            <div className="field-item">
              <span className="field-label"><Mail size={16} /> Email Address</span>
              <span className="field-value">{user.email}</span>
            </div>
            <div className="field-item">
              <span className="field-label"><Phone size={16} /> Contact Number</span>
              <span className="field-value">{user.phone}</span>
            </div>
          </div>

          <button onClick={handleEditClick} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}>
            <Edit3 size={16} /> Edit Profile Data
          </button>
        </div>

        {/* Partner Details Dashboard (Agent Only) */}
        {user.role === 'agent' && (
          <div className="glass-panel agent-details-card">
            <div className="card-header">
              <Building size={20} className="header-icon" />
              <h3>Hotel Administration Details</h3>
            </div>
            <p className="description-text">{user.description || 'No description supplied yet.'}</p>

            <div className="agent-stats-grid">
              <div className="stat-box">
                <span className="stat-label"><Building size={16} /> Registered Hotel</span>
                <span className="stat-val">{user.hotelName}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label"><MapPin size={16} /> Property Location</span>
                <span className="stat-val">{user.location}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Total Rooms</span>
                <span className="stat-val">{user.noOfRooms}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-card glass-panel animate-fade-in" style={{ maxWidth: '600px' }}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>
              <X size={20} />
            </button>
            <h3>Modify Profile Credentials</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Confirm your updates below. Leave the security password blank if you do not wish to change it.
            </p>

            <form onSubmit={handleSave} className="modal-form-grid">
              <div className="form-group">
                <label>Contact/Full Name</label>
                <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>NIC / Passport Number</label>
                <input type="text" className="form-input" value={nic} onChange={(e) => setNic(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Contact Phone</label>
                <input type="tel" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>

              <div className="form-group full-width">
                <label>Security Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="Enter new password (optional)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    style={{ position: 'absolute', right: '12px', top: '12px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Conditional Agent Fields inside Modal */}
              {user.role === 'agent' && (
                <>
                  <div className="full-width" style={{ marginTop: '10px' }}>
                    <h4 style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hotel Profile Details</h4>
                    <hr style={{ borderColor: 'var(--border-light)', margin: '8px 0 15px' }} />
                  </div>

                  <div className="form-group">
                    <label>Hotel Name</label>
                    <input type="text" className="form-input" value={hotelName} onChange={(e) => setHotelName(e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label>Property Location</label>
                    <input type="text" className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} required />
                  </div>

                  <div className="form-group full-width">
                    <label>Total Rooms</label>
                    <input type="number" className="form-input" value={noOfRooms} onChange={(e) => setNoOfRooms(e.target.value)} required />
                  </div>

                  <div className="form-group full-width">
                    <label>Property Description</label>
                    <textarea rows="3" className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />
                  </div>
                </>
              )}

              <div className="full-width modal-actions" style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={saving}>
                  <Save size={18} /> {saving ? 'Applying...' : saveSuccess ? 'Saved successfully!' : 'Apply Modifications'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .profile-dashboard-grid {
          display: grid;
          grid-template-columns: 1.2fr 2fr;
          gap: 30px;
          align-items: start;
        }

        .profile-summary-card {
          padding: 30px;
          text-align: center;
        }

        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .avatar-circle {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 2px dashed var(--accent-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-glow);
        }

        .avatar-icon {
          color: var(--accent-cyan);
        }

        .card-divider {
          border: 0;
          border-top: 1px solid var(--border-light);
          margin: 25px 0;
        }

        .profile-fields-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
        }

        .field-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .field-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .field-value {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .agent-details-card {
          padding: 35px;
        }

        .agent-details-card .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .agent-details-card .header-icon {
          color: var(--accent-gold);
        }

        .description-text {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-bottom: 30px;
          line-height: 1.7;
        }

        .agent-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .stat-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stat-box:nth-child(3) {
          grid-column: span 2;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stat-val {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--accent-gold);
        }

        /* Modal Forms Layout */
        .modal-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .modal-form-grid .full-width {
          grid-column: span 2;
        }

        @media (max-width: 850px) {
          .profile-dashboard-grid {
            grid-template-columns: 1fr;
          }
          .agent-stats-grid {
            grid-template-columns: 1fr;
          }
          .stat-box:nth-child(3) {
            grid-column: span 1;
          }
          .modal-form-grid {
            grid-template-columns: 1fr;
          }
          .modal-form-grid .full-width {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
