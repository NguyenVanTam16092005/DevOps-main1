import httpClient from '../../../services/httpClient';

const studentService = {
  fetchStudents: async () => {
    const response = await httpClient.get('/students');
    return response.data;
  },
  createStudent: async (payload) => {
    const response = await httpClient.post('/students', payload);
    return response.data;
  },
  updateStudent: async (studentId, payload) => {
    const response = await httpClient.put(`/students/${studentId}`, payload);
    return response.data;
  },
  deleteStudent: async (studentId) => {
    const response = await httpClient.delete(`/students/${studentId}`);
    return response.data;
  },
};

export default studentService;