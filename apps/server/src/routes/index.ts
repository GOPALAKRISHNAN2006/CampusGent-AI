import { Router } from 'express';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import jobRoutes from './job.routes';
import analyticsRoutes from './analytics.routes';
import notificationRoutes from './notification.routes';
import aiRoutes from './ai.routes';
import agentRoutes from './agent.routes';
import mockInterviewRoutes from './mock-interview.routes';
import facultyRoutes from './faculty.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/jobs', jobRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/ai', aiRoutes);
router.use('/agents', agentRoutes);
router.use('/mock-interviews', mockInterviewRoutes);
router.use('/faculty', facultyRoutes);

export default router;
