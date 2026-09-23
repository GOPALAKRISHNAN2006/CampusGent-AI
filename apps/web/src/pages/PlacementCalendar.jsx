import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Calendar as CalendarIcon, Clock, Video } from 'lucide-react';
export const PlacementCalendar = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('AGENDA');
    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get('/jobs/all-interviews');
                setInterviews(res.data.data || []);
            }
            catch (err) {
                setError('Failed to load calendar events.');
            }
            finally {
                setLoading(false);
            }
        };
        fetchInterviews();
    }, []);
    return (_jsxs("div", { className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Placement Operations Calendar" }), _jsx("p", { className: "text-brand-500 mt-1", children: "Audit booked interview schedules, PPT talks dates, and recruiter coordination slots." })] }), _jsx("div", { className: "flex gap-2 bg-white border border-brand-200 p-1 rounded-lg text-[10px] font-bold shrink-0", children: ['MONTH', 'WEEK', 'AGENDA'].map((mode) => (_jsx("button", { onClick: () => setActiveTab(mode), className: `px-3 py-1 rounded-md transition-colors uppercase ${activeTab === mode
                                ? 'bg-indigo-650 text-white font-extrabold'
                                : 'text-brand-650 hover:bg-brand-50'}`, children: mode.toLowerCase() }, mode))) })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), activeTab === 'AGENDA' ? (_jsxs(Card, { className: "border border-brand-200/60 shadow-sm bg-white", children: [_jsxs(CardHeader, { className: "border-b border-brand-100 flex flex-row items-center justify-between", children: [_jsx(CardTitle, { className: "text-brand-900 font-bold", children: "Upcoming Operations Agenda" }), _jsxs("span", { className: "font-bold text-brand-500", children: [interviews.length, " slots booked"] })] }), _jsx(CardContent, { className: "p-4 space-y-4", children: loading ? (_jsx("div", { className: "space-y-4 animate-pulse", children: _jsx("div", { className: "h-16 bg-brand-100 rounded-lg" }) })) : interviews.length === 0 ? (_jsx("p", { className: "text-center py-10 text-brand-450 font-semibold", children: "No operations schedules registered." })) : (interviews.map((int) => (_jsxs("div", { className: "border border-brand-200 rounded-xl p-4 bg-brand-50/20 hover:bg-brand-50/50 transition-colors flex flex-col md:flex-row justify-between gap-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { variant: "secondary", className: "bg-indigo-50 border border-indigo-150 text-indigo-700 font-bold text-[9px] uppercase", children: [int.type, " ROUND"] }), _jsx("h4", { className: "font-extrabold text-brand-950 text-[11.5px]", children: int.student?.name })] }), _jsxs("p", { className: "font-bold text-brand-900", children: [int.job?.companyName, " \u2014 ", _jsx("span", { className: "font-semibold text-brand-500", children: int.job?.title })] }), _jsxs("div", { className: "flex items-center gap-3 text-brand-500 font-semibold pt-1", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "h-3.5 w-3.5" }), " ", new Date(int.date).toLocaleString()] }), int.meetingUrl && (_jsxs("a", { href: int.meetingUrl, target: "_blank", rel: "noreferrer", className: "text-indigo-650 hover:underline inline-flex items-center gap-0.5 font-bold", children: [_jsx(Video, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Video lobby link" })] }))] })] }), _jsx("div", { className: "flex items-end justify-end shrink-0", children: _jsx(Badge, { variant: int.status === 'COMPLETED' ? 'success' : 'warning', className: "font-bold text-[9px]", children: int.status }) })] }, int._id)))) })] })) : (_jsx(Card, { className: "border border-brand-200/60 shadow-sm bg-white p-6 text-center", children: _jsxs(CardContent, { className: "space-y-3", children: [_jsx(CalendarIcon, { className: "h-8 w-8 text-brand-450 mx-auto" }), _jsx("h3", { className: "font-bold text-brand-900 text-sm", children: "Visual Calendar Mode" }), _jsxs("p", { className: "text-brand-500 text-xs max-w-sm mx-auto", children: ["Please use the ", _jsx("strong", { children: "Agenda" }), " view tab to check slotted logs or update candidate interview feedback."] })] }) }))] }));
};
export default PlacementCalendar;
