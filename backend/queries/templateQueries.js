import { Template, Assignment, Audit } from '../models/index.js';

// Consultas para respuestas HTTP (SIN lean)
export const findTemplateByIdForResponse = async (templateId) => {
	return await Template.findById(templateId)
		.populate('uploadedBy', 'name email')
		.populate('assignedTo', 'name email');
};

export const findTemplatesByUser = async (userId, role) => {
	let filter = {};
	if (role !== 'ADMIN') {
		filter.uploadedBy = userId;
	}
	return await Template.find(filter)
		.populate('uploadedBy', 'name email')
		.populate('assignedTo', 'name email')
		.sort({ uploadedAt: -1 });
};


// QUERY ESPECÍFICA PARA DOWNLOADER PANEL
export const findTemplatesAssignedToUser = async (userId) => {
	console.log('=== findTemplatesAssignedToUser ===');
	console.log('userId recibido:', userId);
	console.log('Tipo de userId:', typeof userId);
	
	const filter = { assignedTo: userId };
	console.log('Filtro:', filter);
	
	const templates = await Template.find(filter)
		.populate('uploadedBy', 'name email')
		.populate('assignedTo', 'name email')
		.sort({ uploadedAt: -1 });
	
	console.log('Templates encontrados en BD:', templates.length);
	
	const templatesWithAssignments = await Promise.all(templates.map(async (template) => {
		const assignments = await Assignment.find({ templateId: template.id }).sort({ rowIndex: 1 });
		return {
			...template.toJSON(),
			assignments
		};
	}));
	
	console.log('Templates con assignments:', templatesWithAssignments.length);
	return templatesWithAssignments;
};

// Consultas internas (CON lean) para validaciones
export const findTemplateByIdForValidation = async (templateId) => {
	return await Template.findById(templateId).lean();
};

export const findTemplateWithAssignments = async (templateId) => {
	const template = await Template.findById(templateId).lean();
	const assignments = await Assignment.find({ templateId }).lean();
	return { template, assignments };
};

// Operaciones de escritura
export const createTemplate = async (templateData) => {
	return await Template.create(templateData);
};

export const updateTemplateStatus = async (templateId, status) => {
	await Template.findByIdAndUpdate(templateId, { status });
};

export const assignTemplateToUser = async (templateId, userId) => {
	await Template.findByIdAndUpdate(templateId, { assignedTo: userId });
};

export const updateTemplateZipInfo = async (templateId, zipPath, zipChecksum) => {
	await Template.findByIdAndUpdate(templateId, {
		zipPath,
		zipChecksum,
		zipGeneratedAt: new Date()
	});
};

