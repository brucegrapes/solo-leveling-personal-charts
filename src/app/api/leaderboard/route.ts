import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { getLeaderboard, LeaderboardType } from '@/lib/leaderboard';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const searchParams = req.nextUrl.searchParams;
    const type = (searchParams.get('type') || 'alltime') as LeaderboardType;
    const limit = parseInt(searchParams.get('limit') || '100');

    if (!['weekly', 'monthly', 'alltime', 'streak'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid leaderboard type. Must be: weekly, monthly, alltime, or streak' },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 500) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 500' },
        { status: 400 }
      );
    }

    await connectDB();

    const userId = session?.user?.id;
    const leaderboardData = await getLeaderboard(type, userId, limit);

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
