import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Modal from '../../Components/common/Modal';
import StatsCard from '../../Components/common/StatsCard';
import { useToast } from '../../Components/common/ToastNotification';
import TeacherForm from '../../features/teacher/components/TeacherForm';
import TeacherTable from '../../features/teacher/components/TeacherTable';
import teacherService from '../../services/teacherService';

const TeachersView = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teacherService.fetchTeachers();
      setTeachers(data);
    } catch (error) {
      toast('Lỗi khi tải dữ liệu!', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleAdd = () => {
    setEditingTeacher(null);
    setIsModalOpen(true);
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await teacherService.deleteTeacher(deletingId);
      toast('Xóa giáo viên thành công!');
      fetchTeachers();
    } catch (error) {
      toast('Lỗi khi xóa giáo viên!', 'error');
    } finally {
      setIsConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      if (editingTeacher) {
        await teacherService.updateTeacher(editingTeacher._id, data);
        toast('Cập nhật giáo viên thành công!');
      } else {
        await teacherService.createTeacher(data);
        toast('Thêm mới giáo viên thành công!');
      }
      setIsModalOpen(false);
      fetchTeachers();
    } catch (error) {
      toast(editingTeacher ? 'Lỗi khi cập nhật!' : 'Lỗi khi thêm mới!', 'error');
    }
  };

  const filteredTeachers = useMemo(() => {
    if (!searchTerm) return teachers;
    return teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [teachers, searchTerm]);

  const stats = useMemo(() => {
    const total = teachers.length;
    const active = teachers.filter((teacher) => teacher.status === 'active').length;
    const inactive = teachers.filter((teacher) => teacher.status === 'inactive').length;
    return { total, active, inactive };
  }, [teachers]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.12),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3F51B5]">Quản Lý Hệ Thống</p>
              <h1 className="mt-2 text-3xl font-black">Quản Lý Giáo Viên</h1>
              <p className="mt-2 text-sm text-slate-500">Quản lý danh sách giáo viên, thêm, sửa, xóa thông tin.</p>
            </div>
            <button
              onClick={handleAdd}
              className="rounded-xl bg-[#3F51B5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              + Thêm Giáo Viên
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-6 md:grid-cols-3">
          <StatsCard title="Tổng Giáo Viên" value={stats.total} icon="fas fa-chalkboard-teacher" colorClass="text-[#3F51B5]" bgClass="bg-[#E8EAF6]" />
          <StatsCard title="Đang Giảng Dạy" value={stats.active} icon="fas fa-user-check" colorClass="text-[#2E7D32]" bgClass="bg-[#E8F5E9]" />
          <StatsCard title="Đã Nghỉ" value={stats.inactive} icon="fas fa-user-times" colorClass="text-[#EF6C00]" bgClass="bg-[#FFF3E0]" />
        </section>

        <section className="mt-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-bold text-slate-900">Danh Sách Giáo Viên</h2>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mã GV..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#3F51B5]"
              />
            </div>
            <TeacherTable
              teachers={filteredTeachers}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              isLoading={loading}
            />
          </div>
        </section>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTeacher ? 'Sửa Giáo Viên' : 'Thêm Giáo Viên Mới'}>
        <TeacherForm initialData={editingTeacher} onSubmit={handleSubmitForm} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Xác Nhận Xóa"
      >
        <div className="space-y-4">
          <p className="text-slate-600">Bạn chắc chắn muốn xóa giáo viên này? Hành động này không thể hoàn tác.</p>
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

export default TeachersView;
