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
        indigo: 'from-[#000000] via-[#1F150C] to-[#412D15] border-[#412D15]/70 shadow-[#1F150C]/25',
        espresso: 'from-[#000000] via-[#1F150C] to-[#31210F] border-[#412D15]/70 shadow-[#1F150C]/25',
        bronze: 'from-[#1F150C] via-[#31210F] to-[#412D15] border-[#412D15]/80 shadow-[#1F150C]/25',
        teal: 'from-[#000000] via-[#1F150C] to-[#412D15] border-[#412D15]/70 shadow-[#1F150C]/25',
        slate: 'from-[#000000] via-[#1F150C] to-[#261A0C] border-[#412D15]/70 shadow-[#1F150C]/25',
    };

    return (
        _jsxs("section", {
            className: `relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${tones[tone] || tones.indigo} p-6 sm:p-8 text-white border shadow-xl`,
            children: [
                _jsx("div", { className: "absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#E1DCC9]/10 blur-3xl pointer-events-none" }),
                _jsx("div", { className: "absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#412D15]/30 blur-3xl pointer-events-none" }),
                _jsx("div", { className: "absolute top-1/2 left-0 h-40 w-40 rounded-full bg-[#8F7554]/15 blur-3xl pointer-events-none" }),
                _jsxs("div", {
                    className: "relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end",
                    children: [
                        _jsxs("div", {
                            className: "max-w-2xl space-y-3",
                            children: [
                                _jsxs("div", {
                                    className: "inline-flex items-center gap-2 rounded-full border border-[#E1DCC9]/20 bg-[#E1DCC9]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E1DCC9] backdrop-blur-md",
                                    children: [
                                        _jsx(Icon, { className: "h-3.5 w-3.5 text-[#E1DCC9] animate-pulse" }),
                                        eyebrow
                                    ]
                                }),
                                _jsx("h1", {
                                    className: "text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight",
                                    children: title
                                }),
                                _jsx("p", {
                                    className: "max-w-xl text-xs sm:text-sm leading-relaxed text-[#E1DCC9]/80 font-normal",
                                    children: description
                                }),
                                action && (
                                    _jsxs(Link, {
                                        to: action.href,
                                        className: "mt-4 inline-flex items-center gap-2 rounded-xl bg-[#E1DCC9] px-4 py-2 text-xs font-bold text-[#1F150C] shadow-md transition-all duration-150 hover:bg-white hover:shadow-lg active:scale-95",
                                        children: [
                                            action.label,
                                            _jsx(ArrowUpRight, { className: "h-3.5 w-3.5 text-[#412D15]" })
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
        indigo: 'bg-[#FAF7F2] text-[#412D15] ring-[#E1DCC9]',
        bronze: 'bg-[#FAF7F2] text-[#412D15] ring-[#E1DCC9]',
        espresso: 'bg-[#1F150C] text-[#E1DCC9] ring-[#412D15]',
        sandstone: 'bg-[#E1DCC9] text-[#1F150C] ring-[#C9BF9F]',
        emerald: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
        amber: 'bg-amber-50 text-amber-900 ring-amber-200',
        rose: 'bg-rose-50 text-rose-700 ring-rose-200',
        cyan: 'bg-[#FAF7F2] text-[#412D15] ring-[#E1DCC9]',
        purple: 'bg-[#FAF7F2] text-[#412D15] ring-[#E1DCC9]',
        slate: 'bg-[#F4EFE6] text-[#1F150C] ring-[#E1DCC9]',
    };

    return (
        _jsx("div", {
            className: "group relative overflow-hidden rounded-2xl border border-[#E1DCC9] bg-white p-5 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover hover:border-[#412D15]/50",
            children: _jsxs("div", {
                className: "flex items-start justify-between gap-3",
                children: [
                    _jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                            _jsx("p", {
                                className: "text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#6B5336]",
                                children: label
                            }),
                            _jsx("p", {
                                className: "text-2xl sm:text-3xl font-black tracking-tight text-[#1F150C]",
                                children: value
                            }),
                            (detail || trend) && (
                                _jsxs("div", {
                                    className: "flex items-center gap-1.5 pt-0.5",
                                    children: [
                                        trend && (
                                            _jsxs("span", {
                                                className: `inline-flex items-center gap-0.5 text-[10.5px] font-bold ${trendUp ? 'text-emerald-700' : 'text-rose-700'}`,
                                                children: [
                                                    _jsx(TrendingUp, { className: `h-3 w-3 ${trendUp ? '' : 'rotate-180'}` }),
                                                    trend
                                                ]
                                            })
                                        ),
                                        detail && (
                                            _jsx("span", {
                                                className: "text-[11px] font-medium text-[#8F7554]",
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
                            className: "text-[10px] font-bold uppercase tracking-[0.18em] text-[#412D15] mb-0.5",
                            children: eyebrow
                        })
                    ),
                    _jsx("h2", {
                        className: "text-base sm:text-lg font-bold tracking-tight text-[#1F150C]",
                        children: title
                    })
                ]
            }),
            action && (
                _jsxs(Link, {
                    to: action.href,
                    className: "text-xs font-semibold text-[#412D15] hover:text-[#1F150C] transition-colors flex items-center gap-1",
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
                className: "flex items-start gap-2.5 text-xs font-medium text-[#1F150C] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E1DCC9]",
                children: [
                    _jsx(CheckCircle2, { className: "mt-0.5 h-4 w-4 shrink-0 text-[#412D15]" }),
                    _jsx("span", { className: "leading-snug", children: item })
                ]
            }, item)
        ))
    })
);

export default DashboardHero;
