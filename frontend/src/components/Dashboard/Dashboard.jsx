import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Spinner';
import TemplateTable from './TemplatesTable';
import TemplateDetails from './TemplateDetails';
import { api } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const [loading, setLoading] = useState(true);
	const [templates, setTemplates] = useState([]);
	const [selectedTemplateId, setSelectedTemplateId] = useState(null);
	const [showDetails, setShowDetails] = useState(false);

	useEffect(() => {
		if (user) {
			fetchTemplates();
		}
	}, [user]);

	const fetchTemplates = async () => {
		try {
			const data = await api.getTemplates();
			setTemplates(data);
		} catch (error) {
			console.error('Error:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	const handleViewDetails = (templateId) => {
		setSelectedTemplateId(templateId);
		setShowDetails(true);
	};

	const handleCloseDetails = () => {
		setShowDetails(false);
		setSelectedTemplateId(null);
	};

	if (loading)
		return <Spinner />;

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

				<TemplateTable 
					templates={templates} 
					user={user}
					onViewDetails={handleViewDetails}
					onRefresh={fetchTemplates}
				/>

				{/* Modal de detalles (no ruta, no URL expuesta) */}
				{showDetails && (
					<div className="modal-overlay" onClick={handleCloseDetails}>
						<div className="modal-content modal-content--large" onClick={(e) => e.stopPropagation()}>
							<button className="modal-close" onClick={handleCloseDetails}>✕</button>
							<TemplateDetails 
								templateId={selectedTemplateId}
								onClose={handleCloseDetails}
								onRefresh={fetchTemplates}
							/>
						</div>
					</div>
				)}
			</main>
		</div>
	);
};

export default Dashboard;