import React, { useEffect, useMemo, useState, useCallback } from 'react';
import DashboardLayout from '../../../Components/layout/DashboardLayout';
import Header from '../../../Components/layout/Header';
import StatsCard from '../../../Components/common/StatsCard';
import Modal from '../../../Components/common/Modal';
import { useToast } from '../../../Components/common/ToastNotification';
import StudentForm from '../components/StudentForm';
import StudentTable from '../components/StudentTable';
import studentService from '../services/studentService';

const StudentManagementPage = ({ toggleSidebar }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const toast = useToast();

  const fetchStudents = useCallback(async () => {
    try {
      const data = await studentService.fetchStudents();
      setStudents(data);
    } catch (error) {
      toast('Lỗi khi tải dữ liệu!', 'error');
    }
  }, [toast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await studentService.deleteStudent(deletingId);
      toast('Xóa sinh viên thành công!');
      fetchStudents();
    } catch (error) {
      toast('Lỗi khi xóa sinh viên!', 'error');
    } finally {
      setIsConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      if (editingStudent) {
        await studentService.updateStudent(editingStudent._id, data);
        toast('Cập nhật sinh viên thành công!');
      } else {
        await studentService.createStudent(data);
        toast('Thêm mới sinh viên thành công!');
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (error) {
      toast(editingStudent ? 'Lỗi khi cập nhật!' : 'Lỗi khi thêm mới!', 'error');
    }
  };

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [students, searchTerm]);

  const stats = useMemo(() => {
    const total = students.length;
    const male = students.filter((student) => student.gender === 'Nam').length;
    const female = students.filter((student) => student.gender === 'Nữ').length;
    return { total, male, female };
  }, [students]);

  return (
    <DashboardLayout>
      <Header
        title="Quản Lý Học Sinh - Sinh Viên"
        onSearch={setSearchTerm}
        onAdd={handleAdd}
        toggleSidebar={toggleSidebar}
      />

      <main className="flex-1 overflow-auto p-8 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Tổng số HSSV"
              value={stats.total}
              icon="fas fa-graduation-cap"
              colorClass="text-[#3F51B5]"
              bgClass="bg-[#E8EAF6]"
            />
            <StatsCard
              title="Nam"
              value={stats.male}
              icon="fas fa-mars"
              colorClass="text-[#4CAF50]"
              bgClass="bg-[#E8F5E9]"
            />
            <StatsCard
              title="Nữ"
              value={stats.female}
              icon="fas fa-venus"
              colorClass="text-[#E91E63]"
              bgClass="bg-[#FCE4EC]"
            />
          </div>

          <StudentTable students={filteredStudents} onEdit={handleEdit} onDelete={handleDeleteRequest} />
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? 'Sửa thông tin HSSV' : 'Thêm mới HSSV'}>
        <StudentForm initialData={editingStudent} onSubmit={handleSubmitForm} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title="Xác nhận xóa">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <i className="fas fa-exclamation-triangle text-red-600 text-xl" />
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Bạn có chắc chắn muốn xóa sinh viên này không? Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsConfirmOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 shadow-sm"
            >
              Xóa sinh viên
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default StudentManagementPage;