'use client';

import CreatePost from '@/components/CreatePost';
import PostsFeed from '@/components/PostsFeed';

export default function PostsPage() {
  const handlePostCreated = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Community Posts
          </h1>
          <p className="text-gray-400">
            Share your achievements and see what other hunters are up to
          </p>
        </div>

        {/* Posts feed */}
        <PostsFeed />
        
        {/* Create post section */}
        <CreatePost onPostCreated={handlePostCreated} />
      </div>
    </div>
  );
}
