import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  checkAuth: async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      set({ token: storedToken, isAuthenticated: true });
      try {
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        set({ user: response.data });
      } catch (error) {
        localStorage.removeItem('token');
        set({ token: null, isAuthenticated: false });
      }
    }
  },

  signup: async (username, email, password, confirmPassword) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        username,
        email,
        password,
        confirmPassword,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ token, user, isAuthenticated: true, loading: false });
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Signup failed';
      set({ error: message, loading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ token, user, isAuthenticated: true, loading: false });
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      set({ error: message, loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/users/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: response.data.user });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Update failed' });
      return false;
    }
  },
}));

export default useAuthStore;
