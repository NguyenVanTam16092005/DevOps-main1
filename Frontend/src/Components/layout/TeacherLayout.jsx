import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const TeacherLayout = ({ children, currentView, onViewChange }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    {
      id: 'overview',
      label: 'Tổng Quan',
      icon: 'fas fa-home',
    },
    {
      id: 'classes',
      label: 'Lớp Phụ Trách',
      icon: 'fas fa-chalkboard',
    },
    {
      id: 'students',
      label: 'Danh Sách Học Sinh',
      icon: 'fas fa-user-graduate',
    },
    {
      id: 'attendance',
      label: 'Điểm Danh',
      icon: 'fas fa-clipboard-check',
    },
    {
      id: 'announcements',
      label: 'Gửi Thông Báo',
      icon: 'fas fa-bullhorn',
    },
    {
      id: 'tasks',
      label: 'Nhiệm Vụ',
      icon: 'fas fa-tasks',
    },
    {
      id: 'profile',
      label: 'Hồ Sơ & Bảo Mật',
      icon: 'fas fa-id-card',
    },
  ];

  const initials = currentUser?.fullName
    ? currentUser.fullName.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase()
    : 'GV';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#2E7D32] text-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0 transition duration-200 ease-in-out z-30 flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center px-6 py-6 border-b border-green-600/40">
          <i className="fas fa-chalkboard-teacher text-3xl mr-3 text-green-200" />
          <div>
            <span className="text-xl font-bold tracking-wide block">Giáo Viên</span>
            <span className="text-xs text-green-300">Teacher Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                currentView === item.id
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-green-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <i className={`${item.icon} mr-4 text-lg w-6 text-center`} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-green-600/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center font-bold text-white text-sm shadow">
              {initials}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-sm font-bold text-white truncate">
                {currentUser?.fullName || 'Giáo Viên'}
              </p>
              <p className="text-xs text-green-300">Giảng viên</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-green-100 hover:bg-red-600 hover:text-white transition-colors"
          >
            <i className="fas fa-sign-out-alt mr-4 text-lg w-6 text-center" />
            Đăng Xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 w-full overflow-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-[#2E7D32]">
            <i className="fas fa-bars text-2xl" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Teacher Portal</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default TeacherLayout;
