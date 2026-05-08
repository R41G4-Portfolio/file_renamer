import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import { 
	findAssignmentByIdForResponse,
	findAssignmentByIdForValidation,
	updateAssignmentWithFile
} from '../queries/assignmentQueries.js';
import { findTemplateByIdForResponse } from '../queries/templateQueries.js';
import { createAuditLog } from '../queries/auditQueries.js';
import { normalizeFileName } from '../utils/fileUtils.js';

/*
 * POST /assignments/upload/:assignmentId
 * Sube un archivo para un assignment específico
 */
export const uploadAssignmentFile = async (req, res) => {
	try {
		// Verificar que se recibió un archivo
		if (!req.file) {
			return res.status(400).json({ error: 'No se recibió ningún archivo' });
		}

		const { assignmentId } = req.params;

		// Buscar el assignment (CON lean para validación interna)
		const assignment = await findAssignmentByIdForValidation(assignmentId);
		if (!assignment) {
			await fs.remove(req.file.path);
			return res.status(404).json({ error: 'Asignación no encontrada' });
		}

		// Verificar que el usuario sea el asignado o admin
		const template = await findTemplateByIdForResponse(assignment.templateId);
		// Si template.assignedTo es un objeto (porque está populado), extraemos su _id
		// Si es solo el string/UUID, lo usamos directamente
		const assignedToData = template.assignedTo;
		const assignedToId = String(assignedToData._id || assignedToData).trim();

		const userId = String(req.user._id || req.user.id).trim();

		console.log("Validando acceso para subir archivo:");
		console.log("- Usuario logueado:", userId);
		console.log("- Usuario asignado (extraído):", assignedToId);

		const isAuthorized = req.user.role === 'ADMIN' || userId === assignedToId;

		if (!isAuthorized) {
			if (req.file && req.file.path) {
				await fs.remove(req.file.path);
			}
			return res.status(403).json({ 
				error: 'No tienes permiso para subir archivos',
				details: `Comparando ${userId} contra ${assignedToId}` 
			});
		}


		// Verificar que el assignment esté pendiente
		if (assignment.status !== 'PENDING') {
			await fs.remove(req.file.path);
			return res.status(400).json({ error: 'Esta asignación ya fue completada o cancelada' });
		}

		// Normalizar el nombre del archivo
		const normalizedName = normalizeFileName(assignment.nombreDeseado);
		
		// Calcular SHA256 del archivo
		const fileBuffer = await fs.readFile(req.file.path);
		const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

		// Actualizar assignment
		await updateAssignmentWithFile(assignmentId, {
			originalName: req.file.originalname,
			normalizedName: normalizedName,
			sha256: sha256,
			filePath: req.file.path,
			uploadedAt: new Date(),
			status: 'UPLOADED'
		});

		// Registrar auditoría
		await createAuditLog({
			userId: req.user.id,
			action: 'UPLOAD_FILE',
			targetId: assignmentId,
			ipAddress: req.ip,
			userAgent: req.get('User-Agent'),
			details: {
				originalName: req.file.originalname,
				normalizedName: normalizedName,
				sha256: sha256.substring(0, 16)
			}
		});

		res.json({
			message: 'Archivo subido correctamente',
			assignment: {
				id: assignmentId,
				status: 'UPLOADED',
				normalizedName: normalizedName,
				sha256: sha256.substring(0, 16)
			}
		});

	} catch (error) {
		console.error('Error en uploadAssignmentFile:', error);
		if (req.file && req.file.path) {
			await fs.remove(req.file.path).catch(() => {});
		}
		res.status(500).json({ error: 'Error al subir el archivo' });
	}
};