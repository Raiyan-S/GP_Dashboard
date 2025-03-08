import { useState, useEffect, useCallback } from 'react';
import { useClients } from './useClients';
import { fetchTrainingMetrics } from '../services/api';

export function usePerformanceData(selectedClient = '', showAll = false) {
  const [data, setData] = useState([]); // Store performance data
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
      const rounds = await fetchTrainingMetrics(clientId);
      console.log("DEBUG: Raw fetched data:", rounds); 
      setData(rounds); // Set the fetched data
    } catch (err) {
      setError(`Failed to fetch client rounds: ${err.message}`);
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Return the fetched data, loading state, and error handling
  const getData = useCallback(() => {
    return showAll ? data : data.slice(-10);  // Show all rounds or the last 10 rounds
  }, [showAll, data]);

  return { 
    data: getData(),
    loading, 
    error,
    refetch: () => fetchData(selectedClient) // Allow manual refresh
  };
}






// // chatgpt generated (Need to rewrite for MongoDB integration)
// import { useState, useCallback } from 'react';
// import { useClients  } from './useClients';

// const clients = useClients();
// // TODO: MongoDB Integration
// // Replace this with MongoDB fetch
// // const fetchClientData = async (clientId) => {
// //   const response = await fetch(`/api/performance?client_id=${clientId}`);
// //   return response.json();
// // };

// // Generate client-specific data
// const generateClientData = (clientId) => {
//   // TODO: Replace with MongoDB fetch
//   // try {
//   //   const data = await fetchClientData(clientId);
//   //   return data;
//   // } catch (error) {
//   //   console.error('Error fetching client data:', error);
//   //   return [];
//   // }

//   const baseAccuracy = clientId === 'client1' ? 90 : 
//                       clientId === 'client2' ? 85 :
//                       clientId === 'client3' ? 88 : 82;
  
//   return Array.from({ length: 15 }, (_, i) => ({
//     round: i + 1,
//     accuracy: baseAccuracy + (Math.random() * 5 - 2.5),
//     f1Score: (baseAccuracy - 2) + (Math.random() * 5 - 2.5),
//     loss: 0.32 - (Math.random() * 0.2) - (baseAccuracy - 85) * 0.01,
//     precision: (baseAccuracy - 1) / 100 + (Math.random() * 0.05 - 0.025),
//     recall: (baseAccuracy - 1) / 100 + (Math.random() * 0.05 - 0.025)
//   }));
// };

// // Generate data for all clients
// const clientData = new Map(
//   clients.map(client => [client.id, generateClientData(client.id)])
// );

// // TODO: Replace with MongoDB aggregation
// // const fetchAverageLastRoundMetrics = async () => {
// //   const response = await fetch('/api/performance/stats/last-round');
// //   return response.json();
// // };

// const getAverageLastRoundMetrics = () => {
//   // TODO: Replace with MongoDB aggregation pipeline
//   // db.performance.aggregate([
//   //   { $sort: { round: -1 } },
//   //   { $group: {
//   //     _id: "$client_id",
//   //     lastRound: { $first: "$$ROOT" }
//   //   }},
//   //   { $group: {
//   //     _id: null,
//   //     accuracy: { $avg: "$lastRound.accuracy" },
//   //     f1Score: { $avg: "$lastRound.f1Score" },
//   //     loss: { $avg: "$lastRound.loss" },
//   //     precision: { $avg: "$lastRound.precision" },
//   //     recall: { $avg: "$lastRound.recall" }
//   //   }}
//   // ])

//   const lastRounds = Array.from(clientData.values()).map(data => data[data.length - 1]);
//   return {
//     accuracy: lastRounds.reduce((sum, d) => sum + d.accuracy, 0) / lastRounds.length,
//     f1Score: lastRounds.reduce((sum, d) => sum + d.f1Score, 0) / lastRounds.length,
//     loss: lastRounds.reduce((sum, d) => sum + d.loss, 0) / lastRounds.length,
//     precision: lastRounds.reduce((sum, d) => sum + d.precision, 0) / lastRounds.length,
//     recall: lastRounds.reduce((sum, d) => sum + d.recall, 0) / lastRounds.length
//   };
// };

// // TODO: Replace with MongoDB aggregation
// // const fetchCombinedData = async () => {
// //   const response = await fetch('/api/performance/combined');
// //   return response.json();
// // };

// const combinedData = Array.from({ length: 15 }, (_, i) => {
//   if (i === 14) {
//     return {
//       round: i + 1,
//       ...getAverageLastRoundMetrics()
//     };
//   }
  
//   const roundData = Array.from(clientData.values()).map(data => data[i]);
//   return {
//     round: i + 1,
//     accuracy: roundData.reduce((sum, d) => sum + d.accuracy, 0) / roundData.length,
//     f1Score: roundData.reduce((sum, d) => sum + d.f1Score, 0) / roundData.length,
//     loss: roundData.reduce((sum, d) => sum + d.loss, 0) / roundData.length,
//     precision: roundData.reduce((sum, d) => sum + d.precision, 0) / roundData.length,
//     recall: roundData.reduce((sum, d) => sum + d.recall, 0) / roundData.length
//   };
// });

// export function usePerformanceData(selectedClient = 'all', showAll = false) {
//   const [loading] = useState(false);
//   const [error] = useState(null);

//   // TODO: Convert to async function and use try-catch
//   // const getData = useCallback(async () => {
//   //   try {
//   //     const rawData = selectedClient === 'all'
//   //       ? await fetchCombinedData()
//   //       : await fetchClientData(selectedClient);
//   //     return showAll ? rawData : rawData.slice(-10);
//   //   } catch (error) {
//   //     console.error('Error fetching data:', error);
//   //     return [];
//   //   }
//   // }, [selectedClient, showAll]);

//   const getData = useCallback(() => {
//     const rawData = selectedClient === 'all' 
//       ? combinedData 
//       : clientData.get(selectedClient) || [];
//     return showAll ? rawData : rawData.slice(-10);
//   }, [selectedClient, showAll]);

//   const getAllData = useCallback(() => {
//     return selectedClient === 'all' 
//       ? combinedData 
//       : clientData.get(selectedClient) || [];
//   }, [selectedClient]);

//   return { 
//     data: getData(),
//     allData: getAllData(),
//     loading, 
//     error,
//     refetch: () => {}
//   };
// }