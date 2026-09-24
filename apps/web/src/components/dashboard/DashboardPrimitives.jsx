import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ArrowUpRight, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export const DashboardHero = ({
    eyebrow,
    title,
    description,
    icon: Icon = Sparkles,
    action,
    children,
    tone = 'indigo',
    badgeText = 'AI LIVE INTELLIGENCE'
}) => {
    const tones = {
        indigo: 'from-slate-950 via-slate-900 to-indigo-950 border-slate-800/80 shadow-indigo-950/20',
        emerald: 'from-slate-950 via-slate-900 to-emerald-950 border-slate-800/80 shadow-emerald-950/20',
        teal: 'from-slate-950 via-teal-950 to-slate-900 border-slate-800/80 shadow-teal-950/20',
        slate: 'from-slate-950 via-slate-900 to-slate-900 border-slate-800/80 shadow-slate-900/20',
    };

    return (
        _jsxs("section", {
            className: `relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${tones[tone] || tones.indigo} p-6 sm:p-8 text-white border shadow-xl`,
            children: [
                _jsx("div", { className: "absolute -right-16 -top-20 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" }),
                _jsx("div", { className: "absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" }),
                _jsx("div", { className: "absolute top-1/2 left-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" }),
                _jsxs("div", {
                    className: "relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end",
                    children: [
                        _jsxs("div", {
                            className: "max-w-2xl space-y-3",
                            children: [
                                _jsxs("div", {
                                    className: "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-200 backdrop-blur-md",
                                    children: [
                                        _jsx(Icon, { className: "h-3.5 w-3.5 text-cyan-300 animate-pulse" }),
                                        eyebrow
                                    ]
                                }),
                                _jsx("h1", {
                                    className: "text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight",
                                    children: title
                                }),
                                _jsx("p", {
                                    className: "max-w-xl text-xs sm:text-sm leading-relaxed text-slate-300 font-normal",
                                    children: description
                                }),
                                action && (
                                    _jsxs(Link, {
                                        to: action.href,
                                        className: "mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-md transition-all duration-150 hover:bg-indigo-50 hover:shadow-lg active:scale-95",
                                        children: [
                                            action.label,
                                            _jsx(ArrowUpRight, { className: "h-3.5 w-3.5 text-indigo-600" })
                                        ]
                                    })
                                )
                            ]
                        }),
                        children && (
                            _jsx("div", {
                                className: "relative shrink-0",
                                children: children
                            })
                        )
                    ]
                })
            ]
        })
    );
};

export const DashboardStat = ({
    label,
    value,
    detail,
    icon: Icon,
    tone = 'indigo',
    trend,
    trendUp = true
}) => {
    const tones = {
        indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-200/70',
        emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-200/70',
        amber: 'bg-amber-50 text-amber-700 ring-amber-200/70',
        rose: 'bg-rose-50 text-rose-600 ring-rose-200/70',
        cyan: 'bg-cyan-50 text-cyan-600 ring-cyan-200/70',
        purple: 'bg-purple-50 text-purple-600 ring-purple-200/70',
        slate: 'bg-slate-100 text-slate-700 ring-slate-200/80',
    };

    return (
        _jsx("div", {
            className: "group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-slate-300/80",
            children: _jsxs("div", {
                className: "flex items-start justify-between gap-3",
                children: [
                    _jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                            _jsx("p", {
                                className: "text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-500",
                                children: label
                            }),
                            _jsx("p", {
                                className: "text-2xl sm:text-3xl font-black tracking-tight text-slate-900",
                                children: value
                            }),
                            (detail || trend) && (
                                _jsxs("div", {
                                    className: "flex items-center gap-1.5 pt-0.5",
                                    children: [
                                        trend && (
                                            _jsxs("span", {
                                                className: `inline-flex items-center gap-0.5 text-[10.5px] font-bold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`,
                                                children: [
                                                    _jsx(TrendingUp, { className: `h-3 w-3 ${trendUp ? '' : 'rotate-180'}` }),
                                                    trend
                                                ]
                                            })
                                        ),
                                        detail && (
                                            _jsx("span", {
                                                className: "text-[11px] font-medium text-slate-500",
                                                children: detail
                                            })
                                        )
                                    ]
                                })
                            )
                        ]
                    }),
                    _jsx("div", {
                        className: twMerge('rounded-xl p-3 ring-1 shrink-0 transition-transform duration-200 group-hover:scale-105', tones[tone] || tones.indigo),
                        children: _jsx(Icon, { className: "h-5 w-5" })
                    })
                ]
            })
        })
    );
};

export const DashboardSectionTitle = ({ eyebrow, title, action }) => (
    _jsxs("div", {
        className: "flex items-end justify-between gap-4 mb-4",
        children: [
            _jsxs("div", {
                children: [
                    eyebrow && (
                        _jsx("p", {
                            className: "text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600 mb-0.5",
                            children: eyebrow
                        })
                    ),
                    _jsx("h2", {
                        className: "text-base sm:text-lg font-bold tracking-tight text-slate-900",
                        children: title
                    })
                ]
            }),
            action && (
                _jsxs(Link, {
                    to: action.href,
                    className: "text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1",
                    children: [
                        action.label,
                        _jsx("span", { children: "→" })
                    ]
                })
            )
        ]
    })
);

export const DashboardChecklist = ({ items = [] }) => (
    _jsx("div", {
        className: "space-y-2.5",
        children: items.map((item) => (
            _jsxs("div", {
                className: "flex items-start gap-2.5 text-xs font-medium text-slate-700 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100",
                children: [
                    _jsx(CheckCircle2, { className: "mt-0.5 h-4 w-4 shrink-0 text-emerald-500" }),
                    _jsx("span", { className: "leading-snug", children: item })
                ]
            }, item)
        ))
    })
);

export default DashboardHero;
