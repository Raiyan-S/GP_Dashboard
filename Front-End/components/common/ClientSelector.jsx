import React from 'react';
import { useClients } from '../../hooks/useClients'; // Custom hook to fetch clients from the backend API

// Used in ClientOverview.jsx & ClientsPage.jsx
// Component select a client from a dropdown list
export default function ClientSelector({ selectedClient, onClientChange }) {
  const clients = useClients(); // Fetch clients

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
      <label htmlFor="client-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        {/* Previously was Select Client: */}
        Select Hospital:
      </label>
      <select
        id="client-select"
        value={selectedClient}
        onChange={(e) => onClientChange(e.target.value)}
        className="block w-full sm:w-64 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm">
        {/* Lists all unique clients and global from database */}
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
    </div>
  );
}