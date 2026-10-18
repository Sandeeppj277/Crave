import api from './client';

export const menuItemApi = {
  getByRestaurant: async (restaurantId, params = {}) => {
    const res = await api.get(`/menu-items/restaurant/${restaurantId}`, { params });
    return res.data || [];
  },

  getById: async (id) => {
    const res = await api.get(`/menu-items/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post('/menu-items', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/menu-items/${id}`, data);
    return res.data;
  },

  toggleAvailability: async (id) => {
    const res = await api.patch(`/menu-items/${id}/toggle-availability`);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/menu-items/${id}`);
    return res;
  }
};
