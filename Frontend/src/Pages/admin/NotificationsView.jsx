import React, { useState, useEffect } from 'react';
import Modal from '../../Components/common/Modal';
import { useToast } from '../../Components/common/ToastNotification';
import notificationService from '../../services/notificationService';

const NotificationsView = () => {
  const toast = useToast();
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [systemNotice, setSystemNotice] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.fetchNotifications();
      setNotifications(data);
    } catch (error) {
      toast('Lỗi khi tải thông báo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const submitNotice = async (event) => {
    event.preventDefault();
    if (!title.trim() || !systemNotice.trim()) {
      toast('Vui lòng nhập tiêu đề và nội dung thông báo.', 'error');
      return;
    }

    try {
      await notificationService.createNotification({
        title,
        content: systemNotice,
        type: 'system',
      });
      setTitle('');
      setSystemNotice('');
      setIsNoticeOpen(false);
      toast('Đã tạo thông báo hệ thống thành công.');
      fetchNotifications();
    } catch (error) {
      toast('Lỗi khi tạo thông báo.', 'error');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      toast('Đã xóa thông báo thành công.');
      fetchNotifications();
    } catch (error) {
      toast('Lỗi khi xóa thông báo.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.12),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <header className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3F51B5]">Quản lý hệ thống</p>
            <h1 className="mt-2 text-3xl font-black">Thông Báo Hệ Thống</h1>
            <p className="mt-2 text-sm text-slate-500">Tạo và quản lý thông báo gửi đến người dùng.</p>
          </div>
          <button
            onClick={() => setIsNoticeOpen(true)}
            className="rounded-xl bg-[#3F51B5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            + Tạo thông báo
          </button>
        </header>

        <section className="mt-6">
          <div className="space-y-4">
            {loading ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center">
                <i className="fas fa-spinner fa-spin text-4xl text-[#3F51B5] mb-4" />
                <p className="text-slate-500">Đang tải thông báo...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center">
                <i className="fas fa-inbox text-4xl text-slate-300 mb-4" />
                <p className="text-slate-500">Không có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif._id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900">{notif.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{notif.content}</p>
                      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                        <span>
                          <i className="fas fa-calendar-alt mr-2" />
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-green-700 font-semibold">
                          {notif.status === 'published' ? 'Đã phát hành' : 'Nháp'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteNotification(notif._id)}
                      className="ml-4 text-slate-400 hover:text-red-600 transition"
                    >
                      <i className="fas fa-trash text-lg" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <Modal isOpen={isNoticeOpen} onClose={() => setIsNoticeOpen(false)} title="Tạo thông báo hệ thống">
        <form onSubmit={submitNotice} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Tiêu đề</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3F51B5] focus:ring-4 focus:ring-indigo-100"
              placeholder="Nhập tiêu đề thông báo..."
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Nội dung thông báo</span>
            <textarea
              rows="4"
              value={systemNotice}
              onChange={(event) => setSystemNotice(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#3F51B5] focus:ring-4 focus:ring-indigo-100"
              placeholder="Nhập thông báo áp dụng cho toàn hệ thống..."
            />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsNoticeOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">
              Hủy
            </button>
            <button type="submit" className="rounded-xl bg-[#3F51B5] px-4 py-2.5 text-sm font-semibold text-white">
              Lưu thông báo
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NotificationsView;
