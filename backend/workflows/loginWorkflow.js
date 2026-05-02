import { User, Audit } from '../models/index.js';
import bcrypt from 'bcryptjs';
import { generateToken, updateUserToken, setTokenCookie } from '../utils/tokenUtils.js';

export const loginWorkflow = async (credentials, res) => {
	const { email, password } = credentials;
	
	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		return { code: 'INVALID_CREDENTIALS' };
	}
	
	const isValid = await bcrypt.compare(password, user.password);
	if (!isValid) {
		return { code: 'INVALID_CREDENTIALS' };
	}
	
	const token = generateToken(user.id, user.role);
	await updateUserToken(user.id, token);
	
	// El workflow establece la cookie
	setTokenCookie(res, token);

	await Audit.create({
		userId: user.id,
		action: 'LOGIN',
		timestamp: new Date()
	});
	
	return { 
		code: 'SUCCESS',
		data: {
			email: user.email,
			name: user.name,
			role: user.role
		}
	};
};