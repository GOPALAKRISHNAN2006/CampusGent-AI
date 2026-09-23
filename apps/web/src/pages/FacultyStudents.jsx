import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Search, X, Users, Mail, Phone } from 'lucide-react';
export const FacultyStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Search & Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [riskFilter, setRiskFilter] = useState('ALL');
    // Selected Student Drawer State
    const [selectedStudent, setSelectedStudent] = useState(null);
    useEffect(() => {
        const fetchStudentsDirectory = async () => {
            try {
                setLoading(true);
                // We fetch from classes to extract all unique students
                const res = await apiClient.get('/faculty/classes');
                const uniqueStudentsMap = new Map();
                (res.data.data || []).forEach((c) => {
                    (c.students || []).forEach((s) => {
                        if (!uniqueStudentsMap.has(s._id)) {
                            // Add mock details for rendering compatibility
                            uniqueStudentsMap.set(s._id, {
                                ...s,
                                className: `${c.courseCode} - ${c.section}`,
                                subjectName: c.subjectName
                            });
                        }
                    });
                });
                setStudents(Array.from(uniqueStudentsMap.values()));
            }
            catch (err) {
                setError('Failed to load students roster.');
            }
            finally {
                setLoading(false);
            }
        };
        fetchStudentsDirectory();
    }, []);
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-8 w-44 bg-brand-100 rounded" }), _jsx("div", { className: "h-12 bg-brand-100 rounded-lg" })] }));
    }
    // Risk calculation helper
    const getRiskLabel = (cgpa) => {
        if (cgpa < 5.5)
            return 'HIGH';
        if (cgpa < 6.5)
            return 'MEDIUM';
        return 'NONE';
    };
    // Filter students
    const filteredStudents = students.filter((s) => {
        const matchesSearch = (s.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.rollNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
        const risk = getRiskLabel(s.cgpa);
        const matchesRisk = riskFilter === 'ALL' || risk === riskFilter;
        return matchesSearch && matchesRisk;
    });
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto text-xs animate-fade-in relative", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Student Directory" }), _jsx("p", { className: "text-xs text-brand-500 mt-1", children: "Search student roster details, analyze GPA averages, and view profiles." })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), _jsxs("div", { className: "bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between", children: [_jsxs("div", { className: "relative flex-1 w-full", children: [_jsx(Search, { className: "absolute left-3 top-3 h-4 w-4 text-brand-400" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search by student name or roll number...", className: "pl-9 w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white" })] }), _jsx("div", { className: "flex gap-2 w-full md:w-auto shrink-0", children: _jsxs("select", { value: riskFilter, onChange: (e) => setRiskFilter(e.target.value), className: "text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700", children: [_jsx("option", { value: "ALL", children: "All Risk Levels" }), _jsx("option", { value: "HIGH", children: "High Risk" }), _jsx("option", { value: "MEDIUM", children: "Medium Risk" }), _jsx("option", { value: "NONE", children: "No Risk" })] }) })] }), _jsx(Card, { className: "border border-brand-200/60 shadow-sm overflow-hidden", children: _jsx(CardContent, { className: "p-0 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-brand-50 border-b border-brand-200 text-xs font-semibold text-brand-600 uppercase", children: [_jsx("th", { className: "px-6 py-3", children: "Student Name" }), _jsx("th", { className: "px-6 py-3", children: "Roll Number" }), _jsx("th", { className: "px-6 py-3", children: "Enrolled Class" }), _jsx("th", { className: "px-6 py-3", children: "CGPA" }), _jsx("th", { className: "px-6 py-3", children: "Risk Level" }), _jsx("th", { className: "px-6 py-3 text-right", children: "Action" })] }) }), _jsx("tbody", { className: "divide-y divide-brand-100 text-xs text-brand-800", children: filteredStudents.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-8 text-center text-brand-450", children: "No matching students found." }) })) : (filteredStudents.map((s) => {
                                    const risk = getRiskLabel(s.cgpa);
                                    return (_jsxs("tr", { className: "hover:bg-brand-50/50", children: [_jsx("td", { className: "px-6 py-4 font-semibold text-brand-900", children: s.user?.name || 'Mentee' }), _jsx("td", { className: "px-6 py-4", children: s.rollNumber }), _jsxs("td", { className: "px-6 py-4", children: [s.className, " (", s.subjectName, ")"] }), _jsxs("td", { className: "px-6 py-4 font-bold", children: [s.cgpa, "/10"] }), _jsx("td", { className: "px-6 py-4", children: _jsx(Badge, { variant: risk === 'HIGH' ? 'danger' : risk === 'MEDIUM' ? 'warning' : 'success', children: risk }) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsx(Button, { onClick: () => setSelectedStudent(s), size: "sm", variant: "secondary", className: "text-[10px] font-semibold border-brand-200 text-brand-700 hover:bg-brand-50", children: "View Profile" }) })] }, s._id));
                                })) })] }) }) }), selectedStudent && (_jsxs("div", { className: "fixed inset-0 z-50 overflow-hidden flex justify-end", children: [_jsx("div", { className: "absolute inset-0 bg-brand-950/40 transition-opacity", onClick: () => setSelectedStudent(null) }), _jsxs("div", { className: "relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-slide-in", children: [_jsxs("div", { className: "p-5 border-b border-brand-100 flex items-center justify-between", children: [_jsxs("h3", { className: "text-sm font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(Users, { className: "h-4.5 w-4.5 text-indigo-650" }), _jsx("span", { children: "Student Details Profile" })] }), _jsx("button", { onClick: () => setSelectedStudent(null), className: "p-1 hover:bg-brand-50 rounded-full text-brand-450", children: _jsx(X, { className: "h-4.5 w-4.5" }) })] }), _jsxs("div", { className: "flex-1 p-6 overflow-y-auto space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4 bg-brand-50/50 p-4 border border-brand-100 rounded-xl", children: [_jsx("div", { className: "h-12 w-12 bg-indigo-900 text-white rounded-lg flex items-center justify-center font-black text-sm", children: selectedStudent.user?.name.slice(0, 2).toUpperCase() }), _jsxs("div", { children: [_jsx("h4", { className: "font-extrabold text-brand-900 text-sm", children: selectedStudent.user?.name }), _jsxs("p", { className: "text-brand-450 text-[10px] mt-0.5", children: ["Roll No: ", selectedStudent.rollNumber] })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h5", { className: "text-[10px] font-bold text-brand-400 uppercase tracking-widest border-b border-brand-100 pb-1", children: "Academic overview" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-3 border border-brand-100 rounded-xl", children: [_jsx("span", { className: "text-[9px] font-bold text-brand-450 uppercase", children: "Cumulative GPA" }), _jsxs("p", { className: "text-base font-extrabold text-brand-900 mt-0.5", children: [selectedStudent.cgpa, "/10"] })] }), _jsxs("div", { className: "p-3 border border-brand-100 rounded-xl", children: [_jsx("span", { className: "text-[9px] font-bold text-brand-450 uppercase", children: "Attendance Average" }), _jsxs("p", { className: "text-base font-extrabold text-brand-900 mt-0.5", children: [selectedStudent.placementReadinessScore || 70, "%"] })] })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h5", { className: "text-[10px] font-bold text-brand-400 uppercase tracking-widest border-b border-brand-100 pb-1", children: "Career goals & details" }), _jsxs("div", { className: "p-4 border border-brand-100 rounded-xl bg-brand-50/20 text-brand-700 leading-relaxed space-y-1", children: [_jsxs("p", { className: "font-bold text-brand-950", children: ["Target role: ", selectedStudent.careerInterests?.[0] || 'Software Engineer'] }), _jsxs("p", { className: "text-brand-500 text-[10px]", children: ["Goal details: ", selectedStudent.careerGoals?.[0] || 'Looking to work on full-stack web architectures.'] })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h5", { className: "text-[10px] font-bold text-brand-400 uppercase tracking-widest border-b border-brand-100 pb-1", children: "Contact details" }), _jsxs("div", { className: "space-y-2 text-[10.5px]", children: [_jsxs("div", { className: "flex items-center gap-2 text-brand-650", children: [_jsx(Mail, { className: "h-4 w-4 text-brand-400" }), _jsx("span", { children: selectedStudent.user?.email || 'N/A' })] }), _jsxs("div", { className: "flex items-center gap-2 text-brand-650", children: [_jsx(Phone, { className: "h-4 w-4 text-brand-400" }), _jsx("span", { children: "+91 98765 43210" })] })] })] })] }), _jsx("div", { className: "p-5 border-t border-brand-100 flex gap-2", children: _jsx(Button, { onClick: () => setSelectedStudent(null), variant: "secondary", className: "flex-1 text-[10px] border-brand-200 text-brand-700 font-bold", children: "Close Drawer" }) })] })] }))] }));
};
export default FacultyStudents;
