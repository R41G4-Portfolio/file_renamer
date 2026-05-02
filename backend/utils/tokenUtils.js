import jwt from 'jsonwebtoken';
import config from '../config/index.js';

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
	console.log('setTokenCookie ejecutándose');
	console.log('Token:', token);
	
	res.cookie('token', token, {
		httpOnly: true,
		secure: false,
		sameSite: 'lax',
		maxAge: 24 * 60 * 60 * 1000,
		path: '/'
	});
	
	console.log('Headers después de cookie:', res.getHeaders());
};

export const clearTokenCookie = (res) => {
	console.log('clearTokenCookie ejecutándose');
	
	res.clearCookie('token', {
		httpOnly: true,
		secure: false,
		sameSite: 'lax',
		path: '/'
	});
};