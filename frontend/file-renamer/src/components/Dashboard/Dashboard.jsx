import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import TemplatesTable from './TemplatesTable';
import Swal from 'sweetalert2';
import Spinner from '../Spinner';
import './Dashboard.css';

const Dashboard = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const [loading, setLoading] = useState(true);
	const [templates, setTemplates] = useState([]);

	useEffect(() => {
		if (user) {
			fetchTemplates();
		}
	}, [user]);

	const fetchTemplates = async () => {
		try {
			const response = await api.getTemplates();
			if (response.success && response.data) {
				setTemplates(response.data);
			}
		} catch (error) {
			console.error('Error:', error);
			Swal.fire('Error', error.message || 'No se pudieron cargar las plantillas', 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	if (loading) return <Spinner />;

	return (
		<div className="dashboard">
			<header className="dashboard__header">
				<h1 className="dashboard__title">File Renamer</h1>
				<div className="dashboard__user-info">
					<span className="dashboard__user-name">{user?.name}</span>
					<span className="dashboard__user-role">{user?.role}</span>
					<button className="dashboard__logout" onClick={handleLogout}>
						Cerrar sesión
					</button>
				</div>
			</header>

			<main className="dashboard__main">
				<div className="dashboard__actions">
					{(user?.role === 'ADMIN' || user?.role === 'UPLOADER') && (
						<button
							className="dashboard__create-btn"
							onClick={() => navigate('/upload')}
						>
							+ Crear tarea nueva
						</button>
					)}
				</div>

				<TemplatesTable
					templates={templates}
					user={user}
					onRefresh={fetchTemplates}
				/>
			</main>
		</div>
	);
};

export default Dashboard;