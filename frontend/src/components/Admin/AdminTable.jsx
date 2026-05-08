import Swal from 'sweetalert2';
import { api } from '../../services/api';
import styles from './AdminPage.module.css';

const AdminTable = ({ templates, onRefresh }) => {
	const handleCancelTemplate = async (templateId) => {
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
		} catch (error) {
			Swal.fire('Error', error.message || 'Error al cancelar', 'error');
		}
	};

	const getStatusClass = (status) => {
		switch (status) {
			case 'ACTIVE': return `${styles.statusBadge} ${styles.statusActive}`;
			case 'COMPLETED': return `${styles.statusBadge} ${styles.statusCompleted}`;
			case 'CANCELLED': return `${styles.statusBadge} ${styles.statusCancelled}`;
			default: return `${styles.statusBadge} ${styles.statusActive}`;
		}
	};

	const getStatusText = (status) => {
		switch (status) {
			case 'ACTIVE': return 'Activa';
			case 'COMPLETED': return 'Completada';
			case 'CANCELLED': return 'Cancelada';
			default: return status;
		}
	};

	return (
		<div className={styles.tableContainer}>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>Título</th>
						<th>Estado</th>
						<th>Asignado a</th>
						<th>Filas</th>
						<th>Archivos subidos</th>
						<th>Fecha</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{templates.map((template) => {
						const uploadedCount = template.assignments?.filter(a => a.status === 'UPLOADED').length || 0;
						const totalCount = template.assignments?.length || 0;
						return (
							<tr key={template.id}>
								<td>{template.title || 'Sin título'}</td>
								<td>
									<span className={getStatusClass(template.status)}>
										{getStatusText(template.status)}
									</span>
								</td>
								<td>{template.assignedTo?.name || 'No asignado'}</td>
								<td style={{ textAlign: 'center' }}>{totalCount}</td>
								<td style={{ textAlign: 'center' }}>{uploadedCount} / {totalCount}</td>
								<td>{new Date(template.uploadedAt).toLocaleDateString()}</td>
								<td style={{ textAlign: 'center' }}>
									{template.status === 'ACTIVE' && (
										<button 
											className={styles.cancelBtn}
											onClick={() => handleCancelTemplate(template.id)}
										>
											Cancelar
										</button>
									)}
									{template.zipPath && (
										<a 
											href={`http://localhost:5000/zip/download/${template.id}`}
											className={styles.downloadLink}
										>
											Descargar ZIP
										</a>
									)}
									{template.status === 'COMPLETED' && !template.zipPath && (
										<button 
											className={styles.generateBtn}
											onClick={() => {
												// TODO: implementar generación de ZIP
											}}
										>
											Generar ZIP
										</button>
									)}
									{template.status !== 'ACTIVE' && !template.zipPath && template.status !== 'COMPLETED' && (
										<span className={styles.noAction}>—</span>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default AdminTable;