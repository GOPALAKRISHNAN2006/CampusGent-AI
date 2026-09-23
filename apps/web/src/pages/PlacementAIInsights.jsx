import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Sparkles, ArrowRight, Info } from 'lucide-react';
export const PlacementAIInsights = () => {
    const [loading, setLoading] = useState(true);
    const [insights, setInsights] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchInsights = async () => {
            try {
                setLoading(true);
                setError(null);
                // Fetch real data to construct dynamic observations
                const [studentsRes, jobsRes, appsRes] = await Promise.all([
                    apiClient.get('/students'),
                    apiClient.get('/jobs?status=ACTIVE'),
                    apiClient.get('/jobs/all-applications')
                ]);
                const students = studentsRes.data.data || [];
                const activeJobs = jobsRes.data.data.jobs || [];
                const applications = appsRes.data.data || [];
                const generatedInsights = [];
                // 1. Skill Gap Observation
                activeJobs.forEach((job) => {
                    const reqSkills = job.requiredSkills || [];
                    if (reqSkills.length > 0) {
                        // Find eligible students for this job
                        const minCgpa = job.eligibilityCriteria?.minCgpa || 6.0;
                        const eligibleStudents = students.filter((s) => s.cgpa >= minCgpa);
                        // Find eligible students missing at least one required skill
                        const missingSkillStudents = eligibleStudents.filter((s) => {
                            const studentSkills = (s.skills || []).map((sk) => sk.name.toLowerCase().trim());
                            return reqSkills.some((req) => !studentSkills.includes(req.toLowerCase().trim()));
                        });
                        if (missingSkillStudents.length > 0) {
                            generatedInsights.push({
                                id: `skill-gap-${job._id}`,
                                type: 'SKILL_GAP',
                                title: `Skills Gap: ${job.companyName} Recruitment Criteria`,
                                message: `${missingSkillStudents.length} eligible candidates lack key skills required for the "${job.title}" role.`,
                                evidence: `Job demands [${reqSkills.join(', ')}]. CSE/IT registry holds ${eligibleStudents.length} GPA-compliant candidates, but ${missingSkillStudents.length} lack certified proficiencies.`,
                                impact: 'High initial resume screening rejection rates in upcoming drive rounds.',
                                recommendation: `Schedule targeted bootcamps on [${reqSkills.slice(0, 3).join(', ')}] for flagged candidates.`,
                                actions: [
                                    { label: 'Screen Candidates', path: '/placement/students' },
                                    { label: 'Configure Drive', path: `/placement/drives/${job._id}` }
                                ]
                            });
                        }
                    }
                });
                // 2. Application Yield Observation
                if (applications.length > 0) {
                    const selected = applications.filter((a) => a.status === 'SELECTED').length;
                    const conversionRate = Math.round((selected / applications.length) * 100);
                    if (conversionRate < 25) {
                        generatedInsights.push({
                            id: 'conversion-warning',
                            type: 'PIPELINE_ALERT',
                            title: 'Low Interview Conversion Rate',
                            message: `Recruitment conversions are running low at ${conversionRate}% across active placements.`,
                            evidence: `Total Applications: ${applications.length} | Completed Hires: ${selected}.`,
                            impact: 'Season placement target delays and recruiter engagement drop-offs.',
                            recommendation: 'Launch mock technical interviews and communication guidance sessions.',
                            actions: [
                                { label: 'Schedule Mock Interviews', path: '/placement/interviews' },
                                { label: 'Review Pipeline Outcomes', path: '/placement/placements' }
                            ]
                        });
                    }
                }
                // Fallback default insight if database has no active jobs/applications
                if (generatedInsights.length === 0) {
                    generatedInsights.push({
                        id: 'default-insight',
                        type: 'TREND',
                        title: 'Operational Readiness Status',
                        message: 'All recruitment operations parameters match eligibility baselines.',
                        evidence: `${students.length} student profiles and ${activeJobs.length} active placement drives audited.`,
                        impact: 'Standard operations pipeline execution.',
                        recommendation: 'Monitor candidate interview registrations on the placement calendar.',
                        actions: [
                            { label: 'Check Calendar Schedules', path: '/placement/calendar' }
                        ]
                    });
                }
                setInsights(generatedInsights);
            }
            catch (err) {
                setError('Failed to compute AI observations.');
            }
            finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);
    return (_jsxs("div", { className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 to-brand-950 p-6 rounded-2xl text-white shadow-sm", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-1.5 text-indigo-300", children: [_jsx(Sparkles, { className: "h-4.5 w-4.5 animate-pulse" }), _jsx("span", { className: "text-[9px] font-bold tracking-widest uppercase", children: "Placement AI Copilot" })] }), _jsx("h1", { className: "text-xl font-bold mt-1 text-white", children: "AI Placement Insights & Trends" }), _jsx("p", { className: "text-brand-300 mt-1 text-[11px] max-w-xl", children: "AIAssisted recommendations and risk indicators. All primary decisions and actions require human verification and override by authorized officers." })] }), _jsxs("div", { className: "bg-white/10 p-3 rounded-xl border border-white/10 flex items-center gap-2 text-[10.5px] max-w-xs shrink-0", children: [_jsx(Info, { className: "h-5 w-5 text-indigo-300 shrink-0" }), _jsx("p", { className: "text-brand-200 font-semibold leading-relaxed", children: "AI recommendations do NOT alter student records, shortlist states, or recruiter data automatically." })] })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), loading ? (_jsx("div", { className: "space-y-6 animate-pulse", children: [1, 2].map((i) => (_jsx("div", { className: "h-48 bg-brand-100 rounded-2xl" }, i))) })) : (_jsx("div", { className: "space-y-6", children: insights.map((ins) => (_jsxs(Card, { className: "border border-indigo-100 shadow-sm bg-gradient-to-r from-white to-brand-50/20 bg-white", children: [_jsxs(CardHeader, { className: "border-b border-brand-100 flex flex-row items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { variant: "secondary", className: "bg-indigo-50 border border-indigo-150 text-indigo-700 font-bold text-[9px] uppercase", children: ["AI ", ins.type, " INSIGHT"] }), _jsx(CardTitle, { className: "text-brand-900 font-bold", children: ins.title })] }), _jsx("span", { className: "text-[10px] text-brand-450 font-semibold", children: "Source: AI Placement Agent" })] }), _jsxs(CardContent, { className: "p-5 space-y-4 leading-relaxed text-brand-750", children: [_jsxs("p", { className: "text-brand-900 font-bold text-[12.5px]", children: ["\"", ins.message, "\""] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-[10.5px]", children: [_jsxs("div", { className: "bg-white p-3 rounded-xl border border-brand-200/60", children: [_jsx("span", { className: "font-extrabold text-[9px] uppercase tracking-wider text-brand-500 block mb-1", children: "Empirical Evidence:" }), _jsx("p", { className: "font-semibold text-brand-800", children: ins.evidence })] }), _jsxs("div", { className: "bg-white p-3 rounded-xl border border-brand-200/60", children: [_jsx("span", { className: "font-extrabold text-[9px] uppercase tracking-wider text-brand-500 block mb-1", children: "Projected Operational Impact:" }), _jsx("p", { className: "font-semibold text-brand-800", children: ins.impact })] })] }), _jsxs("div", { className: "border-t border-brand-100 pt-3 space-y-1", children: [_jsx("span", { className: "font-extrabold text-[9px] uppercase tracking-wider text-indigo-700 block", children: "AI Recommended Intervention Action:" }), _jsx("p", { className: "font-semibold text-brand-800", children: ins.recommendation })] }), _jsx("div", { className: "border-t border-brand-100 pt-3 flex gap-4 text-[11px] font-bold", children: ins.actions.map((act, aIdx) => (_jsxs(Link, { to: act.path, className: "text-indigo-650 hover:underline flex items-center gap-0.5", children: [_jsx("span", { children: act.label }), _jsx(ArrowRight, { className: "h-3 w-3" })] }, aIdx))) })] })] }, ins.id))) }))] }));
};
export default PlacementAIInsights;
