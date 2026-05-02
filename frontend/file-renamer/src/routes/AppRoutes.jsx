// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoutes';
import PublicRoute from './PublicRoutes';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Dashboard from '../components/dashboard/Dashboard';
import UploadPage from '../pages/UploadPage';
import DownloaderPanel from '../pages/DownloaderPage';
import AdminMonitor from '../pages/AdminPage';

const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
			<Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
			
			<Route path="/upload" element={<PrivateRoute allowedRoles={['ADMIN', 'UPLOADER']}><UploadPage /></PrivateRoute>} />
			
			<Route path="/dashboard" element={<PrivateRoute allowedRoles={['ADMIN', 'UPLOADER']}><Dashboard /></PrivateRoute>} />
			
			<Route path="/my-tasks" element={<PrivateRoute allowedRoles={['DOWNLOADER']}><DownloaderPanel /></PrivateRoute>} />
			
			<Route path="/admin/monitor" element={<PrivateRoute allowedRoles={['ADMIN']}><AdminMonitor /></PrivateRoute>} />
			
			<Route path="/" element={<PrivateRoute allowedRoles={['ADMIN', 'UPLOADER']}><Dashboard /></PrivateRoute>} />
		</Routes>
	);
};

export default AppRoutes;