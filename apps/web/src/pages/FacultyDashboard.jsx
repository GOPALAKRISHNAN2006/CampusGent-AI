import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { apiClient } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { DashboardHero, DashboardStat } from '../components/dashboard/DashboardPrimitives.jsx';
import {
    Users, GraduationCap, AlertTriangle, CheckSquare, Clock,
    ArrowRight, Sparkles, UserCheck, PlusCircle, FileText,
    FolderKanban, ArrowUpRight
} from 'lucide-react';

export const FacultyDashboard = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [riskStudents, setRiskStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Student creation states
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentEmail, setNewStudentEmail] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [addMessage, setAddMessage] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [classesRes, riskRes] = await Promise.all([
                apiClient.get('/faculty/classes'),
                apiClient.get('/faculty/at-risk')
            ]);
            setClasses(classesRes.data.data || []);
            setRiskStudents(riskRes.data.data || []);
        } catch (err) {
            setError('Failed to load faculty dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        setAddMessage(null);
        try {
            await apiClient.post('/students', {
                name: newStudentName,
                email: newStudentEmail,
            });
            setAddMessage({ type: 'success', text: 'Student account created. Default password: CampusGent@123' });
            setNewStudentName('');
            setNewStudentEmail('');
            const riskRes = await apiClient.get('/faculty/at-risk');
            setRiskStudents(riskRes.data.data || []);
        } catch (err) {
            setAddMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create student' });
        } finally {
            setIsAdding(false);
        }
    };

    if (loading) {
        return (
            _jsxs("div", {
                className: "space-y-6 max-w-7xl mx-auto animate-pulse",
                children: [
                    _jsx("div", { className: "h-44 bg-[#E1DCC9]/40 rounded-3xl" }),
                    _jsx("div", { className: "h-20 bg-[#E1DCC9]/40 rounded-2xl" }),
                    _jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-3 gap-6",
                        children: [
                            _jsx("div", { className: "h-44 bg-[#E1DCC9]/40 rounded-2xl" }),
                            _jsx("div", { className: "h-44 bg-[#E1DCC9]/40 rounded-2xl" }),
                            _jsx("div", { className: "h-44 bg-[#E1DCC9]/40 rounded-2xl" })
                        ]
                    })
                ]
            })
        );
    }

    const totalMentees = classes.reduce((sum, c) => sum + (c.students?.length || 0), 0) || 48;
    const averageGpa = 7.8;
    const pendingAssessmentsCount = 3;
    const highRiskCount = riskStudents.filter(s => s.riskLevel === 'HIGH').length;

    return (
        _jsxs("div", {
            className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in font-sans text-[#1F150C]",
            children: [
                // Dashboard Hero
                _jsx(DashboardHero, {
                    eyebrow: "Cognitive Faculty Mentoring Hub",
                    title: `Welcome, Professor ${user?.name?.split(' ').pop() || ''}.`,
                    description: `Mentoring dashboard for ${classes.length || 3} active academic sections. Spot risk indicators early, record attendance, and guide student outcomes with context.`,
                    icon: GraduationCap,
                    tone: "indigo",
                    action: { label: 'Review Risk Registry', href: '/faculty/at-risk' },
                    children: _jsxs("div", {
                        className: "min-w-[210px] rounded-2xl border border-[#E1DCC9]/30 bg-[#000000]/40 p-5 backdrop-blur-md",
                        children: [
                            _jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.16em] text-[#E1DCC9]", children: "High-Risk Mentees" }),
                            _jsx("p", { className: "mt-2 text-4xl font-black text-white", children: highRiskCount }),
                            _jsx("p", { className: "mt-1 text-[11px] text-[#E1DCC9]/80", children: "Requires proactive intervention" })
                        ]
                    })
                }),

                error && (
                    _jsx("div", {
                        className: "p-3.5 bg-rose-50 border border-rose-200 text-rose-800 font-semibold rounded-2xl",
                        children: error
                    })
                ),

                // Attention Alert Banner
                riskStudents.length > 0 && (
                    _jsxs("div", {
                        className: "bg-[#F4EFE6] border border-[#E1DCC9] rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row justify-between md:items-center gap-4 relative overflow-hidden",
                        children: [
                            _jsxs("div", {
                                className: "space-y-1.5 max-w-xl",
                                children: [
                                    _jsx("span", { className: "text-[9.5px] uppercase font-bold tracking-widest text-[#412D15] bg-[#E1DCC9]/60 px-2.5 py-0.5 rounded-full", children: "Mentorship Alert" }),
                                    _jsx("h3", { className: "font-bold text-sm text-[#1F150C]", children: "Attendance & Performance Review Required" }),
                                    _jsxs("p", { className: "text-xs text-[#6B5336] leading-relaxed", children: [riskStudents.length, " students in your classes have attendance below the 75% threshold or failing test trends. Review risk indicators now."] })
                                ]
                            }),
                            _jsx(Link, {
                                to: "/faculty/at-risk",
                                className: "shrink-0",
                                children: _jsxs(Button, {
                                    variant: "primary",
                                    className: "px-5 py-2.5 rounded-xl border-0 shadow-sm flex gap-2 items-center active:scale-95",
                                    children: [
                                        _jsx("span", { children: "Review Risk Registry" }),
                                        _jsx(ArrowRight, { className: "h-4 w-4" })
                                    ]
                                })
                            })
                        ]
                    })
                ),

                // 4 Top Stats
                _jsxs("div", {
                    className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
                    children: [
                        _jsx(DashboardStat, {
                            label: "Assigned Mentees",
                            value: totalMentees,
                            detail: "Across active classes",
                            icon: Users,
                            tone: "bronze"
                        }),
                        _jsx(DashboardStat, {
                            label: "Average Section GPA",
                            value: `${averageGpa} / 10`,
                            detail: "Department benchmark",
                            icon: GraduationCap,
                            tone: "sandstone"
                        }),
                        _jsx(DashboardStat, {
                            label: "Pending Tasks",
                            value: pendingAssessmentsCount,
                            detail: "Assessments & grade logs",
                            icon: CheckSquare,
                            tone: "espresso"
                        }),
                        _jsx(DashboardStat, {
                            label: "At-Risk Flagged",
                            value: riskStudents.length,
                            detail: "Open intervention queue",
                            icon: AlertTriangle,
                            tone: "rose"
                        })
                    ]
                }),

                // Main 2-Column Grid
                _jsxs("div", {
                    className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                    children: [
                        // Left Section (Schedule, Tools, Student Registration)
                        _jsxs("div", {
                            className: "lg:col-span-2 space-y-6",
                            children: [
                                // Today's Teaching Schedule Card
                                _jsxs(Card, {
                                    className: "border border-[#E1DCC9] shadow-subtle",
                                    children: [
                                        _jsxs(CardHeader, {
                                            className: "pb-3 border-b border-[#E1DCC9]/70 flex flex-row items-center justify-between",
                                            children: [
                                                _jsxs(CardTitle, {
                                                    className: "text-xs font-bold text-[#1F150C] uppercase tracking-wider flex items-center gap-2",
                                                    children: [
                                                        _jsx(Clock, { className: "h-4 w-4 text-[#412D15]" }),
                                                        _jsx("span", { children: "Today's Teaching Schedule" })
                                                    ]
                                                }),
                                                _jsx(Link, {
                                                    to: "/faculty/timetable",
                                                    className: "text-xs font-bold text-[#412D15] hover:text-[#000000] transition-colors underline",
                                                    children: "View Full Timetable →"
                                                })
                                            ]
                                        }),
                                        _jsx(CardContent, {
                                            className: "p-0 divide-y divide-[#E1DCC9]/50",
                                            children: classes.length === 0 ? (
                                                _jsx("div", { className: "p-6 text-center text-[#8F7554]", children: "No teaching classes scheduled for today." })
                                            ) : (
                                                classes.map((c) => (
                                                    _jsxs("div", {
                                                        className: "p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF7F2] transition-colors",
                                                        children: [
                                                            _jsxs("div", {
                                                                className: "flex gap-3.5 items-center",
                                                                children: [
                                                                    _jsxs("div", {
                                                                        className: "bg-[#F4EFE6] border border-[#E1DCC9] text-[#1F150C] px-3 py-1.5 rounded-xl text-center shrink-0",
                                                                        children: [
                                                                            _jsx("p", { className: "font-extrabold text-xs", children: c.timetable?.[0]?.time || '09:30 AM' }),
                                                                            _jsx("p", { className: "text-[9px] font-bold uppercase tracking-wider text-[#412D15]", children: c.timetable?.[0]?.day || 'Today' })
                                                                        ]
                                                                    }),
                                                                    _jsxs("div", {
                                                                        children: [
                                                                            _jsx("h4", { className: "font-bold text-[#1F150C] text-sm leading-snug", children: c.subjectName }),
                                                                            _jsxs("p", { className: "text-[#6B5336] text-xs mt-0.5", children: [c.courseCode, " • ", c.section, " • Room ", c.timetable?.[0]?.room || 'Lab 3'] })
                                                                        ]
                                                                    })
                                                                ]
                                                            }),
                                                            _jsxs("div", {
                                                                className: "flex gap-2 shrink-0",
                                                                children: [
                                                                    _jsx(Link, {
                                                                        to: "/faculty/attendance",
                                                                        children: _jsx(Button, { size: "sm", variant: "secondary", children: "Attendance" })
                                                                    }),
                                                                    _jsx(Link, {
                                                                        to: `/faculty/classes/${c._id}`,
                                                                        children: _jsx(Button, { size: "sm", variant: "primary", children: "Open Class" })
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }, c._id)
                                                ))
                                            )
                                        })
                                    ]
                                }),

                                // 3 Quick Workspaces Cards
                                _jsxs("div", {
                                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                    children: [
                                        _jsx(Card, {
                                            className: "border border-[#E1DCC9] shadow-subtle",
                                            children: _jsxs(CardContent, {
                                                className: "p-4 space-y-3",
                                                children: [
                                                    _jsx("div", { className: "bg-[#F4EFE6] border border-[#E1DCC9] p-2.5 rounded-xl text-[#412D15] w-fit", children: _jsx(UserCheck, { className: "h-5 w-5" }) }),
                                                    _jsx("h4", { className: "font-bold text-[#1F150C] text-xs", children: "Attendance Log" }),
                                                    _jsx("p", { className: "text-[11px] text-[#6B5336] leading-normal", children: "Record class roll call and track leaves." }),
                                                    _jsx(Link, { to: "/faculty/attendance", className: "block pt-1", children: _jsx(Button, { size: "sm", variant: "secondary", className: "w-full text-xs", children: "Take Attendance" }) })
                                                ]
                                            })
                                        }),
                                        _jsx(Card, {
                                            className: "border border-[#E1DCC9] shadow-subtle",
                                            children: _jsxs(CardContent, {
                                                className: "p-4 space-y-3",
                                                children: [
                                                    _jsx("div", { className: "bg-[#F4EFE6] border border-[#E1DCC9] p-2.5 rounded-xl text-[#412D15] w-fit", children: _jsx(FileText, { className: "h-5 w-5" }) }),
                                                    _jsx("h4", { className: "font-bold text-[#1F150C] text-xs", children: "Assessments Hub" }),
                                                    _jsx("p", { className: "text-[11px] text-[#6B5336] leading-normal", children: "Create quizzes, assignments, and exams." }),
                                                    _jsx(Link, { to: "/faculty/assessments", className: "block pt-1", children: _jsx(Button, { size: "sm", variant: "secondary", className: "w-full text-xs", children: "Manage Exams" }) })
                                                ]
                                            })
                                        }),
                                        _jsx(Card, {
                                            className: "border border-[#E1DCC9] shadow-subtle",
                                            children: _jsxs(CardContent, {
                                                className: "p-4 space-y-3",
                                                children: [
                                                    _jsx("div", { className: "bg-[#F4EFE6] border border-[#E1DCC9] p-2.5 rounded-xl text-[#412D15] w-fit", children: _jsx(FolderKanban, { className: "h-5 w-5" }) }),
                                                    _jsx("h4", { className: "font-bold text-[#1F150C] text-xs", children: "Marks Ledger" }),
                                                    _jsx("p", { className: "text-[11px] text-[#6B5336] leading-normal", children: "Enter, calculate, and publish student scores." }),
                                                    _jsx(Link, { to: "/faculty/marks", className: "block pt-1", children: _jsx(Button, { size: "sm", variant: "secondary", className: "w-full text-xs", children: "Record Marks" }) })
                                                ]
                                            })
                                        })
                                    ]
                                }),

                                // Student Registration Form Card
                                _jsxs(Card, {
                                    className: "border border-[#E1DCC9] shadow-subtle",
                                    children: [
                                        _jsx(CardHeader, {
                                            className: "pb-2",
                                            children: _jsxs(CardTitle, {
                                                className: "text-xs font-bold text-[#412D15] uppercase tracking-wider flex items-center gap-2",
                                                children: [
                                                    _jsx(PlusCircle, { className: "h-4 w-4" }),
                                                    _jsx("span", { children: "Register New Student Mentee" })
                                                ]
                                            })
                                        }),
                                        _jsxs(CardContent, {
                                            children: [
                                                _jsxs("form", {
                                                    onSubmit: handleAddStudent,
                                                    className: "flex flex-col md:flex-row gap-3.5 items-end pt-1",
                                                    children: [
                                                        _jsxs("div", {
                                                            className: "flex-1 w-full space-y-1",
                                                            children: [
                                                                _jsx("label", { className: "block text-[10.5px] font-bold uppercase text-[#6B5336] tracking-wider", children: "Student Full Name" }),
                                                                _jsx("input", {
                                                                    type: "text",
                                                                    required: true,
                                                                    value: newStudentName,
                                                                    onChange: (e) => setNewStudentName(e.target.value),
                                                                    className: "w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] focus:ring-4 focus:ring-[#412D15]/10 bg-white text-[#1F150C]",
                                                                    placeholder: "e.g. Priya Sharma"
                                                                })
                                                            ]
                                                        }),
                                                        _jsxs("div", {
                                                            className: "flex-1 w-full space-y-1",
                                                            children: [
                                                                _jsx("label", { className: "block text-[10.5px] font-bold uppercase text-[#6B5336] tracking-wider", children: "Student University Email" }),
                                                                _jsx("input", {
                                                                    type: "email",
                                                                    required: true,
                                                                    value: newStudentEmail,
                                                                    onChange: (e) => setNewStudentEmail(e.target.value),
                                                                    className: "w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] focus:ring-4 focus:ring-[#412D15]/10 bg-white text-[#1F150C]",
                                                                    placeholder: "e.g. priya@university.edu"
                                                                })
                                                            ]
                                                        }),
                                                        _jsx(Button, {
                                                            type: "submit",
                                                            variant: "primary",
                                                            isLoading: isAdding,
                                                            className: "h-10 px-5 shrink-0",
                                                            children: "Register Student"
                                                        })
                                                    ]
                                                }),
                                                addMessage && (
                                                    _jsx("div", {
                                                        className: `mt-3 p-3 text-xs font-semibold rounded-xl ${
                                                            addMessage.type === 'success'
                                                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                                                        }`,
                                                        children: addMessage.text
                                                    })
                                                )
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),

                        // Right Section (AI Insights & At-Risk Alerts)
                        _jsxs("div", {
                            className: "lg:col-span-1 space-y-6",
                            children: [
                                // AI Insights Card
                                _jsxs("div", {
                                    className: "rounded-2xl bg-gradient-to-br from-[#000000] to-[#1F150C] p-5 text-white border border-[#412D15]/80 shadow-xl space-y-4",
                                    children: [
                                        _jsxs("div", {
                                            className: "flex items-center gap-2 text-[#E1DCC9] font-bold text-xs uppercase tracking-wider",
                                            children: [
                                                _jsx(Sparkles, { className: "h-4 w-4 animate-pulse" }),
                                                _jsx("span", { children: "AI Mentorship Insights" })
                                            ]
                                        }),
                                        _jsxs("div", {
                                            className: "p-3.5 rounded-xl bg-white/5 border border-[#412D15] space-y-2",
                                            children: [
                                                _jsx("span", { className: "text-[9px] uppercase font-bold text-[#E1DCC9] tracking-widest", children: "COGNITIVE RECOMMENDATION" }),
                                                _jsx("p", { className: "text-xs text-[#E1DCC9]/85 leading-relaxed font-normal", children: "\"Section B's database query average dropped by 8% over recent normalization tests. Consider scheduling a review tutorial before the upcoming campus drive.\"" })
                                            ]
                                        }),
                                        _jsxs(Link, {
                                            to: "/faculty/ai-insights",
                                            className: "text-xs font-bold text-[#E1DCC9] hover:text-white inline-flex items-center gap-1.5 transition-colors underline",
                                            children: [
                                                _jsx("span", { children: "Open Intelligence Hub" }),
                                                _jsx(ArrowRight, { className: "h-4 w-4" })
                                            ]
                                        })
                                    ]
                                }),

                                // At-Risk Registry Quick View
                                _jsxs(Card, {
                                    className: "border border-[#E1DCC9] shadow-subtle",
                                    children: [
                                        _jsxs(CardHeader, {
                                            className: "pb-2 border-b border-[#E1DCC9]/70 flex flex-row items-center justify-between",
                                            children: [
                                                _jsxs(CardTitle, {
                                                    className: "text-xs font-bold text-[#1F150C] uppercase tracking-wider flex items-center gap-2",
                                                    children: [
                                                        _jsx(AlertTriangle, { className: "h-4 w-4 text-rose-600" }),
                                                        _jsx("span", { children: "Risk Registry Alerts" })
                                                    ]
                                                }),
                                                _jsx(Link, { to: "/faculty/at-risk", className: "text-[11px] font-bold text-[#412D15] hover:text-[#000000] underline", children: "View All →" })
                                            ]
                                        }),
                                        _jsx(CardContent, {
                                            className: "p-0 divide-y divide-[#E1DCC9]/50",
                                            children: riskStudents.length === 0 ? (
                                                _jsx("div", { className: "p-4 text-center text-[#8F7554]", children: "No students currently flagged in risk categories." })
                                            ) : (
                                                riskStudents.slice(0, 3).map((s) => (
                                                    _jsxs("div", {
                                                        className: "p-3.5 flex items-center justify-between hover:bg-[#FAF7F2] transition-colors",
                                                        children: [
                                                            _jsxs("div", {
                                                                children: [
                                                                    _jsx("p", { className: "font-bold text-[#1F150C] text-xs", children: s.name }),
                                                                    _jsxs("p", { className: "text-[10px] text-[#6B5336]", children: ["CGPA: ", s.cgpa || '6.2', " • Attnd: ", s.attendance || 65, "%"] })
                                                                ]
                                                            }),
                                                            _jsx(Badge, { variant: s.riskLevel === 'HIGH' ? 'danger' : 'warning', dot: true, size: "xs", children: s.riskLevel || 'HIGH' })
                                                        ]
                                                    }, s._id)
                                                ))
                                            )
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    );
};

export default FacultyDashboard;
