import React, { useState } from 'react';
// Components to create the chart from recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ClientSummary from './ClientSummary';

// Metric options for the selector
// Each option has an id, label, dataKey, and color
// (Change colors later)
const metricOptions = [
  { id: 'accuracy', label: 'Accuracy', dataKey: 'accuracy', color: '#60A5FA' },
  { id: 'loss', label: 'Loss', dataKey: 'loss', color: '#F87171' },
  { id: 'precision', label: 'Precision', dataKey: 'precision', color: '#34D399' },
  { id: 'recall', label: 'Recall', dataKey: 'recall', color: '#FBBF24' },
  { id: 'f1Score', label: 'F1 Score', dataKey: 'f1Score', color: '#818CF8' },
];

// MetricSelector component
function MetricSelector({ selectedMetric, onMetricChange }) {
  return (
    <div className="flex items-center space-x-2">
      {/* Label */}
      <label htmlFor="metric-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Metric:
      </label>

      {/* Select */}
      <select
        id="metric-select"
        value={selectedMetric}
        onChange={(e) => onMetricChange(e.target.value)}
        className="block w-40 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm"
      >
        {metricOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// PerformanceChart component
// Used in ClientOverview.jsx
export default function PerformanceChart({ data }) {
  // State to store the selected metric (accuracy by default)
  const [selectedMetric, setSelectedMetric] = useState('accuracy');
  // Find the selected option based on the selected metric
  const { dataKey, color, label } = metricOptions.find(option => option.id === selectedMetric);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 transition-colors">
      {/* Metric Selector */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
        <MetricSelector
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
        />
      </div>
      {/* Chart Section (Check Recharts Document)*/}
      {/* Note: Add checkmark for metric selection to add multiple lines in a single chart */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          {/* Recharts Container for the Chart*/}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="round"
              />
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                name={label}
                dot={{ fill: color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Latest Round Summary */}
        <div className="w-full lg:w-64">
          <ClientSummary data={data} />
        </div>
      </div>
    </div>
  );
}