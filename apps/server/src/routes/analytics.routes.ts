import { Router } from 'express';
import { getStudentAnalytics, getPlacementAnalytics, getAdminAnalytics } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { UserRole } from '@campusgent/shared';

const router = Router();

router.get('/student', authenticate, requireRole([UserRole.STUDENT, UserRole.ADMIN]), getStudentAnalytics);
router.get('/placement', authenticate, requireRole([UserRole.PLACEMENT_OFFICER, UserRole.ADMIN]), getPlacementAnalytics);
router.get('/admin', authenticate, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), getAdminAnalytics);

export default router;
