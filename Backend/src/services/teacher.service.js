const Teacher = require('../models/teacher.model');

const teacherService = {
  listTeachers: () => Teacher.find(),
  getTeacherById: (id) => Teacher.findById(id),
  getTeacherByTeacherId: (teacherId) => Teacher.findOne({ teacherId }),
  createTeacher: async (payload) => {
    // Tách tùy chọn createUserAccount ra nếu có
    const { createUserAccount, ...teacherData } = payload;
    const teacher = await Teacher.create(teacherData);

    // Mặc định tự động cấp tài khoản đăng nhập nếu không bị tắt đi
    if (createUserAccount !== false) {
      try {
        const User = require('../models/user.model');
        const userService = require('./user.service');
        const username = teacher.email.split('@')[0];
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
          await userService.createUser({
            username: username,
            fullName: teacher.name,
            role: 'teacher',
            password: '123456', // Mật khẩu mặc định tiện lợi
            status: 'active'
          });
        }
      } catch (err) {
        console.error('Lỗi khi tự động cấp tài khoản cho giáo viên mới:', err);
      }
    }
    return teacher;
  },
  updateTeacher: (id, payload) => Teacher.findByIdAndUpdate(id, payload, { new: true }),
  deleteTeacher: async (id) => {
    const teacher = await Teacher.findByIdAndDelete(id);
    if (teacher) {
      try {
        const User = require('../models/user.model');
        const username = teacher.email.split('@')[0];
        await User.findOneAndDelete({ username });
      } catch (err) {
        console.error('Lỗi khi tự động xóa tài khoản đăng nhập giáo viên:', err);
      }
    }
    return teacher;
  },
};

module.exports = teacherService;
