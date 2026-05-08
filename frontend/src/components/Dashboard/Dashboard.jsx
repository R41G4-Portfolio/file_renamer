import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';

// Componentes
import TemplatesTable from './TemplatesTable';
import Spinner from '../Spinner';

// Utilidades y Constantes
import Swal from 'sweetalert2';
import { INTERNAL_ROUTES } from '../../constants/routes';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState([]);

    // Efecto para cargar los datos cuando el usuario está autenticado
    useEffect(() => {
        if (user) {
            fetchTemplates();
        } else {
            setLoading(false);
        }
    }, [user, isAuthenticated]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const response = await api.getTemplates();
            
            if (response.success && response.data) {
                setTemplates(response.data);
            }
        } catch (error) {
            console.error('Dashboard Error:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'No se pudieron cargar las plantillas',
                icon: 'error',
                confirmButtonColor: '#28a745'
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="dashboard">
            {/* Contenedor de acciones superiores */}
            <div className="dashboard__actions">
                {(user?.role === 'ADMIN' || user?.role === 'UPLOADER') && (
                    <button
                        className="btn btn--success dashboard__create-btn"
                        onClick={() => navigate(INTERNAL_ROUTES.UPLOAD)}
                    >
                        <span>+</span> Crear tarea nueva
                    </button>
                )}
            </div>

            {/* Contenedor de la tabla de datos */}
            <div className="dashboard__content">
                <TemplatesTable
                    templates={templates}
                    user={user}
                    onRefresh={fetchTemplates}
                />
            </div>
        </div>
    );
};

export default Dashboard;