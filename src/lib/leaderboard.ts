import Player from '@/models/Player';
import User from '@/models/User';
import mongoose from 'mongoose';

export type LeaderboardType = 'weekly' | 'monthly' | 'alltime' | 'streak';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
  level: number;
  title: string;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  userRank: {
    rank: number;
    score: number;
  } | null;
  type: LeaderboardType;
  totalPlayers: number;
}

/**
 * Reset weekly XP for all players (run every Monday at 00:00 UTC)
 */
export async function resetWeeklyXP() {
  const monday = new Date();
  const day = monday.getDay();
  const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);

  await Player.updateMany(
    {},
    {
      $set: {
        weeklyXP: 0,
        weekStartDate: monday,
      },
    }
  );
}

/**
 * Reset monthly XP for all players (run on 1st of each month at 00:00 UTC)
 */
export async function resetMonthlyXP() {
  const firstDay = new Date();
  firstDay.setDate(1);
  firstDay.setHours(0, 0, 0, 0);

  await Player.updateMany(
    {},
    {
      $set: {
        monthlyXP: 0,
        monthStartDate: firstDay,
      },
    }
  );
}

/**
 * Check if weekly XP needs to be reset for a player
 */
export function shouldResetWeekly(weekStartDate: Date): boolean {
  const now = new Date();
  const lastMonday = new Date();
  const day = lastMonday.getDay();
  const diff = lastMonday.getDate() - day + (day === 0 ? -6 : 1);
  lastMonday.setDate(diff);
  lastMonday.setHours(0, 0, 0, 0);

  return weekStartDate < lastMonday;
}

/**
 * Check if monthly XP needs to be reset for a player
 */
export function shouldResetMonthly(monthStartDate: Date): boolean {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  return monthStartDate < firstDayOfMonth;
}

/**
 * Get leaderboard data based on type
 */
export async function getLeaderboard(
  type: LeaderboardType,
  currentUserId?: string,
  limit: number = 100
): Promise<LeaderboardResponse> {
  let sortField: string;
  let scoreField: string;

  switch (type) {
    case 'weekly':
      sortField = 'weeklyXP';
      scoreField = 'weeklyXP';
      break;
    case 'monthly':
      sortField = 'monthlyXP';
      scoreField = 'monthlyXP';
      break;
    case 'alltime':
      sortField = 'lifetimeXP';
      scoreField = 'lifetimeXP';
      break;
    case 'streak':
      sortField = 'userStats.currentStreak';
      scoreField = 'userStats.currentStreak';
      break;
    default:
      throw new Error('Invalid leaderboard type');
  }

  // Get top players
  const topPlayers = await Player.find()
    .sort({ [sortField]: -1 })
    .limit(limit)
    .lean();

  // Get total player count
  const totalPlayers = await Player.countDocuments();

  // Get usernames for top players
  const userIds = topPlayers.map(p => new mongoose.Types.ObjectId(p.userId));
  const users = await User.find({ _id: { $in: userIds } }).lean();
  
  // Debug logging
  console.log('🔍 Leaderboard Debug:');
  console.log('Top Players userId values:', topPlayers.map(p => p.userId));
  console.log('Converted ObjectIds:', userIds.map(id => id.toString()));
  console.log('Found users:', users.map(u => ({ id: u._id.toString(), username: u.username })));
  
  const usernameMap = new Map(users.map(u => [u._id.toString(), u.username]));

  // Build leaderboard entries
  const leaderboard: LeaderboardEntry[] = topPlayers.map((player, index) => {
    let score: number;
    if (type === 'weekly') {
      score = player.weeklyXP || 0;
    } else if (type === 'monthly') {
      score = player.monthlyXP || 0;
    } else if (type === 'alltime') {
      score = player.lifetimeXP || 0;
    } else {
      score = player.userStats?.currentStreak || 0;
    }

    return {
      rank: index + 1,
      userId: player.userId,
      username: usernameMap.get(player.userId) || 'Unknown Hunter',
      score,
      level: player.userStats?.level || 1,
      title: player.userStats?.title || 'E-Rank Hunter',
    };
  });

  // Get current user's rank if userId provided
  let userRank: { rank: number; score: number } | null = null;
  if (currentUserId) {
    const currentPlayer = await Player.findOne({ userId: currentUserId }).lean();
    if (currentPlayer) {
      let userScore: number;
      if (type === 'weekly') {
        userScore = currentPlayer.weeklyXP || 0;
      } else if (type === 'monthly') {
        userScore = currentPlayer.monthlyXP || 0;
      } else if (type === 'alltime') {
        userScore = currentPlayer.lifetimeXP || 0;
      } else {
        userScore = currentPlayer.userStats?.currentStreak || 0;
      }

      // Calculate rank by counting players with higher scores
      const rank = await Player.countDocuments({
        [sortField]: { $gt: userScore },
      });

      userRank = {
        rank: rank + 1,
        score: userScore,
      };
    }
  }

  return {
    leaderboard,
    userRank,
    type,
    totalPlayers,
  };
}

/**
 * Update player XP (call this when XP is gained)
 */
export async function updatePlayerXP(userId: string, xpGained: number) {
  const player = await Player.findOne({ userId });
  if (!player) return;

  // Add XP to all trackers
  player.weeklyXP = (player.weeklyXP || 0) + xpGained;
  player.monthlyXP = (player.monthlyXP || 0) + xpGained;
  player.lifetimeXP = (player.lifetimeXP || 0) + xpGained;
  player.userStats.experience = (player.userStats.experience || 0) + xpGained;

  await player.save();
}
