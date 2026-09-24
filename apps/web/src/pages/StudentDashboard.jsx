import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Sparkles, Trophy, Calendar, CheckSquare, TrendingUp,
    ArrowRight, User, Briefcase, BookOpen, Clock, ChevronRight,
    Target, Zap, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardHero, DashboardStat } from '../components/dashboard/DashboardPrimitives.jsx';

export const StudentDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, profileRes] = await Promise.all([
                apiClient.get('/analytics/student'),
                apiClient.get('/students/profile')
            ]);
            setStats(statsRes.data.data);
            setProfile(profileRes.data.data);
        } catch (err) {
            setError('Failed to load dashboard metrics.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const calculateCompletion = () => {
        if (!profile) return 0;
        let score = 0;
        let total = 9;
        if (profile.rollNumber) score++;
        if (profile.semester) score++;
        if (profile.cgpa > 0) score++;
        if (profile.githubProfile || profile.linkedinProfile) score++;
        if (profile.skills && profile.skills.length > 0) score++;
        if (profile.projects && profile.projects.length > 0) score++;
        if (profile.certifications && profile.certifications.length > 0) score++;
        if (profile.careerInterests && profile.careerInterests.length > 0) score++;
        if (profile.careerGoals && profile.careerGoals.length > 0) score++;
        return Math.round((score / total) * 100);
    };

    const gpaData = [
        { semester: 'Sem 1', gpa: 7.2 },
        { semester: 'Sem 2', gpa: 7.8 },
        { semester: 'Sem 3', gpa: 8.1 },
        { semester: 'Sem 4', gpa: stats?.cgpa || 8.4 },
    ];

    if (loading) {
        return (
            _jsxs("div", {
                className: "space-y-6 max-w-7xl mx-auto animate-pulse",
                children: [
                    _jsx("div", { className: "h-44 bg-slate-200/70 rounded-3xl" }),
                    _jsx("div", { className: "h-20 bg-slate-200/70 rounded-2xl" }),
                    _jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                        children: [
                            _jsx("div", { className: "h-28 bg-slate-200/70 rounded-2xl" }),
                            _jsx("div", { className: "h-28 bg-slate-200/70 rounded-2xl" }),
                            _jsx("div", { className: "h-28 bg-slate-200/70 rounded-2xl" }),
                            _jsx("div", { className: "h-28 bg-slate-200/70 rounded-2xl" })
                        ]
                    })
                ]
            })
        );
    }

    const completionPercent = calculateCompletion();

    let nextAction = {
        title: 'Conduct AI Practice Mock Interview',
        description: 'Prepare yourself for upcoming campus recruiting drives. Run the simulated AI technical round now.',
        cta: 'Start Mock Interview',
        link: '/ai-interview'
    };

    if (completionPercent < 80) {
        nextAction = {
            title: 'Complete Student Profile Evidence',
            description: 'Your placement profile completion is currently low. Register your projects and GitHub handles to unlock top recruiter shortlists.',
            cta: 'Complete Profile',
            link: '/profile'
        };
    } else if (!profile?.resumeUrl) {
        nextAction = {
            title: 'Analyze and Optimize Resume PDF',
            description: 'Upload your active resume to execute the AI structure check and identify missing keywords.',
            cta: 'Scan Resume',
            link: '/resume'
        };
    } else if ((profile?.skills || []).length < 5) {
        nextAction = {
            title: 'Declare Core Technical Competencies',
            description: 'List technical and coding competencies on your profile to enable higher match scoring by matching agents.',
            cta: 'Declare Skills',
            link: '/skills-projects'
        };
    }

    const readinessScore = stats?.readinessScore || profile?.placementReadinessScore || 78;

    return (
        _jsxs("div", {
            className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in font-sans",
            children: [
                // Top Hero Banner
                _jsx(DashboardHero, {
                    eyebrow: "Autonomous Student Success Center",
                    title: `Welcome back, ${user?.name?.split(' ')[0] || 'Student'}.`,
                    description: `${profile?.department?.name || 'Computer Science & Engineering'} · Semester ${profile?.semester || 6}. CampusGent transforms your academic progress into a clear, recruiter-ready placement trajectory.`,
                    icon: Sparkles,
                    action: { label: 'Open Placement Plan', href: '/placements' },
                    children: _jsxs("div", {
                        className: "min-w-[220px] rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md",
                        children: [
                            _jsxs("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    _jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-200", children: "Placement Readiness" }),
                                    _jsx("span", { className: "text-[10px] font-bold text-emerald-300", children: "Top Tier" })
                                ]
                            }),
                            _jsxs("p", {
                                className: "mt-2 text-4xl font-black text-white",
                                children: [readinessScore, "%"]
                            }),
                            _jsx("div", {
                                className: "mt-3 h-2 overflow-hidden rounded-full bg-white/15",
                                children: _jsx("div", {
                                    className: "h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300",
                                    style: { width: `${readinessScore}%` }
                                })
                            })
                        ]
                    })
                }),

                // Error Message if any
                error && (
                    _jsx("div", {
                        className: "p-3.5 bg-rose-50 border border-rose-200 text-rose-700 font-semibold rounded-2xl",
                        children: error
                    })
                ),

                // Attention / Next Best Action Banner
                _jsxs("div", {
                    className: "relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-5 text-white shadow-md border border-indigo-800/60 flex flex-col md:flex-row justify-between md:items-center gap-4",
                    children: [
                        _jsx("div", { className: "absolute -right-10 -top-10 h-32 w-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" }),
                        _jsxs("div", {
                            className: "space-y-1.5 max-w-xl relative",
                            children: [
                                _jsxs("div", {
                                    className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[9.5px] font-bold uppercase tracking-wider text-indigo-300",
                                    children: [
                                        _jsx(Zap, { className: "h-3 w-3 text-indigo-300 animate-pulse" }),
                                        "Recommended Action"
                                    ]
                                }),
                                _jsx("h3", { className: "font-bold text-sm text-white", children: nextAction.title }),
                                _jsx("p", { className: "text-xs text-slate-300 leading-relaxed", children: nextAction.description })
                            ]
                        }),
                        _jsx(Link, {
                            to: nextAction.link,
                            className: "shrink-0 relative",
                            children: _jsxs(Button, {
                                className: "bg-white text-indigo-950 hover:bg-indigo-50 font-bold px-5 py-2.5 rounded-xl border-0 shadow-md flex gap-2 items-center active:scale-95",
                                children: [
                                    _jsx("span", { children: nextAction.cta }),
                                    _jsx(ArrowRight, { className: "h-4 w-4 text-indigo-600" })
                                ]
                            })
                        })
                    ]
                }),

                // 4 Top Stats
                _jsxs("div", {
                    className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
                    children: [
                        _jsx(DashboardStat, {
                            label: "Cumulative GPA",
                            value: `${stats?.cgpa || '8.40'} / 10`,
                            detail: "Academic Momentum",
                            icon: Trophy,
                            tone: "indigo",
                            trend: "+0.3 vs Sem 3",
                            trendUp: true
                        }),
                        _jsx(DashboardStat, {
                            label: "Class Attendance",
                            value: `${stats?.attendance || 88}%`,
                            detail: "Min. requirement 75%",
                            icon: Calendar,
                            tone: "emerald",
                            trend: "Safe Status",
                            trendUp: true
                        }),
                        _jsx(DashboardStat, {
                            label: "Skills Endorsed",
                            value: stats?.skillsCount || (profile?.skills?.length || 8),
                            detail: "Verified Portfolio Proof",
                            icon: CheckSquare,
                            tone: "amber"
                        }),
                        _jsx(DashboardStat, {
                            label: "Profile Strength",
                            value: `${completionPercent}%`,
                            detail: "Unlock verified drives",
                            icon: User,
                            tone: "cyan"
                        })
                    ]
                }),

                // Grid: 2 Cols Left, 1 Col Right
                _jsxs("div", {
                    className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                    children: [
                        // Left Column (Charts & Progress)
                        _jsxs("div", {
                            className: "lg:col-span-2 space-y-6",
                            children: [
                                // CGPA Progression Card
                                _jsxs(Card, {
                                    className: "border border-slate-200/80 shadow-subtle",
                                    children: [
                                        _jsxs(CardHeader, {
                                            className: "pb-3 flex flex-row items-center justify-between border-b border-slate-100",
                                            children: [
                                                _jsxs(CardTitle, {
                                                    className: "text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2",
                                                    children: [
                                                        _jsx(TrendingUp, { className: "h-4 w-4 text-indigo-600" }),
                                                        _jsx("span", { children: "Academic CGPA Progression" })
                                                    ]
                                                }),
                                                _jsxs(Link, {
                                                    to: "/academics",
                                                    className: "text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 transition-colors",
                                                    children: [
                                                        _jsx("span", { children: "View Full Transcript" }),
                                                        _jsx(ChevronRight, { className: "h-3.5 w-3.5" })
                                                    ]
                                                })
                                            ]
                                        }),
                                        _jsx(CardContent, {
                                            className: "h-64 pt-4",
                                            children: _jsx(ResponsiveContainer, {
                                                width: "100%",
                                                height: "100%",
                                                children: _jsxs(AreaChart, {
                                                    data: gpaData,
                                                    margin: { top: 10, right: 20, left: -25, bottom: 0 },
                                                    children: [
                                                        _jsxs("defs", {
                                                            children: [
                                                                _jsxs("linearGradient", {
                                                                    id: "colorGpa",
                                                                    x1: "0",
                                                                    y1: "0",
                                                                    x2: "0",
                                                                    y2: "1",
                                                                    children: [
                                                                        _jsx("stop", { offset: "5%", stopColor: "#4f46e5", stopOpacity: 0.35 }),
                                                                        _jsx("stop", { offset: "95%", stopColor: "#4f46e5", stopOpacity: 0 })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9" }),
                                                        _jsx(XAxis, { dataKey: "semester", stroke: "#94a3b8", fontSize: 11 }),
                                                        _jsx(YAxis, { domain: [0, 10], stroke: "#94a3b8", fontSize: 11 }),
                                                        _jsx(Tooltip, {
                                                            contentStyle: {
                                                                backgroundColor: '#0f172a',
                                                                borderRadius: '12px',
                                                                color: '#fff',
                                                                fontSize: '11px',
                                                                border: '1px solid #334155'
                                                            }
                                                        }),
                                                        _jsx(Area, {
                                                            type: "monotone",
                                                            dataKey: "gpa",
                                                            stroke: "#4f46e5",
                                                            strokeWidth: 2.5,
                                                            fillOpacity: 1,
                                                            fill: "url(#colorGpa)"
                                                        })
                                                    ]
                                                })
                                            })
                                        })
                                    ]
                                }),

                                // 2 Split Sub-Cards (Learning Roadmap & Target Role)
                                _jsxs("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                    children: [
                                        // Learning Roadmap Card
                                        _jsxs(Card, {
                                            className: "border border-slate-200/80 shadow-subtle flex flex-col justify-between",
                                            children: [
                                                _jsx(CardHeader, {
                                                    className: "pb-2",
                                                    children: _jsxs(CardTitle, {
                                                        className: "text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2",
                                                        children: [
                                                            _jsx(BookOpen, { className: "h-4 w-4 text-indigo-500" }),
                                                            _jsx("span", { children: "Learning Roadmap" })
                                                        ]
                                                    })
                                                }),
                                                _jsxs(CardContent, {
                                                    className: "space-y-4",
                                                    children: [
                                                        _jsxs("div", {
                                                            className: "space-y-1.5",
                                                            children: [
                                                                _jsx("span", { className: "font-bold text-slate-900 block text-sm", children: "Full Stack Development Track" }),
                                                                _jsxs("div", {
                                                                    className: "flex items-center justify-between text-[11px] text-slate-500",
                                                                    children: [
                                                                        _jsx("span", { children: "Progress" }),
                                                                        _jsx("span", { className: "font-bold text-indigo-600", children: "68% Complete" })
                                                                    ]
                                                                }),
                                                                _jsx("div", {
                                                                    className: "h-2 w-full rounded-full bg-slate-100 overflow-hidden",
                                                                    children: _jsx("div", { className: "h-full w-[68%] rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" })
                                                                })
                                                            ]
                                                        }),
                                                        _jsxs("div", {
                                                            className: "p-3 border border-slate-100 rounded-xl bg-slate-50/80 space-y-1",
                                                            children: [
                                                                _jsx("span", { className: "text-[9.5px] uppercase font-bold text-slate-400", children: "Next Up:" }),
                                                                _jsx("p", { className: "font-bold text-slate-900 text-xs", children: "Advanced React State & Async Patterns" })
                                                            ]
                                                        }),
                                                        _jsx(Link, {
                                                            to: "/learning",
                                                            className: "inline-block pt-1 w-full",
                                                            children: _jsx(Button, {
                                                                variant: "secondary",
                                                                className: "w-full text-xs py-2",
                                                                children: "Continue Learning"
                                                            })
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),

                                        // Target Role Alignment Card
                                        _jsxs(Card, {
                                            className: "border border-slate-200/80 shadow-subtle flex flex-col justify-between",
                                            children: [
                                                _jsx(CardHeader, {
                                                    className: "pb-2",
                                                    children: _jsxs(CardTitle, {
                                                        className: "text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2",
                                                        children: [
                                                            _jsx(Briefcase, { className: "h-4 w-4 text-emerald-500" }),
                                                            _jsx("span", { children: "Target Role Alignment" })
                                                        ]
                                                    })
                                                }),
                                                _jsxs(CardContent, {
                                                    className: "space-y-4",
                                                    children: [
                                                        _jsxs("div", {
                                                            className: "space-y-1",
                                                            children: [
                                                                _jsx("span", { className: "font-bold text-slate-900 block text-sm", children: profile?.careerInterests?.[0] || 'Software Development Engineer' }),
                                                                _jsx("span", { className: "text-[11px] text-slate-500 font-medium", children: "Skill Match Benchmark: 92%" })
                                                            ]
                                                        }),
                                                        _jsxs("div", {
                                                            className: "flex gap-1.5 flex-wrap",
                                                            children: [
                                                                (profile?.skills || [{ name: 'React' }, { name: 'Node.js' }, { name: 'TypeScript' }]).slice(0, 3).map((s) => (
                                                                    _jsx(Badge, { variant: "indigo", size: "xs", children: s.name }, s.name)
                                                                )),
                                                                (profile?.skills || []).length > 3 && (
                                                                    _jsxs("span", {
                                                                        className: "text-[10px] text-slate-500 font-semibold self-center",
                                                                        children: ["+", profile.skills.length - 3, " more"]
                                                                    })
                                                                )
                                                            ]
                                                        }),
                                                        _jsx(Link, {
                                                            to: "/career",
                                                            className: "inline-block pt-1 w-full",
                                                            children: _jsx(Button, {
                                                                variant: "secondary",
                                                                className: "w-full text-xs py-2",
                                                                children: "Open Career Roadmap"
                                                            })
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),

                        // Right Column (Recommended & Recent Activity)
                        _jsxs("div", {
                            className: "lg:col-span-1 space-y-6",
                            children: [
                                // AI Recommendations Card
                                _jsxs(Card, {
                                    className: "border border-slate-200/80 shadow-subtle",
                                    children: [
                                        _jsx(CardHeader, {
                                            className: "pb-2",
                                            children: _jsxs(CardTitle, {
                                                className: "text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2",
                                                children: [
                                                    _jsx(Sparkles, { className: "h-4 w-4 text-indigo-500" }),
                                                    _jsx("span", { children: "AI Recommendations" })
                                                ]
                                            })
                                        }),
                                        _jsxs(CardContent, {
                                            className: "space-y-3 pt-2",
                                            children: [
                                                _jsxs("div", {
                                                    className: "p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 hover:bg-indigo-50 transition-colors space-y-1 group",
                                                    children: [
                                                        _jsx("h4", { className: "font-bold text-slate-900 text-xs", children: "Audit Database & SQL Skills" }),
                                                        _jsx("p", { className: "text-[11px] text-slate-600 leading-relaxed", children: "Your placement audit reports a database query knowledge gap." }),
                                                        _jsx(Link, {
                                                            to: "/skills-projects",
                                                            className: "text-[11px] font-bold text-indigo-600 group-hover:text-indigo-800 inline-flex items-center gap-1 pt-1",
                                                            children: [
                                                                "Add Skill Proof",
                                                                _jsx(ArrowUpRight, { className: "h-3.5 w-3.5" })
                                                            ]
                                                        })
                                                    ]
                                                }),
                                                _jsxs("div", {
                                                    className: "p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:bg-emerald-50 transition-colors space-y-1 group",
                                                    children: [
                                                        _jsx("h4", { className: "font-bold text-slate-900 text-xs", children: "ATS Resume Optimizer" }),
                                                        _jsx("p", { className: "text-[11px] text-slate-600 leading-relaxed", children: "Scan your resume formatting against top recruiter benchmarks." }),
                                                        _jsx(Link, {
                                                            to: "/resume",
                                                            className: "text-[11px] font-bold text-emerald-700 group-hover:text-emerald-900 inline-flex items-center gap-1 pt-1",
                                                            children: [
                                                                "Scan Resume PDF",
                                                                _jsx(ArrowUpRight, { className: "h-3.5 w-3.5" })
                                                            ]
                                                        })
                                                    ]
                                                }),
                                                _jsxs("div", {
                                                    className: "p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors space-y-1 group",
                                                    children: [
                                                        _jsx("h4", { className: "font-bold text-slate-900 text-xs", children: "Simulate Technical Round" }),
                                                        _jsx("p", { className: "text-[11px] text-slate-600 leading-relaxed", children: "Practice live coding & HR questions with instant AI feedback." }),
                                                        _jsx(Link, {
                                                            to: "/ai-interview",
                                                            className: "text-[11px] font-bold text-indigo-600 group-hover:text-indigo-800 inline-flex items-center gap-1 pt-1",
                                                            children: [
                                                                "Launch Simulator",
                                                                _jsx(ArrowUpRight, { className: "h-3.5 w-3.5" })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                }),

                                // Recent Activity Timeline
                                _jsxs(Card, {
                                    className: "border border-slate-200/80 shadow-subtle",
                                    children: [
                                        _jsx(CardHeader, {
                                            className: "pb-2",
                                            children: _jsxs(CardTitle, {
                                                className: "text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2",
                                                children: [
                                                    _jsx(Clock, { className: "h-4 w-4 text-slate-400" }),
                                                    _jsx("span", { children: "Recent Activity" })
                                                ]
                                            })
                                        }),
                                        _jsx(CardContent, {
                                            className: "p-5",
                                            children: _jsxs("div", {
                                                className: "relative pl-4 border-l border-slate-200 space-y-4 text-xs",
                                                children: [
                                                    _jsxs("div", {
                                                        className: "relative",
                                                        children: [
                                                            _jsx("span", { className: "absolute -left-[21px] top-1 bg-indigo-600 h-2.5 w-2.5 rounded-full ring-4 ring-white shadow-xs" }),
                                                            _jsx("span", { className: "text-[10px] text-slate-400 font-semibold block", children: "Today" }),
                                                            _jsx("span", { className: "font-bold text-slate-900 text-xs", children: "Cumulative GPA Context Refreshed" })
                                                        ]
                                                    }),
                                                    _jsxs("div", {
                                                        className: "relative",
                                                        children: [
                                                            _jsx("span", { className: "absolute -left-[21px] top-1 bg-emerald-500 h-2.5 w-2.5 rounded-full ring-4 ring-white shadow-xs" }),
                                                            _jsx("span", { className: "text-[10px] text-slate-400 font-semibold block", children: "Yesterday" }),
                                                            _jsx("span", { className: "font-bold text-slate-900 text-xs", children: "Applied to Amazon SDE-1 Drive" })
                                                        ]
                                                    }),
                                                    _jsxs("div", {
                                                        className: "relative",
                                                        children: [
                                                            _jsx("span", { className: "absolute -left-[21px] top-1 bg-slate-400 h-2.5 w-2.5 rounded-full ring-4 ring-white shadow-xs" }),
                                                            _jsx("span", { className: "text-[10px] text-slate-400 font-semibold block", children: "3 days ago" }),
                                                            _jsx("span", { className: "font-bold text-slate-900 text-xs", children: "Completed AI Career Readiness Audit" })
                                                        ]
                                                    })
                                                ]
                                            })
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

export default StudentDashboard;
