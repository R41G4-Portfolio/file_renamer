// URL base de la API (desde variables de entorno o localhost por defecto)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/*
 * Maneja las respuestas de fetch
 * Si la respuesta es ok, devuelve el JSON
 * Si no, extrae el error y lo lanza como excepción
 */
const handleResponse = async (response) => {
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Error en la petición');
	}
	return response.json();
};

/*
 * Maneja respuestas Blob (archivos)
 */
const handleBlobResponse = async (response) => {
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Error en la petición');
	}
	return response.blob();
};

/*
 * Objeto api que agrupa todas las peticiones HTTP al backend
 */
export const api = {
	

	/*
	   AUTENTICACIÓN
	 * POST /auth/register
	 * Registra un nuevo usuario
	 * @param {Object} userData - { email, password, name, role }
	 */
	register: async (userData) => {
		const response = await fetch(`${API_URL}/auth/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',  // Para manejar cookies de sesión
			body: JSON.stringify(userData)
		});
		return handleResponse(response);
	},

	/*
	 * POST /auth/login
	 * Inicia sesión y establece cookie httpOnly
	 * @param {Object} credentials - { email, password }
	 */
	login: async (credentials) => {
		const response = await fetch(`${API_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',  // ← Esto es clave
			body: JSON.stringify(credentials)
		});
		return handleResponse(response);
	},

	/*
	 * POST /auth/logout
	 * Cierra sesión y elimina la cookie
	 */
	logout: async () => {
		const response = await fetch(`${API_URL}/auth/logout`, {
			method: 'POST',
			credentials: 'include'
		});
		return handleResponse(response);
	},

	/*
	 * GET /auth/perfil
	 * Obtiene los datos del usuario autenticado
	 * (sin exponer id, password, token)
	 */
	getPerfil: async () => {
		const response = await fetch(`${API_URL}/auth/perfil`, {
			method: 'GET',
			credentials: 'include'
		});
		return handleResponse(response);
	},
	

	/*
	   PLANTILLAS (TEMPLATES)
	 * GET /templates
	 * Lista todas las plantillas (filtradas por rol)
	 * - ADMIN: ve todas
	 * - UPLOADER/DOWNLOADER: ve solo las propias o asignadas
	 */
	getTemplates: async () => {
		const response = await fetch(`${API_URL}/templates`, {
			method: 'GET',
			credentials: 'include'
		});
		return handleResponse(response);
	},

	/*
	 * GET /templates/:id
	 * Obtiene los detalles de una plantilla y sus assignments
	 * @param {string} templateId - ID de la plantilla
	 */
	getTemplateById: async (templateId) => {
		const response = await fetch(`${API_URL}/templates/${templateId}`, {
			method: 'GET',
			credentials: 'include'
		});
		return handleResponse(response);
	},

	/*
	 * POST /templates
	 * Sube una nueva plantilla Excel
	 * @param {File} file - Archivo Excel (.xlsx, .xls)
	 * @param {string} title - Título descriptivo de la solicitud
	 */
	uploadTemplate: async (file, title) => {
		const formData = new FormData();
		formData.append('excel', file);
		formData.append('title', title);
		
		const response = await fetch(`${API_URL}/templates`, {
			method: 'POST',
			credentials: 'include',
			body: formData
		});
		
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Error al subir plantilla');
		}
		return response.json();
	},

	/*
	 * PUT /templates/:id/assign
	 * Asigna un usuario DOWNLOADER a una plantilla
	 * @param {string} templateId - ID de la plantilla
	 * @param {string} email - Email del usuario DOWNLOADER
	 */
	assignTemplate: async (templateId, email) => {
		const response = await fetch(`${API_URL}/templates/${templateId}/assign`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ email })
		});
		return handleResponse(response);
	},

	/*
	 * POST /templates/:id/approve
	 * Aprueba una plantilla (solo si todos los assignments están UPLOADED)
	 * @param {string} templateId - ID de la plantilla
	 */
	approveTemplate: async (templateId) => {
		const response = await fetch(`${API_URL}/templates/${templateId}/approve`, {
			method: 'POST',
			credentials: 'include'
		});
		return handleResponse(response);
	},

	/*
	 * DELETE /templates/:id
	 * Cancela una plantilla (cambia estado a CANCELLED)
	 * @param {string} templateId - ID de la plantilla
	 */
	cancelTemplate: async (templateId) => {
		const response = await fetch(`${API_URL}/templates/${templateId}`, {
			method: 'DELETE',
			credentials: 'include'
		});
		return handleResponse(response);
	},


	/*
	   ASIGNACIONES (ASSIGNMENTS)
	 * GET /assignments/template/:templateId
	 * Obtiene todos los assignments de una plantilla
	 * @param {string} templateId - ID de la plantilla
	 */
	getAssignmentsByTemplate: async (templateId) => {
		const response = await fetch(`${API_URL}/assignments/template/${templateId}`, {
			method: 'GET',
			credentials: 'include'
		});
		return handleResponse(response);
	},

	/*
	 * POST /assignments/upload/:assignmentId
	 * Sube un archivo para un assignment específico
	 * @param {string} assignmentId - ID del assignment
	 * @param {File} file - Archivo a subir (PDF, JPG, PNG, DOCX)
	 */
	uploadAssignmentFile: async (assignmentId, file) => {
		const formData = new FormData();
		formData.append('file', file);
		
		const response = await fetch(`${API_URL}/assignments/upload/${assignmentId}`, {
			method: 'POST',
			credentials: 'include',
			body: formData
		});
		
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Error al subir archivo');
		}
		return response.json();
	},
	
	/*
	   ZIP
	 * POST /zip/generate/:templateId
	 * Genera el ZIP con los archivos renombrados y signature.checksum
	 * @param {string} templateId - ID de la plantilla (debe estar COMPLETED)
	 */
	generateZip: async (templateId) => {
		const response = await fetch(`${API_URL}/zip/generate/${templateId}`, {
			method: 'POST',
			credentials: 'include'
		});
		return handleResponse(response);
	},

	/*
	 * GET /zip/download/:templateId
	 * Descarga el ZIP generado
	 * @param {string} templateId - ID de la plantilla
	 * @returns {Blob} - Archivo ZIP
	 */
	downloadZip: async (templateId) => {
		const response = await fetch(`${API_URL}/zip/download/${templateId}`, {
			method: 'GET',
			credentials: 'include'
		});
		
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Error al descargar ZIP');
		}
		
		return response.blob();
	},

	/*
	   DOWNLOADER PANEL
	 * GET /templates/my-assigned
	 * Obtiene las plantillas asignadas al usuario DOWNLOADER
	 */
	getMyAssignedTemplates: async () => {
		const response = await fetch(`${API_URL}/templates/my-assigned`, {
			method: 'GET',
			credentials: 'include'
		});
		return handleResponse(response);
	},

	/*
	   ADMIN AUDITORÍA
	 * GET /audit
	 * Obtiene los logs de auditoría (solo ADMIN)
	 */
	getAuditLogs: async () => {
		const response = await fetch(`${API_URL}/audit`, {
			method: 'GET',
			credentials: 'include'
		});
		return handleResponse(response);
	},

	getSessionData: async () => {
		const response = await fetch(`${API_URL}/users/session-data`, {
			method: 'GET',
			credentials: 'include'
		});
		return handleResponse(response);
	},

	
};