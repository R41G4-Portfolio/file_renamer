import { clearUserToken, clearTokenCookie } from '../utils/tokenUtils.js';
import { Audit } from '../models/index.js';

export const logoutWorkflow = async (user, res) => {
	if (user) {
		await clearUserToken(user.id);
		await Audit.create({
			userId: user.id,
			action: 'LOGOUT',
			timestamp: new Date()
		});
	}
	clearTokenCookie(res);
	
	return { code: 'LOGGED_OUT' };
};