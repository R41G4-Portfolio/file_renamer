import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import requireRole from '../middleware/rbacMiddleware.js';
import { uploadDocument } from '../middleware/uploadMiddleware.js';
import { uploadAssignmentFile } from '../controllers/assignmentController.js';

const router = express.Router();

router.post('/upload/:assignmentId', 
	authMiddleware, 
	requireRole(['ADMIN', 'DOWNLOADER']), 
	uploadDocument, 
	uploadAssignmentFile
);

export default router;