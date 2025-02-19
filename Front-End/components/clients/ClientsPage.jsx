import React, { useState } from 'react';
import ClientsTable from './ClientsTable';
import ClientSelector from '../common/ClientSelector';
import { usePerformanceData } from '../../hooks/usePerformanceData';

const ITEMS_PER_PAGE = 10;

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error } = usePerformanceData(selectedClient, true);

  // Sort data by round in ascending order (starting from round 1)
  const sortedData = [...data].sort((a, b) => a.round - b.round);
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Client Training Logs</h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">(Dummy data not fetched from database)</span>
        </div>
        <ClientSelector selectedClient={selectedClient} onClientChange={setSelectedClient} />
      </div>
      
      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <ClientsTable 
          data={paginatedData}
          loading={loading}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: handlePageChange
          }}
        />
      )}
    </div>
  );
}