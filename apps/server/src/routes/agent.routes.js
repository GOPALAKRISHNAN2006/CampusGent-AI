import { Router } from 'express';
import { executeAgent, runOrchestrator } from '../controllers/agent.controller.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
router.post('/execute/:name', authenticate, executeAgent);
router.post('/orchestrator/run', authenticate, runOrchestrator);
export default router;
