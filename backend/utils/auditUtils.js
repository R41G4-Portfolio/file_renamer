import { Audit } from '../models/index.js';

export const logAudit = async (userId, action, req, targetId = null, details = null) => {
    try {
        await Audit.create({
            userId,
            action,
            targetId,
            ipAddress: req?.ip,
            userAgent: req?.get('User-Agent'),
            details
        });
    } catch (error) {
        console.error('Error al guardar auditoría:', error.message);
    }
};