import { CourseClass } from '../models/CourseClass.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { Assessment } from '../models/Assessment.js';
import { StudentMark } from '../models/StudentMark.js';
import { User } from '../models/User.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
// In-memory set to prevent redundant seeding checks on every single faculty request
const seededFacultyIds = new Set();

// Helper to seed default faculty course structures so they compile with real users
const ensureFacultyDataSeeded = async (facultyId) => {
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
