import React, { useState, useEffect } from 'react';
import { BarChart, Compass, MessageSquare, BookOpen, Trash2, Edit3, Plus, Settings, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, destinations, support, bookings
  
  // States
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHotels: 0,
    totalDestinations: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [destinations, setDestinations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);

  // Form states for Destination CRUD
  const [editingDest, setEditingDest] = useState(null); // null means adding
  const [destName, setDestName] = useState('');
  const [destLocation, setDestLocation] = useState('');
  const [destDesc, setDestDesc] = useState('');
  const [destImage, setDestImage] = useState('');

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch admin data
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      // 1. Fetch Stats
      const statsRes = await fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } });
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.stats);

      // 2. Fetch Destinations
      const destRes = await fetch('/api/destinations');
      const destData = await destRes.json();
      if (destData.success) setDestinations(destData.destinations);

      // 3. Fetch Bookings
      const bookingsRes = await fetch('/api/bookings/all-bookings', { headers: { 'Authorization': `Bearer ${token}` } });
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success) setBookings(bookingsData.bookings);

      // 4. Fetch Support Messages
      const msgRes = await fetch('/api/contact', { headers: { 'Authorization': `Bearer ${token}` } });
      const msgData = await msgRes.json();
      if (msgData.success) setMessages(msgData.messages);

    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to fetch admin data assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDestinationSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const token = localStorage.getItem('token');

    const destData = {
      name: destName,
      location: destLocation,
      description: destDesc,
      images: destImage ? [destImage] : undefined,
    };

    try {
      let res;
      if (editingDest) {
        // Edit
        res = await fetch(`/api/destinations/${editingDest._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(destData),
        });
      } else {
        // Create
        res = await fetch('/api/destinations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(destData),
        });
      }

      const data = await res.json();
      if (data.success) {
        setDestName('');
        setDestLocation('');
        setDestDesc('');
        setDestImage('');
        setEditingDest(null);
        fetchData();
      } else {
        setErrorMessage(data.message || 'Operation failed.');
      }
    } catch (err) {
      setErrorMessage('Server connection error.');
    }
  };

  const handleEditInit = (dest) => {
    setEditingDest(dest);
    setDestName(dest.name);
    setDestLocation(dest.location);
    setDestDesc(dest.description);
    setDestImage(dest.images && dest.images[0] || '');
  };

  const handleDeleteDest = async (id) => {
    if (!window.confirm('Delete this destination?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/destinations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateMessageStatus = async (msgId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/contact/${msgId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard-page animate-fade-in">
      {/* Dynamic Sidebar menu */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-head">
          <Settings size={20} className="logo-icon" />
          <h3>Admin Control</h3>
        </div>
        <ul className="sidebar-menu">
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <BarChart size={16} /> Metrics Dashboard
          </li>
          <li className={activeTab === 'destinations' ? 'active' : ''} onClick={() => setActiveTab('destinations')}>
            <Compass size={16} /> Manage Destinations
          </li>
          <li className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>
            <BookOpen size={16} /> Flight & Hotel Bookings
          </li>
          <li className={activeTab === 'support' ? 'active' : ''} onClick={() => setActiveTab('support')}>
            <MessageSquare size={16} /> Support Tickets
          </li>
        </ul>
      </aside>

      {/* Main Dashboard body */}
      <main className="dashboard-main container">
        {errorMessage && (
          <div className="error-alert" style={{ marginBottom: '20px' }}>
            <AlertTriangle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {loading ? (
          <div style={{ color: 'var(--accent-cyan)' }}>
            <span>Retrieving core administrative panels...</span>
          </div>
        ) : (
          <>
            {/* TAB 1: DASHBOARD STATS */}
            {activeTab === 'dashboard' && (
              <div className="dashboard-tab animate-fade-in">
                <h2 className="section-title" style={{ marginBottom: '30px' }}>Dashboard Overview</h2>
                <div className="metrics-grid">
                  <div className="glass-panel metric-box">
                    <span className="lbl">Traveler Accounts</span>
                    <span className="val">{stats.totalUsers}</span>
                  </div>
                  <div className="glass-panel metric-box">
                    <span className="lbl">Hotel Agent Partners</span>
                    <span className="val">{stats.totalHotels}</span>
                  </div>
                  <div className="glass-panel metric-box">
                    <span className="lbl">Active Destinations</span>
                    <span className="val">{stats.totalDestinations}</span>
                  </div>
                  <div className="glass-panel metric-box">
                    <span className="lbl">Suite Reservations</span>
                    <span className="val">{stats.totalBookings}</span>
                  </div>
                  <div className="glass-panel metric-box full-width" style={{ borderLeft: '3px solid var(--accent-gold)' }}>
                    <span className="lbl" style={{ color: 'var(--accent-gold)' }}>Estimated Confirmed Revenue</span>
                    <span className="val" style={{ color: 'var(--accent-gold)' }}>${stats.totalRevenue}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DESTINATIONS CRUD */}
            {activeTab === 'destinations' && (
              <div className="destinations-tab animate-fade-in">
                <h2 className="section-title">Manage Destinations</h2>
                <div className="crud-split-layout">
                  {/* List */}
                  <div className="table-container list-column">
                    <table>
                      <thead>
                        <tr>
                          <th>Destination</th>
                          <th>Location</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {destinations.map(dest => (
                          <tr key={dest._id}>
                            <td>
                              <strong>{dest.name}</strong>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '350px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {dest.description}
                              </div>
                            </td>
                            <td>{dest.location}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleEditInit(dest)} className="btn-secondary" style={{ padding: '6px 12px' }}><Edit3 size={14} /></button>
                                <button onClick={() => handleDeleteDest(dest._id)} className="btn-secondary" style={{ padding: '6px 12px', color: 'var(--accent-rose)', borderColor: 'rgba(255,46,147,0.2)' }}><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Form */}
                  <div className="glass-panel form-column">
                    <h4>{editingDest ? 'Edit Destination' : 'Add New Location'}</h4>
                    <form onSubmit={handleDestinationSubmit} style={{ marginTop: '15px' }}>
                      <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-input" placeholder="e.g. Paris" value={destName} onChange={(e) => setDestName(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>Location Country</label>
                        <input type="text" className="form-input" placeholder="e.g. France" value={destLocation} onChange={(e) => setDestLocation(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>Visual Image URL</label>
                        <input type="url" className="form-input" placeholder="https://..." value={destImage} onChange={(e) => setDestImage(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Destination Experience Description</label>
                        <textarea rows="4" className="form-textarea" placeholder="Experience overview..." value={destDesc} onChange={(e) => setDestDesc(e.target.value)} required />
                      </div>
                      <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        <Plus size={16} /> {editingDest ? 'Update Location' : 'Register Location'}
                      </button>
                      {editingDest && (
                        <button type="button" onClick={() => {
                          setEditingDest(null);
                          setDestName('');
                          setDestLocation('');
                          setDestDesc('');
                          setDestImage('');
                        }} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>Cancel Edit</button>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BOOKINGS LIST */}
            {activeTab === 'bookings' && (
              <div className="bookings-tab animate-fade-in">
                <h2 className="section-title">Manage Global Bookings</h2>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Traveler</th>
                        <th>Hotel Partner</th>
                        <th>Suite / Rooms</th>
                        <th>Billing</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length > 0 ? (
                        bookings.map(booking => (
                          <tr key={booking._id}>
                            <td>
                              <strong>{booking.user?.name}</strong>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.user?.email}</div>
                            </td>
                            <td>
                              <strong>{booking.agent?.hotelName}</strong>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.agent?.location}</div>
                            </td>
                            <td>{booking.roomType} x {booking.noOfRooms}</td>
                            <td><strong style={{ color: 'var(--accent-gold)' }}>${booking.totalPrice}</strong></td>
                            <td>
                              <span className={`badge badge-${booking.status}`}>{booking.status}</span>
                            </td>
                            <td>
                              {booking.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Confirm</button>
                                  <button onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', color: 'var(--accent-rose)' }}>Cancel</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colspan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No global bookings have been initialized.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: SUPPORT TICKETS */}
            {activeTab === 'support' && (
              <div className="support-tab animate-fade-in">
                <h2 className="section-title">Customer Support Tickets</h2>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Inquiry Details</th>
                        <th>Status</th>
                        <th>Action Modifier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.length > 0 ? (
                        messages.map(msg => (
                          <tr key={msg._id}>
                            <td>
                              <strong>{msg.name}</strong>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{msg.email}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{msg.phone || 'No phone'}</div>
                            </td>
                            <td>
                              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxHeight: '80px', overflowY: 'auto' }}>
                                "{msg.message}"
                              </p>
                            </td>
                            <td>
                              <span className={`badge badge-${msg.status}`}>{msg.status}</span>
                            </td>
                            <td>
                              <select
                                className="form-select"
                                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                value={msg.status}
                                onChange={(e) => handleUpdateMessageStatus(msg._id, e.target.value)}
                              >
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="resolved">Resolved</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colspan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No customer tickets registered.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
