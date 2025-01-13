import React from 'react';
import { Users, Target, TrendingDown, Award } from 'lucide-react';
import StatsCard from './dashboard/StatsCard';
import StatsCardSkeleton from './dashboard/StatsCardSkeleton';
import ErrorState from './common/ErrorState';
import { usePerformanceData } from '../hooks/usePerformanceData';

export default function DashboardStats() {
  const { data, loading, error, refetch } = usePerformanceData();

  // Calculate averages and trends from the last rounds
  const calculateStats = () => {
    if (!data.length) {
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

    const lastRound = data[data.length - 1];
    const previousRound = data[data.length - 2] || lastRound;

    // Calculate percentage changes
    const calculateTrend = (current: number, previous: number, invert: boolean = false) => {
      const trend = ((current - previous) / previous * 100);
      // For loss, we invert the trend since a decrease is positive
      return (invert ? -trend : trend).toFixed(1);
    };

    return {
      activeClients: 8,
      avgAccuracy: lastRound.accuracy,
      avgLoss: lastRound.loss,
      avgF1Score: lastRound.f1Score,
      trends: {
        accuracy: calculateTrend(lastRound.accuracy, previousRound.accuracy),
        loss: calculateTrend(lastRound.loss, previousRound.loss, true),
        f1Score: calculateTrend(lastRound.f1Score, previousRound.f1Score)
      }
    };
  };

  const stats = calculateStats();

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold dark:text-white">Summary</h2>
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold dark:text-white">Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {loading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Active Clients"
              value={stats.activeClients}
              Icon={Users}
            />
            <StatsCard
              title="Average Accuracy"
              value={`${stats.avgAccuracy.toFixed(1)}%`}
              Icon={Target}
              trend={stats.trends.accuracy}
            />
            <StatsCard
              title="Average Loss"
              value={stats.avgLoss.toFixed(3)}
              Icon={TrendingDown}
              trend={stats.trends.loss}
            />
            <StatsCard
              title="Average F1-Score"
              value={`${stats.avgF1Score.toFixed(1)}%`}
              Icon={Award}
              trend={stats.trends.f1Score}
            />
          </>
        )}
      </div>
    </div>
  );
}