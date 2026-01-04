import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/models';
import { UserRole } from '@/models/User';
import { requireSystemDesigner } from '@/lib/auth-helpers';

// GET all users with their roles
export async function GET(req: NextRequest) {
  try {
    await requireSystemDesigner();
    await connectDB();

    const users = await User.find({}, 'username email role createdAt').sort({ createdAt: -1 });
    
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Get users error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch users';
    return NextResponse.json({ error: message }, { status: error instanceof Error && error.message.includes('Unauthorized') ? 403 : 500 });
  }
}

// PUT update user role
export async function PUT(req: NextRequest) {
  try {
    await requireSystemDesigner();
    await connectDB();

    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 });
    }

    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Role updated successfully', user }, { status: 200 });
  } catch (error) {
    console.error('Update role error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update role';
    return NextResponse.json({ error: message }, { status: error instanceof Error && error.message.includes('Unauthorized') ? 403 : 500 });
  }
}
