import bcrypt from 'bcryptjs';
import { 
	findUserByEmailForLogin,
	emailExists,
	createUser,
	updateUserToken,
	clearUserToken,
	findUserByIdForResponse
} from '../queries/authQueries.js';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/tokenUtils.js';
import { logAudit } from '../utils/auditUtils.js';

/*
 * POST /auth/register
 * Registra un nuevo usuario
 */
export const register = async (req, res) => {
	try {
		const { email, password, name, role } = req.body;

		// Verificar si el email ya existe (CON lean)
		const existing = await emailExists(email);
		if (existing) {
			return res.status(400).json({ error: 'Email ya registrado' });
		}

		// Crear usuario (escritura)
		const user = await createUser({ email, password, name, role });
		
		// Registrar auditoría
		await logAudit(user.id, 'REGISTER', req);

		res.status(201).json({ message: 'Usuario registrado correctamente' });
	} catch (error) {
		console.error('Error en register:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
};

/*
 * POST /auth/login
 * Inicia sesión y establece cookie httpOnly
 */
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Buscar usuario con password (CON lean, para validación interna)
		const user = await findUserByEmailForLogin(email);
		if (!user) {
			return res.status(401).json({ error: 'Credenciales inválidas' });
		}

		// Comparar contraseña
		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return res.status(401).json({ error: 'Credenciales inválidas' });
		}

		// Generar token y guardar en BD
		const token = generateToken(user._id, user.role);
		await updateUserToken(user._id, token);
		
		// Establecer cookie httpOnly
		setTokenCookie(res, token);
		
		// Registrar auditoría
		await logAudit(user._id, 'LOGIN', req);

		res.json({ message: 'Sesión iniciada correctamente' });
	} catch (error) {
		console.error('Error en login:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
};

/*
 * POST /auth/logout
 * Cierra sesión y elimina cookie
 */
export const logout = async (req, res) => {
	try {
		if (req.user) {
			// Limpiar token en BD
			await clearUserToken(req.user.id);
			// Registrar auditoría
			await logAudit(req.user.id, 'LOGOUT', req);
		}
		// Eliminar cookie
		clearTokenCookie(res);
		res.json({ message: 'Sesión cerrada correctamente' });
	} catch (error) {
		console.error('Error en logout:', error);
		clearTokenCookie(res);
		res.json({ message: 'Sesión cerrada correctamente' });
	}
};

/*
 * GET /auth/perfil
 * Obtiene el perfil del usuario autenticado
 * (SIN lean - respeta select: false y toJSON del modelo)
 */
export const getPerfil = async (req, res) => {
	try {
		// Usa findUserByIdForResponse (SIN lean) para respetar reglas del modelo
		const user = await findUserByIdForResponse(req.user.id);
		if (!user) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}
		res.json(user);
	} catch (error) {
		console.error('Error en getPerfil:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
};