import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { env } from './config/env.js';
import { User } from './models/User.js';
import { Department } from './models/Department.js';
import { StudentProfile } from './models/StudentProfile.js';
import { FacultyProfile } from './models/FacultyProfile.js';
import { Job } from './models/Job.js';
import { JobApplication } from './models/JobApplication.js';
import { Interview } from './models/Interview.js';
import { CourseClass } from './models/CourseClass.js';
import { Assessment } from './models/Assessment.js';
import { AttendanceRecord } from './models/AttendanceRecord.js';
import { StudentMark } from './models/StudentMark.js';
import { Notification } from './models/Notification.js';
import { UserRole, UserStatus, JobStatus, EmploymentType, ApplicationStatus } from '@campusgent/shared';

const DEFAULT_PASSWORD = 'Password@123';

export const seedDatabase = async () => {
    try {
        console.log('🌱 Connecting to database for seeding...');
        await mongoose.connect(env.MONGODB_URI);
        console.log('✅ Connected to MongoDB.');

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, salt);

        // 1. Seed Departments
        console.log('📦 Seeding Departments...');
        const deptData = [
            { name: 'Computer Science & Engineering', code: 'CSE', description: 'Department of Computer Science & Engineering' },
            { name: 'Information Technology', code: 'IT', description: 'Department of Information Technology' },
            { name: 'Electronics & Communication', code: 'ECE', description: 'Department of Electronics & Communication' },
            { name: 'Mechanical Engineering', code: 'MECH', description: 'Department of Mechanical Engineering' },
        ];

        const departments = {};
        for (const d of deptData) {
            let dept = await Department.findOne({ code: d.code });
            if (!dept) {
                dept = await Department.create(d);
            }
            departments[d.code] = dept;
        }

        // 2. Seed Users & Profiles
        console.log('👤 Seeding Core Role Users...');
        
        // Admin
        let adminUser = await User.findOne({ email: 'admin@campusgent.edu' });
        if (!adminUser) {
            adminUser = await User.create({
                name: 'System Administrator',
                email: 'admin@campusgent.edu',
                passwordHash,
                role: UserRole.ADMIN,
                status: UserStatus.ACTIVE,
                department: departments['CSE']._id,
            });
        } else {
            adminUser.passwordHash = passwordHash;
            await adminUser.save();
        }

        // Faculty / Staff
        let facultyUser = await User.findOne({ email: 'faculty@campusgent.edu' });
        if (!facultyUser) {
            facultyUser = await User.create({
                name: 'Dr. Sarah Jenkins',
                email: 'faculty@campusgent.edu',
                passwordHash,
                role: UserRole.FACULTY,
                status: UserStatus.ACTIVE,
                department: departments['CSE']._id,
            });
        } else {
            facultyUser.passwordHash = passwordHash;
            await facultyUser.save();
        }

        let facultyProfile = await FacultyProfile.findOne({ user: facultyUser._id });
        if (!facultyProfile) {
            facultyProfile = await FacultyProfile.create({
                user: facultyUser._id,
                employeeId: 'FAC-10024',
                department: departments['CSE']._id,
                assignedSubjects: ['Web Development', 'Database Systems', 'Cloud Computing'],
            });
        }

        // Placement Officer
        let poUser = await User.findOne({ email: 'placement@campusgent.edu' });
        if (!poUser) {
            poUser = await User.create({
                name: 'Prof. Rajesh Flint',
                email: 'placement@campusgent.edu',
                passwordHash,
                role: UserRole.PLACEMENT_OFFICER,
                status: UserStatus.ACTIVE,
                department: departments['CSE']._id,
            });
        } else {
            poUser.passwordHash = passwordHash;
            await poUser.save();
        }

        // Also update existing placement officer accounts password
        const existingPOs = await User.find({ role: UserRole.PLACEMENT_OFFICER });
        for (const p of existingPOs) {
            p.passwordHash = passwordHash;
            await p.save();
        }

        // Students Data
        const sampleStudents = [
            {
                name: 'Gokul Murugan',
                email: 'student@campusgent.edu',
                rollNumber: 'STU-202401',
                cgpa: 8.9,
                semester: 6,
                dept: 'CSE',
                readiness: 88,
                skills: [
                    { name: 'React', proficiency: 'EXPERT', verified: true },
                    { name: 'Node.js', proficiency: 'ADVANCED', verified: true },
                    { name: 'TypeScript', proficiency: 'ADVANCED', verified: true },
                    { name: 'MongoDB', proficiency: 'INTERMEDIATE', verified: true },
                    { name: 'AWS', proficiency: 'INTERMEDIATE', verified: true },
                ],
                projects: [
                    { title: 'Campus Placement Portal', description: 'Real-time placement intelligence system', technologies: ['React', 'Node.js', 'MongoDB'] }
                ],
                resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
            },
            {
                name: 'Ananya Sharma',
                email: 'ananya@campusgent.edu',
                rollNumber: 'STU-202402',
                cgpa: 9.2,
                semester: 6,
                dept: 'CSE',
                readiness: 94,
                skills: [
                    { name: 'Python', proficiency: 'EXPERT', verified: true },
                    { name: 'Machine Learning', proficiency: 'ADVANCED', verified: true },
                    { name: 'FastAPI', proficiency: 'ADVANCED', verified: true },
                    { name: 'Docker', proficiency: 'INTERMEDIATE', verified: true }
                ],
                projects: [
                    { title: 'AI Resume Screener', description: 'Transformer-based candidate evaluator', technologies: ['Python', 'PyTorch'] }
                ],
                resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
            },
            {
                name: 'Rohan Verma',
                email: 'rohan@campusgent.edu',
                rollNumber: 'STU-202403',
                cgpa: 7.4,
                semester: 6,
                dept: 'IT',
                readiness: 65,
                skills: [
                    { name: 'Java', proficiency: 'INTERMEDIATE', verified: true },
                    { name: 'Spring Boot', proficiency: 'INTERMEDIATE', verified: true },
                    { name: 'SQL', proficiency: 'ADVANCED', verified: true }
                ],
                projects: [
                    { title: 'E-Commerce Backend', description: 'Microservices architecture with Spring', technologies: ['Java', 'PostgreSQL'] }
                ],
                resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
            },
            {
                name: 'Kunal Sen',
                email: 'kunal@campusgent.edu',
                rollNumber: 'STU-202404',
                cgpa: 5.6,
                semester: 6,
                dept: 'ECE',
                readiness: 48,
                skills: [
                    { name: 'C++', proficiency: 'BEGINNER', verified: false },
                    { name: 'Embedded Systems', proficiency: 'INTERMEDIATE', verified: true }
                ],
                projects: [
                    { title: 'IoT Weather Monitor', description: 'Arduino sensor array with dashboard', technologies: ['C++', 'MQTT'] }
                ],
                resumeUrl: ''
            }
        ];

        const studentDocs = [];
        const studentProfiles = [];

        for (const s of sampleStudents) {
            let u = await User.findOne({ email: s.email });
            if (!u) {
                u = await User.create({
                    name: s.name,
                    email: s.email,
                    passwordHash,
                    role: UserRole.STUDENT,
                    status: UserStatus.ACTIVE,
                    department: departments[s.dept]._id,
                });
            } else {
                u.passwordHash = passwordHash;
                await u.save();
            }
            studentDocs.push(u);

            let sp = await StudentProfile.findOne({ user: u._id });
            if (!sp) {
                sp = await StudentProfile.create({
                    user: u._id,
                    rollNumber: s.rollNumber,
                    department: departments[s.dept]._id,
                    semester: s.semester,
                    cgpa: s.cgpa,
                    skills: s.skills,
                    projects: s.projects,
                    resumeUrl: s.resumeUrl,
                    placementReadinessScore: s.readiness,
                });
            } else {
                sp.cgpa = s.cgpa;
                sp.placementReadinessScore = s.readiness;
                sp.skills = s.skills;
                sp.projects = s.projects;
                sp.resumeUrl = s.resumeUrl;
                await sp.save();
            }
            studentProfiles.push(sp);
        }

        // Also update student@education.com if exists
        const stuEdu = await User.findOne({ email: 'student@education.com' });
        if (stuEdu) {
            stuEdu.passwordHash = passwordHash;
            await stuEdu.save();
            let stuProf = await StudentProfile.findOne({ user: stuEdu._id });
            if (!stuProf) {
                await StudentProfile.create({
                    user: stuEdu._id,
                    rollNumber: 'STU-100099',
                    department: departments['CSE']._id,
                    semester: 6,
                    cgpa: 8.5,
                    placementReadinessScore: 82,
                    skills: [{ name: 'React', proficiency: 'EXPERT', verified: true }],
                });
            }
        }

        // 3. Seed Placement Drives / Jobs
        console.log('💼 Seeding Placement Drives & Vacancies...');
        const jobsData = [
            {
                title: 'Associate Cloud Engineer',
                companyName: 'Google Cloud India',
                description: 'Build and optimize enterprise cloud infrastructure, Kubernetes clusters, and serverless compute pipelines.',
                location: 'Bangalore / Hybrid',
                employmentType: EmploymentType.FULL_TIME,
                salaryMin: 1400000,
                salaryMax: 1850000,
                requiredSkills: ['Cloud Computing', 'Docker', 'Kubernetes', 'Python', 'Linux'],
                experienceRequired: 0,
                eligibilityCriteria: {
                    minCgpa: 7.5,
                    allowedDepartments: [departments['CSE']._id, departments['IT']._id, departments['ECE']._id],
                    maxBacklogsAllowed: 0,
                },
                applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                status: JobStatus.ACTIVE,
            },
            {
                title: 'Software Development Engineer (SDE-1)',
                companyName: 'Amazon Web Services',
                description: 'Design distributed high-throughput microservices, scalable storage engines, and developer tooling APIs.',
                location: 'Hyderabad / On-site',
                employmentType: EmploymentType.FULL_TIME,
                salaryMin: 1200000,
                salaryMax: 1600000,
                requiredSkills: ['Data Structures', 'Java', 'Algorithms', 'AWS', 'System Design'],
                experienceRequired: 0,
                eligibilityCriteria: {
                    minCgpa: 7.0,
                    allowedDepartments: [departments['CSE']._id, departments['IT']._id],
                    maxBacklogsAllowed: 0,
                },
                applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                status: JobStatus.ACTIVE,
            },
            {
                title: 'Core Platform Software Engineer',
                companyName: 'Microsoft India',
                description: 'Build hyper-scale enterprise software products with world-class security, observability, and resilience.',
                location: 'Bangalore / Hybrid',
                employmentType: EmploymentType.FULL_TIME,
                salaryMin: 1800000,
                salaryMax: 2200000,
                requiredSkills: ['C++', 'C#', 'Algorithms', 'Distributed Systems', 'Azure'],
                experienceRequired: 0,
                eligibilityCriteria: {
                    minCgpa: 8.0,
                    allowedDepartments: [departments['CSE']._id, departments['IT']._id],
                    maxBacklogsAllowed: 0,
                },
                applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                status: JobStatus.ACTIVE,
            },
            {
                title: 'Graduate Research Engineer',
                companyName: 'TCS Innovation Labs',
                description: 'Explore applied AI, blockchain infrastructure, and high performance cognitive computation engines.',
                location: 'Chennai / On-site',
                employmentType: EmploymentType.FULL_TIME,
                salaryMin: 650000,
                salaryMax: 750000,
                requiredSkills: ['Python', 'SQL', 'Problem Solving', 'Data Analytics'],
                experienceRequired: 0,
                eligibilityCriteria: {
                    minCgpa: 6.0,
                    allowedDepartments: [departments['CSE']._id, departments['IT']._id, departments['ECE']._id, departments['MECH']._id],
                    maxBacklogsAllowed: 1,
                },
                applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                status: JobStatus.ACTIVE,
            },
            {
                title: 'Technology & Cloud Consultant',
                companyName: 'Deloitte Digital',
                description: 'Consult on digital modernization, cloud transformation, enterprise software integrations, and security governance.',
                location: 'Mumbai / Hybrid',
                employmentType: EmploymentType.FULL_TIME,
                salaryMin: 800000,
                salaryMax: 920000,
                requiredSkills: ['Communication', 'Consulting', 'Cloud Concepts', 'Python', 'Agile'],
                experienceRequired: 0,
                eligibilityCriteria: {
                    minCgpa: 6.5,
                    allowedDepartments: [departments['CSE']._id, departments['IT']._id, departments['ECE']._id],
                    maxBacklogsAllowed: 0,
                },
                applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
                status: JobStatus.ACTIVE,
            }
        ];

        const jobDocs = [];
        for (const jd of jobsData) {
            let j = await Job.findOne({ title: jd.title, companyName: jd.companyName });
            if (!j) {
                j = await Job.create(jd);
            }
            jobDocs.push(j);
        }

        // 4. Seed Applications
        console.log('📝 Seeding Job Applications...');
        const appSeeds = [
            { studentIdx: 0, jobIdx: 0, status: ApplicationStatus.SELECTED, note: 'Passed all rounds with high technical score' },
            { studentIdx: 0, jobIdx: 1, status: ApplicationStatus.INTERVIEW, note: 'Technical Round 2 scheduled' },
            { studentIdx: 1, jobIdx: 2, status: ApplicationStatus.SELECTED, note: 'Offered 22 LPA role at Microsoft' },
            { studentIdx: 1, jobIdx: 0, status: ApplicationStatus.SHORTLISTED, note: 'Shortlisted for interview round' },
            { studentIdx: 2, jobIdx: 3, status: ApplicationStatus.INTERVIEW, note: 'Technical evaluation in progress' },
            { studentIdx: 2, jobIdx: 4, status: ApplicationStatus.APPLIED, note: 'Application under review' },
            { studentIdx: 3, jobIdx: 3, status: ApplicationStatus.APPLIED, note: 'Application submitted' },
        ];

        const appDocs = [];
        for (const as of appSeeds) {
            const studentUser = studentDocs[as.studentIdx];
            const targetJob = jobDocs[as.jobIdx];
            let app = await JobApplication.findOne({ student: studentUser._id, job: targetJob._id });
            if (!app) {
                app = await JobApplication.create({
                    student: studentUser._id,
                    job: targetJob._id,
                    status: as.status,
                    notes: as.note,
                    resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    timeline: [
                        {
                            status: ApplicationStatus.APPLIED,
                            updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                            updatedBy: studentUser._id,
                            remarks: 'Application submitted successfully',
                        },
                        {
                            status: as.status,
                            updatedAt: new Date(),
                            updatedBy: poUser._id,
                            remarks: as.note,
                        }
                    ]
                });
            } else {
                app.status = as.status;
                await app.save();
            }
            appDocs.push(app);
        }

        // 5. Seed Interviews
        console.log('🗓️ Seeding Scheduled Interviews...');
        const interviewSeeds = [
            {
                appIdx: 1,
                studentIdx: 0,
                jobIdx: 1,
                date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                type: 'TECHNICAL',
                status: 'SCHEDULED',
                meetingUrl: 'https://meet.google.com/xyz-abcd-efg',
            },
            {
                appIdx: 4,
                studentIdx: 2,
                jobIdx: 3,
                date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                type: 'TECHNICAL',
                status: 'SCHEDULED',
                meetingUrl: 'https://meet.google.com/abc-tcs-interview',
            },
            {
                appIdx: 0,
                studentIdx: 0,
                jobIdx: 0,
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                type: 'TECHNICAL',
                status: 'COMPLETED',
                score: 92,
                feedback: 'Exceptional depth in cloud container orchestration and system architecture.',
                meetingUrl: 'https://meet.google.com/google-cloud-round',
            }
        ];

        for (const is of interviewSeeds) {
            const app = appDocs[is.appIdx];
            const student = studentDocs[is.studentIdx];
            const job = jobDocs[is.jobIdx];
            let intDoc = await Interview.findOne({ application: app._id, date: is.date });
            if (!intDoc) {
                await Interview.create({
                    application: app._id,
                    student: student._id,
                    job: job._id,
                    date: is.date,
                    type: is.type,
                    status: is.status,
                    score: is.score,
                    feedback: is.feedback,
                    meetingUrl: is.meetingUrl,
                });
            }
        }

        // 6. Seed Faculty Courses & Assessments
        console.log('📚 Seeding Faculty Classes, Assessments & Attendance...');
        const facultyClassesData = [
            {
                courseCode: 'CS-301',
                subjectName: 'Web & Distributed Systems',
                section: 'Section A',
                semester: 6,
                faculty: facultyUser._id,
                students: studentProfiles.map(p => p._id),
                timetable: [
                    { day: 'Monday', time: '10:00 AM - 11:30 AM', room: 'Hall 301' },
                    { day: 'Wednesday', time: '10:00 AM - 11:30 AM', room: 'Hall 301' },
                ]
            },
            {
                courseCode: 'CS-302',
                subjectName: 'Advanced Database Systems',
                section: 'Section B',
                semester: 6,
                faculty: facultyUser._id,
                students: studentProfiles.map(p => p._id),
                timetable: [
                    { day: 'Tuesday', time: '02:00 PM - 03:30 PM', room: 'Lab 4' },
                    { day: 'Thursday', time: '02:00 PM - 03:30 PM', room: 'Lab 4' },
                ]
            }
        ];

        const createdClasses = [];
        for (const fc of facultyClassesData) {
            let cls = await CourseClass.findOne({ courseCode: fc.courseCode, section: fc.section, faculty: facultyUser._id });
            if (!cls) {
                cls = await CourseClass.create(fc);
            } else {
                cls.students = studentProfiles.map(p => p._id);
                await cls.save();
            }
            createdClasses.push(cls);
        }

        // Seed Assessments for first class
        if (createdClasses.length > 0) {
            const class1 = createdClasses[0];
            let assess1 = await Assessment.findOne({ classId: class1._id, title: 'Mid-Term Practical Evaluation' });
            if (!assess1) {
                assess1 = await Assessment.create({
                    classId: class1._id,
                    title: 'Mid-Term Practical Evaluation',
                    description: 'Hands-on React & API integration assessment',
                    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                    totalMarks: 50,
                    questionCount: 4,
                    status: 'COMPLETED',
                });

                // Seed marks for this assessment
                for (let idx = 0; idx < studentProfiles.length; idx++) {
                    const sp = studentProfiles[idx];
                    const marksVal = idx === 0 ? 46 : idx === 1 ? 48 : idx === 2 ? 38 : 28;
                    await StudentMark.create({
                        assessmentId: assess1._id,
                        student: sp._id,
                        marksObtained: marksVal,
                        remarks: marksVal > 40 ? 'Excellent implementation' : 'Needs practice on async state'
                    });
                }
            }

            let assess2 = await Assessment.findOne({ classId: class1._id, title: 'Component Architecture Quiz' });
            if (!assess2) {
                await Assessment.create({
                    classId: class1._id,
                    title: 'Component Architecture Quiz',
                    description: 'State management and custom hooks theory',
                    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    totalMarks: 25,
                    questionCount: 5,
                    status: 'UPCOMING',
                });
            }

            // Seed Attendance records
            const att1 = await AttendanceRecord.findOne({ classId: class1._id });
            if (!att1) {
                const dates = [
                    new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                ];
                for (const d of dates) {
                    d.setHours(0, 0, 0, 0);
                    await AttendanceRecord.create({
                        classId: class1._id,
                        date: d,
                        records: studentProfiles.map((sp, idx) => ({
                            student: sp._id,
                            status: idx === 3 ? 'ABSENT' : idx === 2 ? 'LATE' : 'PRESENT'
                        }))
                    });
                }
            }
        }

        // 7. Seed Notifications
        console.log('🔔 Seeding System Notifications...');
        const notifs = [
            {
                recipient: poUser._id,
                type: 'placement',
                title: 'New Recruiter Drive Scheduled',
                message: 'Google Cloud India Associate Cloud Engineer drive registration has been activated with 94 eligible candidates.',
                read: false,
            },
            {
                recipient: poUser._id,
                type: 'placement',
                title: 'Interview Schedule Reminder',
                message: 'AWS SDE-1 Technical Round interviews are slated to begin in 48 hours.',
                read: false,
            },
            {
                recipient: facultyUser._id,
                type: 'academic',
                title: 'Mid-term Assessment Marks Due',
                message: 'Please review and publish final consolidated assessment scores for CS-301 Section A.',
                read: false,
            },
            {
                recipient: studentDocs[0]._id,
                type: 'placement',
                title: 'Offer Letter Released!',
                message: 'Congratulations! Google Cloud India has extended an official placement offer of 18.5 LPA.',
                read: false,
            }
        ];

        for (const n of notifs) {
            await Notification.create(n);
        }

        console.log('\n======================================================');
        console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
        console.log('======================================================');
        console.log('Default Accounts & Credentials (Password for all: Password@123):');
        console.log('------------------------------------------------------');
        console.log('1. Admin:             admin@campusgent.edu');
        console.log('2. Faculty / Staff:   faculty@campusgent.edu');
        console.log('3. Placement Officer: placement@campusgent.edu');
        console.log('   (Also: flint@gmail.com / Password@123)');
        console.log('4. Student:           student@campusgent.edu');
        console.log('   (Also: student@education.com / Password@123)');
        console.log('======================================================\n');
        
        return true;
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        throw error;
    }
};

// If run directly via node src/seed.js
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
