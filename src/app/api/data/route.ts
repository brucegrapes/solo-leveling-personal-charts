import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { auth } from '@/lib/auth';

// GET: Fetch user's activity data
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const userData = await db.collection('userData').findOne({
      userId: session.user.id
    });

    return NextResponse.json({
      activityData: userData?.activityData || {},
      userStats: userData?.userStats || {
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

    const db = await getDatabase();
    await db.collection('userData').updateOne(
      { userId: session.user.id },
      {
        $set: {
          activityData,
          userStats,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save data error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
