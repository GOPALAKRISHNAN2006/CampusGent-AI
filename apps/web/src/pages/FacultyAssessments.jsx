import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Plus, Clock } from 'lucide-react';
export const FacultyAssessments = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // New assessment Wizard Steps states: 1 = Basic Info, 2 = Marks & Questions, 3 = Review
    const [step, setStep] = useState(1);
    const [showWizard, setShowWizard] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [totalMarks, setTotalMarks] = useState(100);
    const [questionCount, setQuestionCount] = useState(5);
    const [date, setDate] = useState('');
    const fetchClassesAndAssessments = async () => {
        try {
            setLoading(true);
            const classesRes = await apiClient.get('/faculty/classes');
            setClasses(classesRes.data.data || []);
            if (classesRes.data.data?.length > 0) {
                setSelectedClass(classesRes.data.data[0]._id);
            }
        }
        catch (err) {
            setError('Failed to fetch assigned classes.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchClassesAndAssessments();
    }, []);
    // Fetch assessments when selectedClass changes
    useEffect(() => {
        const fetchClassAssessments = async () => {
            if (selectedClass) {
                try {
                    const res = await apiClient.get(`/faculty/assessments?classId=${selectedClass}`);
                    setAssessments(res.data.data || []);
                }
                catch (err) {
                    console.error(err);
                }
            }
        };
        fetchClassAssessments();
    }, [selectedClass]);
    const handlePublishAssessment = async () => {
        try {
            await apiClient.post('/faculty/assessments', {
                classId: selectedClass,
                title,
                description,
                totalMarks,
                questionCount,
                date
            });
            // Reset wizard
            setShowWizard(false);
            setStep(1);
            setTitle('');
            setDescription('');
            setTotalMarks(100);
            setQuestionCount(5);
            setDate('');
            // Reload list
            const res = await apiClient.get(`/faculty/assessments?classId=${selectedClass}`);
            setAssessments(res.data.data || []);
        }
        catch (err) {
            alert('Failed to publish assessment');
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-8 w-44 bg-brand-100 rounded" }), _jsx("div", { className: "h-44 bg-brand-100 rounded-xl" })] }));
    }
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Assessments & Exams" }), _jsx("p", { className: "text-xs text-brand-500 mt-1", children: "Publish midterm tests, track grading status, and manage schedules." })] }), _jsxs(Button, { onClick: () => setShowWizard(!showWizard), className: "bg-indigo-650 hover:bg-indigo-700 text-white text-xs px-4 py-2 h-10 rounded-xl font-bold flex gap-1.5 items-center", children: [_jsx(Plus, { className: "h-4 w-4" }), _jsx("span", { children: "Publish New Assessment" })] })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), _jsx("div", { className: "bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between", children: _jsxs("div", { className: "flex gap-2 items-center", children: [_jsx("span", { className: "text-brand-450 font-bold text-[10px] uppercase shrink-0", children: "Filter Class:" }), _jsx("select", { value: selectedClass, onChange: (e) => setSelectedClass(e.target.value), className: "text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700 h-10", children: classes.map((c) => (_jsxs("option", { value: c._id, children: [c.courseCode, " - ", c.subjectName, " (", c.section, ")"] }, c._id))) })] }) }), showWizard && (_jsxs(Card, { className: "border border-indigo-200 bg-indigo-50/5 p-6 rounded-2xl space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-brand-100", children: [_jsx("h3", { className: "font-bold text-indigo-900 text-sm", children: "stepped Assessment Publisher" }), _jsxs("span", { className: "text-[10px] text-brand-400 font-semibold", children: ["Step ", step, " of 3"] })] }), step === 1 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[9px] font-bold uppercase tracking-wider text-brand-450 mb-1", children: "Assessment Title" }), _jsx("input", { type: "text", required: true, value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g. Mid Term Exam 1", className: "w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[9px] font-bold uppercase tracking-wider text-brand-450 mb-1", children: "Description / Syllabus Gaps" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "e.g. Covers modules 1-3, SQL normalizations joins.", className: "w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white h-20" })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx(Button, { variant: "secondary", onClick: () => setShowWizard(false), className: "text-[10px] border-brand-200", children: "Cancel" }), _jsx(Button, { onClick: () => setStep(2), className: "bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl", children: "Next Step" })] })] })), step === 2 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[9px] font-bold uppercase tracking-wider text-brand-450 mb-1", children: "Total Marks" }), _jsx("input", { type: "number", required: true, value: totalMarks, onChange: (e) => setTotalMarks(Number(e.target.value)), className: "w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[9px] font-bold uppercase tracking-wider text-brand-450 mb-1", children: "Question Count" }), _jsx("input", { type: "number", required: true, value: questionCount, onChange: (e) => setQuestionCount(Number(e.target.value)), className: "w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[9px] font-bold uppercase tracking-wider text-brand-450 mb-1", children: "Schedule Date" }), _jsx("input", { type: "date", required: true, value: date, onChange: (e) => setDate(e.target.value), className: "w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white" })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx(Button, { variant: "secondary", onClick: () => setStep(1), className: "text-[10px] border-brand-200", children: "Previous" }), _jsx(Button, { onClick: () => setStep(3), className: "bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl", children: "Next Step" })] })] })), step === 3 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 bg-brand-50 rounded-xl border border-brand-100 space-y-2", children: [_jsx("p", { className: "font-bold text-brand-900 text-sm", children: "Review published details" }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold text-brand-450", children: "Title:" }), " ", title] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold text-brand-450", children: "Description:" }), " ", description || '-'] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold text-brand-450", children: "Marks:" }), " ", totalMarks, " points (", questionCount, " questions)"] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold text-brand-450", children: "Date:" }), " ", date] })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx(Button, { variant: "secondary", onClick: () => setStep(2), className: "text-[10px] border-brand-200", children: "Previous" }), _jsx(Button, { onClick: handlePublishAssessment, className: "bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl", children: "Publish Assessment" })] })] }))] })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: assessments.length === 0 ? (_jsx("div", { className: "col-span-full py-8 text-center text-brand-450", children: "No assessments registered for this class. Click Publish New Assessment to register one." })) : (assessments.map((a) => (_jsx(Card, { className: "border border-brand-200/60 shadow-sm flex flex-col justify-between p-4", children: _jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: "text-[9px] font-bold text-brand-400 flex items-center gap-1", children: [_jsx(Clock, { className: "h-3 w-3" }), _jsxs("span", { children: ["Scheduled ", new Date(a.date).toLocaleDateString()] })] }), _jsx(Badge, { variant: a.status === 'COMPLETED' ? 'success' : 'warning', children: a.status })] }), _jsx("h4", { className: "font-bold text-brand-900 text-sm", children: a.title }), _jsx("p", { className: "text-brand-650 leading-relaxed text-[10.5px]", children: a.description || 'No syllabus context provided.' }), _jsxs("p", { className: "text-brand-500 font-bold text-[10px]", children: [a.totalMarks, " Points \u2022 ", a.questionCount, " Questions"] })] }) }, a._id)))) })] }));
};
export default FacultyAssessments;
