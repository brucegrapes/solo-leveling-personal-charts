import { Activity, ActivityData } from '@/types';
import { useState } from 'react';

interface ActivityTrackerProps {
  activities: Activity[];
  activityData: ActivityData;
  onActivityToggle: (activityId: string, date: string) => void;
  onNotesUpdate: (date: string, notes: string) => void;
}

export default function ActivityTracker({ activities, activityData, onActivityToggle, onNotesUpdate }: ActivityTrackerProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayData = activityData[today] || {};
  const [notes, setNotes] = useState(todayData.notes || '');

  const handleNotesChange = (value: string) => {
    setNotes(value);
    onNotesUpdate(today, value);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-sl-purple/50">
        <h2 className="text-xl sm:text-2xl font-bold text-sl-gold mb-3 sm:mb-4">Today&apos;s Quest</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                todayData[activity.id]
                  ? 'bg-sl-purple/40 border-sl-gold glow'
                  : 'bg-sl-dark/50 border-sl-light/30 hover:border-sl-purple/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl">{activity.icon}</span>
                  <span className="text-base sm:text-lg font-semibold text-white">{activity.name}</span>
                </div>
                <input
                  type="checkbox"
                  checked={!!todayData[activity.id] && typeof todayData[activity.id] === 'boolean'}
                  onChange={() => onActivityToggle(activity.id, today)}
                  className="w-6 h-6 rounded border-2 border-sl-purple cursor-pointer accent-sl-purple"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-sl-purple/50">
        <h2 className="text-xl sm:text-2xl font-bold text-sl-gold mb-3 sm:mb-4">📝 Today&apos;s Journal</h2>
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
