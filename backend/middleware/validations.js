import { body, validationResult } from 'express-validator';

const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// ========== VALIDACIONES DE DATOS ==========

export const validateRegisterData = [
    body('email')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name')
        .notEmpty().withMessage('El nombre es requerido')
        .trim(),
    body('role')
        .optional()
        .isIn(['ADMIN', 'UPLOADER', 'DOWNLOADER']).withMessage('Rol inválido'),
    validateResult
];

export const validateLoginData = [
    body('email')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida'),
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