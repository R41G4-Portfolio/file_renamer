import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import requireRole from '../middleware/rbacMiddleware.js';
import { uploadExcel } from '../middleware/uploadMiddleware.js';
import { 
	downloadTemplate, 
	uploadTemplate, 
	getTemplates, 
	getTemplateById,
	assignTemplate,
	approveTemplate,
	cancelTemplate,
	getMyAssignedTemplates
} from '../controllers/templateController.js';

const router = express.Router();

// PRIMERO: rutas específicas (sin :id)
router.get('/my-assigned', authMiddleware, getMyAssignedTemplates);
router.get('/download-template', authMiddleware, requireRole(['ADMIN', 'UPLOADER']), downloadTemplate);

// DESPUÉS: rutas con parámetros
router.get('/', authMiddleware, getTemplates);
router.get('/:id', authMiddleware, getTemplateById);
router.post('/', authMiddleware, requireRole(['ADMIN', 'UPLOADER']), uploadExcel, uploadTemplate);
router.put('/:id/assign', authMiddleware, requireRole(['ADMIN', 'UPLOADER']), assignTemplate);
router.post('/:id/approve', authMiddleware, requireRole(['ADMIN', 'UPLOADER']), approveTemplate);
router.delete('/:id', authMiddleware, cancelTemplate);

export default router;