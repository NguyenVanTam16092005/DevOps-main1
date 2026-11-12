import React from 'react';

const Header = ({ title, toggleSidebar, onSearch, onAdd }) => {
  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none lg:hidden mr-4">
          <i className="fas fa-bars text-xl" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden sm:block w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4">
            <i className="fas fa-search text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo Tên hoặc M..."
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-gray-700 bg-gray-50/50"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <button
          onClick={onAdd}
          className="flex items-center justify-center px-5 py-2.5 bg-[#3F51B5] text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-sm font-semibold shadow-sm"
        >
          <i className="fas fa-plus mr-2" />
          Thêm Mới
        </button>
      </div>
    </header>
  );
};

export default Header;