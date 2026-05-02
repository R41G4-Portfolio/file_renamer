import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { User } from '../models/index.js';

export const generateToken = (userId, role) => {
	try {
		return jwt.sign(
			{ userId, role },
			config.jwtSecret,
			{ expiresIn: config.jwtExpiresIn }
		);
	} catch (error) {
		console.error('Error en generateToken:', error);
		return null;
	}
};

export const setTokenCookie = (res, token) => {
	const isProduction = config.env === 'production';
	const isDevelopment = config.env === 'development';
	
	// Para desarrollo con Firefox, usar 'none' + secure=true (localhost lo permite)
	let sameSite = 'lax';
	let secure = false;
	
	if (isProduction) {
		secure = true;
		sameSite = 'strict';
	} else if (isDevelopment) {
		secure = true;        // Firefox requiere secure=true con sameSite=none
		sameSite = 'none';    // 'none' permite cookies entre diferentes puertos
	}
	
	res.cookie('token', token, {
		httpOnly: true,
		secure: secure,
		sameSite: sameSite,
		maxAge: 24 * 60 * 60 * 1000,
		path: '/'
	});
};

export const clearTokenCookie = (res) => {
	const isProduction = config.env === 'production';
	const isDevelopment = config.env === 'development';
	
	let sameSite = 'lax';
	let secure = false;
	
	if (isProduction) {
		secure = true;
		sameSite = 'strict';
	} else if (isDevelopment) {
		secure = true;
		sameSite = 'none';
	}
	
	res.clearCookie('token', {
		httpOnly: true,
		secure: secure,
		sameSite: sameSite,
		path: '/'
	});
};

export const updateUserToken = async (userId, token) => {
	await User.findByIdAndUpdate(userId, { token });
};

export const clearUserToken = async (userId) => {
	await User.findByIdAndUpdate(userId, { token: null });
};