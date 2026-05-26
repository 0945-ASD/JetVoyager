import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building, DollarSign, Calendar, Upload, Plus, Trash2, Edit3, Save, CheckCircle, AlertTriangle } from 'lucide-react';

const AgentDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, details, rooms, orders

  // Local state replicas
  const [description, setDescription] = useState(user?.description || '');
  const [imagesInput, setImagesInput] = useState(user?.images?.join(', ') || '');
  const [thingsToDoInput, setThingsToDoInput] = useState(user?.thingsToDo?.join(', ') || '');

  // Room CRUD states
  const [roomTypes, setRoomTypes] = useState(user?.roomTypes || []);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomPrice, setNewRoomPrice] = useState('');
  const [newRoomCapacity, setNewRoomCapacity] = useState('2');

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch traveler orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/bookings/agent-bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.bookings);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to fetch traveler reservation lists.');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Format images & things to do
    const imagesArr = imagesInput.split(',').map(s => s.trim()).filter(Boolean);
    const thingsArr = thingsToDoInput.split(',').map(s => s.trim()).filter(Boolean);

    try {
      await updateProfile({
        description,
        images: imagesArr,
        thingsToDo: thingsArr,
      });
      setSuccessMessage('Hotel details updated successfully!');
    } catch (err) {
      setErrorMessage('Failed to update hotel descriptions.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddRoomType = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!newRoomName || !newRoomPrice) return;

    const newRoom = {
      name: newRoomName,
      price: Number(newRoomPrice),
      capacity: Number(newRoomCapacity),
      status: 'Available',
    };

    const updatedRooms = [...roomTypes, newRoom];

    try {
      await updateProfile({ roomTypes: updatedRooms });
      setRoomTypes(updatedRooms);
      setNewRoomName('');
      setNewRoomPrice('');
      setNewRoomCapacity('2');
      setSuccessMessage('New room package added successfully!');
    } catch (err) {
      setErrorMessage('Failed to save room package to profile.');
    }
  };

  const handleDeleteRoomType = async (roomId) => {
    if (!window.confirm('Delete this room package?')) return;
    setErrorMessage('');
    setSuccessMessage('');

    const updatedRooms = roomTypes.filter(r => r._id !== roomId);

    try {
      await updateProfile({ roomTypes: updatedRooms });
      setRoomTypes(updatedRooms);
      setSuccessMessage('Room package removed successfully.');
    } catch (err) {
      setErrorMessage('Failed to delete room package.');
    }
  };

  const handleToggleRoomStatus = async (roomId, currentStatus) => {
    setErrorMessage('');
    setSuccessMessage('');

    const newStatus = currentStatus === 'Available' ? 'Maintenance' : 'Available';
    const updatedRooms = roomTypes.map(r => r._id === roomId ? { ...r, status: newStatus } : r);

    try {
      await updateProfile({ roomTypes: updatedRooms });
      setRoomTypes(updatedRooms);
      setSuccessMessage(`Room status updated to ${newStatus}.`);
    } catch (err) {
      setErrorMessage('Failed to update room package status.');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await fetch(`/api/bookings/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Order marked as ${newStatus} successfully.`);
        fetchOrders();
      } else {
        setErrorMessage(data.message || 'Failed to update order status.');
      }
    } catch (err) {
      setErrorMessage('Network connection error.');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  if (!user) return null;

  return (
    <div className="agent-dashboard-page animate-fade-in">
      {/* Side menu navigation */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-head">
          <Building size={20} className="logo-icon" />
          <h3>Agent Panel</h3>
        </div>
        <ul className="sidebar-menu">
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <Building size={16} /> Property Dashboard
          </li>
          <li className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>
            <Upload size={16} /> Manage Descriptions
          </li>
          <li className={activeTab === 'rooms' ? 'active' : ''} onClick={() => setActiveTab('rooms')}>
            <Plus size={16} /> Manage Room Packages
          </li>
          <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            <Calendar size={16} /> Booking Orders
          </li>
        </ul>
      </aside>

      {/* Main dashboard space */}
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

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-tab animate-fade-in">
            <h2 className="section-title">{user.hotelName} Dashboard</h2>
            <p className="section-subtitle">Overview of traveler booking metrics and room packages</p>

            <div className="metrics-grid">
              <div className="glass-panel metric-box">
                <span className="lbl">Approval Status</span>
                <span className="val" style={{ color: 'var(--accent-cyan)' }}>
                  <span className="badge badge-confirmed" style={{ fontSize: '0.85rem', verticalAlign: 'middle', textTransform: 'uppercase' }}>
                    {user.approvalStatus}
                  </span>
                </span>
              </div>
              <div className="glass-panel metric-box">
                <span className="lbl">Total Capacities</span>
                <span className="val">{user.noOfRooms} Suites</span>
              </div>
              <div className="glass-panel metric-box">
                <span className="lbl">Active Packages</span>
                <span className="val">{roomTypes.length} Tiers</span>
              </div>
              <div className="glass-panel metric-box">
                <span className="lbl">Total Orders</span>
                <span className="val">{orders.length} Reservations</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE DETAILS */}
        {activeTab === 'details' && (
          <div className="details-tab animate-fade-in">
            <h2 className="section-title">Manage Hotel Descriptions</h2>
            <p className="section-subtitle">Specify property listings, features, and upload showcase images</p>

            <div className="glass-panel" style={{ padding: '30px', maxWidth: '750px' }}>
              <form onSubmit={handleUpdateDetails}>
                <div className="form-group">
                  <label>Hotel Description</label>
                  <textarea
                    rows="6"
                    className="form-textarea"
                    placeholder="Provide a stunning five-star description of your hotel, features, and amenities..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Showcase Images (Comma Separated URLs)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://image1.jpg, https://image2.jpg"
                    value={imagesInput}
                    onChange={(e) => setImagesInput(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Perks & Attractions (Things to Do - Comma Separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dior Spa Treatments, Private Excursions, Sunset Tastings"
                    value={thingsToDoInput}
                    onChange={(e) => setThingsToDoInput(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '10px' }} disabled={saving}>
                  <Save size={18} /> {saving ? 'Applying...' : 'Apply Details'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE ROOM PACKAGES */}
        {activeTab === 'rooms' && (
          <div className="rooms-tab animate-fade-in">
            <h2 className="section-title">Manage Room Tiers</h2>
            <p className="section-subtitle">Register hotel room packages, nightly rates, and toggle availability</p>

            <div className="crud-split-layout">
              {/* List */}
              <div className="rooms-list-container">
                <h4 className="sub-title">Registered Packages</h4>
                <div className="room-options-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {roomTypes.length > 0 ? (
                    roomTypes.map((room) => (
                      <div key={room._id} className="room-type-card glass-panel" style={{ cursor: 'default' }}>
                        <div>
                          <h4 style={{ fontWeight: 600 }}>{room.name}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Capacity: {room.capacity} Guests</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-gold)' }}>${room.price}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ night</span>
                          </div>
                          <button
                            onClick={() => handleToggleRoomStatus(room._id, room.status)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: room.status === 'Available' ? 'var(--border-light)' : 'rgba(255, 46, 147, 0.2)' }}
                          >
                            {room.status}
                          </button>
                          <button onClick={() => handleDeleteRoomType(room._id)} className="btn-secondary" style={{ padding: '6px 12px', color: 'var(--accent-rose)', borderColor: 'rgba(255,46,147,0.2)' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No room packages currently offered by your hotel. Please add one below.</p>
                  )}
                </div>
              </div>

              {/* Form */}
              <div className="glass-panel form-column">
                <h4>Add New Room Tier</h4>
                <form onSubmit={handleAddRoomType} style={{ marginTop: '15px' }}>
                  <div className="form-group">
                    <label>Package Name</label>
                    <input type="text" className="form-input" placeholder="e.g. Luxury Presidential Penthouse" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label>Nightly Price ($ USD)</label>
                    <div style={{ position: 'relative' }}>
                      <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                      <input type="number" className="form-input" style={{ paddingLeft: '35px' }} placeholder="e.g. 450" value={newRoomPrice} onChange={(e) => setNewRoomPrice(e.target.value)} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Guest Capacity</label>
                    <select className="form-select" value={newRoomCapacity} onChange={(e) => setNewRoomCapacity(e.target.value)}>
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="6">6 Guests</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Plus size={16} /> Register Package
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {activeTab === 'orders' && (
          <div className="orders-tab animate-fade-in">
            <h2 className="section-title">Suite Reservations</h2>
            <p className="section-subtitle">Review bookings placed by travelers at your property</p>

            {loadingOrders ? (
              <div style={{ color: 'var(--accent-cyan)' }}>
                <span>Loading property reservations...</span>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Traveler</th>
                      <th>Dates</th>
                      <th>Room Tier</th>
                      <th>Suites</th>
                      <th>Billing</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map(order => (
                        <tr key={order._id}>
                          <td>
                            <strong>{order.user?.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.user?.phone}</div>
                          </td>
                          <td>{formatDate(order.checkInDate)} – {formatDate(order.checkOutDate)}</td>
                          <td>{order.roomType}</td>
                          <td>{order.noOfRooms} room</td>
                          <td><strong style={{ color: 'var(--accent-gold)' }}>${order.totalPrice}</strong></td>
                          <td>
                            <span className={`badge badge-${order.status}`}>{order.status}</span>
                          </td>
                          <td>
                            {order.status === 'pending' && (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleUpdateOrderStatus(order._id, 'confirmed')} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Confirm</button>
                                <button onClick={() => handleUpdateOrderStatus(order._id, 'cancelled')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', color: 'var(--accent-rose)' }}>Cancel</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colspan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No traveler reservations booked yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AgentDashboard;
