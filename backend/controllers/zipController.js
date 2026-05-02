import fs from 'fs-extra';
import path from 'path';
import { 
	findTemplateForZip,
	updateTemplateZipInfo
} from '../queries/zipQueries.js';
import { findUploadedAssignments } from '../queries/assignmentQueries.js';
import { createAuditLog } from '../queries/auditQueries.js';
import { generateZipFromAssignments } from '../services/zipService.js';

/*
 * POST /zip/generate/:templateId
 * Genera un ZIP con los archivos renombrados de una plantilla aprobada
 */
export const generateZip = async (req, res) => {
	try {
		const { templateId } = req.params;
		
		// Obtener template (SIN lean para poder guardar después)
		const template = await findTemplateForZip(templateId);
		if (!template) {
			return res.status(404).json({ error: 'Plantilla no encontrada' });
		}
		
		// Verificar permisos
		if (req.user.role !== 'ADMIN' && template.uploadedBy !== req.user.id && template.assignedTo !== req.user.id) {
			return res.status(403).json({ error: 'No tienes permiso' });
		}
		
		// Verificar que la plantilla esté COMPLETED (aprobada)
		if (template.status !== 'COMPLETED') {
			return res.status(400).json({ error: 'La plantilla debe estar aprobada para generar el ZIP' });
		}
		
		// Obtener assignments con archivos subidos (CON lean para procesar)
		const assignments = await findUploadedAssignments(template.id);
		if (assignments.length === 0) {
			return res.status(400).json({ error: 'No hay archivos subidos para esta plantilla' });
		}
		
		// Generar ZIP
		const { zipPath, zipChecksum, fileCount } = await generateZipFromAssignments(assignments, template);
		
		// Guardar referencia del ZIP en el template
		await updateTemplateZipInfo(template.id, zipPath, zipChecksum);
		
		// Registrar auditoría
		await createAuditLog({
			userId: req.user.id,
			action: 'GENERATE_ZIP',
			targetId: template.id,
			ipAddress: req.ip,
			userAgent: req.get('User-Agent'),
			details: { fileCount, zipChecksum: zipChecksum.substring(0, 16) }
		});
		
		res.json({
			message: 'ZIP generado correctamente',
			zipPath: `/uploads/output/${path.basename(zipPath)}`,
			zipChecksum: zipChecksum.substring(0, 16),
			fileCount
		});
		
	} catch (error) {
		console.error('Error en generateZip:', error);
		res.status(500).json({ error: 'Error al generar el ZIP' });
	}
};

/*
 * GET /zip/download/:templateId
 * Descarga el ZIP generado
 */
export const downloadZip = async (req, res) => {
	try {
		const { templateId } = req.params;
		
		// Obtener template (CON lean, solo necesitamos zipPath y permisos)
		const template = await findTemplateForZip(templateId);
		if (!template) {
			return res.status(404).json({ error: 'Plantilla no encontrada' });
		}
		
		// Verificar permisos
		if (req.user.role !== 'ADMIN' && template.uploadedBy !== req.user.id && template.assignedTo !== req.user.id) {
			return res.status(403).json({ error: 'No tienes permiso' });
		}
		
		if (!template.zipPath || !await fs.pathExists(template.zipPath)) {
			return res.status(404).json({ error: 'ZIP no encontrado. Primero debe generarlo.' });
		}
		
		// Registrar auditoría
		await createAuditLog({
			userId: req.user.id,
			action: 'DOWNLOAD_ZIP',
			targetId: template.id,
			ipAddress: req.ip,
			userAgent: req.get('User-Agent')
		});
		
		res.download(template.zipPath, `documentos_${template.id}.zip`);
		
	} catch (error) {
		console.error('Error en downloadZip:', error);
		res.status(500).json({ error: 'Error al descargar el ZIP' });
	}
};