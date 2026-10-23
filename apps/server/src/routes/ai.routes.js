import { Router } from 'express';
import {
    getCareerAdvisor,
    getResumeAnalyzer,
    uploadResumeAnalyzer,
    getInterviewPrep,
    evaluateMockInterview,
    executeAgent,
    getConversationHistory,
    listUserConversations,
    resetConversation,
    deleteConversation,
} from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { requirePermission } from '../middleware/rbac.js';
import multer from 'multer';
import { BadRequestError } from '../utils/errors.js';

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new BadRequestError('File type unsupported: Only PDF documents (.pdf) up to 5MB are permitted.'));
        }
    },
});

router.use(aiLimiter);

// AI Conversation History & Memory
router.get('/conversations', authenticate, listUserConversations);
router.get('/conversations/current', authenticate, getConversationHistory);
router.delete('/conversations', authenticate, resetConversation);
router.delete('/conversations/:id', authenticate, deleteConversation);

router.post('/career-advisor', authenticate, requirePermission('ai:career'), getCareerAdvisor);
router.post('/resume-analyzer', authenticate, requirePermission('ai:resume'), getResumeAnalyzer);
router.post('/resume-analyzer/upload', authenticate, requirePermission('ai:resume'), upload.single('resumePdf'), uploadResumeAnalyzer);
router.post('/interview-prep', authenticate, requirePermission('ai:interview'), getInterviewPrep);
router.post('/mock-interview/evaluate', authenticate, requirePermission('ai:interview'), evaluateMockInterview);

// Dynamic execution for distinct new agents
router.post('/execute/:agentName', authenticate, executeAgent);

export default router;
