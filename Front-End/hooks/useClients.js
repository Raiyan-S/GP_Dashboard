import React, { useState, useEffect } from "react";
import { fetchUniqueClientIds } from "../services/api";

export const useClients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        // const clientIds = await fetchUniqueClientIds();
        const clientIds = ['client1', 'client2', 'client3'];
        const formattedClients = clientIds.map((id) => ({
          id: id,
          name: id.replace("_", " ").replace("client", "Client ")
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