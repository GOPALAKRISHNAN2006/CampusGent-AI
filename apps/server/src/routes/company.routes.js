import { Router } from 'express';
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
} from '../controllers/company.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';

const router = Router();

router.get('/', authenticate, requirePermission('jobs:read'), getCompanies);
router.get('/:id', authenticate, requirePermission('jobs:read'), getCompanyById);
router.post('/', authenticate, requirePermission('jobs:write'), createCompany);
router.put('/:id', authenticate, requirePermission('jobs:write'), updateCompany);

export default router;
