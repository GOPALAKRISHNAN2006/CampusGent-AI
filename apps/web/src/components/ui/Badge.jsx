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
        neutral: 'bg-[#F4EFE6] text-[#1F150C] border border-[#E1DCC9]',
        secondary: 'bg-[#FAF7F2] text-[#412D15] border border-[#E1DCC9]',
        bronze: 'bg-[#412D15]/10 text-[#412D15] border border-[#412D15]/30',
        sandstone: 'bg-[#E1DCC9] text-[#1F150C] border border-[#C9BF9F]',
        primary: 'bg-[#412D15]/10 text-[#412D15] border border-[#412D15]/30',
        indigo: 'bg-[#412D15]/10 text-[#412D15] border border-[#412D15]/30',
        success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
        warning: 'bg-amber-50 text-amber-900 border border-amber-200/80',
        danger: 'bg-rose-50 text-rose-800 border border-rose-200/80',
        info: 'bg-[#F4EFE6] text-[#412D15] border border-[#E1DCC9]',
        dark: 'bg-[#1F150C] text-[#E1DCC9] border border-[#412D15]',
    };

    const dotColors = {
        neutral: 'bg-[#6B5336]',
        secondary: 'bg-[#412D15]',
        bronze: 'bg-[#412D15]',
        sandstone: 'bg-[#1F150C]',
        primary: 'bg-[#412D15]',
        indigo: 'bg-[#412D15]',
        success: 'bg-emerald-600',
        warning: 'bg-amber-600',
        danger: 'bg-rose-600',
        info: 'bg-[#412D15]',
        dark: 'bg-[#E1DCC9]',
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
                dot && _jsx("span", { className: clsx('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant] || 'bg-[#6B5336]') }),
                children
            ]
        })
    );
};

export default Badge;
