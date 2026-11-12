import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = ({ children, currentView, onViewChange }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    {
      id: 'students',
      label: 'Quản Lý Sinh Viên',
      icon: 'fas fa-user-graduate',
    },
    {
      id: 'teachers',
      label: 'Quản Lý Giáo Viên',
      icon: 'fas fa-chalkboard-teacher',
    },
    {
      id: 'categories',
      label: 'Quản Lý Danh Mục',
      icon: 'fas fa-layer-group',
    },
    {
      id: 'accounts',
      label: 'Tài Khoản & Quyền',
      icon: 'fas fa-user-shield',
    },
    {
      id: 'notifications',
      label: 'Thông Báo Hệ Thống',
      icon: 'fas fa-bell',
    },
    {
      id: 'logs',
      label: 'Nhật Ký Hoạt Động',
      icon: 'fas fa-history',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay cho mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#3F51B5] text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 transition duration-200 ease-in-out z-30 flex flex-col`}
      >
        <div className="flex items-center px-6 py-6 border-b border-indigo-500/30">
          <i className="fas fa-graduation-cap text-3xl mr-3 text-indigo-100" />
          <span className="text-2xl font-bold tracking-wide">Admin</span>
        </div>

        <nav className="mt-6 flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                currentView === item.id
                  ? 'bg-[#5C6BC0] text-white shadow-sm'
                  : 'text-indigo-100 hover:bg-[#5C6BC0] hover:text-white'
              }`}
            >
              <i className={`${item.icon} mr-4 text-lg w-6 text-center`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-500/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-indigo-100 hover:bg-red-600 hover:text-white transition-colors"
          >
            <i className="fas fa-sign-out-alt mr-4 text-lg w-6 text-center" />
            Đăng Xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-auto">
        {/* Header for mobile */}
        <div className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-[#3F51B5]">
            <i className="fas fa-bars text-2xl" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Admin Dashboard</h1>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
