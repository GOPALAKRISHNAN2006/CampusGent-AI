import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Briefcase, Calendar, MapPin, Search } from 'lucide-react';
export const StudentApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const fetchApplications = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/jobs/student/applications');
            setApplications(res.data.data.applications || []);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to fetch job applications.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchApplications();
    }, []);
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'SELECTED':
                return 'success';
            case 'REJECTED':
            case 'WITHDRAWN':
                return 'danger';
            case 'APPLIED':
                return 'default';
            case 'SCREENING':
            case 'SHORTLISTED':
            case 'INTERVIEW':
            default:
                return 'warning';
        }
    };
    // Filtered applications
    const filteredApps = applications.filter((app) => {
        const jobTitle = app.job?.title || '';
        const company = app.job?.companyName || '';
        const matchesSearch = jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-5xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-10 w-44 bg-brand-100 rounded-lg" }), _jsx("div", { className: "h-64 bg-brand-100 rounded-xl" })] }));
    }
    return (_jsxs("div", { className: "space-y-6 max-w-5xl mx-auto text-xs", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-brand-900 flex items-center gap-2", children: [_jsx(Briefcase, { className: "h-6 w-6 text-indigo-500" }), _jsx("span", { children: "My Applications Tracker" })] }), _jsx("p", { className: "text-sm text-brand-500 mt-1", children: "Monitor status updates, timelines, and next actions for all submitted job applications." })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), _jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-brand-200/60 rounded-xl shadow-sm", children: [_jsxs("div", { className: "relative max-w-md w-full", children: [_jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-brand-400" }), _jsx("input", { type: "text", placeholder: "Search by company or role...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full text-xs pl-8 pr-3 py-2 border border-brand-200 rounded-lg outline-none focus:border-indigo-500 bg-white" })] }), _jsx("div", { className: "flex gap-2 w-full sm:w-auto", children: _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "text-xs px-3 py-2 border border-brand-200 rounded-lg outline-none bg-white font-semibold text-brand-700 w-full sm:w-40", children: [_jsx("option", { value: "", children: "All Statuses" }), _jsx("option", { value: "APPLIED", children: "Applied" }), _jsx("option", { value: "SCREENING", children: "Screening" }), _jsx("option", { value: "SHORTLISTED", children: "Shortlisted" }), _jsx("option", { value: "INTERVIEW", children: "Interview" }), _jsx("option", { value: "SELECTED", children: "Selected" }), _jsx("option", { value: "REJECTED", children: "Rejected" }), _jsx("option", { value: "WITHDRAWN", children: "Withdrawn" })] }) })] }), filteredApps.length === 0 ? (_jsx(Card, { className: "text-center p-12 border border-brand-200/60 shadow-sm text-brand-400", children: _jsxs(CardContent, { className: "space-y-2", children: [_jsx(Briefcase, { className: "h-8 w-8 mx-auto text-brand-300 animate-pulse" }), _jsx("h3", { className: "font-bold text-brand-900 text-sm", children: "No Applications Found" }), _jsx("p", { className: "max-w-md mx-auto text-brand-500 leading-relaxed text-xs", children: "You haven't submitted any job applications yet or none match your filters. Visit Placements to apply." })] }) })) : (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "hidden md:block bg-white border border-brand-200/60 rounded-xl shadow-sm overflow-hidden", children: _jsxs("table", { className: "w-full text-left border-collapse text-xs", children: [_jsx("thead", { className: "bg-brand-50 border-b border-brand-100 text-brand-500 font-bold uppercase tracking-wider", children: _jsxs("tr", { children: [_jsx("th", { className: "p-4 pl-6", children: "Company & Position" }), _jsx("th", { className: "p-4", children: "Location" }), _jsx("th", { className: "p-4", children: "Applied Date" }), _jsx("th", { className: "p-4", children: "Status" }), _jsx("th", { className: "p-4 pr-6", children: "Remarks / Next Steps" })] }) }), _jsx("tbody", { className: "divide-y divide-brand-50 text-brand-850", children: filteredApps.map((app) => (_jsxs("tr", { className: "hover:bg-brand-50/20 transition-colors", children: [_jsx("td", { className: "p-4 pl-6", children: _jsxs("div", { className: "space-y-0.5", children: [_jsx("span", { className: "font-bold text-brand-950 block", children: app.job?.title }), _jsx("span", { className: "font-medium text-brand-500 block", children: app.job?.companyName })] }) }), _jsx("td", { className: "p-4 font-medium text-brand-700", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "h-3.5 w-3.5 text-brand-400 shrink-0" }), app.job?.location] }) }), _jsx("td", { className: "p-4 font-semibold text-brand-650", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3.5 w-3.5 text-brand-400 shrink-0" }), new Date(app.createdAt || app.appliedAt).toLocaleDateString()] }) }), _jsx("td", { className: "p-4", children: _jsx(Badge, { variant: getStatusBadgeVariant(app.status), className: "text-[9px] uppercase tracking-wider", children: app.status }) }), _jsxs("td", { className: "p-4 pr-6 text-brand-600", children: [app.status === 'APPLIED' && 'Awaiting resume screening review.', app.status === 'SCREENING' && 'Document verification in progress.', app.status === 'SHORTLISTED' && 'Shortlisted for online code rounds.', app.status === 'INTERVIEW' && 'Check email for interview panel details.', app.status === 'SELECTED' && _jsx("span", { className: "text-green-600 font-bold", children: "Selected! Offer letter sent." }), app.status === 'REJECTED' && 'Application review completed.', app.status === 'WITHDRAWN' && 'Withdrawn by student.'] })] }, app._id))) })] }) }), _jsx("div", { className: "md:hidden grid grid-cols-1 gap-4", children: filteredApps.map((app) => (_jsx(Card, { className: "border border-brand-200/60 shadow-sm", children: _jsxs(CardContent, { className: "p-4 space-y-3", children: [_jsxs("div", { className: "flex justify-between items-start gap-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-brand-900 text-sm leading-snug", children: app.job?.title }), _jsx("p", { className: "font-semibold text-brand-500 mt-0.5", children: app.job?.companyName })] }), _jsx(Badge, { variant: getStatusBadgeVariant(app.status), className: "text-[9px] uppercase", children: app.status })] }), _jsxs("div", { className: "space-y-1.5 text-[10px] text-brand-500 font-medium pt-1 border-t border-brand-50", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(MapPin, { className: "h-3.5 w-3.5 text-brand-400" }), _jsx("span", { children: app.job?.location })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Calendar, { className: "h-3.5 w-3.5 text-brand-400" }), _jsxs("span", { children: ["Applied: ", new Date(app.createdAt || app.appliedAt).toLocaleDateString()] })] })] }), _jsxs("div", { className: "bg-brand-50/50 p-2.5 rounded-lg border border-brand-100 text-[10px] text-brand-650 leading-relaxed", children: [_jsx("span", { className: "font-bold text-brand-800 block mb-0.5", children: "Remarks:" }), app.status === 'APPLIED' && 'Awaiting resume screening review.', app.status === 'SCREENING' && 'Document verification in progress.', app.status === 'SHORTLISTED' && 'Shortlisted for online code rounds.', app.status === 'INTERVIEW' && 'Check email for interview panel details.', app.status === 'SELECTED' && 'Selected! Offer letter sent.', app.status === 'REJECTED' && 'Application review completed.', app.status === 'WITHDRAWN' && 'Withdrawn by student.'] })] }) }, app._id))) })] }))] }));
};
export default StudentApplications;
