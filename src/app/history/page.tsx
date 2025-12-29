'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, ActivityData, DEFAULT_ACTIVITIES } from '@/types';
import { format, subDays, parseISO } from 'date-fns';

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activityData, setActivityData] = useState<ActivityData>({});
  const [activities, setActivities] = useState<Activity[]>(DEFAULT_ACTIVITIES);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
      fetchConfig();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (response.ok) {
        const data = await response.json();
        setActivityData(data.activityData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const data = await response.json();
        if (data.config?.activities && data.config.customized) {
          setActivities(data.config.activities);
        }
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
    }
  };

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sl-dark via-sl-blue to-sl-purple flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-sl-gold glow mb-4">Loading...</div>
        </div>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const allDates = Object.keys(activityData).sort().reverse();
  const selectedDayData = activityData[selectedDate] || {};

  // Get trackable activities (exclude notes)
  const trackableActivities = activities.filter((a) => a.id !== 'notes');
  const totalActivitiesCount = trackableActivities.length;

  // Generate last 30 days for calendar view
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = date.toISOString().split('T')[0];
    return {
      date: dateStr,
      dateObj: date,
      data: activityData[dateStr] || {},
    };
  });

  const getCompletionCount = (dayData: Record<string, unknown>) => {
    let count = 0;
    trackableActivities.forEach((activity) => {
      if (dayData[activity.id]) count++;
      // Count sub-goals
      if (activity.subGoals) {
        activity.subGoals.forEach((subGoal) => {
          const key = `${activity.id}:${subGoal.id}`;
          if (dayData[key]) count++;
        });
      }
    });
    return count;
  };

  const getTotalPossibleCount = () => {
    let count = trackableActivities.length;
    trackableActivities.forEach((activity) => {
      if (activity.subGoals) {
        count += activity.subGoals.length;
      }
    });
    return count;
  };

  const totalPossible = getTotalPossibleCount();

  return (
    <main className="min-h-screen bg-gradient-to-br from-sl-dark via-sl-blue to-sl-purple p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-block mb-3 sm:mb-4 text-sl-light hover:text-sl-gold transition-colors text-sm sm:text-base"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-sl-gold glow mb-2">
            Journal & History
          </h1>
          <p className="text-sl-light text-sm sm:text-base lg:text-lg">Review your journey through time</p>
        </header>

        <div className="mb-4 sm:mb-6 flex justify-center gap-2 sm:gap-4">
          <button
            onClick={() => setViewMode('list')}
            className={`py-2 px-4 sm:px-6 rounded-lg font-semibold transition-all text-sm sm:text-base ${
              viewMode === 'list'
                ? 'bg-sl-purple text-white border-2 border-sl-gold glow-purple'
                : 'bg-sl-gray/30 text-sl-light border-2 border-sl-purple/30'
            }`}
          >
            📋 List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`py-2 px-6 rounded-lg font-semibold transition-all ${
              viewMode === 'calendar'
                ? 'bg-sl-purple text-white border-2 border-sl-gold glow-purple'
                : 'bg-sl-gray/30 text-sl-light border-2 border-sl-purple/30'
            }`}
          >
            📅 Calendar View
          </button>
        </div>

        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Date Selector */}
            <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-sl-purple/50">
              <h2 className="text-lg sm:text-xl font-bold text-sl-gold mb-3 sm:mb-4">Select Date</h2>
              <div className="space-y-2 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
                {allDates.length === 0 ? (
                  <p className="text-sl-light text-center py-4 text-sm">No history yet. Start tracking today!</p>
                ) : (
                  allDates.map((date) => {
                    const dayData = activityData[date];
                    const completionCount = getCompletionCount(dayData);
                    const isSelected = date === selectedDate;
                    
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`w-full text-left p-2.5 sm:p-3 rounded-lg transition-all ${
                          isSelected
                            ? 'bg-sl-purple border-2 border-sl-gold glow'
                            : 'bg-sl-dark/50 border-2 border-sl-purple/30 hover:border-sl-purple/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-white font-semibold text-sm sm:text-base">
                            {format(parseISO(date), 'MMM dd, yyyy')}
                          </span>
                          <span className="text-sl-gold">{completionCount}/{totalPossible}</span>
                        </div>
                        {dayData.notes && (
                          <p className="text-sl-light text-xs mt-1 truncate">
                            📝 {dayData.notes.substring(0, 30)}...
                          </p>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Selected Day Details */}
            <div className="lg:col-span-2">
              <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-sl-purple/50 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-sl-gold mb-3 sm:mb-4">
                  {format(parseISO(selectedDate), 'EEEE, MMMM dd, yyyy')}
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {trackableActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className={`p-3 sm:p-4 rounded-lg border-2 ${
                        selectedDayData[activity.id]
                          ? 'bg-sl-purple/40 border-sl-gold'
                          : 'bg-sl-dark/50 border-sl-light/30'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-xl sm:text-2xl">{activity.icon}</span>
                        <span className="text-white text-xs sm:text-sm">{activity.name}</span>
                      </div>
                      {selectedDayData[activity.id] && (
                        <span className="text-sl-gold text-xs">✓ Completed</span>
                      )}
                      {/* Show sub-goals if any */}
                      {activity.subGoals && activity.subGoals.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {activity.subGoals.map((subGoal) => {
                            const key = `${activity.id}:${subGoal.id}`;
                            const isCompleted = !!selectedDayData[key];
                            return (
                              <div 
                                key={subGoal.id}
                                className={`text-xs flex items-center gap-1 ${isCompleted ? 'text-sl-gold' : 'text-sl-light/50'}`}
                              >
                                <span>{subGoal.icon}</span>
                                <span>{subGoal.name}</span>
                                {isCompleted && <span>✓</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-sl-dark/50 rounded-lg p-3 sm:p-4 border-2 border-sl-purple/30">
                  <h3 className="text-base sm:text-lg font-bold text-sl-gold mb-2">📝 Journal Entry</h3>
                  {selectedDayData.notes ? (
                    <p className="text-white whitespace-pre-wrap text-sm sm:text-base">{selectedDayData.notes}</p>
                  ) : (
                    <p className="text-sl-light italic">No journal entry for this day</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-6 border-2 border-sl-purple/50">
            <h2 className="text-2xl font-bold text-sl-gold mb-4">Last 30 Days Calendar</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-3">
              {last30Days.map((day) => {
                const completionCount = getCompletionCount(day.data);
                const hasNotes = day.data.notes && typeof day.data.notes === 'string' && day.data.notes.length > 0;
                const completionRatio = totalPossible > 0 ? completionCount / totalPossible : 0;
                const intensityClass = 
                  completionCount === 0 ? 'bg-sl-dark/50' :
                  completionRatio <= 0.33 ? 'bg-sl-blue/30' :
                  completionRatio <= 0.66 ? 'bg-sl-purple/50' :
                  'bg-sl-gold/30';
                
                return (
                  <button
                    key={day.date}
                    onClick={() => {
                      setSelectedDate(day.date);
                      setViewMode('list');
                    }}
                    className={`p-4 rounded-lg border-2 border-sl-purple/30 hover:border-sl-gold/50 transition-all ${intensityClass}`}
                  >
                    <div className="text-center">
                      <div className="text-xs text-sl-light mb-1">
                        {format(day.dateObj, 'MMM dd')}
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {format(day.dateObj, 'dd')}
                      </div>
                      <div className="text-xs text-sl-gold">
                        {completionCount}/{totalPossible}
                      </div>
                      {hasNotes && (
                        <div className="text-xs mt-1">📝</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-sl-light">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-sl-dark/50 rounded border border-sl-purple/30"></div>
                <span>No activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-sl-blue/30 rounded border border-sl-purple/30"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-sl-purple/50 rounded border border-sl-purple/30"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-sl-gold/30 rounded border border-sl-purple/30"></div>
                <span>High</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
