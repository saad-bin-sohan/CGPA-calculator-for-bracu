import { Router } from 'express';
import { getStudentProfile, listStudents } from '../controllers/studentController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, requireAdmin);
router.get('/', listStudents);
router.get('/:id', getStudentProfile);

export default router;
