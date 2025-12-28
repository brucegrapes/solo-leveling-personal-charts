'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ActivityTracker from '@/components/ActivityTracker';
import StatsDisplay from '@/components/StatsDisplay';
import ChartView from '@/components/ChartView';
import LevelDisplay from '@/components/LevelDisplay';
import { Activity, ActivityData, UserStats } from '@/types';

const ACTIVITIES: Activity[] = [
  { id: 'gym', name: 'Gym', icon: '💪' },
  { id: 'books', name: 'Reading', icon: '📚' },
  { id: 'office', name: 'Office Work', icon: '💼' },
  { id: 'mental', name: 'Mental Health', icon: '🧘' },
  { id: 'coolness', name: 'Coolness', icon: '😎' },
  { id: 'notes', name: 'Life Notes', icon: '📝' },
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activityData, setActivityData] = useState<ActivityData>({});
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    experience: 0,
    totalTasks: 0,
    currentStreak: 0,
    title: 'E-Rank Hunter',
  });
  const [showChart, setShowChart] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Load data from database on mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (response.ok) {
        const data = await response.json();
        setActivityData(data.activityData);
        setUserStats(data.userStats);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const saveData = async (newActivityData: ActivityData, newUserStats: UserStats) => {
    setSyncing(true);
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityData: newActivityData,
          userStats: newUserStats,
        }),
      });
    } catch (error) {
      console.error('Failed to save data:', error);
    } finally {
      setSyncing(false);
    }
  };

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sl-dark via-sl-blue to-sl-purple flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-sl-gold glow mb-4">Loading...</div>
          <p className="text-sl-light">Entering the System</p>
        </div>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const handleActivityToggle = (activityId: string, date: string) => {
    setActivityData((prev) => {
      const newData = { ...prev };
      if (!newData[date]) {
        newData[date] = {};
      }
      newData[date][activityId] = !newData[date][activityId];
      
      // Update stats
      const newStats = calculateStats(newData);
      setUserStats(newStats);
      saveData(newData, newStats);
      
      return newData;
    });
  };

  const handleNotesUpdate = (date: string, notes: string) => {
    setActivityData((prev) => {
      const newData = { ...prev };
      if (!newData[date]) {
        newData[date] = {};
      }
      newData[date].notes = notes;
      saveData(newData, userStats);
      return newData;
    });
  };

  const updateStats = (data: ActivityData) => {
    const newStats = calculateStats(data);
    setUserStats(newStats);
  };

  const calculateStats = (data: ActivityData): UserStats => {
    const allDates = Object.keys(data).sort();
    const totalCompleted = Object.values(data).reduce((acc, day) => {
      return acc + Object.values(day).filter(Boolean).length;
    }, 0);

    // Calculate experience and level
    const baseXP = 10; // XP per task
    const totalXP = totalCompleted * baseXP;
    
    // Progressive leveling: level 1 needs 100 XP, level 2 needs 150, level 3 needs 200, etc.
    let level = 1;
    let xpForNextLevel = 100;
    let accumulatedXP = totalXP;
    
    while (accumulatedXP >= xpForNextLevel) {
      accumulatedXP -= xpForNextLevel;
      level++;
      xpForNextLevel = 100 + (level - 1) * 50; // Progressive difficulty
    }

    // Calculate streak
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (data[dateStr] && Object.values(data[dateStr]).some(Boolean)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Determine title based on level and most frequent activity
    const activityCounts: Record<string, number> = {};
    Object.values(data).forEach((day) => {
      Object.keys(day).forEach((activityId) => {
        if (day[activityId]) {
          activityCounts[activityId] = (activityCounts[activityId] || 0) + 1;
        }
      });
    });

    const mostFrequentActivity = Object.keys(activityCounts).reduce((a, b) =>
      activityCounts[a] > activityCounts[b] ? a : b
    , 'gym');

    const titles = getTitles(level, mostFrequentActivity);

    return {
      level,
      experience: accumulatedXP,
      totalTasks: totalCompleted,
      currentStreak: streak,
      title: titles,
    };
  };

  const getTitles = (level: number, topActivity: string): string => {
    const activityTitles: Record<string, string[]> = {
      gym: ['E-Rank Hunter', 'D-Rank Hunter', 'C-Rank Hunter', 'B-Rank Hunter', 'A-Rank Hunter', 'S-Rank Hunter', 'Iron Body Monarch'],
      books: ['E-Rank Hunter', 'D-Rank Hunter', 'C-Rank Hunter', 'B-Rank Hunter', 'A-Rank Hunter', 'S-Rank Hunter', 'Shadow Sage'],
      office: ['E-Rank Hunter', 'D-Rank Hunter', 'C-Rank Hunter', 'B-Rank Hunter', 'A-Rank Hunter', 'S-Rank Hunter', 'Architect of Success'],
      mental: ['E-Rank Hunter', 'D-Rank Hunter', 'C-Rank Hunter', 'B-Rank Hunter', 'A-Rank Hunter', 'S-Rank Hunter', 'Monarch of Serenity'],
      coolness: ['E-Rank Hunter', 'D-Rank Hunter', 'C-Rank Hunter', 'B-Rank Hunter', 'A-Rank Hunter', 'S-Rank Hunter', 'Shadow Monarch'],
      notes: ['E-Rank Hunter', 'D-Rank Hunter', 'C-Rank Hunter', 'B-Rank Hunter', 'A-Rank Hunter', 'S-Rank Hunter', 'Chronicler Supreme'],
    };

    const titles = activityTitles[topActivity] || activityTitles['gym'];
    const titleIndex = Math.floor(level / 10);
    return titles[Math.min(titleIndex, titles.length - 1)];
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sl-dark via-sl-blue to-sl-purple p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-4 max-w-full px-4">
            <div className="text-left">
              <p className="text-sl-light text-sm">Welcome, {session?.user?.name}</p>
              <button 
                onClick={() => signOut()}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Sign Out
              </button>
            </div>
            {syncing && (
              <div className="text-sl-gold text-sm">
                ☁️ Syncing...
              </div>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-sl-gold glow mb-2">
            Solo Leveling Progress
          </h1>
          <p className="text-sl-light text-sm sm:text-base lg:text-lg">Track your journey to become the strongest</p>
          <div className="mt-3 sm:mt-4">
            <Link
              href="/history"
              className="inline-block bg-sl-purple/50 hover:bg-sl-purple text-white font-semibold py-2 px-4 sm:px-6 rounded-lg border-2 border-sl-gold/50 transition-all text-sm sm:text-base"
            >
              📖 View Journal & History
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="lg:col-span-2">
            <LevelDisplay userStats={userStats} />
          </div>
          <div>
            <StatsDisplay userStats={userStats} activities={ACTIVITIES} activityData={activityData} />
          </div>
        </div>

        <div className="mb-4 sm:mb-6 flex justify-center">
          <button
            onClick={() => setShowChart(!showChart)}
            className="bg-sl-purple hover:bg-purple-700 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg glow-purple transition-all text-sm sm:text-base w-full sm:w-auto"
          >
            {showChart ? 'Hide Charts' : 'View Charts'}
          </button>
        </div>

        {showChart && (
          <div className="mb-8">
            <ChartView activityData={activityData} activities={ACTIVITIES} />
          </div>
        )}

        <ActivityTracker
          activities={ACTIVITIES}
          activityData={activityData}
          onActivityToggle={handleActivityToggle}
          onNotesUpdate={handleNotesUpdate}
        />
      </div>
    </main>
  );
}
