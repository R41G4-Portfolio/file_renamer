import { useState } from 'react';
import styles from './DownloaderTable.module.css';

const DownloaderTable = ({ assignments, onUpload }) => {
	const [uploading, setUploading] = useState({});

	const handleUpload = async (assignmentId) => {
		const fileInput = document.getElementById(`file-${assignmentId}`);
		const file = fileInput?.files[0];

		if (!file) {
			alert('Selecciona un archivo');
			return;
		}

		setUploading(prev => ({ ...prev, [assignmentId]: true }));
		try {
			await onUpload(assignmentId);
			// Limpiar input después de subir
			fileInput.value = '';
		} finally {
			setUploading(prev => ({ ...prev, [assignmentId]: false }));
		}
	};

	return (
		<div className={styles.tableContainer}>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>Ruta</th>
						<th>Nombre deseado</th>
						<th>Estado</th>
						<th>Archivo</th>
						<th>Acción</th>
						<th>Vista previa</th>
					</tr>
				</thead>
				<tbody>
					{assignments.map((assignment) => (
						<tr key={assignment.id}>
							<td>{assignment.ruta}</td>
							<td>{assignment.nombreDeseado}</td>
							<td>
								<span className={`${styles.statusBadge} ${styles[assignment.status?.toLowerCase()]}`}>
									{assignment.status === 'PENDING' ? 'Pendiente' : 'Subido'}
								</span>
								</td>
								<td className={styles.fileCell}>
									<input
										type="file"
										id={`file-${assignment.id}`}
										accept=".pdf,.jpg,.jpeg,.png,.docx"
										disabled={assignment.status === 'UPLOADED'}
										className={styles.fileInput}
									/>
									{assignment.filePath && (
										<span className={styles.fileName}>
											{assignment.originalName?.substring(0, 20)}...
										</span>
									)}
								</td>
								<td className={styles.actionCell}>
									<button
										className={styles.uploadBtn}
										onClick={() => handleUpload(assignment.id)}
										disabled={assignment.status === 'UPLOADED' || uploading[assignment.id]}
									>
										{uploading[assignment.id] ? 'Subiendo...' : 'Subir'}
									</button>
								</td>
								<td className={styles.previewCell}>
									{assignment.filePath && (
										<a
											href={`http://localhost:5000/${assignment.filePath}`}
											target="_blank"
											rel="noopener noreferrer"
											className={styles.previewLink}
										>
											Ver
										</a>
									)}
								</td>
								</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default DownloaderTable;