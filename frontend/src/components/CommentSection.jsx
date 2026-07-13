import { useState, useEffect } from 'react';
import useCommentStore from '../store/commentStore';
import useAuthStore from '../store/authStore';

const CommentSection = ({ postId }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const { addComment, updateComment, deleteComment, likeComment, addEmoji } =
    useCommentStore();
  const { user } = useAuthStore();
  const emojis = ['😀', '😂', '😍', '😮', '😢', '😡', '👍', '🎉'];

  useEffect(() => {
    // Comments would typically be fetched from the post
  }, []);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const comment = await addComment(postId, newComment);
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment');
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const updated = await updateComment(commentId, editingText);
      setComments(
        comments.map((c) => (c._id === commentId ? updated : c))
      );
      setEditingId(null);
      setEditingText('');
    } catch (error) {
      console.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId, postId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const updated = await likeComment(commentId);
      setComments(
        comments.map((c) => (c._id === commentId ? updated : c))
      );
    } catch (error) {
      console.error('Failed to like comment');
    }
  };

  const handleAddEmoji = async (commentId, emoji) => {
    try {
      const updated = await addEmoji(commentId, emoji);
      setComments(
        comments.map((c) => (c._id === commentId ? updated : c))
      );
      setSelectedEmoji(null);
    } catch (error) {
      console.error('Failed to add emoji');
    }
  };

  return (
    <div className="mt-6 pt-4 border-t">
      <h4 className="font-bold mb-4">Comments</h4>

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm">{comment.author?.username}</p>
                {editingId === comment._id ? (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-1 p-1 border border-gray-300 rounded text-sm"
                    />
                    <button
                      onClick={() => handleUpdateComment(comment._id)}
                      className="text-green-600 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-600 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">{comment.text}</p>
                )}
              </div>
              {user?._id === comment.author?._id && !editingId && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(comment._id);
                      setEditingText(comment.text);
                    }}
                    className="text-blue-600 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-600 text-xs"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Emojis and Likes */}
            <div className="flex gap-2 mt-2 flex-wrap">
              <button
                onClick={() => handleLikeComment(comment._id)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                👍 Like
              </button>
              <div className="relative">
                <button
                  onClick={() => setSelectedEmoji(selectedEmoji ? null : comment._id)}
                  className="text-xs text-gray-600 hover:text-gray-700"
                >
                  😊 Emoji
                </button>
                {selectedEmoji === comment._id && (
                  <div className="absolute bg-white border border-gray-300 rounded-lg p-2 flex gap-1 top-full left-0 z-10">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddEmoji(comment._id, emoji)}
                        className="text-lg hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {comment.emojis?.map((e) => (
                <span key={e.emoji} className="text-xs">
                  {e.emoji} {e.users?.length}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
