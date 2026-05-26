import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Star, Calendar, Users, Building, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HotelDetails = () => {
  const { id } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const initialDate = query.get('date') || '';

  const { user } = useAuth();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking states
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState(initialDate || new Date().toISOString().split('T')[0]);
  
  // Default checkout is check-in + 1 day
  const getDefaultCheckout = (checkInStr) => {
    const d = new Date(checkInStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [checkOut, setCheckOut] = useState(getDefaultCheckout(checkIn));
  const [noOfRooms, setNoOfRooms] = useState(1);
  const [nights, setNights] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch hotel details
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/auth/hotels/${id}`);
        const data = await res.json();
        if (data.success) {
          setHotel(data.hotel);
          if (data.hotel.roomTypes && data.hotel.roomTypes.length > 0) {
            setSelectedRoom(data.hotel.roomTypes[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching hotel details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  // Recalculate nights whenever check-in or check-out changes
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays > 0 ? diffDays : 0);
    }
  }, [checkIn, checkOut]);

  const handleCheckInChange = (val) => {
    setCheckIn(val);
    const checkoutVal = getDefaultCheckout(val);
    setCheckOut(checkoutVal);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess(false);

    if (!user) {
      // Redirect to login
      navigate('/login', { state: { from: { pathname: `/hotels/${id}` } } });
      return;
    }

    if (user.role !== 'traveler') {
      setBookingError('Only accounts registered as Travelers can book rooms.');
      return;
    }

    if (nights <= 0) {
      setBookingError('Check-out date must be at least 1 day after check-in.');
      return;
    }

    setBookingLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          agentId: hotel._id,
          roomTypeName: selectedRoom.name,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          noOfRooms,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          navigate('/manage-tours');
        }, 1500);
      } else {
        setBookingError(data.message || 'Failed to complete booking.');
      }
    } catch (err) {
      setBookingError('Error connecting to server. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--accent-cyan)', padding: '100px 0' }}>
        <span>Retrieving property suites...</span>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h3 style={{ color: 'var(--accent-rose)' }}>Hotel Not Found</h3>
        <p>The accommodation resource requested does not exist or has been removed.</p>
      </div>
    );
  }

  const totalPrice = selectedRoom ? nights * selectedRoom.price * noOfRooms : 0;

  return (
    <div className="hotel-details-page container animate-fade-in">
      {/* Luxury banner header */}
      <div className="hotel-header-banner glass-panel">
        <div className="banner-image">
          <img
            src={hotel.images && hotel.images[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"}
            alt={hotel.hotelName}
          />
          <div className="image-overlay"></div>
        </div>
        <div className="banner-content">
          <div className="banner-meta">
            <span className="hotel-loc"><MapPin size={16} /> {hotel.location}</span>
            <span className="hotel-rating">
              <Star size={16} style={{ fill: 'var(--accent-gold)', stroke: 'var(--accent-gold)' }} />
              {hotel.rating || 5}.0 (Verified Partner)
            </span>
          </div>
          <h1>{hotel.hotelName}</h1>
          <p className="description">{hotel.description || 'Welcome to a gorgeous hotel partnered directly with JetVoyager services.'}</p>
        </div>
      </div>

      <div className="booking-room-layout">
        {/* Left Side: Room Options list */}
        <div className="rooms-section">
          <h3 className="sub-title">Select Accommodation Package</h3>
          
          <div className="room-options-list">
            {hotel.roomTypes && hotel.roomTypes.length > 0 ? (
              hotel.roomTypes.map((room) => (
                <div
                  key={room._id}
                  className={`room-type-card glass-panel ${selectedRoom?._id === room._id ? 'selected' : ''} ${room.status !== 'Available' ? 'maintenance' : ''}`}
                  onClick={() => room.status === 'Available' && setSelectedRoom(room)}
                >
                  <div className="room-details-left">
                    <h4>{room.name}</h4>
                    <span className="capacity"><Users size={14} /> Accommodates: {room.capacity} Guests</span>
                    <div className="features">
                      <span className="feat-pill">Free Wifi</span>
                      <span className="feat-pill">Climate Control</span>
                      <span className="feat-pill">Mini Bar</span>
                    </div>
                  </div>

                  <div className="room-price-right">
                    <div className="price-tag">
                      <span className="amt">${room.price}</span>
                      <span className="unit">/ night</span>
                    </div>
                    {room.status === 'Available' ? (
                      <span className="status-avail">Available</span>
                    ) : (
                      <span className="status-maint">Maintenance</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No room packages currently offered by this hotel.</p>
            )}
          </div>
        </div>

        {/* Right Side: Floating Booking Drawer/Panel */}
        {selectedRoom && (
          <div className="booking-panel-wrapper">
            <div className="glass-panel booking-summary-card animate-pulse-glow">
              <h4>Room Reservation</h4>
              <p className="selected-tag">{selectedRoom.name} Package</p>

              <form onSubmit={handleBooking} style={{ marginTop: '20px' }}>
                {bookingError && (
                  <div className="error-alert" style={{ marginBottom: '15px' }}>
                    <AlertTriangle size={16} />
                    <span>{bookingError}</span>
                  </div>
                )}

                {bookingSuccess && (
                  <div className="success-alert" style={{ marginBottom: '15px' }}>
                    <CheckCircle size={16} />
                    <span>Booking successful! Redirecting...</span>
                  </div>
                )}

                <div className="form-group">
                  <label><Calendar size={14} /> Check-In Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={checkIn}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label><Calendar size={14} /> Check-Out Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label><Building size={14} /> Number of Suites</label>
                  <input
                    type="number"
                    className="form-input"
                    min="1"
                    max="10"
                    value={noOfRooms}
                    onChange={(e) => setNoOfRooms(Number(e.target.value))}
                    required
                  />
                </div>

                <hr style={{ borderColor: 'var(--border-light)', margin: '20px 0' }} />

                {/* Billing Summary breakdown */}
                <div className="billing-breakdown">
                  <div className="bill-row">
                    <span>{selectedRoom.name} x {nights} nights</span>
                    <span>${selectedRoom.price * nights}</span>
                  </div>
                  <div className="bill-row">
                    <span>Number of Suites</span>
                    <span>x {noOfRooms}</span>
                  </div>
                  <hr style={{ borderColor: 'var(--border-light)', margin: '10px 0' }} />
                  <div className="bill-row total">
                    <span>Estimated Total</span>
                    <span className="total-amt">${totalPrice}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}
                  disabled={bookingLoading || bookingSuccess || selectedRoom.status !== 'Available'}
                >
                  {bookingLoading ? 'Reserving...' : bookingSuccess ? 'Reserved!' : 'Confirm Reservation'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .hotel-header-banner {
          position: relative;
          overflow: hidden;
          margin-bottom: 40px;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
        }

        .banner-image {
          position: relative;
          height: 320px;
        }

        .banner-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .banner-content {
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .banner-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          font-size: 0.9rem;
        }

        .hotel-loc {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--accent-cyan);
          font-weight: 500;
        }

        .hotel-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--accent-gold);
          font-weight: 600;
        }

        .banner-content h1 {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          margin-bottom: 15px;
          font-weight: 700;
        }

        .banner-content .description {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .booking-room-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          align-items: start;
        }

        .sub-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          margin-bottom: 25px;
        }

        .room-options-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .room-type-card {
          display: flex;
          justify-content: space-between;
          padding: 25px;
          cursor: pointer;
        }

        .room-type-card.selected {
          border-color: var(--accent-cyan);
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.15);
          background: rgba(0, 240, 255, 0.02);
        }

        .room-type-card.maintenance {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .room-details-left {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .room-details-left h4 {
          font-size: 1.15rem;
          font-weight: 600;
        }

        .room-details-left .capacity {
          font-size: 0.85rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .features {
          display: flex;
          gap: 10px;
          margin-top: 5px;
        }

        .feat-pill {
          font-size: 0.7rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          padding: 2px 8px;
          border-radius: 4px;
          color: var(--text-muted);
        }

        .room-price-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
        }

        .price-tag .amt {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-gold);
        }

        .price-tag .unit {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .status-avail {
          font-size: 0.75rem;
          color: var(--accent-cyan);
          font-weight: 700;
        }

        .status-maint {
          font-size: 0.75rem;
          color: var(--accent-rose);
          font-weight: 700;
        }

        /* Booking summary card right side */
        .booking-summary-card {
          padding: 30px;
        }

        .booking-summary-card h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .booking-summary-card .selected-tag {
          font-size: 0.8rem;
          color: var(--accent-cyan);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }

        .billing-breakdown {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .bill-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .bill-row.total {
          color: var(--text-primary);
          font-weight: 700;
          font-size: 1.05rem;
        }

        .bill-row.total .total-amt {
          color: var(--accent-gold);
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

        @media (max-width: 900px) {
          .hotel-header-banner {
            grid-template-columns: 1fr;
          }
          .banner-image {
            height: 200px;
          }
          .booking-room-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default HotelDetails;
