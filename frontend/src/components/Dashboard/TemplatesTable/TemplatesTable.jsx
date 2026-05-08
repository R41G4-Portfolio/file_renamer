import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import TemplateDetails from '../TemplateDetails';
import Swal from 'sweetalert2';
import { api } from '../../../services/api';

const TemplatesTable = ({ templates, user, onRefresh }) => {
	const [assigningId, setAssigningId] = useState(null);
	const [downloadersList, setDownloadersList] = useState([]);

	const loadDownloaders = async () => {
		if (downloadersList.length > 0) return downloadersList;
		try {
			const response = await fetch('http://localhost:5000/users/role/DOWNLOADER', {
				credentials: 'include'
			});
			const data = await response.json();
			setDownloadersList(data);
			return data;
		} catch (error) {
			console.error('Error:', error);
			return [];
		}
	};

	const handleAssign = async (templateId, email) => {
		try {
			await api.assignTemplate(templateId, email);
			Swal.fire('Éxito', 'Usuario asignado correctamente', 'success');
			if (onRefresh) onRefresh();
		} catch (error) {
			Swal.fire('Error', error.message || 'Error al asignar', 'error');
		}
		setAssigningId(null);
	};

	const openAssignSelect = async (templateId) => {
		const downloaders = await loadDownloaders();
		if (downloaders.length === 0) {
			Swal.fire('Info', 'No hay usuarios con rol DOWNLOADER', 'info');
			return;
		}
		setAssigningId(templateId);
	};

	const handleViewDetails = (templateId) => {
		const container = document.createElement('div');

		Swal.fire({
			title: 'Detalles de la plantilla',
			html: container,
			width: '95%',
			heightAuto: false,
			showConfirmButton: false,
			showCloseButton: true,
			didOpen: () => {
				const rootContainer = document.createElement('div');
				container.appendChild(rootContainer);
				const root = createRoot(rootContainer);
				root.render(
					<TemplateDetails
						templateId={templateId}
						user={user}
						onClose={() => Swal.close()}
						onRefresh={onRefresh}
					/>
				);
			}
		});
	};

	return (
		<div className="dashboard__table-container">
			<table className="dashboard__table">
				<thead>
					<tr>
						<th>Título</th>
						<th>Archivo</th>
						<th>Filas</th>
						<th>Estado</th>
						<th>Asignado a</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{templates.map((template) => (
						<tr key={template.id}>
							<td>{template.title || 'Sin título'}</td>
							<td>{template.excelFileName}</td>
							<td>{template.rowCount}</td>
							<td>
								<span className={`status-badge status-badge--${template.status?.toLowerCase()}`}>
									{template.status === 'ACTIVE' ? 'Activa' :
										template.status === 'COMPLETED' ? 'Completada' : 'Cancelada'}
								</span>
							</td>
							<td className="dashboard__assign-cell">
								{assigningId === template.id ? (
									<select
										className="dashboard__assign-select"
										defaultValue=""
										autoFocus
										onChange={(e) => handleAssign(template.id, e.target.value)}
										onBlur={() => setAssigningId(null)}
									>
										<option value="">Selecciona...</option>
										{downloadersList.map(d => (
											<option key={d.email} value={d.email}>
												{d.name} ({d.email})
											</option>
										))}
									</select>
								) : (
									<div className="dashboard__assign-display">
										<span>{template.assignedTo?.name || 'No asignado'}</span>
										{(user?.role === 'ADMIN' || user?.role === 'UPLOADER') && template.status === 'ACTIVE' && (
											<button
												className="dashboard__assign-btn"
												onClick={() => openAssignSelect(template.id)}
											>
												Cambiar
											</button>
										)}
									</div>
								)}
							</td>
							<td className="dashboard__actions-cell">
								<button
									className="dashboard__action-btn dashboard__action-btn--details"
									onClick={() => handleViewDetails(template.id)}
								>
									Ver detalles
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default TemplatesTable;