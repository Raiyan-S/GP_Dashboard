// export const clients = [
//   { id: 'client1', name: 'Client 1', institution: '' },
//   { id: 'client2', name: 'Client 2', institution: '' },
//   { id: 'client3', name: 'Client 3', institution: '' },
//   { id: 'client4', name: 'Client 4', institution: '' },
// ];

import { fetchUniqueClientIds } from '../services/api';

export const clients = [];

export const loadClients = async () => {
  try {
    const clientIds = await fetchUniqueClientIds();
    clientIds.forEach((id, index) => {
      clients.push({ id, name: `Client ${index + 1}`});
    });
    console.log('Unique client IDs loaded:', clients);
  } catch (error) {
    console.error('Error fetching unique client IDs:', error);
  }
};

// Call loadClients to populate the clients array
loadClients();