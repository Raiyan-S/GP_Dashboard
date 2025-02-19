import React, { useState } from 'react';
import { clearDatabase } from '../../../services/database';
import ConfirmationDialog from '../../common/ConfirmationDialog';

export default function DatabaseActions() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleClearData = async () => {
    setStatus('loading');
    setError(null);

    try {
      await clearDatabase();
      setStatus('success');
      setShowConfirmation(false);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to clear database');
    }
  };

  return (
    <div className="border-t pt-6 mt-6">
      <h3 className="text-lg font-medium mb-4">Database Management</h3>
      
      <button
        onClick={() => setShowConfirmation(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Clear Database
      </button>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleClearData}
        title="Clear Database"
        message="Are you sure you want to clear all data? This action cannot be undone."
        confirmLabel="Clear Data"
        isLoading={status === 'loading'}
      />

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}