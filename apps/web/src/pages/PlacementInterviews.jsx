import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Calendar as CalendarIcon, Clock, Plus, X, Video } from 'lucide-react';
export const PlacementInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Tabs: Upcoming, Completed, Today
    const [activeTab, setActiveTab] = useState('UPCOMING');
    // Schedule Interview modal state
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedJob, setSelectedJob] = useState('');
    const [schedDate, setSchedDate] = useState('');
    const [schedType, setSchedType] = useState('TECHNICAL');
    const [schedUrl, setSchedUrl] = useState('');
    // Feedback modal state
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [activeInterviewId, setActiveInterviewId] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const [interviewScore, setInterviewScore] = useState(80);
    const [interviewStatus, setInterviewStatus] = useState('COMPLETED');
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [interviewsRes, appsRes] = await Promise.all([
                apiClient.get('/jobs/all-interviews'),
                apiClient.get('/jobs/all-applications')
            ]);
            setInterviews(interviewsRes.data.data || []);
            setApplications(appsRes.data.data || []);
        }
        catch (err) {
            setError('Unable to load interviews logs.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/jobs/interviews', {
                applicationId: selectedApp,
                studentId: selectedStudent,
                jobId: selectedJob,
                date: schedDate,
                type: schedType,
                meetingUrl: schedUrl
            });
            setIsScheduleOpen(false);
            setSelectedApp('');
            setSelectedStudent('');
            setSelectedJob('');
            setSchedDate('');
            setSchedUrl('');
            fetchData();
        }
        catch (err) {
            alert(err.response?.data?.message || 'Failed to schedule interview');
        }
    };
    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.put(`/jobs/interviews/${activeInterviewId}/status`, {
                status: interviewStatus,
                feedback: feedbackText,
                score: interviewScore
            });
            setIsFeedbackOpen(false);
            setActiveInterviewId('');
            setFeedbackText('');
            setInterviewScore(80);
            fetchData();
        }
        catch (err) {
            alert('Failed to submit feedback');
        }
    };
    // Filter interviews by active tab
    const filteredInterviews = interviews.filter((int) => {
        if (activeTab === 'UPCOMING')
            return int.status === 'SCHEDULED' && new Date(int.date) > new Date();
        if (activeTab === 'COMPLETED')
            return int.status === 'COMPLETED';
        // Fallback schedule
        return int.status === 'SCHEDULED';
    });
    return (_jsxs("div", { className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Interviews Pipeline" }), _jsx("p", { className: "text-brand-500 mt-1", children: "Schedule technical or HR rounds, assign video links, and record evaluation grades." })] }), _jsxs(Button, { onClick: () => setIsScheduleOpen(true), className: "bg-indigo-650 hover:bg-indigo-700 text-white shrink-0 flex items-center gap-1.5 font-bold", children: [_jsx(Plus, { className: "h-4.5 w-4.5" }), _jsx("span", { children: "Schedule New Interview" })] })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), _jsx("div", { className: "flex border-b border-brand-200 gap-6 text-[11px] font-bold", children: [
                    { id: 'UPCOMING', label: 'Upcoming Interviews' },
                    { id: 'COMPLETED', label: 'Completed Rounds' },
                    { id: 'SCHEDULED', label: 'All Scheduled Slots' }
                ].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab.id), className: `pb-2.5 px-1 transition-colors ${activeTab === tab.id
                        ? 'border-b-2 border-indigo-600 text-indigo-650'
                        : 'text-brand-450 hover:text-brand-700'}`, children: tab.label }, tab.id))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2 space-y-4", children: loading ? (_jsx("div", { className: "space-y-4 animate-pulse", children: [1, 2].map((i) => (_jsx("div", { className: "h-28 bg-brand-100 rounded-xl border border-brand-200" }, i))) })) : filteredInterviews.length === 0 ? (_jsx(Card, { className: "text-center py-12 border border-brand-200/60 shadow-sm bg-white", children: _jsxs(CardContent, { className: "space-y-3", children: [_jsx(CalendarIcon, { className: "h-8 w-8 text-brand-400 mx-auto" }), _jsx("h3", { className: "font-bold text-brand-900 text-sm", children: "No interviews scheduled" }), _jsx("p", { className: "text-brand-500 text-xs", children: "There are no interview logs found matching the selected category." })] }) })) : (filteredInterviews.map((int) => (_jsxs("div", { className: "border border-brand-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `px-2 py-0.5 rounded font-bold text-[9px] ${int.type === 'TECHNICAL' ? 'bg-indigo-100 text-indigo-700' :
                                                        int.type === 'BEHAVIORAL' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-amber-100 text-amber-700'}`, children: int.type }), _jsx("h3", { className: "font-extrabold text-brand-950 text-[12px]", children: int.student?.name })] }), _jsxs("p", { className: "font-bold text-brand-900", children: [int.job?.companyName, " \u2014 ", _jsx("span", { className: "font-semibold text-brand-500", children: int.job?.title })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-4 text-brand-500 font-semibold pt-1", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "h-3.5 w-3.5" }), " ", new Date(int.date).toLocaleString()] }), int.meetingUrl && (_jsxs("a", { href: int.meetingUrl, target: "_blank", rel: "noreferrer", className: "text-indigo-650 hover:underline inline-flex items-center gap-0.5", children: [_jsx(Video, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Meeting Lobby" })] }))] }), int.feedback && (_jsxs("div", { className: "bg-brand-50 p-2.5 rounded-lg border border-brand-100 text-brand-700", children: [_jsxs("span", { className: "font-bold block text-[9.5px]", children: ["Evaluation Feedback (Score: ", int.score, "%):"] }), _jsxs("p", { className: "mt-0.5 italic", children: ["\"", int.feedback, "\""] })] }))] }), _jsxs("div", { className: "flex md:flex-col justify-end items-end gap-2 shrink-0", children: [_jsx(Badge, { variant: int.status === 'COMPLETED' ? 'success' : int.status === 'SCHEDULED' ? 'warning' : 'danger', className: "font-bold text-[9px]", children: int.status }), int.status === 'SCHEDULED' && (_jsx(Button, { onClick: () => {
                                                setActiveInterviewId(int._id);
                                                setIsFeedbackOpen(true);
                                            }, size: "sm", className: "bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-[9.5px] py-1.5 px-3", children: "Record Feedback" }))] })] }, int._id)))) }), _jsx("div", { className: "lg:col-span-1", children: _jsxs(Card, { className: "border border-brand-200/60 shadow-sm bg-white", children: [_jsx(CardHeader, { className: "border-b border-brand-100", children: _jsx(CardTitle, { className: "text-brand-900 font-bold", children: "Interview Slots Calendar" }) }), _jsxs(CardContent, { className: "p-4 space-y-4", children: [_jsxs("div", { className: "p-4 bg-brand-50 rounded-xl text-center border border-brand-100", children: [_jsx(CalendarIcon, { className: "h-6 w-6 text-indigo-650 mx-auto" }), _jsx("h4", { className: "font-extrabold text-brand-900 mt-2", children: "August 2026" }), _jsx("p", { className: "text-brand-450 mt-1", children: "Operational view of booked slots." })] }), _jsxs("div", { className: "grid grid-cols-7 gap-1 text-center font-bold text-brand-500 text-[10px]", children: [['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (_jsx("span", { className: "py-1", children: d }, d))), Array.from({ length: 31 }).map((_, idx) => {
                                                    const day = idx + 1;
                                                    const isScheduled = day === 25 || day === 26 || day === 28;
                                                    return (_jsx("div", { className: `p-1.5 rounded-lg border text-brand-800 ${isScheduled
                                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                                                            : 'border-transparent'}`, children: day }, idx));
                                                })] })] })] }) })] }), isScheduleOpen && (_jsx("div", { className: "fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-brand-950/40", children: _jsxs("div", { className: "relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-slide-in flex flex-col justify-between", children: [_jsxs("div", { className: "p-4 border-b border-brand-100 flex items-center justify-between bg-brand-50", children: [_jsx("h3", { className: "font-bold text-brand-900 uppercase tracking-wider", children: "Schedule Interview" }), _jsx("button", { onClick: () => setIsScheduleOpen(false), className: "p-1 hover:bg-brand-200 rounded-full text-brand-450", children: _jsx(X, { className: "h-4.5 w-4.5" }) })] }), _jsxs("form", { onSubmit: handleScheduleSubmit, className: "p-5 space-y-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-750 block", children: "Select Candidate *" }), _jsxs("select", { required: true, value: selectedApp, onChange: (e) => {
                                                setSelectedApp(e.target.value);
                                                const selected = applications.find((a) => a._id === e.target.value);
                                                if (selected) {
                                                    setSelectedStudent(selected.student?._id || '');
                                                    setSelectedJob(selected.job?._id || '');
                                                }
                                            }, className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850", children: [_jsx("option", { value: "", children: "-- Select Candidate --" }), applications
                                                    .filter((a) => a.status === 'SHORTLISTED' || a.status === 'APPLIED')
                                                    .map((a) => (_jsxs("option", { value: a._id, children: [a.student?.name, " \u2014 ", a.job?.companyName] }, a._id)))] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-750 block", children: "Date & Time *" }), _jsx("input", { required: true, type: "datetime-local", value: schedDate, onChange: (e) => setSchedDate(e.target.value), className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-750 block", children: "Round Type *" }), _jsxs("select", { value: schedType, onChange: (e) => setSchedType(e.target.value), className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850", children: [_jsx("option", { value: "TECHNICAL", children: "Technical Round" }), _jsx("option", { value: "BEHAVIORAL", children: "Behavioral Round" }), _jsx("option", { value: "HR", children: "HR Round" })] })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-750 block", children: "Meeting Lobby URL" }), _jsx("input", { type: "url", placeholder: "https://meet.google.com/abc", value: schedUrl, onChange: (e) => setSchedUrl(e.target.value), className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => setIsScheduleOpen(false), className: "flex-1 font-bold", children: "Cancel" }), _jsx(Button, { type: "submit", className: "flex-1 bg-indigo-650 hover:bg-indigo-700 text-white font-bold", children: "Schedule Slot" })] })] })] }) })), isFeedbackOpen && (_jsx("div", { className: "fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-brand-950/40", children: _jsxs("div", { className: "relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-slide-in flex flex-col justify-between", children: [_jsxs("div", { className: "p-4 border-b border-brand-100 flex items-center justify-between bg-brand-50", children: [_jsx("h3", { className: "font-bold text-brand-900 uppercase tracking-wider", children: "Record Interview Outcome" }), _jsx("button", { onClick: () => setIsFeedbackOpen(false), className: "p-1 hover:bg-brand-200 rounded-full text-brand-450", children: _jsx(X, { className: "h-4.5 w-4.5" }) })] }), _jsxs("form", { onSubmit: handleFeedbackSubmit, className: "p-5 space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-750 block", children: "Evaluation Score (%)" }), _jsx("input", { required: true, type: "number", min: "0", max: "100", value: interviewScore, onChange: (e) => setInterviewScore(Number(e.target.value)), className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-750 block", children: "Status Outcome" }), _jsxs("select", { value: interviewStatus, onChange: (e) => setInterviewStatus(e.target.value), className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850", children: [_jsx("option", { value: "COMPLETED", children: "Passed Round" }), _jsx("option", { value: "CANCELLED", children: "Cancelled" }), _jsx("option", { value: "NO_SHOW", children: "Candidate No Show" })] })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "font-bold text-brand-750 block", children: "Interviewer Remarks *" }), _jsx("textarea", { required: true, rows: 3, value: feedbackText, onChange: (e) => setFeedbackText(e.target.value), placeholder: "Summarize round strengths/gaps...", className: "w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850" })] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => setIsFeedbackOpen(false), className: "flex-1 font-bold", children: "Cancel" }), _jsx(Button, { type: "submit", className: "flex-1 bg-green-600 hover:bg-green-700 text-white font-bold", children: "Submit Feedback" })] })] })] }) }))] }));
};
export default PlacementInterviews;
