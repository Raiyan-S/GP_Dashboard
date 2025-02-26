import React, { useState, useEffect } from 'react';
import { fetchHealthStatus } from '../services/api';

const HealthCheck = () => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const result = await fetchHealthStatus();
        setStatus(result.status);
      } catch (err) {
        setError(err.message);
      }
    };

    checkHealth();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Health Check</h1>
      {status ? <p>Status: {status}</p> : <p>Loading...</p>}
    </div>
  );
};

export default HealthCheck;