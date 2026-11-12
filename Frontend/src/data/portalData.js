export const roleHomes = {
  student: '/students',
  teacher: '/teacher',
  admin: '/admin',
};

export const demoAccounts = [
  {
    username: 'student01',
    password: '123456',
    role: 'student',
    fullName: 'Nguyễn Văn An',
    title: 'Học sinh',
    status: 'active',
    lockedMessage: 'Tài khoản học sinh đang bị khóa.',
  },
  {
    username: 'teacher01',
    password: '123456',
    role: 'teacher',
    fullName: 'Trần Thị Mai',
    title: 'Giáo viên',
    status: 'active',
    lockedMessage: 'Tài khoản giáo viên đang bị khóa.',
  },
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    fullName: 'Quản trị viên hệ thống',
    title: 'Admin',
    status: 'active',
    lockedMessage: 'Tài khoản quản trị đang bị khóa.',
  },
  {
    username: 'locked_student',
    password: '123456',
    role: 'student',
    fullName: 'Học sinh bị khóa',
    title: 'Học sinh',
    status: 'locked',
    lockedMessage: 'Tài khoản này đã bị khóa bởi quản trị viên.',
  },
];

export const studentProfileSeed = {
  studentId: 'SV2026001',
  name: 'Nguyễn Văn An',
  dob: '2004-08-18',
  studentClass: 'CNTT01',
  major: 'Công nghệ thông tin',
  phone: '0912 345 678',
  address: 'Thủ Đức, TP. Hồ Chí Minh',
  email: 'an.nguyen@sis.edu.vn',
  gpa: 3.42,
  attendance: 96,
  status: 'Đang học',
};

export const studentCourses = [
  { code: 'INT101', name: 'Lập trình Web', score: 8.7, status: 'Giỏi' },
  { code: 'INT202', name: 'Cơ sở dữ liệu', score: 7.9, status: 'Khá' },
  { code: 'MATH120', name: 'Toán ứng dụng', score: 8.1, status: 'Giỏi' },
];

export const studentSchedule = [
  { day: 'Thứ 2', time: '07:30 - 10:00', subject: 'Lập trình Web', room: 'A201' },
  { day: 'Thứ 4', time: '13:00 - 15:30', subject: 'Cơ sở dữ liệu', room: 'B105' },
  { day: 'Thứ 6', time: '07:30 - 10:00', subject: 'Toán ứng dụng', room: 'C302' },
];

export const studentAnnouncements = [
  {
    title: 'Nộp học phí học kỳ mới',
    content: 'Phòng tài chính thông báo hoàn tất học phí trước ngày 30/05.',
    time: '2 giờ trước',
  },
  {
    title: 'Lịch kiểm tra giữa kỳ',
    content: 'Lịch kiểm tra môn Cơ sở dữ liệu đã được cập nhật trên portal.',
    time: 'Hôm qua',
  },
];

export const teacherClasses = [
  { name: 'CNTT01', subject: 'Lập trình Web', size: 42, attendance: 97, nextLesson: '20/05/2026' },
  { name: 'CNTT02', subject: 'Cơ sở dữ liệu', size: 39, attendance: 94, nextLesson: '21/05/2026' },
  { name: 'HTTT01', subject: 'Phân tích hệ thống', size: 36, attendance: 92, nextLesson: '22/05/2026' },
];

export const teacherStudents = [
  { id: 'SV2026001', name: 'Nguyễn Văn An', className: 'CNTT01', attendance: 'Chuyên cần', score: 8.7 },
  { id: 'SV2026002', name: 'Lê Thu Hà', className: 'CNTT01', attendance: 'Vắng', score: 7.8 },
  { id: 'SV2026003', name: 'Trần Minh Khang', className: 'CNTT02', attendance: 'Có mặt', score: 8.3 },
];

export const teacherTasks = [
  'Gửi thông báo bài tập tuần cho lớp CNTT01',
  'Cập nhật điểm kiểm tra thực hành',
  'Tạo đề cương ôn tập cuối kỳ',
];

export const adminOverview = [
  { title: 'Tổng tài khoản', value: 128, icon: 'fas fa-users-cog', tone: 'blue' },
  { title: 'Học sinh', value: 96, icon: 'fas fa-user-graduate', tone: 'green' },
  { title: 'Giáo viên', value: 18, icon: 'fas fa-chalkboard-user', tone: 'amber' },
  { title: 'Thông báo', value: 14, icon: 'fas fa-bell', tone: 'rose' },
];

export const adminUsers = [
  { id: 1, name: 'Nguyễn Văn An', username: 'student01', role: 'student', status: 'active' },
  { id: 2, name: 'Trần Thị Mai', username: 'teacher01', role: 'teacher', status: 'active' },
  { id: 3, name: 'Quản trị viên hệ thống', username: 'admin', role: 'admin', status: 'active' },
  { id: 4, name: 'Học sinh bị khóa', username: 'locked_student', role: 'student', status: 'locked' },
];

export const adminLogs = [
  '07:45 - Đã đồng bộ 96 hồ sơ sinh viên.',
  '08:10 - Giáo viên Mai cập nhật điểm lớp CNTT01.',
  '08:30 - Quản trị viên đổi vai trò cho 2 tài khoản thử nghiệm.',
];
