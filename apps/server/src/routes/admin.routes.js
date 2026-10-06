import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { UserRole } from '@campusgent/shared';
import {
  getSystemHealth,
  getUsers,
  updateUserRole,
  getAuditLogs,
  getDepartments,
  createDepartment,
} from '../controllers/admin.controller.js';

const router = Router();

// Protect all admin routes with auth and ADMIN / SUPER_ADMIN role
router.use(authenticate, requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]));

router.get('/health', getSystemHealth);
router.get('/users', getUsers);
router.put('/users/:userId/role', updateUserRole);
router.get('/audit-logs', getAuditLogs);
router.get('/departments', getDepartments);
router.post('/departments', createDepartment);

export default router;
