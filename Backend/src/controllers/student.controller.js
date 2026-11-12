const studentService = require('../services/student.service');

const studentController = {
  list: async (req, res) => {
    try {
      const students = await studentService.listStudents();
      res.json(students);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  create: async (req, res) => {
    try {
      const student = await studentService.createStudent(req.body);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  update: async (req, res) => {
    try {
      const student = await studentService.updateStudent(req.params.id, req.body);
      res.json(student);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  remove: async (req, res) => {
    try {
      await studentService.deleteStudent(req.params.id);
      res.json({ message: 'Student deleted.' });
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const student = await studentService.getStudentById(req.params.id);
      res.json(student);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
};

module.exports = studentController;