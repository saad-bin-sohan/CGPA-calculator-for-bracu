import { Router } from 'express';
import {
  createCourse,
  deleteCourse,
  listCourses,
  searchCourses,
  updateCourse
} from '../controllers/courseController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listCourses);
router.get('/search', searchCourses);
router.post('/', authenticate, requireAdmin, createCourse);
router.put('/:id', authenticate, requireAdmin, updateCourse);
router.delete('/:id', authenticate, requireAdmin, deleteCourse);

export default router;
