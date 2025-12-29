'use client';

import { Activity, ActivityData } from '@/types';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

interface ChartViewProps {
  activityData: ActivityData;
  activities: Activity[];
}

export default function ChartView({ activityData, activities }: ChartViewProps) {
  // Filter out notes from charts
  const scoredActivities = activities.filter((a) => a.id !== 'notes' && a.isScored !== false);

  // Prepare data for the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = activityData[dateStr] || {};
    
    const dataPoint: Record<string, string | number> = {
      date: format(date, 'MMM dd'),
      total: 0,
    };
    
    scoredActivities.forEach((activity) => {
      // Count main activity
      let completed = dayData[activity.id] ? 1 : 0;
      
      // Count sub-goals
      if (activity.subGoals) {
        activity.subGoals.forEach((subGoal) => {
          const key = `${activity.id}:${subGoal.id}`;
          if (dayData[key]) completed++;
        });
      }
      
      dataPoint[activity.name] = completed;
      dataPoint.total = (dataPoint.total as number) + completed;
    });
    
    return dataPoint;
  });

  // Calculate total completions per activity (including sub-goals)
  const activityTotals = scoredActivities.map((activity) => {
    let total = 0;
    Object.values(activityData).forEach((day) => {
      if (day[activity.id]) total++;
      
      // Count sub-goals
      if (activity.subGoals) {
        activity.subGoals.forEach((subGoal) => {
          const key = `${activity.id}:${subGoal.id}`;
          if (day[key]) total++;
        });
      }
    });
    return {
      name: activity.name,
      total,
      icon: activity.icon,
    };
  });

  // Calculate total tasks for dynamic fill opacity
  const totalTasks = activityTotals.reduce((sum, a) => sum + a.total, 0);
  const maxExpectedTasks = scoredActivities.length * 30; // Assume 30 days of tracking
  const fillIntensity = Math.min(0.8, Math.max(0.3, totalTasks / maxExpectedTasks + 0.3));

  // Dynamic colors based on activity names
  const getColor = (name: string): string => {
    const colorMap: Record<string, string> = {
      // New game-themed names
      'Strength': '#ef4444',
      'Knowledge': '#3b82f6',
      'Productivity': '#10b981',
      'Mind': '#8b5cf6',
      'Coolness': '#f59e0b',
      // Legacy names (for backward compatibility)
      'Gym': '#ef4444',
      'Reading': '#3b82f6',
      'Office Work': '#10b981',
      'Mental Health': '#8b5cf6',
      'Life Notes': '#ec4899',
    };
    return colorMap[name] || '#6d28d9';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Activity Balance Radar Chart */}
      <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-sl-purple/50">
        <h2 className="text-xl sm:text-2xl font-bold text-sl-gold mb-2 sm:mb-4">Activity Balance (Hexagon)</h2>
        <p className="text-sl-light text-xs sm:text-sm mb-3 sm:mb-4">
          A perfect hexagon means equal focus across all activities
          <span className="ml-2 text-sl-gold">({totalTasks} total tasks)</span>
        </p>
        <ResponsiveContainer width="100%" height={300} className="sm:hidden">
          <RadarChart data={activityTotals}>
            <defs>
              <radialGradient id="radarGradientMobile" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#6d28d9" stopOpacity={fillIntensity} />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity={fillIntensity * 0.5} />
              </radialGradient>
            </defs>
            <PolarGrid stroke="#6d28d9" strokeOpacity={0.5} />
            <PolarAngleAxis dataKey="name" stroke="#8b96a5" tick={{ fontSize: 10, fill: '#e5e7eb' }} />
            <PolarRadiusAxis stroke="#8b96a5" tick={{ fontSize: 10 }} angle={90} />
            <Radar
              name="Completed Tasks"
              dataKey="total"
              stroke="#fbbf24"
              strokeWidth={2}
              fill="url(#radarGradientMobile)"
              fillOpacity={fillIntensity}
              dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '2px solid #fbbf24',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value} tasks`, 'Completed']}
            />
          </RadarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={400} className="hidden sm:block">
          <RadarChart data={activityTotals}>
            <defs>
              <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#6d28d9" stopOpacity={fillIntensity} />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity={fillIntensity * 0.5} />
              </radialGradient>
            </defs>
            <PolarGrid stroke="#6d28d9" strokeOpacity={0.5} />
            <PolarAngleAxis dataKey="name" stroke="#8b96a5" tick={{ fill: '#e5e7eb', fontSize: 12 }} />
            <PolarRadiusAxis stroke="#8b96a5" angle={90} />
            <Radar
              name="Completed Tasks"
              dataKey="total"
              stroke="#fbbf24"
              strokeWidth={3}
              fill="url(#radarGradient)"
              fillOpacity={fillIntensity}
              dot={{ fill: '#fbbf24', strokeWidth: 2, r: 5 }}
              activeDot={{ fill: '#fbbf24', strokeWidth: 3, r: 8 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '2px solid #fbbf24',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value} tasks`, 'Completed']}
            />
            <Legend 
              wrapperStyle={{ color: '#e5e7eb' }}
              formatter={() => <span style={{ color: '#fbbf24' }}>Completed Tasks</span>}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Progress Chart */}
      <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-sl-purple/50">
        <h2 className="text-xl sm:text-2xl font-bold text-sl-gold mb-2 sm:mb-4">Last 30 Days Progress</h2>
        <ResponsiveContainer width="100%" height={250} className="sm:hidden">
          <LineChart data={last30Days}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#8b96a5" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
            <YAxis stroke="#8b96a5" tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #6d28d9',
                borderRadius: '8px',
                fontSize: '11px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            {scoredActivities.map((activity) => (
              <Line
                key={activity.id}
                type="monotone"
                dataKey={activity.name}
                stroke={getColor(activity.name)}
                strokeWidth={1.5}
                dot={{ r: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
          <LineChart data={last30Days}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#8b96a5" />
            <YAxis stroke="#8b96a5" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #6d28d9',
                borderRadius: '8px',
              }}
            />
            <Legend />
            {scoredActivities.map((activity) => (
              <Line
                key={activity.id}
                type="monotone"
                dataKey={activity.name}
                stroke={getColor(activity.name)}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Total Activity Comparison */}
      <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-sl-purple/50">
        <h2 className="text-xl sm:text-2xl font-bold text-sl-gold mb-2 sm:mb-4">Total Activity Comparison</h2>
        <ResponsiveContainer width="100%" height={250} className="sm:hidden">
          <BarChart data={activityTotals}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#8b96a5" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#8b96a5" tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #6d28d9',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="total" fill="#6d28d9" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
          <BarChart data={activityTotals}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#8b96a5" />
            <YAxis stroke="#8b96a5" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #6d28d9',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="total" fill="#6d28d9" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
