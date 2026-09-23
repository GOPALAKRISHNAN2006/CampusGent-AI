import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../components/ui/Card.jsx';
import { Calendar } from 'lucide-react';
export const FacultyCalendar = () => {
    const events = [
        { title: "Mid-Term Examinations Prep", date: "Sept 10, 2026", type: "Exam" },
        { title: "Syllabus Review Submission Deadline", date: "Sept 18, 2026", type: "Academic" },
        { title: "National Education Day Holiday", date: "Oct 02, 2026", type: "Holiday" },
        { title: "Course Feedback Audits", date: "Oct 15, 2026", type: "System" }
    ];
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-xl font-bold text-brand-900 flex items-center gap-1.5", children: [_jsx(Calendar, { className: "h-5.5 w-5.5 text-brand-500" }), _jsx("span", { children: "Academic Calendar" })] }), _jsx("p", { className: "text-xs text-brand-500 mt-1", children: "Check scheduled institution term exam windows, events, and holidays." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: events.map((e, idx) => (_jsx(Card, { className: "border border-brand-200/60 shadow-sm p-4 hover:border-indigo-150 transition-colors flex items-center justify-between", children: _jsxs("div", { className: "space-y-1", children: [_jsx("span", { className: "text-[9px] font-bold text-brand-450 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded w-fit", children: e.type }), _jsx("h4", { className: "font-extrabold text-brand-950 text-xs mt-1", children: e.title }), _jsx("p", { className: "text-brand-500 text-[10px]", children: e.date })] }) }, idx))) })] }));
};
export default FacultyCalendar;
