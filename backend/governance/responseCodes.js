// CÓDIGOS DE RESPUESTA ESTANDARIZADOS

export const ResponseCodes = {
	// ÉXITOS (2xx)
	
	SUCCESS: { code: 'SUC-200', message: 'Operación exitosa', httpStatus: 200, userMessage: 'Operación exitosa' },
	CREATED: { code: 'SUC-201', message: 'Recurso creado exitosamente', httpStatus: 201, userMessage: 'Recurso creado exitosamente' },
	LOGGED_OUT: { code: 'SUC-200-01', message: 'Sesión cerrada correctamente', httpStatus: 200, userMessage: 'Sesión cerrada correctamente' },
	
	// ERRORES DE CLIENTE (4xx)
	
	BAD_REQUEST: { code: 'ERR-400', message: 'Solicitud inválida', httpStatus: 400, userMessage: 'Verifica los datos enviados' },
	UNAUTHORIZED: { code: 'ERR-401', message: 'No autenticado', httpStatus: 401, userMessage: 'Debes iniciar sesión' },
	FORBIDDEN: { code: 'ERR-403', message: 'Acceso denegado', httpStatus: 403, userMessage: 'No tienes permiso para realizar esta acción' },
	NOT_FOUND: { code: 'ERR-404', message: 'Recurso no encontrado', httpStatus: 404, userMessage: 'No se encontró el recurso solicitado' },
	
	// ERRORES DE AUTENTICACIÓN (ERR-100x)
	
	EMAIL_EXISTS: { code: 'ERR-1001', message: 'Email ya registrado', httpStatus: 400, userMessage: 'Este email ya está registrado' },
	INVALID_CREDENTIALS: { code: 'ERR-1002', message: 'Credenciales inválidas', httpStatus: 401, userMessage: 'Email o contraseña incorrectos' },
	INVALID_TOKEN: { code: 'ERR-1003', message: 'Token inválido', httpStatus: 401, userMessage: 'Sesión inválida. Inicia sesión nuevamente' },
	TOKEN_EXPIRED: { code: 'ERR-1004', message: 'Token expirado', httpStatus: 401, userMessage: 'Tu sesión ha expirado. Inicia sesión nuevamente' },
	SESSION_ACTIVE: { code: 'ERR-1005', message: 'Ya hay una sesión activa', httpStatus: 403, userMessage: 'Ya tienes una sesión activa' },
	NO_SESSION: { code: 'ERR-1006', message: 'No hay sesión activa', httpStatus: 401, userMessage: 'No hay una sesión activa' },
	
	
	// ERRORES DE VALIDACIÓN (ERR-200x)
	
	INVALID_EMAIL: { code: 'ERR-2001', message: 'Email inválido', httpStatus: 400, userMessage: 'El email no tiene un formato válido' },
	INVALID_PASSWORD: { code: 'ERR-2002', message: 'Contraseña inválida', httpStatus: 400, userMessage: 'La contraseña debe tener al menos 6 caracteres' },
	INVALID_NAME: { code: 'ERR-2003', message: 'Nombre inválido', httpStatus: 400, userMessage: 'El nombre es requerido' },
	INVALID_ROLE: { code: 'ERR-2004', message: 'Rol inválido', httpStatus: 400, userMessage: 'El rol seleccionado no es válido' },
	
	// ERRORES DE ARCHIVOS (ERR-FILE-xxx)
	// Errores de Excel

	EXCEL_INVALID: { code: 'ERR-FILE-001', message: 'Archivo Excel inválido', httpStatus: 400, userMessage: 'El archivo no es un Excel válido' },
	EXCEL_MISSING_SHEET: { code: 'ERR-FILE-002', message: 'Falta hoja de metadatos', httpStatus: 400, userMessage: 'La plantilla Excel no tiene el formato correcto' },
	EXCEL_EMPTY: { code: 'ERR-FILE-003', message: 'Excel sin datos', httpStatus: 400, userMessage: 'El archivo Excel no contiene datos' },
	EXCEL_COLUMNS_MISSING: { code: 'ERR-FILE-004', message: 'Columnas requeridas faltantes', httpStatus: 400, userMessage: 'El Excel debe contener las columnas: ruta y nombre' },
	EXCEL_VERSION_UNSUPPORTED: { code: 'ERR-FILE-005', message: 'Versión de plantilla no soportada', httpStatus: 400, userMessage: 'La versión de la plantilla no es compatible' },
	EXCEL_INVALID_ROWS: { code: 'ERR-FILE-006', message: 'Filas con datos inválidos', httpStatus: 400, userMessage: 'Algunas filas tienen datos inválidos' },
	
	// Errores de archivos (documentos)
	FILE_NO_FILE: { code: 'ERR-FILE-010', message: 'No se recibió archivo', httpStatus: 400, userMessage: 'Debes seleccionar un archivo' },
	FILE_TOO_LARGE: { code: 'ERR-FILE-011', message: 'Archivo demasiado grande', httpStatus: 400, userMessage: 'El archivo supera el tamaño máximo permitido' },
	FILE_INVALID_EXTENSION: { code: 'ERR-FILE-012', message: 'Extensión no permitida', httpStatus: 400, userMessage: 'Tipo de archivo no permitido. Permitidos: PDF, JPG, PNG, DOCX' },
	FILE_INVALID_NAME: { code: 'ERR-FILE-013', message: 'Nombre de archivo inválido', httpStatus: 400, userMessage: 'El nombre del archivo contiene caracteres no permitidos' },
	FILE_NAME_TOO_LONG: { code: 'ERR-FILE-014', message: 'Nombre de archivo demasiado largo', httpStatus: 400, userMessage: 'El nombre del archivo es demasiado largo' },
	FILE_UPLOAD_FAILED: { code: 'ERR-FILE-015', message: 'Error al subir archivo', httpStatus: 500, userMessage: 'No se pudo subir el archivo. Intenta nuevamente' },
	FILE_NOT_FOUND: { code: 'ERR-FILE-016', message: 'Archivo no encontrado', httpStatus: 404, userMessage: 'El archivo no existe en el servidor' },
	FILE_CORRUPTED: { code: 'ERR-FILE-017', message: 'Archivo corrupto', httpStatus: 400, userMessage: 'El archivo está corrupto o dañado' },
	
	// Errores de ZIP
	ZIP_GENERATION_FAILED: { code: 'ERR-FILE-020', message: 'Error al generar ZIP', httpStatus: 500, userMessage: 'No se pudo generar el archivo ZIP' },
	ZIP_CORRUPTED: { code: 'ERR-FILE-021', message: 'ZIP corrupto', httpStatus: 409, userMessage: 'El archivo ZIP está corrupto' },
	ZIP_NOT_FOUND: { code: 'ERR-FILE-022', message: 'ZIP no encontrado', httpStatus: 404, userMessage: 'El archivo ZIP no existe' },
	ZIP_EMPTY: { code: 'ERR-FILE-023', message: 'ZIP vacío', httpStatus: 400, userMessage: 'No se pudo generar el ZIP porque no hay archivos' },
	
	// Errores de checksum
	CHECKSUM_MISMATCH: { code: 'ERR-FILE-030', message: 'Checksum no coincide', httpStatus: 409, userMessage: 'La integridad del archivo no se pudo verificar' },
	CHECKSUM_CALCULATION_FAILED: { code: 'ERR-FILE-031', message: 'Error al calcular checksum', httpStatus: 500, userMessage: 'No se pudo calcular la firma del archivo' },
	
	// Errores de ruta
	PATH_INVALID: { code: 'ERR-FILE-040', message: 'Ruta inválida', httpStatus: 400, userMessage: 'La ruta contiene caracteres no permitidos' },
	PATH_TOO_LONG: { code: 'ERR-FILE-041', message: 'Ruta demasiado larga', httpStatus: 400, userMessage: 'La ruta es demasiado larga' },
	PATH_ALREADY_EXISTS: { code: 'ERR-FILE-042', message: 'La ruta ya existe', httpStatus: 409, userMessage: 'Ya existe un archivo en esa ubicación' },
	
	
	// ERRORES DE PLANTILLAS (ERR-TMPL-xxx)
	
	TEMPLATE_NOT_FOUND: { code: 'ERR-TMPL-001', message: 'Plantilla no encontrada', httpStatus: 404, userMessage: 'La plantilla solicitada no existe' },
	TEMPLATE_NOT_ACTIVE: { code: 'ERR-TMPL-002', message: 'Plantilla no activa', httpStatus: 400, userMessage: 'La plantilla no está activa' },
	TEMPLATE_NOT_COMPLETED: { code: 'ERR-TMPL-003', message: 'Plantilla no completada', httpStatus: 400, userMessage: 'La plantilla debe estar completada para esta acción' },
	TEMPLATE_CANNOT_APPROVE: { code: 'ERR-TMPL-004', message: 'No se puede aprobar', httpStatus: 400, userMessage: 'No se puede aprobar la plantilla. Faltan archivos por subir' },
	
	// ERRORES DE ASIGNACIONES (ERR-ASS-xxx)
	
	ASSIGNMENT_NOT_FOUND: { code: 'ERR-ASS-001', message: 'Asignación no encontrada', httpStatus: 404, userMessage: 'La asignación solicitada no existe' },
	ASSIGNMENT_ALREADY_COMPLETED: { code: 'ERR-ASS-002', message: 'Asignación ya completada', httpStatus: 400, userMessage: 'Esta asignación ya fue completada' },
	ASSIGNMENT_NOT_PENDING: { code: 'ERR-ASS-003', message: 'Asignación no pendiente', httpStatus: 400, userMessage: 'Esta asignación no está pendiente' },
	
	// ERRORES DE SERVIDOR (5xx)
	
	INTERNAL_ERROR: { code: 'ERR-500', message: 'Error interno del servidor', httpStatus: 500, userMessage: 'Ocurrió un error. Intenta más tarde' },
	DATABASE_ERROR: { code: 'ERR-5001', message: 'Error de base de datos', httpStatus: 500, userMessage: 'Error en el servidor. Intenta más tarde' },
	FILE_SYSTEM_ERROR: { code: 'ERR-5002', message: 'Error del sistema de archivos', httpStatus: 500, userMessage: 'Error al procesar el archivo en el servidor' },
	

	// ERRORES DE CONEXIÓN (frontend)
	
	CONNECTION_ERROR: { code: 'ERR-999', message: 'Error de conexión', httpStatus: 0, userMessage: 'No se pudo conectar con el servidor' }
};

