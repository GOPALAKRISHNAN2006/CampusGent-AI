import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { FileText, Search, Award, UserCheck, XCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
export const PlacementApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    // Search & Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState('ALL');
    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get('/jobs/all-applications');
            setApplications(res.data.data || []);
        }
        catch (err) {
            setError('Unable to load applications list.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchApplications();
    }, []);
    useEffect(() => {
        const jobIdParam = searchParams.get('jobId');
        if (jobIdParam) {
            setStageFilter('ALL');
        }
    }, [searchParams]);
    const handleUpdateStatus = async (appId, status, remarks) => {
        try {
            await apiClient.put(`/jobs/application/${appId}/status`, { status, remarks });
            fetchApplications();
        }
        catch (err) {
            alert('Failed to update application status.');
        }
    };
    // Filter logic
    const filteredApps = applications.filter((app) => {
        const matchesSearch = (app.student?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (app.job?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (app.job?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStage = stageFilter === 'ALL' || app.status === stageFilter;
        // Filter by jobId in search query params
        const jobIdParam = searchParams.get('jobId');
        const matchesJobId = !jobIdParam || app.job?._id === jobIdParam;
        return matchesSearch && matchesStage && matchesJobId;
    });
    return (_jsxs("div", { className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Applications Pipeline" }), _jsx("p", { className: "text-brand-500 mt-1", children: "Review student applications, filter by recruitment stage, and transition hiring statuses." })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), _jsxs("div", { className: "bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between", children: [_jsxs("div", { className: "relative flex-1 w-full", children: [_jsx(Search, { className: "absolute left-3 top-3 h-4 w-4 text-brand-400" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search by student, company, or job role...", className: "pl-9 w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white" })] }), _jsx("div", { className: "flex gap-2 w-full md:w-auto shrink-0", children: _jsxs("select", { value: stageFilter, onChange: (e) => setStageFilter(e.target.value), className: "text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700", children: [_jsx("option", { value: "ALL", children: "All Stages" }), _jsx("option", { value: "APPLIED", children: "Applied" }), _jsx("option", { value: "SHORTLISTED", children: "Shortlisted" }), _jsx("option", { value: "INTERVIEW", children: "Interview" }), _jsx("option", { value: "SELECTED", children: "Selected" }), _jsx("option", { value: "REJECTED", children: "Rejected" }), _jsx("option", { value: "WITHDRAWN", children: "Withdrawn" })] }) })] }), _jsx(Card, { className: "border border-brand-200/60 shadow-sm overflow-hidden", children: _jsx(CardContent, { className: "p-0 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-brand-50 border-b border-brand-200 text-brand-650 font-bold uppercase text-[9px] tracking-wider", children: [_jsx("th", { className: "px-5 py-3", children: "Student Details" }), _jsx("th", { className: "px-5 py-3", children: "Company & Job" }), _jsx("th", { className: "px-5 py-3", children: "Applied Date" }), _jsx("th", { className: "px-5 py-3", children: "Resume" }), _jsx("th", { className: "px-5 py-3", children: "Hiring Stage" }), _jsx("th", { className: "px-5 py-3 text-right", children: "Actions Override" })] }) }), _jsx("tbody", { className: "divide-y divide-brand-100 text-brand-800 bg-white", children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-5 py-8 text-center text-brand-450 font-semibold animate-pulse", children: "Loading applications list..." }) })) : filteredApps.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-5 py-8 text-center text-brand-450 font-semibold", children: "No student applications match the specified filters." }) })) : (filteredApps.map((app) => (_jsxs("tr", { className: "hover:bg-brand-50/50 transition-colors", children: [_jsxs("td", { className: "px-5 py-4 font-bold text-brand-950", children: [_jsx("div", { children: app.student?.name }), _jsx("div", { className: "text-[10px] text-brand-450 font-normal mt-0.5", children: app.student?.email })] }), _jsxs("td", { className: "px-5 py-4", children: [_jsx("div", { className: "font-bold text-brand-900", children: app.job?.companyName }), _jsx("div", { className: "text-[10px] text-indigo-650 font-semibold mt-0.5", children: app.job?.title })] }), _jsx("td", { className: "px-5 py-4 font-semibold text-brand-600", children: new Date(app.appliedAt).toLocaleDateString() }), _jsx("td", { className: "px-5 py-4", children: _jsxs("a", { href: app.resumeUrl, target: "_blank", rel: "noreferrer", className: "text-indigo-650 hover:underline font-bold inline-flex items-center gap-1", children: [_jsx(FileText, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "View PDF" })] }) }), _jsx("td", { className: "px-5 py-4", children: _jsx(Badge, { variant: app.status === 'SELECTED' ? 'success' :
                                                    app.status === 'REJECTED' ? 'danger' :
                                                        app.status === 'SHORTLISTED' ? 'warning' : 'secondary', className: "font-bold text-[9px]", children: app.status }) }), _jsxs("td", { className: "px-5 py-4 text-right flex justify-end gap-2.5 mt-1", children: [_jsxs("button", { onClick: () => handleUpdateStatus(app._id, 'SHORTLISTED', 'Screened & short-listed for recruitment rounds'), disabled: app.status === 'SHORTLISTED' || app.status === 'SELECTED', className: "text-[10px] text-indigo-650 hover:underline font-bold disabled:opacity-50 inline-flex items-center gap-0.5", children: [_jsx(Award, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Shortlist" })] }), _jsx("span", { className: "text-brand-200", children: "|" }), _jsxs("button", { onClick: () => handleUpdateStatus(app._id, 'SELECTED', 'Hired & offer confirmed'), disabled: app.status === 'SELECTED', className: "text-[10px] text-green-700 hover:underline font-bold disabled:opacity-50 inline-flex items-center gap-0.5", children: [_jsx(UserCheck, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Mark Hired" })] }), _jsx("span", { className: "text-brand-200", children: "|" }), _jsxs("button", { onClick: () => handleUpdateStatus(app._id, 'REJECTED', 'Application status update to rejected by Placement Cell'), disabled: app.status === 'REJECTED' || app.status === 'SELECTED', className: "text-[10px] text-red-650 hover:underline font-bold disabled:opacity-50 inline-flex items-center gap-0.5", children: [_jsx(XCircle, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Reject" })] })] })] }, app._id)))) })] }) }) })] }));
};
export default PlacementApplications;
