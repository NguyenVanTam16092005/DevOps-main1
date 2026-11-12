jest.mock('../../../src/models/teacher.model', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

jest.mock('../../../src/models/user.model', () => ({
  findOne: jest.fn(),
  findOneAndDelete: jest.fn(),
}));

jest.mock('../../../src/services/user.service', () => ({
  createUser: jest.fn(),
}));

const Teacher = require('../../../src/models/teacher.model');
const User = require('../../../src/models/user.model');
const userService = require('../../../src/services/user.service');
const teacherService = require('../../../src/services/teacher.service');

describe('teacherService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listTeachers returns all teachers', async () => {
    Teacher.find.mockResolvedValue([{ teacherId: 'GV01' }]);

    await expect(teacherService.listTeachers()).resolves.toEqual([{ teacherId: 'GV01' }]);
  });

  test('createTeacher creates a linked user account by default', async () => {
    Teacher.create.mockResolvedValue({ teacherId: 'GV00001', email: 'gv001@school.edu.vn', name: 'Le Van C' });
    User.findOne.mockResolvedValue(null);
    userService.createUser.mockResolvedValue({ username: 'gv001' });

    await expect(
      teacherService.createTeacher({
        teacherId: 'GV00001',
        name: 'Le Van C',
        dob: new Date('1985-01-01'),
        gender: 'Nam',
        department: 'CNTT',
        email: 'gv001@school.edu.vn',
      }),
    ).resolves.toEqual({ teacherId: 'GV00001', email: 'gv001@school.edu.vn', name: 'Le Van C' });

    expect(User.findOne).toHaveBeenCalledWith({ username: 'gv001' });
    expect(userService.createUser).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'gv001', role: 'teacher', password: '123456' }),
    );
  });

  test('createTeacher skips linked account creation when disabled', async () => {
    Teacher.create.mockResolvedValue({ teacherId: 'GV00002', email: 'gv002@school.edu.vn' });

    await teacherService.createTeacher({
      teacherId: 'GV00002',
      name: 'Pham Thi D',
      dob: new Date('1984-01-01'),
      gender: 'Nu',
      department: 'CNTT',
      email: 'gv002@school.edu.vn',
      createUserAccount: false,
    });

    expect(User.findOne).not.toHaveBeenCalled();
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  test('deleteTeacher removes the linked user account', async () => {
    Teacher.findByIdAndDelete.mockResolvedValue({ teacherId: 'GV00003', email: 'gv003@school.edu.vn' });

    await expect(teacherService.deleteTeacher('id-3')).resolves.toEqual({
      teacherId: 'GV00003',
      email: 'gv003@school.edu.vn',
    });

    expect(User.findOneAndDelete).toHaveBeenCalledWith({ username: 'gv003' });
  });
});