// HELPERS

// Enviar respuesta estandarizada
export const sendResponse = (res, code, data = null, token = null) => {
	const responseCode = ResponseCodes[code];
	
	// Si hay token, establecer cookie
	if (token) {
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 24 * 60 * 60 * 1000,
			path: '/'
		});
	}
	
	const response = {
		success: responseCode.httpStatus >= 200 && responseCode.httpStatus < 300,
		code: responseCode.code,
		message: responseCode.userMessage || responseCode.message,
		timestamp: new Date().toISOString()
	};
	
	if (data) response.data = data;
	
	return res.status(responseCode.httpStatus).json(response);
};

// Enviar error de validación
export const sendValidationError = (res, errors) => {
	return res.status(400).json({
		success: false,
		code: 'ERR-400-VAL',
		message: 'Errores de validación',
		errors: errors,
		timestamp: new Date().toISOString()
	});
};

// Enviar respuesta de éxito con datos
export const sendSuccess = (res, data = null, message = null) => {
	const response = {
		success: true,
		code: 'SUC-200',
		message: message || 'Operación exitosa',
		timestamp: new Date().toISOString()
	};
	
	if (data) response.data = data;
	
	return res.status(200).json(response);
};

// Enviar respuesta de creación
export const sendCreated = (res, data = null, message = null) => {
	const response = {
		success: true,
		code: 'SUC-201',
		message: message || 'Recurso creado exitosamente',
		timestamp: new Date().toISOString()
	};
	
	if (data) response.data = data;
	
	return res.status(201).json(response);
};

// Enviar error estandarizado
export const sendError = (res, responseCode, details = null) => {
	return sendResponse(res, responseCode, null, details);
};