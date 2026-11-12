import React, { useState, useEffect } from 'react';
import Modal from '../../Components/common/Modal';
import StatsCard from '../../Components/common/StatsCard';
import Badge from '../../Components/common/Badge';
import { useToast } from '../../Components/common/ToastNotification';
import studentService from '../../features/student/services/studentService';
import userService from '../../services/userService';
import notificationService from '../../services/notificationService';
import { teacherClasses, teacherStudents, teacherTasks } from '../../data/portalData';

// Helper to normalize and map student data from backend
const mapBackendStudent = (s) => ({
  id: s.studentId,
  name: s.name,
  className: s.studentClass,
  score: s.gpa !== undefined ? s.gpa : 8.5,
  attendance: s.attendanceRate !== undefined ? `${s.attendanceRate}% Chuyên cần` : '95% Chuyên cần',
  original: s
});

// ─── Overview ────────────────────────────────────────────────────────────────
export const TeacherOverviewView = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await studentService.fetchStudents();
        if (data && data.length > 0) {
          setStudents(data);
        } else {
          setStudents(teacherStudents.map(s => ({
            studentId: s.id,
            name: s.name,
            studentClass: s.className
          })));
        }
      } catch (err) {
        console.error(err);
        setStudents(teacherStudents.map(s => ({
          studentId: s.id,
          name: s.name,
          studentClass: s.className
        })));
      }
    };
    load();
  }, []);

  const uniqueClasses = Array.from(new Set(students.map(s => s.studentClass))).filter(Boolean);

  const stats = [
    { title: 'Lớp phụ trách', value: uniqueClasses.length || teacherClasses.length, icon: 'fas fa-chalkboard', colorClass: 'text-[#2E7D32]', bgClass: 'bg-green-50' },
    { title: 'Học sinh theo dõi', value: students.length || teacherStudents.length, icon: 'fas fa-user-graduate', colorClass: 'text-[#3F51B5]', bgClass: 'bg-indigo-50' },
    { title: 'Chuyên cần TB', value: '94%', icon: 'fas fa-clipboard-check', colorClass: 'text-[#EF6C00]', bgClass: 'bg-orange-50' },
  ];

  const classesData = uniqueClasses.map(className => {
    const classStudents = students.filter(s => s.studentClass === className);
    return {
      name: className,
      subject: 'Giảng dạy',
      size: classStudents.length,
      attendance: 95,
      nextLesson: 'Xem lịch chi tiết'
    };
  });

  const displayClasses = classesData.length > 0 ? classesData : teacherClasses;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32]">Tổng Quan</p>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Dashboard Giáo Viên</h1>
        <p className="mt-2 text-sm text-slate-500">Theo dõi lớp học, học sinh và thực hiện các thao tác nhanh (Đã đồng bộ dữ liệu từ Admin).</p>
      </header>

      <section className="mt-6 grid gap-6 md:grid-cols-3">
        {stats.map((item) => <StatsCard key={item.title} {...item} />)}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Lớp phụ trách */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Lớp & Môn phụ trách</h2>
          <div className="space-y-3">
            {displayClasses.map((item) => (
              <div key={item.name} className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">Lớp {item.name}</p>
                    <p className="text-sm text-slate-500">Môn: {item.subject}</p>
                  </div>
                  <Badge type={item.attendance > 95 ? 'Nam' : 'Nữ'} text={`${item.attendance}%`} />
                </div>
                <div className="mt-2 flex gap-3 text-xs text-slate-500">
                  <span className="rounded-full bg-white px-3 py-1 border">Sĩ số: {item.size}</span>
                  <span className="rounded-full bg-white px-3 py-1 border">Tiếp theo: {item.nextLesson}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nhiệm vụ */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Nhiệm vụ cần làm</h2>
          <div className="space-y-3">
            {teacherTasks.map((task) => (
              <div key={task} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <i className="fas fa-circle-check text-green-500" />
                {task}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── Classes ─────────────────────────────────────────────────────────────────
export const TeacherClassesView = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await studentService.fetchStudents();
        if (data && data.length > 0) {
          setStudents(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const uniqueClasses = Array.from(new Set(students.map(s => s.studentClass))).filter(Boolean);
  const classesData = uniqueClasses.map(className => {
    const classStudents = students.filter(s => s.studentClass === className);
    return {
      name: className,
      subject: 'Giảng dạy',
      size: classStudents.length,
      attendance: 95,
      nextLesson: 'Xem lịch học'
    };
  });

  const displayClasses = classesData.length > 0 ? classesData : teacherClasses;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32]">Quản Lý</p>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Lớp Phụ Trách</h1>
      </header>
      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayClasses.map((item) => (
          <div key={item.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                <i className="fas fa-chalkboard text-[#2E7D32] text-xl" />
              </div>
              <Badge type={item.attendance > 95 ? 'Nam' : 'Nữ'} text={`${item.attendance}% chuyên cần`} />
            </div>
            <h3 className="mt-4 text-xl font-black text-slate-900">Lớp {item.name}</h3>
            <p className="text-sm text-slate-500 mt-1">Môn: {item.subject}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-xs text-slate-400 mb-1">Sĩ số</p>
                <p className="font-bold text-slate-900">{item.size}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-xs text-slate-400 mb-1">Buổi tiếp</p>
                <p className="font-bold text-slate-900 text-xs">{item.nextLesson}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

// ─── Students List ────────────────────────────────────────────────────────────
// ─── Students List ────────────────────────────────────────────────────────────
export const TeacherStudentsView = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [componentScores, setComponentScores] = useState({ midterm: 8.5, finalScore: 8.5, attendance: 9.5 });
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await studentService.fetchStudents();
      if (data && data.length > 0) {
        setStudents(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleEditGrade = (student) => {
    setEditingStudent(student);
    const orig = student.original || {};
    setComponentScores({
      midterm: orig.midtermScore !== undefined ? orig.midtermScore : student.score,
      finalScore: orig.finalScore !== undefined ? orig.finalScore : student.score,
      attendance: orig.attendanceScore !== undefined ? orig.attendanceScore : (orig.attendanceRate ? orig.attendanceRate / 10 : 9.5)
    });
    setIsGradeModalOpen(true);
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    const { midterm, finalScore, attendance } = componentScores;
    if (
      midterm < 0 || midterm > 10 ||
      finalScore < 0 || finalScore > 10 ||
      attendance < 0 || attendance > 10
    ) {
      toast('Điểm số phải nằm trong khoảng từ 0 đến 10.', 'error');
      return;
    }

    const calculatedGpa = Number((midterm * 0.3 + finalScore * 0.6 + attendance * 0.1).toFixed(2));
    const calculatedAttendanceRate = Math.round(attendance * 10);

    try {
      const orig = editingStudent.original;
      if (orig) {
        await studentService.updateStudent(orig._id, {
          ...orig,
          midtermScore: Number(midterm),
          finalScore: Number(finalScore),
          attendanceScore: Number(attendance),
          gpa: calculatedGpa,
          attendanceRate: calculatedAttendanceRate
        });
        toast(`Đã nhập sổ điểm chi tiết cho học sinh ${editingStudent.name} thành công!`);
        setIsGradeModalOpen(false);
        load();
      }
    } catch (err) {
      toast('Lỗi khi lưu điểm số mới lên backend.', 'error');
    }
  };

  const displayStudents = students.length > 0 ? students.map(mapBackendStudent) : teacherStudents.map(s => ({
    id: s.id,
    name: s.name,
    className: s.className,
    score: s.score,
    attendance: s.attendance,
    original: null
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32]">Theo Dõi</p>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Danh Sách Học Sinh</h1>
      </header>
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="text-center py-6 text-slate-500">Đang tải học sinh...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">MSSV</th>
                <th className="px-6 py-4 font-semibold">Họ tên</th>
                <th className="px-6 py-4 font-semibold">Lớp</th>
                <th className="px-6 py-4 font-semibold">Điểm GPA</th>
                <th className="px-6 py-4 font-semibold">Chuyên cần</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-mono text-slate-500">{student.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{student.name}</td>
                  <td className="px-6 py-4 text-slate-600">{student.className}</td>
                  <td className="px-6 py-4 font-bold text-[#2E7D32]">{student.score}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-semibold">
                      {student.attendance}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {student.original && (
                      <button
                        onClick={() => handleEditGrade(student)}
                        className="rounded-lg bg-[#2E7D32] px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-800 transition"
                      >
                        <i className="fas fa-edit mr-1" /> Nhập điểm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <Modal isOpen={isGradeModalOpen} onClose={() => setIsGradeModalOpen(false)} title="Nhập sổ điểm chi tiết">
        {editingStudent && (
          <form onSubmit={handleSaveGrade} className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Họ và tên học sinh</p>
              <p className="text-base font-bold text-slate-900 mt-1">{editingStudent.name} ({editingStudent.id})</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-700">Chuyên cần (10%)</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={componentScores.attendance}
                  onChange={(e) => setComponentScores(p => ({ ...p, attendance: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-700">Giữa kỳ (30%)</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={componentScores.midterm}
                  onChange={(e) => setComponentScores(p => ({ ...p, midterm: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-700">Cuối kỳ (60%)</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={componentScores.finalScore}
                  onChange={(e) => setComponentScores(p => ({ ...p, finalScore: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
                />
              </label>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-center">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest block">Điểm trung bình (GPA) dự kiến</span>
              <span className="text-2xl font-black text-[#2E7D32] mt-1 block">
                {(componentScores.midterm * 0.3 + componentScores.finalScore * 0.6 + componentScores.attendance * 0.1).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsGradeModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Hủy</button>
              <button type="submit" className="rounded-xl bg-[#2E7D32] px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition">Lưu điểm</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

// ─── Attendance ───────────────────────────────────────────────────────────────
export const TeacherAttendanceView = () => {
  const [rows, setRows] = useState([]);
  const [rawStudents, setRawStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await studentService.fetchStudents();
        if (data && data.length > 0) {
          setRawStudents(data);
          setRows(data.map(s => ({
            id: s.studentId,
            name: s.name,
            className: s.studentClass,
            attendance: 'Có mặt'
          })));
        } else {
          setRows(teacherStudents);
        }
      } catch (err) {
        console.error(err);
        setRows(teacherStudents);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggle = (id) => {
    setRows((prev) =>
      prev.map((s) =>
        s.id !== id ? s : { ...s, attendance: s.attendance === 'Vắng' ? 'Có mặt' : 'Vắng' }
      )
    );
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (rawStudents.length > 0) {
        for (const row of rows) {
          const orig = rawStudents.find(s => s.studentId === row.id);
          if (orig) {
            const currentRate = orig.attendanceRate !== undefined ? orig.attendanceRate : 95;
            const nextRate = row.attendance === 'Vắng' ? Math.max(currentRate - 5, 0) : Math.min(currentRate + 1, 100);
            await studentService.updateStudent(orig._id, {
              ...orig,
              attendanceRate: nextRate
            });
          }
        }
      }
      setSaved(true);
      toast('Đã lưu kết quả điểm danh và đồng bộ hóa thành công với backend.');
    } catch (err) {
      toast('Lỗi khi đồng bộ kết quả điểm danh lên hệ thống.', 'error');
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32]">Chuyên Cần</p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">Điểm Danh</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`rounded-xl bg-[#2E7D32] px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 transition ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <i className="fas fa-save mr-2" />{saving ? 'Đang lưu kết quả...' : 'Lưu điểm danh'}
        </button>
      </header>

      {saved && (
        <div className="mt-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <i className="fas fa-check-circle mr-2" />Đã lưu kết quả điểm danh thành công.
        </div>
      )}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Sinh viên</th>
              <th className="px-6 py-4 font-semibold">Lớp</th>
              <th className="px-6 py-4 font-semibold">Trạng thái</th>
              <th className="px-6 py-4 font-semibold text-right">Đổi trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-semibold text-slate-900">{student.name}</td>
                <td className="px-6 py-4 text-slate-600">{student.className}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    student.attendance === 'Vắng' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                  }`}>
                    {student.attendance}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => toggle(student.id)}
                    className="rounded-lg bg-[#2E7D32] px-3 py-2 text-xs font-semibold text-white hover:bg-green-800 transition"
                  >
                    Đổi trạng thái
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

// ─── Announcements ────────────────────────────────────────────────────────────
export const TeacherAnnouncementsView = () => {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await notificationService.fetchNotifications();
      const filtered = data.filter(n => n.type === 'teacher' || n.audience === 'all' || n.type === 'system');
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAnnouncements(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) {
      toast('Vui lòng nhập đầy đủ tiêu đề và nội dung.', 'error');
      return;
    }
    try {
      await notificationService.createNotification({
        title: title.trim(),
        content: text.trim(),
        type: 'teacher',
        audience: 'students',
        status: 'published'
      });
      setTitle('');
      setText('');
      setIsOpen(false);
      toast('Đã gửi thông báo đến lớp học thành công.');
      fetchAnnouncements();
    } catch (err) {
      toast('Không thể gửi thông báo tới backend.', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32]">Truyền Thông</p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">Gửi Thông Báo</h1>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-xl bg-[#2E7D32] px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 transition"
        >
          <i className="fas fa-bullhorn mr-2" />Tạo thông báo mới
        </button>
      </header>

      <section className="mt-6 space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Đang tải thông báo từ hệ thống...</div>
        ) : announcements.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <i className="fas fa-bullhorn text-4xl text-slate-300 mb-4" />
            <p className="text-slate-500">Chưa có thông báo nào được gửi.</p>
          </div>
        ) : (
          announcements.map((item) => (
            <article key={item._id || item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <i className="fas fa-bullhorn text-[#2E7D32]" />
                  </div>
                  <span className="font-semibold text-slate-900">{item.title}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : 'Vừa xong'}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-6">{item.content}</p>
            </article>
          ))
        )}
      </section>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Gửi thông báo cho lớp">
        <form onSubmit={handleSend} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Tiêu đề thông báo</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
              placeholder="Ví dụ: Lịch kiểm tra giữa kỳ lớp CNTT01"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Nội dung thông báo</span>
            <textarea
              rows="4"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
              placeholder="Nhập nội dung thông báo cho lớp hoặc sinh viên..."
            />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Hủy</button>
            <button type="submit" className="rounded-xl bg-[#2E7D32] px-4 py-2.5 text-sm font-semibold text-white">Gửi thông báo</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};


// ─── Tasks ────────────────────────────────────────────────────────────────────
export const TeacherTasksView = () => {
  const [tasks, setTasks] = useState(teacherTasks.map((t, i) => ({ id: i, text: t, done: false })));

  const toggle = (id) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32]">Công Việc</p>
        <h1 className="mt-1 text-3xl font-black text-slate-900">Nhiệm Vụ</h1>
      </header>
      <section className="mt-6 space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggle(task.id)}
            className={`flex items-center gap-4 rounded-2xl border p-5 cursor-pointer transition ${
              task.done ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 hover:border-green-300'
            }`}
          >
            <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
              task.done ? 'bg-[#2E7D32] border-[#2E7D32]' : 'border-slate-300'
            }`}>
              {task.done && <i className="fas fa-check text-white text-xs" />}
            </div>
            <span className={`text-sm font-medium transition ${task.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {task.text}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
};

// ─── Profile & Security ───────────────────────────────────────────────────────
export const TeacherProfileView = ({ profile, onUpdate }) => {
  const toast = useToast();
  const [draft, setDraft] = useState({ phone: '', email: '', specialization: '' });
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const openModal = () => {
    setDraft({
      phone: profile?.phone || '',
      email: profile?.email || '',
      specialization: profile?.specialization || '',
    });
    setIsOpen(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(draft);
      setIsOpen(false);
      toast('Đã cập nhật thông tin liên hệ và chuyên môn.');
    } catch (err) {
      toast('Cập nhật hồ sơ thất bại.', 'error');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) {
      toast('Mật khẩu mới phải có ít nhất 6 ký tự.', 'error');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast('Xác nhận mật khẩu không khớp.', 'error');
      return;
    }
    try {
      const usersList = await userService.fetchUsers();
      const userObj = usersList.find(u => u.username === profile.teacherId || u.username === profile.email.split('@')[0]);
      if (userObj) {
        await userService.updateUser(userObj._id, { password: form.newPassword });
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast('Đã đổi mật khẩu thành công.');
      } else {
        toast('Không tìm thấy tài khoản người dùng đăng nhập.', 'error');
      }
    } catch (err) {
      toast('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.', 'error');
    }
  };

  const fields = [
    ['Mã giáo viên', profile?.teacherId],
    ['Họ tên', profile?.name],
    ['Khoa quản lý', profile?.department],
    ['Lớp chủ nhiệm', profile?.assignedClass || 'Chưa phân lớp'],
    ['Chuyên môn giảng dạy', profile?.specialization || 'Chưa cập nhật'],
    ['Email liên hệ', profile?.email || 'Chưa cập nhật'],
    ['Số điện thoại', profile?.phone || 'Chưa cập nhật'],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2E7D32]">Hồ Sơ</p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">Thông Tin Giảng Viên</h1>
        </div>
        <button
          onClick={openModal}
          className="rounded-xl bg-[#2E7D32] px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition shadow-sm"
        >
          <i className="fas fa-pen mr-2" />Cập nhật thông tin liên hệ
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chi tiết hồ sơ */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Chi tiết hồ sơ giảng dạy</h2>
            <Badge type="Nam" text="Giáo viên" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-bold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bảo mật đổi mật khẩu */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Đổi mật khẩu</h2>
            <p className="text-xs text-slate-500 mb-4">Hãy thay đổi mật khẩu định kỳ để bảo vệ tài khoản cá nhân của bạn.</p>
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              {[
                ['currentPassword', 'Mật khẩu hiện tại'],
                ['newPassword', 'Mật khẩu mới'],
                ['confirmPassword', 'Xác nhận mật khẩu mới'],
              ].map(([name, label]) => (
                <label key={name} className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-700">{label}</span>
                  <input
                    type="password"
                    value={form[name]}
                    onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
                  />
                </label>
              ))}
              <button type="submit" className="w-full rounded-xl bg-[#2E7D32] px-4 py-2.5 text-xs font-semibold text-white hover:bg-green-700 transition">
                Cập nhật mật khẩu
              </button>
            </form>
          </div>
        </section>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Cập nhật thông tin liên hệ & chuyên môn">
        <form onSubmit={saveProfile} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email liên hệ</span>
            <input
              type="email"
              value={draft.email}
              onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))}
              placeholder="Nhập email mới..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Số điện thoại</span>
            <input
              type="text"
              value={draft.phone}
              onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))}
              placeholder="Nhập số điện thoại mới..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Chuyên môn giảng dạy</span>
            <input
              type="text"
              value={draft.specialization}
              onChange={(e) => setDraft((p) => ({ ...p, specialization: e.target.value }))}
              placeholder="Ví dụ: Kỹ thuật phần mềm, Cơ sở dữ liệu..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#2E7D32] focus:ring-4 focus:ring-green-100"
            />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Hủy</button>
            <button type="submit" className="rounded-xl bg-[#2E7D32] px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition">Lưu thay đổi</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
