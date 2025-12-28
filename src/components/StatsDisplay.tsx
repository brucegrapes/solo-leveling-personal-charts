import { Activity, ActivityData, UserStats } from '@/types';

interface StatsDisplayProps {
  userStats: UserStats;
  activities: Activity[];
  activityData: ActivityData;
}

export default function StatsDisplay({ userStats, activities, activityData }: StatsDisplayProps) {
  // Calculate stats per activity
  const activityStats = activities.map((activity) => {
    let count = 0;
    Object.values(activityData).forEach((day) => {
      if (day[activity.id]) count++;
    });
    return { ...activity, count };
  });

  const sortedStats = [...activityStats].sort((a, b) => b.count - a.count);

  return (
    <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-sl-purple/50">
      <h2 className="text-xl sm:text-2xl font-bold text-sl-gold mb-3 sm:mb-4">Activity Stats</h2>
      <div className="space-y-2 sm:space-y-3">
        {sortedStats.map((activity, index) => (
          <div key={activity.id} className="bg-sl-dark/50 rounded-lg p-2.5 sm:p-3 border border-sl-purple/30">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl">{activity.icon}</span>
                <span className="font-semibold text-white text-sm sm:text-base">{activity.name}</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-sl-gold">{activity.count}</span>
            </div>
            {index === 0 && activity.count > 0 && (
              <span className="text-xs text-sl-gold">⭐ Most Completed</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
