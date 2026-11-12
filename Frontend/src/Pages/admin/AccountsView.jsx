import React, { useEffect, useState } from 'react';
import Badge from '../../Components/common/Badge';
import Modal from '../../Components/common/Modal';
import { useToast } from '../../Components/common/ToastNotification';
import userService from '../../services/userService';

const AccountsView = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // For Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    role: 'student',
    status: 'active',
    password: '',
  });

  // For Delete Confirmation
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await userService.fetchUsers();
      setUsers(data);
    } catch {
      toast('Không tải được danh sách tài khoản từ backend.', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const roleCounts = {
    student: users.filter((user) => user.role === 'student').length,
    teacher: users.filter((user) => user.role === 'teacher').length,
    admin: users.filter((user) => user.role === 'admin').length,
  };

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setFormData({
        username: user.username,
        fullName: user.fullName || user.name || '',
        role: user.role,
        status: user.status || 'active',
        password: '', // default empty so password isn't updated unless filled
      });
    } else {
      setFormData({
        username: '',
        fullName: '',
        role: 'student',
        status: 'active',
        password: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Prepare payload for update
        const payload = {
          username: formData.username,
          fullName: formData.fullName,
          role: formData.role,
          status: formData.status,
        };
        if (formData.password) {
          payload.password = formData.password;
        }
        await userService.updateUser(editingUser._id || editingUser.id, payload);
        toast('Cập nhật tài khoản thành công!');
      } else {
        if (!formData.password) {
          toast('Vui lòng nhập mật khẩu cho tài khoản mới.', 'error');
          return;
        }
        await userService.createUser(formData);
        toast('Thêm mới tài khoản thành công!');
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (error) {
      toast(error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.', 'error');
    }
  };

  const handleDeleteRequest = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await userService.deleteUser(deletingId);
      toast('Đã xóa tài khoản thành công.');
      loadUsers();
    } catch {
      toast('Không thể xóa tài khoản này.', 'error');
    } finally {
      setIsConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const updateRole = (userId, role) => {
    userService
      .updateUser(userId, { role })
      .then(() => {
        toast('Đã cập nhật vai trò tài khoản.');
        loadUsers();
      })
      .catch(() => {
        toast('Không thể cập nhật vai trò.', 'error');
      });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.12),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3F51B5]">Quản lý hệ thống</p>
            <h1 className="mt-2 text-3xl font-black">Tài Khoản & Phân Quyền</h1>
            <p className="mt-2 text-sm text-slate-500">Quản lý tài khoản người dùng, thêm, sửa, xóa và phân quyền truy cập hệ thống.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="rounded-xl bg-[#3F51B5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 self-start md:self-auto"
          >
            + Thêm Tài Khoản
          </button>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.35fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Danh sách tài khoản</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Người dùng</th>
                    <th className="px-6 py-4">Tài khoản</th>
                    <th className="px-6 py-4">Vai trò</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {loadingUsers && users.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4 text-sm text-slate-500" colSpan={5}>
                        Đang tải danh sách tài khoản...
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id || user.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-semibold text-slate-900">{user.fullName || user.username}</td>
                        <td className="px-6 py-4 text-slate-600 font-mono">{user.username}</td>
                        <td className="px-6 py-4">
                          <select
                            value={user.role}
                            onChange={(event) => updateRole(user._id || user.id, event.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#3F51B5]"
                          >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <Badge type={user.status === 'active' ? 'Nam' : 'Nữ'} text={user.status === 'active' ? 'Hoạt động' : 'Đã khóa'} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleOpenModal(user)} className="text-indigo-500 hover:text-indigo-700 mr-3">
                            <i className="fas fa-pen"></i>
                          </button>
                          <button onClick={() => handleDeleteRequest(user._id || user.id)} className="text-red-400 hover:text-red-600">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  {users.length === 0 && !loadingUsers && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                        Chưa có tài khoản nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] h-fit">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Phân bố vai trò</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="flex items-center gap-2">
                  <i className="fas fa-user-graduate text-indigo-500" />
                  Học sinh
                </span>
                <span className="font-semibold">{roleCounts.student}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="flex items-center gap-2">
                  <i className="fas fa-chalkboard-teacher text-green-500" />
                  Giáo viên
                </span>
                <span className="font-semibold">{roleCounts.teacher}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="flex items-center gap-2">
                  <i className="fas fa-user-shield text-amber-500" />
                  Admin
                </span>
                <span className="font-semibold">{roleCounts.admin}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Create / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Sửa Tài Khoản' : 'Thêm Tài Khoản Mới'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên Người Dùng</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
              placeholder="Ví dụ: Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên Đăng Nhập</label>
            <input
              type="text"
              required
              disabled={!!editingUser}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm disabled:bg-slate-100 disabled:text-slate-500 font-mono"
              placeholder="Ví dụ: student01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mật Khẩu {editingUser && <span className="text-xs text-slate-400 font-normal">(để trống nếu không đổi)</span>}
            </label>
            <input
              type="password"
              required={!editingUser}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
              placeholder={editingUser ? 'Nhập mật khẩu mới' : 'Nhập mật khẩu ban đầu'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vai Trò</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Trạng Thái</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="active">Hoạt động</option>
              <option value="locked">Khóa</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl text-slate-700 text-sm font-semibold">
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm font-semibold">
              {editingUser ? 'Lưu Thay Đổi' : 'Thêm Mới'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title="Xác Nhận Xóa">
        <div className="space-y-4">
          <p className="text-slate-600 text-sm">Bạn chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsConfirmOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Hủy
            </button>
            <button
              onClick={confirmDelete}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Xóa
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AccountsView;
