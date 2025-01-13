import { PerformanceData } from '../types';

const API_URL = 'http://localhost:5000/api';

export const fetchPerformanceData = async (clientId?: string): Promise<PerformanceData[]> => {
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

export const fetchRoundData = async (roundId: string) => {
  const response = await fetch(`${API_URL}/performance/round/${roundId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch round data');
  }
  return response.json();
};