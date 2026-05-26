import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#070a13',
        color: '#00f0ff',
        fontSize: '1.25rem',
        letterSpacing: '0.05em'
      }}>
        <div className="animate-pulse-glow" style={{ padding: '20px', borderRadius: '8px' }}>
          LOADING JETVOYAGER PORTAL...
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the path they tried to hit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, send back to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
