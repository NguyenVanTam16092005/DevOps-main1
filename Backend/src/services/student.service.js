const Student = require('../models/student.model');

const studentService = {
  listStudents: () => Student.find(),
  getStudentById: (id) => Student.findById(id),
  createStudent: async (payload) => {
    // Tách tùy chọn createUserAccount ra nếu có
    const { createUserAccount, ...studentData } = payload;
    const student = await Student.create(studentData);

    // Mặc định tự động cấp tài khoản đăng nhập nếu không bị tắt đi
    if (createUserAccount !== false) {
      try {
        const User = require('../models/user.model');
        const userService = require('./user.service');
        const existingUser = await User.findOne({ username: student.studentId });
        if (!existingUser) {
          await userService.createUser({
            username: student.studentId,
            fullName: student.name,
            role: 'student',
            password: '123456', // Mật khẩu mặc định tiện lợi
            status: 'active'
          });
        }
      } catch (err) {
        console.error('Lỗi khi tự động cấp tài khoản cho sinh viên mới:', err);
      }
    }
    return student;
  },
  updateStudent: (id, payload) => Student.findByIdAndUpdate(id, payload, { new: true }),
  deleteStudent: async (id) => {
    const student = await Student.findByIdAndDelete(id);
    if (student) {
      try {
        const User = require('../models/user.model');
        await User.findOneAndDelete({ username: student.studentId });
      } catch (err) {
        console.error('Lỗi khi tự động xóa tài khoản đăng nhập sinh viên:', err);
      }
    }
    return student;
  },
};

module.exports = studentService;