import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, hover = false, ...props }) => {
    return (
        _jsx("div", {
            className: twMerge(
                'bg-white border border-[#E1DCC9] shadow-subtle rounded-2xl overflow-hidden transition-all duration-200',
                hover && 'hover:-translate-y-0.5 hover:shadow-card-hover hover:border-[#412D15]/50',
                className
            ),
            ...props,
            children: children
        })
    );
};

export const CardHeader = ({ children, className, ...props }) => {
    return (
        _jsx("div", {
            className: twMerge('px-5 py-4 border-b border-[#E1DCC9]/70 flex items-center justify-between gap-3', className),
            ...props,
            children: children
        })
    );
};

export const CardTitle = ({ children, className, ...props }) => {
    return (
        _jsx("h3", {
            className: twMerge('text-sm font-bold text-[#1F150C] tracking-tight', className),
            ...props,
            children: children
        })
    );
};

export const CardDescription = ({ children, className, ...props }) => {
    return (
        _jsx("p", {
            className: twMerge('text-xs text-[#6B5336] font-normal mt-0.5', className),
            ...props,
            children: children
        })
    );
};

export const CardContent = ({ children, className, ...props }) => {
    return (
        _jsx("div", {
            className: twMerge('p-5 text-[#1F150C]', className),
            ...props,
            children: children
        })
    );
};

export const CardFooter = ({ children, className, ...props }) => {
    return (
        _jsx("div", {
            className: twMerge('px-5 py-3.5 bg-[#FAF7F2] border-t border-[#E1DCC9]/70 flex items-center justify-between', className),
            ...props,
            children: children
        })
    );
};
