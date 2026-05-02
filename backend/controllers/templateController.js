import XLSX from 'xlsx';
import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import { Template, Assignment, Audit, User } from '../models/index.js';
import { 
	createTemplate,
	findTemplateByIdForValidation,
	findTemplateByIdForResponse,
	findTemplatesByUser,
	findTemplateWithAssignments,
	updateTemplateStatus,
	assignTemplateToUser,
	updateTemplateZipInfo,
	findTemplatesAssignedToUser
} from '../queries/templateQueries.js';

import { 
	createAssignments,
	findAssignmentsByTemplate,
	findPendingAssignmentsByTemplate
} from '../queries/assignmentQueries.js';
import { createAuditLog } from '../queries/auditQueries.js';
import { findUserById } from '../queries/userQueries.js';

/*
 * GET /templates/download-template
 * Descarga una plantilla Excel con metadatos ocultos
 */
export const downloadTemplate = async (req, res) => {
	try {
		const data = [{ ruta: '', nombre: '' }];
		const wsPlantilla = XLSX.utils.json_to_sheet(data);

		const schemaVersion = '1';
		const contenidoFijo = JSON.stringify({ 
			schemaVersion, 
			columnas: ['ruta', 'nombre'] 
		});
		const plantillaHash = crypto.createHash('sha256').update(contenidoFijo).digest('hex').substring(0, 16);

		const metadata = [
			['schemaVersion', schemaVersion],
			['plantillaHash', plantillaHash],
			['columnas_requeridas', 'ruta,nombre']
		];
		const wsMetadata = XLSX.utils.aoa_to_sheet(metadata);

		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, wsPlantilla, 'Plantilla');
		XLSX.utils.book_append_sheet(wb, wsMetadata, '_Metadata');

		if (!wb.Workbook) wb.Workbook = {};
		if (!wb.Workbook.Sheets) wb.Workbook.Sheets = {};
		wb.Workbook.Sheets._Metadata = { Hidden: 1 };

		const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=plantilla_file_renamer.xlsx');
		res.send(buffer);

	} catch (error) {
		console.error('Error al generar plantilla:', error);
		res.status(500).json({ error: 'Error al generar la plantilla' });
	}
};

/*
 * POST /templates
 * Sube y valida una plantilla Excel, crea Template y Assignments
 */
export const uploadTemplate = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No se recibió ningún archivo' });
		}

		const filePath = path.join(process.cwd(), req.file.path);
		if (!await fs.pathExists(filePath)) {
			return res.status(400).json({ error: 'El archivo no se guardó correctamente' });
		}

		const fileBuffer = await fs.readFile(filePath);
		const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
		
		let metadataSheet = workbook.Sheets['_Metadata'] || workbook.Sheets['Metadata'];
		if (!metadataSheet) {
			await fs.remove(filePath);
			return res.status(400).json({ error: 'Plantilla inválida: falta hoja de metadatos' });
		}

		const metadataRows = XLSX.utils.sheet_to_json(metadataSheet, { header: 1 });
		const metadata = {};
		for (const row of metadataRows) {
			if (row[0] && row[1]) metadata[row[0]] = row[1];
		}

		if (metadata.schemaVersion !== '1') {
			await fs.remove(filePath);
			return res.status(400).json({ error: 'Versión de plantilla no soportada' });
		}

		if (metadata.columnas_requeridas !== 'ruta,nombre') {
			await fs.remove(filePath);
			return res.status(400).json({ error: 'Columnas requeridas: ruta, nombre' });
		}

		const plantillaSheet = workbook.Sheets['Plantilla'];
		if (!plantillaSheet) {
			await fs.remove(filePath);
			return res.status(400).json({ error: 'Plantilla inválida: falta hoja "Plantilla"' });
		}

		const rows = XLSX.utils.sheet_to_json(plantillaSheet);
		if (rows.length === 0) {
			await fs.remove(filePath);
			return res.status(400).json({ error: 'La plantilla no contiene datos' });
		}

		// Validar todas las filas y recolectar errores
		const errores = [];
		for (let i = 0; i < rows.length; i++) {
			const row = rows[i];
			if (!row.ruta || !row.nombre) {
				errores.push({
					fila: i + 1,
					ruta: row.ruta || '',
					nombre: row.nombre || '',
					error: 'Campos requeridos: ruta y nombre'
				});
			}
		}

		// Si hay errores, NO guardar NADA, solo devolver Excel con errores
		if (errores.length > 0) {
			const errorSheet = XLSX.utils.json_to_sheet(errores);
			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, errorSheet, 'Errores');
			
			const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
			
			res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.setHeader('Content-Disposition', 'attachment; filename=errores_plantilla.xlsx');
			
			// Limpiar archivo subido
			await fs.remove(filePath);
			
			return res.status(400).send(buffer);
		}

		// Si no hay errores, crear Template y Assignments
		const template = await createTemplate({
			uploadedBy: req.user.id,
			title: req.body.title || 'Sin título',
			excelFileName: req.file.originalname,
			excelFilePath: req.file.path,
			rowCount: rows.length,
			status: 'ACTIVE'
		});

		const assignmentsData = rows.map((row, i) => ({
			templateId: template.id,
			rowIndex: i,
			ruta: row.ruta,
			nombreDeseado: row.nombre,
			status: 'PENDING'
		}));
		await createAssignments(assignmentsData);

		await createAuditLog({
			userId: req.user.id,
			action: 'UPLOAD_TEMPLATE',
			targetId: template.id,
			ipAddress: req.ip,
			userAgent: req.get('User-Agent'),
			details: {
				fileName: req.file.originalname,
				rowCount: rows.length
			}
		});

		res.status(201).json({
			message: 'Plantilla subida correctamente',
			template: {
				id: template.id,
				rowCount: rows.length,
				status: template.status
			}
		});

	} catch (error) {
		console.error('Error en uploadTemplate:', error);
		const filePath = req.file ? path.join(process.cwd(), req.file.path) : null;
		if (filePath && await fs.pathExists(filePath)) {
			await fs.remove(filePath).catch(() => {});
		}
		res.status(500).json({ error: 'Error interno del servidor' });
	}
};

