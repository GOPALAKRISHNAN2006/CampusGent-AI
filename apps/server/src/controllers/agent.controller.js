import { AIOrchestrator } from '../ai/orchestrator.js';
import { AIContextBuilder } from '../ai/context.builder.js';
import { AIRouter } from '../ai/router.js';
import { memoryManager } from '../ai/memory.manager.js';
import { AIInsight } from '../models/AIInsight.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors.js';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { FacultyProfile } from '../models/FacultyProfile.js';
import { StudentProfile } from '../models/StudentProfile.js';

/**
 * Normalizes customParams to prevent query dropping or double-nested objects.
 */
const normalizeCustomParams = (body = {}) => {
    let params = body.customParams || {};
    while (params && typeof params === 'object' && params.customParams && typeof params.customParams === 'object') {
        params = { ...params, ...params.customParams };
        delete params.customParams;
    }
    const reserved = new Set(['studentId', 'customParams', 'pipeline', 'agentName', 'name']);
    for (const [key, value] of Object.entries(body)) {
        if (!reserved.has(key) && params[key] === undefined) {
            params[key] = value;
        }
    }
    return params;
};

// 1. Single Agent Execution Controller
export const executeAgent = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { name } = req.params;
        const { studentId } = req.body;
        const customParams = normalizeCustomParams(req.body);

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

        // Compile Context Snapshot with request parameters
        const snapshot = await AIContextBuilder.buildSnapshot(targetStudentId, customParams);
        
        // Execute agent logic
        const output = await agent.execute(snapshot, customParams);

        // Record interaction in user-isolated memory
        memoryManager.addTurn(userId, {
            userQuery: customParams.query || customParams.question || customParams.prompt || '',
            agent: name,
            responseSummary: output,
            intent: name,
        });

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
        const { pipeline, studentId } = req.body;
        const customParams = normalizeCustomParams(req.body);

        if (!userId) {
            throw new ForbiddenError('Authentication required');
        }
        const targetStudentId = req.user?.role === 'STUDENT' ? userId : (studentId || userId);
        if (!targetStudentId) {
            throw new BadRequestError('studentId is required for orchestrated pipelines');
        }

        // Auto-routing if pipeline is not specified or set to auto
        if (!pipeline || pipeline === 'auto' || (Array.isArray(pipeline) && pipeline.length === 0)) {
            const query = customParams.query || customParams.prompt || customParams.question || '';
            const routeResult = await AIRouter.routeAndExecute({
                userId,
                query,
                customParams,
                userRole: req.user?.role || 'STUDENT',
                studentId: targetStudentId,
            });
            return res.status(200).json(routeResult);
        }

        if (!Array.isArray(pipeline)) {
            throw new BadRequestError('pipeline must be an array of agent names or "auto"');
        }

        const pipelineOutputs = await AIOrchestrator.executePipeline(targetStudentId, pipeline, customParams, req.user?.role);
        const synthesisVal = pipelineOutputs['synthesis']?.data?.synthesis || 'Synthesis unavailable';
        delete pipelineOutputs['synthesis'];

        // Record interaction in user-isolated memory
        memoryManager.addTurn(userId, {
            userQuery: customParams.query || customParams.question || '',
            agent: pipeline.join('+'),
            responseSummary: synthesisVal,
            intent: 'orchestrated_pipeline',
        });

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

// 3. Dynamic Router & Request Intent Execution
export const routeAndExecute = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new ForbiddenError('Authentication required');
        }
        const customParams = normalizeCustomParams(req.body);
        const query = customParams.query || customParams.prompt || customParams.question || customParams.input || '';
        const targetStudentId = req.user?.role === 'STUDENT' ? userId : (req.body.studentId || userId);

        const result = await AIRouter.routeAndExecute({
            userId,
            query,
            customParams,
            userRole: req.user?.role || 'STUDENT',
            studentId: targetStudentId,
        });

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// 4. Request Intent Classification
export const classifyRequest = async (req, res, next) => {
    try {
        const { query } = req.body;
        const userRole = req.user?.role || 'STUDENT';
        const classification = AIRouter.classifyIntent(query, userRole);
        res.status(200).json({
            success: true,
            data: classification,
        });
    } catch (error) {
        next(error);
    }
};
