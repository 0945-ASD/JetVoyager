import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '30px 20px',
      borderTop: '1px solid var(--border-light)',
      background: 'rgba(7, 10, 19, 0.5)',
      color: 'var(--text-muted)',
      fontSize: '0.85rem',
      marginTop: '60px'
    }}>
      <p>&copy; {new Date().getFullYear()} JetVoyager Premium Private Charters & Hotel Booking. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
