import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(({ className, label, error, helperText, icon: Icon, type = 'text', ...props }, ref) => {
    return (
        _jsxs("div", {
            className: "w-full space-y-1.5",
            children: [
                label && (
                    _jsx("label", {
                        className: "block text-xs font-semibold text-[#1F150C] tracking-wide",
                        children: label
                    })
                ),
                _jsxs("div", {
                    className: "relative flex items-center group",
                    children: [
                        Icon && (
                            _jsx("div", {
                                className: "absolute left-3.5 text-[#6B5336] pointer-events-none flex items-center transition-colors group-focus-within:text-[#1F150C]",
                                children: _jsx(Icon, { className: "h-4 w-4" })
                            })
                        ),
                        _jsx("input", {
                            ref: ref,
                            type: type,
                            className: twMerge(
                                clsx(
                                    'w-full px-4 py-2.5 text-xs text-[#1F150C] bg-white border rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(31,21,12,0.04)] transition-all duration-200 ease-apple placeholder:text-[#8F7554]/60 focus:outline-none',
                                    Icon && 'pl-10',
                                    error
                                        ? 'border-rose-300 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/15'
                                        : 'border-[#E1DCC9] hover:border-[#C9BF9F] focus:border-[#412D15] focus:ring-4 focus:ring-[#412D15]/10'
                                ),
                                className
                            ),
                            ...props
                        })
                    ]
                }),
                error ? (
                    _jsx("p", {
                        className: "text-[11px] text-rose-600 font-medium animate-fade-in",
                        children: error
                    })
                ) : helperText ? (
                    _jsx("p", {
                        className: "text-[11px] text-[#6B5336]",
                        children: helperText
                    })
                ) : null
            ]
        })
    );
});

Input.displayName = 'Input';
export default Input;
