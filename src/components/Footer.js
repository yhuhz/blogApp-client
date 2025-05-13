import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        textAlign: 'center',
        position: 'fixed',
        bottom: '0',
        width: '100%',
      }}
      className="bg-secondary"
    >
      <p className="text-light py-1 mb-0">
        © {new Date().getFullYear()} <strong>TroubleBubble</strong> | All Rights
        Reserved
      </p>
    </footer>
  );
};

export default Footer;
