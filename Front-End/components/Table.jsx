import React from "react";

export default function ResponsiveTable({ data }) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 transition-colors">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg transition-colors">
        {/* Desktop View */}
        <div className="hidden sm:block">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {["Round", "Accuracy", "F1 Score", "Loss", "Precision", "Recall", "Time"].map((header) => (
                      <th key={header} scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {data.map((row, index) => {
                    // Ensure row is defined and has a round property
                    const round = row.round_id || "N/A"; // "N/A" if round_id is undefined
                    const metrics = row.metrics // Using optional chaining (?.) to handle undefined metrics and return as null/undefined and nullish coalescing (??) to handle undefined values
                    const timestamp = row.created_at || "N/A" // "N/A" if created_at is undefined
                    return (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                          {round}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                            {(metrics.accuracy?.toFixed(3) ?? 'N/A') + '%'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                            {(metrics.f1_score?.toFixed(3) ?? 'N/A') + '%'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">
                            {metrics.loss?.toFixed(3) ?? 'N/A'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">
                            {metrics.precision?.toFixed(3) ?? 'N/A'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">
                            {metrics.recall?.toFixed(3) ?? 'N/A'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {timestamp}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="block sm:hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, index) => {
              // Ensure row is defined and has a round property
              const round = row.round_id || "N/A"; // "N/A" if round_id is undefined
              const metrics = row.metrics // Using optional chaining (?.) to handle undefined metrics and return as null/undefined and nullish coalescing (??) to handle undefined values
              const timestamp = row.created_at || "N/A" // "N/A" if created_at is undefined
              return (
                <div key={index} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-900 dark:text-white">Round {round}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{timestamp}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Accuracy</span>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                          {(metrics.accuracy?.toFixed(3) ?? 'N/A') + '%'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">F1 Score</span>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                          {(metrics.f1_score?.toFixed(3) ?? 'N/A') + '%'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Loss</span>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">
                          {metrics.loss?.toFixed(3) ?? 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Precision</span>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">
                          {metrics.precision?.toFixed(3) ?? 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Recall</span>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">
                          {metrics.recall?.toFixed(3) ?? 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
  )
}