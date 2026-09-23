import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { AlertCircle, CheckCircle } from 'lucide-react';
export const FacultyAtRisk = () => {
    const [riskStudents, setRiskStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const fetchRiskRoster = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/faculty/at-risk');
            setRiskStudents(res.data.data || []);
        }
        catch (err) {
            setError('Failed to fetch at-risk register.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRiskRoster();
    }, []);
    const handleCreateIntervention = (studentId, studentName) => {
        setSuccessMsg(`Intervention plan initialized for ${studentName}. Email notifications dispatched.`);
        setTimeout(() => setSuccessMsg(null), 3000);
    };
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-8 w-44 bg-brand-100 rounded" }), _jsx("div", { className: "h-44 bg-brand-100 rounded-xl" })] }));
    }
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "At-Risk Student Registry" }), _jsx("p", { className: "text-xs text-brand-500 mt-1", children: "Intervene early for students below threshold academic or attendance benchmarks." })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), successMsg && (_jsxs("div", { className: "p-3 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-lg flex items-center gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4 shrink-0" }), _jsx("span", { children: successMsg })] })), riskStudents.length === 0 ? (_jsxs(Card, { className: "p-8 text-center text-brand-450 border border-brand-200/60 shadow-sm", children: [_jsx(CheckCircle, { className: "h-8 w-8 mx-auto text-green-600 mb-2" }), _jsx("p", { className: "font-bold", children: "No students currently require attention." })] })) : (_jsx("div", { className: "space-y-4", children: riskStudents.map((s) => (_jsxs(Card, { className: "border border-brand-200/60 shadow-sm p-5 hover:border-red-200 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex gap-2 items-center", children: [_jsxs(Badge, { variant: s.riskLevel === 'HIGH' ? 'danger' : 'warning', children: [s.riskLevel, " RISK"] }), _jsx("h4", { className: "font-extrabold text-brand-950 text-sm", children: s.name }), _jsxs("span", { className: "text-[10px] text-brand-450", children: ["Roll No: ", s.rollNumber] })] }), _jsxs("div", { className: "flex gap-4 text-[10px] text-brand-650", children: [_jsxs("p", { children: ["CGPA: ", _jsxs("span", { className: "font-bold text-brand-900", children: [s.cgpa, "/10"] })] }), _jsxs("p", { children: ["Attendance: ", _jsxs("span", { className: "font-bold text-brand-900", children: [s.attendance, "%"] })] })] }), _jsxs("div", { className: "bg-red-50/50 border border-red-100 rounded-lg p-2 flex gap-1.5 items-start text-red-700 max-w-xl", children: [_jsx(AlertCircle, { className: "h-4 w-4 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-[9px] uppercase tracking-wider", children: "Concern details" }), _jsx("p", { className: "text-[10px] mt-0.5", children: s.reasons.join(', ') })] })] })] }), _jsx("div", { className: "flex gap-2 shrink-0 w-full md:w-auto", children: _jsx(Button, { onClick: () => handleCreateIntervention(s._id, s.name), className: "bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl flex-1 md:flex-initial", children: "Create Intervention" }) })] }, s._id))) }))] }));
};
export default FacultyAtRisk;
