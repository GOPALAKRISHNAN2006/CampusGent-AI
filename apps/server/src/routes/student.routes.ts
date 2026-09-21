import { Router } from 'express';
import { getProfile, updateProfile, createStudent, getStudentsList } from '../controllers/student.controller';
import { authenticate } from '../middleware/auth';
import { requirePermission, requireRole } from '../middleware/rbac';
import { UserRole } from '@campusgent/shared';

const router = Router();

router.get('/', authenticate, getStudentsList);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, requirePermission('profile:write'), updateProfile);
router.post('/', authenticate, requireRole([UserRole.FACULTY, UserRole.ADMIN]), createStudent);

export default router;
