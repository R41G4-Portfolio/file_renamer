import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Spinner from '../../Spinner';
import { api } from '../../../services/api';
import './TemplateDetails.css';

const TemplateDetails = ({ templateId, user, onClose, onRefresh }) => {
	const [loading, setLoading] = useState(true);
	const [template, setTemplate] = useState(null);
	const [assignments, setAssignments] = useState([]);
	const [uploading, setUploading] = useState({});

	useEffect(() => {
		if (!templateId) {
			Swal.fire('Error', 'No se recibió ID de plantilla', 'error');
			if (onClose) onClose();
			return;
		}

		const fetchData = async () => {
			try {
				setLoading(true);
				const templateData = await api.getTemplateById(templateId);
				setTemplate(templateData);
				setAssignments(templateData.assignments || []);
			} catch (error) {
				console.error(error);
				Swal.fire('Error', error.message || 'Error al cargar la plantilla', 'error');
				if (onClose) onClose();
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [templateId, onClose]);

	const handleFileUpload = async (assignmentId) => {
		const fileInput = document.getElementById(`file-${assignmentId}`);
		const file = fileInput?.files[0];

		if (!file) {
			Swal.fire('Error', 'Selecciona un archivo', 'warning');
			return;
		}

		setUploading(prev => ({ ...prev, [assignmentId]: true }));

		try {
			await api.uploadAssignmentFile(assignmentId, file);
			Swal.fire('Éxito', 'Archivo subido correctamente', 'success');
			const updated = await api.getTemplateById(templateId);
			setTemplate(updated);
			setAssignments(updated.assignments || []);
			if (onRefresh) onRefresh();
		} catch (error) {
			Swal.fire('Error', error.message || 'Error al subir archivo', 'error');
		} finally {
			setUploading(prev => ({ ...prev, [assignmentId]: false }));
		}
	};

	const handleApprove = async () => {
		const result = await Swal.fire({
			title: '¿Aprobar plantilla?',
			text: 'Todos los archivos deben estar subidos',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Sí, aprobar',
			cancelButtonText: 'Cancelar'
		});
		
		if (!result.isConfirmed) return;
		
		try {
			await api.approveTemplate(templateId);
			Swal.fire('Aprobada', 'Plantilla aprobada correctamente', 'success');
			const updated = await api.getTemplateById(templateId);
			setTemplate(updated);
			setAssignments(updated.assignments || []);
			if (onRefresh) onRefresh();
		} catch (error) {
			Swal.fire('Error', error.message || 'Error al aprobar', 'error');
		}
	};

	const handleCancelTemplate = async () => {
		const result = await Swal.fire({
			title: '¿Cancelar plantilla?',
			text: 'Se perderán todos los avances',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			confirmButtonText: 'Sí, cancelar',
			cancelButtonText: 'Volver'
		});
		
		if (!result.isConfirmed) return;
		
		try {
			await api.cancelTemplate(templateId);
			Swal.fire('Cancelada', 'Plantilla cancelada correctamente', 'success');
			if (onRefresh) onRefresh();
			if (onClose) onClose();
		} catch (error) {
			Swal.fire('Error', error.message || 'Error al cancelar', 'error');
		}
	};

	const handleDownloadZip = async () => {
		try {
			const blob = await api.downloadZip(templateId);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `documentos_${templateId}.zip`;
			a.click();
			window.URL.revokeObjectURL(url);
			Swal.fire('Descarga iniciada', 'El ZIP se está descargando', 'success');
		} catch (error) {
			Swal.fire('Error', error.message || 'Error al descargar ZIP', 'error');
		}
	};

	const allUploaded = assignments.length > 0 && assignments.every(a => a.status === 'UPLOADED');

	if (loading) return <Spinner />;
	if (!template) return <div className="template-details__error">Plantilla no encontrada</div>;

	return (
		<div className="template-details">
			<div className="template-details__card">
				<h2>{template.title || 'Sin título'}</h2>
				
				<div className="template-details__info">
					<p><strong>Archivo:</strong> {template.excelFileName}</p>
					<p><strong>Filas:</strong> {template.rowCount}</p>
					<p><strong>Estado:</strong> 
						<span className={`status-badge status-badge--${template.status?.toLowerCase()}`}>
							{template.status === 'ACTIVE' ? 'Activa' : template.status === 'COMPLETED' ? 'Completada' : 'Cancelada'}
						</span>
					</p>
					<p><strong>Asignado a:</strong> {template.assignedTo?.name || 'No asignado'}</p>
				</div>

				<div className="template-details__assignments">
					<h3>Documentos requeridos</h3>
					<div className="template-details__table-container">
						<table className="template-details__table">
							<thead>
								<tr>
									<th>Ruta</th>
									<th>Nombre deseado</th>
									<th>Estado</th>
									<th>Vista previa</th>
								</tr>
							</thead>
							<tbody>
								{assignments.map((assignment, index) => {
									const uniqueKey = assignment.id || assignment._id || index;
									return (
										<tr key={uniqueKey}>
											<td>{assignment.ruta}</td>
											<td>{assignment.nombreDeseado}</td>
											<td>
												<span className={`status-badge status-badge--${assignment.status?.toLowerCase()}`}>
													{assignment.status === 'PENDING' ? 'Pendiente' : 
													 assignment.status === 'UPLOADED' ? 'Subido' : 'Fallido'}
												</span>
												</td>
											<td className="template-details__preview-cell">
												{assignment.filePath ? (
													<a 
														href={`http://localhost:5000/${assignment.filePath}`}
														target="_blank"
														rel="noopener noreferrer"
														className="template-details__preview-link"
													>
														Ver
													</a>
												) : (
													<span className="template-details__no-file">No subido</span>
												)}
												</td>
											</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>

				<div className="template-details__actions">
					{template.status === 'ACTIVE' && (
						<button className="template-details__cancel-btn" onClick={handleCancelTemplate}>
							Cancelar plantilla
						</button>
					)}
					
					{template.status === 'ACTIVE' && allUploaded && (
						<button className="template-details__approve-btn" onClick={handleApprove}>
							Aprobar plantilla
						</button>
					)}

					{template.status === 'COMPLETED' && template.zipPath && (
						<button className="template-details__download-btn" onClick={handleDownloadZip}>
							Descargar ZIP
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default TemplateDetails;