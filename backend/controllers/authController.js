import { registerWorkflow } from '../workflows/registerWorkflow.js';
import { loginWorkflow } from '../workflows/loginWorkflow.js';
import { logoutWorkflow } from '../workflows/logoutWorkflow.js';
import { sendResponse } from '../governance/responseCodes.js';

export const register = async (req, res) => {
	const result = await registerWorkflow(req.body);
	return sendResponse(res, result.code, result.data);
};

export const login = async (req, res) => {
	const result = await loginWorkflow(req.body, res);
	return sendResponse(res, result.code, result.data);
};

export const logout = async (req, res) => {
	const result = await logoutWorkflow(req.user, res);
	return sendResponse(res, result.code);
};