import { Router } from 'express';
import {
  getCareerAdvisor,
  getResumeAnalyzer,
  uploadResumeAnalyzer,
  getInterviewPrep,
  evaluateMockInterview,
  executeAgent,
} from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/career-advisor', authenticate, requirePermission('ai:career'), getCareerAdvisor);
router.post('/resume-analyzer', authenticate, requirePermission('ai:resume'), getResumeAnalyzer);
router.post('/resume-analyzer/upload', authenticate, requirePermission('ai:resume'), upload.single('resumePdf'), uploadResumeAnalyzer);
router.post('/interview-prep', authenticate, requirePermission('ai:interview'), getInterviewPrep);
router.post('/mock-interview/evaluate', authenticate, requirePermission('ai:interview'), evaluateMockInterview);

// Dynamic execution for distinct new agents
router.post('/execute/:agentName', authenticate, executeAgent);

export default router;
