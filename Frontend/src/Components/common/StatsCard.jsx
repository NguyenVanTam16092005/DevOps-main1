import React from 'react';

const StatsCard = ({ title, value, icon, colorClass, bgClass }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex items-center h-28 border border-gray-50">
      <div className={`p-4 rounded-xl mr-5 flex items-center justify-center h-14 w-14 ${bgClass} ${colorClass}`}>
        <i className={`${icon} text-2xl`} />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;