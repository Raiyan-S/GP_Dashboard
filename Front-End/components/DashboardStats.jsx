import React, { useState, useEffect } from 'react';
import { Users, Target, TrendingDown, Award } from 'lucide-react'; // Icons from Lucide 
import StatsCard from './dashboard/StatsCard';
import { fetchAveragedMetrics } from '../services/api'; // Import fetchAveragedMetrics

// DashboardStats component
// Used in App.jsx
export default function DashboardStats() {
  const [averagedMetrics, setAveragedMetrics] = useState(null);

  // Fetch averaged metrics data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAveragedMetrics();
      setAveragedMetrics(data); // Store the averaged metrics data
    };
    fetchData();
  }, []);

  // Calculate stats from the averaged metrics
  const calculateStats = () => {
    // If there's no data or it's loading, return 0 for all values till the data is fetched
    if (!averagedMetrics) {
      return {
        activeClients: 0,
        avgAccuracy: 0,
        avgLoss: 0,
        avgF1Score: 0,
        trends: {
          accuracy: 0,
          loss: 0,
          f1Score: 0
        }
      };
    }

    const { averaged_metrics, client_count } = averagedMetrics;

    // Example of calculating trends based on last round, can modify if needed
    const calculateTrend = (current, previous, invert = false) => {
      const trend = ((current - previous) / previous) * 100;
      return (invert ? -trend : trend).toFixed(1);
    };

    return {
      activeClients: client_count,
      avgAccuracy: averaged_metrics.accuracy || 0,
      avgLoss: averaged_metrics.loss || 0,
      avgF1Score: averaged_metrics.f1_score || 0,
      trends: {
        // need to fetch second last round (working later)
        // accuracy: calculateTrend(lastRound.accuracy, lastRound.accuracy), // Use actual trend calculation if needed
        // loss: calculateTrend(lastRound.loss, lastRound.loss, true), // Invert for loss
        // f1Score: calculateTrend(lastRound.f1_score, lastRound.f1_score)
        accuracy: 0,
        loss: 0,
        f1Score: 0
      }
    };
  };

  const stats = calculateStats();

  // Render the component while loading the data (If there's loading)
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold dark:text-white">Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Active Clients"
          value={stats.activeClients}
          Icon={Users}
        />
        <StatsCard
          title="Average Accuracy"
          value={`${stats.avgAccuracy}%`}
          Icon={Target}
          trend={stats.trends.accuracy}
        />
        <StatsCard
          title="Average Loss"
          value={stats.avgLoss}
          Icon={TrendingDown}
          trend={stats.trends.loss}
        />
        <StatsCard
          title="Average F1-Score"
          value={`${stats.avgF1Score}%`}
          Icon={Award}
          trend={stats.trends.f1Score}
        />
      </div>
    </div>
  );
}