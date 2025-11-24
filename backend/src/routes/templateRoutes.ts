import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  createTemplate,
  deleteTemplate,
  listTemplates,
  updateTemplate
} from '../controllers/templateController.js';

const router = Router();

router.get('/', listTemplates);
router.post('/', authenticate, requireAdmin, createTemplate);
router.put('/:id', authenticate, requireAdmin, updateTemplate);
router.delete('/:id', authenticate, requireAdmin, deleteTemplate);

export default router;
