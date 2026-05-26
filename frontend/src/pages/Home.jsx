import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DestinationCard from '../components/DestinationCard';
import { Search, MapPin, Calendar, Compass, Star, X, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDest, setSelectedDest] = useState(null);
  const [bookingDate, setBookingDate] = useState('');

  // Destination review form states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const navigate = useNavigate();

  const fetchDestinations = async () => {
    try {
      const res = await fetch('/api/destinations');
      const data = await res.json();
      if (data.success) {
        setDestinations(data.destinations);
        // If a destination is currently open in modal, update its state too
        if (selectedDest) {
          const updated = data.destinations.find(d => d._id === selectedDest._id);
          if (updated) setSelectedDest(updated);
        }
      }
    } catch (err) {
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleCardClick = (destination) => {
    setSelectedDest(destination);
    setReviewError('');
    setReviewSuccess('');
    setReviewText('');
    setReviewRating(5);
    // Default next week date
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setBookingDate(nextWeek.toISOString().split('T')[0]);
  };

  const handleBookRedirect = () => {
    if (selectedDest) {
      setSelectedDest(null);
      navigate(`/hotels?location=${encodeURIComponent(selectedDest.location)}&date=${bookingDate}`);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!user) {
      setReviewError('You must be logged in to submit a review.');
      return;
    }

    if (user.role !== 'traveler') {
      setReviewError('Only traveler accounts can submit reviews.');
      return;
    }

    if (!reviewText) {
      setReviewError('Please write your experience text.');
      return;
    }

    setReviewLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/destinations/${selectedDest._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: reviewRating, reviewText }),
      });

      const data = await res.json();
      if (data.success) {
        setReviewSuccess('Your review has been published!');
        setReviewText('');
        setReviewRating(5);
        fetchDestinations(); // Refresh database list
      } else {
        setReviewError(data.message || 'Failed to submit review.');
      }
    } catch (err) {
      setReviewError('Network connection error.');
    } finally {
      setReviewLoading(false);
    }
  };

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-page animate-fade-in">
      {/* Premium Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">Luxury Private Jet & Tour Accommodations</span>
          <h1 className="hero-title">Experience Travel Beyond First Class</h1>
          <p className="hero-subtitle">
            Charter a flight and reserve elite accommodations in Paris, Rome, Kyoto, and beyond. Personalized comfort, curated itineraries.
          </p>
          
          {/* Hero Integrated Search */}
          <div className="hero-search glass-panel animate-pulse-glow">
            <div className="search-field">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Where to next? (e.g. Paris, Italy...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn-primary">Explore Now</button>
          </div>
        </div>
      </section>

      {/* Destinations Listing Grid */}
      <section className="container">
        <h2 className="section-title">Popular Destinations</h2>
        <p className="section-subtitle">Curated elite travel experiences tailored just for you</p>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--accent-cyan)', padding: '50px 0' }}>
            <span>Retrieving elite experiences...</span>
          </div>
        ) : filteredDestinations.length > 0 ? (
          <div className="destinations-grid">
            {filteredDestinations.map((dest) => (
              <DestinationCard
                key={dest._id}
                destination={dest}
                onClick={handleCardClick}
              />
            ))}
          </div>
        ) : (
          <div className="no-results glass-panel">
            <Compass size={40} className="no-res-icon" />
            <p>No experiences match your query. Try searching for "Paris", "Japan", or "Rome".</p>
          </div>
        )}
      </section>

      {/* Destination Details and Booking Modal */}
      {selectedDest && (
        <div className="modal-overlay">
          <div className="modal-card glass-panel animate-fade-in" style={{ maxWidth: '700px', height: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setSelectedDest(null)}>
              <X size={20} />
            </button>
            <div className="modal-image-header">
              <img src={selectedDest.images[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"} alt={selectedDest.name} />
              <div className="modal-image-overlay"></div>
              <h2>{selectedDest.name}</h2>
            </div>

            <div className="modal-body-content">
              <div className="modal-location-rating">
                <span className="modal-loc"><MapPin size={16} /> {selectedDest.location}</span>
                <span className="modal-rate">
                  <Star size={16} style={{ fill: 'var(--accent-gold)', stroke: 'var(--accent-gold)' }} />
                  {selectedDest.reviews && selectedDest.reviews.length > 0
                    ? (selectedDest.reviews.reduce((sum, r) => sum + r.rating, 0) / selectedDest.reviews.length).toFixed(1)
                    : '4.8'
                  } ({selectedDest.reviews?.length || 0} reviews)
                </span>
              </div>

              <p className="modal-description">{selectedDest.description}</p>

              <hr style={{ border: '0', borderTop: '1px solid var(--border-light)', margin: '20px 0' }} />

              {/* Selection flow before booking accommodation */}
              <div className="modal-action-form">
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="travel-date">Select Desired Travel Date</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
                    <input
                      type="date"
                      id="travel-date"
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                    />
                  </div>
                </div>

                <button onClick={handleBookRedirect} className="btn-primary">
                  Look for Accommodation
                </button>
              </div>

              <hr style={{ border: '0', borderTop: '1px solid var(--border-light)', margin: '25px 0' }} />

              {/* REVIEWS SECTION */}
              <div className="reviews-tab-section">
                <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.25rem', marginBottom: '15px', color: 'var(--accent-gold)' }}>Traveler Experiences</h3>

                {/* Review Lists */}
                <div className="reviews-panel-list">
                  {selectedDest.reviews && selectedDest.reviews.length > 0 ? (
                    selectedDest.reviews.map((rev, index) => (
                      <div key={index} className="review-chat-bubble glass-panel">
                        <div className="bubble-head">
                          <strong>{rev.userName}</strong>
                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} style={{ fill: i < rev.rating ? 'var(--accent-gold)' : 'transparent', stroke: 'var(--accent-gold)' }} />
                            ))}
                          </div>
                        </div>
                        <p>"{rev.reviewText}"</p>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No reviews have been written for this destination yet.</p>
                  )}
                </div>

                {/* Submit review form */}
                {user && user.role === 'traveler' ? (
                  <div className="submit-review-widget glass-panel" style={{ marginTop: '25px', padding: '20px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '10px' }}>Share Your Experience</h4>
                    
                    {reviewError && <p style={{ color: 'var(--accent-rose)', fontSize: '0.8rem', marginBottom: '10px' }}>{reviewError}</p>}
                    {reviewSuccess && <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', marginBottom: '10px' }}>{reviewSuccess}</p>}

                    <form onSubmit={handleReviewSubmit}>
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label>Your Rating</label>
                        <div className="stars-selectors" style={{ display: 'flex', gap: '8px', cursor: 'pointer', marginTop: '5px' }}>
                          {[1, 2, 3, 4, 5].map((starVal) => (
                            <Star
                              key={starVal}
                              size={20}
                              style={{
                                fill: starVal <= reviewRating ? 'var(--accent-gold)' : 'transparent',
                                stroke: 'var(--accent-gold)',
                              }}
                              onClick={() => setReviewRating(starVal)}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label>Review Description</label>
                        <textarea
                          rows="3"
                          className="form-textarea"
                          placeholder="Outline your thoughts and recommendation..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          required
                        />
                      </div>

                      <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }} disabled={reviewLoading || reviewSuccess}>
                        <Send size={14} /> Submit Experience
                      </button>
                    </form>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '20px', textAlign: 'center' }}>
                    *You must be registered as a traveler to submit destination reviews.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hero-section {
          background: linear-gradient(rgba(7, 10, 19, 0.4), rgba(7, 10, 19, 0.95)),
                      url('https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=1600&q=80');
          background-size: cover;
          background-position: center;
          height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
        }

        .hero-content {
          max-width: 800px;
        }

        .hero-tag {
          font-size: 0.85rem;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 700;
          margin-bottom: 20px;
          display: inline-block;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 20px;
          line-height: 1.15;
          letter-spacing: -0.01em;
          background: linear-gradient(to right, #ffffff 40%, var(--text-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.15rem;
          color: var(--text-secondary);
          margin-bottom: 40px;
          font-weight: 300;
        }

        .hero-search {
          display: flex;
          align-items: center;
          background: rgba(15, 20, 36, 0.7);
          border: 1px solid var(--border-light);
          padding: 8px 8px 8px 20px;
          border-radius: 99px;
          max-width: 600px;
          margin: 0 auto;
          gap: 15px;
        }

        .search-field {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .search-icon {
          color: var(--text-muted);
        }

        .hero-search input {
          width: 100%;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.95rem;
        }

        .hero-search input:focus {
          outline: none;
        }

        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
        }

        .no-results {
          padding: 60px 40px;
          text-align: center;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          max-width: 500px;
          margin: 0 auto;
        }

        .no-res-icon {
          stroke: var(--text-muted);
        }

        /* Modal Custom Addons */
        .modal-image-header {
          position: relative;
          height: 250px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
          flex-shrink: 0;
        }

        .modal-image-header img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 30%, rgba(7, 10, 19, 0.9) 100%);
        }

        .modal-image-header h2 {
          position: absolute;
          bottom: 20px;
          left: 20px;
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
        }

        .modal-location-rating {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .modal-loc {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--accent-cyan);
          font-weight: 500;
          font-size: 0.95rem;
        }

        .modal-rate {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .modal-description {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .modal-action-form {
          display: flex;
          gap: 20px;
          align-items: flex-end;
        }

        .modal-action-form .form-group {
          flex: 1;
          margin-bottom: 0;
        }

        /* Review bubbles */
        .reviews-panel-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .review-chat-bubble {
          padding: 15px 20px;
          border-radius: 12px;
        }

        .review-chat-bubble .bubble-head {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          margin-bottom: 6px;
        }

        .review-chat-bubble p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-style: italic;
        }

        @media (max-width: 600px) {
          .hero-title {
            font-size: 2.2rem;
          }
          .hero-search {
            flex-direction: column;
            border-radius: 16px;
            padding: 15px;
          }
          .hero-search button {
            width: 100%;
            justify-content: center;
          }
          .modal-action-form {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
