import { Router } from 'express';
import { executeAgent, runOrchestrator, routeAndExecute, classifyRequest } from '../controllers/agent.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/execute/:name', authenticate, executeAgent);
router.post('/orchestrator/run', authenticate, runOrchestrator);
router.post('/route', authenticate, routeAndExecute);
router.post('/classify', authenticate, classifyRequest);

export default router;