/*
 * GET /templates
 * Lista todas las plantillas (filtradas por rol)
 */
export const getTemplates = async (req, res) => {
	try {
		const templates = await findTemplatesByUser(req.user.id, req.user.role);
		res.json(templates);
	} catch (error) {
		console.error('Error en getTemplates:', error);
		res.status(500).json({ error: 'Error al cargar plantillas' });
	}
};

/*
 * GET /templates/:id
 * Obtiene una plantilla por ID con sus assignments
 */
export const getTemplateById = async (req, res) => {
	try {
		const result = await findTemplateWithAssignments(req.params.id);
		if (!result.template) {
			return res.status(404).json({ error: 'Plantilla no encontrada' });
		}
		
		// CORREGIDO: uploadedBy es string, no objeto con .id
		if (req.user.role !== 'ADMIN' && result.template.uploadedBy !== req.user.id) {
			return res.status(403).json({ error: 'No tienes permiso' });
		}
		
		res.json({
			...result.template,
			assignments: result.assignments
		});
	} catch (error) {
		console.error('Error en getTemplateById:', error);
		res.status(500).json({ error: 'Error al obtener la plantilla' });
	}
};

/*
 * PUT /templates/:id/assign
 * Asigna un downloader a una plantilla
 */
export const assignTemplate = async (req, res) => {
	try {
		const { email } = req.body;
		const { id } = req.params;  // ← el templateId viene de la URL
		
		if (!email) {
			return res.status(400).json({ error: 'Se requiere email' });
		}
		
		if (!id) {
			return res.status(400).json({ error: 'Se requiere ID de plantilla' });
		}
		
		// Buscar plantilla (SIN lean para poder guardar después)
		const template = await Template.findById(id);
		if (!template) {
			return res.status(404).json({ error: 'Plantilla no encontrada' });
		}
		
		// Verificar permisos
		if (req.user.role !== 'ADMIN' && template.uploadedBy !== req.user.id) {
			return res.status(403).json({ error: 'No tienes permiso' });
		}
		
		// Verificar que la plantilla esté activa
		if (template.status !== 'ACTIVE') {
			return res.status(400).json({ error: 'La plantilla no está activa' });
		}
		
		// Buscar usuario por email (CON lean para validación)
		const userToAssign = await User.findOne({ email }).lean();
		if (!userToAssign) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}
		
		if (userToAssign.role !== 'DOWNLOADER') {
			return res.status(400).json({ error: 'Solo se puede asignar a usuarios con rol DOWNLOADER' });
		}
		
		// Asignar
		template.assignedTo = userToAssign._id;
		await template.save();
		
		// Auditoría
		await Audit.create({
			userId: req.user.id,
			action: 'ASSIGN_TEMPLATE',
			targetId: template.id,
			ipAddress: req.ip,
			userAgent: req.get('User-Agent'),
			details: { assignedTo: email }
		});
		
		res.json({ message: 'Usuario asignado correctamente' });
	} catch (error) {
		console.error('Error en assignTemplate:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
};

/*
 * POST /templates/:id/approve
 * Aprueba una plantilla (marca como COMPLETED) solo si todos los assignments están UPLOADED
 */
export const approveTemplate = async (req, res) => {
	try {
		const template = await findTemplateByIdForValidation(req.params.id);
		if (!template) {
			return res.status(404).json({ error: 'Plantilla no encontrada' });
		}
		
		if (req.user.role !== 'ADMIN' && template.uploadedBy !== req.user.id) {
			return res.status(403).json({ error: 'No tienes permiso' });
		}
		
		if (template.status !== 'ACTIVE') {
			return res.status(400).json({ error: 'La plantilla no está activa' });
		}
		
		const pendingAssignments = await findPendingAssignmentsByTemplate(template._id);
		if (pendingAssignments.length > 0) {
			return res.status(400).json({ 
				error: `No se puede aprobar. Faltan ${pendingAssignments.length} archivos por subir.`,
				pendingCount: pendingAssignments.length
			});
		}
		
		await updateTemplateStatus(template._id, 'COMPLETED');
		
		await createAuditLog({
			userId: req.user.id,
			action: 'APPROVE_TEMPLATE',
			targetId: template._id,
			ipAddress: req.ip,
			userAgent: req.get('User-Agent')
		});
		
		res.json({ message: 'Plantilla aprobada correctamente' });
	} catch (error) {
		console.error('Error en approveTemplate:', error);
		res.status(500).json({ error: 'Error al aprobar plantilla' });
	}
};

/*
 * DELETE /templates/:id
 * Cancela una plantilla
 */
export const cancelTemplate = async (req, res) => {
	try {
		const template = await findTemplateByIdForValidation(req.params.id);
		if (!template) {
			return res.status(404).json({ error: 'Plantilla no encontrada' });
		}
		
		if (req.user.role !== 'ADMIN' && template.uploadedBy !== req.user.id) {
			return res.status(403).json({ error: 'No tienes permiso' });
		}
		
		await updateTemplateStatus(template._id, 'CANCELLED');
		
		if (template.excelFilePath) {
			const filePath = path.join(process.cwd(), template.excelFilePath);
			if (await fs.pathExists(filePath)) {
				await fs.remove(filePath).catch(() => {});
			}
		}
		
		await createAuditLog({
			userId: req.user.id,
			action: 'CANCEL_TEMPLATE',
			targetId: template._id,
			ipAddress: req.ip,
			userAgent: req.get('User-Agent')
		});
		
		res.json({ message: 'Plantilla cancelada correctamente' });
	} catch (error) {
		console.error('Error en cancelTemplate:', error);
		res.status(500).json({ error: 'Error al cancelar plantilla' });
	}
};



// ESPECÍFICO PARA DOWNLOADER PANEL
export const getMyAssignedTemplates = async (req, res) => {
	try {
		console.log('=== getMyAssignedTemplates ===');
		console.log('Usuario:', req.user);
		console.log('req.user.id:', req.user.id);
		console.log('req.user.role:', req.user.role);
		
		if (req.user.role !== 'DOWNLOADER') {
			console.log('Rol no es DOWNLOADER, denegando acceso');
			return res.status(403).json({ error: 'Solo DOWNLOADER pueden ver esta información' });
		}
		
		console.log('Llamando a findTemplatesAssignedToUser...');
		const templates = await findTemplatesAssignedToUser(req.user.id);
		console.log('Respuesta de findTemplatesAssignedToUser:', templates);
		res.json(templates);
	} catch (error) {
		console.error('Error en getMyAssignedTemplates:', error);
		res.status(500).json({ error: 'Error al cargar tus tareas' });
	}
};