import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExcelUploader.css';

const ExcelUploader = ({ navigate }) => {
	const [file, setFile] = useState(null);
	const [title, setTitle] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile && (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls'))) {
			setFile(selectedFile);
			setError('');
		} else {
			setFile(null);
			setError('Solo archivos Excel (.xlsx, .xls)');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!file) {
			setError('Selecciona un archivo');
			return;
		}
		if (!title.trim()) {
			setError('Ingresa un título para la solicitud');
			return;
		}

		setLoading(true);
		setError('');
		setSuccess('');

		const formData = new FormData();
		formData.append('excel', file);
		formData.append('title', title);

		try {
			const response = await fetch('http://localhost:5000/templates', {
				method: 'POST',
				credentials: 'include',
				body: formData
			});

			const contentType = response.headers.get('Content-Type');

			// Si la respuesta es un archivo Excel (errores)
			if (contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'errores_plantilla.xlsx';
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);
				setError('La plantilla contiene errores. Se ha descargado un archivo con los detalles.');
				setLoading(false);
				return;
			}

			// Si es JSON (éxito o error)
			const data = await response.json();

			if (response.ok) {
				setSuccess('Plantilla subida correctamente');
				setFile(null);
				setTitle('');
				e.target.reset();
				setTimeout(() => {
					navigate('/dashboard');
				}, 2000);
			} else {
				setError(data.error || 'Error al subir plantilla');
			}
		} catch (err) {
			setError('Error de conexión');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="excel-uploader">
			<a 
				href="http://localhost:5000/templates/download-template"
				className="excel-uploader__download-btn"
				download
			>
				📥 Descargar plantilla Excel
			</a>
			
			<div className="excel-uploader__divider">o</div>
			
			<form className="excel-uploader__form" onSubmit={handleSubmit}>
				<div className="excel-uploader__field">
					<label className="excel-uploader__label">Título de la solicitud</label>
					<input
						type="text"
						className="excel-uploader__input"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Ej: Facturas proveedores marzo 2024"
						required
					/>
				</div>

				<div className="excel-uploader__field">
					<label className="excel-uploader__label">Archivo Excel</label>
					<input
						type="file"
						accept=".xlsx,.xls"
						onChange={handleFileChange}
						className="excel-uploader__input"
					/>
					<p className="excel-uploader__hint">Columnas requeridas: ruta, nombre</p>
				</div>

				{error && <div className="excel-uploader__error">{error}</div>}
				{success && <div className="excel-uploader__success">{success}</div>}

				<button
					type="submit"
					className="excel-uploader__button"
					disabled={!file || !title.trim() || loading}
				>
					{loading ? 'Subiendo...' : 'Subir plantilla'}
				</button>
			</form>
		</div>
	);
};

export default ExcelUploader;