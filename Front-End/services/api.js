const API_URL =  process.env.NODE_ENV === "production"
? "https://gpdashboard-production.up.railway.app"
: "http://localhost:8000";

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

// Fetch Health Status from the API
export const fetchHealthStatus = async () => {
  const response = await fetch(`${API_URL}/health`);
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    throw new Error('Failed to fetch health status');
  }

  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    const text = await response.text();
    console.error("Unexpected response format:", text);
    throw new Error('Unexpected response format');
  }
};

export const fetchUniqueClientIds = async () => {
  const response = await fetch(`${API_URL}/clients`);
  if (!response.ok) {
    throw new Error('Failed to fetch unique client IDs');
  }
  return response.json();
};