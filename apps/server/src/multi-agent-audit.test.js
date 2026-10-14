import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AIRouter, AGENT_ROLES } from './ai/router.js';
import { memoryManager } from './ai/memory.manager.js';
import { AIContextBuilder } from './ai/context.builder.js';
import { AIOrchestrator } from './ai/orchestrator.js';
import { initializeAgentEcosystem } from './ai/agents/index.js';
import { AIService } from './services/ai.service.js';
import mongoose from 'mongoose';
import { User } from './models/User.js';
import { StudentProfile } from './models/StudentProfile.js';
import { Department } from './models/Department.js';
import { connectDB } from './config/db.js';

describe('🔍 Comprehensive Multi-Agent System Audit & Verification Suite', () => {
    let csDepartment;
    let mechDepartment;
    let userA, userB;
    let studentProfileA, studentProfileB;

    beforeAll(async () => {
        initializeAgentEcosystem();
        await connectDB();

        // Find or create test departments safely
        csDepartment = await Department.findOne({ name: /computer science/i });
        if (!csDepartment) {
            csDepartment = await Department.create({ name: 'Audit Computer Science Dept', code: 'AUDIT_CS' });
        }

        mechDepartment = await Department.findOne({ name: /mechanical/i });
        if (!mechDepartment) {
            mechDepartment = await Department.create({ name: 'Audit Mechanical Dept', code: 'AUDIT_MECH' });
        }

        // User A: CS Student focusing on Web & Cloud
        userA = await User.findOneAndUpdate(
            { email: 'aarav.audit@campusgent.edu' },
            {
                name: 'Aarav Patel',
                email: 'aarav.audit@campusgent.edu',
                role: 'STUDENT',
                department: csDepartment._id,
            },
            { upsert: true, new: true }
        );

        studentProfileA = await StudentProfile.findOneAndUpdate(
            { user: userA._id },
            {
                user: userA._id,
                department: csDepartment._id,
                rollNumber: 'AUDIT_CS_001',
                cgpa: 8.8,
                semester: 6,
                skills: [
                    { name: 'React', proficiency: 'ADVANCED', verified: true },
                    { name: 'Node.js', proficiency: 'INTERMEDIATE', verified: true },
                    { name: 'TypeScript', proficiency: 'INTERMEDIATE', verified: false }
                ],
                projects: [
                    { title: 'Campus Social Platform', technologies: ['React', 'Node.js', 'MongoDB'] }
                ],
                careerGoals: ['Full Stack Software Engineer'],
                careerInterests: ['Web Development', 'Cloud Systems'],
                placementReadinessScore: 85,
            },
            { upsert: true, new: true }
        );

        // User B: Mechanical Student focusing on CAD & Thermal
        userB = await User.findOneAndUpdate(
            { email: 'priya.audit@campusgent.edu' },
            {
                name: 'Priya Sharma',
                email: 'priya.audit@campusgent.edu',
                role: 'STUDENT',
                department: mechDepartment._id,
            },
            { upsert: true, new: true }
        );

        studentProfileB = await StudentProfile.findOneAndUpdate(
            { user: userB._id },
            {
                user: userB._id,
                department: mechDepartment._id,
                rollNumber: 'AUDIT_MECH_002',
                cgpa: 7.9,
                semester: 6,
                skills: [
                    { name: 'SolidWorks', proficiency: 'ADVANCED', verified: true },
                    { name: 'AutoCAD', proficiency: 'INTERMEDIATE', verified: true },
                    { name: 'Thermodynamics', proficiency: 'ADVANCED', verified: false }
                ],
                projects: [
                    { title: 'Solar Powered Heat Exchanger', technologies: ['SolidWorks', 'ANSYS'] }
                ],
                careerGoals: ['Mechanical Design Engineer'],
                careerInterests: ['Thermal Engineering', 'Automotive Systems'],
                placementReadinessScore: 78,
            },
            { upsert: true, new: true }
        );
    });

    afterAll(async () => {
        // Cleanup test users and profiles
        if (userA) {
            await StudentProfile.deleteOne({ user: userA._id });
            await User.deleteOne({ _id: userA._id });
        }
        if (userB) {
            await StudentProfile.deleteOne({ user: userB._id });
            await User.deleteOne({ _id: userB._id });
        }
        memoryManager.clearHistory(userA?._id?.toString());
        memoryManager.clearHistory(userB?._id?.toString());
        await mongoose.disconnect();
    });

    // ==========================================
    // 1. INTENT CLASSIFICATION & TASK ROUTING
    // ==========================================
    describe('1. Task Routing & Agent Selection', () => {
        it('should correctly classify academic and GPA queries to student_success agent', () => {
            const result = AIRouter.classifyIntent('What is my current CGPA and attendance risk?', 'STUDENT');
            expect(result.primaryIntent).toBe('student_success');
            expect(result.selectedAgents).toContain('student_success');
        });

        it('should route resume optimization questions to resume_analyzer agent', () => {
            const result = AIRouter.classifyIntent('Please evaluate my resume ATS score and formatting', 'STUDENT');
            expect(result.selectedAgents).toContain('resume_analyzer');
        });

        it('should route multi-domain composite requests to collaborative agents without duplication', () => {
            const result = AIRouter.classifyIntent(
                'I want to apply for jobs: check my resume for ATS keywords and tell me what skills I am missing',
                'STUDENT'
            );
            expect(result.selectedAgents.length).toBeGreaterThanOrEqual(2);
            expect(result.selectedAgents).toContain('resume_analyzer');
            expect(result.selectedAgents).toContain('skill_gap');
        });

        it('should enforce role-based access control during agent classification', () => {
            // A STUDENT asking about student risk indicators should not be routed to faculty_insights or student_risk
            const studentResult = AIRouter.classifyIntent('Which students in the cohort are at risk of failing?', 'STUDENT');
            expect(studentResult.selectedAgents).not.toContain('faculty_insights');
            expect(studentResult.selectedAgents).not.toContain('student_risk');

            // A FACULTY asking the same should be properly routed to student_risk
            const facultyResult = AIRouter.classifyIntent('Which students in the cohort are at risk of failing?', 'FACULTY');
            expect(facultyResult.selectedAgents).toContain('student_risk');
        });

        it('should route placement officer queries to placement_officer_copilot', () => {
            const result = AIRouter.classifyIntent('Show recruiter placement statistics for CSE department', 'PLACEMENT_OFFICER');
            expect(result.selectedAgents).toContain('placement_officer_copilot');
        });
    });

    // ==========================================
    // 2. CONTEXT ISOLATION & MEMORY MANAGEMENT
    // ==========================================
    describe('2. Context Management & Memory Isolation', () => {
        it('should strictly isolate conversation history between different users', () => {
            const idA = userA._id.toString();
            const idB = userB._id.toString();

            // Clear any prior memory
            memoryManager.clearHistory(idA);
            memoryManager.clearHistory(idB);

            // User A interacts
            memoryManager.addTurn(idA, {
                userQuery: 'How can I become a Full Stack Engineer with React?',
                agent: 'career_advisor',
                responseSummary: { roleAlignment: 'Full Stack Engineer' },
                intent: 'career_guidance',
            });

            // User B interacts
            memoryManager.addTurn(idB, {
                userQuery: 'What CAD certifications should I pursue for SolidWorks?',
                agent: 'learning_path',
                responseSummary: { targetCareer: 'Mechanical Design' },
                intent: 'learning_roadmap',
            });

            const historyA = memoryManager.getHistory(idA);
            const historyB = memoryManager.getHistory(idB);

            expect(historyA.length).toBe(2); // user + assistant turns
            expect(historyB.length).toBe(2);

            // User A history must contain User A query and NOT User B query
            expect(historyA[0].content).toContain('Full Stack Engineer');
            expect(historyA[0].content).not.toContain('SolidWorks');

            // User B history must contain User B query and NOT User A query
            expect(historyB[0].content).toContain('SolidWorks');
            expect(historyB[0].content).not.toContain('React');
        });

        it('should correctly maintain multi-turn follow-up history for a user', () => {
            const idA = userA._id.toString();

            // Turn 2 for User A
            memoryManager.addTurn(idA, {
                userQuery: 'What specific database should I learn next?',
                agent: 'learning_path',
                responseSummary: { module: 'MongoDB indexing' },
                intent: 'learning_path',
            });

            const historyA = memoryManager.getHistory(idA);
            expect(historyA.length).toBe(4); // 2 user turns + 2 assistant turns
            expect(historyA[2].content).toBe('What specific database should I learn next?');
        });
    });

    // ==========================================
    // 3. MULTI-USER RESPONSE DIFFERENTIATION
    // ==========================================
    describe('3. Dynamic Context & Meaningfully Differentiated Responses', () => {
        it('should generate distinct context snapshots for User A (CSE) and User B (Mechanical)', async () => {
            const snapshotA = await AIContextBuilder.buildSnapshot(userA._id);
            const snapshotB = await AIContextBuilder.buildSnapshot(userB._id);

            expect(snapshotA.studentName).toBe('Aarav Patel');
            expect(snapshotA.department).toContain('Computer Science');
            expect(snapshotA.academic.cgpa).toBe(8.8);
            expect(snapshotA.skills.some(s => s.name === 'React')).toBe(true);

            expect(snapshotB.studentName).toBe('Priya Sharma');
            expect(snapshotB.department).toContain('Mechanical');
            expect(snapshotB.academic.cgpa).toBe(7.9);
            expect(snapshotB.skills.some(s => s.name === 'SolidWorks')).toBe(true);
        });

        it('should produce meaningfully different responses for different users and roles', async () => {
            const snapshotA = await AIContextBuilder.buildSnapshot(userA._id, { targetRole: 'Full Stack Engineer' });
            const snapshotB = await AIContextBuilder.buildSnapshot(userB._id, { targetRole: 'Mechanical Design Engineer' });

            const agent = AIOrchestrator.getAgent('student_success');
            expect(agent).toBeDefined();

            const resA = await agent.execute(snapshotA, { query: 'Assess my placement readiness' });
            const resB = await agent.execute(snapshotB, { query: 'Assess my placement readiness' });

            // Responses must be distinct
            const textA = JSON.stringify(resA);
            const textB = JSON.stringify(resB);

            expect(textA).not.toEqual(textB);

            // User A response should reflect CSE / Full Stack / React
            expect(textA.toLowerCase()).toMatch(/react|full stack|computer science|software/);

            // User B response should reflect Mechanical / SolidWorks / CAD
            expect(textB.toLowerCase()).toMatch(/mechanical|solidworks|cad|thermal/);
        }, 25000);

        it('should adapt response when the same user asks different requests', async () => {
            const snapshot = await AIContextBuilder.buildSnapshot(userA._id);
            const agent = AIOrchestrator.getAgent('placement_officer_copilot');
            expect(agent).toBeDefined();

            const res1 = await agent.execute(snapshot, { query: 'Show eligible students for React frontend drive' });
            const res2 = await agent.execute(snapshot, { query: 'What are the overall institutional placement trends this year?' });

            expect(res1.query).toContain('React frontend drive');
            expect(res2.query).toContain('institutional placement trends');
            expect(res1.interpretation).not.toEqual(res2.interpretation);
        }, 25000);

        it('should return consistent structural responses for identical requests', async () => {
            const snapshot = await AIContextBuilder.buildSnapshot(userA._id);
            const agent = AIOrchestrator.getAgent('student_success');

            const res1 = await agent.execute(snapshot, { query: 'Assess my academic standing' });
            const res2 = await agent.execute(snapshot, { query: 'Assess my academic standing' });

            // Structural keys must match and be fully populated
            expect(Object.keys(res1).sort()).toEqual(Object.keys(res2).sort());
            expect(res1.overallStatus).toBeDefined();
            expect(res1.strengths).toBeDefined();
        });
    });

    // ==========================================
    // 4. PARAMETER UNWRAPPING & ROUTING EXECUTION
    // ==========================================
    describe('4. Parameter Normalization & Dynamic Route Execution', () => {
        it('should handle double-nested customParams without dropping the user query', async () => {
            const nestedPayload = {
                customParams: {
                    customParams: {
                        query: 'What certifications should I complete for cloud computing?'
                    }
                }
            };

            const result = await AIRouter.routeAndExecute({
                userId: userA._id.toString(),
                query: nestedPayload.customParams.customParams.query,
                customParams: nestedPayload,
                userRole: 'STUDENT',
                studentId: userA._id.toString(),
            });

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.routing.selectedAgents.length).toBeGreaterThan(0);
        });

        it('should extract contextual signals in AIService.extractContextFromPrompt', () => {
            const prompt = `
=== USER SPECIFIC QUERY / DIRECTIVE ===
"How do I prepare for AWS DevOps roles?"

=== TARGET ROLE ===
DevOps / Cloud Engineer

=== STUDENT CONTEXT SNAPSHOT ===
- Name: Aarav Patel
- Department: Computer Science & Engineering
- CGPA: 8.8
- Skills: React, Node.js, Docker
            `;

            const ctx = AIService.extractContextFromPrompt(prompt);
            expect(ctx.studentName).toBe('Aarav Patel');
            expect(ctx.department).toBe('Computer Science & Engineering');
            expect(ctx.cgpa).toBe(8.8);
            expect(ctx.targetRole).toBe('DevOps / Cloud Engineer');
            expect(ctx.query).toBe('How do I prepare for AWS DevOps roles?');
            expect(ctx.skills).toContain('React');
        });
    });
});
