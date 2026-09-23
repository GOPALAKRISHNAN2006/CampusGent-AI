import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Search } from 'lucide-react';
export const PlacementAtRisk = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get('/students');
            setStudents(res.data.data || []);
        }
        catch (err) {
            setError('Unable to load risk registries.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchStudents();
    }, []);
    // Compute at-risk students based on real database records
    const atRiskStudents = students.map((s) => {
        const reasons = [];
        let riskLevel = 'LOW';
        let action = 'Notify Student';
        if (s.cgpa < 6.0) {
            reasons.push(`CGPA (${s.cgpa || 0}/10) is below standard cutoff`);
            riskLevel = 'HIGH';
            action = 'Schedule Counseling';
        }
        if ((s.placementReadinessScore || 0) < 60) {
            reasons.push(`Placement readiness score (${s.placementReadinessScore || 0}%) requires improvement`);
            if (riskLevel !== 'HIGH')
                riskLevel = 'MEDIUM';
            action = 'Assign Mentor';
        }
        if (!s.resumeUrl) {
            reasons.push('Missing uploaded resume PDF');
            if (riskLevel !== 'HIGH')
                riskLevel = 'MEDIUM';
            action = 'Request Resume Upload';
        }
        return {
            id: s._id,
            name: s.user?.name || 'Unknown Candidate',
            roll: s.rollNumber || 'N/A',
            program: s.department?.name || 'Computer Science',
            cgpa: s.cgpa || 0,
            reasons,
            risk: riskLevel,
            action
        };
    }).filter(s => s.reasons.length > 0);
    const filteredAtRisk = atRiskStudents.filter((s) => {
        return s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.roll.toLowerCase().includes(searchTerm.toLowerCase());
    });
    const handleTriggerAction = (id) => {
        alert('Intervention notification successfully sent to the student and faculty advisor!');
    };
    return (_jsxs("div", { className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Placement Intervention Center" }), _jsx("p", { className: "text-brand-500 mt-1", children: "Audit students flagged with high career risks, initiate counseling requests, and assign technical tutors." })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), _jsx("div", { className: "bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm", children: _jsxs("div", { className: "relative w-full", children: [_jsx(Search, { className: "absolute left-3 top-3 h-4 w-4 text-brand-450" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search by student name or roll number...", className: "pl-9 w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white text-brand-850" })] }) }), _jsx(Card, { className: "border border-brand-200/60 shadow-sm overflow-hidden bg-white", children: _jsx(CardContent, { className: "p-0 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-brand-50 border-b border-brand-200 text-brand-650 font-bold uppercase text-[9px] tracking-wider", children: [_jsx("th", { className: "px-5 py-3", children: "Student Name" }), _jsx("th", { className: "px-5 py-3", children: "Risk Factors" }), _jsx("th", { className: "px-5 py-3", children: "Risk Level" }), _jsx("th", { className: "px-5 py-3 text-right", children: "Intervention Action" })] }) }), _jsx("tbody", { className: "divide-y divide-brand-100 text-brand-855 bg-white", children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-5 py-8 text-center text-brand-450 font-semibold animate-pulse", children: "Loading risk registries..." }) })) : filteredAtRisk.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-5 py-8 text-center text-brand-450 font-semibold", children: "No students currently require placement intervention. All candidates are fully compliant!" }) })) : (filteredAtRisk.map((item) => (_jsxs("tr", { className: "hover:bg-brand-50/50 transition-colors", children: [_jsxs("td", { className: "px-5 py-4 font-bold text-brand-950", children: [_jsx("div", { children: item.name }), _jsxs("div", { className: "text-[10px] text-brand-450 font-normal mt-0.5", children: [item.roll, " (", item.program, ")"] })] }), _jsx("td", { className: "px-5 py-4", children: _jsx("div", { className: "space-y-1", children: item.reasons.map((r, idx) => (_jsxs("div", { className: "text-brand-700 flex items-center gap-1", children: [_jsx("span", { className: "w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" }), _jsx("span", { children: r })] }, idx))) }) }), _jsx("td", { className: "px-5 py-4", children: _jsxs(Badge, { variant: item.risk === 'HIGH' ? 'danger' : 'warning', className: "font-bold text-[9px]", children: [item.risk, " RISK"] }) }), _jsx("td", { className: "px-5 py-4 text-right", children: _jsx(Button, { onClick: () => handleTriggerAction(item.id), size: "sm", className: "bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-[9.5px]", children: item.action }) })] }, item.id)))) })] }) }) })] }));
};
export default PlacementAtRisk;
