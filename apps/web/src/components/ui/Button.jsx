import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    disabled,
    ...props
}) => {
    const baseStyles =
        'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

    const variants = {
        primary:
            'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-sm hover:shadow-indigo-500/20 active:scale-[0.98]',
        secondary:
            'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-sm active:scale-[0.98]',
        outline:
            'border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]',
        emerald:
            'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm hover:shadow-emerald-500/20 active:scale-[0.98]',
        danger:
            'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-sm active:scale-[0.98] focus:ring-rose-500',
        ghost:
            'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]',
        dark:
            'bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-[0.98]',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
        md: 'px-4 py-2 text-xs font-semibold rounded-xl gap-2',
        lg: 'px-5 py-2.5 text-sm font-bold rounded-xl gap-2.5',
        icon: 'p-2 rounded-xl',
    };

    return (
        _jsxs('button', {
            disabled: disabled || isLoading,
            className: twMerge(clsx(baseStyles, variants[variant] || variants.primary, sizes[size] || sizes.md, className)),
            ...props,
            children: [
                isLoading &&
                    _jsxs('svg', {
                        className: 'animate-spin -ml-0.5 mr-2 h-3.5 w-3.5 text-current shrink-0',
                        fill: 'none',
                        viewBox: '0 0 24 24',
                        children: [
                            _jsx('circle', {
                                className: 'opacity-25',
                                cx: '12',
                                cy: '12',
                                r: '10',
                                stroke: 'currentColor',
                                strokeWidth: '4',
                            }),
                            _jsx('path', {
                                className: 'opacity-75',
                                fill: 'currentColor',
                                d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z',
                            }),
                        ],
                    }),
                children,
            ],
        })
    );
};

export default Button;
