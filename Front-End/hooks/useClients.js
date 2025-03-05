// export const clients = [
//   { id: 'client1', name: 'Client 1', institution: '' },
//   { id: 'client2', name: 'Client 2', institution: '' },
//   { id: 'client3', name: 'Client 3', institution: '' },
//   { id: 'client4', name: 'Client 4', institution: '' },
// ];

import { useState, useEffect } from "react";
import { fetchUniqueClientIds } from "../services/api";

export const useClients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientIds = await fetchUniqueClientIds();
        const formattedClients = clientIds.map((id, index) => ({
          id,
          name: `Client ${index + 1}`,
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