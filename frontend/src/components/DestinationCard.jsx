import React from 'react';
import { MapPin, Star } from 'lucide-react';

const DestinationCard = ({ destination, onClick }) => {
  // Calculate average rating
  const averageRating = destination.reviews && destination.reviews.length > 0
    ? (destination.reviews.reduce((sum, r) => sum + r.rating, 0) / destination.reviews.length).toFixed(1)
    : '4.8'; // Default high rating for style

  return (
    <div className="dest-card glass-panel" onClick={() => onClick(destination)}>
      <div className="dest-card-image">
        <img src={destination.images[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"} alt={destination.name} />
        <div className="dest-card-overlay"></div>
        <div className="dest-card-rating">
          <Star size={14} className="star-icon" />
          <span>{averageRating}</span>
        </div>
      </div>
      <div className="dest-card-info">
        <h3>{destination.name}</h3>
        <p className="dest-card-location">
          <MapPin size={14} className="pin-icon" /> {destination.location}
        </p>
        <p className="dest-card-desc">
          {destination.description.length > 90
            ? `${destination.description.substring(0, 90)}...`
            : destination.description}
        </p>
        <button className="dest-card-action">View Experience</button>
      </div>

      <style>{`
        .dest-card {
          cursor: pointer;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .dest-card-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .dest-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .dest-card:hover .dest-card-image img {
          transform: scale(1.1);
        }

        .dest-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(7, 10, 19, 0.85) 100%);
        }

        .dest-card-rating {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(7, 10, 19, 0.75);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border-light);
          padding: 4px 10px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--accent-gold);
        }

        .star-icon {
          fill: var(--accent-gold);
          stroke: var(--accent-gold);
        }

        .dest-card-info {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .dest-card-info h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 6px;
          color: var(--text-primary);
        }

        .dest-card-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          color: var(--accent-cyan);
          margin-bottom: 12px;
          font-weight: 500;
        }

        .pin-icon {
          stroke: var(--accent-cyan);
        }

        .dest-card-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 20px;
          flex: 1;
        }

        .dest-card-action {
          width: 100%;
          background: transparent;
          border: 1px solid var(--border-light);
          padding: 10px 0;
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .dest-card:hover .dest-card-action {
          background: var(--accent-cyan);
          color: var(--bg-primary);
          border-color: var(--accent-cyan);
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default DestinationCard;
