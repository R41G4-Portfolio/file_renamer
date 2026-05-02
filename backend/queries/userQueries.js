import { User } from '../models/index.js';

// TIPO 1: CONSULTAS PARA RESPUESTAS HTTP (SIN lean)

// Obtener perfil de usuario (sin campos sensibles)
export const getUserProfile = async (userId) => {
	return await User.findById(userId);
};

// Obtener usuarios por rol (para asignar downloaders)
export const findUsersByRole = async (role) => {
	return await User.find({ role });
};

// TIPO 2: CONSULTAS INTERNAS (CON lean)

// Buscar usuario por email (sin password)
export const findUserByEmail = async (email) => {
	return await User.findOne({ email }).lean();
};

// Buscar usuario por ID (para validaciones)
export const findUserById = async (userId) => {
	return await User.findById(userId).lean();
};

// Buscar usuarios por nombre (para búsqueda)
export const searchUsersByName = async (name) => {
	return await User.find({ 
		name: { $regex: name, $options: 'i' } 
	}).lean();
};