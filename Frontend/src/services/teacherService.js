import httpClient from './httpClient';

const teacherService = {
  fetchTeachers: async () => {
    const response = await httpClient.get('/teachers');
    return response.data;
  },
  createTeacher: async (payload) => {
    const response = await httpClient.post('/teachers', payload);
    return response.data;
  },
  updateTeacher: async (id, payload) => {
    const response = await httpClient.put(`/teachers/${id}`, payload);
    return response.data;
  },
  deleteTeacher: async (id) => {
    const response = await httpClient.delete(`/teachers/${id}`);
    return response.data;
  },
};

export default teacherService;
