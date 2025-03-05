import { useState, useEffect } from "react";
import { fetchUniqueClientIds } from "../services/api";

export const useClients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        console.log("Fetching client IDs..."); // Debug log before fetching
        const clientIds = await fetchUniqueClientIds();
        console.log("Fetched client IDs:", clientIds); // Debug log
        const formattedClients = clientIds.map((id) => ({
          id: id, // Keep the id unchanged
          name: id.replace("_", " ").replace("client", "Client ") // Format the name
        }));

        setClients(formattedClients);
      } catch (error) {
        console.error("Error fetching unique client IDs:", error);
      }
    };
    loadClients();
  }, []);

  return clients;
};