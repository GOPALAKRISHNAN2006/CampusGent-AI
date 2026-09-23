import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Clock, MapPin } from 'lucide-react';
export const FacultyTimetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get('/faculty/timetable');
                setTimetable(res.data.data || []);
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchTimetable();
    }, []);
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-8 w-44 bg-brand-100 rounded" }), _jsx("div", { className: "h-44 bg-brand-100 rounded-xl" })] }));
    }
    // Group timetable slots by day
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Teaching Timetable" }), _jsx("p", { className: "text-xs text-brand-500 mt-1", children: "Review scheduled weekly lecture hours, sections, and classroom rooms." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-6", children: days.map((day) => {
                    const slots = timetable.filter(slot => slot.day === day);
                    return (_jsxs(Card, { className: "border border-brand-200/60 shadow-sm flex flex-col h-fit", children: [_jsx(CardHeader, { className: "bg-brand-50/50 py-3 border-b border-brand-100", children: _jsx(CardTitle, { className: "text-xs font-bold text-brand-850 uppercase tracking-wider text-center", children: day }) }), _jsx(CardContent, { className: "p-3 space-y-3 flex-1", children: slots.length === 0 ? (_jsx("p", { className: "text-center text-brand-400 py-6 text-[10px]", children: "No scheduled classes" })) : (slots.map((slot, idx) => (_jsxs("div", { className: "p-2.5 border border-brand-100 rounded-lg bg-indigo-50/10 space-y-1.5 hover:border-indigo-200 transition-colors", children: [_jsx("p", { className: "font-bold text-brand-900 leading-tight", children: slot.subjectName }), _jsxs("p", { className: "text-brand-500 text-[10px]", children: [slot.courseCode, " \u2022 ", slot.section] }), _jsxs("div", { className: "flex flex-col gap-0.5 text-[9px] text-brand-450 font-bold border-t border-brand-50 pt-1.5", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "h-3 w-3 shrink-0" }), _jsx("span", { children: slot.time })] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "h-3 w-3 shrink-0" }), _jsx("span", { children: slot.room })] })] })] }, idx)))) })] }, day));
                }) })] }));
};
export default FacultyTimetable;
