import { Assignment, Template } from '../models/index.js';

// Consultas para respuestas HTTP (SIN lean)
export const findAssignmentsByTemplate = async (templateId) => {
	return await Assignment.find({ templateId }).sort({ rowIndex: 1 });
};

export const findAssignmentByIdForResponse = async (assignmentId) => {
	return await Assignment.findById(assignmentId).populate('templateId');
};

// Consultas internas (CON lean)
export const findAssignmentByIdForValidation = async (assignmentId) => {
	return await Assignment.findById(assignmentId).lean();
};

export const findPendingAssignmentsByTemplate = async (templateId) => {
	return await Assignment.find({ templateId, status: 'PENDING' }).lean();
};

export const findAllAssignmentsByTemplate = async (templateId) => {
	return await Assignment.find({ templateId }).lean();
};

// NUEVA: Obtener assignments con archivos subidos (status UPLOADED)
export const findUploadedAssignments = async (templateId) => {
	return await Assignment.find({ 
		templateId, 
		status: 'UPLOADED' 
	}).lean();
};

// Operaciones de escritura
export const createAssignments = async (assignmentsData) => {
	return await Assignment.insertMany(assignmentsData);
};

export const updateAssignmentWithFile = async (assignmentId, fileData) => {
	const { originalName, normalizedName, sha256, filePath } = fileData;
	await Assignment.findByIdAndUpdate(assignmentId, {
		originalName,
		normalizedName,
		sha256,
		filePath,
		uploadedAt: new Date(),
		status: 'UPLOADED'
	});
};