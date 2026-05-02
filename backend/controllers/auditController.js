import { findAllAuditLogs } from '../queries/auditQueries.js';

export const getAuditLogs = async (req, res) => {
	try {
		// Solo ADMIN puede ver auditoría
		if (req.user.role !== 'ADMIN') {
			return res.status(403).json({ error: 'Acceso denegado' });
		}
		
		const logs = await findAllAuditLogs(200);
		res.json(logs);
	} catch (error) {
		console.error('Error en getAuditLogs:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
};