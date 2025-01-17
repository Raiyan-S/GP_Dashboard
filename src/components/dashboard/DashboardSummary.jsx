import React from 'react';

export default function DashboardSummary() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4">Summary</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Total Training Rounds</p>
          <p className="text-xl font-semibold">15</p>
        </div>
        <div>
          <p className="text-gray-600">Active Participants</p>
          <p className="text-xl font-semibold">8/10</p>
        </div>
        <div>
          <p className="text-gray-600">Latest Round Duration</p>
          <p className="text-xl font-semibold">45 minutes</p>
        </div>
        <div>
          <p className="text-gray-600">Average F1-Score</p>
          <p className="text-xl font-semibold text-green-600">0.89</p>
        </div>
      </div>
    </div>
  );
}