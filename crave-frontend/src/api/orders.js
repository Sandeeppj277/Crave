import api from './client';

export const orderApi = {
  placeOrder: async (orderData) => {
    const res = await api.post('/orders', orderData);
    return res.data;
  },

  getMyOrders: async () => {
    const res = await api.get('/orders/my');
    return res.data || [];
  },

  getAllOrders: async () => {
    const res = await api.get('/orders');
    return res.data || [];
  },

  updateStatus: async (orderId, status) => {
    const res = await api.patch(`/orders/${orderId}/status`, null, {
      params: { status }
    });
    return res.data;
  }
};
