import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const usePostStore = create((set) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/posts`);
      set({ posts: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createPost: async (content, image) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/posts`,
        { content, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        posts: [response.data, ...state.posts],
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to create post' });
      return false;
    }
  },

  updatePost: async (postId, content, image) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/posts/${postId}`,
        { content, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        posts: state.posts.map((p) => (p._id === postId ? response.data : p)),
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to update post' });
      return false;
    }
  },

  deletePost: async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        posts: state.posts.filter((p) => p._id !== postId),
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to delete post' });
      return false;
    }
  },

  likePost: async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        posts: state.posts.map((p) => (p._id === postId ? response.data : p)),
      }));
      return true;
    } catch (error) {
      return false;
    }
  },

  unlikePost: async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/posts/${postId}/unlike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        posts: state.posts.map((p) => (p._id === postId ? response.data : p)),
      }));
      return true;
    } catch (error) {
      return false;
    }
  },
}));

export default usePostStore;
