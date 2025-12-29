import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { auth } from '@/lib/auth';
import { DEFAULT_ACTIVITIES } from '@/types';

// GET: Fetch user's configuration
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const userConfig = await db.collection('userConfig').findOne({
      userId: session.user.id
    });

    return NextResponse.json({
      config: userConfig?.config || {
        activities: DEFAULT_ACTIVITIES,
        customized: false,
      }
    });
  } catch (error) {
    console.error('Fetch config error:', error);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

// POST: Save user's configuration
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await req.json();

    const db = await getDatabase();
    await db.collection('userConfig').updateOne(
      { userId: session.user.id },
      {
        $set: {
          config,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save config error:', error);
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
}
