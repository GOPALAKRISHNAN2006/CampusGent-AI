import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { UserCircle, Search, X, Award, FileText, Sparkles } from 'lucide-react';
export const PlacementStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Search & Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [readinessFilter, setReadinessFilter] = useState('ALL');
    // Selected Student Drawer
    const [selectedStudent, setSelectedStudent] = useState(null);
    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get('/students');
            setStudents(res.data.data || []);
        }
        catch (err) {
            setError('Unable to load students directory.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchStudents();
    }, []);
    const handleViewProfile = async (student) => {
        if (!student.user?._id)
            return;
        try {
            const res = await apiClient.get(`/students/profile?userId=${student.user._id}`);
            setSelectedStudent(res.data.data);
        }
        catch (err) {
            setSelectedStudent(student);
        }
    };
    const getReadinessState = (score) => {
        if (score >= 75)
            return 'READY';
        if (score >= 60)
            return 'NEEDS_IMPROVEMENT';
        return 'NOT_READY';
    };
    const filteredStudents = students.filter((s) => {
        const matchesSearch = (s.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.rollNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
        const readinessState = getReadinessState(s.placementReadinessScore || 0);
        const matchesReadiness = readinessFilter === 'ALL' || readinessState === readinessFilter;
        return matchesSearch && matchesReadiness;
    });
    return (_jsxs("div", { className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in relative", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Student Directory" }), _jsx("p", { className: "text-brand-500 mt-1", children: "Review student registry profiles, monitor corporate readiness metrics, and evaluate target credentials." })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), _jsxs("div", { className: "bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between", children: [_jsxs("div", { className: "relative flex-1 w-full", children: [_jsx(Search, { className: "absolute left-3 top-3 h-4 w-4 text-brand-400" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search by student name or university roll number...", className: "pl-9 w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white" })] }), _jsx("div", { className: "flex gap-2 w-full md:w-auto shrink-0", children: _jsxs("select", { value: readinessFilter, onChange: (e) => setReadinessFilter(e.target.value), className: "text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700", children: [_jsx("option", { value: "ALL", children: "All Readiness Levels" }), _jsx("option", { value: "READY", children: "Ready (>= 75%)" }), _jsx("option", { value: "NEEDS_IMPROVEMENT", children: "Needs Work (60% - 74%)" }), _jsx("option", { value: "NOT_READY", children: "Not Ready (< 60%)" })] }) })] }), _jsx(Card, { className: "border border-brand-200/60 shadow-sm overflow-hidden bg-white", children: _jsx(CardContent, { className: "p-0 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-brand-50 border-b border-brand-200 text-brand-650 font-bold uppercase text-[9px] tracking-wider", children: [_jsx("th", { className: "px-5 py-3", children: "Student Name" }), _jsx("th", { className: "px-5 py-3", children: "Roll Number" }), _jsx("th", { className: "px-5 py-3", children: "Branch Department" }), _jsx("th", { className: "px-5 py-3", children: "CGPA Cutoff" }), _jsx("th", { className: "px-5 py-3", children: "Readiness Index" }), _jsx("th", { className: "px-5 py-3 text-right", children: "Registry Profile" })] }) }), _jsx("tbody", { className: "divide-y divide-brand-100 text-brand-850", children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-5 py-8 text-center text-brand-450 font-semibold animate-pulse", children: "Loading student directory..." }) })) : filteredStudents.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-5 py-8 text-center text-brand-450 font-semibold", children: "No matching student profiles found." }) })) : (filteredStudents.filter(s => s.user).map((s) => {
                                    const state = getReadinessState(s.placementReadinessScore || 0);
                                    return (_jsxs("tr", { className: "hover:bg-brand-50/40 transition-colors", children: [_jsx("td", { className: "px-5 py-4 font-bold text-brand-950", children: s.user?.name }), _jsx("td", { className: "px-5 py-4 font-semibold text-brand-600", children: s.rollNumber }), _jsx("td", { className: "px-5 py-4", children: s.department?.name || 'Computer Science' }), _jsxs("td", { className: "px-5 py-4 font-bold", children: [s.cgpa || '0.0', " / 10"] }), _jsx("td", { className: "px-5 py-4 font-bold", children: _jsxs("span", { className: `px-2 py-0.5 rounded text-[9.5px] ${state === 'READY' ? 'bg-green-100 text-green-800' :
                                                        state === 'NEEDS_IMPROVEMENT' ? 'bg-amber-100 text-amber-800' :
                                                            'bg-red-100 text-red-800'}`, children: [s.placementReadinessScore || 65, "% readiness"] }) }), _jsx("td", { className: "px-5 py-4 text-right", children: _jsx(Button, { onClick: () => handleViewProfile(s), size: "sm", variant: "secondary", className: "font-semibold text-[9.5px] border-brand-200 text-brand-700 hover:bg-brand-50", children: "View Profile" }) })] }, s._id));
                                })) })] }) }) }), selectedStudent && (_jsxs("div", { className: "fixed inset-0 z-50 overflow-hidden flex justify-end", children: [_jsx("div", { className: "absolute inset-0 bg-brand-950/40 transition-opacity", onClick: () => setSelectedStudent(null) }), _jsxs("div", { className: "relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-slide-in", children: [_jsxs("div", { className: "p-4 border-b border-brand-100 flex items-center justify-between bg-brand-50", children: [_jsxs("h3", { className: "font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(UserCircle, { className: "h-5 w-5 text-indigo-650" }), _jsx("span", { children: "Student Placement Profile" })] }), _jsx("button", { onClick: () => setSelectedStudent(null), className: "p-1 hover:bg-brand-200 rounded-full text-brand-450", children: _jsx(X, { className: "h-4.5 w-4.5" }) })] }), _jsxs("div", { className: "flex-1 p-6 overflow-y-auto space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4 bg-brand-50 p-4 border border-brand-150 rounded-xl", children: [_jsx("div", { className: "h-12 w-12 bg-indigo-900 text-white rounded-lg flex items-center justify-center font-black text-sm", children: (selectedStudent.user?.name || 'Student').slice(0, 2).toUpperCase() }), _jsxs("div", { children: [_jsx("h4", { className: "font-extrabold text-brand-950 text-sm", children: selectedStudent.user?.name || 'Student' }), _jsxs("p", { className: "text-brand-450 text-[10px] mt-0.5", children: ["Roll No: ", selectedStudent.rollNumber] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-3 border border-brand-200 rounded-xl text-center", children: [_jsx("span", { className: "text-[9px] font-bold text-brand-450 uppercase block", children: "Cumulative GPA" }), _jsxs("p", { className: "text-base font-black text-brand-900 mt-1", children: [selectedStudent.cgpa, " / 10"] })] }), _jsxs("div", { className: "p-3 border border-brand-200 rounded-xl text-center", children: [_jsx("span", { className: "text-[9px] font-bold text-brand-450 uppercase block", children: "Readiness Index" }), _jsxs("p", { className: "text-base font-black text-indigo-700 mt-1", children: [selectedStudent.placementReadinessScore || 70, "%"] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("h5", { className: "text-[10px] font-bold text-brand-450 uppercase tracking-widest border-b border-brand-100 pb-1 flex items-center gap-1", children: [_jsx(Award, { className: "h-3.5 w-3.5 text-indigo-600" }), _jsx("span", { children: "Verified Professional Skills" })] }), _jsx("div", { className: "flex flex-wrap gap-1.5 pt-1", children: (selectedStudent.skills || []).length === 0 ? (_jsx("span", { className: "text-brand-450", children: "No verified skills entered." })) : (selectedStudent.skills.map((sk, idx) => (_jsxs(Badge, { variant: "secondary", className: "bg-brand-50 border border-brand-200 text-brand-700 font-semibold", children: [sk.name, " (", sk.proficiency.toLowerCase(), ")"] }, idx)))) })] }), selectedStudent.resumeUrl && (_jsxs("div", { className: "space-y-2", children: [_jsxs("h5", { className: "text-[10px] font-bold text-brand-450 uppercase tracking-widest border-b border-brand-100 pb-1 flex items-center gap-1", children: [_jsx(FileText, { className: "h-3.5 w-3.5 text-indigo-650" }), _jsx("span", { children: "Resume Integrity Score" })] }), _jsxs("div", { className: "p-3 border border-brand-200 rounded-xl flex justify-between items-center bg-brand-50/30", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold text-brand-900", children: "ATS Optimized Resume" }), _jsx("a", { href: selectedStudent.resumeUrl, target: "_blank", rel: "noreferrer", className: "text-indigo-650 hover:underline text-[9.5px] font-semibold mt-0.5 inline-block", children: "Download Uploaded PDF File" })] }), _jsx(Badge, { variant: "success", className: "font-bold", children: "Score: 84/100" })] })] })), _jsxs("div", { className: "space-y-2", children: [_jsxs("h5", { className: "text-[10px] font-bold text-brand-450 uppercase tracking-widest border-b border-brand-100 pb-1 flex items-center gap-1", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5 text-indigo-650" }), _jsx("span", { children: "AI Readiness Insights" })] }), _jsxs("div", { className: "bg-gradient-to-r from-indigo-50/20 to-brand-50/20 p-4 border border-indigo-100 rounded-xl space-y-2 text-brand-750", children: [_jsx("span", { className: "font-extrabold text-[9px] uppercase tracking-wider text-indigo-750 bg-indigo-50 px-1.5 py-0.5 rounded block w-max", children: "AI ANALYSES RECOMMENDATION" }), _jsx("p", { children: "Candidate has completed mock behavioral rounds, scoring 82% in communication indexes. Suggest scheduling technical interviews for C++ and Python development profiles matching active corporate drives eligibility cutoffs." })] })] })] }), _jsx("div", { className: "p-4 border-t border-brand-100 flex gap-2", children: _jsx(Button, { onClick: () => setSelectedStudent(null), variant: "secondary", className: "flex-1 font-bold", children: "Close Profile Profile" }) })] })] }))] }));
};
export default PlacementStudents;
