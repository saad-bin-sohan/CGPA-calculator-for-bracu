import { Router } from 'express';
import {
  googleLogin,
  login,
  logout,
  me,
  register,
  updateProfile
} from '../controllers/authController.js';
import { authenticate, requireStudent } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', authenticate, requireStudent, me);
router.put('/profile', authenticate, requireStudent, updateProfile);
router.post('/logout', logout);

export default router;
