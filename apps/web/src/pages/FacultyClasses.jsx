import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { apiClient } from '../api/client.js';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock, ArrowRight, GraduationCap } from 'lucide-react';
export const FacultyClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get('/faculty/classes');
                setClasses(res.data.data || []);
            }
            catch (err) {
                setError('Failed to load classes.');
            }
            finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-8 w-48 bg-brand-100 rounded" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx("div", { className: "h-48 bg-brand-100 rounded-xl" }), _jsx("div", { className: "h-48 bg-brand-100 rounded-xl" }), _jsx("div", { className: "h-48 bg-brand-100 rounded-xl" })] })] }));
    }
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Assigned Courses & Classes" }), _jsx("p", { className: "text-xs text-brand-500 mt-1", children: "Manage sections, schedules, student rosters, and assessments." })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), classes.length === 0 ? (_jsxs(Card, { className: "p-8 text-center text-brand-450 border border-brand-200/60 shadow-sm", children: [_jsx(BookOpen, { className: "h-8 w-8 mx-auto text-brand-300 mb-2" }), _jsx("p", { className: "font-bold", children: "No classes are assigned to you yet." })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: classes.map((c) => (_jsxs(Card, { className: "border border-brand-200/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between", children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsx("span", { className: "text-[9px] font-bold text-indigo-650 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded w-fit", children: c.courseCode }), _jsx(CardTitle, { className: "text-sm font-bold text-brand-950 mt-1", children: c.subjectName }), _jsxs("p", { className: "text-[10px] text-brand-500 mt-0.5", children: [c.section, " \u2022 Semester ", c.semester] })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-2 text-[10px] border-y border-brand-50 py-3 my-1", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-brand-650", children: [_jsx(Users, { className: "h-4 w-4 text-brand-400 shrink-0" }), _jsxs("span", { children: [c.students?.length || 0, " Students"] })] }), _jsxs("div", { className: "flex items-center gap-1.5 text-brand-650", children: [_jsx(GraduationCap, { className: "h-4 w-4 text-brand-400 shrink-0" }), _jsx("span", { children: "Avg GPA: 7.8" })] })] }), _jsxs("div", { className: "space-y-1 bg-brand-50/40 p-2.5 rounded-lg border border-brand-100", children: [_jsxs("span", { className: "text-[9px] font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1", children: [_jsx(Clock, { className: "h-3 w-3" }), _jsx("span", { children: "Schedule timetable" })] }), _jsx("div", { className: "text-[10px] text-brand-700 font-semibold space-y-0.5", children: c.timetable.map((slot, idx) => (_jsxs("p", { children: [slot.day, ": ", slot.time, " (", slot.room, ")"] }, idx))) })] }), _jsx("div", { className: "pt-2 flex gap-2", children: _jsx(Link, { to: `/faculty/classes/${c._id}`, className: "flex-1", children: _jsxs(Button, { className: "w-full bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-bold flex gap-1.5 justify-center items-center py-2 h-9 rounded-lg", children: [_jsx("span", { children: "Open Workspace" }), _jsx(ArrowRight, { className: "h-3.5 w-3.5" })] }) }) })] })] }, c._id))) }))] }));
};
export default FacultyClasses;
