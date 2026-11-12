import httpClient from './httpClient';

const logService = {
  fetchLogs: async () => {
    const response = await httpClient.get('/logs');
    return response.data;
  },
  createLog: async (payload) => {
    const response = await httpClient.post('/logs', payload);
    return response.data;
  },
};

export default logService;
