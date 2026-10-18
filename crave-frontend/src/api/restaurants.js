import api from './client';

export const restaurantApi = {
  getAll: async (params = {}) => {
    const res = await api.get('/restaurants', { params });
    return res.data || [];
  },

  getById: async (id) => {
    const res = await api.get(`/restaurants/${id}`);
    return res.data;
  },

  getMyRestaurants: async () => {
    const res = await api.get('/restaurants/my');
    return res.data || [];
  },

  create: async (data) => {
    const res = await api.post('/restaurants', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/restaurants/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/restaurants/${id}`);
    return res;
  }
};
