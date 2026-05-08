import Spinner from '../components/Spinner';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import { INTERNAL_ROUTES } from '../constants/routes';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) return <Spinner />;

    if (isAuthenticated) {
        // Si ya entró, lo mandamos a su sitio correspondiente según rol
        if (user?.role === 'DOWNLOADER') {
            return <Navigate to={INTERNAL_ROUTES.ASSIGNMENTS} replace />;
        }
        return <Navigate to={INTERNAL_ROUTES.DASHBOARD} replace />;
    }

    return children;
};

export default PublicRoute;