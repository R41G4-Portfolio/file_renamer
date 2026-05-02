import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { generateZip, downloadZip } from '../controllers/zipController.js';

const router = express.Router();

router.post('/generate/:templateId', authMiddleware, generateZip);
router.get('/download/:templateId', authMiddleware, downloadZip);

export default router;