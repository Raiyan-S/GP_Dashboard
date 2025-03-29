import { useState, useEffect, useCallback } from 'react';
import { fetchTrainingMetrics } from '../services/api';

// Used in ClientsPage.jsx & ClientOverview.jsx & PerformanceTable.jsx
export function usePerformanceData(selectedClient = '', showAll = false) {
  const [data, setData] = useState([]); // Store performance data
  const [chartData, setChartData] = useState([]); // Store chart data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data when a client is selected
  useEffect(() => { 
    console.log(`DEBUG:  useEffect triggered with selectedClient: "${selectedClient}"`);
    if (selectedClient) {
      console.log(`DEBUG: Calling fetchData with "${selectedClient}"`);
      fetchData(selectedClient);
    }
  }, [selectedClient]);

  const fetchData = async (clientId) => {
    console.log(`DEBUG: Fetching data for clientId: ${clientId}`);
  
    setLoading(true);
    setError(null);
  
    try {
        const rounds = await fetchTrainingMetrics(clientId, "desc");
        console.log("DEBUG: Raw fetched data:", rounds); 
        setData(rounds); // Set the fetched data

        const chartRounds = await fetchTrainingMetrics(clientId, "asc");
        console.log("DEBUG: Raw fetched data:", chartRounds); 
        setChartData(chartRounds); // Set the chart data
    } catch (err) {
      setError(`Failed to fetch client rounds: ${err.message}`);
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Return the fetched data, loading state, and error handling
  const getData = useCallback(() => {
    return showAll ? data : data.slice(0, 10);  // Show all rounds or the first 10 rounds
  }, [showAll, data]);

  return { 
    data: getData(),
    chartData, 
    loading, 
    error,
    refetch: () => fetchData(selectedClient) // Allow manual refresh
  };
}