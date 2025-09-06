import { Router } from 'express';
import { changePassword, login, register } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// A rota change-password é protegida pelo middleware 'protect'
router.post('/change-password', protect, changePassword);

export default router;