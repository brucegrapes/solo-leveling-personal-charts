import { Activity, ActivityData } from '@/types';
import { useState, useEffect, useMemo } from 'react';

interface ActivityTrackerProps {
  activities: Activity[];
  activityData: ActivityData;
  onActivityToggle: (activityId: string, date: string, subGoalId?: string) => void;
  onNotesUpdate: (date: string, notes: string) => void;
}

export default function ActivityTracker({ activities, activityData, onActivityToggle, onNotesUpdate }: ActivityTrackerProps) {
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayData = activityData[today] || {};
  const [notes, setNotes] = useState(typeof todayData.notes === 'string' ? todayData.notes : '');
  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());

  // Sync notes when activityData changes (e.g., on initial load)
  useEffect(() => {
    const currentNotes = activityData[today]?.notes;
    if (typeof currentNotes === 'string' && currentNotes !== notes) {
      setNotes(currentNotes);
    }
  }, [activityData, today]);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    onNotesUpdate(today, value);
  };

  const toggleExpand = (activityId: string) => {
    setExpandedActivities((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  const isSubGoalCompleted = (activityId: string, subGoalId: string): boolean => {
    const key = `${activityId}:${subGoalId}`;
    return !!todayData[key];
  };

  const getCompletedSubGoalsCount = (activityId: string): number => {
    const activity = activities.find((a) => a.id === activityId);
    if (!activity?.subGoals) return 0;
    return activity.subGoals.filter((sg) => isSubGoalCompleted(activityId, sg.id)).length;
  };

  // Filter out the notes activity for the main grid
  const trackableActivities = activities.filter((a) => a.id !== 'notes');
  const notesActivity = activities.find((a) => a.id === 'notes');

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-sl-purple/50">
        <h2 className="text-xl sm:text-2xl font-bold text-sl-gold mb-3 sm:mb-4">Today&apos;s Quest</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {trackableActivities.map((activity) => {
            const hasSubGoals = activity.subGoals && activity.subGoals.length > 0;
            const isExpanded = expandedActivities.has(activity.id);
            const completedSubGoals = getCompletedSubGoalsCount(activity.id);
            const totalSubGoals = activity.subGoals?.length || 0;
            
            return (
              <div key={activity.id} className="space-y-2">
                {/* Main Activity Card */}
                <div
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                    todayData[activity.id]
                      ? 'bg-sl-purple/40 border-sl-gold glow'
                      : 'bg-sl-dark/50 border-sl-light/30 hover:border-sl-purple/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-3xl">{activity.icon}</span>
                      <div>
                        <span className="text-base sm:text-lg font-semibold text-white">{activity.name}</span>
                        {hasSubGoals && (
                          <div className="text-xs text-sl-light">
                            {completedSubGoals}/{totalSubGoals} sub-goals
                          </div>
                        )}
                        {activity.isScored === false && (
                          <div className="text-xs text-sl-light/50">(No XP)</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasSubGoals && (
                        <button
                          onClick={() => toggleExpand(activity.id)}
                          className="text-sl-gold hover:text-sl-gold/80 text-sm p-1"
                          title="Show sub-goals"
                        >
                          {isExpanded ? '▼' : '▶'}
                        </button>
                      )}
                      <input
                        type="checkbox"
                        checked={!!todayData[activity.id] && typeof todayData[activity.id] === 'boolean'}
                        onChange={() => onActivityToggle(activity.id, today)}
                        className="w-6 h-6 rounded border-2 border-sl-purple cursor-pointer accent-sl-purple"
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-goals (expandable) */}
                {hasSubGoals && isExpanded && (
                  <div className="ml-4 space-y-2 animate-fadeIn">
                    {activity.subGoals?.map((subGoal) => (
                      <div
                        key={subGoal.id}
                        className={`p-2 sm:p-3 rounded-lg border transition-all ${
                          isSubGoalCompleted(activity.id, subGoal.id)
                            ? 'bg-sl-purple/30 border-sl-gold/70'
                            : 'bg-sl-dark/30 border-sl-light/20 hover:border-sl-purple/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{subGoal.icon}</span>
                            <span className="text-sm font-medium text-white">{subGoal.name}</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={isSubGoalCompleted(activity.id, subGoal.id)}
                            onChange={() => onActivityToggle(activity.id, today, subGoal.id)}
                            className="w-5 h-5 rounded border-2 border-sl-purple cursor-pointer accent-sl-purple"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-sl-purple/50">
        <h2 className="text-xl sm:text-2xl font-bold text-sl-gold mb-3 sm:mb-4">
          {notesActivity?.icon || '📝'} Today&apos;s Journal
        </h2>
        <p className="text-sl-light/50 text-xs mb-3">Notes don&apos;t count towards XP</p>
        <textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Write your thoughts, achievements, or reflections for today..."
          className="w-full h-28 sm:h-32 bg-sl-dark/50 text-white text-sm sm:text-base rounded-lg p-3 sm:p-4 border-2 border-sl-purple/30 focus:border-sl-gold/50 focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}
