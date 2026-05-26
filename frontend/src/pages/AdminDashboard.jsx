import React, { useState, useEffect } from 'react';
import { BarChart, Compass, MessageSquare, BookOpen, Trash2, Edit3, Plus, Settings, AlertTriangle, Building, Star, Save } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, destinations, bookings, support, hotels
  
  // Data States
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
  const [hotels, setHotels] = useState([]);
  const [pendingHotels, setPendingHotels] = useState([]);

  // Form states for Destination CRUD
  const [editingDest, setEditingDest] = useState(null); 
  const [destName, setDestName] = useState('');
  const [destLocation, setDestLocation] = useState('');
  const [destDesc, setDestDesc] = useState('');
  const [destImage, setDestImage] = useState('');

  // Form states for Hotel Agent Partner Administration
  const [editingHotel, setEditingHotel] = useState(null);
  const [hotelNameInput, setHotelNameInput] = useState('');
  const [hotelLocationInput, setHotelLocationInput] = useState('');
  const [hotelRoomsInput, setHotelRoomsInput] = useState('');
  const [hotelRatingInput, setHotelRatingInput] = useState('5');
  const [hotelDescInput, setHotelDescInput] = useState('');

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch admin data assets
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

      // 5. Fetch Hotel Agents list
      const hotelRes = await fetch('/api/auth/hotels');
      const hotelData = await hotelRes.json();
      if (hotelData.success) setHotels(hotelData.hotels);

      // 6. Fetch Pending Hotel Approvals
      const pendingRes = await fetch('/api/auth/admin/pending-hotels', { headers: { 'Authorization': `Bearer ${token}` } });
      const pendingData = await pendingRes.json();
      if (pendingData.success) setPendingHotels(pendingData.hotels);

    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load admin panel details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Destination Submit Handler
  const handleDestinationSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
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
        res = await fetch(`/api/destinations/${editingDest._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(destData),
        });
      } else {
        res = await fetch('/api/destinations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(destData),
        });
      }

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(editingDest ? 'Destination updated successfully!' : 'New Destination registered!');
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

  const handleEditDestInit = (dest) => {
    setEditingDest(dest);
    setDestName(dest.name);
    setDestLocation(dest.location);
    setDestDesc(dest.description);
    setDestImage(dest.images && dest.images[0] || '');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleDeleteDest = async (id) => {
    if (!window.confirm('Are you sure you want to remove this travel destination?')) return;
    setErrorMessage('');
    setSuccessMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/destinations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Destination removed successfully.');
        fetchData();
      } else {
        setErrorMessage(data.message || 'Failed to remove destination.');
      }
    } catch (err) {
      setErrorMessage('Server connection error.');
    }
  };

  // Hotel Partner Edit Handler
  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const token = localStorage.getItem('token');

    if (!editingHotel) return;

    const hotelData = {
      hotelName: hotelNameInput,
      location: hotelLocationInput,
      noOfRooms: Number(hotelRoomsInput) || 0,
      rating: Number(hotelRatingInput) || 5,
      description: hotelDescInput,
    };

    try {
      const res = await fetch(`/api/auth/hotels/${editingHotel._id}/admin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(hotelData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Hotel partner profile updated successfully!');
        setHotelNameInput('');
        setHotelLocationInput('');
        setHotelRoomsInput('');
        setHotelRatingInput('5');
        setHotelDescInput('');
        setEditingHotel(null);
        fetchData();
      } else {
        setErrorMessage(data.message || 'Failed to modify hotel partner.');
      }
    } catch (err) {
      setErrorMessage('Server communication error.');
    }
  };

  const handleEditHotelInit = (hotel) => {
    setEditingHotel(hotel);
    setHotelNameInput(hotel.hotelName || '');
    setHotelLocationInput(hotel.location || '');
    setHotelRoomsInput(hotel.noOfRooms || 0);
    setHotelRatingInput(hotel.rating || 5);
    setHotelDescInput(hotel.description || '');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleDeleteHotel = async (id) => {
    if (!window.confirm('Are you absolutely sure you want to suspend this hotel agent partner? This will revoke their platform credentials.')) return;
    setErrorMessage('');
    setSuccessMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/auth/hotels/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Hotel partner suspended successfully.');
        fetchData();
      } else {
        setErrorMessage(data.message || 'Failed to suspend partner.');
      }
    } catch (err) {
      setErrorMessage('Server connection error.');
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

  const handleUpdateHotelStatus = async (hotelId, newStatus) => {
    const token = localStorage.getItem('token');
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await fetch(`/api/auth/admin/hotels/${hotelId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Hotel partner application has been successfully ${newStatus}!`);
        fetchData();
      } else {
        setErrorMessage(data.message || 'Failed to update hotel status.');
      }
    } catch (err) {
      setErrorMessage('Server connection failure.');
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
          <li className={activeTab === 'hotels' ? 'active' : ''} onClick={() => setActiveTab('hotels')}>
            <Building size={16} /> Manage Hotels
          </li>
          <li className={activeTab === 'approvals' ? 'active' : ''} onClick={() => setActiveTab('approvals')}>
            <Building size={16} /> Pending Approvals
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

        {successMessage && (
          <div className="success-alert" style={{ marginBottom: '20px' }}>
            <CheckCircle size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {loading ? (
          <div style={{ color: 'var(--accent-cyan)', padding: '50px 0' }}>
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
                                <button onClick={() => handleEditDestInit(dest)} className="btn-secondary" style={{ padding: '6px 12px' }}><Edit3 size={14} /></button>
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

            {/* TAB 5: HOTELS CRUD */}
            {activeTab === 'hotels' && (
              <div className="hotels-tab animate-fade-in">
                <h2 className="section-title">Manage Hotel Partners</h2>
                <div className="crud-split-layout">
                  {/* List */}
                  <div className="table-container list-column">
                    <table>
                      <thead>
                        <tr>
                          <th>Hotel Name</th>
                          <th>Location</th>
                          <th>Suites</th>
                          <th>Rating</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hotels.length > 0 ? (
                          hotels.map(hotel => (
                            <tr key={hotel._id}>
                              <td>
                                <strong>{hotel.hotelName || 'Pending Reg'}</strong>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact: {hotel.name} ({hotel.email})</div>
                              </td>
                              <td>{hotel.location || 'Pending Reg'}</td>
                              <td>{hotel.noOfRooms}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-gold)' }}>
                                  <Star size={12} style={{ fill: 'var(--accent-gold)' }} />
                                  <span>{hotel.rating}</span>
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button onClick={() => handleEditHotelInit(hotel)} className="btn-secondary" style={{ padding: '6px 12px' }}><Edit3 size={14} /></button>
                                  <button onClick={() => handleDeleteHotel(hotel._id)} className="btn-secondary" style={{ padding: '6px 12px', color: 'var(--accent-rose)', borderColor: 'rgba(255,46,147,0.2)' }}><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colspan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No registered hotel partners found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Form */}
                  <div className="glass-panel form-column">
                    <h4>{editingHotel ? 'Edit Partner Details' : 'Select Partner to Edit'}</h4>
                    {editingHotel ? (
                      <form onSubmit={handleHotelSubmit} style={{ marginTop: '15px' }}>
                        <div className="form-group">
                          <label>Hotel Registered Name</label>
                          <input type="text" className="form-input" value={hotelNameInput} onChange={(e) => setHotelNameInput(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label>Location City</label>
                          <input type="text" className="form-input" value={hotelLocationInput} onChange={(e) => setHotelLocationInput(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label>Total Room Suites</label>
                          <input type="number" className="form-input" value={hotelRoomsInput} onChange={(e) => setHotelRoomsInput(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label>Approved Star Rating</label>
                          <select className="form-select" value={hotelRatingInput} onChange={(e) => setHotelRatingInput(e.target.value)}>
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Hotel Description</label>
                          <textarea rows="4" className="form-textarea" value={hotelDescInput} onChange={(e) => setHotelDescInput(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                          <Save size={16} /> Save Hotel Changes
                        </button>
                        <button type="button" onClick={() => {
                          setEditingHotel(null);
                          setHotelNameInput('');
                          setHotelLocationInput('');
                          setHotelRoomsInput('');
                          setHotelRatingInput('5');
                          setHotelDescInput('');
                        }} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>Cancel</button>
                      </form>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '20px' }}>
                        Choose a hotel agent partner from the list on the left and click their Edit button to update their features, locations, ratings, and details for traveler reservations.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: PENDING APPROVALS */}
            {activeTab === 'approvals' && (
              <div className="approvals-tab animate-fade-in">
                <h2 className="section-title" style={{ marginBottom: '10px' }}>Pending Hotel Partners</h2>
                <p className="section-subtitle">Review applications from new hotel owners requesting access to JetVoyager traveler reservations.</p>
                <div className="table-container animate-fade-in">
                  <table>
                    <thead>
                      <tr>
                        <th>Hotel Information</th>
                        <th>Owner Name & NIC</th>
                        <th>Location & Capacity</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingHotels.length > 0 ? (
                        pendingHotels.map(hotel => (
                          <tr key={hotel._id}>
                            <td>
                              <strong style={{ color: 'var(--accent-cyan)', fontSize: '1.05rem' }}>{hotel.hotelName || 'Pending Name'}</strong>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '380px' }}>
                                {hotel.description || 'No description supplied.'}
                              </div>
                            </td>
                            <td>
                              <strong>{hotel.name}</strong>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email: {hotel.email}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone: {hotel.phone}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NIC: {hotel.nic}</div>
                            </td>
                            <td>
                              <strong>{hotel.location || 'Pending location'}</strong>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Suites: {hotel.noOfRooms} rooms</div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <button 
                                  onClick={() => handleUpdateHotelStatus(hotel._id, 'approved')} 
                                  className="btn-primary" 
                                  style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleUpdateHotelStatus(hotel._id, 'rejected')} 
                                  className="btn-secondary" 
                                  style={{ padding: '8px 16px', fontSize: '0.8rem', color: 'var(--accent-rose)', borderColor: 'rgba(255, 46, 147, 0.2)' }}
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colspan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                            <Building size={32} style={{ margin: '0 auto 12px', opacity: 0.5, display: 'block', color: 'var(--text-muted)' }} />
                            No pending hotel applications in queue.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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

      <style>{`
        .admin-dashboard-page {
          display: flex;
          min-height: 90vh;
        }

        .sidebar {
          width: 260px;
          border-radius: 0;
          border-top: none;
          border-bottom: none;
          border-left: none;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .sidebar-head {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sidebar-head h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
        }

        .logo-icon {
          color: var(--accent-cyan);
        }

        .sidebar-menu {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sidebar-menu li {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .sidebar-menu li:hover {
          background: rgba(255,255,255,0.02);
          color: var(--text-primary);
        }

        .sidebar-menu li.active {
          background: var(--bg-secondary);
          color: var(--accent-cyan);
          border: 1px solid rgba(0, 240, 255, 0.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .dashboard-main {
          flex: 1;
          padding: 40px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 25px;
        }

        .metric-box {
          padding: 25px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .metric-box .lbl {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .metric-box .val {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .metric-box.full-width {
          grid-column: 1 / -1;
        }

        /* CRUD Split Layout */
        .crud-split-layout {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 30px;
          align-items: start;
        }

        .form-column {
          padding: 30px;
        }

        .form-column h4 {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          color: var(--accent-gold);
          margin-bottom: 20px;
        }

        .error-alert, .success-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
        }

        .error-alert {
          background: rgba(255, 46, 147, 0.1);
          color: var(--accent-rose);
          border: 1px solid rgba(255, 46, 147, 0.2);
        }

        .success-alert {
          background: rgba(0, 240, 255, 0.1);
          color: var(--accent-cyan);
          border: 1px solid rgba(0, 240, 255, 0.2);
        }

        @media (max-width: 950px) {
          .admin-dashboard-page {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid var(--border-light);
            padding: 20px;
          }
          .crud-split-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
