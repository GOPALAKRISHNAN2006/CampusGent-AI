import { Job } from '../models/Job';
import { JobApplication } from '../models/JobApplication';
import { Interview } from '../models/Interview';
import { StudentProfile } from '../models/StudentProfile';
import { Department } from '../models/Department';
import { logger } from '../utils/logger';

/**
 * Deterministic analytics aggregation result.
 * Every number here is computed from real database records.
 * The AI agent interprets these values — it never invents them.
 */
export interface PlacementStatistics {
  generatedAt: string;

  // Company & Job statistics
  totalCompanies: number;
  totalJobs: number;
  activeJobs: number;
  uniqueCompanies: string[];
  topSkillsDemanded: { skill: string; count: number }[];
  roleDistribution: { role: string; count: number }[];
  averageSalaryRange: { min: number; max: number };

  // Application statistics
  totalApplications: number;
  applicationsByStatus: Record<string, number>;

  // Interview statistics
  totalInterviews: number;
  interviewsByStatus: Record<string, number>;
  interviewsByType: Record<string, number>;
  averageInterviewScore: number;

  // Student readiness
  totalStudents: number;
  averageCgpa: number;
  averagePlacementReadinessScore: number;

  // Department statistics
  departmentBreakdown: { departmentName: string; studentCount: number }[];
}

// Simple in-memory TTL cache
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

export function clearAnalyticsCache(): void {
  cache.clear();
}

export class PlacementAnalyticsService {
  /**
   * Compute all deterministic placement statistics from the database.
   * Results are cached for 5 minutes to avoid expensive re-aggregation.
   */
  public static async computeStatistics(): Promise<PlacementStatistics> {
    const cacheKey = 'placement_analytics_statistics';
    const cached = getCached<PlacementStatistics>(cacheKey);
    if (cached) {
      logger.info('📊 PlacementAnalyticsService: Returning cached statistics');
      return cached;
    }

    logger.info('📊 PlacementAnalyticsService: Computing fresh aggregate statistics...');

    const [
      jobs,
      applications,
      interviews,
      studentProfiles,
      departments,
    ] = await Promise.all([
      Job.find({}).lean(),
      JobApplication.find({}).lean(),
      Interview.find({}).lean(),
      StudentProfile.find({}).lean(),
      Department.find({}).lean(),
    ]);

    // --- Company & Job metrics ---
    const companyNames = [...new Set(jobs.map((j) => j.companyName))];
    const activeJobs = jobs.filter((j) => j.status === 'ACTIVE');

    // Skill demand frequency
    const skillFrequency: Record<string, number> = {};
    for (const job of jobs) {
      for (const skill of job.requiredSkills || []) {
        skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
      }
    }
    const topSkillsDemanded = Object.entries(skillFrequency)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // Role distribution
    const roleFreq: Record<string, number> = {};
    for (const job of jobs) {
      roleFreq[job.title] = (roleFreq[job.title] || 0) + 1;
    }
    const roleDistribution = Object.entries(roleFreq)
      .map(([role, count]) => ({ role, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Average salary range
    const salaryJobs = jobs.filter((j) => j.salaryMin > 0 || j.salaryMax > 0);
    const avgSalaryMin = salaryJobs.length > 0
      ? Math.round(salaryJobs.reduce((s, j) => s + j.salaryMin, 0) / salaryJobs.length)
      : 0;
    const avgSalaryMax = salaryJobs.length > 0
      ? Math.round(salaryJobs.reduce((s, j) => s + j.salaryMax, 0) / salaryJobs.length)
      : 0;

    // --- Application metrics ---
    const applicationsByStatus: Record<string, number> = {};
    for (const app of applications) {
      applicationsByStatus[app.status] = (applicationsByStatus[app.status] || 0) + 1;
    }

    // --- Interview metrics ---
    const interviewsByStatus: Record<string, number> = {};
    const interviewsByType: Record<string, number> = {};
    let scoreSum = 0;
    let scoredCount = 0;
    for (const interview of interviews) {
      interviewsByStatus[interview.status] = (interviewsByStatus[interview.status] || 0) + 1;
      interviewsByType[interview.type] = (interviewsByType[interview.type] || 0) + 1;
      if (interview.score !== undefined && interview.score !== null) {
        scoreSum += interview.score;
        scoredCount++;
      }
    }
    const averageInterviewScore = scoredCount > 0 ? Math.round((scoreSum / scoredCount) * 100) / 100 : 0;

    // --- Student readiness metrics (aggregate, no PII) ---
    const cgpaSum = studentProfiles.reduce((s, p) => s + (p.cgpa || 0), 0);
    const readinessSum = studentProfiles.reduce((s, p) => s + (p.placementReadinessScore || 0), 0);
    const totalStudents = studentProfiles.length;
    const averageCgpa = totalStudents > 0 ? Math.round((cgpaSum / totalStudents) * 100) / 100 : 0;
    const averagePlacementReadinessScore = totalStudents > 0
      ? Math.round((readinessSum / totalStudents) * 100) / 100
      : 0;

    // --- Department breakdown (aggregate counts only, no student names) ---
    const deptMap = new Map(departments.map((d: any) => [d._id.toString(), d.name]));
    const deptCounts: Record<string, number> = {};
    for (const profile of studentProfiles) {
      const deptId = profile.department?.toString();
      if (deptId) {
        const deptName = deptMap.get(deptId) || 'Unknown';
        deptCounts[deptName] = (deptCounts[deptName] || 0) + 1;
      }
    }
    const departmentBreakdown = Object.entries(deptCounts)
      .map(([departmentName, studentCount]) => ({ departmentName, studentCount }))
      .sort((a, b) => b.studentCount - a.studentCount);

    const statistics: PlacementStatistics = {
      generatedAt: new Date().toISOString(),
      totalCompanies: companyNames.length,
      totalJobs: jobs.length,
      activeJobs: activeJobs.length,
      uniqueCompanies: companyNames.slice(0, 20),
      topSkillsDemanded,
      roleDistribution,
      averageSalaryRange: { min: avgSalaryMin, max: avgSalaryMax },
      totalApplications: applications.length,
      applicationsByStatus,
      totalInterviews: interviews.length,
      interviewsByStatus,
      interviewsByType,
      averageInterviewScore,
      totalStudents,
      averageCgpa,
      averagePlacementReadinessScore,
      departmentBreakdown,
    };

    setCache(cacheKey, statistics);
    return statistics;
  }
}
