import { Router } from 'express';
import { getStudentAnalytics, getPlacementAnalytics, getAdminAnalytics } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { UserRole } from '@campusgent/shared';
import { cacheRoute } from '../services/cache.service.js';

const router = Router();
router.get('/student', authenticate, requireRole([UserRole.STUDENT, UserRole.ADMIN]), getStudentAnalytics);
router.get('/placement', authenticate, requireRole([UserRole.PLACEMENT_OFFICER, UserRole.ADMIN]), cacheRoute(60), getPlacementAnalytics);
router.get('/admin', authenticate, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]), cacheRoute(60), getAdminAnalytics);
export default router;

