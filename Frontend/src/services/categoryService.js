import httpClient from './httpClient';

const categoryService = {
  fetchCategories: async () => {
    const response = await httpClient.get('/categories');
    return response.data;
  },
  getCategoryById: async (id) => {
    const response = await httpClient.get(`/categories/${id}`);
    return response.data;
  },
  createCategory: async (payload) => {
    const response = await httpClient.post('/categories', payload);
    return response.data;
  },
  updateCategory: async (id, payload) => {
    const response = await httpClient.put(`/categories/${id}`, payload);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await httpClient.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;
