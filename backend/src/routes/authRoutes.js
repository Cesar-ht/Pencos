import express from 'express';
import { registro, login, logout, getMe } from '../controllers/authController.js';
import { proteger } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/registro', registro);
router.post('/login', login);
router.post('/logout', proteger, logout);
router.get('/me', proteger, getMe);

export default router;