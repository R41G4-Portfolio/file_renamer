import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/index.js';
import { User } from '../models/index.js';
import { generateToken } from '../utils/tokenUtils.js';

const authMiddleware = async (req, res, next) => {
	try {
		const token = req.cookies?.token;

		if (!token) {
			return res.status(401).json({ error: 'No autenticado' });
		}

		const decoded = jwt.verify(token, config.jwtSecret);
		const user = await User.findById(decoded.userId).select('+token');

		if (!user) {
			return res.status(401).json({ error: 'Usuario no encontrado' });
		}

		if (user.token !== token) {
			return res.status(401).json({ error: 'Sesión inválida o cerrada' });
		}

		// ✅ Pasar el documento de Mongoose, no un objeto plano
		// Esto respeta select: false y toJSON del modelo
		req.user = user;

		next();
	} catch (error) {
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({ error: 'Token inválido' });
		}
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ error: 'Token expirado' });
		}
		return res.status(500).json({ error: 'Error interno' });
	}
};

export const findUserByEmail = async (req, res, next) => {
	const { email } = req.body;
	const user = await User.findOne({ email }).select('+password');
	
	if (!user) {
		return res.status(401).json({ error: 'Credenciales inválidas' });
	}
	
	req.foundUser = user;
	next();
};

export const comparePassword = async (req, res, next) => {
	const { password } = req.body;
	const user = req.foundUser;
	
	const isValid = await bcrypt.compare(password, user.password);
	if (!isValid) {
		return res.status(401).json({ error: 'Credenciales inválidas' });
	}
	
	next();
};

export const updateUserToken = async (req, res, next) => {
	const token = generateToken(req.foundUser.id, req.foundUser.role);
	req.foundUser.token = token;
	await req.foundUser.save();
	
	req.newToken = token;
	next();
};

export const clearUserToken = async (req, res, next) => {
	if (req.user) {
		req.user.token = null;
		await req.user.save();
	}
	next();
};

export default authMiddleware;