import { Router } from 'express';
import {
  createGradeEntry,
  deleteGradeEntry,
  listGradeScale,
  updateGradeEntry
} from '../controllers/gradeScaleController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listGradeScale);
router.post('/', authenticate, requireAdmin, createGradeEntry);
router.put('/:id', authenticate, requireAdmin, updateGradeEntry);
router.delete('/:id', authenticate, requireAdmin, deleteGradeEntry);

export default router;
