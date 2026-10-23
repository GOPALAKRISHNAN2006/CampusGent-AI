import { Router } from 'express';
import {
    getAssignedClasses,
    getClassDetail,
    submitAttendance,
    getAttendanceLogs,
    createAssessment,
    getAssessments,
    submitMarks,
    getStudentMarks,
    getAtRiskStudents,
    getFacultyTimetable,
    getAcademicEvents,
    createAcademicEvent,
    deleteAcademicEvent,
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} from '../controllers/faculty.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { UserRole } from '@campusgent/shared';

const router = Router();

// Apply auth to all faculty routes
router.use(authenticate);

// Faculty classes, attendance, assessments & timetable
router.get('/classes', requireRole([UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]), getAssignedClasses);
router.get('/classes/:classId', requireRole([UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]), getClassDetail);
router.post('/attendance', requireRole([UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]), submitAttendance);
router.get('/attendance', requireRole([UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]), getAttendanceLogs);
router.post('/assessments', requireRole([UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]), createAssessment);
router.get('/assessments', requireRole([UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]), getAssessments);
router.post('/marks', requireRole([UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]), submitMarks);
router.get('/marks', requireRole([UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]), getStudentMarks);
router.get('/at-risk', requireRole([UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]), getAtRiskStudents);
router.get('/timetable', requireRole([UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]), getFacultyTimetable);

// Academic Events & Calendar
router.get('/calendar', getAcademicEvents);
router.post('/calendar', requireRole([UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]), createAcademicEvent);
router.delete('/calendar/:id', requireRole([UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]), deleteAcademicEvent);

// Circulars & Announcements
router.get('/announcements', getAnnouncements);
router.post('/announcements', requireRole([UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]), createAnnouncement);
router.put('/announcements/:id', requireRole([UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]), updateAnnouncement);
router.delete('/announcements/:id', requireRole([UserRole.FACULTY, UserRole.ADMIN, UserRole.SUPER_ADMIN]), deleteAnnouncement);

export default router;
