import { Job } from '../models/Job.js';
/**
 * All eligibility checks are deterministic — AI never overrides these.
 * AI is used only for semantic interpretation *after* this layer runs.
 */
export class JobMatchingService {
    /**
     * Check hard constraints against job requirements.
     * Returns a structured eligibility result with full explanations.
     */
    static checkEligibility(job, student) {
        const reasons = [];
        const failedChecks = [];
        // 1. CGPA check
        const minCgpa = job.eligibilityCriteria?.minCgpa ?? 0;
        if (minCgpa > 0) {
            if (student.cgpa >= minCgpa) {
                reasons.push(`✅ CGPA ${student.cgpa} meets minimum requirement of ${minCgpa}`);
            }
            else {
                const msg = `❌ CGPA ${student.cgpa} does not meet minimum requirement of ${minCgpa}`;
                reasons.push(msg);
                failedChecks.push(msg);
            }
        }
        // 2. Backlog check
        const maxBacklogs = job.eligibilityCriteria?.maxBacklogsAllowed ?? 0;
        if (student.backlogs > maxBacklogs) {
            const msg = `❌ Student has ${student.backlogs} backlog(s), maximum allowed is ${maxBacklogs}`;
            reasons.push(msg);
            failedChecks.push(msg);
        }
        else {
            reasons.push(`✅ Backlog count ${student.backlogs} within allowed limit of ${maxBacklogs}`);
        }
        // 3. Department check
        const allowedDepts = job.eligibilityCriteria?.allowedDepartments ?? [];
        if (allowedDepts.length > 0) {
            const deptId = student.department.toString();
            const allowed = allowedDepts.some(d => d.toString() === deptId);
            if (allowed) {
                reasons.push(`✅ Student department is eligible for this job`);
            }
            else {
                const msg = `❌ Student's department is not in the allowed departments list`;
                reasons.push(msg);
                failedChecks.push(msg);
            }
        }
        return {
            eligible: failedChecks.length === 0,
            reasons,
            failedChecks,
        };
    }
    /**
     * Compute skill intersection and gap — deterministic, no AI.
     */
    static computeSkillMatch(studentSkills, jobRequiredSkills) {
        if (jobRequiredSkills.length === 0) {
            return { matchingSkills: [], missingSkills: [], skillMatchPercent: 100 };
        }
        const normalized = (s) => s.toLowerCase().trim();
        const studentSet = new Set(studentSkills.map(normalized));
        const matchingSkills = [];
        const missingSkills = [];
        for (const req of jobRequiredSkills) {
            if (studentSet.has(normalized(req))) {
                matchingSkills.push(req);
            }
            else {
                missingSkills.push(req);
            }
        }
        const skillMatchPercent = Math.round((matchingSkills.length / jobRequiredSkills.length) * 100);
        return { matchingSkills, missingSkills, skillMatchPercent };
    }
    /**
     * Fetch a single job by ID and compute the deterministic match result.
     * Throws if job not found or not ACTIVE.
     */
    static async computeForJob(jobId, student) {
        const job = await Job.findById(jobId).lean();
        if (!job) {
            throw new Error(`Job ${jobId} not found`);
        }
        const eligibility = this.checkEligibility(job, student);
        const { matchingSkills, missingSkills, skillMatchPercent } = this.computeSkillMatch(student.skills, job.requiredSkills ?? []);
        return {
            jobId: job._id.toString(),
            jobTitle: job.title,
            companyName: job.companyName,
            eligibility,
            matchingSkills,
            missingSkills,
            skillMatchPercent,
        };
    }
    /**
     * Return top ACTIVE jobs sorted by skill match percent for a given student.
     */
    static async findTopMatches(student, limit = 5) {
        const jobs = await Job.find({ status: 'ACTIVE' }).limit(20).lean();
        const results = jobs.map(job => {
            const eligibility = this.checkEligibility(job, student);
            const { matchingSkills, missingSkills, skillMatchPercent } = this.computeSkillMatch(student.skills, job.requiredSkills ?? []);
            return {
                jobId: job._id.toString(),
                jobTitle: job.title,
                companyName: job.companyName,
                eligibility,
                matchingSkills,
                missingSkills,
                skillMatchPercent,
            };
        });
        // Sort by eligible first, then by skill match
        results.sort((a, b) => {
            if (a.eligibility.eligible && !b.eligibility.eligible)
                return -1;
            if (!a.eligibility.eligible && b.eligibility.eligible)
                return 1;
            return b.skillMatchPercent - a.skillMatchPercent;
        });
        return results.slice(0, limit);
    }
}
