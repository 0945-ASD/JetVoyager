import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Building, Phone, Mail, Compass } from 'lucide-react';

const Hotels = () => {
  const queryLocation = new URLSearchParams(useLocation().search);
  const initialLocation = queryLocation.get('location') || '';
  const initialDate = queryLocation.get('date') || '';

  const [hotels, setHotels] = useState([]);
  const [locationInput, setLocationInput] = useState(initialLocation);
  const [dateInput, setDateInput] = useState(initialDate);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchHotels = async (loc = '') => {
    setLoading(true);
    try {
      const url = loc ? `/api/auth/hotels?location=${encodeURIComponent(loc)}` : '/api/auth/hotels';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setHotels(data.hotels);
      }
    } catch (err) {
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels(initialLocation);
  }, [initialLocation]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Update url parameters
    navigate(`/hotels?location=${encodeURIComponent(locationInput)}&date=${dateInput}`);
  };

  return (
    <div className="hotels-search-page container animate-fade-in">
      <h2 className="section-title">Luxury Accommodations</h2>
      <p className="section-subtitle">Reserve elite lodgings approved by JetVoyager travel specialists</p>

      {/* Dynamic Search / Filtering Form */}
      <form onSubmit={handleSearchSubmit} className="glass-panel search-filter-bar">
        <div className="filter-field">
          <MapPin size={18} className="field-icon" />
          <input
            type="text"
            placeholder="Search by city or location..."
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
          />
        </div>
        <div className="filter-field">
          <Calendar size={18} className="field-icon" />
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary">Search Hotels</button>
      </form>

      {/* Hotel Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--accent-cyan)', padding: '60px 0' }}>
          <span>Scouting out accommodations...</span>
        </div>
      ) : hotels.length > 0 ? (
        <div className="hotels-grid">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="hotel-item-card glass-panel">
              <div className="hotel-image-header">
                <img
                  src={hotel.images && hotel.images[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}
                  alt={hotel.hotelName}
                />
                <div className="image-overlay"></div>
                <h3>{hotel.hotelName}</h3>
              </div>

              <div className="hotel-info-body">
                <p className="hotel-loc">
                  <MapPin size={14} /> {hotel.location}
                </p>
                <p className="hotel-desc">
                  {hotel.description
                    ? (hotel.description.length > 100 ? `${hotel.description.substring(0, 100)}...` : hotel.description)
                    : 'Luxury five-star hotel offering state-of-the-art facilities and elite accommodations.'
                  }
                </p>

                <div className="hotel-meta">
                  <span className="meta-item"><Building size={14} /> {hotel.noOfRooms} Suites</span>
                  <span className="meta-item"><Phone size={14} /> {hotel.phone}</span>
                </div>

                <hr style={{ borderColor: 'var(--border-light)', margin: '15px 0' }} />

                <Link to={`/hotels/${hotel._id}?date=${dateInput}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  View Room Availability
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results glass-panel">
          <Compass size={40} className="no-res-icon" />
          <p>No accommodations are currently registered in this city. Try searching for other popular destinations.</p>
        </div>
      )}

      <style>{`
        .search-filter-bar {
          display: flex;
          gap: 20px;
          padding: 15px 25px;
          border-radius: 12px;
          align-items: center;
          margin-bottom: 40px;
        }

        .filter-field {
          position: relative;
          flex: 1;
        }

        .filter-field .field-icon {
          position: absolute;
          left: 12px;
          top: 13px;
          color: var(--text-muted);
        }

        .filter-field input {
          width: 100%;
          padding: 12px 16px 12px 40px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.9rem;
          transition: var(--transition-smooth);
        }

        .filter-field input:focus {
          outline: none;
          border-color: var(--accent-cyan);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: var(--shadow-glow);
        }

        .hotels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }

        .hotel-item-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .hotel-image-header {
          position: relative;
          height: 180px;
          overflow: hidden;
        }

        .hotel-image-header img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .hotel-item-card:hover .hotel-image-header img {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 30%, rgba(7, 10, 19, 0.85) 100%);
        }

        .hotel-image-header h3 {
          position: absolute;
          bottom: 15px;
          left: 20px;
          font-size: 1.25rem;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .hotel-info-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .hotel-loc {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--accent-cyan);
          font-weight: 500;
          margin-bottom: 10px;
        }

        .hotel-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 20px;
          line-height: 1.5;
          flex: 1;
        }

        .hotel-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .no-results {
          padding: 50px 30px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          max-width: 450px;
          margin: 40px auto 0;
          color: var(--text-secondary);
        }

        .no-res-icon {
          stroke: var(--text-muted);
        }

        @media (max-width: 750px) {
          .search-filter-bar {
            flex-direction: column;
            align-items: stretch;
            padding: 20px;
          }
          .search-filter-bar button {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Hotels;
