import React, { useEffect, useState } from 'react';
import './ErrorConnect.css';

const ErrorConnect = () => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      window.location.reload();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="error-connect-container">
      <div className="error-content">
        <div className="cloud-animation">
          <i className="fas fa-cloud-slash"></i>
        </div>
        <h1>Oops! Sei Offline</h1>
        <p className="pulse-text">
          Sembra che la tua connessione internet sia assente.
        </p>
        <div className="reconnect-message">
          <p>Per continuare ad utilizzare Weather App,</p>
          <p>controlla la tua connessione e riprova.</p>
        </div>
        <div className="status-indicator">
          <span className={`dot ${isOnline ? 'online' : 'offline'}`}></span>
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorConnect;
