import React, { useState, useEffect, useRef } from 'react';
// Recharts is a composable charting library built on React components
// It provides a set of components to create charts and graphs in React applications
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; 

import ClientSummary from './ClientSummary'; // Importing ClientSummary component to display the best round summary

// Metric options for the selector
// Each option has an id, label, dataKey, and color
const metricOptions = [
  { id: 'accuracy', label: 'Accuracy', dataKey: 'accuracy', color: '#60A5FA' },
  { id: 'avg_loss', label: 'Loss', dataKey: 'avg_loss', color: '#F87171' },
  { id: 'precision', label: 'Precision', dataKey: 'precision', color: '#9333EA' },
  { id: 'recall', label: 'Recall', dataKey: 'recall', color: '#4F46E5' },
  { id: 'f1', label: 'F1 Score', dataKey: 'f1', color: '#22C55E' },
];

// Function to render the metric selector dropdown
// This component allows the user to select multiple metrics to display on the chart
// No need to understand this function in detail, just know that it is used to select metrics for the chart
function MetricSelector({ selectedMetric, onMetricChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage the dropdown open/close
  const dropdownRef = useRef(null); // Ref to manage the dropdown element

  // Toggle selected metric in the list
  const toggleMetric = (metricId) => {
    const newSelectedMetrics = selectedMetric.includes(metricId)
      ? selectedMetric.filter((id) => id !== metricId)
      : [...selectedMetric, metricId];
    onMetricChange(newSelectedMetrics);
  };

  // Toggle the dropdown open/close
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close the dropdown if clicked outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  // Add event listener on mount and clean up on unmount
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  
  // The dropdown contains checkboxes for each metric option
  return (
    <div className="flex items-center space-x-2" ref={dropdownRef}>
      {/* Label */}
      <label htmlFor="metric-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Select:
      </label>

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="block w-40 rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm px-4 py-2"
      >
        Metrics
      </button>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <div className="absolute z-10 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
          <div className="max-h-60">
            {metricOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 px-4 py-2">
                <input
                  type="checkbox"
                  id={option.id}
                  checked={selectedMetric.includes(option.id)}
                  onChange={() => toggleMetric(option.id)}
                  className="form-checkbox text-blue-600 dark:text-blue-400"
                />
                <label
                  htmlFor={option.id}
                  className="ml-2 text-sm text-gray-900 dark:text-gray-100"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Used in ClientOverview.jsx
export default function PerformanceChart({ data }) {
  // State to store the selected metric (accuracy by default)
  const [selectedMetric, setSelectedMetric] = useState(['accuracy']);
  // Find the selected option based on the selected metric
  // const { dataKey, color, label } = metricOptions.find(option => option.id === selectedMetric);

  // Flatten the data to match Recharts format
  const validatedData = data?.map(({ round_id, metrics }) => ({
    round: round_id, // Use round_id as the X-axis key
    ...metrics, // Spread metrics into the object
  })) || [];

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
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          {/* Recharts Container for the Chart*/}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={validatedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="round" interval={10} />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Render multiple Line components based on selectedMetrics */}
              {selectedMetric.map((metricId) => {
                const { dataKey, color, label } = metricOptions.find(option => option.id === metricId);
                return (
                  <Line
                  key={metricId}
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  name={label}
                  dot={{ r: 2 }} // Set a very small dot radius
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Best Round Summary */}
        <div className="w-full lg:w-64">
          <ClientSummary data={data} />
        </div>
      </div>
    </div>
  );
}