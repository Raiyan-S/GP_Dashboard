import React from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ConnectionStatusProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

export default function ConnectionStatus({ status, error }: ConnectionStatusProps) {
  if (status === 'idle') return null;

  return (
    <div className="flex items-center space-x-2">
      {status === 'loading' && (
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      )}
      {status === 'success' && (
        <CheckCircle className="w-5 h-5 text-green-600" />
      )}
      {status === 'error' && (
        <XCircle className="w-5 h-5 text-red-600" />
      )}
      
      <span className={`text-sm ${
        status === 'success' ? 'text-green-600' :
        status === 'error' ? 'text-red-600' :
        'text-gray-600'
      }`}>
        {status === 'loading' && 'Testing connection...'}
        {status === 'success' && 'Connected successfully'}
        {status === 'error' && error}
      </span>
    </div>
  );
}