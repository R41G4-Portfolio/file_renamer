import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import Swal from 'sweetalert2';
import Spinner from '../Spinner';
import DownloaderTable from './DownloaderTable';

const DownloaderPanel = () => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [templates, setTemplates] = useState([]);

	useEffect(() => {
		fetchMyTemplates();
	}, []);

	const fetchMyTemplates = async () => {
		try {
			console.log('Llamando a api.getMyAssignedTemplates()...');
			const myTemplates = await api.getMyAssignedTemplates();
			console.log('Respuesta:', myTemplates);
			setTemplates(myTemplates);
		} catch (error) {
			console.error('Error:', error);
			Swal.fire('Error', error.message || 'No se pudieron cargar tus tareas', 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleFileUpload = async (assignmentId) => {
		const fileInput = document.getElementById(`file-${assignmentId}`);
		const file = fileInput?.files[0];

		if (!file) {
			Swal.fire('Error', 'Selecciona un archivo', 'warning');
			return;
		}

		try {
			await api.uploadAssignmentFile(assignmentId, file);
			Swal.fire('Éxito', 'Archivo subido correctamente', 'success');
			fetchMyTemplates();
		} catch (error) {
			Swal.fire('Error', error.message || 'Error al subir archivo', 'error');
		}
	};

	if (loading) return <Spinner />;

	return (
		<div className="downloaderPanel">
			<h2>Mis tareas asignadas</h2>
			
			{templates.length === 0 ? (
				<p className="empty">
					No tienes tareas asignadas.
				</p>
			) : (
				templates.map(template => (
					<div key={template.id} className="templateCard">
						<h3>{template.title || 'Sin título'}</h3>
						<div className="templateInfo">
							<span>Estado: {template.status === 'ACTIVE' ? 'Activa' : 'Completada'}</span>
							<span>Fecha: {new Date(template.uploadedAt).toLocaleDateString()}</span>
						</div>
						<DownloaderTable 
							assignments={template.assignments || []}
							onUpload={handleFileUpload}
						/>
					</div>
				))
			)}
		</div>
	);
};

export default DownloaderPanel;