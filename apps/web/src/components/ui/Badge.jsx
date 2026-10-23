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
    glow = false,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center font-bold rounded-full tracking-wide transition-all select-none';

    const variants = {
        neutral: 'bg-[#F4EFE6] text-[#1F150C] border border-[#94805A]/50 dark:bg-[#1F1812] dark:text-[#FAF7F2] dark:border-[#8F7554]/50 shadow-[0_1px_2px_rgba(31,21,12,0.03)]',
        secondary: 'bg-[#FAF7F2] text-[#412D15] border border-[#94805A]/50 dark:bg-[#1A140E] dark:text-[#E1DCC9] dark:border-[#8F7554]/50',
        bronze: 'bg-[#412D15]/10 text-[#412D15] border border-[#412D15]/30 dark:bg-[#412D15]/40 dark:text-[#E1DCC9] dark:border-[#8F7554]/60',
        sandstone: 'bg-[#E1DCC9] text-[#1F150C] border border-[#8F7554] dark:bg-[#2A2016] dark:text-[#FAF7F2] dark:border-[#6B5336]',
        primary: 'bg-[#412D15]/10 text-[#412D15] border border-[#412D15]/30 dark:bg-[#412D15]/40 dark:text-[#E1DCC9] dark:border-[#8F7554]/60',
        indigo: 'bg-[#412D15]/10 text-[#412D15] border border-[#412D15]/30 dark:bg-[#412D15]/40 dark:text-[#E1DCC9] dark:border-[#8F7554]/60',
        success: 'bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
        warning: 'bg-amber-50 text-amber-950 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
        danger: 'bg-rose-50 text-rose-900 border border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-700 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
        info: 'bg-[#F4EFE6] text-[#412D15] border border-[#94805A]/50 dark:bg-[#1A140E] dark:text-[#E1DCC9] dark:border-[#8F7554]/50',
        dark: 'bg-[#1F150C] text-[#E1DCC9] border border-[#412D15] dark:bg-[#000000] dark:text-[#FAF7F2] dark:border-[#6B5336] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]',
        glass: 'bg-white/80 backdrop-blur-md text-[#1F150C] border border-[#94805A]/50 dark:bg-[#1F1812]/90 dark:text-[#FAF7F2] dark:border-[#8F7554]/50 shadow-xs',
    };

    const dotColors = {
        neutral: 'bg-[#6B5336] dark:bg-[#D8D1BC]',
        secondary: 'bg-[#412D15] dark:bg-[#E1DCC9]',
        bronze: 'bg-[#412D15] dark:bg-[#E1DCC9]',
        sandstone: 'bg-[#1F150C] dark:bg-[#FAF7F2]',
        primary: 'bg-[#412D15] dark:bg-[#E1DCC9]',
        indigo: 'bg-[#412D15] dark:bg-[#E1DCC9]',
        success: 'bg-emerald-700 dark:bg-emerald-400 ring-2 ring-emerald-500/20',
        warning: 'bg-amber-700 dark:bg-amber-400 ring-2 ring-amber-500/20',
        danger: 'bg-rose-700 dark:bg-rose-400 ring-2 ring-rose-500/20',
        info: 'bg-[#412D15] dark:bg-[#E1DCC9]',
        dark: 'bg-[#E1DCC9] dark:bg-[#FAF7F2]',
        glass: 'bg-[#412D15] dark:bg-[#E1DCC9]',
    };

    const sizes = {
        xs: 'px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] gap-1',
        sm: 'px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] gap-1.5',
        md: 'px-3 py-1 text-xs gap-1.5 font-semibold',
        tag: 'px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-bold rounded-full gap-1.5',
    };

    return (
        _jsxs("span", {
            className: twMerge(clsx(baseStyles, variants[variant] || variants.neutral, sizes[size] || sizes.sm, className)),
            ...props,
            children: [
                dot && _jsx("span", { className: clsx('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant] || 'bg-[#6B5336]', glow && 'animate-pulse') }),
                children
            ]
        })
    );
};

export default Badge;
