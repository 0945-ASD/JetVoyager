import React, { useState, useEffect } from 'react';
import { Calendar, Building, MapPin, DollarSign, Compass, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const ManageTours = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    setActionError('');
    setActionSuccess('');

    if (!window.confirm('Are you absolutely sure you want to cancel this reservation?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      const data = await res.json();
      if (data.success) {
        setActionSuccess('Reservation successfully cancelled.');
        fetchMyBookings();
      } else {
        setActionError(data.message || 'Failed to cancel the booking.');
      }
    } catch (err) {
      setActionError('Error contacting the server.');
    }
  };

  // Group bookings
  const upcomingBookings = bookings.filter(b => b.status !== 'cancelled' && new Date(b.checkInDate) >= new Date());
  const historicalBookings = bookings.filter(b => b.status === 'cancelled' || new Date(b.checkInDate) < new Date());

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="manage-tours-page container animate-fade-in">
      <h2 className="section-title">Your Reservations</h2>
      <p className="section-subtitle">Track and manage your upcoming private jet and hotel tours</p>

      {actionError && (
        <div className="error-alert" style={{ marginBottom: '25px', maxWidth: '600px' }}>
          <AlertTriangle size={18} />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="success-alert" style={{ marginBottom: '25px', maxWidth: '600px' }}>
          <CheckCircle size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--accent-cyan)', padding: '60px 0' }}>
          <span>Loading your itinerary...</span>
        </div>
      ) : (
        <div className="bookings-dashboard-layout">
          {/* Active / Upcoming Bookings */}
          <div className="upcoming-section">
            <h3 className="section-sub-title">Upcoming Adventures</h3>
            {upcomingBookings.length > 0 ? (
              <div className="bookings-list">
                {upcomingBookings.map((booking) => (
                  <div key={booking._id} className="booking-item-card glass-panel">
                    <div className="card-head">
                      <div>
                        <h4>{booking.agent.hotelName}</h4>
                        <span className="location"><MapPin size={12} /> {booking.agent.location}</span>
                      </div>
                      <span className={`badge badge-${booking.status}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="card-details-grid">
                      <div className="detail-item">
                        <span className="lbl"><Calendar size={14} /> Dates</span>
                        <span className="val">{formatDate(booking.checkInDate)} – {formatDate(booking.checkOutDate)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="lbl"><Building size={14} /> Suite Type</span>
                        <span className="val">{booking.roomType} ({booking.noOfRooms} room)</span>
                      </div>
                      <div className="detail-item">
                        <span className="lbl"><DollarSign size={14} /> Total Cost</span>
                        <span className="val cost">${booking.totalPrice}</span>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="btn-secondary"
                        style={{ borderColor: 'rgba(255, 46, 147, 0.2)', color: 'var(--accent-rose)' }}
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-bookings glass-panel">
                <Compass size={32} style={{ color: 'var(--text-muted)' }} />
                <p>No upcoming reservations found. Time to plan your next escape!</p>
              </div>
            )}
          </div>

          {/* Booking History / Cancelled */}
          <div className="history-section" style={{ marginTop: '50px' }}>
            <h3 className="section-sub-title">Tour & Booking History</h3>
            {historicalBookings.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Hotel / Service</th>
                      <th>Dates</th>
                      <th>Room Package</th>
                      <th>Total Cost</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>
                          <strong>{booking.agent.hotelName}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{booking.agent.location}</div>
                        </td>
                        <td>{formatDate(booking.checkInDate)} – {formatDate(booking.checkOutDate)}</td>
                        <td>{booking.roomType}</td>
                        <td>${booking.totalPrice}</td>
                        <td>
                          <span className={`badge badge-${booking.status}`}>{booking.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-bookings glass-panel">
                <Clock size={32} style={{ color: 'var(--text-muted)' }} />
                <p>Your booking history is empty.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .section-sub-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          margin-bottom: 20px;
          color: var(--accent-gold);
        }

        .bookings-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 25px;
        }

        .booking-item-card {
          padding: 25px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .booking-item-card .card-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .booking-item-card .card-head h4 {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .booking-item-card .card-head .location {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }

        .card-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-light);
          padding: 15px;
          border-radius: 8px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .detail-item .lbl {
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .detail-item .val {
          font-weight: 500;
          color: var(--text-primary);
        }

        .detail-item .val.cost {
          color: var(--accent-gold);
          font-weight: 700;
        }

        .card-actions {
          display: flex;
          justify-content: flex-end;
        }

        .no-bookings {
          padding: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: var(--text-secondary);
          max-width: 500px;
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

        @media (max-width: 450px) {
          .bookings-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageTours;
