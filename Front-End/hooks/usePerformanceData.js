import { useState, useEffect, useCallback } from 'react';
import { fetchTrainingMetrics } from '../services/api';

// Used in ClientsPage.jsx & ClientOverview.jsx
export function usePerformanceData(selectedClient = '', showAll = false) {
  const [data, setData] = useState([]); // Store performance data
  const [chartData, setChartData] = useState([]); // Store chart data

  // Call FetchData when selectedClient changes
  // This effect runs whenever selectedClient changes
  useEffect(() => { 
    if (selectedClient) {
      console.log(`DEBUG: Calling fetchData with "${selectedClient}"`);
      fetchData(selectedClient);
    }
  }, [selectedClient]);

  // Set the data and chart data when selectedClient changes
  // This function fetches the training metrics data for the selected client
  const fetchData = async (clientId) => {
    console.log(`DEBUG: Fetching data for clientId: ${clientId}`);
    try {
        const rounds = await fetchTrainingMetrics(clientId, "desc");
        console.log("DEBUG: Raw fetched data:", rounds); 
        setData(rounds); // Set the data

        const chartRounds = await fetchTrainingMetrics(clientId, "asc");
        console.log("DEBUG: Raw fetched chart data:", chartRounds); 
        setChartData(chartRounds); // Set the chart data
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  // Return the sliced fetched data based on the showAll flag
  // If showAll is true, return all data; otherwise, return the last 10 rounds
  // showAll is true when on the ClientsPage.jsx
  const getData = useCallback(() => { // useCallback to avoid unnecessary re-renders 
    return showAll ? data : data.slice(0, 10);  // Show all rounds or the last 10 rounds
  }, [showAll, data]);

  return { 
    data: getData(), // Data to be used in the component
    chartData, // Chart data for the chart component
  };
}