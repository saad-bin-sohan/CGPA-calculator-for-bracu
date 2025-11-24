import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { getStudentProfile, listStudents } from '../controllers/studentController.js';

const router = Router();

router.use(authenticate, requireAdmin);
router.get('/', listStudents);
router.get('/:id', getStudentProfile);

export default router;
