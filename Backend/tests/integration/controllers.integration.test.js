const express = require('express');
const request = require('supertest');

jest.mock('../../src/services/user.service', () => ({
  authenticateUser: jest.fn(),
  listUsers: jest.fn(),
  getUserById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock('../../src/services/student.service', () => ({
  listStudents: jest.fn(),
  getStudentById: jest.fn(),
  createStudent: jest.fn(),
  updateStudent: jest.fn(),
  deleteStudent: jest.fn(),
}));

jest.mock('../../src/services/teacher.service', () => ({
  listTeachers: jest.fn(),
  getTeacherById: jest.fn(),
  createTeacher: jest.fn(),
  updateTeacher: jest.fn(),
  deleteTeacher: jest.fn(),
}));

jest.mock('../../src/services/notification.service', () => ({
  listNotifications: jest.fn(),
  getPublishedNotifications: jest.fn(),
  getNotificationById: jest.fn(),
  createNotification: jest.fn(),
  updateNotification: jest.fn(),
  deleteNotification: jest.fn(),
}));

jest.mock('../../src/services/activitylog.service', () => ({
  listActivityLogs: jest.fn(),
  getRecentActivityLogs: jest.fn(),
  getActivityLogsByModule: jest.fn(),
  getActivityLogById: jest.fn(),
  createActivityLog: jest.fn(),
}));

jest.mock('../../src/models/category.model', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn(),
  insertMany: jest.fn(),
}));

const userService = require('../../src/services/user.service');
const studentService = require('../../src/services/student.service');
const teacherService = require('../../src/services/teacher.service');
const notificationService = require('../../src/services/notification.service');
const activityLogService = require('../../src/services/activitylog.service');
const Category = require('../../src/models/category.model');

const authRoutes = require('../../src/routes/auth.routes');
const userRoutes = require('../../src/routes/user.routes');
const studentRoutes = require('../../src/routes/student.routes');
const teacherRoutes = require('../../src/routes/teacher.routes');
const notificationRoutes = require('../../src/routes/notification.routes');
const activityLogRoutes = require('../../src/routes/activitylog.routes');
const categoryRoutes = require('../../src/routes/category.routes');

const buildApp = (route, options = {}) => {
  const app = express();
  app.use(express.json());

  if (options.withUser) {
    app.use((req, res, next) => {
      req.user = { _id: 'user-1' };
      next();
    });
  }

  app.use(route);
  return app;
};

describe('controller integration routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('auth routes', () => {
    test('POST /login returns authenticated user', async () => {
      userService.authenticateUser.mockResolvedValue({ username: 'admin', role: 'admin' });
      const app = buildApp(authRoutes);

      await request(app)
        .post('/login')
        .send({ username: 'admin', password: 'admin123' })
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ user: { username: 'admin', role: 'admin' } });
        });
    });

    test('POST /login rejects missing credentials', async () => {
      const app = buildApp(authRoutes);

      await request(app)
        .post('/login')
        .send({ username: 'admin' })
        .expect(400)
        .expect(({ body }) => {
          expect(body.message).toBe('Username and password are required.');
        });
    });
  });

  describe('user routes', () => {
    test('GET / returns user list', async () => {
      userService.listUsers.mockResolvedValue([{ username: 'sv001' }]);
      const app = buildApp(userRoutes);

      await request(app)
        .get('/')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual([{ username: 'sv001' }]);
        });
    });

    test('GET /:id returns a user', async () => {
      userService.getUserById.mockResolvedValue({ username: 'sv001', role: 'student' });
      const app = buildApp(userRoutes);

      await request(app)
        .get('/user-1')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ username: 'sv001', role: 'student' });
        });
    });

    test('POST / creates user', async () => {
      userService.createUser.mockResolvedValue({ username: 'sv002', role: 'student' });
      const app = buildApp(userRoutes);

      await request(app)
        .post('/')
        .send({ username: 'sv002', fullName: 'Tran Thi B', role: 'student' })
        .expect(201)
        .expect(({ body }) => {
          expect(body).toEqual({ username: 'sv002', role: 'student' });
        });
    });

    test('PUT /:id updates a user', async () => {
      userService.updateUser.mockResolvedValue({ username: 'sv002', fullName: 'Tran Thi B' });
      const app = buildApp(userRoutes);

      await request(app)
        .put('/user-2')
        .send({ fullName: 'Tran Thi B' })
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ username: 'sv002', fullName: 'Tran Thi B' });
        });
    });

    test('DELETE /:id removes a user', async () => {
      userService.deleteUser.mockResolvedValue({ username: 'sv003' });
      const app = buildApp(userRoutes);

      await request(app)
        .delete('/user-3')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ message: 'User deleted.' });
        });
    });
  });

  describe('student routes', () => {
    test('GET / returns students list', async () => {
      studentService.listStudents.mockResolvedValue([{ studentId: 'sv001' }]);
      const app = buildApp(studentRoutes);

      await request(app)
        .get('/')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual([{ studentId: 'sv001' }]);
        });
    });

    test('POST / creates student and returns 201', async () => {
      studentService.createStudent.mockResolvedValue({ studentId: 'sv001', name: 'Nguyen Van A' });
      const app = buildApp(studentRoutes);

      await request(app)
        .post('/')
        .send({ studentId: 'sv001', name: 'Nguyen Van A' })
        .expect(201)
        .expect(({ body }) => {
          expect(body).toEqual({ studentId: 'sv001', name: 'Nguyen Van A' });
        });
    });

    test('GET /:id returns a student', async () => {
      studentService.getStudentById.mockResolvedValue({ studentId: 'sv001' });
      const app = buildApp(studentRoutes);

      await request(app)
        .get('/abc123')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ studentId: 'sv001' });
        });
    });

    test('PUT /:id updates a student', async () => {
      studentService.updateStudent.mockResolvedValue({ studentId: 'sv001', name: 'Updated' });
      const app = buildApp(studentRoutes);

      await request(app)
        .put('/abc123')
        .send({ name: 'Updated' })
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ studentId: 'sv001', name: 'Updated' });
        });
    });

    test('DELETE /:id removes a student', async () => {
      studentService.deleteStudent.mockResolvedValue({ studentId: 'sv001' });
      const app = buildApp(studentRoutes);

      await request(app)
        .delete('/abc123')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ message: 'Student deleted.' });
        });
    });
  });

  describe('teacher routes', () => {
    test('GET / returns teachers list', async () => {
      teacherService.listTeachers.mockResolvedValue([{ teacherId: 'GV00001' }]);
      const app = buildApp(teacherRoutes);

      await request(app)
        .get('/')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual([{ teacherId: 'GV00001' }]);
        });
    });

    test('GET /:id returns a teacher', async () => {
      teacherService.getTeacherById.mockResolvedValue({ teacherId: 'GV00001', name: 'Le Van C' });
      const app = buildApp(teacherRoutes);

      await request(app)
        .get('/teacher-1')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ teacherId: 'GV00001', name: 'Le Van C' });
        });
    });

    test('POST / creates teacher and writes activity log', async () => {
      teacherService.createTeacher.mockResolvedValue({ _id: 'teacher-1', name: 'Le Van C' });
      activityLogService.createActivityLog.mockResolvedValue({});
      const app = buildApp(teacherRoutes, { withUser: true });

      await request(app)
        .post('/')
        .send({ teacherId: 'GV00001', name: 'Le Van C' })
        .expect(201)
        .expect(({ body }) => {
          expect(body).toEqual({ _id: 'teacher-1', name: 'Le Van C' });
        });

      expect(activityLogService.createActivityLog).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'CREATE', module: 'teacher', userId: 'user-1', targetId: 'teacher-1' }),
      );
    });

    test('PUT /:id updates teacher and writes activity log', async () => {
      teacherService.updateTeacher.mockResolvedValue({ _id: 'teacher-2', name: 'Updated Teacher' });
      activityLogService.createActivityLog.mockResolvedValue({});
      const app = buildApp(teacherRoutes, { withUser: true });

      await request(app)
        .put('/teacher-2')
        .send({ name: 'Updated Teacher' })
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ _id: 'teacher-2', name: 'Updated Teacher' });
        });

      expect(activityLogService.createActivityLog).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'UPDATE', module: 'teacher', userId: 'user-1', targetId: 'teacher-2' }),
      );
    });

    test('DELETE /:id removes teacher and writes activity log', async () => {
      teacherService.getTeacherById.mockResolvedValue({ _id: 'teacher-3', name: 'To Delete' });
      teacherService.deleteTeacher.mockResolvedValue({ _id: 'teacher-3', name: 'To Delete' });
      activityLogService.createActivityLog.mockResolvedValue({});
      const app = buildApp(teacherRoutes, { withUser: true });

      await request(app)
        .delete('/teacher-3')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ message: 'Teacher deleted.' });
        });

      expect(activityLogService.createActivityLog).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'DELETE', module: 'teacher', userId: 'user-1', targetId: 'teacher-3' }),
      );
    });
  });

  describe('notification routes', () => {
    test('GET / returns notification list', async () => {
      notificationService.listNotifications.mockResolvedValue([{ title: 'Notice' }]);
      const app = buildApp(notificationRoutes);

      await request(app)
        .get('/')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual([{ title: 'Notice' }]);
        });
    });

    test('GET /published returns published notifications', async () => {
      notificationService.getPublishedNotifications.mockResolvedValue([{ title: 'Notice' }]);
      const app = buildApp(notificationRoutes);

      await request(app)
        .get('/published')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual([{ title: 'Notice' }]);
        });
    });

    test('GET /:id returns a notification', async () => {
      notificationService.getNotificationById.mockResolvedValue({ _id: 'notice-1', title: 'Notice' });
      const app = buildApp(notificationRoutes);

      await request(app)
        .get('/notice-1')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ _id: 'notice-1', title: 'Notice' });
        });
    });

    test('POST / creates notification with user context and activity log', async () => {
      notificationService.createNotification.mockResolvedValue({ _id: 'notice-1', title: 'Notice' });
      activityLogService.createActivityLog.mockResolvedValue({});
      const app = buildApp(notificationRoutes, { withUser: true });

      await request(app)
        .post('/')
        .send({ title: 'Notice', content: 'Hello' })
        .expect(201)
        .expect(({ body }) => {
          expect(body).toEqual({ _id: 'notice-1', title: 'Notice' });
        });

      expect(notificationService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Notice', content: 'Hello', createdBy: 'user-1' }),
      );
    });

    test('PUT /:id updates notification and writes activity log', async () => {
      notificationService.updateNotification.mockResolvedValue({ _id: 'notice-2', title: 'Updated' });
      activityLogService.createActivityLog.mockResolvedValue({});
      const app = buildApp(notificationRoutes, { withUser: true });

      await request(app)
        .put('/notice-2')
        .send({ title: 'Updated' })
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ _id: 'notice-2', title: 'Updated' });
        });

      expect(activityLogService.createActivityLog).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'UPDATE', module: 'notification', userId: 'user-1', targetId: 'notice-2' }),
      );
    });

    test('DELETE /:id removes notification and writes activity log', async () => {
      notificationService.getNotificationById.mockResolvedValue({ _id: 'notice-3', title: 'Delete me' });
      notificationService.deleteNotification.mockResolvedValue({ _id: 'notice-3', title: 'Delete me' });
      activityLogService.createActivityLog.mockResolvedValue({});
      const app = buildApp(notificationRoutes, { withUser: true });

      await request(app)
        .delete('/notice-3')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ message: 'Notification deleted.' });
        });

      expect(activityLogService.createActivityLog).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'DELETE', module: 'notification', userId: 'user-1', targetId: 'notice-3' }),
      );
    });
  });

  describe('activity log routes', () => {
    test('GET / returns activity logs', async () => {
      activityLogService.listActivityLogs.mockResolvedValue([{ action: 'CREATE' }]);
      const app = buildApp(activityLogRoutes);

      await request(app)
        .get('/')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual([{ action: 'CREATE' }]);
        });
    });

    test('GET /recent returns recent logs', async () => {
      activityLogService.getRecentActivityLogs.mockResolvedValue([{ action: 'CREATE' }]);
      const app = buildApp(activityLogRoutes);

      await request(app)
        .get('/recent?limit=5')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual([{ action: 'CREATE' }]);
        });

      expect(activityLogService.getRecentActivityLogs).toHaveBeenCalledWith('5');
    });

    test('GET /module/:module returns module logs', async () => {
      activityLogService.getActivityLogsByModule.mockResolvedValue([{ module: 'teacher' }]);
      const app = buildApp(activityLogRoutes);

      await request(app)
        .get('/module/teacher')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual([{ module: 'teacher' }]);
        });

      expect(activityLogService.getActivityLogsByModule).toHaveBeenCalledWith('teacher');
    });

    test('GET /:id returns a log entry', async () => {
      activityLogService.getActivityLogById.mockResolvedValue({ action: 'UPDATE' });
      const app = buildApp(activityLogRoutes);

      await request(app)
        .get('/log-1')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ action: 'UPDATE' });
        });
    });
  });

  describe('category routes', () => {
    test('GET / returns categories through controller', async () => {
      Category.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([{ name: 'CNTT' }]) });
      const app = buildApp(categoryRoutes);

      await request(app)
        .get('/')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual([{ name: 'CNTT' }]);
        });
    });

    test('POST / creates a category', async () => {
      Category.create.mockResolvedValue({ name: 'Khoa CNTT' });
      const app = buildApp(categoryRoutes);

      await request(app)
        .post('/')
        .send({ name: 'Khoa CNTT' })
        .expect(201)
        .expect(({ body }) => {
          expect(body).toEqual({ name: 'Khoa CNTT' });
        });
    });

    test('POST /seed seeds default categories when empty', async () => {
      Category.countDocuments.mockResolvedValue(0);
      Category.insertMany.mockResolvedValue([]);
      const app = buildApp(categoryRoutes);

      await request(app)
        .post('/seed')
        .expect(200)
        .expect(({ body }) => {
          expect(body.message).toBe('Seeded default categories.');
        });

      expect(Category.insertMany).toHaveBeenCalled();
    });

    test('PUT /:id updates a category', async () => {
      Category.findByIdAndUpdate.mockResolvedValue({ name: 'CNTT Updated' });
      const app = buildApp(categoryRoutes);

      await request(app)
        .put('/cat-1')
        .send({ name: 'CNTT Updated' })
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ name: 'CNTT Updated' });
        });
    });

    test('DELETE /:id deletes a category', async () => {
      Category.findByIdAndDelete.mockResolvedValue({ name: 'CNTT' });
      const app = buildApp(categoryRoutes);

      await request(app)
        .delete('/cat-1')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({ message: 'Category deleted successfully.' });
        });
    });

    test('GET /:id returns 404 when category missing', async () => {
      Category.findById.mockResolvedValue(null);
      const app = buildApp(categoryRoutes);

      await request(app)
        .get('/missing-id')
        .expect(404)
        .expect(({ body }) => {
          expect(body.message).toBe('Category not found');
        });
    });
  });
});