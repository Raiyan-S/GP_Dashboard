import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ClientSelector from '../common/ClientSelector';
import { usePerformanceData } from '../../hooks/usePerformanceData';
import { useClients } from '../../hooks/useClients';
import ResponsiveTable from '../common/Table';

const ITEMS_PER_PAGE = 10;

// Used in App.jsx
export default function ClientsPage() {
  const clients = useClients();
  const [selectedClient, setSelectedClient] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = usePerformanceData(selectedClient, true);

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

  // Calculate pagination
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE); // If we have 11 items, we need 2 pages (10 items per page)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE; // If currentPage is 2, we start at index 10 (0 to 9 is page 1)
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);  // If startIndex is 10, we slice from 10 to 19 (10 items)

  const onPageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Client Training Logs</h1>
        </div>
        <ClientSelector selectedClient={selectedClient} onClientChange={setSelectedClient} />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 transition-colors">
        <ResponsiveTable data={paginatedData} />

        {/* Pagination */}
        <div className="px-4 py-3 border-t dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2 ml-auto">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}