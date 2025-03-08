const API_URL = import.meta.env.VITE_API_URL;

// Fetch Health Status from the API
export const fetchHealthStatus = async () => {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) {
    throw new Error('Failed to fetch health status');
  }
  return response.json();
};

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



/*
export const fetchPerformanceData = async (clientId) => {
  const url = new URL(`${API_URL}/performance`);
  if (clientId) {
    url.searchParams.append('client_id', clientId);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch performance data');
  }
  return response.json();
};

export const fetchDashboardStats = async () => {
  const response = await fetch(`${API_URL}/performance/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return response.json();
};

export const fetchRoundData = async (roundId) => {
  const response = await fetch(`${API_URL}/performance/round/${roundId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch round data');
  }
  return response.json();
};

*/