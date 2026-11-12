jest.mock('../../../src/models/user.model', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  updateOne: jest.fn(),
}));

jest.mock('../../../src/models/student.model', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findOneAndDelete: jest.fn(),
}));

jest.mock('../../../src/models/teacher.model', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  countDocuments: jest.fn(),
  findOneAndDelete: jest.fn(),
}));

const User = require('../../../src/models/user.model');
const Student = require('../../../src/models/student.model');
const Teacher = require('../../../src/models/teacher.model');
const userService = require('../../../src/services/user.service');

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('hashPassword and verifyPassword work together', () => {
    const { salt, hash } = userService.hashPassword('secret', 'fixedsaltfixedsalt');

    expect(salt).toBe('fixedsaltfixedsalt');
    expect(userService.verifyPassword('secret', salt, hash)).toBe(true);
    expect(userService.verifyPassword('wrong', salt, hash)).toBe(false);
  });

  test('createUser defaults role to student and creates student profile', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: 'user-1',
      username: 'sv001',
      fullName: 'Nguyen Van A',
      role: 'student',
      status: 'active',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    });
    Student.findOne.mockResolvedValue(null);
    Student.create.mockResolvedValue({ studentId: 'sv001' });

    await expect(
      userService.createUser({
        username: 'SV001',
        fullName: 'Nguyen Van A',
        password: '123456',
      }),
    ).resolves.toEqual(
      expect.objectContaining({ username: 'sv001', role: 'student', status: 'active' }),
    );

    expect(User.findOne).toHaveBeenCalledWith({ username: 'sv001' });
    expect(Student.create).toHaveBeenCalledWith(
      expect.objectContaining({ studentId: 'sv001', name: 'Nguyen Van A' }),
    );
  });

  test('createUser creates teacher profile when role is teacher', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: 'user-2',
      username: 'gv001',
      fullName: 'Le Van B',
      role: 'teacher',
      status: 'active',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    });
    Teacher.findOne.mockResolvedValue(null);
    Teacher.countDocuments.mockResolvedValue(7);
    Teacher.create.mockResolvedValue({ teacherId: 'GV00008' });

    await userService.createUser({
      username: 'gv001',
      fullName: 'Le Van B',
      role: 'teacher',
      password: '123456',
    });

    expect(Teacher.countDocuments).toHaveBeenCalled();
    expect(Teacher.create).toHaveBeenCalledWith(
      expect.objectContaining({ teacherId: 'GV00008', email: 'gv001@school.edu.vn' }),
    );
  });

  test('createUser rejects duplicate username', async () => {
    User.findOne.mockResolvedValue({ username: 'sv001' });

    await expect(
      userService.createUser({
        username: 'sv001',
        fullName: 'Nguyen Van A',
        password: '123456',
      }),
    ).rejects.toThrow('Username already exists');
  });

  test('updateUser returns public user and hashes password when provided', async () => {
    User.findByIdAndUpdate.mockResolvedValue({
      _id: 'user-1',
      username: 'sv001',
      fullName: 'Nguyen Van A',
      role: 'student',
      status: 'active',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-02',
    });

    await expect(
      userService.updateUser('user-1', {
        username: 'SV001',
        fullName: 'Nguyen Van A',
        role: 'student',
        status: 'active',
        password: 'newpass',
      }),
    ).resolves.toEqual(
      expect.objectContaining({ username: 'sv001', fullName: 'Nguyen Van A', role: 'student' }),
    );

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        username: 'sv001',
        fullName: 'Nguyen Van A',
        role: 'student',
        status: 'active',
        passwordSalt: expect.any(String),
        passwordHash: expect.any(String),
      }),
      { new: true, runValidators: true },
    );
  });

  test('deleteUser removes the linked student profile', async () => {
    User.findByIdAndDelete.mockResolvedValue({
      _id: 'user-1',
      username: 'sv001',
      fullName: 'Nguyen Van A',
      role: 'student',
      status: 'active',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    });

    await expect(userService.deleteUser('user-1')).resolves.toEqual(
      expect.objectContaining({ username: 'sv001', role: 'student' }),
    );

    expect(Student.findOneAndDelete).toHaveBeenCalledWith({ studentId: 'sv001' });
  });

  test('authenticateUser handles success, missing account, locked account and wrong password', async () => {
    const passwordSalt = 'fixedsaltfixedsalt';
    const passwordHash = userService.hashPassword('123456', passwordSalt).hash;

    User.findOne.mockResolvedValue({
      _id: 'user-1',
      username: 'sv001',
      fullName: 'Nguyen Van A',
      role: 'student',
      status: 'active',
      passwordSalt,
      passwordHash,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    });

    await expect(userService.authenticateUser('SV001', '123456')).resolves.toEqual(
      expect.objectContaining({ username: 'sv001' }),
    );

    User.findOne.mockResolvedValueOnce(null);
    await expect(userService.authenticateUser('missing', '123456')).rejects.toMatchObject({
      code: 'ACCOUNT_NOT_FOUND',
    });

    User.findOne.mockResolvedValueOnce({
      status: 'locked',
      passwordSalt,
      passwordHash,
    });
    await expect(userService.authenticateUser('locked', '123456')).rejects.toMatchObject({
      code: 'ACCOUNT_LOCKED',
    });

    User.findOne.mockResolvedValueOnce({
      _id: 'user-2',
      username: 'sv002',
      fullName: 'Tran Thi B',
      role: 'student',
      status: 'active',
      passwordSalt,
      passwordHash,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    });
    await expect(userService.authenticateUser('sv002', 'wrong')).rejects.toMatchObject({
      code: 'INVALID_PASSWORD',
    });
  });

  test('listUsers sorts and maps public fields', async () => {
    User.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        {
          _id: 'user-1',
          username: 'sv001',
          fullName: 'Nguyen Van A',
          role: 'student',
          status: 'active',
          passwordSalt: 'salt',
          passwordHash: 'hash',
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ]),
    });

    await expect(userService.listUsers()).resolves.toEqual([
      expect.objectContaining({ username: 'sv001', fullName: 'Nguyen Van A' }),
    ]);
  });
});