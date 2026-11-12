jest.mock('../../../src/models/student.model', () => ({
  find: jest.fn(),
  findById: jest.fn(),
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

const Student = require('../../../src/models/student.model');
const User = require('../../../src/models/user.model');
const userService = require('../../../src/services/user.service');
const studentService = require('../../../src/services/student.service');

describe('studentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listStudents returns all students', async () => {
    Student.find.mockResolvedValue([{ studentId: 'SV01' }]);

    await expect(studentService.listStudents()).resolves.toEqual([{ studentId: 'SV01' }]);
  });

  test('createStudent creates a linked user account by default', async () => {
    Student.create.mockResolvedValue({ studentId: 'sv001', name: 'Nguyen Van A' });
    User.findOne.mockResolvedValue(null);
    userService.createUser.mockResolvedValue({ username: 'sv001' });

    await expect(
      studentService.createStudent({
        studentId: 'sv001',
        name: 'Nguyen Van A',
        dob: new Date('2004-01-01'),
        gender: 'Nam',
        studentClass: 'CTK46',
        major: 'CNTT',
      }),
    ).resolves.toEqual({ studentId: 'sv001', name: 'Nguyen Van A' });

    expect(Student.create).toHaveBeenCalledWith(
      expect.objectContaining({ studentId: 'sv001', name: 'Nguyen Van A' }),
    );
    expect(User.findOne).toHaveBeenCalledWith({ username: 'sv001' });
    expect(userService.createUser).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'sv001', role: 'student', password: '123456' }),
    );
  });

  test('createStudent skips linked account creation when disabled', async () => {
    Student.create.mockResolvedValue({ studentId: 'sv002', name: 'Tran Thi B' });

    await studentService.createStudent({
      studentId: 'sv002',
      name: 'Tran Thi B',
      dob: new Date('2004-02-01'),
      gender: 'Nu',
      studentClass: 'CTK46',
      major: 'CNTT',
      createUserAccount: false,
    });

    expect(User.findOne).not.toHaveBeenCalled();
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  test('updateStudent forwards payload to model update', async () => {
    Student.findByIdAndUpdate.mockResolvedValue({ studentId: 'sv001', name: 'Updated' });

    await expect(studentService.updateStudent('id-1', { name: 'Updated' })).resolves.toEqual({
      studentId: 'sv001',
      name: 'Updated',
    });

    expect(Student.findByIdAndUpdate).toHaveBeenCalledWith('id-1', { name: 'Updated' }, { new: true });
  });

  test('deleteStudent removes the linked user account', async () => {
    Student.findByIdAndDelete.mockResolvedValue({ studentId: 'sv003' });

    await expect(studentService.deleteStudent('id-2')).resolves.toEqual({ studentId: 'sv003' });

    expect(User.findOneAndDelete).toHaveBeenCalledWith({ username: 'sv003' });
  });
});