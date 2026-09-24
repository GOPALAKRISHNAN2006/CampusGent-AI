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
        'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#412D15] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

    const variants = {
        primary:
            'bg-gradient-to-r from-[#1F150C] via-[#140D07] to-[#000000] hover:from-[#412D15] hover:to-[#1F150C] text-[#E1DCC9] border border-[#412D15]/60 shadow-sm hover:shadow-[#412D15]/25 active:scale-[0.98]',
        secondary:
            'bg-[#FAF7F2] border border-[#E1DCC9] text-[#1F150C] hover:bg-[#F4EFE6] hover:border-[#412D15]/50 hover:text-[#000000] shadow-sm active:scale-[0.98]',
        outline:
            'border border-[#412D15]/40 text-[#1F150C] hover:bg-[#F4EFE6] hover:border-[#412D15] active:scale-[0.98]',
        emerald:
            'bg-gradient-to-r from-[#412D15] to-[#1F150C] hover:from-[#6B5336] hover:to-[#412D15] text-[#E1DCC9] border border-[#412D15] shadow-sm active:scale-[0.98]',
        danger:
            'bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-600 hover:to-rose-700 text-white shadow-sm active:scale-[0.98] focus:ring-rose-600',
        ghost:
            'text-[#412D15] hover:bg-[#F4EFE6] hover:text-[#1F150C] active:scale-[0.98]',
        dark:
            'bg-[#000000] hover:bg-[#1F150C] text-[#E1DCC9] border border-[#412D15]/40 shadow-sm active:scale-[0.98]',
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
