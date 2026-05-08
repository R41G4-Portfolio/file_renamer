import { useState } from 'react';

const FileUploader = ({ assignmentId, onUploadSuccess }) => {
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		const allowedExtensions = ['.pdf', '.jpg', '.png', '.docx'];
		const ext = selectedFile?.name.slice(-5).toLowerCase();
		
		if (selectedFile && allowedExtensions.some(a => ext === a)) {
			setFile(selectedFile);
			setError('');
		} else {
			setFile(null);
			setError('Tipo de archivo no permitido. Permitidos: PDF, JPG, PNG, DOCX');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!file) {
			setError('Selecciona un archivo');
			return;
		}

		setLoading(true);
		setError('');
		setSuccess('');

		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch(`http://localhost:5000/assignments/upload/${assignmentId}`, {
				method: 'POST',
				credentials: 'include',
				body: formData
			});

			const data = await response.json();

			if (response.ok) {
				setSuccess('Archivo subido correctamente');
				setFile(null);
				e.target.reset();
				if (onUploadSuccess) onUploadSuccess();
			} else {
				setError(data.error || 'Error al subir archivo');
			}
		} catch (err) {
			setError('Error de conexión');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className="file-uploader" onSubmit={handleSubmit}>
			<div className="file-uploader__field">
				<label className="file-uploader__label">Archivo</label>
				<input
					type="file"
					accept=".pdf,.jpg,.jpeg,.png,.docx"
					onChange={handleFileChange}
					className="file-uploader__input"
				/>
				<p className="file-uploader__hint">Formatos permitidos: PDF, JPG, PNG, DOCX</p>
			</div>

			{error && <div className="file-uploader__error">{error}</div>}
			{success && <div className="file-uploader__success">{success}</div>}

			<button
				type="submit"
				className="file-uploader__button"
				disabled={!file || loading}
			>
				{loading ? 'Subiendo...' : 'Subir archivo'}
			</button>
		</form>
	);
};

export default FileUploader;