import React, { useState } from 'react';
import AdminLayout from '../../Components/layout/AdminLayout';
import StudentsView from './StudentsView';
import AccountsView from './AccountsView';
import NotificationsView from './NotificationsView';
import TeachersView from './TeachersView';
import CategoriesView from './CategoriesView';
import ActivityLogsView from './ActivityLogsView';

const AdminDashboard = () => {
	const [currentView, setCurrentView] = useState('students');


	const renderView = () => {
		switch (currentView) {
			case 'students':
				return <StudentsView />;
			case 'teachers':
				return <TeachersView />;
			case 'categories':
				return <CategoriesView />;
			case 'accounts':
				return <AccountsView />;
			case 'notifications':
				return <NotificationsView />;
			case 'logs':
				return <ActivityLogsView />;
			default:
				return <StudentsView />;
		}
	};

	return (
		<AdminLayout currentView={currentView} onViewChange={setCurrentView}>
			{renderView()}
		</AdminLayout>
	);
};

export default AdminDashboard;