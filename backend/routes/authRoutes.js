import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateRegisterData, validateLoginData, isLoggedIn, isLoggedOut } from '../middleware/validations.js';
import { register, login, logout, getPerfil } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', isLoggedIn, validateRegisterData, register);
router.post('/login', isLoggedIn, validateLoginData, login);
router.post('/logout', isLoggedOut, logout);
router.get('/perfil', authMiddleware, getPerfil);

export default router;