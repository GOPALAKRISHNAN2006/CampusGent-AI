import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  startSession,
  generateQuestion,
  evaluateAnswer,
  finishSession,
} from '../controllers/mock-interview.controller';

const router = Router();

router.use(authenticate);

router.post('/start', startSession);
router.post('/:id/question', generateQuestion);
router.post('/:id/answer', evaluateAnswer);
router.post('/:id/finish', finishSession);

export default router;
