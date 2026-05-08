// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoutes';
import PublicRoute from './PublicRoutes';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Dashboard from '../components/dashboard/Dashboard';
import UploadPage from '../pages/UploadPage';
import DownloaderPanel from '../pages/DownloaderPage';
import AdminMonitor from '../pages/AdminPage';

import { INTERNAL_ROUTES } from '../constants/routes';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Rutas Públicas */}
            <Route path={INTERNAL_ROUTES.LOGIN} element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path={INTERNAL_ROUTES.REGISTER} element={<PublicRoute><RegisterPage /></PublicRoute>} />
            
            {/* Rutas Privadas: ADMIN / UPLOADER */}
            <Route 
                path={INTERNAL_ROUTES.DASHBOARD} 
                element={<PrivateRoute allowedRoles={['ADMIN', 'UPLOADER']}><Dashboard /></PrivateRoute>} 
            />
            <Route 
                path="/upload" /* Si no está en constants, agrégalo a routes.js */
                element={<PrivateRoute allowedRoles={['ADMIN', 'UPLOADER']}><UploadPage /></PrivateRoute>} 
            />
            
            {/* Rutas Privadas: DOWNLOADER */}
            <Route 
                path={INTERNAL_ROUTES.ASSIGNMENTS} 
                element={<PrivateRoute allowedRoles={['DOWNLOADER']}><DownloaderPanel /></PrivateRoute>} 
            />
            
            {/* Rutas Privadas: ADMIN */}
            <Route 
                path={INTERNAL_ROUTES.AUDIT} 
                element={<PrivateRoute allowedRoles={['ADMIN']}><AdminMonitor /></PrivateRoute>} 
            />
            
            {/* Redirección por defecto */}
            <Route 
                path="/" 
                element={<Navigate to={INTERNAL_ROUTES.DASHBOARD} replace />} 
            />
        </Routes>
    );
};

export default AppRoutes;