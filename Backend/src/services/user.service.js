const crypto = require('crypto');
const User = require('../models/user.model');

const DERIVE_KEY_LENGTH = 64;

const defaultUsers = [
  { username: 'student01', fullName: 'Nguyễn Văn An', role: 'student', password: '123456', status: 'active' },
  { username: 'teacher01', fullName: 'Trần Thị Mai', role: 'teacher', password: '123456', status: 'active' },
  { username: 'admin', fullName: 'Quản trị viên hệ thống', role: 'admin', password: 'admin123', status: 'active' },
  { username: 'locked_student', fullName: 'Học sinh bị khóa', role: 'student', password: '123456', status: 'locked' },
];

const toPublicUser = (user) => ({
  _id: user._id,
  username: user.username,
  fullName: user.fullName,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.scryptSync(password, salt, DERIVE_KEY_LENGTH, { N: 16384, r: 8, p: 1 }).toString('hex');
  return { salt, hash };
};

const verifyPassword = (password, salt, expectedHash) => {
  const actualHash = crypto.scryptSync(password, salt, DERIVE_KEY_LENGTH, { N: 16384, r: 8, p: 1 });
  const expectedBuffer = Buffer.from(expectedHash, 'hex');

  if (expectedBuffer.length !== actualHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(actualHash, expectedBuffer);
};

const normalizeUserPayload = (payload = {}) => ({
  username: String(payload.username || '').trim().toLowerCase(),
  fullName: String(payload.fullName || '').trim(),
  role: payload.role,
  status: payload.status || 'active',
  password: payload.password || '',
});

const buildPasswordFields = (password, existingSalt) => {
  const { salt, hash } = hashPassword(password, existingSalt);
  return { passwordSalt: salt, passwordHash: hash };
};

const createUser = async (payload) => {
  const normalized = normalizeUserPayload(payload);
  // Ensure default role is student when not provided during creation
  if (!normalized.role) {
    normalized.role = 'student';
  }

  if (!normalized.username || !normalized.fullName || !normalized.password) {
    throw new Error('username, fullName, and password are required');
  }

  const existingUser = await User.findOne({ username: normalized.username });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const passwordFields = buildPasswordFields(normalized.password);
  const user = await User.create({
    username: normalized.username,
    fullName: normalized.fullName,
    role: normalized.role,
    status: normalized.status,
    ...passwordFields,
  });

  // Tự động đồng bộ tạo hồ sơ sinh viên hoặc giáo viên tương ứng
  try {
    if (normalized.role === 'student') {
      const Student = require('../models/student.model');
      const existingStudent = await Student.findOne({ studentId: normalized.username });
      if (!existingStudent) {
        await Student.create({
          studentId: normalized.username, // Username đồng thời là MSSV
          name: normalized.fullName,
          dob: new Date('2004-01-01'),
          gender: 'Nam',
          studentClass: 'Chưa phân lớp',
          major: 'Công nghệ thông tin',
          department: 'Khoa Công nghệ thông tin'
        });
      }
    } else if (normalized.role === 'teacher') {
      const Teacher = require('../models/teacher.model');
      const emailAddress = normalized.username.includes('@') ? normalized.username : `${normalized.username}@school.edu.vn`;
      const existingTeacher = await Teacher.findOne({ email: emailAddress });
      if (!existingTeacher) {
        const count = await Teacher.countDocuments();
        const teacherId = 'GV' + String(count + 1).padStart(5, '0');
        await Teacher.create({
          teacherId: teacherId,
          name: normalized.fullName,
          dob: new Date('1985-01-01'),
          gender: 'Nam',
          department: 'Khoa Công nghệ thông tin',
          email: emailAddress,
          phone: '0909123456',
          specialization: 'Lập trình',
          assignedClass: 'Chưa phân lớp',
          status: 'active'
        });
      }
    }
  } catch (syncError) {
    console.error('Lỗi khi tự động đồng bộ tạo hồ sơ sinh viên/giáo viên:', syncError);
  }

  return toPublicUser(user);
};

const updateUser = async (id, payload) => {
  const normalized = normalizeUserPayload(payload);

  const update = {
    ...(normalized.username ? { username: normalized.username } : {}),
    ...(normalized.fullName ? { fullName: normalized.fullName } : {}),
    ...(normalized.role ? { role: normalized.role } : {}),
    ...(normalized.status ? { status: normalized.status } : {}),
  };

  if (normalized.password) {
    Object.assign(update, buildPasswordFields(normalized.password));
  }

  const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!user) {
    throw new Error('User not found');
  }

  return toPublicUser(user);
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new Error('User not found');
  }

  // Tự động xóa hồ sơ sinh viên hoặc giáo viên tương ứng để tránh rác DB
  try {
    if (user.role === 'student') {
      const Student = require('../models/student.model');
      await Student.findOneAndDelete({ studentId: user.username });
    } else if (user.role === 'teacher') {
      const Teacher = require('../models/teacher.model');
      const emailAddress = user.username.includes('@') ? user.username : `${user.username}@school.edu.vn`;
      await Teacher.findOneAndDelete({ email: emailAddress });
    }
  } catch (syncError) {
    console.error('Lỗi khi tự động xóa hồ sơ sinh viên/giáo viên:', syncError);
  }

  return toPublicUser(user);
};

const listUsers = async () => {
  const users = await User.find().sort({ role: 1, fullName: 1 });
  return users.map(toPublicUser);
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  return toPublicUser(user);
};

const getUserByUsername = async (username) => {
  const normalizedUsername = String(username || '').trim().toLowerCase();
  return User.findOne({ username: normalizedUsername });
};

const authenticateUser = async (username, password) => {
  const user = await getUserByUsername(username);

  if (!user) {
    const error = new Error('Tài khoản không tồn tại.');
    error.code = 'ACCOUNT_NOT_FOUND';
    throw error;
  }

  if (user.status === 'locked') {
    const error = new Error('Tài khoản này đã bị khóa bởi quản trị viên.');
    error.code = 'ACCOUNT_LOCKED';
    throw error;
  }

  if (!verifyPassword(password, user.passwordSalt, user.passwordHash)) {
    const error = new Error('Sai mật khẩu.');
    error.code = 'INVALID_PASSWORD';
    throw error;
  }

  return toPublicUser(user);
};

const seedDefaultUsers = async () => {
  for (const item of defaultUsers) {
    const username = item.username.toLowerCase();
    const existing = await User.findOne({ username });
    const passwordFields = buildPasswordFields(item.password);

    if (existing) {
      await User.updateOne(
        { _id: existing._id },
        {
          $set: {
            fullName: item.fullName,
            role: item.role,
            status: item.status,
            // Do NOT reset passwordHash/passwordSalt for existing users
          },
        },
      );
      continue;
    }

    await User.create({
      username,
      fullName: item.fullName,
      role: item.role,
      status: item.status,
      ...passwordFields,
    });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  listUsers,
  getUserById,
  authenticateUser,
  seedDefaultUsers,
  hashPassword,
  verifyPassword,
};
