import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { GraduationCap, Users } from 'lucide-react';
export const FacultyCourses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get('/faculty/classes');
                setClasses(res.data.data || []);
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-8 w-44 bg-brand-100 rounded" }), _jsx("div", { className: "h-44 bg-brand-100 rounded-xl" })] }));
    }
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Assigned Courses" }), _jsx("p", { className: "text-xs text-brand-500 mt-1", children: "Review course curriculum specs, codes, and section distributions." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: classes.map((c) => (_jsxs(Card, { className: "border border-brand-200/60 shadow-sm p-4", children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsx("span", { className: "text-[9px] font-bold text-indigo-650 uppercase bg-indigo-50 px-2 py-0.5 rounded w-fit", children: c.courseCode }), _jsx(CardTitle, { className: "text-sm font-bold text-brand-950 mt-1", children: c.subjectName })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("p", { className: "text-brand-500 leading-normal", children: "Focuses on building standard coding patterns, industry workflows, and core syllabus components." }), _jsxs("div", { className: "flex gap-4 text-[10.5px] border-t border-brand-50 pt-3 text-brand-650", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Users, { className: "h-4 w-4 text-brand-400" }), _jsxs("span", { children: [c.students?.length || 0, " Enrolled"] })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(GraduationCap, { className: "h-4 w-4 text-brand-400" }), _jsx("span", { children: "Credits: 4" })] })] })] })] }, c._id))) })] }));
};
export default FacultyCourses;
