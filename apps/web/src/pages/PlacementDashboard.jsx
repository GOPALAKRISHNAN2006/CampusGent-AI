import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import {
    Briefcase, FileText, CheckCircle, TrendingUp, Clock,
    AlertTriangle, ArrowRight, ShieldAlert, Award, Calendar,
    ChevronRight, Sparkles, Users, ArrowUpRight, CheckCircle2,
    DollarSign, Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardHero, DashboardStat } from '../components/dashboard/DashboardPrimitives.jsx';

export const PlacementDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiClient.get('/analytics/placement');
                setStats(res.data.data);
            } catch (err) {
                setError('Unable to load placement metrics.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            _jsxs("div", {
                className: "space-y-6 max-w-7xl mx-auto text-xs animate-pulse",
                children: [
                    _jsx("div", { className: "h-44 bg-slate-200/70 rounded-3xl" }),
                    _jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                        children: [1, 2, 3, 4].map((i) => (
                            _jsx("div", { className: "h-28 bg-slate-200/70 rounded-2xl" }, i)
                        ))
                    }),
                    _jsx("div", { className: "h-64 bg-slate-200/70 rounded-2xl" })
                ]
            })
        );
    }

    const todayActivities = [
        { time: '09:30 AM', company: 'Google Cloud India', activity: 'Technical Interview Round 1', count: 24, type: 'Interviews' },
        { time: '11:00 AM', company: 'Amazon Web Services', activity: 'Pre-Placement Talk & Q&A', count: 120, type: 'PPT' },
        { time: '02:00 PM', company: 'Microsoft Research', activity: 'Shortlist Verification Deadline', count: 0, type: 'Deadline' }
    ];

    const attentionRequired = [
        { id: 1, title: '42 eligible candidates have not taken the mandatory technical audit', priority: 'HIGH', action: 'Review Candidates', link: '/placement/at-risk' },
        { id: 2, title: '3 active drives have pending recruiter shortlists awaiting verification', priority: 'HIGH', action: 'Open Drives', link: '/placement/drives' },
        { id: 3, title: '12 eligible finalists have not submitted resumes for SDE-1 roles', priority: 'MEDIUM', action: 'Contact Students', link: '/placement/students' },
        { id: 4, title: 'Recruiter CTC release approval pending for 18 offers', priority: 'LOW', action: 'View Offers', link: '/placement/offers' }
    ];

    const upcomingDrives = [
        { company: 'Google Inc.', role: 'Associate Cloud Engineer', ctc: '18.5 LPA', eligible: 94, applied: 72, date: 'Aug 28, 2026', status: 'Shortlisting' },
        { company: 'Amazon Web Services', role: 'Software Development Engineer', ctc: '16.0 LPA', eligible: 128, applied: 86, date: 'Tomorrow', status: 'Applications Open' },
        { company: 'Meta Platforms', role: 'Data Analyst Intern', ctc: '12.0 LPA', eligible: 110, applied: 65, date: 'Sep 02, 2026', status: 'Applications Open' }
    ];

    const riskStudents = [
        { name: 'Rohan Sharma', roll: 'STU-99281', program: 'B.Tech CSE', cgpa: 5.8, readiness: '48%', concern: 'Low GPA & Missing Assessment', action: 'Schedule Counseling' },
        { name: 'Ananya Goel', roll: 'STU-99182', program: 'M.Tech SE', cgpa: 7.8, readiness: '52%', concern: 'Missing Verified GitHub Profile', action: 'Approve Profile' },
        { name: 'Kunal Sen', roll: 'STU-99175', program: 'B.Tech ECE', cgpa: 8.1, readiness: '60%', concern: 'Failed 3 technical mock rounds', action: 'Assign Mock Session' }
    ];

    const recentRecruiterActivity = [
        { company: 'Amazon Web Services', event: 'Drive request confirmed for SDE-1 openings', time: '10 mins ago', status: 'PENDING' },
        { company: 'TCS Innovation Lab', event: 'Shortlisted candidate roster verified', time: '2 hours ago', status: 'COMPLETED' },
        { company: 'Microsoft India', event: 'Virtual campus hackathon dates confirmed', time: 'Yesterday', status: 'COMPLETED' }
    ];

    const totalApps = stats?.totalApplications || 480;
    const shortlistCount = stats?.applicationsByStatus?.SHORTLISTED || 210;
    const interviewCount = stats?.applicationsByStatus?.INTERVIEW || 132;
    const selectedCount = stats?.applicationsByStatus?.SELECTED || 84;

    return (
        _jsxs("div", {
            className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in font-sans",
            children: [
                // Placement Command Center Hero
                _jsx(DashboardHero, {
                    eyebrow: "Placement Operations Command Center",
                    title: "Drive placement outcomes with real-time confidence.",
                    description: "Coordinate top recruiters, student readiness verification, applications, live interviews, and hiring outcomes from one decision-ready workspace.",
                    icon: Briefcase,
                    tone: "indigo",
                    action: { label: 'Open AI Placement Insights', href: '/placement/ai-insights' },
                    children: _jsxs("div", {
                        className: "grid grid-cols-3 gap-2.5 min-w-[280px]",
                        children: [
                            _jsxs("div", {
                                className: "rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md text-center",
                                children: [
                                    _jsx("p", { className: "text-[9.5px] font-bold uppercase tracking-wider text-slate-300", children: "Season" }),
                                    _jsx("p", { className: "mt-1 font-black text-sm text-white", children: "2026–27" })
                                ]
                            }),
                            _jsxs("div", {
                                className: "rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md text-center",
                                children: [
                                    _jsx("p", { className: "text-[9.5px] font-bold uppercase tracking-wider text-slate-300", children: "Active Drives" }),
                                    _jsx("p", { className: "mt-1 font-black text-sm text-white", children: stats?.totalJobs || 12 })
                                ]
                            }),
                            _jsxs("div", {
                                className: "rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md text-center",
                                children: [
                                    _jsx("p", { className: "text-[9.5px] font-bold uppercase tracking-wider text-slate-300", children: "Placement Rate" }),
                                    _jsxs("p", { className: "mt-1 font-black text-sm text-emerald-300", children: [stats?.placementRate || 82, "%"] })
                                ]
                            })
                        ]
                    })
                }),

                error && (
                    _jsx("div", {
                        className: "p-3.5 bg-rose-50 border border-rose-200 text-rose-700 font-semibold rounded-2xl",
                        children: error
                    })
                ),

                // 4 Top Stats
                _jsxs("div", {
                    className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
                    children: [
                        _jsx(DashboardStat, {
                            label: "Total Placement Drives",
                            value: stats?.totalJobs || 14,
                            detail: "Active recruiter pipeline",
                            icon: Briefcase,
                            tone: "indigo",
                            trend: "+3 this week",
                            trendUp: true
                        }),
                        _jsx(DashboardStat, {
                            label: "Student Applications",
                            value: totalApps,
                            detail: "Submitted across active drives",
                            icon: FileText,
                            tone: "cyan"
                        }),
                        _jsx(DashboardStat, {
                            label: "Placed Candidates",
                            value: selectedCount,
                            detail: "Confirmed corporate offers",
                            icon: CheckCircle,
                            tone: "emerald",
                            trend: "82% target hit",
                            trendUp: true
                        }),
                        _jsx(DashboardStat, {
                            label: "Operational Alerts",
                            value: attentionRequired.length,
                            detail: "Requires review today",
                            icon: AlertTriangle,
                            tone: "rose"
                        })
                    ]
                }),

                // Top Grid: Today Activity & Attention Required
                _jsxs("div", {
                    className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                    children: [
                        // Left: Today's Placement Activity
                        _jsxs(Card, {
                            className: "border border-slate-200/80 shadow-subtle lg:col-span-1",
                            children: [
                                _jsx(CardHeader, {
                                    className: "border-b border-slate-100",
                                    children: _jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            _jsx(Clock, { className: "h-4 w-4 text-indigo-600" }),
                                            _jsx(CardTitle, { children: "Today's Placement Activity" })
                                        ]
                                    })
                                }),
                                _jsx(CardContent, {
                                    className: "p-5 space-y-4",
                                    children: todayActivities.map((act, index) => (
                                        _jsxs("div", {
                                            className: "flex gap-3 border-l-2 border-indigo-400 pl-4 py-1 relative",
                                            children: [
                                                _jsx("div", { className: "absolute w-2 h-2 rounded-full bg-indigo-600 -left-[5px] top-2 ring-2 ring-white shadow-xs" }),
                                                _jsxs("div", {
                                                    className: "flex-1 space-y-1",
                                                    children: [
                                                        _jsxs("div", {
                                                            className: "flex justify-between items-center",
                                                            children: [
                                                                _jsx("span", { className: "font-bold text-slate-900 text-xs", children: act.company }),
                                                                _jsx("span", { className: "text-[10px] text-slate-400 font-semibold", children: act.time })
                                                            ]
                                                        }),
                                                        _jsx("p", { className: "text-slate-600 font-medium text-[11px]", children: act.activity }),
                                                        act.count > 0 && (
                                                            _jsxs(Badge, {
                                                                variant: "indigo",
                                                                size: "xs",
                                                                children: [act.count, " Candidates Scheduled"]
                                                            })
                                                        ),
                                                        _jsxs("div", {
                                                            className: "flex gap-2.5 pt-1 text-[10.5px] font-bold text-indigo-600",
                                                            children: [
                                                                _jsx(Link, { to: "/placement/drives", className: "hover:underline", children: "View Drive" }),
                                                                _jsx("span", { className: "text-slate-300", children: "•" }),
                                                                _jsx(Link, { to: "/placement/interviews", className: "hover:underline", children: "Interview Room" })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            ]
                                        }, index)
                                    ))
                                })
                            ]
                        }),

                        // Right: Attention Required Alerts
                        _jsxs(Card, {
                            className: "border border-slate-200/80 shadow-subtle lg:col-span-2",
                            children: [
                                _jsxs(CardHeader, {
                                    className: "border-b border-slate-100 flex flex-row items-center justify-between",
                                    children: [
                                        _jsxs("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                _jsx(ShieldAlert, { className: "h-4 w-4 text-rose-500" }),
                                                _jsx(CardTitle, { children: "Urgent Operational Action Queue" })
                                            ]
                                        }),
                                        _jsxs(Badge, {
                                            variant: "danger",
                                            dot: true,
                                            size: "sm",
                                            children: [attentionRequired.filter(i => i.priority === 'HIGH').length, " Critical"]
                                        })
                                    ]
                                }),
                                _jsx(CardContent, {
                                    className: "p-0 divide-y divide-slate-100",
                                    children: attentionRequired.map((item) => (
                                        _jsxs("div", {
                                            className: "p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors",
                                            children: [
                                                _jsxs("div", {
                                                    className: "flex items-start gap-3",
                                                    children: [
                                                        _jsx(Badge, {
                                                            variant: item.priority === 'HIGH' ? 'danger' : item.priority === 'MEDIUM' ? 'warning' : 'neutral',
                                                            size: "xs",
                                                            className: "mt-0.5",
                                                            children: item.priority
                                                        }),
                                                        _jsx("span", { className: "font-semibold text-slate-800 text-xs", children: item.title })
                                                    ]
                                                }),
                                                _jsx(Link, {
                                                    to: item.link,
                                                    className: "shrink-0",
                                                    children: _jsxs(Button, {
                                                        size: "sm",
                                                        variant: "secondary",
                                                        className: "text-[11px] py-1 px-3",
                                                        children: [
                                                            _jsx("span", { children: item.action }),
                                                            _jsx(ChevronRight, { className: "h-3 w-3" })
                                                        ]
                                                    })
                                                })
                                            ]
                                        }, item.id)
                                    ))
                                })
                            ]
                        })
                    ]
                }),

                // Hiring Funnel Yield Pipeline Card
                _jsxs(Card, {
                    className: "border border-slate-200/80 shadow-subtle",
                    children: [
                        _jsxs(CardHeader, {
                            className: "border-b border-slate-100 flex flex-row items-center justify-between",
                            children: [
                                _jsxs("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        _jsx(Award, { className: "h-4.5 w-4.5 text-indigo-600" }),
                                        _jsx(CardTitle, { children: "Campus Hiring Yield & Conversion Pipeline" })
                                    ]
                                }),
                                _jsx("span", { className: "text-xs text-slate-400 font-medium", children: "Full placement funnel conversion" })
                            ]
                        }),
                        _jsx(CardContent, {
                            className: "p-5",
                            children: _jsx("div", {
                                className: "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5",
                                children: [
                                    { label: 'Eligible', val: 620, pct: '100%' },
                                    { label: 'Applied', val: totalApps, pct: `${Math.round((totalApps / 620) * 100)}%` },
                                    { label: 'Shortlisted', val: shortlistCount, pct: `${Math.round((shortlistCount / 620) * 100)}%` },
                                    { label: 'Interviewed', val: interviewCount, pct: `${Math.round((interviewCount / 620) * 100)}%` },
                                    { label: 'Selected', val: selectedCount, pct: `${Math.round((selectedCount / 620) * 100)}%` },
                                    { label: 'Offers Given', val: 76, pct: '12.2%' },
                                    { label: 'Joined', val: 68, pct: '11.0%' }
                                ].map((stage) => (
                                    _jsx(Link, {
                                        to: stage.label === 'Applied' ? '/placement/applications' : '/placement/drives',
                                        className: "group",
                                        children: _jsxs("div", {
                                            className: "bg-slate-50 border border-slate-200/70 p-3.5 rounded-2xl text-center group-hover:border-indigo-400 group-hover:bg-indigo-50/30 transition-all cursor-pointer h-full flex flex-col justify-between space-y-1.5",
                                            children: [
                                                _jsx("span", { className: "text-[10px] font-bold text-slate-500 uppercase tracking-wider", children: stage.label }),
                                                _jsx("p", { className: "text-xl font-black text-slate-900", children: stage.val }),
                                                _jsx(Badge, {
                                                    variant: "indigo",
                                                    size: "xs",
                                                    className: "mx-auto",
                                                    children: stage.pct
                                                })
                                            ]
                                        })
                                    }, stage.label)
                                ))
                            })
                        })
                    ]
                }),

                // Upcoming Placement Drives Card
                _jsxs(Card, {
                    className: "border border-slate-200/80 shadow-subtle",
                    children: [
                        _jsxs(CardHeader, {
                            className: "border-b border-slate-100 flex flex-row items-center justify-between",
                            children: [
                                _jsxs("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        _jsx(Calendar, { className: "h-4.5 w-4.5 text-indigo-600" }),
                                        _jsx(CardTitle, { children: "Upcoming Placement Drives" })
                                    ]
                                }),
                                _jsx(Link, {
                                    to: "/placement/drives",
                                    className: "text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors",
                                    children: "Manage All Drives →"
                                })
                            ]
                        }),
                        _jsx(CardContent, {
                            className: "p-5 grid grid-cols-1 md:grid-cols-3 gap-5",
                            children: upcomingDrives.map((drv, index) => (
                                _jsxs("div", {
                                    className: "border border-slate-200/80 rounded-2xl p-5 space-y-3.5 bg-white hover:shadow-card-hover hover:border-slate-300 transition-all",
                                    children: [
                                        _jsxs("div", {
                                            className: "flex justify-between items-start",
                                            children: [
                                                _jsxs("div", {
                                                    children: [
                                                        _jsx("h4", { className: "font-extrabold text-slate-900 text-sm", children: drv.company }),
                                                        _jsx("p", { className: "text-slate-500 font-medium text-xs mt-0.5", children: drv.role })
                                                    ]
                                                }),
                                                _jsx(Badge, {
                                                    variant: drv.status === 'Applications Open' ? 'success' : 'warning',
                                                    dot: true,
                                                    size: "xs",
                                                    children: drv.status
                                                })
                                            ]
                                        }),
                                        _jsxs("div", {
                                            className: "grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl text-xs border border-slate-100",
                                            children: [
                                                _jsxs("div", {
                                                    children: [
                                                        _jsx("span", { className: "text-slate-400 block uppercase font-bold text-[9.5px]", children: "Package CTC" }),
                                                        _jsx("span", { className: "font-bold text-slate-900", children: drv.ctc })
                                                    ]
                                                }),
                                                _jsxs("div", {
                                                    children: [
                                                        _jsx("span", { className: "text-slate-400 block uppercase font-bold text-[9.5px]", children: "Drive Date" }),
                                                        _jsx("span", { className: "font-bold text-slate-900", children: drv.date })
                                                    ]
                                                }),
                                                _jsxs("div", {
                                                    className: "col-span-2 border-t border-slate-200 mt-1 pt-1.5 flex justify-between text-[11px] text-slate-600",
                                                    children: [
                                                        _jsxs("span", { children: ["Eligible: ", _jsx("strong", { className: "text-slate-900", children: drv.eligible })] }),
                                                        _jsxs("span", { children: ["Applied: ", _jsx("strong", { className: "text-slate-900", children: drv.applied })] })
                                                    ]
                                                })
                                            ]
                                        }),
                                        _jsxs("div", {
                                            className: "flex gap-2 pt-1",
                                            children: [
                                                _jsx(Link, {
                                                    to: "/placement/drives",
                                                    className: "flex-1",
                                                    children: _jsx(Button, {
                                                        variant: "primary",
                                                        className: "w-full text-xs py-1.5",
                                                        children: "Open Drive"
                                                    })
                                                }),
                                                _jsx(Link, {
                                                    to: "/placement/applications",
                                                    className: "flex-1",
                                                    children: _jsx(Button, {
                                                        variant: "secondary",
                                                        className: "w-full text-xs py-1.5",
                                                        children: "Applicants"
                                                    })
                                                })
                                            ]
                                        })
                                    ]
                                }, index)
                            ))
                        })
                    ]
                }),

                // Bottom Grid: AI Placement Insights & Recruiter Activity
                _jsxs("div", {
                    className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                    children: [
                        // AI Placement Insights Card
                        _jsxs("div", {
                            className: "rounded-3xl bg-gradient-to-br from-[#0B0F19] to-slate-900 p-6 text-white border border-slate-800 shadow-xl lg:col-span-2 space-y-4",
                            children: [
                                _jsxs("div", {
                                    className: "flex items-center justify-between border-b border-slate-800 pb-3",
                                    children: [
                                        _jsxs("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                _jsx(Sparkles, { className: "h-4.5 w-4.5 text-indigo-400 animate-pulse" }),
                                                _jsx("span", { className: "font-bold text-sm text-white", children: "Autonomous Placement Agent Intelligence" })
                                            ]
                                        }),
                                        _jsx("span", { className: "text-[10px] font-bold text-indigo-300 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-800", children: "AUDITED PREDICTIONS" })
                                    ]
                                }),
                                _jsxs("div", {
                                    className: "p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3",
                                    children: [
                                        _jsx("h4", {
                                            className: "font-bold text-white text-sm leading-snug",
                                            children: "\"Software Developer role applications are up 14% this month following the Cloud Certification workshops.\""
                                        }),
                                        _jsx("p", {
                                            className: "text-xs text-slate-300 leading-relaxed font-normal",
                                            children: "Recommended Next Step: Launch targeted practice mock coding assessments for shortlisted Google Cloud candidates before Round 1."
                                        }),
                                        _jsxs("div", {
                                            className: "flex gap-4 pt-2 text-xs font-bold text-indigo-300",
                                            children: [
                                                _jsx(Link, { to: "/placement/ai-insights", className: "hover:text-white transition-colors", children: "Open AI Intelligence Dashboard →" }),
                                                _jsx(Link, { to: "/placement/readiness", className: "hover:text-white transition-colors", children: "View Readiness Benchmarks →" })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),

                        // Recruiter Activity Card
                        _jsxs(Card, {
                            className: "border border-slate-200/80 shadow-subtle lg:col-span-1",
                            children: [
                                _jsx(CardHeader, {
                                    className: "border-b border-slate-100",
                                    children: _jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            _jsx(Users, { className: "h-4.5 w-4.5 text-indigo-600" }),
                                            _jsx(CardTitle, { children: "Recruiter Feed" })
                                        ]
                                    })
                                }),
                                _jsx(CardContent, {
                                    className: "p-5",
                                    children: _jsx("div", {
                                        className: "space-y-4",
                                        children: recentRecruiterActivity.map((item, idx) => (
                                            _jsxs("div", {
                                                className: "flex gap-3 items-start text-xs",
                                                children: [
                                                    _jsx("div", { className: `w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.status === 'PENDING' ? 'bg-amber-500' : 'bg-emerald-500'}` }),
                                                    _jsxs("div", {
                                                        className: "flex-1 space-y-0.5",
                                                        children: [
                                                            _jsxs("div", {
                                                                className: "flex justify-between font-bold text-slate-900",
                                                                children: [
                                                                    _jsx("span", { children: item.company }),
                                                                    _jsx("span", { className: "text-[9.5px] text-slate-400 font-normal", children: item.time })
                                                                ]
                                                            }),
                                                            _jsx("p", { className: "text-slate-500 text-[11px]", children: item.event })
                                                        ]
                                                    })
                                                ]
                                            }, idx)
                                        ))
                                    })
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    );
};

export default PlacementDashboard;
