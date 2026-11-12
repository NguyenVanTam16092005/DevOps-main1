import React from 'react';
import Badge from '../../../Components/common/Badge';

const StudentTable = ({ students, onEdit, onDelete }) => {
  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center h-64 border border-gray-50">
        <i className="far fa-folder-open text-5xl text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Chưa có dữ liệu</h3>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'S';
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
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">MSSV</th>
              <th className="px-8 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Họ và Tên</th>
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Ngày sinh</th>
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Giới tính</th>
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Lớp</th>
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Ngành học</th>
              <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Khoa</th>
              <th className="px-6 py-5 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50/50 group transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">{student.studentId}</td>
                <td className="px-8 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full bg-[#E8EAF6] text-[#3F51B5] font-bold text-sm">
                      {getInitials(student.name)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-700">{student.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {new Date(student.dob).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge type={student.gender} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{student.studentClass}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{student.major}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{student.department || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="text-indigo-500 hover:text-[#3F51B5] p-2 hover:bg-indigo-50 rounded-full transition-colors"
                    >
                      <i className="fas fa-pen" />
                    </button>
                    <button
                      onClick={() => onDelete(student._id)}
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

export default StudentTable;