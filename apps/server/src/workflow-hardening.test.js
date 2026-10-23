import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { User } from './models/User.js';
import { StudentProfile } from './models/StudentProfile.js';
import { Job } from './models/Job.js';
import { JobApplication } from './models/JobApplication.js';
import { Department } from './models/Department.js';
import { AcademicEvent } from './models/AcademicEvent.js';
import { Announcement } from './models/Announcement.js';
import { ConversationMemory } from './models/ConversationMemory.js';
import { CourseClass } from './models/CourseClass.js';
import { AttendanceRecord } from './models/AttendanceRecord.js';
import { StudentMark } from './models/StudentMark.js';
import { AIInsight } from './models/AIInsight.js';
import { recalculateStudentAcademicMetrics } from './controllers/faculty.controller.js';
import { memoryManager } from './ai/memory.manager.js';
import { ApplicationStatus } from '@campusgent/shared';

describe('🔒 CampusGent-AI Workflow Improvement & Production Hardening Suite', () => {
    let adminUser, facultyUser, placementUser, studentUser;
    let adminToken, facultyToken, placementToken, studentToken;
    let createdEventId, createdAnnouncementId;
    let testJob, testApplication;

    beforeAll(async () => {
        await connectDB();

        const dummyHash = '$2b$12$e8xOq8iUqV9c49mN0sN.Qe7b7Z4G/cW6D9h1O5eQ9bZ';

        adminUser = await User.findOneAndUpdate(
            { email: 'admin.workflow@campusgent.edu' },
            { name: 'Admin Workflow', email: 'admin.workflow@campusgent.edu', passwordHash: dummyHash, role: 'ADMIN', status: 'ACTIVE' },
            { upsert: true, new: true }
        );

        facultyUser = await User.findOneAndUpdate(
            { email: 'faculty.workflow@campusgent.edu' },
            { name: 'Dr. Faculty Workflow', email: 'faculty.workflow@campusgent.edu', passwordHash: dummyHash, role: 'FACULTY', status: 'ACTIVE' },
            { upsert: true, new: true }
        );

        placementUser = await User.findOneAndUpdate(
            { email: 'placement.workflow@campusgent.edu' },
            { name: 'Placement Officer Workflow', email: 'placement.workflow@campusgent.edu', passwordHash: dummyHash, role: 'PLACEMENT_OFFICER', status: 'ACTIVE' },
            { upsert: true, new: true }
        );

        studentUser = await User.findOneAndUpdate(
            { email: 'student.workflow@campusgent.edu' },
            { name: 'Student Workflow', email: 'student.workflow@campusgent.edu', passwordHash: dummyHash, role: 'STUDENT', status: 'ACTIVE' },
            { upsert: true, new: true }
        );

        const testDept = await Department.findOneAndUpdate(
            { code: 'CSE_WF' },
            { name: 'Computer Science Workflow', code: 'CSE_WF', description: 'Department for workflow hardening suite' },
            { upsert: true, new: true }
        );

        // Ensure student profile
        await StudentProfile.findOneAndUpdate(
            { user: studentUser._id },
            {
                user: studentUser._id,
                department: testDept._id,
                rollNumber: 'WF-2026-001',
                semester: 7,
                cgpa: 8.2,
                placementReadinessScore: 80,
                skills: [{ name: 'React', proficiency: 'ADVANCED' }, { name: 'Node.js', proficiency: 'ADVANCED' }],
                projects: [{ title: 'Campus Portal', description: 'Institutional portal' }],
            },
            { upsert: true, new: true }
        );

        // Tokens
        adminToken = jwt.sign({ id: adminUser._id.toString(), email: adminUser.email, role: 'ADMIN' }, env.JWT_SECRET, { expiresIn: '1h' });
        facultyToken = jwt.sign({ id: facultyUser._id.toString(), email: facultyUser.email, role: 'FACULTY' }, env.JWT_SECRET, { expiresIn: '1h' });
        placementToken = jwt.sign({ id: placementUser._id.toString(), email: placementUser.email, role: 'PLACEMENT_OFFICER' }, env.JWT_SECRET, { expiresIn: '1h' });
        studentToken = jwt.sign({ id: studentUser._id.toString(), email: studentUser.email, role: 'STUDENT' }, env.JWT_SECRET, { expiresIn: '1h' });
    });

    describe('Phase 1 & 6: Production Safety, Malformed IDs, & Error Sanitization', () => {
        it('should handle invalid ObjectId in parameters with 400 Bad Request instead of 500 CastError', async () => {
            const res = await request(app)
                .get('/api/v1/jobs/malformed-id-123')
                .set('Authorization', `Bearer ${studentToken}`);
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error).toBeDefined();
        });

        it('should block unauthenticated access to protected routes', async () => {
            const res = await request(app).get('/api/v1/faculty/calendar');
            expect(res.status).toBe(401);
        });
    });

    describe('Phase 2: Academic Calendar & Announcements Persistence', () => {
        it('should allow Faculty to create an academic calendar event', async () => {
            const res = await request(app)
                .post('/api/v1/faculty/calendar')
                .set('Authorization', `Bearer ${facultyToken}`)
                .send({
                    title: 'Mid-Term Examinations Block A',
                    description: 'Mandatory exams for CS and IT streams',
                    date: new Date(Date.now() + 86400000).toISOString(),
                    type: 'EXAM',
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe('Mid-Term Examinations Block A');
            expect(res.body.data.type).toBe('EXAM');
            createdEventId = res.body.data._id;
        });

        it('should prevent Student from creating calendar events (403 Forbidden)', async () => {
            const res = await request(app)
                .post('/api/v1/faculty/calendar')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({
                    title: 'Unauthorized Student Event',
                    date: new Date().toISOString(),
                    type: 'HOLIDAY',
                });

            expect(res.status).toBe(403);
        });

        it('should allow Student to view scheduled calendar events', async () => {
            const res = await request(app)
                .get('/api/v1/faculty/calendar')
                .set('Authorization', `Bearer ${studentToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.some(e => e._id === createdEventId)).toBe(true);
        });

        it('should allow Faculty to publish an announcement with role scoping', async () => {
            const res = await request(app)
                .post('/api/v1/faculty/announcements')
                .set('Authorization', `Bearer ${facultyToken}`)
                .send({
                    title: 'End-Term Project Submissions',
                    content: 'All capstone deliverables must be submitted via the portal by Friday 5 PM.',
                    priority: 'HIGH',
                    targetRoles: ['STUDENT', 'FACULTY'],
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.priority).toBe('HIGH');
            createdAnnouncementId = res.body.data._id;
        });

        it('should allow Student to read announcements targeted for STUDENT role', async () => {
            const res = await request(app)
                .get('/api/v1/faculty/announcements')
                .set('Authorization', `Bearer ${studentToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.some(a => a._id === createdAnnouncementId)).toBe(true);
        });
    });

    describe('Phase 3: Placement Lifecycle & Offer Decision Workflow', () => {
        beforeAll(async () => {
            // Create a test active job posting
            testJob = await Job.create({
                title: 'Full Stack Cloud Engineer',
                companyName: 'Vertex Dynamics Global',
                description: 'Join our cloud platform team building enterprise distributed systems.',
                location: 'Bengaluru / Hybrid',
                employmentType: 'FULL_TIME',
                salaryMin: 9,
                salaryMax: 14,
                requiredSkills: ['Node.js', 'React', 'MongoDB'],
                experienceRequired: 0,
                eligibilityCriteria: { minCgpa: 7.0, allowedDepartments: [], maxBacklogsAllowed: 0 },
                applicationDeadline: new Date(Date.now() + 30 * 86400000),
                status: 'ACTIVE',
            });

            // Student submits application
            testApplication = await JobApplication.create({
                student: studentUser._id,
                job: testJob._id,
                status: ApplicationStatus.APPLIED,
                appliedAt: new Date(),
                timeline: [{ status: ApplicationStatus.APPLIED, updatedAt: new Date(), updatedBy: studentUser._id, remarks: 'Applied' }],
            });
        });

        it('should enforce state machine: reject invalid transition jump from APPLIED to OFFER_ACCEPTED', async () => {
            const res = await request(app)
                .put(`/api/v1/jobs/application/${testApplication._id}/status`)
                .set('Authorization', `Bearer ${placementToken}`)
                .send({ status: ApplicationStatus.OFFER_ACCEPTED });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.error.message).toContain('Invalid status transition');
        });

        it('should progress through valid stages: APPLIED -> SCREENING -> SHORTLISTED -> SELECTED', async () => {
            // Stage 1: Screening
            let res = await request(app)
                .put(`/api/v1/jobs/application/${testApplication._id}/status`)
                .set('Authorization', `Bearer ${placementToken}`)
                .send({ status: ApplicationStatus.SCREENING, remarks: 'Resume verified' });
            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe(ApplicationStatus.SCREENING);

            // Stage 2: Shortlisted
            res = await request(app)
                .put(`/api/v1/jobs/application/${testApplication._id}/status`)
                .set('Authorization', `Bearer ${placementToken}`)
                .send({ status: ApplicationStatus.SHORTLISTED, remarks: 'Qualified for tech panel' });
            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe(ApplicationStatus.SHORTLISTED);

            // Stage 3: Selected
            res = await request(app)
                .put(`/api/v1/jobs/application/${testApplication._id}/status`)
                .set('Authorization', `Bearer ${placementToken}`)
                .send({ status: ApplicationStatus.SELECTED, remarks: 'Cleared final partner interview' });
            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe(ApplicationStatus.SELECTED);
        });

        it('should allow Placement Officer to issue official offer with CTC details', async () => {
            const res = await request(app)
                .post(`/api/v1/jobs/application/${testApplication._id}/issue-offer`)
                .set('Authorization', `Bearer ${placementToken}`)
                .send({
                    packageLpa: 12.5,
                    designation: 'Software Development Engineer I',
                    joiningLocation: 'Bengaluru Campus',
                    deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
                    notes: 'Standard 6-month probation with stock units',
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.status).toBe(ApplicationStatus.OFFERED);
            expect(res.body.data.offerDetails?.packageLpa).toBe(12.5);
            expect(res.body.data.offerDetails?.designation).toBe('Software Development Engineer I');
        });

        it('should prevent unauthorized users from responding to another candidate offer', async () => {
            const res = await request(app)
                .post(`/api/v1/jobs/application/${testApplication._id}/respond-offer`)
                .set('Authorization', `Bearer ${facultyToken}`)
                .send({ decision: 'ACCEPT' });

            expect(res.status).toBe(403);
        });

        it('should allow the student candidate to officially ACCEPT the extended offer', async () => {
            const res = await request(app)
                .post(`/api/v1/jobs/application/${testApplication._id}/respond-offer`)
                .set('Authorization', `Bearer ${studentToken}`)
                .send({ decision: 'ACCEPT', remarks: 'Delighted to accept this offer' });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.status).toBe(ApplicationStatus.OFFER_ACCEPTED);
            expect(res.body.data.offerDetails?.respondedAt).toBeDefined();
        });
    });

    describe('Phase 4: Authoritative Academic Data Propagation', () => {
        it('should calculate attendance, CGPA, and placement readiness score from source records', async () => {
            const studentProfile = await StudentProfile.findOne({ user: studentUser._id });
            expect(studentProfile).toBeDefined();

            // Setup a course class
            const courseClass = await CourseClass.create({
                courseCode: 'CS401',
                subjectName: 'Distributed Systems Hardening',
                section: 'A',
                faculty: facultyUser._id,
                students: [studentProfile._id],
                academicYear: '2026-2027',
                semester: 7,
            });

            // Add attendance sessions (2 Present, 0 Absent = 100%)
            await AttendanceRecord.create({
                classId: courseClass._id,
                date: new Date(),
                faculty: facultyUser._id,
                sessionTopic: 'Consensus Algorithms',
                records: [{ student: studentProfile._id, status: 'PRESENT' }],
            });

            // Add marks (92/100 -> CGPA 9.2)
            await StudentMark.create({
                assessmentId: new mongoose.Types.ObjectId(),
                student: studentProfile._id,
                marksObtained: 92,
                remarks: 'Final project review',
            });

            // Create active AI insight to verify invalidation
            const testInsight = await AIInsight.create({
                user: studentUser._id,
                type: 'CAREER_ROADMAP',
                insight: { baseline: 'Previous roadmap recommendations' },
                status: 'ACTIVE',
            });

            // Run recalculation engine
            const updatedProfile = await recalculateStudentAcademicMetrics(studentUser._id);

            expect(updatedProfile).toBeDefined();
            expect(updatedProfile.cgpa).toBe(9.2);
            expect(updatedProfile.placementReadinessScore).toBeGreaterThanOrEqual(75);

            // Verify insight was invalidated to STALE
            const refreshedInsight = await AIInsight.findById(testInsight._id);
            expect(refreshedInsight.status).toBe('STALE');
        });
    });

    describe('Phase 5: Persistent AI Memory & User Isolation', () => {
        it('should persist conversation turns to MongoDB and maintain user isolation', async () => {
            // Add turns for student
            memoryManager.addTurn(studentUser._id.toString(), {
                userQuery: 'What are the top system design topics for cloud engineer interviews?',
                agent: 'career_advisor',
                responseSummary: 'Distributed caching, Raft consensus, and rate limiting algorithms.',
                intent: 'interview_prep',
                title: 'System Design Prep',
            });

            // Wait a moment for fire-and-forget DB sync
            await new Promise(r => setTimeout(r, 200));

            // Retrieve persistent history via REST endpoint
            const res = await request(app)
                .get('/api/v1/ai/conversations/current')
                .set('Authorization', `Bearer ${studentToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.turns.length).toBeGreaterThan(0);
            expect(res.body.data.turns.some(t => t.content.includes('Raft consensus'))).toBe(true);

            // Verify user isolation: Faculty cannot see student's conversation
            const facultyCheck = await request(app)
                .get('/api/v1/ai/conversations/current')
                .set('Authorization', `Bearer ${facultyToken}`);

            expect(facultyCheck.status).toBe(200);
            expect(facultyCheck.body.data.turns.some(t => t.content.includes('Raft consensus'))).toBe(false);
        });

        it('should allow user to reset their active AI conversation session', async () => {
            const res = await request(app)
                .delete('/api/v1/ai/conversations')
                .set('Authorization', `Bearer ${studentToken}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);

            // In-memory turns should now be empty
            const afterReset = memoryManager.getHistory(studentUser._id.toString());
            expect(afterReset.length).toBe(0);
        });
    });

    afterAll(async () => {
        // Cleanup test artifacts
        if (createdEventId) await AcademicEvent.findByIdAndDelete(createdEventId);
        if (createdAnnouncementId) await Announcement.findByIdAndDelete(createdAnnouncementId);
        if (testApplication) await JobApplication.findByIdAndDelete(testApplication._id);
        if (testJob) await Job.findByIdAndDelete(testJob._id);
        await ConversationMemory.deleteMany({ user: studentUser._id });
    });
});
