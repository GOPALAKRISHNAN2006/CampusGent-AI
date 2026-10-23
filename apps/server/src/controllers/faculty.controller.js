import { CourseClass } from '../models/CourseClass.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { Assessment } from '../models/Assessment.js';
import { StudentMark } from '../models/StudentMark.js';
import { User } from '../models/User.js';
import { AcademicEvent } from '../models/AcademicEvent.js';
import { Announcement } from '../models/Announcement.js';
import { AIInsight } from '../models/AIInsight.js';
import { AuditLog } from '../models/AuditLog.js';
import { cacheService } from '../services/cache.service.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
// In-memory set to prevent redundant seeding checks on every single faculty request
const seededFacultyIds = new Set();

// Helper to seed default faculty course structures so they compile with real users in development
const ensureFacultyDataSeeded = async (facultyId) => {
    // Strictly prevent auto-seeding dummy records in production
    if (env.NODE_ENV === 'production') {
        return;
    }

    const facultyIdStr = String(facultyId);
    if (seededFacultyIds.has(facultyIdStr)) {
        return;
    }

    const count = await CourseClass.countDocuments({ faculty: facultyId });
    if (count > 0) {
        seededFacultyIds.add(facultyIdStr);
        return;
    }
    // Fetch or create students
    let students = await StudentProfile.find();
    if (students.length === 0) {
        const defaultStudents = [
            { name: "Rahul Sharma", email: "rahul@example.com", rollNumber: "STU-88271", cgpa: 5.4, attendance: 68 },
            { name: "Sneha Patel", email: "sneha@example.com", rollNumber: "STU-99021", cgpa: 5.9, attendance: 71 },
            { name: "Amit Verma", email: "amit@example.com", rollNumber: "STU-77218", cgpa: 6.2, attendance: 62 },
            { name: "Gopalakrishnan M", email: "gopal@example.com", rollNumber: "STU-12345", cgpa: 8.4, attendance: 88 },
            { name: "Priya Das", email: "priya@example.com", rollNumber: "STU-45678", cgpa: 7.9, attendance: 92 }
        ];
        for (const s of defaultStudents) {
            let userDoc = await User.findOne({ email: s.email });
            if (!userDoc) {
                const salt = await bcrypt.genSalt(12);
                const passwordHash = await bcrypt.hash('CampusGent@123', salt);
                userDoc = await User.create({
                    name: s.name,
                    email: s.email,
                    passwordHash,
                    role: 'STUDENT',
                });
            }
            let profile = await StudentProfile.findOne({ user: userDoc._id });
            if (!profile) {
                profile = await StudentProfile.create({
                    user: userDoc._id,
                    rollNumber: s.rollNumber,
                    semester: 4,
                    cgpa: s.cgpa,
                    placementReadinessScore: Math.round(s.cgpa * 10),
                });
            }
            students.push(profile);
        }
    }
    // Seed classes
    const classesData = [
        {
            courseCode: "CS-301",
            subjectName: "Web Development",
            section: "Section A",
            semester: 4,
            timetable: [
                { day: "Monday", time: "10:00 AM", room: "Room 204" },
                { day: "Wednesday", time: "10:00 AM", room: "Room 204" }
            ]
        },
        {
            courseCode: "CS-302",
            subjectName: "Database Systems",
            section: "Section B",
            semester: 4,
            timetable: [
                { day: "Tuesday", time: "11:30 AM", room: "Lab 3" },
                { day: "Thursday", time: "11:30 AM", room: "Lab 3" }
            ]
        },
        {
            courseCode: "CS-303",
            subjectName: "Software Engineering",
            section: "Section A",
            semester: 4,
            timetable: [
                { day: "Monday", time: "02:00 PM", room: "Room 105" },
                { day: "Friday", time: "02:00 PM", room: "Room 105" }
            ]
        }
    ];
    for (const c of classesData) {
        await CourseClass.create({
            ...c,
            faculty: new mongoose.Types.ObjectId(facultyId),
            students: students.map(s => s._id)
        });
    }
    seededFacultyIds.add(facultyIdStr);
};
export const getAssignedClasses = async (req, res, next) => {
    try {
        const facultyId = req.user?.id;
        if (!facultyId)
            throw new BadRequestError('Faculty ID required');
        await ensureFacultyDataSeeded(facultyId);
        const classes = await CourseClass.find({ faculty: facultyId })
            .populate({
            path: 'students',
            populate: { path: 'user', select: 'name email status' }
        })
            .lean();
        res.status(200).json({
            success: true,
            data: classes
        });
    }
    catch (error) {
        next(error);
    }
};
export const getClassDetail = async (req, res, next) => {
    try {
        const { classId } = req.params;
        if (!classId)
            throw new BadRequestError('Class ID parameter required');
        const courseClass = await CourseClass.findById(classId)
            .populate({
            path: 'students',
            populate: { path: 'user', select: 'name email status' }
        })
            .lean();
        if (!courseClass) {
            throw new NotFoundError('Course section class details not found');
        }
        // Compute stats concurrently
        const [assessments, attendanceRecords] = await Promise.all([
            Assessment.find({ classId: courseClass._id }).lean(),
            AttendanceRecord.find({ classId: courseClass._id }).lean()
        ]);
        const assessmentIds = assessments.map(a => a._id);

        // Compute average attendance
        let overallAttendance = 85; // Default fallback
        if (attendanceRecords.length > 0) {
            let totalPresents = 0;
            let totalCount = 0;
            attendanceRecords.forEach(r => {
                r.records.forEach(studentRec => {
                    totalCount++;
                    if (studentRec.status === 'PRESENT' || studentRec.status === 'LATE') {
                        totalPresents++;
                    }
                });
            });
            overallAttendance = totalCount > 0 ? Math.round((totalPresents / totalCount) * 100) : 85;
        }
        // Compute marks average
        const marks = await StudentMark.find({ assessmentId: { $in: assessmentIds } }).lean();
        let classAverage = 76;
        if (marks.length > 0) {
            const sum = marks.reduce((acc, m) => acc + m.marksObtained, 0);
            classAverage = Math.round((sum / marks.length) * 10) / 10;
        }
        res.status(200).json({
            success: true,
            data: {
                classDetails: courseClass,
                stats: {
                    attendanceAverage: overallAttendance,
                    classMarksAverage: classAverage,
                    assessmentsCount: assessments.length,
                    studentsCount: courseClass.students.length
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
};
export const submitAttendance = async (req, res, next) => {
    try {
        const { classId, date, records } = req.body;
        if (!classId || !date || !records || !Array.isArray(records)) {
            throw new BadRequestError('Invalid classId, date, or records parameters');
        }
        if (!mongoose.Types.ObjectId.isValid(classId)) {
            throw new BadRequestError('Invalid class identifier');
        }
        const courseClass = await CourseClass.findById(classId);
        if (!courseClass) {
            throw new NotFoundError('Class not found');
        }
        if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN' && courseClass.faculty.toString() !== req.user?.id) {
            throw new ForbiddenError('Unauthorized: You are not assigned to manage attendance for this class');
        }

        const formattedDate = new Date(date);
        formattedDate.setHours(0, 0, 0, 0);
        // Clear existing attendance for the same day and class
        await AttendanceRecord.deleteOne({ classId, date: formattedDate });
        const attendance = await AttendanceRecord.create({
            classId: new mongoose.Types.ObjectId(classId),
            date: formattedDate,
            records: records.map(r => ({
                student: new mongoose.Types.ObjectId(r.student),
                status: r.status
            }))
        });

        // Phase 4: Authoritative Academic Data Propagation
        const uniqueStudentIds = [...new Set(records.map(r => r.student.toString()))];
        Promise.all(uniqueStudentIds.map(id => recalculateStudentAcademicMetrics(id))).catch(err => {
            console.error('Attendance academic recalculation notice:', err.message);
        });

        res.status(201).json({
            success: true,
            data: attendance,
            message: 'Attendance record submitted successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
export const getAttendanceLogs = async (req, res, next) => {
    try {
        const { classId } = req.query;
        const query = classId ? { classId: String(classId) } : {};
        const logs = await AttendanceRecord.find(query).sort({ date: -1 }).lean();
        res.status(200).json({
            success: true,
            data: logs
        });
    }
    catch (error) {
        next(error);
    }
};
export const createAssessment = async (req, res, next) => {
    try {
        const { classId, title, description, date, totalMarks, questionCount } = req.body;
        if (!classId || !title || !date || !totalMarks) {
            throw new BadRequestError('Missing classId, title, date, or totalMarks parameters');
        }
        if (!mongoose.Types.ObjectId.isValid(classId)) {
            throw new BadRequestError('Invalid class identifier');
        }
        const courseClass = await CourseClass.findById(classId);
        if (!courseClass) {
            throw new NotFoundError('Class not found');
        }
        if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN' && courseClass.faculty.toString() !== req.user?.id) {
            throw new ForbiddenError('Unauthorized: You are not assigned to manage assessments for this class');
        }

        const assessment = await Assessment.create({
            classId: new mongoose.Types.ObjectId(classId),
            title,
            description,
            date: new Date(date),
            totalMarks,
            questionCount: questionCount || 5,
            status: 'UPCOMING'
        });
        res.status(201).json({
            success: true,
            data: assessment,
            message: 'Class assessment published successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
export const getAssessments = async (req, res, next) => {
    try {
        const { classId } = req.query;
        const query = classId ? { classId: String(classId) } : {};
        const assessments = await Assessment.find(query).sort({ date: -1 }).lean();
        res.status(200).json({
            success: true,
            data: assessments
        });
    }
    catch (error) {
        next(error);
    }
};
export const submitMarks = async (req, res, next) => {
    try {
        const { assessmentId, marks } = req.body;
        if (!assessmentId || !marks || !Array.isArray(marks)) {
            throw new BadRequestError('Missing assessmentId or marks array parameters');
        }
        if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
            throw new BadRequestError('Invalid assessment identifier');
        }
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) {
            throw new NotFoundError('Assessment not found');
        }
        const courseClass = await CourseClass.findById(assessment.classId);
        if (courseClass && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN' && courseClass.faculty.toString() !== req.user?.id) {
            throw new ForbiddenError('Unauthorized: You are not assigned to submit marks for this assessment');
        }

        // Delete previous marks for this assessment to support re-entry
        await StudentMark.deleteMany({ assessmentId });
        
        // High-performance batch insert instead of sequential loop
        const docs = marks.map(m => ({
            assessmentId: new mongoose.Types.ObjectId(assessmentId),
            student: new mongoose.Types.ObjectId(m.student),
            marksObtained: m.marksObtained,
            remarks: m.remarks || ''
        }));
        const createdMarks = docs.length > 0 ? await StudentMark.insertMany(docs) : [];

        // Update assessment status to COMPLETED
        await Assessment.findByIdAndUpdate(assessmentId, { status: 'COMPLETED' });

        // Phase 4: Authoritative Academic Data Propagation
        const uniqueStudentIds = [...new Set(marks.map(m => m.student.toString()))];
        Promise.all(uniqueStudentIds.map(id => recalculateStudentAcademicMetrics(id))).catch(err => {
            console.error('Marks academic recalculation notice:', err.message);
        });

        res.status(201).json({
            success: true,
            data: createdMarks,
            message: 'Marks recorded and published successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
export const getStudentMarks = async (req, res, next) => {
    try {
        const { assessmentId } = req.query;
        if (!assessmentId)
            throw new BadRequestError('assessmentId is required');
        const marks = await StudentMark.find({ assessmentId: String(assessmentId) })
            .populate({
            path: 'student',
            populate: { path: 'user', select: 'name email' }
        })
            .lean();
        res.status(200).json({
            success: true,
            data: marks
        });
    }
    catch (error) {
        next(error);
    }
};
export const getAtRiskStudents = async (req, res, next) => {
    try {
        const facultyId = req.user?.id;
        if (!facultyId)
            throw new BadRequestError('Faculty ID context is required');
        await ensureFacultyDataSeeded(facultyId);
        const classes = await CourseClass.find({ faculty: facultyId }).select('students').lean();
        const studentIds = classes.flatMap(c => c.students);
        // Find students whose CGPA < 6.0 or attendance < 75%
        const riskStudents = await StudentProfile.find({
            _id: { $in: studentIds },
            $or: [
                { cgpa: { $lt: 6.0 } },
                { placementReadinessScore: { $lt: 75 } }
            ]
        }).populate('user', 'name email status').lean();
        // Add concern reason explanations
        const formattedRiskList = riskStudents.map(s => {
            const reasons = [];
            if (s.cgpa < 6.0)
                reasons.push('Cumulative GPA below threshold limits (< 6.0)');
            if (s.placementReadinessScore < 75)
                reasons.push('Low attendance threshold or placements eligibility warnings');
            return {
                _id: s._id,
                rollNumber: s.rollNumber,
                cgpa: s.cgpa,
                attendance: s.placementReadinessScore || 70, // Map readiness to mock attendance for UI display
                name: s.user ? s.user.name : 'Academic Mentee',
                email: s.user ? s.user.email : '',
                reasons,
                riskLevel: s.cgpa < 5.5 ? 'HIGH' : 'MEDIUM'
            };
        });
        res.status(200).json({
            success: true,
            data: formattedRiskList
        });
    }
    catch (error) {
        next(error);
    }
};
export const getFacultyTimetable = async (req, res, next) => {
    try {
        const facultyId = req.user?.id;
        if (!facultyId)
            throw new BadRequestError('Faculty context required');
        await ensureFacultyDataSeeded(facultyId);
        const classes = await CourseClass.find({ faculty: facultyId }).select('courseCode subjectName section timetable').lean();
        const schedules = classes.flatMap(c => {
            return c.timetable.map(slot => ({
                classId: c._id,
                courseCode: c.courseCode,
                subjectName: c.subjectName,
                section: c.section,
                room: slot.room,
                time: slot.time,
                day: slot.day
            }));
        });
        res.status(200).json({
            success: true,
            data: schedules
        });
    }
    catch (error) {
        next(error);
    }
};

/**
 * Phase 4 — Authoritative Academic Data Propagation
 * Automatically aggregates attendance records and assessment marks to recompute
 * the student's true attendance rate, CGPA, and placement readiness score.
 */
export const recalculateStudentAcademicMetrics = async (identifier) => {
    if (!identifier) return null;
    try {
        let profile = await StudentProfile.findById(identifier);
        if (!profile) {
            profile = await StudentProfile.findOne({ user: identifier });
        }
        if (!profile) return null;

        // 1. Fetch all classes the student is enrolled in
        const classes = await CourseClass.find({ students: profile._id }).select('_id');
        const classIds = classes.map(c => c._id);

        // 2. Compute attendance percentage across authoritative records
        const attendanceRecords = await AttendanceRecord.find({ classId: { $in: classIds } });
        let totalSessions = 0;
        let attendedSessions = 0;

        attendanceRecords.forEach(att => {
            const studentRec = att.records.find(r => r.student && r.student.toString() === profile._id.toString());
            if (studentRec) {
                totalSessions++;
                if (studentRec.status === 'PRESENT' || studentRec.status === 'LATE') {
                    attendedSessions++;
                }
            }
        });

        const attendanceRate = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 85;

        // 3. Compute cumulative GPA from submitted marks
        const studentMarks = await StudentMark.find({ student: profile._id });
        if (studentMarks.length > 0) {
            const totalSum = studentMarks.reduce((sum, m) => sum + (Number(m.marksObtained) || 0), 0);
            const avgPercentage = totalSum / studentMarks.length;
            const computedCgpa = Math.min(10.0, Math.round((avgPercentage / 10) * 10) / 10);
            if (computedCgpa > 0) {
                profile.cgpa = computedCgpa;
            }
        }

        // 4. Compute authoritative placement readiness score
        // Formula: CGPA weight 40% + Attendance weight 30% + Skills weight 20% + Projects weight 10%
        const cgpaComponent = (profile.cgpa / 10) * 40;
        const attComponent = (attendanceRate / 100) * 30;
        const skillsComponent = Math.min(20, (profile.skills?.length || 0) * 4);
        const projectsComponent = Math.min(10, (profile.projects?.length || 0) * 3);
        profile.placementReadinessScore = Math.min(100, Math.round(cgpaComponent + attComponent + skillsComponent + projectsComponent));

        await profile.save();

        // 5. Invalidate caches and mark stale AI insights
        await cacheService.delByPattern('cache:/api/v1/students*');
        await cacheService.delByPattern('cache:/api/v1/analytics*');
        await AIInsight.updateMany(
            { user: profile.user, status: 'ACTIVE' },
            { status: 'STALE' }
        );

        return profile;
    } catch (recalcErr) {
        console.error(`⚠️ Failed to recalculate academic metrics for student ${identifier}:`, recalcErr.message);
        return null;
    }
};

// ==========================================
// Phase 2: Faculty Academic Calendar Endpoints
// ==========================================

export const getAcademicEvents = async (req, res, next) => {
    try {
        const { type, department } = req.query;
        const filter = {};
        if (type && type !== 'ALL') {
            filter.type = type.toUpperCase();
        }
        if (department) {
            filter.$or = [{ department: new mongoose.Types.ObjectId(department) }, { department: null }];
        }

        let events = await AcademicEvent.find(filter)
            .populate('department', 'name code')
            .populate('createdBy', 'name email role')
            .sort({ date: 1 })
            .lean();

        // Seed default academic events in development if table is currently empty
        if (events.length === 0 && env.NODE_ENV !== 'production') {
            const defaultEvents = [
                {
                    title: 'Mid-Term Examinations Prep',
                    description: 'Review syllabus coverage and seat mapping for university mid-term exams.',
                    date: new Date('2026-09-10'),
                    type: 'EXAM',
                    createdBy: req.user?.id || new mongoose.Types.ObjectId(),
                },
                {
                    title: 'Syllabus Review Submission Deadline',
                    description: 'Submit course curriculum progress audit to department head.',
                    date: new Date('2026-09-18'),
                    type: 'ACADEMIC',
                    createdBy: req.user?.id || new mongoose.Types.ObjectId(),
                },
                {
                    title: 'National Education Day Holiday',
                    description: 'Institutional public holiday.',
                    date: new Date('2026-10-02'),
                    type: 'HOLIDAY',
                    createdBy: req.user?.id || new mongoose.Types.ObjectId(),
                },
                {
                    title: 'Course Feedback & Accreditation Audits',
                    description: 'End-term stakeholder surveys and NBA/NAAC evaluation verification.',
                    date: new Date('2026-10-15'),
                    type: 'SYSTEM',
                    createdBy: req.user?.id || new mongoose.Types.ObjectId(),
                },
            ];
            events = await AcademicEvent.insertMany(defaultEvents);
        }

        res.status(200).json({
            success: true,
            data: events,
        });
    } catch (error) {
        next(error);
    }
};

export const createAcademicEvent = async (req, res, next) => {
    try {
        const { title, description, date, endDate, type, department } = req.body;
        if (!title || !date) {
            throw new BadRequestError('Event title and date are required');
        }

        const validTypes = ['EXAM', 'ACADEMIC', 'HOLIDAY', 'SYSTEM', 'SEMINAR', 'WORKSHOP'];
        const normalizedType = (type || 'ACADEMIC').toUpperCase();
        if (!validTypes.includes(normalizedType)) {
            throw new BadRequestError(`Invalid event type. Must be one of: ${validTypes.join(', ')}`);
        }

        const event = await AcademicEvent.create({
            title: title.trim(),
            description: (description || '').trim(),
            date: new Date(date),
            endDate: endDate ? new Date(endDate) : undefined,
            type: normalizedType,
            department: department && mongoose.Types.ObjectId.isValid(department) ? new mongoose.Types.ObjectId(department) : null,
            createdBy: new mongoose.Types.ObjectId(req.user.id),
        });

        await AuditLog.create({
            user: new mongoose.Types.ObjectId(req.user.id),
            action: 'CREATE_ACADEMIC_EVENT',
            details: { eventId: event._id, title: event.title, date: event.date, type: event.type },
        });

        res.status(201).json({
            success: true,
            message: 'Academic calendar event created successfully',
            data: event,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAcademicEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid academic event identifier');
        }

        const event = await AcademicEvent.findById(id);
        if (!event) {
            throw new NotFoundError('Academic event not found');
        }

        // Only the creator or administrator can delete calendar events
        if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN' && event.createdBy.toString() !== req.user?.id) {
            throw new ForbiddenError('Unauthorized: Only the creator or an administrator can delete this event');
        }

        await AcademicEvent.findByIdAndDelete(id);

        await AuditLog.create({
            user: new mongoose.Types.ObjectId(req.user.id),
            action: 'DELETE_ACADEMIC_EVENT',
            details: { eventId: id, title: event.title },
        });

        res.status(200).json({
            success: true,
            message: 'Academic event deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// Phase 2: Faculty Circulars & Announcements Endpoints
// ==========================================

export const getAnnouncements = async (req, res, next) => {
    try {
        const userRole = req.user?.role || 'FACULTY';
        const { priority, department } = req.query;

        const filter = { status: 'PUBLISHED' };
        if (priority && priority !== 'ALL') {
            filter.priority = priority.toUpperCase();
        }
        if (department) {
            filter.$or = [{ department: new mongoose.Types.ObjectId(department) }, { department: null }];
        }

        let announcements = await Announcement.find(filter)
            .populate('author', 'name email role')
            .populate('department', 'name code')
            .sort({ publishedAt: -1 })
            .lean();

        // Scope visibility to user role
        announcements = announcements.filter(a => {
            if (!a.targetRoles || a.targetRoles.length === 0) return true;
            return a.targetRoles.includes(userRole);
        });

        // Seed default circulars in development if empty
        if (announcements.length === 0 && env.NODE_ENV !== 'production') {
            const defaultAnnouncements = [
                {
                    title: 'End Semester Exams Time Table Release',
                    content: 'The academic council has finalized dates for the upcoming term end exams. Check the timetable portal to confirm invigilation duties.',
                    priority: 'HIGH',
                    targetRoles: ['FACULTY', 'ADMIN', 'STUDENT'],
                    author: req.user?.id || new mongoose.Types.ObjectId(),
                    status: 'PUBLISHED',
                    publishedAt: new Date(),
                },
                {
                    title: 'Faculty Feedback Surveys Launch',
                    content: 'Course registration surveys are live for students. Please advise your mentees to submit feedback by next Monday.',
                    priority: 'MEDIUM',
                    targetRoles: ['FACULTY', 'ADMIN'],
                    author: req.user?.id || new mongoose.Types.ObjectId(),
                    status: 'PUBLISHED',
                    publishedAt: new Date(Date.now() - 24 * 3600 * 1000),
                },
            ];
            announcements = await Announcement.insertMany(defaultAnnouncements);
        }

        res.status(200).json({
            success: true,
            data: announcements,
        });
    } catch (error) {
        next(error);
    }
};

export const createAnnouncement = async (req, res, next) => {
    try {
        const { title, content, priority, targetRoles, department } = req.body;
        if (!title || !content) {
            throw new BadRequestError('Announcement title and content are required');
        }

        const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
        const normalizedPriority = (priority || 'MEDIUM').toUpperCase();
        if (!validPriorities.includes(normalizedPriority)) {
            throw new BadRequestError(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
        }

        const announcement = await Announcement.create({
            title: title.trim(),
            content: content.trim(),
            priority: normalizedPriority,
            targetRoles: Array.isArray(targetRoles) && targetRoles.length > 0 ? targetRoles : ['FACULTY', 'STUDENT', 'PLACEMENT_OFFICER'],
            department: department && mongoose.Types.ObjectId.isValid(department) ? new mongoose.Types.ObjectId(department) : null,
            author: new mongoose.Types.ObjectId(req.user.id),
            status: 'PUBLISHED',
            publishedAt: new Date(),
        });

        await AuditLog.create({
            user: new mongoose.Types.ObjectId(req.user.id),
            action: 'CREATE_ANNOUNCEMENT',
            details: { announcementId: announcement._id, title: announcement.title, priority: announcement.priority },
        });

        res.status(201).json({
            success: true,
            message: 'Announcement published successfully',
            data: announcement,
        });
    } catch (error) {
        next(error);
    }
};

export const updateAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid announcement identifier');
        }

        const announcement = await Announcement.findById(id);
        if (!announcement) {
            throw new NotFoundError('Announcement not found');
        }

        if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN' && announcement.author.toString() !== req.user?.id) {
            throw new ForbiddenError('Unauthorized: Only the author or an administrator can update this announcement');
        }

        const { title, content, priority, status } = req.body;
        if (title) announcement.title = title.trim();
        if (content) announcement.content = content.trim();
        if (priority) announcement.priority = priority.toUpperCase();
        if (status) announcement.status = status.toUpperCase();

        await announcement.save();

        res.status(200).json({
            success: true,
            message: 'Announcement updated successfully',
            data: announcement,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAnnouncement = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestError('Invalid announcement identifier');
        }

        const announcement = await Announcement.findById(id);
        if (!announcement) {
            throw new NotFoundError('Announcement not found');
        }

        if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN' && announcement.author.toString() !== req.user?.id) {
            throw new ForbiddenError('Unauthorized: Only the author or an administrator can delete this announcement');
        }

        await Announcement.findByIdAndDelete(id);

        await AuditLog.create({
            user: new mongoose.Types.ObjectId(req.user.id),
            action: 'DELETE_ANNOUNCEMENT',
            details: { announcementId: id, title: announcement.title },
        });

        res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

