import React, { useState, useEffect } from 'react';
import { Target, TrendingDown, Award, Hash, CheckCheck, Crosshair, CalendarClock } from 'lucide-react'; // Icons from Lucide 
import StatsCard from './StatsCard'; // Import StatsCard component
import { fetchBestF1Global } from '../../services/api'; // Import fetchBestF1Global

// Used in App.jsx
export default function DashboardStats() {
  const [bestF1Global, setBestF1Global] = useState(null);

  // Fetch best F1 global data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchBestF1Global();
      setBestF1Global(data); // Store the best F1 global data
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold dark:text-white">Global Model Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Round Number"
          value={`${bestF1Global ? bestF1Global.round : 0}`}
          Icon={Hash}
        />
        <StatsCard
          title="Global Accuracy"
          value={`${bestF1Global ? (bestF1Global.metrics.accuracy).toFixed(3) : 0}%`}
          Icon={Target}
        />
        <StatsCard
          title="Global Loss"
          value={bestF1Global ? (bestF1Global.metrics.avg_loss).toFixed(3) : 0}
          Icon={TrendingDown}
        />
        <StatsCard
          title="Global F1-Score"
          value={`${bestF1Global ? (bestF1Global.metrics.f1).toFixed(3) : 0}%`}
          Icon={Award}
        />
        <StatsCard
          title="Global Precision"
          value={`${bestF1Global ? (bestF1Global.metrics.precision).toFixed(3) : 0}%`}
          Icon={Crosshair}
        />
        <StatsCard
          title="Global Recall"
          value={`${bestF1Global ? (bestF1Global.metrics.recall).toFixed(3) : 0}%`}
          Icon={CheckCheck}
        />
        <StatsCard
          title="Time Stamp"
          value={`${bestF1Global ? new Date(bestF1Global.created_at).toLocaleDateString() : 0}`}
          Icon={CalendarClock}
        />
      </div>
    </div>
  );
}