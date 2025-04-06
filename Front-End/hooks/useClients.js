import { useState, useEffect } from "react";
import { fetchUniqueClientIds } from "../services/api";

// Used in ClientOverview.jsx & ClientsPage.jsx & ClientSelector.jsx
export const useClients = () => {
  const [clients, setClients] = useState([]);

  // Fetch unique client IDs from the backend API and format them
  // Sets the clients state with the formatted client IDs
  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientIds = await fetchUniqueClientIds();
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
  }, []); // This effect runs once when the component mounts

  return clients; // Return the clients state to be used in other components
};

// Used in ClientOverview.jsx & ClientsPage.jsx
export const useSelectedClient = (clients) => {
  const [selectedClient, setSelectedClient] = useState("");

  // Load selected client from sessionStorage or set the first client as default
  useEffect(() => {
    const storedClient = sessionStorage.getItem("selectedClient");
    if (storedClient) {
      setSelectedClient(storedClient);
    } else if (clients.length > 0) {
      setSelectedClient(clients[0].id);
    }
  }, [clients]);

  // Save to sessionStorage whenever selectedClient changes
  useEffect(() => {
    if (selectedClient) {
      sessionStorage.setItem("selectedClient", selectedClient);
    }
  }, [selectedClient]);

  return [selectedClient, setSelectedClient];
};