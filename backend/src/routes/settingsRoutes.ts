import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticate, requireAdmin, updateSettings);

export default router;
