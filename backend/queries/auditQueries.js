import { Audit } from '../models/index.js';

// Consultas para respuestas HTTP (SIN lean)
export const findAuditLogsByUser = async (userId, limit = 100) => {
	return await Audit.find({ userId })
		.sort({ timestamp: -1 })
		.limit(limit);
};

export const findAuditLogsByAction = async (action, limit = 100) => {
	return await Audit.find({ action })
		.sort({ timestamp: -1 })
		.limit(limit);
};

export const findAllAuditLogs = async (limit = 100) => {
	return await Audit.find()
		.populate('userId', 'name email')
		.sort({ timestamp: -1 })
		.limit(limit);
};

// Operaciones de escritura
export const createAuditLog = async (logData) => {
	return await Audit.create(logData);
};