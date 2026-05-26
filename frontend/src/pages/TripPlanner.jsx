import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TripMap from '../components/TripMap';
import { 
  Calendar, MapPin, Users, Plus, CheckCircle, Circle, Trash2, 
  UserPlus, Clock, Loader, PlaneTakeoff, Info, ArrowLeft, X, 
  Map, CheckSquare, PlusCircle, Bookmark, Compass
} from 'lucide-react';

const TripPlanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lists fetched for linking
  const [activities, setActivities] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Modals state
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCollabModal, setShowCollabModal] = useState(false);

  // Form states
  const [collabEmail, setCollabEmail] = useState('');
  const [collabError, setCollabError] = useState(null);
  const [collabSuccess, setCollabSuccess] = useState(null);
  const [collabSubmitting, setCollabSubmitting] = useState(false);

  const [eventForm, setEventForm] = useState({
    date: '',
    time: '12:00 PM',
    type: 'activity',
    title: '',
    description: '',
    activityRef: '',
    bookingRef: '',
  });
  const [eventError, setEventError] = useState(null);
  const [eventSubmitting, setEventSubmitting] = useState(false);

  useEffect(() => {
    fetchTripDetails();
    fetchActivitiesList();
    fetchBookingsList();
  }, [id]);

  const fetchTripDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/trips/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setTrip(data.trip);
        // Pre-fill event date with trip start date
        setEventForm(prev => ({
          ...prev,
          date: data.trip.startDate ? data.trip.startDate.split('T')[0] : '',
        }));
      } else {
        setError(data.message || 'Failed to fetch voyage timeline.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failure while loading itinerary details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivitiesList = async () => {
    try {
      const res = await fetch('/api/activities');
      const data = await res.json();
      if (data.success) {
        setActivities(data.activities);
      }
    } catch (err) {
      console.error('Failed to load experiences list:', err);
    }
  };

  const fetchBookingsList = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        // Filter confirmed bookings to link
        setBookings(data.bookings.filter(b => b.status === 'confirmed'));
      }
    } catch (err) {
      console.error('Failed to load active bookings:', err);
    }
  };

  const handleToggleEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/trips/${id}/timeline/${eventId}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setTrip(data.trip);
      }
    } catch (err) {
      console.error('Failed to toggle checklist event:', err);
    }
  };

  const handleRemoveEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to remove this milestone from the timeline?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/trips/${id}/timeline/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setTrip(data.trip);
      }
    } catch (err) {
      console.error('Failed to delete timeline event:', err);
    }
  };

  const handleAddCollab = async (e) => {
    e.preventDefault();
    setCollabError(null);
    setCollabSuccess(null);
    setCollabSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/trips/${id}/collaborators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: collabEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setCollabSuccess(data.message);
        setCollabEmail('');
        // Re-load trip details to show updated collaborators list
        fetchTripDetails();
      } else {
        setCollabError(data.message || 'Traveler search returned no matches.');
      }
    } catch (err) {
      console.error(err);
      setCollabError('Failed to invite collaborator.');
    } finally {
      setCollabSubmitting(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setEventError(null);
    setEventSubmitting(true);

    const tripStart = new Date(trip.startDate);
    const tripEnd = new Date(trip.endDate);
    const selectedDate = new Date(eventForm.date);

    if (selectedDate < tripStart || selectedDate > tripEnd) {
      setEventError('Timeline events must occur within the voyager date bounds.');
      setEventSubmitting(false);
      return;
    }

    // Populate title/description from linked activity/booking if blank
    let payloadTitle = eventForm.title;
    let payloadDesc = eventForm.description;

    if (eventForm.type === 'activity' && eventForm.activityRef) {
      const activeObj = activities.find(a => a._id === eventForm.activityRef);
      if (activeObj) {
        payloadTitle = payloadTitle || activeObj.name;
        payloadDesc = payloadDesc || activeObj.description;
      }
    } else if ((eventForm.type === 'hotel_checkin' || eventForm.type === 'hotel_checkout') && eventForm.bookingRef) {
      const bookingObj = bookings.find(b => b._id === eventForm.bookingRef);
      if (bookingObj) {
        payloadTitle = payloadTitle || `${eventForm.type === 'hotel_checkin' ? 'Check-in to' : 'Check-out from'} ${bookingObj.hotelName}`;
        payloadDesc = payloadDesc || `Room: ${bookingObj.roomType} - Guests: ${bookingObj.guestsCount}`;
      }
    }

    if (!payloadTitle) {
      setEventError('Event title is required.');
      setEventSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/trips/${id}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...eventForm,
          title: payloadTitle,
          description: payloadDesc,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTrip(data.trip);
        setShowEventModal(false);
        // Reset form keeping date
        setEventForm({
          date: trip.startDate.split('T')[0],
          time: '12:00 PM',
          type: 'activity',
          title: '',
          description: '',
          activityRef: '',
          bookingRef: '',
        });
      } else {
        setEventError(data.message || 'Failed to append milestone.');
      }
    } catch (err) {
      console.error(err);
      setEventError('Failed to connect to the server.');
    } finally {
      setEventSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader className="spinner" size={40} />
        <p>Synchronizing group flight timelines...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="container">
        <div className="error-card glass-panel text-center">
          <Info size={40} className="detail-icon" style={{ margin: '0 auto 15px' }} />
          <h3>Timeline Unreachable</h3>
          <p>{error || 'This voyage has not been logged or you do not carry authorization credentials.'}</p>
          <button className="btn-secondary" style={{ marginTop: '15px' }} onClick={() => navigate('/trips')}>
            <ArrowLeft size={16} /> Return to Flight Deck
          </button>
        </div>
      </div>
    );
  }

  const isCreator = trip.creator?._id === user?._id;

  return (
    <div className="container animate-fade-in">
      <button className="back-link-btn" onClick={() => navigate('/trips')}>
        <ArrowLeft size={16} /> Back to Voyages
      </button>

      <div className="planner-grid">
        {/* Left Side: General Info, Map, Collaborators */}
        <div className="left-panel-group">
          <div className="glass-panel info-card">
            <h1 className="trip-main-title">{trip.title}</h1>
            <div className="trip-meta-box">
              <div className="meta-item">
                <Calendar size={16} className="meta-icon" />
                <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
              </div>
              <div className="meta-item">
                <MapPin size={16} className="meta-icon" />
                <span>{trip.startPoint} ➔ {trip.endDestination}</span>
              </div>
            </div>

            <div className="collaborators-section">
              <div className="collab-sec-header">
                <div className="collab-sec-title">
                  <Users size={16} className="meta-icon" />
                  <h5>Voyage Crew ({trip.collaborators.length + 1})</h5>
                </div>
                <button className="btn-icon-add" onClick={() => setShowCollabModal(true)}>
                  <UserPlus size={16} /> Invite
                </button>
              </div>

              <div className="crew-list">
                <div className="crew-member">
                  <div className="member-avatar creator-avatar">M</div>
                  <div className="member-info">
                    <span className="member-name">{trip.creator?.name}</span>
                    <span className="member-role">Commander (Host)</span>
                  </div>
                </div>
                {trip.collaborators.map((collab) => (
                  <div key={collab._id} className="crew-member">
                    <div className="member-avatar">C</div>
                    <div className="member-info">
                      <span className="member-name">{collab.name}</span>
                      <span className="member-role">Co-Pilot</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Tactical Map */}
          <TripMap 
            startPoint={trip.startPoint} 
            endDestination={trip.endDestination} 
            timeline={trip.timeline} 
          />
        </div>

        {/* Right Side: Timeline Checklist */}
        <div className="right-panel-group">
          <div className="glass-panel timeline-card">
            <div className="timeline-header">
              <div className="timeline-title-row">
                <CheckSquare size={18} className="timeline-header-icon" />
                <h4>Interactive Flight Plan checklist</h4>
              </div>
              <button className="btn-primary" onClick={() => setShowEventModal(true)}>
                <Plus size={16} /> Schedule Milestone
              </button>
            </div>

            <div className="timeline-stream">
              {trip.timeline.length === 0 ? (
                <div className="empty-timeline-state">
                  <Compass size={40} className="empty-compass" />
                  <p>Your itinerary timeline is empty. Add transport nodes, hotel check-ins, or experiences to coordinate details.</p>
                </div>
              ) : (
                trip.timeline.map((event, idx) => {
                  const isSystemStartEnd = event.type === 'start' || event.type === 'end';
                  return (
                    <div key={event._id} className={`timeline-node ${event.completed ? 'completed' : ''}`}>
                      <button 
                        className="toggle-check-btn"
                        onClick={() => handleToggleEvent(event._id)}
                      >
                        {event.completed ? (
                          <CheckCircle className="check-icon checked" size={20} />
                        ) : (
                          <Circle className="check-icon unchecked" size={20} />
                        )}
                      </button>

                      <div className="node-line"></div>

                      <div className="node-content glass-panel">
                        <div className="node-header">
                          <div className="node-time-badge">
                            <Clock size={12} className="time-badge-icon" />
                            <span>{formatDate(event.date)} at {event.time}</span>
                          </div>

                          {!isSystemStartEnd && (
                            <button 
                              className="remove-node-btn"
                              onClick={() => handleRemoveEvent(event._id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        <h4 className="node-title">{event.title}</h4>
                        {event.description && <p className="node-desc">{event.description}</p>}

                        {/* Linked Attachments badge */}
                        {event.activityRef && (
                          <div className="linked-badge-card">
                            <Compass size={12} className="linked-badge-icon" />
                            <span>Linked Tour Experience: <strong>{event.activityRef.name}</strong> ({event.activityRef.location?.city})</span>
                          </div>
                        )}

                        {event.bookingRef && (
                          <div className="linked-badge-card hotel">
                            <Bookmark size={12} className="linked-badge-icon hotel" />
                            <span>Linked Active Reservation</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Collaborator Modal */}
      {showCollabModal && (
        <div className="modal-overlay">
          <div className="modal-card glass-panel animate-fade-in" style={{ maxWidth: '500px' }}>
            <button className="modal-close" onClick={() => setShowCollabModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-title-group">
              <UserPlus size={22} className="modal-icon" />
              <h2>Enlist Flight Crew</h2>
            </div>
            <p className="modal-subtitle-text">Invite another traveler by email to edit and synchronize your checklist in real-time.</p>

            {collabError && <div className="error-message">{collabError}</div>}
            {collabSuccess && <div className="success-message">{collabSuccess}</div>}

            <form onSubmit={handleAddCollab}>
              <div className="form-group">
                <label htmlFor="collabEmail">Traveler Email Address</label>
                <input
                  type="email"
                  id="collabEmail"
                  required
                  placeholder="traveler@example.com"
                  className="form-input"
                  value={collabEmail}
                  onChange={(e) => setCollabEmail(e.target.value)}
                />
              </div>

              <div className="modal-btn-row">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => {
                    setShowCollabModal(false);
                    setCollabError(null);
                    setCollabSuccess(null);
                  }}
                  disabled={collabSubmitting}
                >
                  Close
                </button>
                <button type="submit" className="btn-primary" disabled={collabSubmitting}>
                  {collabSubmitting ? 'Inviting...' : 'Enlist Crew Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Milestone Modal */}
      {showEventModal && (
        <div className="modal-overlay">
          <div className="modal-card glass-panel animate-fade-in" style={{ maxWidth: '600px' }}>
            <button className="modal-close" onClick={() => setShowEventModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-title-group">
              <PlusCircle size={22} className="modal-icon" />
              <h2>Schedule Journey Milestone</h2>
            </div>
            <p className="modal-subtitle-text">Append intermediate activities, flight transits, or hotel check-ins chronologically.</p>

            {eventError && <div className="error-message">{eventError}</div>}

            <form onSubmit={handleAddEvent}>
              <div className="form-row-2">
                <div className="form-group">
                  <label htmlFor="eventType">Milestone Category</label>
                  <select
                    id="eventType"
                    className="form-select"
                    value={eventForm.type}
                    onChange={(e) => {
                      setEventForm({
                        ...eventForm,
                        type: e.target.value,
                        activityRef: '',
                        bookingRef: '',
                        title: '',
                        description: '',
                      });
                      setEventError(null);
                    }}
                  >
                    <option value="activity">Experience Activity</option>
                    <option value="transport">Transit & Transportation</option>
                    <option value="hotel_checkin">Hotel Stay Check-In</option>
                    <option value="hotel_checkout">Hotel Stay Check-Out</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="eventTime">Scheduled Time</label>
                  <input
                    type="text"
                    id="eventTime"
                    required
                    placeholder="e.g. 10:30 AM / 04:00 PM"
                    className="form-input"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="eventDate">Target Date</label>
                <input
                  type="date"
                  id="eventDate"
                  required
                  className="form-input"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                />
              </div>

              {/* Dynamic Sub-Forms based on Type */}
              {eventForm.type === 'activity' && (
                <div className="form-group">
                  <label htmlFor="activityRef">Link Seeded Luxury experience</label>
                  <select
                    id="activityRef"
                    className="form-select"
                    value={eventForm.activityRef}
                    onChange={(e) => setEventForm({ ...eventForm, activityRef: e.target.value })}
                  >
                    <option value="">-- Choose Seeded Attraction (Optional) --</option>
                    {activities.map(act => (
                      <option key={act._id} value={act._id}>
                        {act.name} ({act.location?.city})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(eventForm.type === 'hotel_checkin' || eventForm.type === 'hotel_checkout') && (
                <div className="form-group">
                  <label htmlFor="bookingRef">Link Confirmed Hotel booking</label>
                  <select
                    id="bookingRef"
                    className="form-select"
                    value={eventForm.bookingRef}
                    onChange={(e) => setEventForm({ ...eventForm, bookingRef: e.target.value })}
                  >
                    <option value="">-- Choose Confirmed Booking (Optional) --</option>
                    {bookings.map(b => (
                      <option key={b._id} value={b._id}>
                        {b.hotelName} ({b.roomType} room - check in {formatDate(b.checkInDate)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="eventTitle">Custom Label / Description (Overrides Seed Default)</label>
                <input
                  type="text"
                  id="eventTitle"
                  placeholder="e.g. Louvre Private Tour / Train to Rome / Hotel Check-in"
                  className="form-input"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="eventDesc">Milestone Notes</label>
                <textarea
                  id="eventDesc"
                  placeholder="e.g. Keep train passports handy / Gate 4B"
                  className="form-textarea"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                />
              </div>

              <div className="modal-btn-row">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowEventModal(false)}
                  disabled={eventSubmitting}
                >
                  Discard
                </button>
                <button type="submit" className="btn-primary" disabled={eventSubmitting}>
                  {eventSubmitting ? 'Scheduling...' : 'Apply Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .back-link-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.9rem;
          margin-bottom: 25px;
          transition: var(--transition-fast);
        }

        .back-link-btn:hover {
          color: var(--accent-cyan);
          transform: translateX(-2px);
        }

        .planner-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          align-items: start;
        }

        @media (max-width: 1000px) {
          .planner-grid {
            grid-template-columns: 1fr;
          }
        }

        .left-panel-group, .right-panel-group {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .info-card {
          padding: 30px;
        }

        .trip-main-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.25;
          margin-bottom: 12px;
        }

        .trip-meta-box {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 24px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .meta-icon {
          color: var(--accent-cyan);
        }

        .collab-sec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .collab-sec-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .collab-sec-title h5 {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .btn-icon-add {
          background: rgba(0, 240, 255, 0.08);
          border: 1px solid rgba(0, 240, 255, 0.2);
          color: var(--accent-cyan);
          padding: 6px 12px;
          font-size: 0.78rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition-smooth);
        }

        .btn-icon-add:hover {
          background: var(--accent-cyan);
          color: var(--bg-primary);
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.35);
        }

        .crew-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .crew-member {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-light);
          padding: 8px 12px;
          border-radius: 8px;
        }

        .member-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 240, 255, 0.1);
          color: var(--accent-cyan);
          border: 1px solid rgba(0, 240, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
        }

        .creator-avatar {
          background: rgba(255, 215, 0, 0.1);
          color: var(--accent-gold);
          border-color: rgba(255, 215, 0, 0.2);
        }

        .member-info {
          display: flex;
          flex-direction: column;
        }

        .member-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }

        .member-role {
          font-size: 0.68rem;
          color: var(--text-muted);
        }

        /* Timeline streamline styles */
        .timeline-card {
          padding: 30px;
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 20px;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .timeline-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .timeline-header-icon {
          color: var(--accent-cyan);
        }

        .timeline-header h4 {
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-primary);
        }

        .timeline-stream {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .empty-timeline-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
        }

        .empty-compass {
          color: var(--text-muted);
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .empty-timeline-state p {
          font-size: 0.88rem;
          line-height: 1.5;
          max-width: 380px;
          margin: 0 auto;
        }

        .timeline-node {
          display: flex;
          gap: 20px;
          position: relative;
          padding-bottom: 30px;
        }

        .timeline-node:last-child {
          padding-bottom: 0;
        }

        .toggle-check-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
          height: 24px;
          display: flex;
          align-items: center;
          z-index: 2;
        }

        .check-icon {
          transition: var(--transition-smooth);
        }

        .check-icon.unchecked {
          color: var(--text-muted);
        }

        .check-icon.checked {
          color: var(--accent-cyan);
          filter: drop-shadow(0 0 4px var(--accent-cyan));
        }

        .node-line {
          position: absolute;
          left: 10px;
          top: 24px;
          bottom: 0;
          width: 2px;
          background: var(--border-light);
          z-index: 1;
        }

        .timeline-node:last-child .node-line {
          display: none;
        }

        .timeline-node.completed .node-line {
          background: rgba(0, 240, 255, 0.2);
        }

        .node-content {
          flex: 1;
          padding: 16px;
          transition: var(--transition-smooth);
        }

        .timeline-node.completed .node-content {
          opacity: 0.65;
          border-color: rgba(255, 255, 255, 0.03);
          background: rgba(15, 20, 36, 0.25);
        }

        .node-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .node-time-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          color: var(--accent-cyan);
          font-family: monospace;
          background: rgba(0, 240, 255, 0.05);
          border: 1px solid rgba(0, 240, 255, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .remove-node-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          opacity: 0;
          transition: var(--transition-fast);
        }

        .node-content:hover .remove-node-btn {
          opacity: 1;
        }

        .remove-node-btn:hover {
          color: var(--accent-rose);
        }

        .node-title {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .timeline-node.completed .node-title {
          text-decoration: line-through;
          color: var(--text-secondary);
        }

        .node-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .linked-badge-card {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-light);
          padding: 4px 8px;
          border-radius: 6px;
          color: var(--text-secondary);
          margin-top: 6px;
        }

        .linked-badge-card.hotel {
          border-color: rgba(255, 46, 147, 0.15);
          color: var(--text-primary);
        }

        .linked-badge-icon {
          color: var(--accent-cyan);
        }

        .linked-badge-icon.hotel {
          color: var(--accent-rose);
        }

        /* Success Alert message box */
        .success-message {
          background: rgba(0, 240, 255, 0.08);
          border: 1px solid rgba(0, 240, 255, 0.25);
          color: var(--accent-cyan);
          border-radius: 8px;
          padding: 12px;
          font-size: 0.88rem;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default TripPlanner;
