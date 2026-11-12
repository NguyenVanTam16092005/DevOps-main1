import React from 'react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 lg:hidden" onClick={toggleSidebar} />}

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#3F51B5] text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 transition duration-200 ease-in-out z-30 flex flex-col`}
      >
        <div className="flex items-center px-6 py-6 border-b border-indigo-500/30">
          <i className="fas fa-graduation-cap text-3xl mr-3 text-indigo-100" />
          <span className="text-2xl font-bold tracking-wide">SIS System</span>
        </div>

        <nav className="mt-6 flex-1 px-4 space-y-2">
          <button className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl bg-[#5C6BC0] text-white shadow-sm">
            <i className="fas fa-user-friends mr-4 text-lg w-6 text-center text-white" />
            Danh sách HSSV
          </button>
          <button className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-indigo-100 hover:bg-[#5C6BC0] hover:text-white transition-colors">
            <i className="fas fa-chart-pie mr-4 text-lg w-6 text-center text-indigo-200" />
            Thống kê
          </button>
          <button className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-indigo-100 hover:bg-[#5C6BC0] hover:text-white transition-colors">
            <i className="fas fa-cog mr-4 text-lg w-6 text-center text-indigo-200" />
            Cài đặt
          </button>
        </nav>

        <div className="p-4 border-t border-indigo-500/30 flex items-center">
          <div className="h-10 w-10 rounded-full bg-[#5C6BC0] flex items-center justify-center border border-indigo-400 font-semibold text-white mr-3 shadow-sm">
            AD
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white">Admin User</p>
            <p className="text-xs text-indigo-200">Quản trị viên</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;