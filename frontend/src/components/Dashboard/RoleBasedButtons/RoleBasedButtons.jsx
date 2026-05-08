import { useNavigate } from 'react-router-dom';

const RoleBasedButtons = ({ role }) => {
	const navigate = useNavigate();

	if (role === 'ADMIN')
	{
		return (
			<div className="dashboard__actions-group">
				<button 
					className="dashboard__action-btn dashboard__action-btn--primary"
					onClick={() => navigate('/upload')}
				>
					Subir plantilla Excel
				</button>
				<button className="dashboard__action-btn dashboard__action-btn--secondary">
					Asignar downloaders
				</button>
				<button className="dashboard__action-btn dashboard__action-btn--success">
					Autorizar plantillas completadas
				</button>
				<button className="dashboard__action-btn dashboard__action-btn--tertiary">
					Ver auditoría
				</button>
				<button className="dashboard__action-btn dashboard__action-btn--tertiary">
					Configuración
				</button>
			</div>
		);
	}

	if (role === 'UPLOADER')
	{
		return (
			<div className="dashboard__actions-group">
				<button 
					className="dashboard__action-btn dashboard__action-btn--primary"
					onClick={() => navigate('/upload')}
				>
					Subir plantilla Excel
				</button>
				<button className="dashboard__action-btn dashboard__action-btn--secondary">
					Asignar downloader a plantilla
				</button>
				<button className="dashboard__action-btn dashboard__action-btn--success">
					Autorizar plantillas completadas
				</button>
			</div>
		);
	}

	if (role === 'DOWNLOADER')
	{
		return (
			<>
				<div className="dashboard__actions-group">
					<button className="dashboard__action-btn dashboard__action-btn--primary">
						Ver plantillas asignadas
					</button>
				</div>
				<div className="dashboard__info">
					<p>Sube los archivos requeridos para cada plantilla.</p>
					<p>Cuando completes una plantilla, el uploader o admin podrá autorizarla para generar el ZIP.</p>
				</div>
			</>
		);
	}

	return null;
};

export default RoleBasedButtons;