import { useEffect } from 'react';
import usePostStore from '../store/postStore';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

const HomePage = () => {
  const { posts, loading, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = () => {
    fetchPosts();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <PostForm onPostCreated={handlePostCreated} />

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
