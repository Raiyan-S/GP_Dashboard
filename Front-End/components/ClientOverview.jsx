import React, { useState, useEffect } from 'react';
import PerformanceChart from './dashboard/PerformanceChart';
import PerformanceTable from './dashboard/PerformanceTable';
import ClientSelector from './ClientSelector';
import { usePerformanceData } from '../hooks/usePerformanceData';
import { useClients } from '../hooks/useClients';

// Used in App.jsx
export default function ClientOverview({onSeeAll}) {
  const clients = useClients();
  const [selectedClient, setSelectedClient] = useState('');
  const { data } = usePerformanceData(selectedClient);

  // Set the first client as the default selected client
  useEffect(() => {
    if (clients.length > 0) {
      setSelectedClient(clients[0].id);
    }
  }, [clients]);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Client Performance Overview</h2>
        </div>
        <ClientSelector selectedClient={selectedClient} onClientChange={setSelectedClient} />
      </div>
      <div className="space-y-6">
        <PerformanceTable data={data} onSeeAll={onSeeAll} />
        <PerformanceChart data={data} />
      </div>
    </div>
  );
}