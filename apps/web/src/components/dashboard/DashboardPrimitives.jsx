import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
export const DashboardHero = ({ eyebrow, title, description, icon: Icon = Sparkles, action, children, tone = 'indigo' }) => {
    const tones = {
        indigo: 'from-[#174709] via-[#23680f] to-[#2a7c13]',
        teal: 'from-[#102f06] via-[#2a7c13] to-[#76c457]',
        slate: 'from-[#174709] via-[#23680f] to-[#5eaa43]',
    };
    return (_jsxs("section", { className: `relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${tones[tone]} p-6 text-white shadow-xl shadow-[#2a7c13]/20 sm:p-8`, children: [_jsx("div", { className: "absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" }), _jsx("div", { className: "absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-cyan-300/10 blur-3xl" }), _jsxs("div", { className: "relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end", children: [_jsxs("div", { className: "max-w-2xl", children: [_jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80", children: [_jsx(Icon, { className: "h-3.5 w-3.5 text-cyan-200" }), eyebrow] }), _jsx("h1", { className: "text-3xl font-black tracking-tight sm:text-4xl", children: title }), _jsx("p", { className: "mt-3 max-w-xl text-sm leading-6 text-white/70", children: description }), action && (_jsxs(Link, { to: action.href, className: "mt-5 inline-flex items-center gap-2 rounded-xl bg-[#fff8cf] px-4 py-2.5 text-xs font-bold text-[#174709] transition hover:bg-white", children: [action.label, _jsx(ArrowUpRight, { className: "h-4 w-4" })] }))] }), children && _jsx("div", { className: "relative shrink-0", children: children })] })] }));
};
export const DashboardStat = ({ label, value, detail, icon: Icon, tone = 'indigo' }) => {
    const tones = {
        indigo: 'bg-[#fff8cf] text-[#2a7c13] ring-[#fbe6c2]',
        emerald: 'bg-[#eef8e8] text-[#2a7c13] ring-[#cfe9c4]',
        amber: 'bg-[#fff8cf] text-[#7a5a16] ring-[#fbe6c2]',
        rose: 'bg-[#fbe6c2] text-[#8a4d1d] ring-[#edc98c]',
        cyan: 'bg-[#eef8e8] text-[#23680f] ring-[#cfe9c4]',
    };
    return (_jsx("div", { className: "group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg", children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.16em] text-slate-400", children: label }), _jsx("p", { className: "mt-2 text-3xl font-black tracking-tight text-slate-900", children: value }), detail && _jsx("p", { className: "mt-1 text-[11px] font-medium text-slate-500", children: detail })] }), _jsx("div", { className: twMerge('rounded-xl p-3 ring-1', tones[tone]), children: _jsx(Icon, { className: "h-5 w-5" }) })] }) }));
};
export const DashboardSectionTitle = ({ eyebrow, title, action }) => (_jsxs("div", { className: "flex items-end justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600", children: eyebrow }), _jsx("h2", { className: "mt-1 text-lg font-black tracking-tight text-slate-900", children: title })] }), action && _jsxs(Link, { to: action.href, className: "text-xs font-bold text-indigo-600 hover:text-indigo-800", children: [action.label, " \u2192"] })] }));
export const DashboardChecklist = ({ items }) => (_jsx("div", { className: "space-y-3", children: items.map((item) => (_jsxs("div", { className: "flex items-start gap-2.5 text-xs font-medium text-slate-600", children: [_jsx(CheckCircle2, { className: "mt-0.5 h-4 w-4 shrink-0 text-emerald-500" }), _jsx("span", { children: item })] }, item))) }));
