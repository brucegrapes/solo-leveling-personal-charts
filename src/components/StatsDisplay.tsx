import { Activity, ActivityData, UserStats } from '@/types';
import { ActivityIcon } from './icons';

interface StatsDisplayProps {
  userStats: UserStats;
  activities: Activity[];
  activityData: ActivityData;
}

export default function StatsDisplay({ userStats, activities, activityData }: StatsDisplayProps) {
  // Calculate stats per activity (including sub-goals)
  const activityStats = activities
    .filter((activity) => activity.id !== 'notes') // Exclude notes from stats
    .map((activity) => {
      let mainCount = 0;
      let subGoalCount = 0;
      
      Object.values(activityData).forEach((day) => {
        // Count main activity completions
        if (day[activity.id]) mainCount++;
        
        // Count sub-goal completions
        if (activity.subGoals) {
          activity.subGoals.forEach((subGoal) => {
            const key = `${activity.id}:${subGoal.id}`;
            if (day[key]) subGoalCount++;
          });
        }
      });
      
      return { 
        ...activity, 
        mainCount,
        subGoalCount,
        totalCount: mainCount + subGoalCount,
        isScored: activity.isScored !== false,
      };
    });

  const sortedStats = [...activityStats].sort((a, b) => b.totalCount - a.totalCount);

  return (
    <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-sl-purple/50">
      <h2 className="text-xl sm:text-2xl font-bold text-sl-gold mb-3 sm:mb-4">Activity Stats</h2>
      <div className="space-y-2 sm:space-y-3">
        {sortedStats.map((activity, index) => (
          <div key={activity.id} className="bg-sl-dark/50 rounded-lg p-2.5 sm:p-3 border border-sl-purple/30">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ActivityIcon id={activity.id} size={24} />
                <span className="font-semibold text-white text-sm sm:text-base">{activity.name}</span>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-lg font-bold text-sl-gold">{activity.totalCount}</span>
                {activity.subGoalCount > 0 && (
                  <span className="text-xs text-sl-light ml-1">
                    (+{activity.subGoalCount} sub)
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {index === 0 && activity.totalCount > 0 && (
                <span className="text-xs text-sl-gold">⭐ Most Completed</span>
              )}
              {!activity.isScored && (
                <span className="text-xs text-sl-light/50">(No XP)</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
