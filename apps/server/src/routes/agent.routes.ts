import { Router } from 'express';
import { executeAgent, runOrchestrator } from '../controllers/agent.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/execute/:name', authenticate, executeAgent);
router.post('/orchestrator/run', authenticate, runOrchestrator);

export default router;
