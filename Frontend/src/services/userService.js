import httpClient from './httpClient';

const userService = {
  fetchUsers: async () => {
    const response = await httpClient.get('/users');
    return response.data;
  },
  createUser: async (payload) => {
    const response = await httpClient.post('/users', payload);
    return response.data;
  },
  updateUser: async (id, payload) => {
    const response = await httpClient.put(`/users/${id}`, payload);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await httpClient.delete(`/users/${id}`);
    return response.data;
  },
};

export default userService;
