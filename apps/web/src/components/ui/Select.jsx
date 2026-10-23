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
                        className: "block text-xs font-semibold text-[#1F150C] dark:text-[#FAF7F2] tracking-wide",
                        children: label
                    })
                ),
                _jsx("select", {
                    ref: ref,
                    className: twMerge(
                        clsx(
                            'w-full px-3.5 py-2.5 text-xs text-[#1F150C] dark:text-[#FAF7F2] bg-white dark:bg-[#1A140E] border rounded-xl shadow-xs transition-all duration-150 focus:outline-none cursor-pointer disabled:opacity-50',
                            error
                                ? 'border-rose-400 dark:border-rose-500 focus:border-rose-600 dark:focus:border-rose-400 focus:ring-4 focus:ring-rose-500/20'
                                : 'border-[#94805A] dark:border-[#8F7554]/70 hover:border-[#412D15] dark:hover:border-[#C9BF9F] focus:border-[#412D15] dark:focus:border-[#E1DCC9] focus:ring-4 focus:ring-[#412D15]/15 dark:focus:ring-[#E1DCC9]/20'
                        ),
                        className
                    ),
                    ...props,
                    children: options.map((opt) => (
                        _jsx("option", { value: opt.value, className: "bg-white dark:bg-[#1A140E] text-[#1F150C] dark:text-[#FAF7F2]", children: opt.label }, opt.value)
                    ))
                }),
                error && (
                    _jsx("p", {
                        className: "text-[11px] text-rose-700 dark:text-rose-300 font-medium animate-fade-in",
                        children: error
                    })
                )
            ]
        })
    );
});

Select.displayName = 'Select';
export default Select;
