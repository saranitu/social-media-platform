import { useState } from 'react';
import usePostStore from '../store/postStore';
import useAuthStore from '../store/authStore';

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const { createPost } = usePostStore();
  const { user } = useAuthStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const success = await createPost(content, image);
    if (success) {
      setContent('');
      setImage(null);
      setImagePreview('');
      onPostCreated?.();
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <div className="flex gap-4">
        <img
          src={user?.profilePhoto || 'https://via.placeholder.com/50'}
          alt={user?.username}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
            rows="3"
          />
          {imagePreview && (
            <div className="mt-2 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview('');
                }}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
              >
                ✕
              </button>
            </div>
          )}
          <div className="mt-4 flex gap-2 justify-between">
            <label className="cursor-pointer text-blue-600 hover:text-blue-700">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              📷 Add Photo
            </label>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostForm;
