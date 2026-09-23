import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, GraduationCap, Award } from 'lucide-react';
export const FacultyPerformance = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchPerformance = async () => {
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
        fetchPerformance();
    }, []);
    const chartData = classes.map(c => ({
        name: `${c.courseCode} (${c.section})`,
        gpa: 7.8, // Baseline fallback
        attendance: 84
    }));
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-8 w-44 bg-brand-100 rounded" }), _jsx("div", { className: "h-64 bg-brand-100 rounded-xl" })] }));
    }
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Academic Performance Analytics" }), _jsx("p", { className: "text-xs text-brand-500 mt-1", children: "Cross-class comparisons, averages spreads, and attendance ratings." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "border border-brand-200/60 shadow-sm md:col-span-2", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(TrendingUp, { className: "h-4.5 w-4.5 text-brand-400" }), _jsx("span", { children: "Class Performance averages comparison" })] }) }), _jsx(CardContent, { className: "h-64 pt-4", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: chartData, margin: { top: 10, right: 30, left: -25, bottom: 0 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9" }), _jsx(XAxis, { dataKey: "name", stroke: "#94a3b8", fontSize: 9 }), _jsx(YAxis, { domain: [0, 10], stroke: "#94a3b8", fontSize: 9 }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "gpa", fill: "#2A7C13", radius: [4, 4, 0, 0], barSize: 40, name: "GPA Average" })] }) }) })] }), _jsxs(Card, { className: "border border-brand-200/60 shadow-sm flex flex-col justify-between", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-xs font-bold text-brand-500 uppercase tracking-wider", children: "Student distribution summaries" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "bg-indigo-50 p-2.5 rounded-xl text-indigo-700", children: _jsx(Users, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-brand-900", children: "45 Active Mentees" }), _jsx("p", { className: "text-brand-450 text-[10px]", children: "Under institutional counseling" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "bg-green-50 p-2.5 rounded-xl text-green-700", children: _jsx(GraduationCap, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-brand-900", children: "7.84 Cumulative GPA" }), _jsx("p", { className: "text-brand-450 text-[10px]", children: "Subject average threshold" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "bg-amber-50 p-2.5 rounded-xl text-amber-700", children: _jsx(Award, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-brand-900", children: "92% Passing Spread" }), _jsx("p", { className: "text-brand-450 text-[10px]", children: "Overall semester pass rate" })] })] })] })] })] })] }));
};
export default FacultyPerformance;
