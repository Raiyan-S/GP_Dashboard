import React, { useState, useEffect } from "react";
// import { fetchUniqueClientIds } from "../services/api"; // Uncomment when using real API

export const useClients = () => {
  const [clients, setClients] = useState([]);   // State to store the list of clients
  const [loading, setLoading] = useState(true);  // State to manage loading status
  const [error, setError] = useState(null);      // State to handle any errors

  useEffect(() => {
    const loadClients = async () => {
      try {
        // Uncomment the following line to fetch client IDs from the API
        // const clientIds = await fetchUniqueClientIds(); 

        // For testing purposes, we use a static array of clients
        const clientIds = ['client1', 'client2', 'client3'];

        // Map the client IDs to formatted client objects
        const formattedClients = clientIds.map((id) => ({
          id,
          name: id.replace("_", " ").replace("client", "Client ")
        }));

        setClients(formattedClients);  // Update state with formatted clients
        setLoading(false);             // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching unique client IDs:", error);
        setError("Failed to load client data.");  // Set an error message if something goes wrong
        setLoading(false);  // Ensure loading is false if an error occurs
      }
    };

    loadClients();  // Call the function to load the clients when the component mounts
  }, []);  // Empty dependency array to run once on component mount

  return { clients, loading, error };  // Return clients, loading, and error states
};
