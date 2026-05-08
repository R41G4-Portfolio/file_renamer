import Spinner from '../components/Spinner';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoutes = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) return <Spinner />;

    if (!isAuthenticated) {
        return <Navigate to={INTERNAL_ROUTES.LOGIN} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        // Redirección inteligente basada en el rol actual del usuario
        if (user?.role === 'DOWNLOADER') {
            return <Navigate to={INTERNAL_ROUTES.ASSIGNMENTS} replace />;
        }
        return <Navigate to={INTERNAL_ROUTES.DASHBOARD} replace />;
    }

    return children;
};

export default PrivateRoutes;