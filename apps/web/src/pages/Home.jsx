import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import {
    ArrowRight, BrainCircuit, CheckCircle2, GraduationCap,
    LineChart, LockKeyhole, Sparkles, Users, Briefcase,
    TrendingUp, ShieldCheck, Zap, Award, ChevronRight, FileText, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const capabilities = [
    {
        icon: BrainCircuit,
        title: 'Autonomous Career Copilot',
        text: 'Turns raw coursework, GitHub repositories, certifications, and student aspirations into an actionable, evidence-grounded placement roadmap.',
        badge: 'AI COACHING',
        tone: 'from-indigo-500 to-indigo-700'
    },
    {
        icon: LineChart,
        title: 'Real-Time Readiness Intelligence',
        text: 'Continuously audits student readiness across academic CGPA, coding benchmarks, resume ATS strength, and mock interview performance.',
        badge: 'PREDICTIVE SCORING',
        tone: 'from-emerald-500 to-teal-700'
    },
    {
        icon: Users,
        title: 'Unified Campus Command Hub',
        text: 'Eliminates departmental silos. Gives students, faculty mentors, and placement officers a single verified source of truth.',
        badge: 'CAMPUS SYNC',
        tone: 'from-blue-500 to-cyan-700'
    },
];

const personas = [
    {
        role: 'For Students',
        icon: GraduationCap,
        tag: 'CAREER ACCELERATOR',
        headline: 'Clear direction from Day 1 to Offer Letter',
        description: 'Get tailored skill gap audits, instant resume analysis, and realistic AI mock interview simulations aligned with top tech recruiters.',
        highlights: ['Target role alignment scoring', 'AI resume optimizer & ATS score', 'Interactive interview simulations']
    },
    {
        role: 'For Faculty Mentors',
        icon: Users,
        tag: 'EARLY INTERVENTION',
        headline: 'Intervene proactively with deep context',
        description: 'Spot at-risk students before exams or placement rounds. Track attendance, marks, and academic momentum with automated AI insights.',
        highlights: ['Automated at-risk student flags', 'Comprehensive class performance trends', 'Direct student progress tracking']
    },
    {
        role: 'For Placement Officers',
        icon: Briefcase,
        tag: 'COMMAND CENTER',
        headline: 'Orchestrate high-yield placement drives',
        description: 'Automate student eligibility shortlists, track recruiter interviews in real time, and gain predictive analytics on campus hiring outcomes.',
        highlights: ['One-click drive candidate shortlists', 'Live recruiter pipeline tracking', 'Comprehensive CTC & yield analytics']
    },
];

export const Home = () => {
    return (
        _jsxs("div", {
            className: "min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-indigo-600 selection:text-white",
            children: [
                // Ambient luminous background orbs
                _jsx("div", { className: "fixed -top-40 -left-40 h-[38rem] w-[38rem] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none" }),
                _jsx("div", { className: "fixed top-1/4 -right-40 h-[36rem] w-[36rem] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none" }),
                _jsx("div", { className: "fixed bottom-0 left-1/3 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" }),

                // Navigation Header
                _jsxs("header", {
                    className: "relative z-30 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10 glass-navbar mt-2 sm:mt-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-subtle",
                    children: [
                        _jsxs(Link, {
                            to: "/",
                            className: "flex items-center gap-2.5 group",
                            children: [
                                _jsx("div", {
                                    className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform",
                                    children: _jsx(Sparkles, { className: "h-5 w-5 animate-pulse" })
                                }),
                                _jsxs("div", {
                                    children: [
                                        _jsx("span", { className: "block text-sm font-black tracking-[0.14em] text-slate-900 leading-none", children: "CAMPUSGENT" }),
                                        _jsx("span", { className: "block text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-600 mt-0.5", children: "AI PLATFORM" })
                                    ]
                                })
                            ]
                        }),
                        _jsxs("nav", {
                            className: "hidden md:flex items-center gap-8 text-xs font-bold text-slate-600",
                            children: [
                                _jsx("a", { href: "#platform", className: "hover:text-indigo-600 transition-colors", children: "Platform Capabilities" }),
                                _jsx("a", { href: "#personas", className: "hover:text-indigo-600 transition-colors", children: "Who We Serve" }),
                                _jsx("a", { href: "#impact", className: "hover:text-indigo-600 transition-colors", children: "Institutional Impact" })
                            ]
                        }),
                        _jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [
                                _jsx(Link, {
                                    to: "/login",
                                    className: "rounded-xl px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-all",
                                    children: "Sign In"
                                }),
                                _jsx(Link, {
                                    to: "/register",
                                    className: "rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all active:scale-95",
                                    children: "Get Started →"
                                })
                            ]
                        })
                    ]
                }),

                // Main Content
                _jsxs("main", {
                    className: "relative z-20 space-y-24 sm:space-y-32 py-12 sm:py-20",
                    children: [
                        // Hero Section
                        _jsxs("section", {
                            className: "mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]",
                            children: [
                                // Left Hero Copy
                                _jsxs("div", {
                                    className: "space-y-6 text-left",
                                    children: [
                                        _jsxs("div", {
                                            className: "inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-700 shadow-xs",
                                            children: [
                                                _jsx("span", { className: "h-2 w-2 animate-pulse rounded-full bg-indigo-600" }),
                                                "Next-Gen Campus Intelligence 2.0"
                                            ]
                                        }),
                                        _jsxs("h1", {
                                            className: "text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.08]",
                                            children: [
                                                "Accelerate Campus Potential into ",
                                                _jsx("span", {
                                                    className: "gradient-text-indigo",
                                                    children: "Verified Placement Outcomes."
                                                })
                                            ]
                                        }),
                                        _jsx("p", {
                                            className: "max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal",
                                            children: "CampusGent AI connects academic rigor, verified portfolio evidence, mentor interventions, and placement drives into one calm, autonomous intelligence workspace."
                                        }),
                                        _jsxs("div", {
                                            className: "flex flex-col sm:flex-row gap-3.5 pt-2",
                                            children: [
                                                _jsxs(Link, {
                                                    to: "/register",
                                                    className: "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all hover:-translate-y-0.5 active:scale-95",
                                                    children: [
                                                        "Start Your Journey",
                                                        _jsx(ArrowRight, { className: "h-4 w-4" })
                                                    ]
                                                }),
                                                _jsxs("a", {
                                                    href: "#platform",
                                                    className: "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-xs transition-all hover:border-slate-300",
                                                    children: [
                                                        "Explore Platform Capabilities",
                                                        _jsx(ChevronRight, { className: "h-4 w-4 text-slate-400" })
                                                    ]
                                                })
                                            ]
                                        }),
                                        _jsxs("div", {
                                            className: "flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-600",
                                            children: [
                                                _jsxs("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        _jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-600" }),
                                                        "Profile-grounded AI"
                                                    ]
                                                }),
                                                _jsxs("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        _jsx(ShieldCheck, { className: "h-4 w-4 text-indigo-600" }),
                                                        "100% Audited Insights"
                                                    ]
                                                }),
                                                _jsxs("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        _jsx(Zap, { className: "h-4 w-4 text-amber-500" }),
                                                        "Real-Time Sync"
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                }),

                                // Right Hero Interactive Preview Mockup
                                _jsxs("div", {
                                    className: "relative",
                                    children: [
                                        _jsx("div", { className: "absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 blur-2xl" }),
                                        _jsxs("div", {
                                            className: "relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0B0F19] p-4 sm:p-6 text-white shadow-2xl shadow-indigo-950/40 space-y-4",
                                            children: [
                                                // Preview Header
                                                _jsxs("div", {
                                                    className: "flex items-center justify-between border-b border-slate-800/80 pb-4",
                                                    children: [
                                                        _jsxs("div", {
                                                            className: "flex items-center gap-2.5",
                                                            children: [
                                                                _jsx("div", {
                                                                    className: "h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-xs",
                                                                    children: _jsx(GraduationCap, { className: "h-4 w-4" })
                                                                }),
                                                                _jsxs("div", {
                                                                    children: [
                                                                        _jsx("p", { className: "text-xs font-bold text-white", children: "Student Command Center" }),
                                                                        _jsx("p", { className: "text-[10px] text-slate-400", children: "Computer Science · Semester 6" })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        _jsxs("span", {
                                                            className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-wider",
                                                            children: [
                                                                _jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" }),
                                                                "AI Live"
                                                            ]
                                                        })
                                                    ]
                                                }),

                                                // Readiness Gauge Card
                                                _jsxs("div", {
                                                    className: "rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2",
                                                    children: [
                                                        _jsxs("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                _jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400", children: "Placement Readiness Score" }),
                                                                _jsx("span", { className: "text-xs font-bold text-emerald-400", children: "+14% this month" })
                                                            ]
                                                        }),
                                                        _jsxs("div", {
                                                            className: "flex items-baseline gap-2",
                                                            children: [
                                                                _jsx("span", { className: "text-3xl sm:text-4xl font-black text-white", children: "88%" }),
                                                                _jsx("span", { className: "text-xs font-semibold text-slate-400", children: "Top 5% candidate tier" })
                                                            ]
                                                        }),
                                                        _jsx("div", {
                                                            className: "h-2 w-full rounded-full bg-slate-800 overflow-hidden",
                                                            children: _jsx("div", { className: "h-full w-[88%] rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400" })
                                                        })
                                                    ]
                                                }),

                                                // Split Mini Cards
                                                _jsxs("div", {
                                                    className: "grid grid-cols-2 gap-3",
                                                    children: [
                                                        _jsxs("div", {
                                                            className: "rounded-2xl bg-slate-900/60 border border-slate-800 p-3 space-y-1",
                                                            children: [
                                                                _jsx("p", { className: "text-[9.5px] font-bold uppercase tracking-wider text-slate-400", children: "Target Role Match" }),
                                                                _jsx("p", { className: "text-base font-black text-white", children: "Full Stack SDE" }),
                                                                _jsx("p", { className: "text-[10px] font-bold text-indigo-400", children: "92% Fit Score" })
                                                            ]
                                                        }),
                                                        _jsxs("div", {
                                                            className: "rounded-2xl bg-slate-900/60 border border-slate-800 p-3 space-y-1",
                                                            children: [
                                                                _jsx("p", { className: "text-[9.5px] font-bold uppercase tracking-wider text-slate-400", children: "Active Placement Drives" }),
                                                                _jsx("p", { className: "text-base font-black text-white", children: "06 Eligible" }),
                                                                _jsx("p", { className: "text-[10px] font-bold text-emerald-400", children: "Google, AWS, TCS" })
                                                            ]
                                                        })
                                                    ]
                                                }),

                                                // Autonomous Next Action Prompt
                                                _jsxs("div", {
                                                    className: "flex items-center gap-3 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 p-3.5",
                                                    children: [
                                                        _jsx("div", {
                                                            className: "h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm",
                                                            children: _jsx(Sparkles, { className: "h-4 w-4" })
                                                        }),
                                                        _jsxs("div", {
                                                            className: "flex-1 min-w-0",
                                                            children: [
                                                                _jsx("p", { className: "text-[10.5px] font-bold text-white", children: "Recommended Next Action" }),
                                                                _jsx("p", { className: "text-[10px] text-slate-300 truncate", children: "Run AI Mock Technical Interview for AWS Drive" })
                                                            ]
                                                        }),
                                                        _jsx("span", { className: "text-xs font-bold text-indigo-400 shrink-0", children: "Start →" })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),

                        // Platform Capabilities Grid
                        _jsxs("section", {
                            id: "platform",
                            className: "mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 space-y-12",
                            children: [
                                _jsxs("div", {
                                    className: "max-w-2xl space-y-3",
                                    children: [
                                        _jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-indigo-600", children: "Engineered for Institutional Excellence" }),
                                        _jsx("h2", { className: "text-3xl sm:text-4xl font-black tracking-tight text-slate-950", children: "Everything your campus needs to turn intent into career outcomes." }),
                                        _jsx("p", { className: "text-sm text-slate-600", children: "Purpose-built multi-agent architecture delivering personalized guidance, institutional visibility, and placement operations in one unified workspace." })
                                    ]
                                }),
                                _jsx("div", {
                                    className: "grid gap-6 md:grid-cols-3",
                                    children: capabilities.map(({ icon: Icon, title, text, badge, tone }) => (
                                        _jsxs("div", {
                                            className: "group rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-subtle hover:shadow-card-hover hover:-translate-y-1 hover:border-slate-300 transition-all duration-200 space-y-4",
                                            children: [
                                                _jsxs("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        _jsx("div", {
                                                            className: `flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${tone} text-white shadow-md`,
                                                            children: _jsx(Icon, { className: "h-6 w-6" })
                                                        }),
                                                        _jsx("span", {
                                                            className: "text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full",
                                                            children: badge
                                                        })
                                                    ]
                                                }),
                                                _jsx("h3", { className: "text-lg font-bold text-slate-900", children: title }),
                                                _jsx("p", { className: "text-xs leading-relaxed text-slate-600", children: text })
                                            ]
                                        }, title)
                                    ))
                                })
                            ]
                        }),

                        // Who We Serve (Persona Showcase)
                        _jsxs("section", {
                            id: "personas",
                            className: "mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 space-y-12",
                            children: [
                                _jsxs("div", {
                                    className: "text-center max-w-2xl mx-auto space-y-3",
                                    children: [
                                        _jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-indigo-600", children: "Tailored Role Experiences" }),
                                        _jsx("h2", { className: "text-3xl sm:text-4xl font-black tracking-tight text-slate-950", children: "Designed for every stakeholder on campus." })
                                    ]
                                }),
                                _jsx("div", {
                                    className: "grid gap-6 lg:grid-cols-3",
                                    children: personas.map(({ role, icon: Icon, tag, headline, description, highlights }) => (
                                        _jsxs("div", {
                                            className: "rounded-3xl border border-slate-200/80 bg-white p-7 shadow-subtle flex flex-col justify-between space-y-6 hover:shadow-card-hover transition-all",
                                            children: [
                                                _jsxs("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        _jsxs("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                _jsx("div", {
                                                                    className: "h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center",
                                                                    children: _jsx(Icon, { className: "h-5 w-5" })
                                                                }),
                                                                _jsxs("div", {
                                                                    children: [
                                                                        _jsx("span", { className: "text-[9.5px] font-bold uppercase tracking-wider text-indigo-600", children: tag }),
                                                                        _jsx("h3", { className: "text-base font-extrabold text-slate-900", children: role })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        _jsx("h4", { className: "text-sm font-bold text-slate-900 leading-snug", children: headline }),
                                                        _jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: description })
                                                    ]
                                                }),
                                                _jsx("div", {
                                                    className: "space-y-2 pt-4 border-t border-slate-100",
                                                    children: highlights.map((h) => (
                                                        _jsxs("div", {
                                                            className: "flex items-center gap-2 text-xs font-medium text-slate-700",
                                                            children: [
                                                                _jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-emerald-500 shrink-0" }),
                                                                _jsx("span", { children: h })
                                                            ]
                                                        }, h)
                                                    ))
                                                })
                                            ]
                                        }, role)
                                    ))
                                })
                            ]
                        }),

                        // Institutional Impact Stats Banner
                        _jsx("section", {
                            id: "impact",
                            className: "mx-auto max-w-7xl px-5 sm:px-8 lg:px-10",
                            children: _jsxs("div", {
                                className: "relative overflow-hidden rounded-3xl bg-[#0B0F19] p-8 sm:p-12 text-white border border-slate-800 shadow-2xl space-y-8",
                                children: [
                                    _jsx("div", { className: "absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" }),
                                    _jsx("div", { className: "absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" }),
                                    _jsxs("div", {
                                        className: "relative max-w-2xl space-y-3",
                                        children: [
                                            _jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-indigo-400", children: "Measurable Campus Outcomes" }),
                                            _jsx("h2", { className: "text-3xl sm:text-4xl font-black tracking-tight", children: "Ready to elevate your campus placement ecosystem?" }),
                                            _jsx("p", { className: "text-xs sm:text-sm text-slate-300 font-normal leading-relaxed", children: "Join forward-thinking colleges empowering thousands of engineering and management graduates." })
                                        ]
                                    }),
                                    _jsxs("div", {
                                        className: "grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4 border-t border-slate-800",
                                        children: [
                                            _jsxs("div", {
                                                className: "space-y-1",
                                                children: [
                                                    _jsx("p", { className: "text-2xl sm:text-3xl font-black text-white", children: "98.4%" }),
                                                    _jsx("p", { className: "text-xs text-slate-400 font-medium", children: "Drive Eligibility Accuracy" })
                                                ]
                                            }),
                                            _jsxs("div", {
                                                className: "space-y-1",
                                                children: [
                                                    _jsx("p", { className: "text-2xl sm:text-3xl font-black text-emerald-400", children: "4.2x" }),
                                                    _jsx("p", { className: "text-xs text-slate-400 font-medium", children: "Faster Recruiter Shortlists" })
                                                ]
                                            }),
                                            _jsxs("div", {
                                                className: "space-y-1",
                                                children: [
                                                    _jsx("p", { className: "text-2xl sm:text-3xl font-black text-indigo-400", children: "100%" }),
                                                    _jsx("p", { className: "text-xs text-slate-400 font-medium", children: "Audited AI Recommendations" })
                                                ]
                                            }),
                                            _jsxs("div", {
                                                className: "space-y-1",
                                                children: [
                                                    _jsx("p", { className: "text-2xl sm:text-3xl font-black text-cyan-400", children: "24 / 7" }),
                                                    _jsx("p", { className: "text-xs text-slate-400 font-medium", children: "Continuous Career Intelligence" })
                                                ]
                                            })
                                        ]
                                    }),
                                    _jsxs("div", {
                                        className: "pt-4",
                                        children: [
                                            _jsxs(Link, {
                                                to: "/register",
                                                className: "inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-xs font-black text-slate-900 shadow-lg hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95",
                                                children: [
                                                    "Launch Your CampusGent Workspace",
                                                    _jsx(ArrowRight, { className: "h-4 w-4 text-indigo-600" })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        })
                    ]
                }),

                // Footer
                _jsx("footer", {
                    className: "border-t border-slate-200/80 bg-white px-5 py-8 sm:px-8 lg:px-10 relative z-20 text-xs text-slate-500",
                    children: _jsxs("div", {
                        className: "mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 font-semibold",
                        children: [
                            _jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    _jsx(Sparkles, { className: "h-4 w-4 text-indigo-600" }),
                                    _jsx("span", { className: "font-black text-slate-800", children: "CampusGent AI" }),
                                    _jsx("span", { children: "· © 2026. All rights reserved." })
                                ]
                            }),
                            _jsxs("div", {
                                className: "flex items-center gap-6",
                                children: [
                                    _jsx(Link, { to: "/login", className: "hover:text-slate-900 transition-colors", children: "Student Portal" }),
                                    _jsx(Link, { to: "/login", className: "hover:text-slate-900 transition-colors", children: "Faculty Mentors" }),
                                    _jsx(Link, { to: "/login", className: "hover:text-slate-900 transition-colors", children: "Placement Officers" })
                                ]
                            })
                        ]
                    })
                })
            ]
        })
    );
};

export default Home;
