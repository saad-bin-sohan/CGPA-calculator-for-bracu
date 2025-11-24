import { Router } from 'express';
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment
} from '../controllers/departmentController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getDepartments);
router.post('/', authenticate, requireAdmin, createDepartment);
router.put('/:id', authenticate, requireAdmin, updateDepartment);
router.delete('/:id', authenticate, requireAdmin, deleteDepartment);

export default router;
