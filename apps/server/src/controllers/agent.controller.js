import { AIOrchestrator } from '../ai/orchestrator.js';
import { AIContextBuilder } from '../ai/context.builder.js';
import { AIInsight } from '../models/AIInsight.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors.js';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { FacultyProfile } from '../models/FacultyProfile.js';
import { StudentProfile } from '../models/StudentProfile.js';
// 1. Single Agent Execution Controller
export const executeAgent = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { name } = req.params;
        const { studentId, customParams } = req.body;
        if (!userId) {
            throw new ForbiddenError('Authentication required');
        }
        // Determine target student ID (default to logged-in user if role is STUDENT)
        const targetStudentId = req.user?.role === 'STUDENT' ? userId : studentId;
        if (!targetStudentId) {
            throw new BadRequestError('studentId parameter is required for non-student accounts');
        }
        const agent = AIOrchestrator.getAgent(name);
        if (!agent) {
            throw new NotFoundError(`Agent "${name}" not found in system catalog`);
        }
        // Verify role permissions
        const hasPermission = agent.metadata.permissions.some((p) => {
            // Check if user has corresponding scope or if it's authorized
            return true; // Simplified for dev, RBAC checks occur in route middleware
        });
        if (!hasPermission) {
            throw new ForbiddenError('Insufficient role privileges to run this intelligence agent');
        }
        // Security check: Only faculty or admin can access faculty_insights or faculty_intervention
        if (name === 'faculty_insights' || name === 'faculty_intervention') {
            if (req.user?.role !== 'FACULTY' && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
                throw new ForbiddenError('Unauthorized: Only faculty members and administrators can execute this agent');
            }
            // If user is faculty, enforce department boundary ownership match
            if (req.user?.role === 'FACULTY') {
                const facultyProfile = await FacultyProfile.findOne({ user: userId });
                const studentProfile = await StudentProfile.findOne({ user: targetStudentId });
                if (!facultyProfile) {
                    throw new ForbiddenError('Unauthorized: Faculty profile not found');
                }
                if (!studentProfile) {
                    throw new NotFoundError('Target student profile not found');
                }
                if (facultyProfile.department.toString() !== studentProfile.department.toString()) {
                    throw new ForbiddenError('Unauthorized: Faculty cannot access students outside their department');
                }
            }
        }
        // Security check: placement_analytics is institutional-level, restricted to admin/faculty
        if (name === 'placement_analytics') {
            if (req.user?.role !== 'FACULTY' && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
                throw new ForbiddenError('Unauthorized: Only administrators and faculty can access institutional placement analytics');
            }
        }
        // Security check: placement_officer_copilot is restricted to placement officers and admin
        if (name === 'placement_officer_copilot') {
            if (req.user?.role !== 'PLACEMENT_OFFICER' && req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
                throw new ForbiddenError('Unauthorized: Only placement officers and administrators can execute this agent');
            }
        }
        // Security check: data_quality is restricted to admin or super admin
        if (name === 'data_quality') {
            if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
                throw new ForbiddenError('Unauthorized: Only administrators can execute this agent');
            }
        }
        // Security check: ai_governance is restricted to admin or super admin
        if (name === 'ai_governance') {
            if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
                throw new ForbiddenError('Unauthorized: Only administrators can execute this agent');
            }
        }
        // Compile Context Snapshot
        const snapshot = await AIContextBuilder.buildSnapshot(targetStudentId);
        // Execute agent logic
        const output = await agent.execute(snapshot, customParams);
        // Save insight snapshot with full metadata audits
        const insight = await AIInsight.create({
            user: new mongoose.Types.ObjectId(targetStudentId),
            studentId: targetStudentId,
            type: name.toUpperCase(),
            insight: output,
            agent: agent.metadata.name,
            agentVersion: agent.metadata.version,
            modelUsed: env.AI_MODEL,
            generatedAt: new Date(),
            sourceDataVersion: 'v1.0.0',
            status: 'ACTIVE',
        });
        res.status(200).json({
            success: true,
            data: insight,
        });
    }
    catch (error) {
        next(error);
    }
};
// 2. Orchestrated Pipeline Execution Controller
export const runOrchestrator = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { pipeline, studentId, customParams } = req.body;
        if (!userId) {
            throw new ForbiddenError('Authentication required');
        }
        const targetStudentId = req.user?.role === 'STUDENT' ? userId : studentId;
        if (!targetStudentId) {
            throw new BadRequestError('studentId is required for orchestrated pipelines');
        }
        if (!pipeline || !Array.isArray(pipeline)) {
            throw new BadRequestError('pipeline array of agent names is required');
        }
        const pipelineOutputs = await AIOrchestrator.executePipeline(targetStudentId, pipeline, customParams, req.user?.role);
        const synthesisVal = pipelineOutputs['synthesis']?.data?.synthesis || 'Synthesis unavailable';
        delete pipelineOutputs['synthesis'];
        res.status(200).json({
            success: true,
            data: {
                pipeline,
                results: pipelineOutputs,
                synthesis: synthesisVal,
                isAIAssisted: true,
                label: 'AI-assisted orchestration output. Decisions must be manually verified.',
            },
        });
    }
    catch (error) {
        next(error);
    }
};
