import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const Badge = ({ children, className, variant = 'neutral', ...props }) => {
    const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold';
    const variants = {
        neutral: 'bg-brand-100 text-brand-700',
        success: 'bg-green-50 text-green-700 border border-green-200',
        warning: 'bg-amber-50 text-amber-700 border border-amber-200',
        danger: 'bg-red-50 text-red-700 border border-red-200',
        info: 'bg-blue-50 text-blue-700 border border-blue-200',
    };
    return (_jsx("span", { className: twMerge(clsx(baseStyles, variants[variant], className)), ...props, children: children }));
};
