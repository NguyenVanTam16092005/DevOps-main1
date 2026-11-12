import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../Pages/login/LoginPage';
import StudentManagementPage from '../features/student/pages/StudentManagementPage';
import TeacherDashboard from '../Pages/teacher/TeacherDashboard';
import AdminDashboard from '../Pages/admin/AdminDashboard';
import StudentDashboard from '../Pages/student/StudentDashboard';
import ProtectedRoute from './ProtectedRoute';
import { getRoleHome, useAuth } from '../contexts/AuthContext';

const HomeRedirect = () => {
  const { currentUser } = useAuth();

  return <Navigate to={currentUser ? getRoleHome(currentUser.role) : '/login'} replace />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/students"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <Navigate to="/admin" replace />
          }
        />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;