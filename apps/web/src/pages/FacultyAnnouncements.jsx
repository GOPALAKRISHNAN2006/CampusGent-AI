import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../components/ui/Card.jsx';
import { Bell, Info, AlertTriangle } from 'lucide-react';
export const FacultyAnnouncements = () => {
    const announcements = [
        {
            title: "End Semester Exams Time Table Release",
            date: "August 24, 2026",
            content: "The academic council has finalized dates for the upcoming term end exams. Check the timetable portal to confirm invigilation duties.",
            priority: "HIGH"
        },
        {
            title: "Faculty Feedback Surveys Launch",
            date: "August 22, 2026",
            content: "Course registration surveys are live for students. Please advise your mentees to submit feedback by next Monday.",
            priority: "MEDIUM"
        }
    ];
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-xl font-bold text-brand-900 flex items-center gap-1.5", children: [_jsx(Bell, { className: "h-5.5 w-5.5 text-brand-500" }), _jsx("span", { children: "Circulars & Announcements" })] }), _jsx("p", { className: "text-xs text-brand-500 mt-1", children: "Review official academic messages and department updates." })] }), _jsx("div", { className: "space-y-4", children: announcements.map((ann, idx) => (_jsx(Card, { className: "border border-brand-200/60 shadow-sm p-4", children: _jsxs("div", { className: "flex gap-3 items-start", children: [_jsx("div", { className: `p-2 rounded-lg shrink-0 ${ann.priority === 'HIGH' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`, children: ann.priority === 'HIGH' ? _jsx(AlertTriangle, { className: "h-4.5 w-4.5" }) : _jsx(Info, { className: "h-4.5 w-4.5" }) }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex justify-between items-start gap-4", children: [_jsx("h4", { className: "font-extrabold text-brand-950 text-xs leading-snug", children: ann.title }), _jsx("span", { className: "text-[9px] text-brand-400 font-bold shrink-0", children: ann.date })] }), _jsx("p", { className: "text-brand-650 leading-relaxed text-[11px] pt-1", children: ann.content })] })] }) }, idx))) })] }));
};
export default FacultyAnnouncements;
