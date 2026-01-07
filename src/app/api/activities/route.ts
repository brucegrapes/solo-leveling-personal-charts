import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Player } from '@/models';
import { auth } from '@/lib/auth';

// GET: Fetch user's activity data
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const playerData = await Player.findOne({ userId: session.user.id });

    return NextResponse.json({
      activityData: playerData?.activityData || {},
      userStats: playerData?.userStats || {
        level: 1,
        experience: 0,
        totalTasks: 0,
        currentStreak: 0,
        title: 'E-Rank Hunter',
      }
    });
  } catch (error) {
    console.error('Fetch data error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// POST: Save user's activity data
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { activityData, userStats } = await req.json();

    await connectDB();
    
    console.log('🎮 Activities POST - session.user.id:', session.user.id);
    console.log('🎮 Activities POST - session.user.name:', session.user.name);
    
    // Get existing player data to calculate XP difference
    const existingPlayer = await Player.findOne({ userId: session.user.id });
    console.log('🎮 Found existing player:', existingPlayer ? 'YES' : 'NO', existingPlayer?.userId);
    const oldXP = existingPlayer?.userStats?.experience || 0;
    const newXP = userStats?.experience || 0;
    const xpGained = newXP - oldXP;

    // Update player data
    const updatedPlayer = await Player.findOneAndUpdate(
      { userId: session.user.id },
      {
        activityData,
        userStats,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Update leaderboard XP tracking if XP was gained
    if (xpGained > 0 && updatedPlayer) {
      // Add XP to weekly, monthly, and lifetime trackers
      updatedPlayer.weeklyXP = (updatedPlayer.weeklyXP || 0) + xpGained;
      updatedPlayer.monthlyXP = (updatedPlayer.monthlyXP || 0) + xpGained;
      updatedPlayer.lifetimeXP = (updatedPlayer.lifetimeXP || 0) + xpGained;
      
      await updatedPlayer.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save data error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
