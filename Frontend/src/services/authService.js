import httpClient from './httpClient';

const authService = {
  login: async ({ username, password }) => {
    try {
      const response = await httpClient.post('/auth/login', { username, password });
      return response.data.user;
    } catch (error) {
      const message = error?.response?.data?.message || 'Không thể đăng nhập.';
      const wrappedError = new Error(message);
      wrappedError.code = error?.response?.data?.code || error.code;
      throw wrappedError;
    }
  },
};

export default authService;
