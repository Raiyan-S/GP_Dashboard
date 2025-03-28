const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
// import.meta.env.VITE_API_URL || 
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
  const response = await fetch(`${API_URL}/client`);
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

// Fetch Best F1 Global Metrics
export const fetchBestF1Global = async () => {
  const response = await fetch(`${API_URL}/best-f1-global`);
  if (!response.ok) {
    throw new Error("Failed to fetch best F1 global metrics");
  }
  return response.json();
};

export const login = async (username, password) => {
  console.log('DEBUG: Logging in with:', username, password);
  
  const params = new URLSearchParams({
    username: username, 
    password: password   
  });

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'include', // Ensures cookies are sent with the request
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json(); 
    console.error('Login failed:', errorData); 
    throw new Error(errorData.detail || 'Failed to login');
  }

  return response;
};

export const logout = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to logout');
  }

  return response;
};

export const register = async (username, password) => {
  console.log('DEBUG: Registering with:', username, password);
  
  const params = new URLSearchParams({
    username: username,
    password: password,
  });

  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'include',  // Ensures cookies are sent with the request if needed
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Registration failed:', errorData);
    throw new Error(errorData.detail || 'Failed to register');
  }

  return response;
};

export const verify_token = async () => {
  const response = await fetch(`${API_URL}/auth/verify-token`, {
    method: 'GET',
    credentials: "include", 
  });
  console.log('DEBUG: Verifying token:', response);
  return response;
};

export const predict = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/modeltrial/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Prediction failed:", errorData);
    throw new Error(errorData.detail || "Failed to fetch prediction");
  }

  return response.json();
};