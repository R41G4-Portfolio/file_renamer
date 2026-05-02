import { findTemplatesByUser } from '../queries/templateQueries.js';

/*
 * GET /dashboard
 * Obtiene estadísticas y resumen para el dashboard
 */
export const getDashboard = async (req, res) => {
	try {
		const templates = await findTemplatesByUser(req.user.id, req.user.role);
		
		const stats = {
			totalTemplates: templates.length,
			activeTemplates: templates.filter(t => t.status === 'ACTIVE').length,
			completedTemplates: templates.filter(t => t.status === 'COMPLETED').length,
			cancelledTemplates: templates.filter(t => t.status === 'CANCELLED').length
		};
		
		res.json({
			user: {
				email: req.user.email,
				name: req.user.name,
				role: req.user.role
			},
			stats,
			recentTemplates: templates.slice(0, 5).map(t => ({
				id: t.id,
				title: t.title || t.excelFileName,
				status: t.status,
				uploadedAt: t.uploadedAt
			}))
		});
	} catch (error) {
		console.error('Error en getDashboard:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
};