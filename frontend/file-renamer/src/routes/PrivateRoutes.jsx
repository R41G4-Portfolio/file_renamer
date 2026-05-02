import Spinner from '../components/Spinner';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoutes = ({ children, allowedRoles = [] }) => {
	const { isAuthenticated, loading, user } = useAuth();

	if (loading) {
		return <Spinner />;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" />;
	}

	// Si se especifican roles permitidos, verificar que el usuario tenga uno
	if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
		// Redirigir según el rol del usuario
		if (user?.role === 'DOWNLOADER') {
			return <Navigate to="/my-tasks" />;
		}
		return <Navigate to="/dashboard" />;
	}

	return children;
};

export default PrivateRoutes;