'use client';

import { Activity, ActivityData } from '@/types';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

interface ChartViewProps {
  activityData: ActivityData;
  activities: Activity[];
}

export default function ChartView({ activityData, activities }: ChartViewProps) {
  // Prepare data for the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = activityData[dateStr] || {};
    
    const dataPoint: any = {
      date: format(date, 'MMM dd'),
      total: 0,
    };
    
    activities.forEach((activity) => {
      const completed = dayData[activity.id] ? 1 : 0;
      dataPoint[activity.name] = completed;
      dataPoint.total += completed;
    });
    
    return dataPoint;
  });

  // Calculate total completions per activity
  const activityTotals = activities.map((activity) => {
    let total = 0;
    Object.values(activityData).forEach((day) => {
      if (day[activity.id]) total++;
    });
    return {
      name: activity.name,
      total,
      icon: activity.icon,
    };
  });

  const colors = {
    'Gym': '#ef4444',
    'Reading': '#3b82f6',
    'Office Work': '#10b981',
    'Mental Health': '#8b5cf6',
    'Coolness': '#f59e0b',
    'Life Notes': '#ec4899',
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Activity Balance Radar Chart */}
      <div className="bg-sl-gray/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-sl-purple/50">
        <h2 className="text-xl sm:text-2xl font-bold text-sl-gold mb-2 sm:mb-4">Activity Balance (Hexagon)</h2>
        <p className="text-sl-light text-xs sm:text-sm mb-3 sm:mb-4">A perfect hexagon means equal focus across all activities</p>
        <ResponsiveContainer width="100%" height={300} className="sm:hidden">
          <RadarChart data={activityTotals}>
            <PolarGrid stroke="#6d28d9" />
            <PolarAngleAxis dataKey="name" stroke="#8b96a5" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis stroke="#8b96a5" tick={{ fontSize: 10 }} />
            <Radar
              name="Completed Tasks"
              dataKey="total"
              stroke="#fbbf24"
              fill="#6d28d9"
              fillOpacity={0.6}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #6d28d9',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={400} className="hidden sm:block">
          <RadarChart data={activityTotals}>
            <PolarGrid stroke="#6d28d9" />
            <PolarAngleAxis dataKey="name" stroke="#8b96a5" />
            <PolarRadiusAxis stroke="#8b96a5" />
            <Radar
              name="Completed Tasks"
              dataKey="total"
              stroke="#fbbf24"
              fill="#6d28d9"
              fillOpacity={0.6}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #6d28d9',
                borderRadius: '8px',
              }}
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
            {activities.map((activity) => (
              <Line
                key={activity.id}
                type="monotone"
                dataKey={activity.name}
                stroke={colors[activity.name as keyof typeof colors] || '#6d28d9'}
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
            {activities.map((activity) => (
              <Line
                key={activity.id}
                type="monotone"
                dataKey={activity.name}
                stroke={colors[activity.name as keyof typeof colors] || '#6d28d9'}
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
