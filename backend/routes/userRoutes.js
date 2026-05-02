import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getUsersByRole, searchUsers, getPublicUserProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/role/:role', authMiddleware, getUsersByRole);
router.get('/search', authMiddleware, searchUsers);
router.get('/:userId/profile', authMiddleware, getPublicUserProfile);

export default router;