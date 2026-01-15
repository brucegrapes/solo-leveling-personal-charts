import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Post, Player } from '@/models';
import { auth } from '@/lib/auth';

// POST - Add a comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const player = await Player.findOne({ userId: session.user.id });
    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const { content } = await request.json();
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content required' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Comment exceeds 500 character limit' },
        { status: 400 }
      );
    }

    const comment = {
      userId: player._id,
      username: session.user.name || 'Anonymous Hunter',
      content: content.trim(),
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}

// GET - Get comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const post = await Post.findById(params.id).select('comments').lean();
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post.comments || []);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
