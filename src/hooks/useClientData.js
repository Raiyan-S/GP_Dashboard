// chatgpt generated (Need to rewrite for MongoDB integration)
import { useState, useMemo } from 'react';
import { clients } from '../data/clients';

const ITEMS_PER_PAGE = 10;

const generateData = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    round: i + 1,
    accuracy: 85 + Math.random() * 10,
    f1Score: 82 + Math.random() * 10,
    loss: 0.32 - (Math.random() * 0.2),
    precision: 0.84 + Math.random() * 0.1,
    recall: 0.81 + Math.random() * 0.1
  }));
};

export function useClientData() {
  const [selectedClient, setSelectedClient] = useState(clients[0].id);
  const [currentPage, setCurrentPage] = useState(1);
  const data = useMemo(() => generateData(), []);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const pagination = {
    currentPage,
    totalPages,
    onPageChange: (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    }
  };

  return {
    selectedClient,
    setSelectedClient,
    paginatedData,
    pagination
  };
}