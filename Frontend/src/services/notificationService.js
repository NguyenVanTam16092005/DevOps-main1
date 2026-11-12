import httpClient from './httpClient';

const notificationService = {
  fetchNotifications: async () => {
    const response = await httpClient.get('/notifications');
    return response.data;
  },
  createNotification: async (payload) => {
    const response = await httpClient.post('/notifications', payload);
    return response.data;
  },
  deleteNotification: async (id) => {
    const response = await httpClient.delete(`/notifications/${id}`);
    return response.data;
  },
};

export default notificationService;
