import React from 'react';
import Badge from '../../../Components/common/Badge';

const TeacherTable = ({ teachers, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center h-64 border border-gray-50">
        <i className="fas fa-spinner fa-spin text-4xl text-[#3F51B5] mb-4" />
        <p className="text-slate-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!teachers || teachers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center h-64 border border-gray-50">
        <i className="far fa-folder-open text-5xl text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Chưa có dữ liệu</h3>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'T';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return parts[0][0].toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] overflow-hidden border border-gray-50 mb-8">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mã GV</th>
              <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Họ và Tên</th>
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Giới tính</th>
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Khoa</th>
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Lớp giảng dạy</th>
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-5 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {teachers.map((teacher) => (
              <tr key={teacher._id} className="hover:bg-gray-50/50 group transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">{teacher.teacherId}</td>
                <td className="px-8 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-[#E8EAF6] text-[#3F51B5] font-bold text-sm">
                      {getInitials(teacher.name)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-700">{teacher.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge type={teacher.gender} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{teacher.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  <span className="inline-block rounded-lg bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-semibold">
                    {teacher.assignedClass || 'Chưa phân lớp'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{teacher.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${teacher.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {teacher.status === 'active' ? 'Hoạt động' : 'Đã nghỉ'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(teacher)}
                      className="text-indigo-500 hover:text-[#3F51B5] p-2 hover:bg-indigo-50 rounded-full transition-colors"
                    >
                      <i className="fas fa-pen" />
                    </button>
                    <button
                      onClick={() => onDelete(teacher._id)}
                      className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherTable;
