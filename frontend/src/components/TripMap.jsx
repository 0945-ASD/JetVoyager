import React from 'react';
import { MapPin, PlaneTakeoff, Navigation, Map } from 'lucide-react';

const TripMap = ({ startPoint, endDestination, timeline }) => {
  // Extract coordinate markers from timeline
  const markers = [];
  
  timeline.forEach((event) => {
    if (event.activityRef && event.activityRef.location && event.activityRef.location.coordinates) {
      const { lat, lng } = event.activityRef.location.coordinates;
      // Prevent duplicates
      if (!markers.some(m => m.lat === lat && m.lng === lng)) {
        markers.push({
          name: event.activityRef.name,
          city: event.activityRef.location.city,
          country: event.activityRef.location.country,
          lat,
          lng,
          type: 'activity',
        });
      }
    }
  });

  // Calculate mock canvas points for plotting on our radar grid
  // Standard Mercator projection projection scaling for Paris, Rome, Kyoto
  const projectCoordinates = (lat, lng) => {
    // Standard bounding boxes or simple relative offsets for a clean relative display
    // Paris: ~48N, 2E
    // Rome: ~41N, 12E
    // Kyoto: ~35N, 135E
    
    // Let's create an elegant, responsive coordinate grid projection.
    // If no markers, default center.
    if (markers.length === 0) {
      return { x: 50, y: 50 };
    }

    // Find min and max bounds to dynamically scale coordinates to our canvas
    let minLat = Math.min(...markers.map(m => m.lat));
    let maxLat = Math.max(...markers.map(m => m.lat));
    let minLng = Math.min(...markers.map(m => m.lng));
    let maxLng = Math.max(...markers.map(m => m.lng));

    // Pad bounds slightly to avoid placing points on the very edge
    const latPadding = (maxLat - minLat) * 0.2 || 1;
    const lngPadding = (maxLng - minLng) * 0.2 || 1;
    minLat -= latPadding;
    maxLat += latPadding;
    minLng -= lngPadding;
    maxLng += lngPadding;

    // Project coordinates onto a 100% viewport width/height coordinate grid
    const x = ((lng - minLng) / (maxLng - minLng)) * 80 + 10;
    // Y is inverted since top is 0 in screen space
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 80 + 10;

    return { x, y };
  };

  return (
    <div className="trip-map-container glass-panel">
      <div className="map-header">
        <div className="map-title-row">
          <Map size={18} className="map-header-icon" />
          <h4>Tactical Flight Deck Radar</h4>
        </div>
        <span className="coordinate-pulse animate-pulse-glow">Active Avionics Track</span>
      </div>

      <div className="radar-screen">
        <div className="radar-grid-lines">
          <div className="grid-circle c1"></div>
          <div className="grid-circle c2"></div>
          <div className="grid-circle c3"></div>
          <div className="radar-line-h"></div>
          <div className="radar-line-v"></div>
          <div className="sweeper"></div>
        </div>

        {markers.length === 0 ? (
          <div className="no-coordinates-overlay">
            <PlaneTakeoff size={32} className="no-coords-icon" />
            <h5>Standby for Coordinates</h5>
            <p>Schedule experience activities in the timeline to plot live locations on the radar.</p>
          </div>
        ) : (
          <svg className="radar-paths-svg" viewBox="0 0 100 100">
            {/* Draw connecting flight paths */}
            {markers.map((marker, idx) => {
              if (idx === 0) return null;
              const prev = projectCoordinates(markers[idx - 1].lat, markers[idx - 1].lng);
              const curr = projectCoordinates(marker.lat, marker.lng);
              return (
                <g key={`path-${idx}`}>
                  {/* Glowing background line */}
                  <line 
                    x1={prev.x} y1={prev.y} x2={curr.x} y2={curr.y} 
                    className="path-glow-line"
                  />
                  {/* Dashed primary line */}
                  <line 
                    x1={prev.x} y1={prev.y} x2={curr.x} y2={curr.y} 
                    className="path-dashed-line"
                  />
                </g>
              );
            })}

            {/* Render coordinates markers */}
            {markers.map((marker, idx) => {
              const pt = projectCoordinates(marker.lat, marker.lng);
              return (
                <g key={`marker-${idx}`} className="radar-marker-group">
                  {/* Marker pulse rings */}
                  <circle cx={pt.x} cy={pt.y} r="2.5" className="marker-pulse-ring" />
                  <circle cx={pt.x} cy={pt.y} r="1" className="marker-core" />
                </g>
              );
            })}
          </svg>
        )}

        {/* Floating coordinate info boxes */}
        {markers.map((marker, idx) => {
          const pt = projectCoordinates(marker.lat, marker.lng);
          return (
            <div 
              key={`tooltip-${idx}`} 
              className="radar-tooltip"
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
            >
              <div className="tooltip-content glass-panel">
                <MapPin size={12} className="tooltip-icon" />
                <div className="tooltip-text-group">
                  <span className="tooltip-title">{marker.name}</span>
                  <span className="tooltip-coords">{marker.city}, {marker.country} ({marker.lat.toFixed(4)}N, {marker.lng.toFixed(4)}E)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flight-log-panel">
        <h5>Avionics Log</h5>
        <div className="log-rows-container">
          <div className="log-row">
            <span className="log-time">DEPART</span>
            <span className="log-desc">{startPoint}</span>
          </div>
          {markers.map((marker, idx) => (
            <div key={`log-${idx}`} className="log-row">
              <span className="log-time">WAYPOINT {idx + 1}</span>
              <span className="log-desc">{marker.name} - {marker.city}</span>
            </div>
          ))}
          <div className="log-row">
            <span className="log-time">ARRIVE</span>
            <span className="log-desc">{endDestination}</span>
          </div>
        </div>
      </div>

      <style>{`
        .trip-map-container {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .map-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 12px;
        }

        .map-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .map-header-icon {
          color: var(--accent-cyan);
        }

        .map-header h4 {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-primary);
        }

        .coordinate-pulse {
          font-size: 0.75rem;
          color: var(--accent-cyan);
          background: rgba(0, 240, 255, 0.08);
          border: 1px solid var(--accent-cyan);
          padding: 3px 8px;
          border-radius: 99px;
        }

        .radar-screen {
          position: relative;
          background: rgba(7, 10, 19, 0.9);
          border: 1px solid rgba(0, 240, 255, 0.1);
          border-radius: 12px;
          height: 380px;
          overflow: hidden;
        }

        .radar-grid-lines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .grid-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 1px dashed rgba(0, 240, 255, 0.05);
          border-radius: 50%;
        }

        .c1 { width: 150px; height: 150px; }
        .c2 { width: 300px; height: 300px; }
        .c3 { width: 450px; height: 450px; }

        .radar-line-h {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 1px;
          background: rgba(0, 240, 255, 0.04);
        }

        .radar-line-v {
          position: absolute;
          left: 50%;
          top: 0;
          width: 1px;
          height: 100%;
          background: rgba(0, 240, 255, 0.04);
        }

        .sweeper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: conic-gradient(from 0deg at 50% 50%, rgba(0, 240, 255, 0.08) 0deg, transparent 90deg);
          animation: sweep 8s linear infinite;
          transform-origin: center;
        }

        @keyframes sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .no-coordinates-overlay {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
          position: relative;
          z-index: 2;
        }

        .no-coords-icon {
          color: var(--text-muted);
          margin-bottom: 12px;
          opacity: 0.6;
        }

        .no-coordinates-overlay h5 {
          font-size: 1rem;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .no-coordinates-overlay p {
          font-size: 0.82rem;
          max-width: 320px;
          line-height: 1.5;
        }

        .radar-paths-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        .path-glow-line {
          stroke: var(--accent-cyan);
          stroke-width: 0.6;
          opacity: 0.25;
          filter: blur(1px);
        }

        .path-dashed-line {
          stroke: var(--accent-cyan);
          stroke-width: 0.3;
          stroke-dasharray: 0.8, 0.8;
          opacity: 0.85;
        }

        .marker-pulse-ring {
          fill: none;
          stroke: var(--accent-cyan);
          stroke-width: 0.2;
          animation: ringPulse 2s infinite ease-out;
          transform-origin: center;
        }

        @keyframes ringPulse {
          0% { r: 1.5; opacity: 1; }
          100% { r: 5; opacity: 0; }
        }

        .marker-core {
          fill: var(--accent-cyan);
          filter: drop-shadow(0 0 3px var(--accent-cyan));
        }

        .radar-tooltip {
          position: absolute;
          z-index: 10;
          transform: translate(-50%, -100%) translateY(-10px);
          cursor: default;
        }

        .tooltip-content {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(7, 10, 19, 0.85);
          border: 1px solid rgba(0, 240, 255, 0.2);
          border-radius: 6px;
          white-space: nowrap;
        }

        .tooltip-icon {
          color: var(--accent-cyan);
          margin-top: 2px;
        }

        .tooltip-text-group {
          display: flex;
          flex-direction: column;
        }

        .tooltip-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .tooltip-coords {
          font-size: 0.65rem;
          color: var(--text-secondary);
        }

        .flight-log-panel {
          border-top: 1px solid var(--border-light);
          padding-top: 16px;
        }

        .flight-log-panel h5 {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }

        .log-rows-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 120px;
          overflow-y: auto;
          padding-right: 6px;
        }

        .log-row {
          display: flex;
          align-items: center;
          gap: 15px;
          font-size: 0.78rem;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border-light);
          padding: 6px 12px;
          border-radius: 6px;
        }

        .log-time {
          font-weight: 700;
          color: var(--accent-cyan);
          font-family: monospace;
          flex-shrink: 0;
        }

        .log-desc {
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
};

export default TripMap;
