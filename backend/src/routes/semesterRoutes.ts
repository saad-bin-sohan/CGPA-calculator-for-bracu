import { Router } from 'express';
import { authenticate, requireStudent } from '../middleware/auth.js';
import {
  createSemester,
  deleteSemester,
  getSemesters,
  updateSemester
} from '../controllers/semesterController.js';

const router = Router();

router.use(authenticate, requireStudent);
router.get('/', getSemesters);
router.post('/', createSemester);
router.put('/:id', updateSemester);
router.delete('/:id', deleteSemester);

export default router;
