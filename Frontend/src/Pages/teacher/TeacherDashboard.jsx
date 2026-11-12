import React, { useState, useEffect } from 'react';
import TeacherLayout from '../../Components/layout/TeacherLayout';
import teacherService from '../../services/teacherService';
import { useAuth } from '../../contexts/AuthContext';
import {
  TeacherOverviewView,
  TeacherClassesView,
  TeacherStudentsView,
  TeacherAttendanceView,
  TeacherAnnouncementsView,
  TeacherTasksView,
  TeacherProfileView,
} from './TeacherViews';

const TeacherDashboard = () => {
  const [currentView, setCurrentView] = useState('overview');
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const teachersData = await teacherService.fetchTeachers();
      const found = teachersData.find((t) => {
        const prefix = t.email?.split('@')[0];
        return prefix === currentUser?.username || t.teacherId === currentUser?.username;
      });

      if (found) {
        setProfile(found);
      } else {
        // Dự phòng nếu chưa có hồ sơ
        setProfile({
          teacherId: currentUser?.username || 'GV00001',
          name: currentUser?.fullName || 'Giáo viên',
          dob: '1985-01-01',
          gender: 'Nam',
          department: 'Khoa Công nghệ thông tin',
          email: `${currentUser?.username || 'teacher'}@school.edu.vn`,
          phone: '0901234567',
          specialization: 'Kỹ thuật phần mềm',
          assignedClass: 'Chưa phân lớp',
          status: 'active',
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu giáo viên từ API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const handleProfileUpdate = async (updatedFields) => {
    if (!profile?._id) return;
    try {
      const response = await teacherService.updateTeacher(profile._id, updatedFields);
      setProfile(response);
      return response;
    } catch (error) {
      console.error('Lỗi khi cập nhật hồ sơ giáo viên:', error);
      throw error;
    }
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
            <p className="text-sm font-semibold text-slate-500">Đang tải thông tin cá nhân...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'overview':
        return <TeacherOverviewView profile={profile} />;
      case 'classes':
        return <TeacherClassesView profile={profile} />;
      case 'students':
        return <TeacherStudentsView profile={profile} />;
      case 'attendance':
        return <TeacherAttendanceView profile={profile} />;
      case 'announcements':
        return <TeacherAnnouncementsView profile={profile} />;
      case 'tasks':
        return <TeacherTasksView />;
      case 'profile':
        return <TeacherProfileView profile={profile} onUpdate={handleProfileUpdate} />;
      default:
        return <TeacherOverviewView profile={profile} />;
    }
  };

  return (
    <TeacherLayout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </TeacherLayout>
  );
};

export default TeacherDashboard;