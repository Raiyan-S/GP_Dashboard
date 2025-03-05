import { useState, useEffect } from "react";
import { fetchUniqueClientIds } from "../services/api";

export const useClients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await fetch('https://gpdashboard-production.up.railway.app/clients');
        const data = await response.json();
        console.log("Fetched Clients:", data);  // Check what data is fetched
        setClients(data);  // Update state with fetched client IDs
      } catch (error) {
        console.error("Error fetching unique client IDs:", error);
      }
    };
    loadClients();
  }, []);

  return clients;
};