import React, { useState } from 'react';
import PerformanceChart from './dashboard/PerformanceChart';
import PerformanceTable from './dashboard/PerformanceTable';
import ClientSelector from './common/ClientSelector';
import { usePerformanceData } from '../hooks/usePerformanceData';

interface ClientOverviewProps {
  onSeeAll?: () => void;
}

export default function ClientOverview({ onSeeAll }: ClientOverviewProps) {
  const [selectedClient, setSelectedClient] = useState('all');
  const { data } = usePerformanceData(selectedClient);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Client Performance Overview</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">(Dummy data not fetched from database)</span>
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