const API_URL = 'http://localhost:5000/api';

export async function testDatabaseConnection(uri: string): Promise<void> {
  const response = await fetch(`${API_URL}/database/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uri }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to connect to database');
  }
}

export async function clearDatabase(): Promise<void> {
  const response = await fetch(`${API_URL}/database/clear`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to clear database');
  }
}