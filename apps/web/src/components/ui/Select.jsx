import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Select = forwardRef(({ className, label, error, options = [], ...props }, ref) => {
    return (
        _jsxs("div", {
            className: "w-full space-y-1.5",
            children: [
                label && (
                    _jsx("label", {
                        className: "block text-xs font-semibold text-slate-700 tracking-wide",
                        children: label
                    })
                ),
                _jsx("select", {
                    ref: ref,
                    className: twMerge(
                        clsx(
                            'w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border rounded-xl shadow-xs transition-all duration-150 focus:outline-none cursor-pointer',
                            error
                                ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                                : 'border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10'
                        ),
                        className
                    ),
                    ...props,
                    children: options.map((opt) => (
                        _jsx("option", { value: opt.value, children: opt.label }, opt.value)
                    ))
                }),
                error && (
                    _jsx("p", {
                        className: "text-[11px] text-rose-600 font-medium",
                        children: error
                    })
                )
            ]
        })
    );
});

Select.displayName = 'Select';
export default Select;
