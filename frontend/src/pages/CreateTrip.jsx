import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, Trash2, Plus, Plane, Navigation, Compass, ChevronRight, X, Loader } from 'lucide-react';

const CreateTrip = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    startPoint: '',
    endDestination: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/trips', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setTrips(data.trips);
      } else {
        setError(data.message || 'Failed to load your trips.');
      }
    } catch (err) {
      console.error(err);
      setError('A network issue occurred while loading voyages.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setSubmitError('Departure date cannot be after the return date.');
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setFormData({
          title: '',
          startDate: '',
          endDate: '',
          startPoint: '',
          endDestination: '',
        });
        // Redirect straight to the planner page
        navigate(`/trips/${data.trip._id}`);
      } else {
        setSubmitError(data.message || 'Failed to initialize voyage.');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('A connection problem occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTrip = async (tripId, e) => {
    e.stopPropagation(); // Avoid triggering route navigation
    if (!window.confirm('Are you sure you want to cancel and delete this luxury travel plan?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setTrips(trips.filter((t) => t._id !== tripId));
      } else {
        alert(data.message || 'Failed to cancel the trip.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the server.');
    }
  };

  const formatDateString = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container animate-fade-in">
      <div className="trips-header">
        <div>
          <h1 className="section-title">Your Luxury Journeys</h1>
          <p className="section-subtitle">Orchestrate collaborative itineraries, hotels, and custom travel timelines.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} /> Initialize Voyage
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <Loader className="spinner" size={40} />
          <p>Scanning custom flight paths...</p>
        </div>
      ) : error ? (
        <div className="error-card glass-panel">
          <p>{error}</p>
          <button className="btn-secondary" onClick={fetchTrips}>Retry</button>
        </div>
      ) : trips.length === 0 ? (
        <div className="empty-trips glass-panel">
          <Compass className="empty-icon" size={60} />
          <h2>No Voyages Charted</h2>
          <p>Embark on your next private charter. Plan activities, schedule hotel stays, invite group collaborators, and sync in real-time.</p>
          <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => setShowCreateModal(true)}>
            <Plus size={18} /> Plan Your First Trip
          </button>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map((trip) => {
            const isCreator = trip.creator?._id === user?._id;
            return (
              <div 
                key={trip._id} 
                className="trip-card glass-panel"
                onClick={() => navigate(`/trips/${trip._id}`)}
              >
                <div className="trip-card-header">
                  <h3>{trip.title}</h3>
                  {isCreator && (
                    <button 
                      className="delete-trip-btn"
                      onClick={(e) => handleDeleteTrip(trip._id, e)}
                      title="Cancel Voyage"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="trip-card-details">
                  <div className="detail-row">
                    <Calendar size={15} className="detail-icon" />
                    <span>
                      {formatDateString(trip.startDate)} - {formatDateString(trip.endDate)}
                    </span>
                  </div>

                  <div className="detail-row">
                    <Navigation size={15} className="detail-icon" />
                    <span className="route-text">
                      <strong>Depart:</strong> {trip.startPoint}
                    </span>
                  </div>

                  <div className="detail-row">
                    <MapPin size={15} className="detail-icon" />
                    <span className="route-text">
                      <strong>Arrive:</strong> {trip.endDestination}
                    </span>
                  </div>

                  <div className="detail-row">
                    <Users size={15} className="detail-icon" />
                    <span>
                      {trip.collaborators.length + 1} Traveler(s)
                      <span className="collaborator-pill">
                        {isCreator ? 'Organizer' : 'Collaborator'}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="trip-card-footer">
                  <span>Enter Flight Deck</span>
                  <ChevronRight size={16} className="arrow-icon" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Trip Form Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-card glass-panel animate-fade-in" style={{ maxWidth: '600px' }}>
            <button className="modal-close" onClick={() => setShowCreateModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-title-group">
              <Plane size={24} className="modal-icon" />
              <h2>Chart New Flight Path</h2>
            </div>
            <p className="modal-subtitle-text">Configure your destination bounds and initial departure points.</p>

            {submitError && <div className="error-message">{submitError}</div>}

            <form onSubmit={handleCreateTrip}>
              <div className="form-group">
                <label htmlFor="title">Voyage Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="e.g. Grand Tour of Paris / Spring Ryokan Retreat"
                  className="form-input"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="startDate">Departure Date Label</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    className="form-input"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">Return Date Label</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    required
                    className="form-input"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="startPoint">Starting Station or Point</label>
                <input
                  type="text"
                  id="startPoint"
                  name="startPoint"
                  required
                  placeholder="e.g. London St Pancras Station / Private Residence"
                  className="form-input"
                  value={formData.startPoint}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDestination">Ultimate Destination Hotel or Region</label>
                <input
                  type="text"
                  id="endDestination"
                  name="endDestination"
                  required
                  placeholder="e.g. Kyoto sowaka Ryokan / Eiffel Tower District"
                  className="form-input"
                  value={formData.endDestination}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-btn-row">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowCreateModal(false)}
                  disabled={submitting}
                >
                  Discard
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Charting...' : 'Confirm Voyage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .trips-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 0;
          color: var(--text-secondary);
        }

        .spinner {
          animation: spin 1.5s linear infinite;
          stroke: var(--accent-cyan);
          margin-bottom: 20px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .empty-trips {
          text-align: center;
          padding: 60px 40px;
          max-width: 600px;
          margin: 40px auto;
        }

        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .empty-trips p {
          color: var(--text-secondary);
          margin-top: 10px;
        }

        .trips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 25px;
          margin-top: 20px;
        }

        .trip-card {
          padding: 24px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .trip-card:hover {
          transform: translateY(-4px);
        }

        .trip-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 18px;
        }

        .trip-card-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
          max-width: 85%;
        }

        .delete-trip-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: var(--transition-fast);
        }

        .delete-trip-btn:hover {
          color: var(--accent-rose);
          background: rgba(255, 46, 147, 0.1);
        }

        .trip-card-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          color: var(--text-secondary);
        }

        .detail-icon {
          color: var(--accent-cyan);
          flex-shrink: 0;
        }

        .route-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .collaborator-pill {
          font-size: 0.7rem;
          padding: 2px 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          border-radius: 4px;
          margin-left: 8px;
          color: var(--text-muted);
        }

        .trip-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-light);
          padding-top: 14px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-cyan);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .trip-card:hover .arrow-icon {
          transform: translateX(4px);
        }

        .arrow-icon {
          transition: var(--transition-fast);
        }

        /* Modal specific layouts */
        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .modal-icon {
          color: var(--accent-cyan);
        }

        .modal-subtitle-text {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 25px;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .modal-btn-row {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 30px;
        }

        .error-message {
          background: rgba(255, 46, 147, 0.1);
          border: 1px solid rgba(255, 46, 147, 0.3);
          color: var(--accent-rose);
          border-radius: 8px;
          padding: 12px;
          font-size: 0.88rem;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default CreateTrip;
