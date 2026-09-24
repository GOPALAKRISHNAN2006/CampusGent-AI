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
        tone: 'from-[#412D15] to-[#1F150C]'
    },
    {
        icon: LineChart,
        title: 'Real-Time Readiness Intelligence',
        text: 'Continuously audits student readiness across academic CGPA, coding benchmarks, resume ATS strength, and mock interview performance.',
        badge: 'PREDICTIVE SCORING',
        tone: 'from-[#1F150C] to-[#000000]'
    },
    {
        icon: Users,
        title: 'Unified Campus Command Hub',
        text: 'Eliminates departmental silos. Gives students, faculty mentors, and placement officers a single verified source of truth.',
        badge: 'CAMPUS SYNC',
        tone: 'from-[#6B5336] to-[#412D15]'
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
            className: "min-h-screen bg-[#FAF7F2] text-[#1F150C] overflow-hidden font-sans selection:bg-[#412D15] selection:text-[#E1DCC9]",
            children: [
                // Ambient luminous background orbs in palette tones
                _jsx("div", { className: "fixed -top-40 -left-40 h-[38rem] w-[38rem] rounded-full bg-[#412D15]/10 blur-[130px] pointer-events-none" }),
                _jsx("div", { className: "fixed top-1/4 -right-40 h-[36rem] w-[36rem] rounded-full bg-[#E1DCC9]/50 blur-[140px] pointer-events-none" }),
                _jsx("div", { className: "fixed bottom-0 left-1/3 h-[32rem] w-[32rem] rounded-full bg-[#1F150C]/5 blur-[120px] pointer-events-none" }),

                // Navigation Header
                _jsxs("header", {
                    className: "relative z-30 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10 glass-navbar mt-2 sm:mt-4 rounded-2xl sm:rounded-3xl border border-[#E1DCC9] shadow-subtle",
                    children: [
                        _jsxs(Link, {
                            to: "/",
                            className: "flex items-center gap-2.5 group",
                            children: [
                                _jsx("div", {
                                    className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1F150C] to-[#412D15] text-[#E1DCC9] border border-[#E1DCC9]/30 shadow-md group-hover:scale-105 transition-transform",
                                    children: _jsx(Sparkles, { className: "h-5 w-5 animate-pulse" })
                                }),
                                _jsxs("div", {
                                    children: [
                                        _jsx("span", { className: "block text-sm font-black tracking-[0.14em] text-[#1F150C] leading-none", children: "CAMPUSGENT" }),
                                        _jsx("span", { className: "block text-[9px] font-bold uppercase tracking-[0.2em] text-[#412D15] mt-0.5", children: "AI PLATFORM" })
                                    ]
                                })
                            ]
                        }),
                        _jsxs("nav", {
                            className: "hidden md:flex items-center gap-8 text-xs font-bold text-[#6B5336]",
                            children: [
                                _jsx("a", { href: "#platform", className: "hover:text-[#1F150C] transition-colors", children: "Platform Capabilities" }),
                                _jsx("a", { href: "#personas", className: "hover:text-[#1F150C] transition-colors", children: "Who We Serve" }),
                                _jsx("a", { href: "#impact", className: "hover:text-[#1F150C] transition-colors", children: "Institutional Impact" })
                            ]
                        }),
                        _jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [
                                _jsx(Link, {
                                    to: "/login",
                                    className: "rounded-xl px-4 py-2 text-xs font-bold text-[#1F150C] hover:bg-[#F4EFE6] transition-all",
                                    children: "Sign In"
                                }),
                                _jsx(Link, {
                                    to: "/register",
                                    className: "rounded-xl bg-gradient-to-r from-[#1F150C] to-[#000000] hover:from-[#412D15] hover:to-[#1F150C] px-4 py-2 text-xs font-bold text-[#E1DCC9] border border-[#412D15] shadow-md transition-all active:scale-95",
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
                                            className: "inline-flex items-center gap-2 rounded-full border border-[#E1DCC9] bg-[#F4EFE6] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1F150C] shadow-xs",
                                            children: [
                                                _jsx("span", { className: "h-2 w-2 animate-pulse rounded-full bg-[#412D15]" }),
                                                "Next-Gen Campus Intelligence 2.0"
                                            ]
                                        }),
                                        _jsxs("h1", {
                                            className: "text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1F150C] leading-[1.08]",
                                            children: [
                                                "Accelerate Campus Potential into ",
                                                _jsx("span", {
                                                    className: "gradient-text-bronze",
                                                    children: "Verified Placement Outcomes."
                                                })
                                            ]
                                        }),
                                        _jsx("p", {
                                            className: "max-w-xl text-base sm:text-lg text-[#6B5336] leading-relaxed font-normal",
                                            children: "CampusGent AI connects academic rigor, verified portfolio evidence, mentor interventions, and placement drives into one calm, autonomous intelligence workspace."
                                        }),
                                        _jsxs("div", {
                                            className: "flex flex-col sm:flex-row gap-3.5 pt-2",
                                            children: [
                                                _jsxs(Link, {
                                                    to: "/register",
                                                    className: "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1F150C] to-[#000000] hover:from-[#412D15] hover:to-[#1F150C] px-6 py-3.5 text-sm font-bold text-[#E1DCC9] border border-[#412D15] shadow-lg hover:shadow-[#412D15]/25 transition-all hover:-translate-y-0.5 active:scale-95",
                                                    children: [
                                                        "Start Your Journey",
                                                        _jsx(ArrowRight, { className: "h-4 w-4" })
                                                    ]
                                                }),
                                                _jsxs("a", {
                                                    href: "#platform",
                                                    className: "inline-flex items-center justify-center gap-2 rounded-xl border border-[#E1DCC9] bg-[#FAF7F2] hover:bg-[#F4EFE6] px-6 py-3.5 text-sm font-bold text-[#1F150C] shadow-xs transition-all hover:border-[#412D15]/40",
                                                    children: [
                                                        "Explore Platform Capabilities",
                                                        _jsx(ChevronRight, { className: "h-4 w-4 text-[#6B5336]" })
                                                    ]
                                                })
                                            ]
                                        }),
                                        _jsxs("div", {
                                            className: "flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-[#6B5336]",
                                            children: [
                                                _jsxs("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        _jsx(CheckCircle2, { className: "h-4 w-4 text-[#412D15]" }),
                                                        "Profile-grounded AI"
                                                    ]
                                                }),
                                                _jsxs("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        _jsx(ShieldCheck, { className: "h-4 w-4 text-[#412D15]" }),
                                                        "100% Audited Insights"
                                                    ]
                                                }),
                                                _jsxs("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        _jsx(Zap, { className: "h-4 w-4 text-[#6B5336]" }),
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
                                        _jsx("div", { className: "absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#412D15]/20 to-[#E1DCC9]/30 blur-2xl" }),
                                        _jsxs("div", {
                                            className: "relative overflow-hidden rounded-3xl border border-[#412D15]/70 bg-[#1F150C] p-4 sm:p-6 text-white shadow-2xl shadow-[#1F150C]/40 space-y-4",
                                            children: [
                                                // Preview Header
                                                _jsxs("div", {
                                                    className: "flex items-center justify-between border-b border-[#412D15]/70 pb-4",
                                                    children: [
                                                        _jsxs("div", {
                                                            className: "flex items-center gap-2.5",
                                                            children: [
                                                                _jsx("div", {
                                                                    className: "h-8 w-8 rounded-xl bg-gradient-to-br from-[#412D15] to-[#1F150C] border border-[#E1DCC9]/30 flex items-center justify-center text-[#E1DCC9] font-black text-xs shadow-xs",
                                                                    children: _jsx(GraduationCap, { className: "h-4 w-4" })
                                                                }),
                                                                _jsxs("div", {
                                                                    children: [
                                                                        _jsx("p", { className: "text-xs font-bold text-white", children: "Student Command Center" }),
                                                                        _jsx("p", { className: "text-[10px] text-[#E1DCC9]/70", children: "Computer Science · Semester 6" })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        _jsxs("span", {
                                                            className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E1DCC9]/15 border border-[#E1DCC9]/30 text-[10px] font-bold text-[#E1DCC9] uppercase tracking-wider",
                                                            children: [
                                                                _jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[#E1DCC9] animate-pulse" }),
                                                                "AI Live"
                                                            ]
                                                        })
                                                    ]
                                                }),

                                                // Readiness Gauge Card
                                                _jsxs("div", {
                                                    className: "rounded-2xl bg-[#000000]/70 border border-[#412D15]/70 p-4 space-y-2",
                                                    children: [
                                                        _jsxs("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                _jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-[#C9BF9F]", children: "Placement Readiness Score" }),
                                                                _jsx("span", { className: "text-xs font-bold text-[#E1DCC9]", children: "+14% this month" })
                                                            ]
                                                        }),
                                                        _jsxs("div", {
                                                            className: "flex items-baseline gap-2",
                                                            children: [
                                                                _jsx("span", { className: "text-3xl sm:text-4xl font-black text-white", children: "88%" }),
                                                                _jsx("span", { className: "text-xs font-semibold text-[#E1DCC9]/70", children: "Top 5% candidate tier" })
                                                            ]
                                                        }),
                                                        _jsx("div", {
                                                            className: "h-2 w-full rounded-full bg-[#1F150C] overflow-hidden",
                                                            children: _jsx("div", { className: "h-full w-[88%] rounded-full bg-gradient-to-r from-[#412D15] to-[#E1DCC9]" })
                                                        })
                                                    ]
                                                }),

                                                // Split Mini Cards
                                                _jsxs("div", {
                                                    className: "grid grid-cols-2 gap-3",
                                                    children: [
                                                        _jsxs("div", {
                                                            className: "rounded-2xl bg-[#000000]/50 border border-[#412D15]/60 p-3 space-y-1",
                                                            children: [
                                                                _jsx("p", { className: "text-[9.5px] font-bold uppercase tracking-wider text-[#C9BF9F]", children: "Target Role Match" }),
                                                                _jsx("p", { className: "text-base font-black text-white", children: "Full Stack SDE" }),
                                                                _jsx("p", { className: "text-[10px] font-bold text-[#E1DCC9]", children: "92% Fit Score" })
                                                            ]
                                                        }),
                                                        _jsxs("div", {
                                                            className: "rounded-2xl bg-[#000000]/50 border border-[#412D15]/60 p-3 space-y-1",
                                                            children: [
                                                                _jsx("p", { className: "text-[9.5px] font-bold uppercase tracking-wider text-[#C9BF9F]", children: "Active Placement Drives" }),
                                                                _jsx("p", { className: "text-base font-black text-white", children: "06 Eligible" }),
                                                                _jsx("p", { className: "text-[10px] font-bold text-[#E1DCC9]", children: "Google, AWS, TCS" })
                                                            ]
                                                        })
                                                    ]
                                                }),

                                                // Autonomous Next Action Prompt
                                                _jsxs("div", {
                                                    className: "flex items-center gap-3 rounded-2xl bg-[#412D15]/30 border border-[#412D15]/70 p-3.5",
                                                    children: [
                                                        _jsx("div", {
                                                            className: "h-8 w-8 rounded-xl bg-[#412D15] flex items-center justify-center text-[#E1DCC9] shrink-0 shadow-sm",
                                                            children: _jsx(Sparkles, { className: "h-4 w-4" })
                                                        }),
                                                        _jsxs("div", {
                                                            className: "flex-1 min-w-0",
                                                            children: [
                                                                _jsx("p", { className: "text-[10.5px] font-bold text-white", children: "Recommended Next Action" }),
                                                                _jsx("p", { className: "text-[10px] text-[#E1DCC9]/80 truncate", children: "Run AI Mock Technical Interview for AWS Drive" })
                                                            ]
                                                        }),
                                                        _jsx("span", { className: "text-xs font-bold text-[#E1DCC9] shrink-0", children: "Start →" })
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
                                        _jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-[#412D15]", children: "Engineered for Institutional Excellence" }),
                                        _jsx("h2", { className: "text-3xl sm:text-4xl font-black tracking-tight text-[#1F150C]", children: "Everything your campus needs to turn intent into career outcomes." }),
                                        _jsx("p", { className: "text-sm text-[#6B5336]", children: "Purpose-built multi-agent architecture delivering personalized guidance, institutional visibility, and placement operations in one unified workspace." })
                                    ]
                                }),
                                _jsx("div", {
                                    className: "grid gap-6 md:grid-cols-3",
                                    children: capabilities.map(({ icon: Icon, title, text, badge, tone }) => (
                                        _jsxs("div", {
                                            className: "group rounded-3xl border border-[#E1DCC9] bg-white p-6 sm:p-8 shadow-subtle hover:shadow-card-hover hover:-translate-y-1 hover:border-[#412D15]/50 transition-all duration-200 space-y-4",
                                            children: [
                                                _jsxs("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        _jsx("div", {
                                                            className: `flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${tone} text-[#E1DCC9] border border-[#E1DCC9]/20 shadow-md`,
                                                            children: _jsx(Icon, { className: "h-6 w-6" })
                                                        }),
                                                        _jsx("span", {
                                                            className: "text-[9.5px] font-extrabold uppercase tracking-wider text-[#6B5336] bg-[#F4EFE6] border border-[#E1DCC9] px-2.5 py-1 rounded-full",
                                                            children: badge
                                                        })
                                                    ]
                                                }),
                                                _jsx("h3", { className: "text-lg font-bold text-[#1F150C]", children: title }),
                                                _jsx("p", { className: "text-xs leading-relaxed text-[#6B5336]", children: text })
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
                                        _jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-[#412D15]", children: "Tailored Role Experiences" }),
                                        _jsx("h2", { className: "text-3xl sm:text-4xl font-black tracking-tight text-[#1F150C]", children: "Designed for every stakeholder on campus." })
                                    ]
                                }),
                                _jsx("div", {
                                    className: "grid gap-6 lg:grid-cols-3",
                                    children: personas.map(({ role, icon: Icon, tag, headline, description, highlights }) => (
                                        _jsxs("div", {
                                            className: "rounded-3xl border border-[#E1DCC9] bg-white p-7 shadow-subtle flex flex-col justify-between space-y-6 hover:shadow-card-hover transition-all",
                                            children: [
                                                _jsxs("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        _jsxs("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                _jsx("div", {
                                                                    className: "h-10 w-10 rounded-2xl bg-[#F4EFE6] border border-[#E1DCC9] text-[#412D15] flex items-center justify-center",
                                                                    children: _jsx(Icon, { className: "h-5 w-5" })
                                                                }),
                                                                _jsxs("div", {
                                                                    children: [
                                                                        _jsx("span", { className: "text-[9.5px] font-bold uppercase tracking-wider text-[#412D15]", children: tag }),
                                                                        _jsx("h3", { className: "text-base font-extrabold text-[#1F150C]", children: role })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        _jsx("h4", { className: "text-sm font-bold text-[#1F150C] leading-snug", children: headline }),
                                                        _jsx("p", { className: "text-xs text-[#6B5336] leading-relaxed", children: description })
                                                    ]
                                                }),
                                                _jsx("div", {
                                                    className: "space-y-2 pt-4 border-t border-[#E1DCC9]/70",
                                                    children: highlights.map((h) => (
                                                        _jsxs("div", {
                                                            className: "flex items-center gap-2 text-xs font-medium text-[#1F150C]",
                                                            children: [
                                                                _jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-[#412D15] shrink-0" }),
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
                                className: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#000000] via-[#1F150C] to-[#31210F] p-8 sm:p-12 text-white border border-[#412D15]/80 shadow-2xl space-y-8",
                                children: [
                                    _jsx("div", { className: "absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E1DCC9]/10 blur-3xl pointer-events-none" }),
                                    _jsx("div", { className: "absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#412D15]/40 blur-3xl pointer-events-none" }),
                                    _jsxs("div", {
                                        className: "relative max-w-2xl space-y-3",
                                        children: [
                                            _jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-[#E1DCC9]", children: "Measurable Campus Outcomes" }),
                                            _jsx("h2", { className: "text-3xl sm:text-4xl font-black tracking-tight", children: "Ready to elevate your campus placement ecosystem?" }),
                                            _jsx("p", { className: "text-xs sm:text-sm text-[#E1DCC9]/80 font-normal leading-relaxed", children: "Join forward-thinking colleges empowering thousands of engineering and management graduates." })
                                        ]
                                    }),
                                    _jsxs("div", {
                                        className: "grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4 border-t border-[#412D15]/80",
                                        children: [
                                            _jsxs("div", {
                                                className: "space-y-1",
                                                children: [
                                                    _jsx("p", { className: "text-2xl sm:text-3xl font-black text-white", children: "98.4%" }),
                                                    _jsx("p", { className: "text-xs text-[#E1DCC9]/70 font-medium", children: "Drive Eligibility Accuracy" })
                                                ]
                                            }),
                                            _jsxs("div", {
                                                className: "space-y-1",
                                                children: [
                                                    _jsx("p", { className: "text-2xl sm:text-3xl font-black text-[#E1DCC9]", children: "4.2x" }),
                                                    _jsx("p", { className: "text-xs text-[#E1DCC9]/70 font-medium", children: "Faster Recruiter Shortlists" })
                                                ]
                                            }),
                                            _jsxs("div", {
                                                className: "space-y-1",
                                                children: [
                                                    _jsx("p", { className: "text-2xl sm:text-3xl font-black text-[#E1DCC9]", children: "100%" }),
                                                    _jsx("p", { className: "text-xs text-[#E1DCC9]/70 font-medium", children: "Audited AI Recommendations" })
                                                ]
                                            }),
                                            _jsxs("div", {
                                                className: "space-y-1",
                                                children: [
                                                    _jsx("p", { className: "text-2xl sm:text-3xl font-black text-[#E1DCC9]", children: "24 / 7" }),
                                                    _jsx("p", { className: "text-xs text-[#E1DCC9]/70 font-medium", children: "Continuous Career Intelligence" })
                                                ]
                                            })
                                        ]
                                    }),
                                    _jsxs("div", {
                                        className: "pt-4",
                                        children: [
                                            _jsxs(Link, {
                                                to: "/register",
                                                className: "inline-flex items-center gap-2 rounded-xl bg-[#E1DCC9] px-6 py-3.5 text-xs font-black text-[#1F150C] shadow-lg hover:bg-white transition-all hover:scale-105 active:scale-95",
                                                children: [
                                                    "Launch Your CampusGent Workspace",
                                                    _jsx(ArrowRight, { className: "h-4 w-4 text-[#412D15]" })
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
                    className: "border-t border-[#E1DCC9] bg-white px-5 py-8 sm:px-8 lg:px-10 relative z-20 text-xs text-[#6B5336]",
                    children: _jsxs("div", {
                        className: "mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 font-semibold",
                        children: [
                            _jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    _jsx(Sparkles, { className: "h-4 w-4 text-[#412D15]" }),
                                    _jsx("span", { className: "font-black text-[#1F150C]", children: "CampusGent AI" }),
                                    _jsx("span", { children: "· © 2026. All rights reserved." })
                                ]
                            }),
                            _jsxs("div", {
                                className: "flex items-center gap-6",
                                children: [
                                    _jsx(Link, { to: "/login", className: "hover:text-[#1F150C] transition-colors", children: "Student Portal" }),
                                    _jsx(Link, { to: "/login", className: "hover:text-[#1F150C] transition-colors", children: "Faculty Mentors" }),
                                    _jsx(Link, { to: "/login", className: "hover:text-[#1F150C] transition-colors", children: "Placement Officers" })
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
