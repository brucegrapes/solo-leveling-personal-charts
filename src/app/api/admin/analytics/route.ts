import { NextRequest, NextResponse } from 'next/server';
import { requireSystemDesigner } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Player from '@/models/Player';
import Settings from '@/models/Settings';
import Subscription from '@/models/Subscription';
import { ADMIN_CONFIG } from '@/config/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check if admin is disabled
    if (!ADMIN_CONFIG.ADMIN_ENABLED) {
      return NextResponse.json(
        { error: ADMIN_CONFIG.DISABLED_MESSAGE },
        { status: 503 }
      );
    }

    await requireSystemDesigner();
    await connectDB();

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const systemDesigners = await User.countDocuments({ role: 'System Designer' });
    const players = await User.countDocuments({ role: 'Player' });

    // Get player statistics
    const totalPlayers = await Player.countDocuments();
    const playerStats = await Player.aggregate([
      {
        $group: {
          _id: null,
          avgLevel: { $avg: '$userStats.level' },
          maxLevel: { $max: '$userStats.level' },
          totalExperience: { $sum: '$userStats.experience' },
          totalTasks: { $sum: '$userStats.totalTasks' },
        },
      },
    ]);

    // Get level distribution
    const levelDistribution = await Player.aggregate([
      {
        $group: {
          _id: '$userStats.level',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get active players (updated in last 7 days)
    const activePlayers = await Player.countDocuments({
      updatedAt: { $gte: sevenDaysAgo },
    });

    // Get subscription statistics
    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({
      endpoint: { $exists: true, $ne: '' },
    });

    // Get user growth data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get activity data (tasks completed over time)
    const activityData = await Player.aggregate([
      {
        $match: {
          updatedAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' },
          },
          totalTasks: { $sum: '$userStats.totalTasks' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top players by level
    const topPlayers = await Player.find()
      .sort({ 'userStats.level': -1, 'userStats.experience': -1 })
      .limit(10)
      .lean();

    // Get user IDs for top players
    const userIds = topPlayers.map(p => p.userId);
    const users = await User.find({ _id: { $in: userIds } }).select('username email').lean();
    const userMap = new Map(users.map(u => [u._id.toString(), u]));

    const topPlayersWithUsernames = topPlayers.map(player => ({
      userId: player.userId,
      username: userMap.get(player.userId)?.username || 'Unknown',
      email: userMap.get(player.userId)?.email || '',
      level: player.userStats.level,
      experience: player.userStats.experience,
      totalTasks: player.userStats.totalTasks,
      currentStreak: player.userStats.currentStreak,
      title: player.userStats.title,
    }));

    return NextResponse.json({
      overview: {
        totalUsers,
        systemDesigners,
        players,
        totalPlayers,
        recentUsers,
        activePlayers,
        totalSubscriptions,
        activeSubscriptions,
      },
      playerStats: playerStats[0] || {
        avgLevel: 0,
        maxLevel: 0,
        totalExperience: 0,
        totalTasks: 0,
      },
      levelDistribution,
      userGrowth,
      activityData,
      topPlayers: topPlayersWithUsernames,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch analytics' },
      { status: 403 }
    );
  }
}
