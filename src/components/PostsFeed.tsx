'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  _id: string;
  userId: string;
  username: string;
  userLevel: number;
  userTitle: string;
  content?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  likes: string[];
  comments: Array<{
    userId: string;
    username: string;
    content: string;
    createdAt: string;
  }>;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
  currentUserId?: string;
}

function PostCard({ post, onDelete, currentUserId }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [auraPoints, setAuraPoints] = useState(post.likes?.length || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = currentUserId === post.userId;

  const handleAura = async () => {
    try {
      const res = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.isLiked);
        setAuraPoints(data.likes);
      }
    } catch (error) {
      console.error('Failed to add aura:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${post._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
      });

      if (res.ok) {
        setCommentText('');
        // Refresh comments
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/posts?id=${post._id}`, {
        method: 'DELETE',
      });

      if (res.ok && onDelete) {
        onDelete(post._id);
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <div className="bg-gray-800 border border-purple-500/30 rounded-lg overflow-hidden mb-4">
      {/* Header */}
      <div className="p-4 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{post.username}</span>
            <span className="text-xs px-2 py-1 bg-purple-600/30 rounded-full">
              Lv.{post.userLevel}
            </span>
          </div>
          <p className="text-sm text-gray-400">{post.userTitle}</p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Delete
          </button>
        )}
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-gray-200">{post.content}</p>
        </div>
      )}

      {/* Media */}
      <div className="bg-gray-900">
        {post.mediaType === 'image' ? (
          <img
            src={post.mediaUrl}
            alt="Post media"
            className="w-full max-h-[600px] object-contain"
          />
        ) : (
          <video
            src={post.mediaUrl}
            controls
            className="w-full max-h-[600px]"
          />
        )}
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex gap-4">
          <button
            onClick={handleAura}
            className={`flex items-center gap-2 ${
              isLiked ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'
            } transition-colors`}
            title="Give Aura"
          >
            <span className="text-xl">🔥</span>
            <span className="text-sm font-medium">{auraPoints} Aura</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <span className="text-xl">💬</span>
            <span>{post.comments?.length || 0}</span>
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="space-y-3 pt-3 border-t border-gray-700">
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {post.comments.map((comment, idx) => (
                  <div key={idx} className="bg-gray-700/50 rounded p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {comment.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add comment */}
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                maxLength={500}
                disabled={isSubmitting}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmitting}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-semibold"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PostsFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  const loadPosts = async (append = false) => {
    try {
      const res = await fetch(`/api/posts?limit=10&skip=${append ? skip : 0}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(append ? [...posts, ...data.posts] : data.posts);
        setHasMore(data.hasMore);
        setSkip(append ? skip + 10 : 10);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    // TODO: Fetch current user ID from session
  }, []);

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  const handleLoadMore = () => {
    loadPosts(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div>
      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl mb-2">No posts yet</p>
          <p className="text-sm">Be the first to share your achievements!</p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              onDelete={handlePostDeleted}
            />
          ))}

          {hasMore && (
            <button
              onClick={handleLoadMore}
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              Load More
            </button>
          )}
        </>
      )}
    </div>
  );
}
