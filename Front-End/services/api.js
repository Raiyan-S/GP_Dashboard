const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// // Fetch Health Status from the API
// export const fetchHealthStatus = async () => {
//   const response = await fetch(`${API_URL}/health`);
//   if (!response.ok) {
//     throw new Error('Failed to fetch health status');
//   }
//   return response.json();
// };

// Fetch Unique Client IDs from the API
export const fetchUniqueClientIds = async () => {
  const response = await fetch(`${API_URL}/clients`);
  if (!response.ok) {
    throw new Error('Failed to fetch unique client IDs');
  }
  return response.json();
};

// Fetch Training Metrics for a specific round
export const fetchTrainingMetrics = async (clientId) => {
  const response = await fetch(`${API_URL}/rounds/${clientId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch client rounds');
  }
  return response.json();
};

// Probably will remove (used it for debugging)
export const fetchLatestRounds = async () => {
  const response = await fetch(`${API_URL}/latest-rounds`);
  if (!response.ok) {
    throw new Error("Failed to fetch latest rounds");
  }
  return response.json();
};

// Fetch all client's latest round then average the metrics for "Summary" section
export const fetchAveragedMetrics = async () => {
  const response = await fetch(`${API_URL}/latest-rounds/averaged`);
  if (!response.ok) {
    throw new Error("Failed to fetch averaged metrics");
  }
  return response.json();
};

export const login = async (username, password) => {
  console.log('DEBUG: Logging in with:', username , password);
  // Data in application/x-www-form-urlencoded format
  const params = new URLSearchParams({
    username: username, 
    password: password   
  });

  const response = await fetch(`${API_URL}/auth/cookies/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'include',
    body: params.toString(),
  });
  if (!response.ok) {
    const errorData = await response.json(); 
    console.error('Login failed:', errorData); 
    throw new Error('Failed to login');
  }
  return response.status === 204 ? null : await response.json(); // Return null if status is 204 (No Content)
};

export const register = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
};

export const verify_token = async () => {
  const response = await fetch(`${API_URL}/auth/verify-token`, {
    method: 'GET',
    credentials: "include", 
  });
  console.log('DEBUG: Verifying token:', response);
  return response;
};