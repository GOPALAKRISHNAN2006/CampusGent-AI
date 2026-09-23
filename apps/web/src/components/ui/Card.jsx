import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { twMerge } from 'tailwind-merge';
export const Card = ({ children, className, ...props }) => {
    return (_jsx("div", { className: twMerge('bg-white border border-brand-200 shadow-sm rounded-xl overflow-hidden', className), ...props, children: children }));
};
export const CardHeader = ({ children, className, ...props }) => {
    return (_jsx("div", { className: twMerge('px-5 py-4 border-b border-brand-100', className), ...props, children: children }));
};
export const CardTitle = ({ children, className, ...props }) => {
    return (_jsx("h3", { className: twMerge('text-base font-semibold text-brand-900', className), ...props, children: children }));
};
export const CardContent = ({ children, className, ...props }) => {
    return (_jsx("div", { className: twMerge('p-5', className), ...props, children: children }));
};
