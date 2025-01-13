import React from 'react';
import { Client } from '../../types';
import { clients } from '../../data/clients';

interface ClientSelectorProps {
  selectedClient: string;
  onClientChange: (clientId: string) => void;
}

export default function ClientSelector({ selectedClient, onClientChange }: ClientSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="client-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Client:
      </label>
      <select
        id="client-select"
        value={selectedClient}
        onChange={(e) => onClientChange(e.target.value)}
        className="block w-64 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm"
      >
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name} {client.institution && `- ${client.institution}`}
          </option>
        ))}
      </select>
    </div>
  );
}