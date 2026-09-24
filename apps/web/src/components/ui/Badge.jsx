import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Badge = ({
    children,
    className,
    variant = 'neutral',
    dot = false,
    size = 'sm',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center font-semibold rounded-full tracking-wide transition-colors';

    const variants = {
        neutral: 'bg-slate-100 text-slate-700 border border-slate-200/80',
        secondary: 'bg-slate-100 text-slate-700 border border-slate-200/80',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
        warning: 'bg-amber-50 text-amber-800 border border-amber-200/80',
        danger: 'bg-rose-50 text-rose-700 border border-rose-200/80',
        info: 'bg-sky-50 text-sky-700 border border-sky-200/80',
        indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
        primary: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
        purple: 'bg-purple-50 text-purple-700 border border-purple-200/80',
        dark: 'bg-slate-900 text-white border border-slate-800',
    };

    const dotColors = {
        neutral: 'bg-slate-400',
        secondary: 'bg-slate-400',
        success: 'bg-emerald-500',
        warning: 'bg-amber-500',
        danger: 'bg-rose-500',
        info: 'bg-sky-500',
        indigo: 'bg-indigo-500',
        primary: 'bg-indigo-500',
        purple: 'bg-purple-500',
        dark: 'bg-emerald-400',
    };

    const sizes = {
        xs: 'px-2 py-0.5 text-[9.5px] gap-1',
        sm: 'px-2.5 py-0.5 text-[10.5px] gap-1.5',
        md: 'px-3 py-1 text-xs gap-1.5',
    };

    return (
        _jsxs("span", {
            className: twMerge(clsx(baseStyles, variants[variant] || variants.neutral, sizes[size] || sizes.sm, className)),
            ...props,
            children: [
                dot && _jsx("span", { className: clsx('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant] || 'bg-slate-400') }),
                children
            ]
        })
    );
};

export default Badge;
