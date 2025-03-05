import React, { useState, useEffect } from 'react';
import { clients, loadClients } from '../../data/clients';

export default function ClientSelector({ selectedClient, onClientChange }) {
  const [loadedClients, setLoadedClients] = useState([]);

  useEffect(() => {
    const load = async () => {
      await loadClients();  
      setLoadedClients(...clients); // Spread the clients array to trigger re-render
    };
    load();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
      <label htmlFor="client-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        Select Client:
      </label>
      <select
        id="client-select"
        value={selectedClient}
        onChange={(e) => onClientChange(e.target.value)}
        className="block w-full sm:w-64 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm">
        {loadedClients.map((client) => (
          <option key={client.id} value={hi}>
            {hi}
          </option>
        ))}
      </select>
    </div>
  );
}