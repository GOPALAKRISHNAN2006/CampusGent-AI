import { StudentProfileUpdateSchema } from '@campusgent/shared';
import { StudentProfile } from '../models/StudentProfile.js';
import { User } from '../models/User.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { AuditLog } from '../models/AuditLog.js';
import { AIInsight } from '../models/AIInsight.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { UserRole } from '@campusgent/shared';
import { ConflictError } from '../utils/errors.js';
export const getProfile = async (req, res, next) => {
    try {
        const userId = req.query.userId ? String(req.query.userId) : req.user?.id;
        if (!userId) {
            throw new NotFoundError('User ID not provided');
        }
        // Role verification: Students can only read their own profiles
        if (req.user?.role === 'STUDENT' && req.user.id !== userId) {
            throw new ForbiddenError('You are not authorized to view this profile');
        }
        const profile = await StudentProfile.findOne({ user: userId })
            .populate('user', 'name email role status lastLoginAt')
            .populate('department', 'name code');
        if (!profile) {
            throw new NotFoundError('Student profile not found');
        }
        res.status(200).json({
            success: true,
            data: profile,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new NotFoundError('User ID context not found');
        }
        const validatedData = StudentProfileUpdateSchema.parse(req.body);
        const profile = await StudentProfile.findOne({ user: userId });
        if (!profile) {
            throw new NotFoundError('Student profile not found');
        }
        // Update fields
        if (validatedData.rollNumber)
            profile.rollNumber = validatedData.rollNumber;
        if (validatedData.semester)
            profile.semester = validatedData.semester;
        if (validatedData.cgpa !== undefined)
            profile.cgpa = validatedData.cgpa;
        if (validatedData.skills)
            profile.skills = validatedData.skills;
        if (validatedData.projects)
            profile.projects = validatedData.projects;
        if (validatedData.certifications)
            profile.certifications = validatedData.certifications;
        if (validatedData.githubProfile !== undefined)
            profile.githubProfile = validatedData.githubProfile;
        if (validatedData.linkedinProfile !== undefined)
            profile.linkedinProfile = validatedData.linkedinProfile;
        if (validatedData.portfolioUrl !== undefined)
            profile.portfolioUrl = validatedData.portfolioUrl;
        if (validatedData.careerInterests)
            profile.careerInterests = validatedData.careerInterests;
        if (validatedData.careerGoals)
            profile.careerGoals = validatedData.careerGoals;
        await profile.save();
        // Make existing learning path recommendations stale if career inputs changed
        if (validatedData.skills || validatedData.careerGoals || validatedData.careerInterests) {
            await AIInsight.updateMany({ user: userId, $or: [{ type: 'LEARNING_PATH' }, { agent: 'learning_path' }] }, { status: 'STALE' });
        }
        // Security Audit Log
        await AuditLog.create({
            user: userId,
            action: 'UPDATE_PROFILE',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        res.status(200).json({
            success: true,
            data: profile,
        });
    }
    catch (error) {
        next(error);
    }
};
export const createStudent = async (req, res, next) => {
    try {
        const { name, email, department } = req.body;
        if (!name || !email) {
            res.status(400).json({ success: false, message: 'Name and email are required' });
            return;
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ConflictError('Email address already registered', 'EMAIL_ALREADY_EXISTS');
        }
        const salt = await bcrypt.genSalt(12);
        // Use the default password discussed in the plan
        const passwordHash = await bcrypt.hash('CampusGent@123', salt);
        const user = await User.create({
            name,
            email,
            passwordHash,
            role: UserRole.STUDENT,
            department: department ? new mongoose.Types.ObjectId(department) : undefined,
        });
        const profile = await StudentProfile.create({
            user: user._id,
            rollNumber: `STU-${Date.now().toString().slice(-6)}`,
            department: department ? new mongoose.Types.ObjectId(department) : new mongoose.Types.ObjectId(),
            semester: 1,
            cgpa: 0.0,
        });
        await AuditLog.create({
            user: req.user?.id || user._id,
            action: 'CREATE_STUDENT',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            details: { targetUser: user._id, targetEmail: user.email },
        });
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                profile,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// get all student profiles for Directory
export const getStudentsList = async (req, res, next) => {
    try {
        if (req.user?.role === 'STUDENT') {
            throw new ForbiddenError('You are not authorized to view the student list');
        }
        const profiles = await StudentProfile.find()
            .populate('user', 'name email role status lastLoginAt')
            .populate('department', 'name code')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: profiles,
        });
    }
    catch (error) {
        next(error);
    }
};
