import { Router } from 'express';
import { authenticate, requireStudent } from '../middleware/auth.js';
import { googleLogin, login, me, register, updateProfile } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', authenticate, requireStudent, me);
router.put('/profile', authenticate, requireStudent, updateProfile);

export default router;
