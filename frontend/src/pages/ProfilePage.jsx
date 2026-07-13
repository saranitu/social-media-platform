import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import usePostStore from '../store/postStore';
import ProfileCard from '../components/ProfileCard';
import PostCard from '../components/PostCard';

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuthStore();
  const { posts, loading: postsLoading, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (authLoading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  const userPosts = posts.filter(
    (post) => post.author._id === user?.id || post.author._id === user?._id
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ProfileCard profile={user} />

      <h2 className="text-2xl font-bold mb-6">Your Posts</h2>

      {postsLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading posts...</p>
        </div>
      ) : userPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">You haven't posted anything yet.</p>
        </div>
      ) : (
        <div>
          {userPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
