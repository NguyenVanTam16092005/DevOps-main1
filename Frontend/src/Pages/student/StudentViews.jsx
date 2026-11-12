import React, { useState } from 'react';
import Badge from '../../Components/common/Badge';
import Modal from '../../Components/common/Modal';
import StatsCard from '../../Components/common/StatsCard';
import { useToast } from '../../Components/common/ToastNotification';
import { useAuth } from '../../contexts/AuthContext';
import userService from '../../services/userService';
import { studentCourses, studentSchedule } from '../../data/portalData';

// ─── Overview ───────────────────────────────────────────────────────────────
export const StudentOverviewView = ({ profile, announcements }) => {
  const { currentUser } = useAuth();

  const stats = [
    { title: 'GPA hiện tại', value: (profile?.gpa || 0).toFixed(2), icon: 'fas fa-chart-line', colorClass: 'text-[#0E7490]', bgClass: 'bg-cyan-50' },
    { title: 'Chuyên cần', value: `${profile?.attendanceRate || 0}%`, icon: 'fas fa-calendar-check', colorClass: 'text-[#2E7D32]', bgClass: 'bg-green-50' },
    { title: 'Trạng thái', value: profile?.status || 'Hoạt động', icon: 'fas fa-user-check', colorClass: 'text-[#EF6C00]', bgClass: 'bg-orange-50' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0E7490]">Tổng Quan</p>
        <h1 className="mt-1 text-3xl font-black text-slate-900">
          Xin chào, {profile?.name || currentUser?.fullName}!
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Lớp học: <span className="font-semibold text-slate-700">{profile?.studentClass || 'Chưa phân lớp'}</span> | Ngành học: <span className="font-semibold text-slate-700">{profile?.major || 'Chưa phân ngành'}</span>
        </p>
      </header>

      <section className="mt-6 grid gap-6 md:grid-cols-3">
        {stats.map((item) => (
          <StatsCard key={item.title} {...item} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Môn học gần nhất */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Môn học đang theo học</h2>
            <span className="text-xs text-slate-500 font-medium">Học kỳ này</span>
          </div>
          <div className="space-y-3">
            {studentCourses.map((course) => (
              <div key={course.code} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">{course.name}</p>
                  <p className="text-sm text-slate-500">{course.code}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{(profile?.gpa * (course.score / 8.5)).toFixed(1)}</p>
                  <p className="text-xs text-slate-500">{course.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thông báo mới nhất */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Thông báo mới nhất</h2>
          <div className="space-y-3">
            {announcements.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">Chưa có thông báo nào từ hệ thống.</div>
            ) : (
              announcements.slice(0, 3).map((item) => (
                <article key={item._id || item.id} className="rounded-xl bg-slate-50 p-4 hover:bg-slate-100/50 transition">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">{item.title}</h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date(item.createdAt || item.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">{item.content}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── Profile ─────────────────────────────────────────────────────────────────
export const StudentProfileView = ({ profile, onUpdate }) => {
  const toast = useToast();
  const [draft, setDraft] = useState({ phone: '', address: '' });
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setDraft({
      phone: profile?.phone || '',
      address: profile?.address || '',
    });
    setIsOpen(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(draft);
      setIsOpen(false);
      toast('Đã cập nhật thông tin cá nhân.');
    } catch (err) {
      toast('Cập nhật hồ sơ thất bại.', 'error');
    }
  };

  const fields = [
    ['MSSV', profile?.studentId],
    ['Họ tên', profile?.name],
    ['Ngày sinh', profile?.dob ? new Date(profile.dob).toLocaleDateString('vi-VN') : ''],
    ['Lớp', profile?.studentClass],
    ['Ngành học', profile?.major],
    ['Khoa quản lý', profile?.department],
    ['Số điện thoại', profile?.phone || 'Chưa cập nhật'],
    ['Địa chỉ', profile?.address || 'Chưa cập nhật'],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#0E7490]">Hồ Sơ</p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">Thông Tin Cá Nhân</h1>
        </div>
        <button
          onClick={openModal}
          className="rounded-xl bg-[#0E7490] px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-700 transition shadow-sm"
        >
          <i className="fas fa-pen mr-2" />Cập nhật thông tin liên hệ
        </button>
      </header>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Chi tiết hồ sơ học viên</h2>
          <Badge type="Nam" text="Sinh viên" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
              <p className="mt-2 text-sm font-bold text-slate-800">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Cập nhật thông tin liên hệ">
        <form onSubmit={saveProfile} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Số điện thoại</span>
            <input
              type="text"
              value={draft.phone}
              onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
              placeholder="Nhập số điện thoại mới..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0E7490] focus:ring-4 focus:ring-cyan-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Địa chỉ</span>
            <input
              type="text"
              value={draft.address}
              onChange={(e) => setDraft((p) => ({ ...p, address: e.target.value }))}
              placeholder="Nhập địa chỉ mới..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0E7490] focus:ring-4 focus:ring-cyan-100"
            />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Hủy</button>
            <button type="submit" className="rounded-xl bg-[#0E7490] px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 transition">Lưu thay đổi</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// ─── Courses & Grades ─────────────────────────────────────────────────────────
export const StudentCoursesView = ({ profile }) => (
  <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 space-y-6">
    <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#0E7490]">Học Tập</p>
      <h1 className="mt-1 text-3xl font-black text-slate-900">Môn Học & Điểm Số</h1>
    </header>

    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Điểm trung bình học tập (GPA)</p>
          <p className="mt-2 text-3xl font-black text-[#0E7490]">{(profile?.gpa || 0).toFixed(2)}</p>
        </div>
        <div className="h-14 w-14 rounded-full bg-cyan-50 flex items-center justify-center">
          <i className="fas fa-graduation-cap text-[#0E7490] text-2xl" />
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Tỉ lệ chuyên cần</p>
          <p className="mt-2 text-3xl font-black text-green-700">{profile?.attendanceRate || 0}%</p>
        </div>
        <div className="h-14 w-14 rounded-full bg-green-50 flex items-center justify-center">
          <i className="fas fa-user-check text-green-700 text-2xl" />
        </div>
      </div>
    </div>

    {/* Bảng Điểm Thành Phần Chi Tiết */}
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Sổ Điểm Thành Phần Chi Tiết (Từ Giáo Viên)</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Điểm Chuyên cần (10%)</p>
          <p className="mt-2 text-2xl font-black text-[#0E7490]">{profile?.attendanceScore !== undefined ? profile.attendanceScore.toFixed(1) : '9.5'}</p>
          <p className="text-xs text-slate-400 mt-1">Hệ số 0.1</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Điểm Giữa kỳ (30%)</p>
          <p className="mt-2 text-2xl font-black text-indigo-600">{profile?.midtermScore !== undefined ? profile.midtermScore.toFixed(1) : '8.5'}</p>
          <p className="text-xs text-slate-400 mt-1">Hệ số 0.3</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Điểm Cuối kỳ (60%)</p>
          <p className="mt-2 text-2xl font-black text-emerald-600">{profile?.finalScore !== undefined ? profile.finalScore.toFixed(1) : '8.5'}</p>
          <p className="text-xs text-slate-400 mt-1">Hệ số 0.6</p>
        </div>
      </div>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Điểm Quy Đổi Môn Học</h2>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-6 py-4 font-semibold">Mã môn</th>
            <th className="px-6 py-4 font-semibold">Tên môn học</th>
            <th className="px-6 py-4 font-semibold">Điểm số</th>
            <th className="px-6 py-4 font-semibold">Xếp loại</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {studentCourses.map((course) => {
            const calculatedScore = (profile?.gpa * (course.score / 8.5)).toFixed(1);
            const statusLabel = calculatedScore >= 8.0 ? 'Giỏi' : calculatedScore >= 6.5 ? 'Khá' : 'Trung bình';
            return (
              <tr key={course.code} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-mono text-slate-500">{course.code}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">{course.name}</td>
                <td className="px-6 py-4 font-bold text-[#0E7490]">{calculatedScore}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    statusLabel === 'Giỏi' ? 'bg-green-50 text-green-700' : statusLabel === 'Khá' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {statusLabel}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  </div>
);

// ─── Schedule ─────────────────────────────────────────────────────────────────
export const StudentScheduleView = ({ profile, schedule }) => {
  const displaySchedule = schedule && schedule.length > 0 ? schedule : studentSchedule;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0E7490]">Thời Khóa Biểu</p>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Lịch Học Lớp {profile?.studentClass || 'Chưa phân lớp'}</h1>
        <p className="mt-2 text-sm text-slate-500">Xem lịch học trực tiếp phân phối động từ Ban Giám Hiệu (Admin).</p>
      </header>
      <section className="mt-6 space-y-4">
        {displaySchedule.map((item) => (
          <div
            key={`${item.day}-${item.subject}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-slate-300 transition"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                <i className="fas fa-calendar-day text-[#0E7490] text-xl" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{item.day}</p>
                <p className="text-sm text-slate-500">{item.time}</p>
              </div>
            </div>
            <div className="text-right sm:text-right">
              <p className="font-semibold text-slate-900">{item.subject}</p>
              <p className="text-sm text-slate-500">Phòng {item.room}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

// ─── Announcements ────────────────────────────────────────────────────────────
export const StudentAnnouncementsView = ({ announcements }) => (
  <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
    <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#0E7490]">Truyền Thông</p>
      <h1 className="mt-1 text-3xl font-black text-slate-900">Thông Báo Hệ Thống</h1>
    </header>
    <section className="mt-6 space-y-4">
      {announcements.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <i className="fas fa-bell-slash text-4xl text-slate-300 mb-3" />
          <p className="text-slate-500 font-semibold">Chưa có thông báo nào từ nhà trường hoặc giáo viên.</p>
        </div>
      ) : (
        announcements.map((item) => (
          <article key={item._id || item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <i className="fas fa-bell text-[#0E7490]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <span className="inline-block rounded-full bg-cyan-50 text-[#0E7490] text-xs px-2.5 py-0.5 mt-1 font-bold">
                    {item.senderRole === 'admin' ? 'Nhà trường' : 'Giáo viên bộ môn'}
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">
                {new Date(item.createdAt || item.date).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600 leading-6 whitespace-pre-line">{item.content}</p>
          </article>
        ))
      )}
    </section>
  </div>
);

// ─── Change Password ──────────────────────────────────────────────────────────
export const StudentPasswordView = () => {
  const toast = useToast();
  const { currentUser } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) {
      toast('Mật khẩu mới phải có ít nhất 6 ký tự.', 'error');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast('Xác nhận mật khẩu không khớp.', 'error');
      return;
    }
    try {
      let targetUserId = currentUser?._id;
      if (!targetUserId) {
        const usersList = await userService.fetchUsers();
        const userObj = usersList.find(u => u.username === currentUser?.username);
        if (userObj) {
          targetUserId = userObj._id;
        }
      }

      if (!targetUserId) {
        toast('Không tìm thấy thông tin tài khoản người dùng.', 'error');
        return;
      }

      await userService.updateUser(targetUserId, { password: form.newPassword });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast('Đã đổi mật khẩu thành công.');
    } catch (err) {
      toast('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-6 md:px-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#0E7490]">Bảo Mật</p>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Đổi Mật Khẩu</h1>
      </header>
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            ['currentPassword', 'Mật khẩu hiện tại'],
            ['newPassword', 'Mật khẩu mới'],
            ['confirmPassword', 'Xác nhận mật khẩu'],
          ].map(([name, label]) => (
            <label key={name} className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
              <input
                type="password"
                value={form[name]}
                onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0E7490] focus:ring-4 focus:ring-cyan-100"
              />
            </label>
          ))}
          <div className="flex justify-end pt-2">
            <button type="submit" className="rounded-xl bg-[#0E7490] px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-700 transition">
              Cập nhật mật khẩu
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
