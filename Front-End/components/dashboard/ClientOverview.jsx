import React from 'react';

// These components are used to display the performance chart and table for the selected client
import PerformanceChart from './PerformanceChart';
import PerformanceTable from './PerformanceTable';
import ClientSelector from '../common/ClientSelector';

import { usePerformanceData } from '../../hooks/usePerformanceData'; // Custom hook to fetch performance data
import { useClients, useSelectedClient } from '../../hooks/useClients'; // Custom hooks to manage clients and selected client

// Used in App.jsx
export default function ClientOverview({onSeeAll}) {
  const clients = useClients();
  const [selectedClient, setSelectedClient] = useSelectedClient(clients); // Manage selected client
  const { data, chartData } = usePerformanceData(selectedClient); // Fetch performance data based on the selected client

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Client Performance Overview</h2>
        </div>
        <ClientSelector selectedClient={selectedClient} onClientChange={setSelectedClient} /> {/* Dropdown to select client */}
      </div>
      <div className="space-y-6">
        <PerformanceTable data={data} onSeeAll={onSeeAll} /> {/* Table to display performance data */}
        <PerformanceChart data={chartData} /> {/* Chart to visualize performance data */}
      </div>
    </div>
  );
}