import { Router } from 'express';
import { createJob, getJobs, getJobById, updateJob, applyJob, getStudentApplications, getJobApplications, updateApplicationStatus, getAllApplications, getAllInterviews, scheduleInterview, updateInterviewStatus, } from '../controllers/job.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
const router = Router();
// Public routes for authenticated users
router.get('/', authenticate, getJobs);
router.get('/all-applications', authenticate, requirePermission('applications:read'), getAllApplications);
router.get('/all-interviews', authenticate, requirePermission('applications:read'), getAllInterviews);
router.get('/:id', authenticate, getJobById);
// Job Posting operations (Placement Officer / Admin)
router.post('/', authenticate, requirePermission('jobs:write'), createJob);
router.put('/:id', authenticate, requirePermission('jobs:write'), updateJob);
// Applications
router.post('/apply', authenticate, requirePermission('applications:create'), applyJob);
router.get('/student/applications', authenticate, requirePermission('applications:read'), getStudentApplications);
router.get('/job-applications/:jobId', authenticate, requirePermission('applications:read'), getJobApplications);
router.put('/application/:id/status', authenticate, requirePermission('applications:write'), updateApplicationStatus);
// Interviews management
router.post('/interviews', authenticate, requirePermission('applications:write'), scheduleInterview);
router.put('/interviews/:id/status', authenticate, requirePermission('applications:write'), updateInterviewStatus);
export default router;
