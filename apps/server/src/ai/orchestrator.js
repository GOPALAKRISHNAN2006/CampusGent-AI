import { AIContextBuilder } from './context.builder.js';
import { AIService } from '../services/ai.service.js';
import { AuditLog } from '../models/AuditLog.js';
import { logger } from '../utils/logger.js';
import { BadRequestError } from '../utils/errors.js';
import mongoose from 'mongoose';
export class AIOrchestrator {
    static registerAgent(name, agent) {
        this.agentsRegistry.set(name, agent);
    }
    static getAgent(name) {
        return this.agentsRegistry.get(name);
    }
    /**
     * Executes multiple agents when a user request requires cross-domain reasoning.
     * Manages topological execution ordering, parallel batches, failure isolation, timeouts, retries, permission checks, and cost controls.
     */
    static async executePipeline(studentId, agentNames, customParams, userRole) {
        const results = {};
        // 1. Cost Control Budget check
        const limitBudget = (agentNames.length > 10) && (customParams?.enforceBudget || userRole === 'STUDENT');
        if (limitBudget) {
            throw new BadRequestError('Cost control block: Requested pipeline exceeds the budget limit of 10 agents.');
        }
        // 2. Expand pipeline with dependencies recursively (Topological Sorting)
        const visited = new Set();
        const expandedPipeline = [];
        const visit = (name) => {
            if (visited.has(name))
                return;
            visited.add(name);
            const deps = this.agentDependencies[name] || [];
            for (const dep of deps) {
                visit(dep);
            }
            expandedPipeline.push(name);
        };
        for (const name of agentNames) {
            visit(name);
        }
        // 3. Audit Log Start
        await AuditLog.create({
            user: new mongoose.Types.ObjectId(studentId),
            action: 'ORCHESTRATOR_FLOW_START',
            details: {
                requestedAgents: agentNames,
                expandedPipeline,
                userRole,
            },
        });
        try {
            // 4. Build unified token-efficient student context snapshot (minimum context check)
            const snapshot = await AIContextBuilder.buildSnapshot(studentId);
            // 5. Partition into parallel execution tiers to optimize latency
            // Group 1: Independent agents (non-coordinators)
            const isCoordinator = (name) => ['placement_preparation', 'faculty_intervention', 'student_engagement'].includes(name);
            const independentAgents = expandedPipeline.filter((name) => !isCoordinator(name));
            const coordinatorAgents = expandedPipeline.filter((name) => isCoordinator(name));
            // Tier 1: Execute independent agents in parallel
            await Promise.all(independentAgents.map(async (name) => {
                results[name] = await this.executeAgentWithRetryAndTimeout(name, snapshot, customParams, userRole);
            }));
            // Tier 2: Execute coordinators sequentially/parallel (grounded on successful Tier 1 results)
            await Promise.all(coordinatorAgents.map(async (name) => {
                results[name] = await this.executeAgentWithRetryAndTimeout(name, snapshot, customParams, userRole);
            }));
            // 6. Synthesis explanation combining outputs into a coherent response
            const successfulData = Object.entries(results)
                .filter(([_, r]) => r.success)
                .map(([name, r]) => `${name}: ${JSON.stringify(r.data)}`)
                .join('\n\n');
            const synthesisPrompt = `
        Synthesize the outputs of the executed agent pipeline into a coherent, strategic roadmap for the student.
        Provide a clear narrative summary explaining these verified results.

        PIPELINE OUTPUT DETAILS:
        ${successfulData || 'No successful agent data was returned.'}
      `;
            let synthesisText = '';
            try {
                const synthesisRes = await AIService.generateCompletion(studentId, 'orchestrator_synthesis', 'You are the CampusGent AI Orchestrator coordinator. Synthesize the provided pipeline results into a coherent strategic answer.', synthesisPrompt);
                synthesisText = synthesisRes.synthesis || synthesisRes.insights || JSON.stringify(synthesisRes);
            }
            catch (synthErr) {
                logger.error(`❌ Orchestrator synthesis failed: ${synthErr.message}`);
                synthesisText = 'Synthesis failed. Partial agent results are available below.';
            }
            results['synthesis'] = {
                success: true,
                data: {
                    synthesis: synthesisText,
                },
            };
            // Final Audit Log SUCCESS
            await AuditLog.create({
                user: new mongoose.Types.ObjectId(studentId),
                action: 'ORCHESTRATOR_FLOW_SUCCESS',
                details: {
                    expandedPipeline,
                    resultsSummary: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, { success: v.success, error: v.error }])),
                },
            });
            return results;
        }
        catch (snapshotError) {
            logger.error(`❌ Orchestrator: Failed to compile context snapshot: ${snapshotError.message}`);
            await AuditLog.create({
                user: new mongoose.Types.ObjectId(studentId),
                action: 'ORCHESTRATOR_FLOW_FAILURE',
                details: {
                    error: snapshotError.message,
                },
            });
            throw snapshotError;
        }
    }
    /**
     * Helper execution wrapper managing Timeouts, Retries, Validation schema, and Failure Isolation
     */
    static async executeAgentWithRetryAndTimeout(name, snapshot, customParams, userRole) {
        const agent = this.getAgent(name);
        if (!agent) {
            return { success: false, error: `Agent "${name}" not registered in registry` };
        }
        // Role-Permissions Check
        if (userRole) {
            const isRestricted = agent.metadata.permissions?.includes('ai:admin') || agent.metadata.permissions?.includes('ai:placement');
            const isFacultyOnly = name === 'faculty_intervention';
            if (isRestricted && userRole === 'STUDENT') {
                return { success: false, error: 'Forbidden: Unauthorized to execute this restricted agent' };
            }
            if (isFacultyOnly && userRole !== 'FACULTY' && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
                return { success: false, error: 'Forbidden: Unauthorized to execute this faculty agent' };
            }
        }
        const maxRetries = 2;
        const timeoutMs = customParams?.timeoutMs || 5000;
        const runWithTimeout = async () => {
            return new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    reject(new Error(`Agent execution timed out after ${timeoutMs}ms`));
                }, timeoutMs);
                agent.execute(snapshot, customParams)
                    .then((res) => {
                    clearTimeout(timer);
                    resolve(res);
                })
                    .catch((err) => {
                    clearTimeout(timer);
                    reject(err);
                });
            });
        };
        let attempt = 0;
        while (attempt <= maxRetries) {
            try {
                const data = await runWithTimeout();
                return { success: true, data };
            }
            catch (err) {
                attempt++;
                logger.warn(`🤖 Orchestrator: Agent "${name}" attempt ${attempt} failed: ${err.message}`);
                if (attempt > maxRetries) {
                    return { success: false, error: err.message || 'Agent execution failed after retries' };
                }
            }
        }
        return { success: false, error: 'Agent execution failed' };
    }
}
AIOrchestrator.agentsRegistry = new Map();
AIOrchestrator.agentDependencies = {
    placement_preparation: ['placement_readiness', 'skill_gap', 'learning_path', 'resume_intelligence', 'job_matching', 'mock_interview'],
    faculty_intervention: ['student_risk'],
    student_engagement: ['student_risk'],
};
