import { findUsersByRole, findUserById, searchUsersByName, findUserByEmail } from '../queries/userQueries.js';
import { findUserByIdForResponse } from '../queries/authQueries.js';

/*
 * GET /users/role/:role
 * Obtiene usuarios por rol (ej: DOWNLOADER para asignar)
 */

export const getUsersByRole = async (req, res) => {
	try {
		const { role } = req.params;
		
		const validRoles = ['ADMIN', 'UPLOADER', 'DOWNLOADER'];
		if (!validRoles.includes(role)) {
			return res.status(400).json({ error: 'Rol inválido' });
		}
		
		const users = await findUsersByRole(role);
		res.json(users);
	} catch (error) {
		console.error('Error en getUsersByRole:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
};

/*
 * GET /users/search?q=termino
 * Busca usuarios por nombre (coincidencia parcial)
 */
export const searchUsers = async (req, res) => {
	try {
		const { q } = req.query;
		if (!q) {
			return res.status(400).json({ error: 'Se requiere término de búsqueda' });
		}
		
		const users = await searchUsersByName(q);
		
		// No exponer información sensible
		const safeUsers = users.map(user => ({
			email: user.email,
			name: user.name,
			role: user.role
		}));
		
		res.json(safeUsers);
	} catch (error) {
		console.error('Error en searchUsers:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
};

/*
 * GET /users/:userId/profile
 * Obtiene perfil público de un usuario (sin datos sensibles)
 * Usa findUserByIdForResponse (SIN lean) para respetar el modelo
 */
export const getPublicUserProfile = async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await findUserByIdForResponse(userId);
		
		if (!user) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}
		
		// Mongoose aplica toJSON automáticamente (sin id, sin password, sin token)
		res.json(user);
	} catch (error) {
		console.error('Error en getPublicUserProfile:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
};
