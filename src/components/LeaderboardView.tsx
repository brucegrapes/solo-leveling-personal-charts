'use client';

import { useState, useEffect } from 'react';
import { LeaderboardType } from '@/lib/leaderboard';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
  level: number;
  title: string;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  userRank: {
    rank: number;
    score: number;
  } | null;
  type: LeaderboardType;
  totalPlayers: number;
}

const getRankEmoji = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

const getRankClass = (rank: number) => {
  if (rank === 1) return 'text-yellow-400 font-bold';
  if (rank === 2) return 'text-gray-300 font-bold';
  if (rank === 3) return 'text-amber-600 font-bold';
  return 'text-gray-400';
};

export default function LeaderboardView() {
  const [selectedType, setSelectedType] = useState<LeaderboardType>('alltime');
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedType]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/leaderboard?type=${selectedType}&limit=100`);
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const tabs: { type: LeaderboardType; label: string; icon: string }[] = [
    { type: 'weekly', label: 'Weekly Warriors', icon: '📅' },
    { type: 'monthly', label: 'Monthly Masters', icon: '🗓️' },
    { type: 'alltime', label: 'All-Time Legends', icon: '👑' },
    { type: 'streak', label: 'Streak Kings', icon: '🔥' },
  ];

  const getScoreLabel = (type: LeaderboardType) => {
    if (type === 'streak') return 'days';
    return 'XP';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 shadow-2xl border border-purple-500/30">
        <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          🏆 Global Leaderboards
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.type}
              onClick={() => setSelectedType(tab.type)}
              className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-semibold transition-all ${
                selectedType === tab.type
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* User's Rank Card */}
        {data?.userRank && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Your Rank</p>
                <p className="text-2xl font-bold text-white">
                  {getRankEmoji(data.userRank.rank)} Rank {data.userRank.rank}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Your Score</p>
                <p className="text-2xl font-bold text-purple-400">
                  {data.userRank.score.toLocaleString()} {getScoreLabel(selectedType)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="text-gray-400 mt-4">Loading leaderboard...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400">❌ {error}</p>
            <button
              onClick={fetchLeaderboard}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Leaderboard Table */}
        {!loading && !error && data && (
          <>
            <div className="bg-black/30 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-4 text-gray-400 font-semibold">Rank</th>
                      <th className="text-left p-4 text-gray-400 font-semibold">Hunter</th>
                      <th className="text-left p-4 text-gray-400 font-semibold">Level</th>
                      <th className="text-left p-4 text-gray-400 font-semibold">Title</th>
                      <th className="text-right p-4 text-gray-400 font-semibold">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.leaderboard.map((entry) => (
                      <tr
                        key={entry.userId}
                        className="border-b border-gray-800 hover:bg-white/5 transition-colors"
                      >
                        <td className={`p-4 ${getRankClass(entry.rank)}`}>
                          <span className="text-xl">{getRankEmoji(entry.rank)}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-white">{entry.username}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-purple-400 font-bold">Lv {entry.level}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-400">{entry.title}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-bold text-blue-400">
                            {entry.score.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            {getScoreLabel(selectedType)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>
                Showing top {data.leaderboard.length} of {data.totalPlayers.toLocaleString()}{' '}
                hunters
              </p>
              {selectedType === 'weekly' && (
                <p className="mt-1 text-xs text-gray-500">
                  ⏰ Resets every Monday at 00:00 UTC
                </p>
              )}
              {selectedType === 'monthly' && (
                <p className="mt-1 text-xs text-gray-500">
                  ⏰ Resets on the 1st of each month at 00:00 UTC
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
