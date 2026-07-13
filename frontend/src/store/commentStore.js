import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const useCommentStore = create((set) => ({
  comments: {},
  loading: false,
  error: null,

  addComment: async (postId, text) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/comments/${postId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: [...(state.comments[postId] || []), response.data],
        },
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to add comment' });
      throw error;
    }
  },

  updateComment: async (commentId, text) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/comments/${commentId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to update comment' });
      throw error;
    }
  },

  deleteComment: async (commentId, postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: state.comments[postId].filter((c) => c._id !== commentId),
        },
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to delete comment' });
      throw error;
    }
  },

  likeComment: async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/comments/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return null;
    }
  },

  addEmoji: async (commentId, emoji) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/comments/${commentId}/emoji`,
        { emoji },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return null;
    }
  },
}));

export default useCommentStore;
