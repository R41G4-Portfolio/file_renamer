import { User, Audit } from '../models/index.js';
import bcrypt from 'bcryptjs';

export const registerWorkflow = async (userData) => {
	const { email, password, name } = userData;
	
	// Validar email no existente
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return { code: 'EMAIL_EXISTS' };
	}
	
	// Validar contraseña
	if (!password || password.length < 6) {
		return { code: 'INVALID_PASSWORD' };
	}
	
	// Validar nombre
	if (!name || name.trim() === '') {
		return { code: 'INVALID_NAME' };
	}
	
	// Crear usuario
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await User.create({
		email,
		password: hashedPassword,
		name,
		role: 'DOWNLOADER'
	});
	
	if (!user) {
		return { code: 'INTERNAL_ERROR' };
	}
	
	// Auditar
	await Audit.create({
		userId: user.id,
		action: 'REGISTER',
		timestamp: new Date()
	});
	
	return { 
		code: 'CREATED', 
		data: { userId: user.id, email: user.email }
	};
};