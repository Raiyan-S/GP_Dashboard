import React, { useState } from 'react';
import { testDatabaseConnection } from '../../../services/database';
import { validateMongoUri } from '../../../utils/validation';
import ConnectionStatus from './ConnectionStatus';

export default function DatabaseConnection() {
  const [uri, setUri] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    const validationError = validateMongoUri(uri);
    if (validationError) {
      setError(validationError);
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      await testDatabaseConnection(uri);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to connect to database');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="db-uri" className="block text-sm font-medium text-gray-700">
          MongoDB Connection URI
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="db-uri"
            value={uri}
            onChange={(e) => setUri(e.target.value)}
            placeholder="mongodb://username:password@host:port/database"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleConnect}
          disabled={status === 'loading'}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {status === 'loading' ? 'Connecting...' : 'Test Connection'}
        </button>

        <ConnectionStatus status={status} error={error} />
      </div>
    </div>
  );
}