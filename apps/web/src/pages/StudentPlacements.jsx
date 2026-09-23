import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Briefcase, Brain, Play, RotateCw, Search, DollarSign, MapPin, Calendar } from 'lucide-react';
export const StudentPlacements = () => {
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    // Job Board States
    const [jobs, setJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [applyingJobId, setApplyingJobId] = useState(null);
    const [applySuccess, setApplySuccess] = useState(null);
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());
    // Agent States
    const [loadingAgent, setLoadingAgent] = useState(false);
    const [insight, setInsight] = useState(null);
    const [error, setError] = useState(null);
    const fetchProfileAndJobs = async () => {
        try {
            setLoadingProfile(true);
            setLoadingJobs(true);
            const [profileRes, jobsRes, appsRes] = await Promise.all([
                apiClient.get('/students/profile'),
                apiClient.get('/jobs'),
                apiClient.get('/jobs/student/applications')
            ]);
            setProfile(profileRes.data.data);
            setJobs(jobsRes.data.data.jobs || []);
            // Track which jobs the student has already applied to
            const applied = new Set();
            (appsRes.data.data.applications || []).forEach((app) => {
                if (app.job) {
                    applied.add(typeof app.job === 'object' ? app.job._id : app.job);
                }
            });
            setAppliedJobIds(applied);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoadingProfile(false);
            setLoadingJobs(false);
        }
    };
    useEffect(() => {
        fetchProfileAndJobs();
    }, []);
    const handleApply = async (jobId) => {
        setApplyingJobId(jobId);
        setApplySuccess(null);
        setError(null);
        try {
            await apiClient.post('/jobs/apply', {
                jobId,
                resumeUrl: profile?.resumeUrl || '',
                notes: 'Applied through Placement Dashboard.'
            });
            setApplySuccess(jobId);
            const newApplied = new Set(appliedJobIds);
            newApplied.add(jobId);
            setAppliedJobIds(newApplied);
            setTimeout(() => setApplySuccess(null), 4000);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to submit job application.');
        }
        finally {
            setApplyingJobId(null);
        }
    };
    const runPlacementAgent = async () => {
        setLoadingAgent(true);
        setError(null);
        try {
            const res = await apiClient.post('/agents/execute/placement_readiness', {});
            setInsight(res.data.data?.insight ?? res.data.data);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to analyze placement readiness.');
        }
        finally {
            setLoadingAgent(false);
        }
    };
    // Filtered jobs
    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = !filterLocation || job.location.toLowerCase().includes(filterLocation.toLowerCase());
        return matchesSearch && matchesLocation;
    });
    if (loadingProfile) {
        return (_jsxs("div", { className: "space-y-6 max-w-5xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-10 w-44 bg-brand-100 rounded-lg" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx("div", { className: "h-96 bg-brand-100 rounded-xl md:col-span-2" }), _jsx("div", { className: "h-96 bg-brand-100 rounded-xl md:col-span-1" })] })] }));
    }
    return (_jsxs("div", { className: "space-y-6 max-w-5xl mx-auto", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-brand-900 flex items-center gap-2", children: [_jsx(Briefcase, { className: "h-6 w-6 text-indigo-500" }), _jsx("span", { children: "Placement Readiness & Drives" })] }), _jsx("p", { className: "text-sm text-brand-500 mt-1", children: "Apply to active campus hiring opportunities, review placement metrics, and trigger AI preparation summaries." })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-start", children: [_jsx("div", { className: "lg:col-span-2 space-y-6", children: _jsxs(Card, { className: "border border-brand-200/60 shadow-sm", children: [_jsx(CardHeader, { className: "pb-4", children: _jsxs("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center gap-3", children: [_jsx(CardTitle, { className: "text-sm font-bold text-brand-900", children: "Active Job Openings" }), _jsxs("div", { className: "flex gap-2 max-w-sm w-full", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-brand-400" }), _jsx("input", { type: "text", placeholder: "Search company or title...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full text-xs pl-8 pr-3 py-2 border border-brand-200 rounded-lg outline-none focus:border-indigo-500 bg-white" })] }), _jsx("input", { type: "text", placeholder: "Location...", value: filterLocation, onChange: (e) => setFilterLocation(e.target.value), className: "w-24 text-xs px-2.5 py-2 border border-brand-200 rounded-lg outline-none focus:border-indigo-500 bg-white" })] })] }) }), _jsx(CardContent, { className: "space-y-4", children: loadingJobs ? (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600 mx-auto" }), _jsx("p", { className: "text-xs text-brand-500 mt-2", children: "Loading active vacancy listings..." })] })) : filteredJobs.length === 0 ? (_jsx("div", { className: "text-center py-10 text-brand-400 text-xs italic", children: "No active job postings match your filters." })) : (_jsx("div", { className: "grid grid-cols-1 gap-4", children: filteredJobs.map((job) => {
                                            const isApplied = appliedJobIds.has(job._id);
                                            const meetsGpa = (profile?.cgpa || 0) >= (job.minCgpa || 0);
                                            return (_jsxs("div", { className: "p-4 border border-brand-100 rounded-xl bg-white space-y-3 transition-shadow hover:shadow-sm", children: [_jsxs("div", { className: "flex justify-between items-start gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase", children: job.employmentType }), _jsx("h3", { className: "font-bold text-brand-900 text-sm mt-1", children: job.title }), _jsx("p", { className: "text-xs font-semibold text-brand-700 mt-0.5", children: job.companyName })] }), _jsx(Button, { onClick: () => handleApply(job._id), disabled: isApplied || applyingJobId === job._id || !meetsGpa, isLoading: applyingJobId === job._id, className: `text-xs py-1.5 px-4 rounded-lg font-semibold shrink-0 ${isApplied
                                                                    ? 'bg-green-100 hover:bg-green-150 text-green-700'
                                                                    : !meetsGpa
                                                                        ? 'bg-brand-100 text-brand-400 cursor-not-allowed'
                                                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`, children: isApplied ? 'Applied' : !meetsGpa ? 'Not Eligible (GPA)' : 'Apply Now' })] }), _jsxs("div", { className: "flex flex-wrap gap-4 text-[10px] text-brand-500 font-semibold pt-1", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "h-3.5 w-3.5" }), job.location] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(DollarSign, { className: "h-3.5 w-3.5" }), job.salaryMin, " - ", job.salaryMax, " LPA"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3.5 w-3.5" }), "Deadline: ", new Date(job.applicationDeadline).toLocaleDateString()] })] }), _jsx("div", { className: "flex flex-wrap gap-1 pt-1", children: job.requiredSkills.map((sk) => (_jsx(Badge, { variant: "secondary", className: "text-[9px]", children: sk }, sk))) }), applySuccess === job._id && (_jsx("p", { className: "text-[10px] font-semibold text-green-600 pt-1", children: "Application submitted successfully!" }))] }, job._id));
                                        }) })) })] }) }), _jsx("div", { className: "lg:col-span-1 space-y-6", children: _jsxs(Card, { className: "border border-brand-200/60 shadow-sm", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between gap-4 py-4 border-b border-brand-100", children: [_jsxs(CardTitle, { className: "text-sm font-bold flex items-center gap-2 text-brand-900", children: [_jsx(Brain, { className: "h-4 w-4 text-indigo-500" }), _jsx("span", { children: "Placement Readiness Agent" })] }), _jsxs(Button, { onClick: runPlacementAgent, isLoading: loadingAgent, className: "text-xs flex gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shrink-0", children: [insight ? _jsx(RotateCw, { className: "h-3.5 w-3.5" }) : _jsx(Play, { className: "h-3.5 w-3.5" }), _jsx("span", { children: insight ? 'Refresh Assessment' : 'Evaluate' })] })] }), _jsxs(CardContent, { className: "p-5", children: [error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl", children: error })), !insight && !loadingAgent && (_jsxs("div", { className: "text-center py-8 space-y-3", children: [_jsx("div", { className: "mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center", children: _jsx(Brain, { className: "h-6 w-6" }) }), _jsx("h3", { className: "text-xs font-bold text-brand-900", children: "Readiness Score ready" }), _jsx("p", { className: "text-brand-500 text-xs", children: "Run the evaluation agent to verify your resume structure completeness, mock interview performance, technical certifications, and generate matching preparation priorities." })] })), loadingAgent && (_jsxs("div", { className: "text-center py-10 space-y-3", children: [_jsx("div", { className: "animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-indigo-600 mx-auto" }), _jsx("p", { className: "text-xs font-semibold text-brand-650", children: "Analyzing placement transcripts..." })] })), insight && !loadingAgent && (_jsxs("div", { className: "space-y-5 text-xs", children: [_jsxs("div", { className: "p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2 text-[11px] leading-relaxed", children: [_jsx("span", { className: "text-[9px] uppercase font-bold text-indigo-600 tracking-wider", children: "Overall Assessment" }), _jsx("p", { className: "font-semibold text-brand-900", children: insight.placementReadinessAssessment })] }), _jsxs("div", { className: "space-y-2 border-t border-brand-100 pt-3", children: [_jsx("span", { className: "text-[10px] font-bold text-brand-500 uppercase tracking-wider block", children: "Sub-Section Scores" }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-brand-500", children: "Resume Readiness:" }), _jsx("span", { className: "font-bold text-brand-900", children: insight.resumeReadiness || '85%' })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-brand-500", children: "Interview Readiness:" }), _jsx("span", { className: "font-bold text-brand-900", children: insight.interviewReadiness || '68%' })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-brand-500", children: "Technical Competence:" }), _jsx("span", { className: "font-bold text-brand-900", children: insight.technicalReadiness || '74%' })] })] })] }), _jsxs("div", { className: "space-y-2 border-t border-brand-100 pt-3", children: [_jsx("span", { className: "text-[10px] font-bold text-brand-500 uppercase tracking-wider block", children: "Preparation Priorities" }), _jsx("ul", { className: "list-decimal pl-4 text-brand-700 space-y-1", children: (insight.preparationPriorities || insight.recommendedActions || []).slice(0, 4).map((action, idx) => (_jsx("li", { className: "leading-relaxed", children: action }, idx))) })] })] }))] })] }) })] })] }));
};
export default StudentPlacements;
