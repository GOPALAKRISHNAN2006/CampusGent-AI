import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { FileText, Save, CheckCircle, AlertCircle } from 'lucide-react';
export const FacultyMarks = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [assessments, setAssessments] = useState([]);
    const [selectedAssessment, setSelectedAssessment] = useState('');
    const [students, setStudents] = useState([]);
    // Marks record map studentId -> { marksObtained: number, remarks: string }
    const [marksMap, setMarksMap] = useState({});
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
                setError('Failed to fetch assigned classes');
            }
            finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);
    // Fetch assessments and load students when class changes
    useEffect(() => {
        const fetchClassAssessments = async () => {
            if (selectedClass) {
                try {
                    const res = await apiClient.get(`/faculty/assessments?classId=${selectedClass}`);
                    setAssessments(res.data.data || []);
                    if (res.data.data?.length > 0) {
                        setSelectedAssessment(res.data.data[0]._id);
                    }
                    else {
                        setSelectedAssessment('');
                    }
                    const cls = classes.find(c => c._id === selectedClass);
                    if (cls) {
                        setStudents(cls.students || []);
                        // Initialize marks map to 0
                        const initialMap = {};
                        (cls.students || []).forEach((s) => {
                            initialMap[s._id] = { marksObtained: 0, remarks: '' };
                        });
                        setMarksMap(initialMap);
                    }
                }
                catch (err) {
                    console.error(err);
                }
            }
        };
        fetchClassAssessments();
    }, [selectedClass, classes]);
    // Load existing marks if they exist
    useEffect(() => {
        const fetchExistingMarks = async () => {
            if (selectedAssessment) {
                try {
                    const res = await apiClient.get(`/faculty/marks?assessmentId=${selectedAssessment}`);
                    if (res.data.data?.length > 0) {
                        const loadedMap = {};
                        // Start with defaults
                        students.forEach(s => {
                            loadedMap[s._id] = { marksObtained: 0, remarks: '' };
                        });
                        // Overwrite with existing marks
                        (res.data.data || []).forEach((m) => {
                            if (m.student?._id) {
                                loadedMap[m.student._id] = {
                                    marksObtained: m.marksObtained,
                                    remarks: m.remarks || ''
                                };
                            }
                        });
                        setMarksMap(loadedMap);
                    }
                }
                catch (err) {
                    console.error(err);
                }
            }
        };
        fetchExistingMarks();
    }, [selectedAssessment, students]);
    const handleScoreChange = (studentId, score) => {
        const assessment = assessments.find(a => a._id === selectedAssessment);
        const maxScore = assessment?.totalMarks || 100;
        // Validate marks limits
        const marksObtained = Math.max(0, Math.min(maxScore, score));
        setMarksMap(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                marksObtained
            }
        }));
    };
    const handleRemarksChange = (studentId, remarks) => {
        setMarksMap(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                remarks
            }
        }));
    };
    const handleSubmitMarks = async () => {
        if (!selectedAssessment) {
            setError('Please select an assessment to record marks.');
            return;
        }
        setSaving(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const marks = Object.entries(marksMap).map(([student, details]) => ({
                student,
                marksObtained: details.marksObtained,
                remarks: details.remarks
            }));
            await apiClient.post('/faculty/marks', {
                assessmentId: selectedAssessment,
                marks
            });
            setSuccessMessage('Student marks spreadsheet recorded and published.');
            setTimeout(() => setSuccessMessage(null), 3000);
        }
        catch (err) {
            setError(err.response?.data?.message || 'Failed to publish student scores.');
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-8 w-44 bg-brand-100 rounded" }), _jsx("div", { className: "h-44 bg-brand-100 rounded-xl" })] }));
    }
    const currentAssessment = assessments.find(a => a._id === selectedAssessment);
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Record Student Marks" }), _jsx("p", { className: "text-xs text-brand-500 mt-1", children: "Select class, configure assessments, and enter marks in a spreadsheet-like structure." })] }), _jsxs("div", { className: "bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-[10px] font-bold text-brand-450 uppercase", children: "Select assigned class" }), _jsx("select", { value: selectedClass, onChange: (e) => setSelectedClass(e.target.value), className: "text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700 h-10", children: classes.map((c) => (_jsxs("option", { value: c._id, children: [c.courseCode, " - ", c.subjectName, " (", c.section, ")"] }, c._id))) })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-[10px] font-bold text-brand-450 uppercase", children: "Select assessment" }), _jsx("select", { value: selectedAssessment, onChange: (e) => setSelectedAssessment(e.target.value), className: "text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700 h-10", children: assessments.length === 0 ? (_jsx("option", { value: "", children: "No assessments published" })) : (assessments.map((a) => (_jsxs("option", { value: a._id, children: [a.title, " (", a.totalMarks, " Marks)"] }, a._id)))) })] })] }), error && (_jsxs("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg flex items-center gap-2", children: [_jsx(AlertCircle, { className: "h-4 w-4 shrink-0" }), _jsx("span", { children: error })] })), successMessage && (_jsxs("div", { className: "p-3 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-lg flex items-center gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4 shrink-0" }), _jsx("span", { children: successMessage })] })), selectedAssessment ? (_jsxs(Card, { className: "border border-brand-200/60 shadow-sm overflow-hidden", children: [_jsxs(CardHeader, { className: "pb-3 border-b border-brand-50 flex flex-row items-center justify-between", children: [_jsxs(CardTitle, { className: "text-xs font-bold text-brand-500 uppercase tracking-wider", children: ["Grading ledger sheet (", students.length, " students enrolled)"] }), _jsx(Badge, { variant: currentAssessment?.status === 'COMPLETED' ? 'success' : 'warning', children: currentAssessment?.status === 'COMPLETED' ? 'Published' : 'Draft' })] }), _jsx(CardContent, { className: "p-0 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-brand-50 border-b border-brand-200 text-xs font-semibold text-brand-600 uppercase", children: [_jsx("th", { className: "px-6 py-3", children: "Student Name" }), _jsx("th", { className: "px-6 py-3", children: "Roll Number" }), _jsxs("th", { className: "px-6 py-3", children: ["Score (Max: ", currentAssessment?.totalMarks || 100, ")"] }), _jsx("th", { className: "px-6 py-3", children: "Performance remarks" })] }) }), _jsx("tbody", { className: "divide-y divide-brand-100 text-xs text-brand-800", children: students.map((s) => {
                                        const record = marksMap[s._id] || { marksObtained: 0, remarks: '' };
                                        return (_jsxs("tr", { className: "hover:bg-brand-50/50", children: [_jsx("td", { className: "px-6 py-4 font-semibold text-brand-900", children: s.user?.name || 'Mentee' }), _jsx("td", { className: "px-6 py-4", children: s.rollNumber }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "number", value: record.marksObtained, onChange: (e) => handleScoreChange(s._id, Number(e.target.value)), className: "w-20 text-xs border border-brand-200 rounded-lg p-1.5 outline-none focus:border-indigo-500 bg-white font-bold text-brand-900" }), _jsxs("span", { className: "text-brand-450 font-bold", children: ["/ ", currentAssessment?.totalMarks || 100] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("input", { type: "text", value: record.remarks, onChange: (e) => handleRemarksChange(s._id, e.target.value), placeholder: "e.g. Good performance", className: "w-full text-xs border border-brand-200 rounded-lg p-1.5 outline-none focus:border-indigo-500 bg-white text-brand-850" }) })] }, s._id));
                                    }) })] }) })] })) : (_jsxs(Card, { className: "p-8 text-center text-brand-450 border border-brand-200/60 shadow-sm", children: [_jsx(FileText, { className: "h-8 w-8 mx-auto text-brand-300 mb-2" }), _jsx("p", { className: "font-bold", children: "No active assessments registered for this course section." })] })), selectedAssessment && students.length > 0 && (_jsx("div", { className: "flex justify-end pt-2", children: _jsxs(Button, { onClick: handleSubmitMarks, isLoading: saving, className: "bg-indigo-650 hover:bg-indigo-700 text-white text-xs px-6 py-2.5 font-bold h-10 rounded-xl shadow-sm flex items-center gap-1.5", children: [_jsx(Save, { className: "h-4 w-4" }), _jsx("span", { children: "Publish Marks Sheet" })] }) }))] }));
};
export default FacultyMarks;
