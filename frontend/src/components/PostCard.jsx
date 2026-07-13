import { useState } from 'react';
import usePostStore from '../store/postStore';
import useAuthStore from '../store/authStore';
import CommentSection from './CommentSection';

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImage, setEditedImage] = useState(post.image);
  const { updatePost, deletePost, likePost, unlikePost } = usePostStore();
  const { user } = useAuthStore();
  const isAuthor = user?.id === post.author._id || user?._id === post.author._id;
  const isLiked = post.likes?.some(
    (like) => like === user?.id || like === user?._id || like._id === user?._id
  );

  const handleLike = async () => {
    if (isLiked) {
      await unlikePost(post._id);
    } else {
      await likePost(post._id);
    }
  };

  const handleUpdate = async () => {
    await updatePost(post._id, editedContent, editedImage);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(post._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Author Info */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author.profilePhoto || 'https://via.placeholder.com/50'}
            alt={post.author.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-bold">{post.author.username}</p>
            <p className="text-xs text-gray-500">Code: {post.author.uniqueCode}</p>
          </div>
        </div>
        {isAuthor && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div className="space-y-2 mb-4">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows="3"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-800 mb-4">{post.content}</p>
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="w-full max-h-96 object-cover rounded-lg mb-4"
            />
          )}
          {post.isEdited && (
            <p className="text-xs text-gray-500 mb-2">Edited at {new Date(post.editedAt).toLocaleString()}</p>
          )}
        </>
      )}

      {/* Interactions */}
      <div className="flex gap-4 border-t pt-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isLiked
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isLiked ? '❤️' : '🤍'} {post.likes?.length || 0}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
        >
          💬 {post.comments?.length || 0}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && <CommentSection postId={post._id} />}
    </div>
  );
};

export default PostCard;
