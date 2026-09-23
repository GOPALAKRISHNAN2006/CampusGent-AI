import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { MapPin, DollarSign, Users, CheckSquare, FileText, Award, TrendingUp, Clock, ChevronRight, Plus, Sparkles, Info } from 'lucide-react';
export const PlacementDriveDetail = () => {
    const { driveId } = useParams();
    const [drive, setDrive] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    // Interview Scheduler State
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [schedStudent, setSchedStudent] = useState('');
    const [schedAppId, setSchedAppId] = useState('');
    const [schedDate, setSchedDate] = useState('');
    const [schedType, setSchedType] = useState('TECHNICAL');
    const [schedMeetingUrl, setSchedMeetingUrl] = useState('');
    // Eligibility configuration state
    const [eligCgpa, setEligCgpa] = useState(6.0);
    const [eligBacklogs, setEligBacklogs] = useState(0);
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [driveRes, appsRes] = await Promise.all([
                apiClient.get(`/jobs/${driveId}`),
                apiClient.get(`/jobs/job-applications/${driveId}`)
            ]);
            setDrive(driveRes.data.data);
            setApplications(appsRes.data.data || []);
            setEligCgpa(driveRes.data.data.eligibilityCriteria?.minCgpa || 6.0);
            setEligBacklogs(driveRes.data.data.eligibilityCriteria?.maxBacklogsAllowed || 0);
        }
        catch (err) {
            setError('Failed to load drive details.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (driveId) {
            fetchData();
        }
    }, [driveId]);
    const handleUpdateStatus = async (appId, status, remarks) => {
        try {
            await apiClient.put(`/jobs/application/${appId}/status`, { status, remarks });
            fetchData();
        }
        catch (err) {
            alert('Failed to update status');
        }
    };
    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/jobs/interviews', {
                applicationId: schedAppId,
                studentId: schedStudent,
                jobId: driveId,
                date: schedDate,
                type: schedType,
                meetingUrl: schedMeetingUrl
            });
            setIsScheduleOpen(false);
            // Reset
            setSchedStudent('');
            setSchedAppId('');
            setSchedDate('');
            setSchedMeetingUrl('');
            fetchData();
        }
        catch (err) {
            alert(err.response?.data?.message || 'Failed to schedule interview');
        }
    };
    const handleUpdateEligibility = async () => {
        try {
            await apiClient.put(`/jobs/${driveId}`, {
                eligibilityCriteria: {
                    ...drive.eligibilityCriteria,
                    minCgpa: eligCgpa,
                    maxBacklogsAllowed: eligBacklogs
                }
            });
            alert('Eligibility parameters updated successfully!');
            fetchData();
        }
        catch (err) {
            alert('Failed to update eligibility criteria');
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-7xl mx-auto text-xs animate-pulse", children: [_jsx("div", { className: "h-12 bg-brand-100 rounded w-1/3" }), _jsx("div", { className: "h-64 bg-brand-100 rounded-xl" })] }));
    }
    if (!drive) {
        return (_jsxs("div", { className: "text-center py-16 max-w-7xl mx-auto text-xs", children: [_jsx("h3", { className: "font-bold text-brand-900 text-sm", children: "Placement Drive Not Found" }), _jsx(Link, { to: "/placement/drives", className: "text-indigo-650 font-bold hover:underline block mt-2", children: "Back to Drives List" })] }));
    }
    // Count states
    const appliedCount = applications.length;
    const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW' || a.status === 'SELECTED').length;
    const interviewCount = applications.filter((a) => a.status === 'INTERVIEW').length;
    const selectedCount = applications.filter((a) => a.status === 'SELECTED').length;
    const conversionRate = appliedCount > 0 ? Math.round((selectedCount / appliedCount) * 100) : 0;
    return (_jsxs("div", { className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { className: "bg-white border border-brand-200/60 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-brand-450 font-bold text-[10px] uppercase tracking-wider", children: [_jsx(Link, { to: "/placement/drives", className: "hover:underline", children: "Drives" }), _jsx(ChevronRight, { className: "h-3.5 w-3.5" }), _jsxs("span", { children: ["Drive ID: ", drive._id.slice(-6)] })] }), _jsx("h1", { className: "text-xl font-bold text-brand-900", children: drive.companyName }), _jsx("p", { className: "font-semibold text-indigo-650 text-[11px]", children: drive.title }), _jsxs("div", { className: "flex flex-wrap items-center gap-4 text-brand-500 font-semibold pt-1", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "h-3.5 w-3.5" }), " ", drive.location] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(DollarSign, { className: "h-3.5 w-3.5" }), " ", drive.salaryMin, " - ", drive.salaryMax, " LPA"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "h-3.5 w-3.5" }), " Deadline: ", new Date(drive.applicationDeadline).toLocaleDateString()] })] })] }), _jsxs("div", { className: "flex flex-col items-end gap-2.5 shrink-0", children: [_jsxs(Badge, { variant: drive.status === 'ACTIVE' ? 'success' : 'warning', className: "font-bold text-[10px] py-1 px-3", children: ["Status: ", drive.status] }), _jsxs("span", { className: "text-[10px] text-brand-450 font-bold", children: ["Created: ", new Date(drive.createdAt).toLocaleDateString()] })] })] }), _jsx("div", { className: "flex border-b border-brand-200 gap-6 text-[11px] font-bold", children: [
                    { id: 'overview', label: 'Overview' },
                    { id: 'eligibility', label: 'Eligibility' },
                    { id: 'applicants', label: 'Applicants Table' },
                    { id: 'shortlist', label: 'Shortlisting Suite' },
                    { id: 'interviews', label: 'Interviews' },
                    { id: 'offers', label: 'Offers & Outcomes' }
                ].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab.id), className: `pb-2.5 px-1 transition-colors ${activeTab === tab.id
                        ? 'border-b-2 border-indigo-600 text-indigo-650'
                        : 'text-brand-450 hover:text-brand-700'}`, children: tab.label }, tab.id))) }), activeTab === 'overview' && (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-5", children: [
                            { label: 'Eligible Candidates', val: 128, icon: Users, color: 'indigo' },
                            { label: 'Total Applications', val: appliedCount, icon: FileText, color: 'blue' },
                            { label: 'Shortlisted Suite', val: shortlistedCount, icon: Award, color: 'amber' },
                            { label: 'Selected Offers', val: selectedCount, icon: CheckSquare, color: 'green' },
                            { label: 'Conversion Yield', val: `${conversionRate}%`, icon: TrendingUp, color: 'teal' }
                        ].map((metric, idx) => {
                            const Icon = metric.icon;
                            return (_jsx(Card, { className: "border-brand-200/60 shadow-sm text-center", children: _jsxs(CardContent, { className: "p-4 space-y-2", children: [_jsx("span", { className: "text-[9px] text-brand-500 uppercase font-extrabold tracking-wider block", children: metric.label }), _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(Icon, { className: "h-4.5 w-4.5 text-brand-400 shrink-0" }), _jsx("p", { className: "text-lg font-black text-brand-900", children: metric.val })] })] }) }, idx));
                        }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "border-brand-200/60 shadow-sm lg:col-span-2", children: [_jsx(CardHeader, { className: "border-b border-brand-100", children: _jsx(CardTitle, { className: "text-brand-900 font-bold", children: "Drive Timeline Overview" }) }), _jsx(CardContent, { className: "p-5 space-y-4", children: _jsxs("div", { className: "flex items-stretch justify-between relative text-[10px] text-brand-700", children: [_jsx("div", { className: "absolute top-2 left-0 right-0 h-1 bg-brand-100 -z-10" }), [
                                                    { label: 'Applications Open', date: 'Aug 24, 2026', done: true },
                                                    { label: 'Deadline', date: new Date(drive.applicationDeadline).toLocaleDateString(), done: false },
                                                    { label: 'Shortlists Released', date: 'Sep 01, 2026', done: false },
                                                    { label: 'Interviews Rounds', date: 'Sep 05, 2026', done: false },
                                                    { label: 'Final Selections', date: 'Sep 10, 2026', done: false }
                                                ].map((evt, idx) => (_jsxs("div", { className: "text-center space-y-1.5 flex-1 relative", children: [_jsx("div", { className: `w-4.5 h-4.5 rounded-full mx-auto flex items-center justify-center border-2 ${evt.done ? 'bg-indigo-650 border-indigo-650 text-white' : 'bg-white border-brand-300 text-brand-450'}`, children: idx + 1 }), _jsx("span", { className: "block font-bold text-brand-900", children: evt.label }), _jsx("span", { className: "block text-[9px] text-brand-450", children: evt.date })] }, idx)))] }) })] }), _jsxs(Card, { className: "border-brand-200/60 shadow-sm lg:col-span-1 bg-gradient-to-br from-indigo-50/20 to-brand-50/20", children: [_jsx(CardHeader, { className: "border-b border-brand-100", children: _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Sparkles, { className: "h-4.5 w-4.5 text-indigo-600" }), _jsx(CardTitle, { className: "text-brand-900 font-bold", children: "AI Drive Predictor" })] }) }), _jsxs(CardContent, { className: "p-4 space-y-3 leading-relaxed text-brand-750", children: [_jsxs("div", { className: "bg-white p-3 rounded-lg border border-indigo-100", children: [_jsx("span", { className: "font-extrabold text-[9px] uppercase tracking-wider text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded block w-max mb-1.5", children: "AI Recommendation" }), _jsx("p", { children: "Based on student performance histories in Microsoft assessments, Google Cloud certifications, and resume intelligence scores:" }), _jsx("p", { className: "mt-2 font-bold text-brand-900", children: "Estimated selected yield: 8\u201312 candidates." })] }), _jsxs("div", { className: "flex items-center gap-1 text-[9px] text-brand-500 font-medium", children: [_jsx(Info, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Clearly labeled AI insight prediction." })] })] })] })] })] })), activeTab === 'eligibility' && (_jsxs(Card, { className: "border-brand-200/60 shadow-sm", children: [_jsx(CardHeader, { className: "border-b border-brand-100", children: _jsx(CardTitle, { className: "text-brand-900 font-bold", children: "Configure Eligibility Criteria" }) }), _jsxs(CardContent, { className: "p-5 space-y-5", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-700 block", children: "Minimum CGPA Cutoff" }), _jsx("input", { type: "number", step: "0.1", value: eligCgpa, onChange: (e) => setEligCgpa(Number(e.target.value)), className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-700 block", children: "Maximum Active Backlogs" }), _jsx("input", { type: "number", value: eligBacklogs, onChange: (e) => setEligBacklogs(Number(e.target.value)), className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] }), _jsx("div", { className: "flex items-end", children: _jsx(Button, { onClick: handleUpdateEligibility, className: "w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-2.5", children: "Update eligibility parameters" }) })] }), _jsxs("div", { className: "border border-brand-200 rounded-xl p-4 bg-brand-50/50 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "font-extrabold text-brand-900 uppercase text-[10px] tracking-wider", children: "Eligible Cohort Preview" }), _jsx(Badge, { variant: "secondary", className: "bg-brand-100 text-brand-700 font-bold", children: "128 Students Match Cutoffs" })] }), _jsx("p", { className: "text-brand-500", children: "The updated cutoffs will evaluate student registrations. Ineligible students will be blocked from submitting applications to this drive." })] })] })] })), activeTab === 'applicants' && (_jsxs(Card, { className: "border-brand-200/60 shadow-sm", children: [_jsxs(CardHeader, { className: "border-b border-brand-100 flex flex-row items-center justify-between", children: [_jsx(CardTitle, { className: "text-brand-900 font-bold", children: "Applications Registry" }), _jsxs("span", { className: "font-bold text-brand-500", children: [applications.length, " applied candidates"] })] }), _jsx(CardContent, { className: "p-0 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-brand-50 border-b border-brand-200 text-brand-650 font-bold", children: [_jsx("th", { className: "px-5 py-3", children: "Student Name" }), _jsx("th", { className: "px-5 py-3", children: "Roll Number" }), _jsx("th", { className: "px-5 py-3", children: "Submission Date" }), _jsx("th", { className: "px-5 py-3", children: "Resume URL" }), _jsx("th", { className: "px-5 py-3", children: "Hiring Stage" }), _jsx("th", { className: "px-5 py-3 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-brand-100 text-brand-800", children: applications.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-5 py-8 text-center text-brand-450 font-semibold", children: "No applications recorded yet." }) })) : (applications.map((app) => (_jsxs("tr", { className: "hover:bg-brand-50/50", children: [_jsx("td", { className: "px-5 py-4 font-bold text-brand-950", children: app.student?.name }), _jsx("td", { className: "px-5 py-4", children: app.student?.email }), _jsx("td", { className: "px-5 py-4", children: new Date(app.appliedAt).toLocaleDateString() }), _jsx("td", { className: "px-5 py-4", children: _jsx("a", { href: app.resumeUrl, target: "_blank", rel: "noreferrer", className: "text-indigo-650 hover:underline font-bold", children: "View Resume" }) }), _jsx("td", { className: "px-5 py-4", children: _jsx(Badge, { variant: app.status === 'SELECTED' ? 'success' :
                                                        app.status === 'REJECTED' ? 'danger' :
                                                            app.status === 'SHORTLISTED' ? 'warning' : 'secondary', className: "font-bold text-[9px]", children: app.status }) }), _jsxs("td", { className: "px-5 py-4 text-right flex justify-end gap-2.5", children: [_jsx("button", { onClick: () => handleUpdateStatus(app._id, 'SHORTLISTED', 'Resume approved for assessment rounds'), disabled: app.status === 'SHORTLISTED' || app.status === 'SELECTED', className: "text-[10px] text-indigo-650 hover:underline font-bold disabled:opacity-50", children: "Shortlist" }), _jsx("span", { className: "text-brand-300", children: "|" }), _jsx("button", { onClick: () => handleUpdateStatus(app._id, 'REJECTED', 'Eligibility verification failure'), disabled: app.status === 'REJECTED' || app.status === 'SELECTED', className: "text-[10px] text-red-650 hover:underline font-bold disabled:opacity-50", children: "Reject" })] })] }, app._id)))) })] }) })] })), activeTab === 'shortlist' && (_jsxs(Card, { className: "border-brand-200/60 shadow-sm", children: [_jsxs(CardHeader, { className: "border-b border-brand-100 flex flex-row items-center justify-between", children: [_jsx(CardTitle, { className: "text-brand-900 font-bold", children: "Shortlist Screening Hub" }), _jsx("span", { className: "text-[10px] text-brand-450 font-bold", children: "Human verification override required" })] }), _jsx(CardContent, { className: "p-0 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-brand-50 border-b border-brand-200 text-brand-650 font-bold", children: [_jsx("th", { className: "px-5 py-3", children: "Student Name" }), _jsx("th", { className: "px-5 py-3", children: "Aptitude Score" }), _jsx("th", { className: "px-5 py-3", children: "Resume Strength" }), _jsx("th", { className: "px-5 py-3", children: "AI Recommendation (Labeled)" }), _jsx("th", { className: "px-5 py-3", children: "Current Status" }), _jsx("th", { className: "px-5 py-3 text-right", children: "Approve Shortlist" })] }) }), _jsx("tbody", { className: "divide-y divide-brand-100 text-brand-800", children: applications.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-5 py-8 text-center text-brand-450 font-semibold", children: "No candidates to screen." }) })) : (applications.map((app, idx) => {
                                        const aiConfidence = 75 + (idx % 3) * 8;
                                        return (_jsxs("tr", { className: "hover:bg-brand-50/50", children: [_jsx("td", { className: "px-5 py-4 font-bold text-brand-950", children: app.student?.name }), _jsx("td", { className: "px-5 py-4 font-bold", children: "84%" }), _jsx("td", { className: "px-5 py-4 text-green-700 font-bold", children: "STRONG" }), _jsx("td", { className: "px-5 py-4", children: _jsx("div", { className: "flex items-center gap-1.5", children: _jsxs(Badge, { variant: "secondary", className: "bg-indigo-50 border border-indigo-150 text-indigo-700 font-bold text-[9px]", children: ["AI RECOMMENDED (", aiConfidence, "% confidence)"] }) }) }), _jsx("td", { className: "px-5 py-4", children: _jsx(Badge, { variant: app.status === 'SHORTLISTED' ? 'warning' : 'secondary', className: "font-bold text-[9px]", children: app.status }) }), _jsx("td", { className: "px-5 py-4 text-right", children: _jsx(Button, { disabled: app.status === 'SHORTLISTED', onClick: () => handleUpdateStatus(app._id, 'SHORTLISTED', 'Shortlist approved by operations'), size: "sm", className: "bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-[9px]", children: "Approve" }) })] }, app._id));
                                    })) })] }) })] })), activeTab === 'interviews' && (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-center bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-extrabold text-brand-900 text-sm", children: "Schedule Interviews" }), _jsx("p", { className: "text-brand-500", children: "Configure round timelines, dates, and assign online meeting rooms." })] }), _jsxs(Button, { onClick: () => setIsScheduleOpen(true), className: "bg-indigo-650 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5", children: [_jsx(Plus, { className: "h-4.5 w-4.5" }), _jsx("span", { children: "Schedule Interview" })] })] }), _jsxs(Card, { className: "border-brand-200/60 shadow-sm", children: [_jsx(CardHeader, { className: "border-b border-brand-100", children: _jsx(CardTitle, { className: "text-brand-900 font-bold", children: "Scheduled Interviews Logs" }) }), _jsx(CardContent, { className: "p-0 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-brand-50 border-b border-brand-200 text-brand-650 font-bold", children: [_jsx("th", { className: "px-5 py-3", children: "Student Name" }), _jsx("th", { className: "px-5 py-3", children: "Interview Round" }), _jsx("th", { className: "px-5 py-3", children: "Scheduled Date" }), _jsx("th", { className: "px-5 py-3", children: "Meeting Room" }), _jsx("th", { className: "px-5 py-3", children: "Feedback / Notes" }), _jsx("th", { className: "px-5 py-3 text-right", children: "Approve Status" })] }) }), _jsx("tbody", { className: "divide-y divide-brand-100 text-brand-800", children: applications.filter((a) => a.status === 'INTERVIEW').length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-5 py-8 text-center text-brand-450 font-semibold", children: "No active interview sessions scheduled." }) })) : (applications.filter((a) => a.status === 'INTERVIEW').map((app) => (_jsxs("tr", { className: "hover:bg-brand-50/50", children: [_jsx("td", { className: "px-5 py-4 font-bold text-brand-950", children: app.student?.name }), _jsx("td", { className: "px-5 py-4 font-bold text-indigo-700", children: "TECHNICAL ROUND" }), _jsx("td", { className: "px-5 py-4", children: "Tomorrow, 10:00 AM" }), _jsx("td", { className: "px-5 py-4", children: _jsx("a", { href: "https://meet.google.com/abc", target: "_blank", rel: "noreferrer", className: "text-indigo-650 hover:underline font-bold", children: "Join Meeting Room" }) }), _jsx("td", { className: "px-5 py-4 font-semibold text-brand-500", children: "Awaiting feedback submission..." }), _jsx("td", { className: "px-5 py-4 text-right", children: _jsx(Button, { onClick: () => handleUpdateStatus(app._id, 'SELECTED', 'Technical interview evaluation completed successfully'), size: "sm", className: "bg-green-600 hover:bg-green-700 text-white font-bold text-[9px]", children: "Mark Hired" }) })] }, app._id)))) })] }) })] })] })), activeTab === 'offers' && (_jsxs(Card, { className: "border-brand-200/60 shadow-sm", children: [_jsx(CardHeader, { className: "border-b border-brand-100", children: _jsx(CardTitle, { className: "text-brand-900 font-bold", children: "Offers & Hired Outcomes" }) }), _jsx(CardContent, { className: "p-0 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-brand-50 border-b border-brand-200 text-brand-650 font-bold", children: [_jsx("th", { className: "px-5 py-3", children: "Student Name" }), _jsx("th", { className: "px-5 py-3", children: "Roll Number" }), _jsx("th", { className: "px-5 py-3", children: "Designation Role" }), _jsx("th", { className: "px-5 py-3", children: "Salary Package" }), _jsx("th", { className: "px-5 py-3", children: "Joined Status" })] }) }), _jsx("tbody", { className: "divide-y divide-brand-100 text-brand-800", children: applications.filter((a) => a.status === 'SELECTED').length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-5 py-8 text-center text-brand-450 font-semibold", children: "No hires recorded for this drive yet." }) })) : (applications.filter((a) => a.status === 'SELECTED').map((app) => (_jsxs("tr", { className: "hover:bg-brand-50/50", children: [_jsx("td", { className: "px-5 py-4 font-bold text-brand-950", children: app.student?.name }), _jsx("td", { className: "px-5 py-4", children: app.student?.email }), _jsx("td", { className: "px-5 py-4 font-semibold text-brand-700", children: drive.title }), _jsxs("td", { className: "px-5 py-4 font-bold", children: [drive.salaryMax, " LPA"] }), _jsx("td", { className: "px-5 py-4", children: _jsx(Badge, { variant: "success", className: "font-bold text-[9px]", children: "ACCEPTED & JOINED" }) })] }, app._id)))) })] }) })] })), isScheduleOpen && (_jsx("div", { className: "fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-brand-950/40", children: _jsxs("div", { className: "relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-slide-in flex flex-col justify-between", children: [_jsxs("div", { className: "p-4 border-b border-brand-100 flex items-center justify-between bg-brand-50", children: [_jsx("h3", { className: "font-bold text-brand-900 uppercase tracking-wider", children: "Schedule Interview" }), _jsx("button", { onClick: () => setIsScheduleOpen(false), className: "p-1 hover:bg-brand-200 rounded-full text-brand-450", children: _jsx(X, { className: "h-4.5 w-4.5" }) })] }), _jsxs("form", { onSubmit: handleScheduleSubmit, className: "p-5 space-y-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-750 block", children: "Select Candidate *" }), _jsxs("select", { required: true, value: schedAppId, onChange: (e) => {
                                                setSchedAppId(e.target.value);
                                                const selected = applications.find((a) => a._id === e.target.value);
                                                if (selected)
                                                    setSchedStudent(selected.student?._id || '');
                                            }, className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850", children: [_jsx("option", { value: "", children: "-- Select Candidate --" }), applications
                                                    .filter((a) => a.status === 'SHORTLISTED' || a.status === 'APPLIED')
                                                    .map((a) => (_jsx("option", { value: a._id, children: a.student?.name }, a._id)))] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-750 block", children: "Scheduled Date & Time *" }), _jsx("input", { required: true, type: "datetime-local", value: schedDate, onChange: (e) => setSchedDate(e.target.value), className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-750 block", children: "Interview Round Type *" }), _jsxs("select", { value: schedType, onChange: (e) => setSchedType(e.target.value), className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850", children: [_jsx("option", { value: "TECHNICAL", children: "Technical Round" }), _jsx("option", { value: "BEHAVIORAL", children: "Behavioral Round" }), _jsx("option", { value: "HR", children: "HR Round" })] })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-750 block", children: "Meeting URL (Google Meet / Teams)" }), _jsx("input", { type: "url", placeholder: "https://meet.google.com/abc-defg-hij", value: schedMeetingUrl, onChange: (e) => setSchedMeetingUrl(e.target.value), className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => setIsScheduleOpen(false), className: "flex-1 font-bold", children: "Cancel" }), _jsx(Button, { type: "submit", className: "flex-1 bg-indigo-650 hover:bg-indigo-700 text-white font-bold", children: "Schedule Slot" })] })] })] }) }))] }));
};
export default PlacementDriveDetail;
