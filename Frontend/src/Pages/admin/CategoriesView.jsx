import React, { useState, useEffect } from 'react';
import { useToast } from '../../Components/common/ToastNotification';
import Modal from '../../Components/common/Modal';
import categoryService from '../../services/categoryService';

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Khoa');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: 'Khoa', description: '', status: 'active' });

  const toast = useToast();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.fetchCategories();
      setCategories(data);
    } catch {
      toast('Không thể tải danh mục từ hệ thống.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        description: category.description || '',
        status: category.status,
      });
    } else {
      setFormData({ name: '', type: activeTab, description: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id || editingCategory.id, formData);
        toast('Cập nhật danh mục thành công!');
      } else {
        await categoryService.createCategory(formData);
        toast('Thêm mới danh mục thành công!');
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (error) {
      toast('Không thể lưu thông tin danh mục.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await categoryService.deleteCategory(id);
        toast('Đã xóa danh mục.');
        loadCategories();
      } catch {
        toast('Không thể xóa danh mục.', 'error');
      }
    }
  };

  // Lọc danh mục theo tab hiện tại
  const filteredCategories = categories.filter((cat) => cat.type === activeTab);

  // Render mô tả đẹp mắt (đặc biệt là đối với lịch học JSON)
  const renderDescription = (cat) => {
    if (cat.type === 'Thời khóa biểu') {
      try {
        const items = JSON.parse(cat.description);
        if (!Array.isArray(items)) throw new Error();
        return (
          <div className="flex flex-wrap gap-1.5 max-w-lg">
            {items.map((item, idx) => (
              <span key={idx} className="inline-block text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 shadow-sm font-semibold">
                <strong>{item.day}:</strong> {item.subject} ({item.room} | {item.time})
              </span>
            ))}
          </div>
        );
      } catch {
        return (
          <span className="text-red-500 font-mono text-xs break-all bg-red-50 px-2 py-1 rounded border border-red-100 inline-block">
            <i className="fas fa-exclamation-triangle mr-1" /> JSON không hợp lệ: {cat.description}
          </span>
        );
      }
    }
    return <span className="text-slate-600 font-medium">{cat.description || 'Chưa có mô tả'}</span>;
  };

  // Xác định nhãn gợi ý theo tab hiện tại
  const getNameLabel = () => {
    switch (activeTab) {
      case 'Khoa': return 'Tên Khoa (Ví dụ: Khoa Công nghệ thông tin)';
      case 'Ngành học': return 'Tên Ngành học (Ví dụ: Công nghệ thông tin)';
      case 'Lớp học': return 'Mã Lớp học (Ví dụ: CNTT01)';
      case 'Môn học': return 'Tên Môn học (Ví dụ: Lập trình Web)';
      case 'Thời khóa biểu': return 'Mã lớp học áp dụng (Ví dụ: CNTT01)';
      default: return 'Tên Danh Mục';
    }
  };

  const getTabIcon = (tabId) => {
    switch (tabId) {
      case 'Khoa': return 'fas fa-university';
      case 'Ngành học': return 'fas fa-graduation-cap';
      case 'Lớp học': return 'fas fa-users';
      case 'Môn học': return 'fas fa-book';
      case 'Thời khóa biểu': return 'fas fa-calendar-alt';
      default: return 'fas fa-layer-group';
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.08),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 space-y-6">
        
        {/* Header */}
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3F51B5]">Hệ Thống</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Cấu Hình & Danh Mục</h1>
            <p className="mt-2 text-sm text-slate-500">Quản lý và cập nhật cấu hình danh mục khoa, môn, lớp và sơ đồ thời khóa biểu động.</p>
          </div>
          <button
            onClick={() => handleOpenModal(null)}
            className="rounded-xl bg-[#3F51B5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 self-start md:self-auto shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            <i className="fas fa-plus-circle" /> Thêm {activeTab} mới
          </button>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {['Khoa', 'Ngành học', 'Lớp học', 'Môn học', 'Thời khóa biểu'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold rounded-2xl transition duration-300 ${
                activeTab === tab
                  ? 'bg-[#3F51B5] text-white shadow-lg shadow-indigo-100 scale-105 transform'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <i className={`${getTabIcon(tab)} text-base`} />
              {tab}
            </button>
          ))}
        </div>

        {/* Table Content */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_15px_40px_rgba(15,23,42,0.03)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold rounded-l-2xl">
                    {activeTab === 'Thời khóa biểu' ? 'Mã Lớp Áp Dụng' : 'Tên Danh Mục'}
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    {activeTab === 'Thời khóa biểu' ? 'Sơ đồ Lịch học (JSON)' : 'Mô Tả'}
                  </th>
                  <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                  <th className="px-6 py-4 font-semibold text-right rounded-r-2xl">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                        <span className="font-semibold text-sm">Đang đồng bộ dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat._id || cat.id} className="hover:bg-slate-50/50 transition duration-150">
                      <td className="px-6 py-4 font-bold text-[#3F51B5] text-sm">{cat.name}</td>
                      <td className="px-6 py-4">{renderDescription(cat)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block border ${
                          cat.status === 'active' 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                          {cat.status === 'active' ? 'Hoạt động' : 'Tạm ẩn'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition mr-2"
                          title="Chỉnh sửa"
                        >
                          <i className="fas fa-pen text-xs"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id || cat.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                          title="Xóa bỏ"
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                {filteredCategories.length === 0 && !loading && (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                          <i className={`${getTabIcon(activeTab)} text-slate-400 text-lg`} />
                        </div>
                        <p className="font-semibold text-slate-500">Chưa có danh mục `{activeTab}` nào được tạo lập.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? `Sửa Danh Mục ${activeTab}` : `Thêm Danh Mục ${activeTab} Mới`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{getNameLabel()}</label>
            <input
              type="text"
              required
              placeholder="Nhập tên/mã..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-medium">Phân loại danh mục</label>
            <input
              type="text"
              disabled
              value={formData.type}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 font-bold focus:outline-none text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                {formData.type === 'Thời khóa biểu' ? 'Cấu hình Thời khóa biểu (Định dạng JSON)' : 'Mô Tả'}
              </label>
              {formData.type === 'Thời khóa biểu' && (
                <button
                  type="button"
                  onClick={() => setFormData(p => ({
                    ...p,
                    description: JSON.stringify([
                      { "day": "Thứ 2", "time": "07:30 - 10:00", "subject": "Lập trình Web", "room": "A201" },
                      { "day": "Thứ 4", "time": "13:00 - 15:30", "subject": "Cơ sở dữ liệu", "room": "B105" },
                      { "day": "Thứ 6", "time": "07:30 - 10:00", "subject": "Toán ứng dụng", "room": "C302" }
                    ], null, 2)
                  }))}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded"
                >
                  <i className="fas fa-magic text-[10px]" /> ✨ Tải mẫu chuẩn
                </button>
              )}
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={formData.type === 'Thời khóa biểu' ? 'Ví dụ: [{"day": "Thứ 2", "time": "07:30 - 10:00", "subject": "Lập trình Web", "room": "A201"}]' : 'Nhập mô tả chi tiết...'}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-mono text-xs"
              rows={formData.type === 'Thời khóa biểu' ? 8 : 4}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Trạng Thái</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm ẩn</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition text-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 font-semibold transition text-sm"
            >
              {editingCategory ? 'Lưu Thay Đổi' : 'Tạo Mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoriesView;
