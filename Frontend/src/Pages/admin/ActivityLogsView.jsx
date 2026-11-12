import React, { useState, useEffect } from 'react';
import logService from '../../services/logService';

const ActivityLogsView = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await logService.fetchLogs();
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    switch (action?.toUpperCase()) {
      case 'CREATE':
        return 'text-green-600 bg-green-50';
      case 'UPDATE':
        return 'text-blue-600 bg-blue-50';
      case 'DELETE':
        return 'text-red-600 bg-red-50';
      case 'LOGIN':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.12),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3F51B5]">Hệ Thống</p>
            <h1 className="mt-2 text-3xl font-black">Nhật Ký Hoạt Động</h1>
            <p className="mt-2 text-sm text-slate-500">Theo dõi các thay đổi và hoạt động trong hệ thống.</p>
          </div>
        </header>

        <section className="mt-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <i className="fas fa-spinner fa-spin text-4xl text-[#3F51B5] mb-4" />
                <p className="text-slate-500">Đang tải nhật ký...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="p-12 text-center">
                <i className="fas fa-history text-4xl text-slate-300 mb-4" />
                <p className="text-slate-500">Chưa có nhật ký hoạt động nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Thời Gian</th>
                      <th className="px-6 py-4 font-semibold">Hành Động</th>
                      <th className="px-6 py-4 font-semibold">Module</th>
                      <th className="px-6 py-4 font-semibold">Chi Tiết</th>
                      <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap uppercase text-slate-500 font-medium">
                          {log.module}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {log.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${log.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <i className={`fas ${log.status === 'success' ? 'fa-check' : 'fa-times'}`} />
                            {log.status === 'success' ? 'Thành công' : 'Thất bại'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ActivityLogsView;
