const teacherService = require('../services/teacher.service');
const activityLogService = require('../services/activitylog.service');

const teacherController = {
  list: async (req, res) => {
    try {
      const teachers = await teacherService.listTeachers();
      res.json(teachers);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  create: async (req, res) => {
    try {
      const teacher = await teacherService.createTeacher(req.body);
      await activityLogService.createActivityLog({
        action: 'CREATE',
        module: 'teacher',
        description: `Created teacher: ${teacher.name}`,
        userId: req.user?._id,
        targetId: teacher._id,
      });
      res.status(201).json(teacher);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  update: async (req, res) => {
    try {
      const teacher = await teacherService.updateTeacher(req.params.id, req.body);
      await activityLogService.createActivityLog({
        action: 'UPDATE',
        module: 'teacher',
        description: `Updated teacher: ${teacher.name}`,
        userId: req.user?._id,
        targetId: teacher._id,
      });
      res.json(teacher);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  remove: async (req, res) => {
    try {
      const teacher = await teacherService.getTeacherById(req.params.id);
      await teacherService.deleteTeacher(req.params.id);
      await activityLogService.createActivityLog({
        action: 'DELETE',
        module: 'teacher',
        description: `Deleted teacher: ${teacher?.name}`,
        userId: req.user?._id,
        targetId: req.params.id,
      });
      res.json({ message: 'Teacher deleted.' });
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const teacher = await teacherService.getTeacherById(req.params.id);
      res.json(teacher);
    } catch (error) {
      res.status(400).json({ message: 'Error: ' + error.message });
    }
  },
};

module.exports = teacherController;
