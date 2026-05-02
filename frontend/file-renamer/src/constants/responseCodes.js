export const ResponseCodes = {
	SUCCESS: { code: 'SUC-200', userMessage: 'Operación exitosa' },
	CREATED: { code: 'SUC-201', userMessage: 'Recurso creado exitosamente' },
	LOGGED_OUT: { code: 'SUC-200-01', userMessage: 'Sesión cerrada correctamente' },
	
	BAD_REQUEST: { code: 'ERR-400', userMessage: 'Verifica los datos enviados' },
	UNAUTHORIZED: { code: 'ERR-401', userMessage: 'Debes iniciar sesión' },
	FORBIDDEN: { code: 'ERR-403', userMessage: 'No tienes permiso para realizar esta acción' },
	NOT_FOUND: { code: 'ERR-404', userMessage: 'No se encontró el recurso solicitado' },
	
	EMAIL_EXISTS: { code: 'ERR-1001', userMessage: 'Este email ya está registrado' },
	INVALID_CREDENTIALS: { code: 'ERR-1002', userMessage: 'Email o contraseña incorrectos' },
	INVALID_TOKEN: { code: 'ERR-1003', userMessage: 'Sesión inválida. Inicia sesión nuevamente' },
	TOKEN_EXPIRED: { code: 'ERR-1004', userMessage: 'Tu sesión ha expirado. Inicia sesión nuevamente' },
	SESSION_ACTIVE: { code: 'ERR-1005', userMessage: 'Ya tienes una sesión activa' },
	NO_SESSION: { code: 'ERR-1006', userMessage: 'No hay una sesión activa' },
	
	INVALID_EMAIL: { code: 'ERR-2001', userMessage: 'El email no tiene un formato válido' },
	INVALID_PASSWORD: { code: 'ERR-2002', userMessage: 'La contraseña debe tener al menos 6 caracteres' },
	INVALID_NAME: { code: 'ERR-2003', userMessage: 'El nombre es requerido' },
	INVALID_ROLE: { code: 'ERR-2004', userMessage: 'El rol seleccionado no es válido' },
	
	EXCEL_INVALID: { code: 'ERR-FILE-001', userMessage: 'El archivo no es un Excel válido' },
	EXCEL_MISSING_SHEET: { code: 'ERR-FILE-002', userMessage: 'La plantilla Excel no tiene el formato correcto' },
	EXCEL_EMPTY: { code: 'ERR-FILE-003', userMessage: 'El archivo Excel no contiene datos' },
	EXCEL_COLUMNS_MISSING: { code: 'ERR-FILE-004', userMessage: 'El Excel debe contener las columnas: ruta y nombre' },
	EXCEL_VERSION_UNSUPPORTED: { code: 'ERR-FILE-005', userMessage: 'La versión de la plantilla no es compatible' },
	EXCEL_INVALID_ROWS: { code: 'ERR-FILE-006', userMessage: 'Algunas filas tienen datos inválidos' },
	
	FILE_NO_FILE: { code: 'ERR-FILE-010', userMessage: 'Debes seleccionar un archivo' },
	FILE_TOO_LARGE: { code: 'ERR-FILE-011', userMessage: 'El archivo supera el tamaño máximo permitido' },
	FILE_INVALID_EXTENSION: { code: 'ERR-FILE-012', userMessage: 'Tipo de archivo no permitido. Permitidos: PDF, JPG, PNG, DOCX' },
	FILE_INVALID_NAME: { code: 'ERR-FILE-013', userMessage: 'El nombre del archivo contiene caracteres no permitidos' },
	FILE_NAME_TOO_LONG: { code: 'ERR-FILE-014', userMessage: 'El nombre del archivo es demasiado largo' },
	FILE_UPLOAD_FAILED: { code: 'ERR-FILE-015', userMessage: 'No se pudo subir el archivo. Intenta nuevamente' },
	FILE_NOT_FOUND: { code: 'ERR-FILE-016', userMessage: 'El archivo no existe en el servidor' },
	FILE_CORRUPTED: { code: 'ERR-FILE-017', userMessage: 'El archivo está corrupto o dañado' },
	
	ZIP_GENERATION_FAILED: { code: 'ERR-FILE-020', userMessage: 'No se pudo generar el archivo ZIP' },
	ZIP_CORRUPTED: { code: 'ERR-FILE-021', userMessage: 'El archivo ZIP está corrupto' },
	ZIP_NOT_FOUND: { code: 'ERR-FILE-022', userMessage: 'El archivo ZIP no existe' },
	ZIP_EMPTY: { code: 'ERR-FILE-023', userMessage: 'No se pudo generar el ZIP porque no hay archivos' },
	
	CHECKSUM_MISMATCH: { code: 'ERR-FILE-030', userMessage: 'La integridad del archivo no se pudo verificar' },
	CHECKSUM_CALCULATION_FAILED: { code: 'ERR-FILE-031', userMessage: 'No se pudo calcular la firma del archivo' },
	
	PATH_INVALID: { code: 'ERR-FILE-040', userMessage: 'La ruta contiene caracteres no permitidos' },
	PATH_TOO_LONG: { code: 'ERR-FILE-041', userMessage: 'La ruta es demasiado larga' },
	PATH_ALREADY_EXISTS: { code: 'ERR-FILE-042', userMessage: 'Ya existe un archivo en esa ubicación' },
	
	TEMPLATE_NOT_FOUND: { code: 'ERR-TMPL-001', userMessage: 'La plantilla solicitada no existe' },
	TEMPLATE_NOT_ACTIVE: { code: 'ERR-TMPL-002', userMessage: 'La plantilla no está activa' },
	TEMPLATE_NOT_COMPLETED: { code: 'ERR-TMPL-003', userMessage: 'La plantilla debe estar completada para esta acción' },
	TEMPLATE_CANNOT_APPROVE: { code: 'ERR-TMPL-004', userMessage: 'No se puede aprobar la plantilla. Faltan archivos por subir' },
	
	ASSIGNMENT_NOT_FOUND: { code: 'ERR-ASS-001', userMessage: 'La asignación solicitada no existe' },
	ASSIGNMENT_ALREADY_COMPLETED: { code: 'ERR-ASS-002', userMessage: 'Esta asignación ya fue completada' },
	ASSIGNMENT_NOT_PENDING: { code: 'ERR-ASS-003', userMessage: 'Esta asignación no está pendiente' },
	
	INTERNAL_ERROR: { code: 'ERR-500', userMessage: 'Ocurrió un error. Intenta más tarde' },
	DATABASE_ERROR: { code: 'ERR-5001', userMessage: 'Error en el servidor. Intenta más tarde' },
	FILE_SYSTEM_ERROR: { code: 'ERR-5002', userMessage: 'Error al procesar el archivo en el servidor' },
	
	CONNECTION_ERROR: { code: 'ERR-999', userMessage: 'No se pudo conectar con el servidor' }
};

export const getUserMessage = (error) => {
	if (!error) return ResponseCodes.INTERNAL_ERROR.userMessage;
	
	if (error.userMessage) return error.userMessage;
	
	for (const key in ResponseCodes) {
		if (ResponseCodes[key].code === error.code) {
			return ResponseCodes[key].userMessage;
		}
	}
	
	const knownError = Object.values(ResponseCodes).find(
		code => error.message?.includes(code.code) || 
		        error.message?.includes(code.userMessage) ||
		        error.error?.includes(code.code)
	);
	
	if (knownError) return knownError.userMessage;
	
	if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
		return ResponseCodes.CONNECTION_ERROR.userMessage;
	}
	
	return ResponseCodes.INTERNAL_ERROR.userMessage;
};

export const getErrorCode = (error) => {
	if (!error) return 'ERR-500';
	
	if (error.code) return error.code;
	
	for (const key in ResponseCodes) {
		if (ResponseCodes[key].userMessage === error.message ||
		    ResponseCodes[key].code === error.message) {
			return ResponseCodes[key].code;
		}
	}
	
	return 'ERR-500';
};