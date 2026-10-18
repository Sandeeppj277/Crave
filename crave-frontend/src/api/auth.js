import api from './client';

export const authApi = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.token) {
      localStorage.setItem('crave_token', res.data.token);
      localStorage.setItem('crave_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data?.token) {
      localStorage.setItem('crave_token', res.data.token);
      localStorage.setItem('crave_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('crave_token');
    localStorage.removeItem('crave_user');
  },

  getSavedUser: () => {
    try {
      const user = localStorage.getItem('crave_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
};
