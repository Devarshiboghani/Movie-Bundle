import React from 'react';

const LoadingSpinner = ({ message = 'Loading details...' }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5 min-vh-50">
      <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-white-50 fs-5">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
