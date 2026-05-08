// URL base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/*
 * Maneja las respuestas de fetch
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error en la petición');
    }
    return response.json();
};

export const api = {
    // --- AUTENTICACIÓN ---
    register: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData)
        });
        return handleResponse(response);
    },

    login: async (credentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(credentials)
        });
        return handleResponse(response);
    },

    logout: async () => {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    getPerfil: async () => {
        const response = await fetch(`${API_URL}/auth/perfil`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },
    
    // --- PLANTILLAS (TEMPLATES) ---
    getTemplates: async () => {
        const response = await fetch(`${API_URL}/templates`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    getTemplateById: async (templateId) => {
        const response = await fetch(`${API_URL}/templates/${templateId}`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    uploadTemplate: async (file, title) => {
        const formData = new FormData();
        formData.append('excel', file);
        formData.append('title', title);
        
        const response = await fetch(`${API_URL}/templates`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        return handleResponse(response);
    },

    assignTemplate: async (templateId, email) => {
        const response = await fetch(`${API_URL}/templates/${templateId}/assign`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email })
        });
        return handleResponse(response);
    },

    approveTemplate: async (templateId) => {
        const response = await fetch(`${API_URL}/templates/${templateId}/approve`, {
            method: 'POST',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    cancelTemplate: async (templateId) => {
        const response = await fetch(`${API_URL}/templates/${templateId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // --- ASIGNACIONES (ASSIGNMENTS) ---
    getAssignmentsByTemplate: async (templateId) => {
        const response = await fetch(`${API_URL}/assignments/template/${templateId}`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    uploadAssignmentFile: async (assignmentId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_URL}/assignments/upload/${assignmentId}`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        return handleResponse(response);
    },

    /**
     * NUEVO: Genera la URL para visualizar un archivo de forma protegida
     * No es async porque solo retorna un string para window.open
     */
    getFileViewUrl: (assignmentId) => {
        return `${API_URL}/assignments/view/${assignmentId}`;
    },
    
    // --- ZIP ---
    generateZip: async (templateId) => {
        const response = await fetch(`${API_URL}/zip/generate/${templateId}`, {
            method: 'POST',
            credentials: 'include'
        });
        return handleResponse(response);
    },

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

    getMyAssignedTemplates: async () => {
        const response = await fetch(`${API_URL}/templates/my-assigned`, {
            method: 'GET',
            credentials: 'include'
        });
        return handleResponse(response);
    }
};