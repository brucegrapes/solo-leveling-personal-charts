'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, SubGoal, DEFAULT_ACTIVITIES, UserConfig } from '@/types';
import { ActivityIcon } from '@/components/icons';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>(DEFAULT_ACTIVITIES);
  const [saving, setSaving] = useState(false);
  const [editingActivity, setEditingActivity] = useState<string | null>(null);
  const [newSubGoal, setNewSubGoal] = useState({ name: '', icon: '' });
  const [newActivity, setNewActivity] = useState({ name: '', icon: '', isScored: true });
  const [showAddActivity, setShowAddActivity] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchConfig();
    }
  }, [status]);

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

  const saveConfig = async (newActivities: Activity[]) => {
    setSaving(true);
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activities: newActivities,
          customized: true,
        }),
      });
    } catch (error) {
      console.error('Failed to save config:', error);
    } finally {
      setSaving(false);
    }
  };

  const addSubGoal = (activityId: string) => {
    if (!newSubGoal.name.trim()) return;
    
    const updated = activities.map((activity) => {
      if (activity.id === activityId) {
        const subGoals = activity.subGoals || [];
        return {
          ...activity,
          subGoals: [
            ...subGoals,
            {
              id: `${activityId}-${newSubGoal.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
              name: newSubGoal.name,
              icon: newSubGoal.icon || '⭐',
            },
          ],
        };
      }
      return activity;
    });
    
    setActivities(updated);
    saveConfig(updated);
    setNewSubGoal({ name: '', icon: '' });
  };

  const removeSubGoal = (activityId: string, subGoalId: string) => {
    const updated = activities.map((activity) => {
      if (activity.id === activityId && activity.subGoals) {
        return {
          ...activity,
          subGoals: activity.subGoals.filter((sg) => sg.id !== subGoalId),
        };
      }
      return activity;
    });
    
    setActivities(updated);
    saveConfig(updated);
  };

  const updateActivityName = (activityId: string, newName: string) => {
    const updated = activities.map((activity) => {
      if (activity.id === activityId) {
        return { ...activity, name: newName };
      }
      return activity;
    });
    
    setActivities(updated);
    saveConfig(updated);
  };

  const updateActivityIcon = (activityId: string, newIcon: string) => {
    const updated = activities.map((activity) => {
      if (activity.id === activityId) {
        return { ...activity, icon: newIcon };
      }
      return activity;
    });
    
    setActivities(updated);
    saveConfig(updated);
  };

  const toggleActivityScoring = (activityId: string) => {
    const updated = activities.map((activity) => {
      if (activity.id === activityId) {
        return { ...activity, isScored: !activity.isScored };
      }
      return activity;
    });
    
    setActivities(updated);
    saveConfig(updated);
  };

  const addNewActivity = () => {
    if (!newActivity.name.trim()) return;
    
    const newId = newActivity.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const updated = [
      ...activities,
      {
        id: newId,
        name: newActivity.name,
        icon: newActivity.icon || '🎯',
        isScored: newActivity.isScored,
        subGoals: [],
      },
    ];
    
    setActivities(updated);
    saveConfig(updated);
    setNewActivity({ name: '', icon: '', isScored: true });
    setShowAddActivity(false);
  };

  const removeActivity = (activityId: string) => {
    const updated = activities.filter((a) => a.id !== activityId);
    setActivities(updated);
    saveConfig(updated);
  };

  const resetToDefaults = () => {
    if (confirm('Reset all categories to defaults? This will not delete your tracking data.')) {
      setActivities(DEFAULT_ACTIVITIES);
      saveConfig(DEFAULT_ACTIVITIES);
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-sl-dark via-sl-blue to-sl-purple p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="text-sl-gold hover:text-sl-gold/80 flex items-center gap-2"
            >
              ← Back to Tracker
            </Link>
            {saving && (
              <span className="text-sl-gold text-sm">☁️ Saving...</span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-sl-gold glow text-center mb-2">
            ⚙️ Dashboard
          </h1>
          <p className="text-sl-light text-center">Customize your quest categories and sub-goals</p>
        </header>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button
            onClick={() => setShowAddActivity(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            ➕ Add New Category
          </button>
          <button
            onClick={resetToDefaults}
            className="bg-sl-gray hover:bg-sl-gray/80 text-white font-bold py-2 px-4 rounded-lg transition-all border border-sl-purple/50"
          >
            🔄 Reset to Defaults
          </button>
        </div>

        {/* Add New Activity Modal */}
        {showAddActivity && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-sl-dark rounded-xl p-6 border-2 border-sl-purple max-w-md w-full">
              <h3 className="text-xl font-bold text-sl-gold mb-4">Add New Category</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sl-light text-sm mb-1">Category Name</label>
                  <input
                    type="text"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                    placeholder="e.g., Creativity"
                    className="w-full bg-sl-gray/50 text-white rounded-lg p-3 border border-sl-purple/30 focus:border-sl-gold/50 focus:outline-none"
                  />
                </div>
                <p className="text-sl-light/50 text-xs">Custom categories will use a default icon</p>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newActivity.isScored}
                    onChange={(e) => setNewActivity({ ...newActivity, isScored: e.target.checked })}
                    className="w-5 h-5 rounded border-2 border-sl-purple cursor-pointer accent-sl-purple"
                  />
                  <label className="text-sl-light">Count towards XP & Level</label>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={addNewActivity}
                    className="flex-1 bg-sl-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Add Category
                  </button>
                  <button
                    onClick={() => setShowAddActivity(false)}
                    className="flex-1 bg-sl-gray hover:bg-sl-gray/80 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Categories */}
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-sl-gray/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border-2 border-sl-purple/50 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center bg-sl-dark/50 rounded-lg border border-sl-purple/30">
                    <ActivityIcon id={activity.id} size={24} />
                  </div>
                  <input
                    type="text"
                    value={activity.name}
                    onChange={(e) => updateActivityName(activity.id, e.target.value)}
                    className="text-lg sm:text-xl font-bold text-white bg-transparent border-b-2 border-transparent hover:border-sl-purple/50 focus:border-sl-gold focus:outline-none min-w-0 w-full"
                  />
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <input
                      type="checkbox"
                      checked={activity.isScored !== false}
                      onChange={() => toggleActivityScoring(activity.id)}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-sl-purple cursor-pointer accent-sl-purple"
                    />
                    <span className="text-sl-light text-xs sm:text-sm whitespace-nowrap">
                      {activity.isScored !== false ? 'XP' : 'No XP'}
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingActivity(editingActivity === activity.id ? null : activity.id)}
                    className="text-sl-gold hover:text-sl-gold/80 p-1 sm:p-2"
                  >
                    {editingActivity === activity.id ? '✕' : '✎'}
                  </button>
                  {activity.id !== 'notes' && (
                    <button
                      onClick={() => removeActivity(activity.id)}
                      className="text-red-400 hover:text-red-300 p-1 sm:p-2"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-goals */}
              {activity.id !== 'notes' && (
                <div className="space-y-2">
                  <h4 className="text-sl-light text-sm font-semibold mb-2">Sub-Goals:</h4>
                  <div className="flex flex-wrap gap-2">
                    {activity.subGoals?.map((subGoal) => (
                      <div
                        key={subGoal.id}
                        className="flex items-center gap-2 bg-sl-dark/50 rounded-lg px-3 py-2 border border-sl-purple/30"
                      >
                        <ActivityIcon id={subGoal.id} size={18} />
                        <span className="text-white text-sm">{subGoal.name}</span>
                        {editingActivity === activity.id && (
                          <button
                            onClick={() => removeSubGoal(activity.id, subGoal.id)}
                            className="text-red-400 hover:text-red-300 text-xs ml-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    {(!activity.subGoals || activity.subGoals.length === 0) && (
                      <span className="text-sl-light/50 text-sm italic">No sub-goals yet</span>
                    )}
                  </div>

                  {/* Add sub-goal form */}
                  {editingActivity === activity.id && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={newSubGoal.name}
                        onChange={(e) => setNewSubGoal({ ...newSubGoal, name: e.target.value })}
                        placeholder="New sub-goal name"
                        className="flex-1 min-w-[150px] bg-sl-dark/50 text-white rounded-lg p-2 border border-sl-purple/30 focus:border-sl-gold/50 focus:outline-none"
                      />
                      <button
                        onClick={() => addSubGoal(activity.id)}
                        className="bg-sl-purple hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-sl-gray/20 rounded-xl p-6 border border-sl-purple/30">
          <h3 className="text-lg font-bold text-sl-gold mb-3">💡 How It Works</h3>
          <ul className="text-sl-light space-y-2 text-sm">
            <li>• <strong>Categories</strong> are your main quest types (Strength, Knowledge, etc.)</li>
            <li>• <strong>Sub-goals</strong> are specific tasks within each category (Gym, Reading, etc.)</li>
            <li>• Completing a category OR any sub-goal gives you XP</li>
            <li>• Categories marked as &ldquo;No XP&rdquo; (like Notes) won&apos;t affect your level</li>
            <li>• Your existing tracking data is preserved when you customize</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
