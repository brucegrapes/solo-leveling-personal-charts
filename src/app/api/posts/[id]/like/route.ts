import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Post, Player } from '@/models';
import { auth } from '@/lib/auth';
import mongoose from 'mongoose';

// POST - Like a post
export async function POST(
  request: NextRequest,
  context: any,
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

    const { params } = context;
    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Toggle like
    const likeIndex = post.likes.findIndex((id: mongoose.Types.ObjectId) =>
      id.equals(player._id)
    );

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(player._id);
    }

    await post.save();

    return NextResponse.json({
      likes: post.likes.length,
      isLiked: likeIndex === -1,
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
