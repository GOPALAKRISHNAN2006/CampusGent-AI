import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { CheckCircle, AlertCircle } from 'lucide-react';
export const FacultyAttendance = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    // Local attendance status mapping studentId -> PRESENT | ABSENT | LATE
    const [attendanceMap, setAttendanceMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get('/faculty/classes');
                setClasses(res.data.data || []);
                if (res.data.data?.length > 0) {
                    setSelectedClass(res.data.data[0]._id);
                }
            }
            catch (err) {
                setError('Failed to fetch assigned classes.');
            }
            finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);
    // Update students roster when class selection updates
    useEffect(() => {
        if (selectedClass) {
            const cls = classes.find(c => c._id === selectedClass);
            if (cls) {
                setStudents(cls.students || []);
                // Initialize all student records to PRESENT by default
                const initialMap = {};
                (cls.students || []).forEach((s) => {
                    initialMap[s._id] = 'PRESENT';
                });
                setAttendanceMap(initialMap);
            }
        }
    }, [selectedClass, classes]);
    const toggleStatus = (studentId, status) => {
        setAttendanceMap(prev => ({
            ...prev,
            [studentId]: status
        }));
    };
    const handleSubmitAttendance = async () => {
        setSaving(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const records = Object.entries(attendanceMap).map(([student, status]) => ({
                student,
                status
            }));
            await apiClient.post('/faculty/attendance', {
                classId: selectedClass,
                date,
                records
            });
            setSuccessMessage('Attendance register logged successfully.');
            setTimeout(() => setSuccessMessage(null), 3000);
        }
        catch (err) {
            setError(err.response?.data?.message || 'Failed to submit attendance');
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-8 w-44 bg-brand-100 rounded" }), _jsx("div", { className: "h-44 bg-brand-100 rounded-xl" })] }));
    }
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Mark Student Attendance" }), _jsx("p", { className: "text-xs text-brand-500 mt-1", children: "Select class, configure dates, and toggle student presence registers." })] }), _jsxs("div", { className: "bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-[10px] font-bold text-brand-450 uppercase", children: "Target class & section" }), _jsx("select", { value: selectedClass, onChange: (e) => setSelectedClass(e.target.value), className: "text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700 h-10", children: classes.map((c) => (_jsxs("option", { value: c._id, children: [c.courseCode, " - ", c.subjectName, " (", c.section, ")"] }, c._id))) })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-[10px] font-bold text-brand-450 uppercase", children: "Session date" }), _jsx("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: "text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700 h-10" })] })] }), error && (_jsxs("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg flex items-center gap-2", children: [_jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }), _jsx("span", { children: error })] })), successMessage && (_jsxs("div", { className: "p-3 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-lg flex items-center gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4 shrink-0" }), _jsx("span", { children: successMessage })] })), _jsxs(Card, { className: "border border-brand-200/60 shadow-sm overflow-hidden", children: [_jsxs(CardHeader, { className: "pb-3 border-b border-brand-50 flex flex-row items-center justify-between", children: [_jsxs(CardTitle, { className: "text-xs font-bold text-brand-500 uppercase tracking-wider", children: ["Roster checklist (", students.length, " students)"] }), _jsx("div", { className: "flex gap-2", children: _jsx(Button, { size: "sm", variant: "secondary", onClick: () => {
                                        const updated = {};
                                        students.forEach(s => { updated[s._id] = 'PRESENT'; });
                                        setAttendanceMap(updated);
                                    }, className: "text-[9px] border-brand-200 text-brand-650 font-bold hover:bg-brand-50", children: "Mark All Present" }) })] }), _jsx(CardContent, { className: "p-0 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-brand-50 border-b border-brand-200 text-xs font-semibold text-brand-600 uppercase", children: [_jsx("th", { className: "px-6 py-3", children: "Student Name" }), _jsx("th", { className: "px-6 py-3", children: "Roll Number" }), _jsx("th", { className: "px-6 py-3", children: "Eligibility Index" }), _jsx("th", { className: "px-6 py-3 text-right", children: "Attendance Action" })] }) }), _jsx("tbody", { className: "divide-y divide-brand-100 text-xs text-brand-800", children: students.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-6 py-8 text-center text-brand-450", children: "No students enrolled in this section." }) })) : (students.map((s) => {
                                        const status = attendanceMap[s._id] || 'PRESENT';
                                        return (_jsxs("tr", { className: "hover:bg-brand-50/50", children: [_jsx("td", { className: "px-6 py-4 font-semibold text-brand-900", children: s.user?.name || 'Mentee' }), _jsx("td", { className: "px-6 py-4", children: s.rollNumber }), _jsx("td", { className: "px-6 py-4", children: _jsx(Badge, { variant: s.cgpa < 6.0 ? 'warning' : 'success', children: s.cgpa < 6.0 ? 'At Warning Risks' : 'Eligible' }) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsxs("div", { className: "inline-flex rounded-lg border border-brand-200 overflow-hidden h-8", children: [_jsx("button", { onClick: () => toggleStatus(s._id, 'PRESENT'), className: `px-3 py-1 font-bold text-[10px] transition-colors border-r border-brand-200 ${status === 'PRESENT'
                                                                    ? 'bg-green-600 text-white'
                                                                    : 'bg-white hover:bg-brand-50 text-brand-700'}`, children: "Present" }), _jsx("button", { onClick: () => toggleStatus(s._id, 'LATE'), className: `px-3 py-1 font-bold text-[10px] transition-colors border-r border-brand-200 ${status === 'LATE'
                                                                    ? 'bg-amber-500 text-white'
                                                                    : 'bg-white hover:bg-brand-50 text-brand-700'}`, children: "Late" }), _jsx("button", { onClick: () => toggleStatus(s._id, 'ABSENT'), className: `px-3 py-1 font-bold text-[10px] transition-colors ${status === 'ABSENT'
                                                                    ? 'bg-red-650 text-white'
                                                                    : 'bg-white hover:bg-brand-50 text-brand-700'}`, children: "Absent" })] }) })] }, s._id));
                                    })) })] }) })] }), students.length > 0 && (_jsx("div", { className: "flex justify-end pt-2", children: _jsx(Button, { onClick: handleSubmitAttendance, isLoading: saving, className: "bg-indigo-650 hover:bg-indigo-700 text-white text-xs px-6 py-2.5 font-bold h-10 rounded-xl shadow-sm", children: "Submit attendance logs" }) }))] }));
};
export default FacultyAttendance;
