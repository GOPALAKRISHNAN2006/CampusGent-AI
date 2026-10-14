import { AIOrchestrator } from './orchestrator.js';
import { AIContextBuilder } from './context.builder.js';
import { memoryManager } from './memory.manager.js';
import { BadRequestError, ForbiddenError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const AGENT_ROLES = {
    student_success: {
        id: 'student_success',
        name: 'Student Success Advisor',
        description: 'Analyzes academic progress, GPA trajectory, attendance records, and course difficulties.',
        keywords: ['grade', 'gpa', 'cgpa', 'attendance', 'academics', 'marks', 'exam', 'semester', 'course', 'subject'],
        allowedRoles: ['STUDENT', 'FACULTY', 'ADMIN', 'SUPER_ADMIN'],
    },
    placement_readiness: {
        id: 'placement_readiness',
        name: 'Placement Readiness Advisor',
        description: 'Evaluates corporate eligibility, placement drive cutoffs, and overall candidate hiring readiness.',
        keywords: ['placement', 'readiness', 'eligibility', 'cutoff', 'drive', 'campus hiring', 'eligible', 'shortlist'],
        allowedRoles: ['STUDENT', 'PLACEMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    },
    learning_path: {
        id: 'learning_path',
        name: 'Learning Path Architect',
        description: 'Structures developmental learning roadmaps, technical milestones, and prioritized project tasks.',
        keywords: ['learning', 'roadmap', 'what to study', 'learn', 'curriculum', 'milestone', 'coursework', 'tutorial', 'how to become'],
        allowedRoles: ['STUDENT', 'FACULTY', 'ADMIN', 'SUPER_ADMIN'],
    },
    career_advisor: {
        id: 'career_advisor',
        name: 'Career Guidance Advisor',
        description: 'Analyzes student interests and skill profiles to recommend target industry roles and strategic career trajectories.',
        keywords: ['career', 'role', 'job role', 'direction', 'profession', 'which career', 'future', 'industry'],
        allowedRoles: ['STUDENT', 'FACULTY', 'ADMIN', 'SUPER_ADMIN'],
    },
    resume_analyzer: {
        id: 'resume_analyzer',
        name: 'Resume & ATS Specialist',
        description: 'Evaluates resume text for ATS keyword optimization, formatting standards, and structural completeness.',
        keywords: ['resume', 'cv', 'ats', 'parse resume', 'pdf resume', 'resume score', 'keywords'],
        allowedRoles: ['STUDENT', 'PLACEMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    },
    interview_prep: {
        id: 'interview_prep',
        name: 'Technical & Behavioral Interview Prep',
        description: 'Generates role-specific technical and behavioral interview preparation questions and rubrics.',
        keywords: ['interview question', 'questions', 'prepare interview', 'technical interview', 'behavioral interview', 'practice questions'],
        allowedRoles: ['STUDENT', 'PLACEMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    },
    mock_interview: {
        id: 'mock_interview',
        name: 'Mock Interview Evaluator',
        description: 'Critiques candidate answers, assesses accuracy and communication, and generates structured scorecards.',
        keywords: ['evaluate answer', 'mock interview', 'score my answer', 'feedback on answer', 'interview response'],
        allowedRoles: ['STUDENT', 'PLACEMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    },
    job_matching: {
        id: 'job_matching',
        name: 'Job Matching Intelligence',
        description: 'Calculates verified deterministic eligibility and semantic qualification fit for active vacancies.',
        keywords: ['match job', 'find jobs', 'matching jobs', 'vacancies', 'openings', 'which jobs match', 'suitable jobs'],
        allowedRoles: ['STUDENT', 'PLACEMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    },
    skill_gap: {
        id: 'skill_gap',
        name: 'Skill Gap Intelligence',
        description: 'Pinpoints specific missing technical proficiencies between student skills and job market requirements.',
        keywords: ['skill gap', 'skill gaps', 'missing skill', 'missing skills', 'skills missing', 'skills i am missing', 'what skills', 'skills needed', 'tech stack missing'],
        allowedRoles: ['STUDENT', 'PLACEMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    },
    opportunity: {
        id: 'opportunity',
        name: 'Opportunity & Hackathon Scout',
        description: 'Matches students to relevant hackathons, coding contests, open-source projects, and fellowships.',
        keywords: ['hackathon', 'competition', 'contest', 'opportunity', 'fellowship', 'extracurricular'],
        allowedRoles: ['STUDENT', 'ADMIN', 'SUPER_ADMIN'],
    },
    student_risk: {
        id: 'student_risk',
        name: 'Academic Risk Intelligence',
        description: 'Identifies early warning indicators across attendance, academic thresholds, and placement barriers.',
        keywords: ['risk', 'at risk', 'danger', 'failing', 'detention', 'low attendance', 'critical warning'],
        allowedRoles: ['FACULTY', 'ADMIN', 'SUPER_ADMIN'],
    },
    faculty_insights: {
        id: 'faculty_insights',
        name: 'Faculty Mentoring Insights',
        description: 'Provides instructors with cohort-wide academic and attendance concerns for proactive intervention.',
        keywords: ['mentee', 'cohort', 'class performance', 'students needing attention', 'faculty insight'],
        allowedRoles: ['FACULTY', 'ADMIN', 'SUPER_ADMIN'],
    },
    faculty_intervention: {
        id: 'faculty_intervention',
        name: 'Faculty Intervention Planner',
        description: 'Formulates concrete academic support and mentoring intervention plans for struggling students.',
        keywords: ['intervention', 'support student', 'remedial', 'counseling plan', 'help student'],
        allowedRoles: ['FACULTY', 'ADMIN', 'SUPER_ADMIN'],
    },
    placement_officer_copilot: {
        id: 'placement_officer_copilot',
        name: 'Placement Officer NLP Copilot',
        description: 'Answers recruiter and institutional placement queries through natural language and verified database queries.',
        keywords: ['recruiter', 'placement stats', 'placed students', 'placement officer', 'show students for', 'company drive'],
        allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    },
    query_agent: {
        id: 'query_agent',
        name: 'Campus Academic & Policy Assistant',
        description: 'Answers general student inquiries regarding campus policies, regulations, and academic guidelines.',
        keywords: ['what is the policy', 'campus rules', 'attendance policy', 'leave procedure', 'general question'],
        allowedRoles: ['STUDENT', 'FACULTY', 'PLACEMENT_OFFICER', 'ADMIN', 'SUPER_ADMIN'],
    },
};

export class AIRouter {
    /**
     * Analyzes user request text to identify intent and select appropriate agent(s).
     * Supports single-domain and multi-agent cross-domain pipelines.
     */
    static classifyIntent(query, userRole = 'STUDENT') {
        const text = String(query || '').toLowerCase().trim();
        if (!text) {
            return {
                primaryIntent: 'general_guidance',
                selectedAgents: [userRole === 'STUDENT' ? 'student_success' : 'placement_officer_copilot'],
                confidence: 0.5,
                reasoning: 'Default agent selected for empty query context.',
            };
        }

        // Score each agent based on keyword occurrences
        const agentScores = [];

        for (const [agentId, def] of Object.entries(AGENT_ROLES)) {
            // Check role permissions
            if (def.allowedRoles && !def.allowedRoles.includes(userRole)) {
                continue;
            }

            let score = 0;
            for (const keyword of def.keywords) {
                if (text.includes(keyword)) {
                    score += keyword.length > 12 ? 5 : (keyword.length > 5 ? 3 : 2);
                }
            }

            if (score > 0) {
                // query_agent is a broad generic fallback, do not let it overtake specialized agents unless specific policy/rules are queried
                if (agentId === 'query_agent' && !text.includes('policy') && !text.includes('rule') && !text.includes('procedure')) {
                    score = Math.min(score, 2);
                }
                agentScores.push({ agentId, score, name: def.name });
            }
        }

        // Sort by score descending
        agentScores.sort((a, b) => b.score - a.score);

        // Detect composite multi-domain requests
        // e.g. "I want to apply for SDE jobs: check my resume and what skills I am missing"
        const selectedAgents = [];
        if (agentScores.length >= 2 && agentScores[0].score >= 3 && agentScores[1].score >= 3) {
            selectedAgents.push(agentScores[0].agentId, agentScores[1].agentId);
        } else if (agentScores.length > 0) {
            selectedAgents.push(agentScores[0].agentId);
        } else {
            // Fallback: general query agent or career advisor
            selectedAgents.push(userRole === 'STUDENT' ? 'query_agent' : 'placement_officer_copilot');
        }

        return {
            primaryIntent: agentScores[0]?.agentId || 'general_query',
            selectedAgents,
            confidence: agentScores[0] ? Math.min(0.98, agentScores[0].score / 10) : 0.6,
            reasoning: `Matched intents based on keywords for: ${selectedAgents.join(', ')}`,
        };
    }

    /**
     * Core router entrypoint:
     * Analyzes intent, compiles user-isolated context, executes selected agent(s),
     * and updates conversation memory.
     */
    static async routeAndExecute({ userId, query, customParams = {}, userRole = 'STUDENT', studentId }) {
        if (!userId) {
            throw new ForbiddenError('Authentication required');
        }

        const targetStudentId = (userRole === 'STUDENT' || !studentId) ? userId : studentId;

        // 1. Classify intent
        const classification = this.classifyIntent(query, userRole);
        const selectedAgents = customParams?.agent ? [customParams.agent] : classification.selectedAgents;

        logger.info(`🧭 AIRouter: Routing user [${userId}] (${userRole}) query "${String(query).slice(0, 50)}..." to agents: [${selectedAgents.join(', ')}]`);

        // 2. Build complete student context snapshot
        const snapshot = await AIContextBuilder.buildSnapshot(targetStudentId, {
            ...customParams,
            query,
        });

        let output;
        let synthesis = null;

        // 3. Execute: Single agent or Multi-agent collaborative pipeline
        if (selectedAgents.length === 1) {
            const agentName = selectedAgents[0];
            const agent = AIOrchestrator.getAgent(agentName);
            if (!agent) {
                throw new BadRequestError(`Agent "${agentName}" not available in catalog`);
            }
            output = await agent.execute(snapshot, { ...customParams, query });
        } else {
            // Multi-agent collaborative pipeline execution
            const pipelineOutputs = await AIOrchestrator.executePipeline(
                targetStudentId,
                selectedAgents,
                { ...customParams, query },
                userRole
            );
            synthesis = pipelineOutputs['synthesis']?.data?.synthesis || null;
            delete pipelineOutputs['synthesis'];
            output = {
                multiAgentResults: pipelineOutputs,
                synthesis,
            };
        }

        // 4. Record interaction into user-isolated memory
        memoryManager.addTurn(userId, {
            userQuery: query,
            agent: selectedAgents.join('+'),
            responseSummary: synthesis || output,
            intent: classification.primaryIntent,
        });

        return {
            success: true,
            routing: {
                primaryIntent: classification.primaryIntent,
                selectedAgents,
                confidence: classification.confidence,
                reasoning: classification.reasoning,
            },
            data: output,
            studentSummary: {
                name: snapshot.studentName,
                department: snapshot.department,
                cgpa: snapshot.academic?.cgpa,
                targetRole: snapshot.requestedTargetRole || snapshot.careerGoals?.[0] || 'Software Engineer',
            },
        };
    }
}
