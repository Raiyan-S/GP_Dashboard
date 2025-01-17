import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MetricSelector from './MetricSelector';
import ClientSummary from './ClientSummary';
import { metricOptions } from './MetricSelector';

export default function PerformanceChart({ data }) {
  const [selectedMetric, setSelectedMetric] = React.useState('accuracy');
  const selectedOption = metricOptions.find(option => option.id === selectedMetric);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
        <MetricSelector
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
        />
      </div>
      <div className="flex gap-6">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="round" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.375rem',
                  color: '#F3F4F6'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend 
                wrapperStyle={{
                  color: '#9CA3AF'
                }}
              />
              <Line
                type="monotone"
                dataKey={selectedOption?.dataKey}
                stroke={selectedOption?.color}
                name={selectedOption?.label}
                dot={{ fill: selectedOption?.color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="w-64">
          <ClientSummary data={data} />
        </div>
      </div>
    </div>
  );
}