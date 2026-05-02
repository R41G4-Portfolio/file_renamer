import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Layout';
import ExcelUploader from '../components/Upload/ExcelUploader';
import '../components/Upload/UploadBase.css';

const UploadPage = () => {
	const navigate = useNavigate();
	const { user } = useAuth();

	useEffect(() => {
		document.title = 'Subir plantilla Excel - File Renamer';
	}, []);

	if (user?.role !== 'ADMIN' && user?.role !== 'UPLOADER') {
		return (
			<div className="upload-page">
				<Header title="File Renamer" />
				<div className="upload-page__unauthorized">
					<h2>Acceso denegado</h2>
					<p>No tienes permiso para subir plantillas.</p>
					<button onClick={() => navigate('/dashboard')}>
						Volver al dashboard
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="upload-page">
			<Header 
				title="File Renamer" 
				showBackButton={true} 
				backPath="/dashboard" 
			/>
			<main className="upload-page__main">
				<div className="upload-page__card">
					<h2>Subir plantilla Excel</h2>
					<p>El archivo debe contener las columnas: ruta y nombre</p>
					<ExcelUploader navigate={navigate} />
				</div>
			</main>
		</div>
	);
};

export default UploadPage;