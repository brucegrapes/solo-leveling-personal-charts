import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'
import { Post, Player } from '@/models';
import { auth } from '@/lib/auth';
import mongoose from 'mongoose';

const DAILY_POST_LIMIT = 15;

// GET all posts or user-specific posts
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');

    const query = userId ? { userId: new mongoose.Types.ObjectId(userId) } : {};

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(query);

    return NextResponse.json({
      posts,
      total,
      hasMore: skip + limit < total,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST create a new post
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find the player/user
    const player = await Player.findOne({ userId: session.user.id });
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Check daily post limit
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const todayPostCount = await Post.countDocuments({
      userId: player._id,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    if (todayPostCount >= DAILY_POST_LIMIT) {
      return NextResponse.json(
        { error: `Daily post limit reached (${DAILY_POST_LIMIT} posts per day)` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { content, mediaUrl, mediaType, fileSize, mimeType } = body;

    // Validate required fields
    if (!mediaUrl || !mediaType || !fileSize || !mimeType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file size (20MB)
    if (fileSize > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 20MB limit' },
        { status: 400 }
      );
    }

    // Create the post
    const post = await Post.create({
      userId: player._id,
      username: session.user.name || 'Anonymous Hunter',
      userLevel: player.userStats?.level || 1,
      userTitle: player.userStats?.title || 'E-Rank Hunter',
      content: content?.trim() || '',
      mediaUrl,
      mediaType,
      fileSize,
      mimeType,
      likes: [],
      comments: [],
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// DELETE a post
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID required' },
        { status: 400 }
      );
    }

    // Find the player
    const player = await Player.findOne({ userId: session.user.id });
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user owns the post
    if (!post.userId.equals(player._id)) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own posts' },
        { status: 403 }
      );
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    // TODO: Delete the associated file from the filesystem
    // This would require importing fs and deleting the file at post.mediaUrl

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
