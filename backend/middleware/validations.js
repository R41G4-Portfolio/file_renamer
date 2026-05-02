import { body, validationResult } from 'express-validator';

const validateResult = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

// ========== SANITIZACIÓN ADICIONAL ==========

// Eliminar operadores NoSQL peligrosos (para MongoDB)
const sanitizeNoSQL = (value) => {
	if (typeof value === 'string') {
		// Eliminar '$' y '.' que pueden usarse en operadores NoSQL
		return value.replace(/[\$]/g, '').replace(/[\.]/g, '');
	}
	return value;
};

// Sanitizar caracteres especiales para prevenir XSS
const sanitizeXSS = (value) => {
	if (typeof value === 'string') {
		return value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#x27;')
			.replace(/\//g, '&#x2F;');
	}
	return value;
};

// ========== VALIDACIONES DE DATOS ==========

export const validateRegisterData = [
	body('email')
		.isEmail().withMessage('Email inválido')
		.normalizeEmail()
		.customSanitizer(sanitizeNoSQL),
	body('password')
		.isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
		.customSanitizer(sanitizeNoSQL),
	body('name')
		.notEmpty().withMessage('El nombre es requerido')
		.trim()
		.escape()
		.customSanitizer(sanitizeNoSQL)
		.customSanitizer(sanitizeXSS),
	body('role')
		.optional()
		.isIn(['ADMIN', 'UPLOADER', 'DOWNLOADER']).withMessage('Rol inválido')
		.customSanitizer(sanitizeNoSQL),
	validateResult
];

export const validateLoginData = [
	body('email')
		.isEmail().withMessage('Email inválido')
		.normalizeEmail()
		.customSanitizer(sanitizeNoSQL),
	body('password')
		.notEmpty().withMessage('La contraseña es requerida')
		.customSanitizer(sanitizeNoSQL),
	validateResult
];

// ========== VALIDACIONES DE SESIÓN ==========

export const isLoggedIn = (req, res, next) => {
	if (req.cookies?.token) {
		return res.status(403).json({ error: 'Ya tienes una sesión activa' });
	}
	next();
};

export const isLoggedOut = (req, res, next) => {
	if (!req.cookies?.token) {
		return res.status(401).json({ error: 'No hay sesión activa' });
	}
	next();
};