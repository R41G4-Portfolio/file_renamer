import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';

// TIPO 1: CONSULTAS PARA RESPUESTAS HTTP (SIN lean)

// Obtener usuario por ID para respuesta (respeta select: false)
export const findUserByIdForResponse = async (userId) => {
	return await User.findById(userId);
};

// TIPO 2: CONSULTAS INTERNAS (CON lean)

// Buscar usuario por email con password (para login)
export const findUserByEmailForLogin = async (email) => {
	return await User.findOne({ email }).select('+password').lean();
};

// Verificar si email existe
export const emailExists = async (email) => {
	const user = await User.findOne({ email }).lean();
	return !!user;
};

// Buscar usuario con token (para validar sesión)
export const findUserByIdWithToken = async (userId) => {
	return await User.findById(userId).select('+token').lean();
};

// TIPO 3: OPERACIONES DE ESCRITURA

// Crear nuevo usuario
export const createUser = async (userData) => {
	const { email, password, name, role } = userData;
	const hashedPassword = await bcrypt.hash(password, 10);
	
	return await User.create({
		email,
		password: hashedPassword,
		name,
		role: 'DOWNLOADER'
	});
};

// Actualizar token
export const updateUserToken = async (userId, token) => {
	await User.findByIdAndUpdate(userId, { token });
};

// Limpiar token (logout)
export const clearUserToken = async (userId) => {
	await User.findByIdAndUpdate(userId, { token: null });
};