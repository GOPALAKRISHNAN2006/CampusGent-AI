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
    icon: Icon,
    trailingIcon: TrailingIcon,
    ...props
}) => {
    const baseStyles =
        'group relative inline-flex items-center justify-center font-semibold transition-all duration-200 ease-apple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#412D15] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

    const variants = {
        primary:
            'bg-gradient-to-r from-[#1F150C] via-[#140D07] to-[#000000] hover:from-[#412D15] hover:to-[#1F150C] text-[#E1DCC9] border border-[#412D15]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_2px_8px_rgba(31,21,12,0.15)] hover:shadow-glow hover:border-[#E1DCC9]/40 active:scale-[0.97]',
        secondary:
            'bg-white border border-[#E1DCC9] text-[#1F150C] hover:bg-[#F4EFE6] hover:border-[#412D15]/60 hover:text-[#000000] shadow-subtle hover:shadow-md active:scale-[0.97]',
        sandstone:
            'bg-[#E1DCC9] hover:bg-[#F4EFE6] text-[#1F150C] border border-[#C9BF9F] shadow-subtle hover:shadow-md active:scale-[0.97]',
        outline:
            'border border-[#412D15]/40 text-[#1F150C] bg-transparent hover:bg-[#F4EFE6] hover:border-[#412D15] active:scale-[0.97]',
        emerald:
            'bg-gradient-to-r from-[#412D15] to-[#1F150C] hover:from-[#6B5336] hover:to-[#412D15] text-[#E1DCC9] border border-[#412D15] shadow-sm active:scale-[0.97]',
        danger:
            'bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-600 hover:to-rose-700 text-white shadow-sm active:scale-[0.97] focus:ring-rose-600',
        ghost:
            'text-[#412D15] hover:bg-[#F4EFE6] hover:text-[#1F150C] active:scale-[0.97]',
        dark:
            'bg-[#000000] hover:bg-[#1F150C] text-[#E1DCC9] border border-[#412D15]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] active:scale-[0.97]',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
        md: 'px-4 py-2 text-xs font-semibold rounded-xl gap-2',
        lg: 'px-5 py-2.5 text-sm font-bold rounded-2xl gap-2.5',
        pill: 'px-5 py-2.5 text-xs font-bold rounded-full gap-2.5',
        icon: 'p-2 rounded-xl',
    };

    return (
        _jsxs('button', {
            disabled: disabled || isLoading,
            className: twMerge(clsx(baseStyles, variants[variant] || variants.primary, sizes[size] || sizes.md, className)),
            ...props,
            children: [
                isLoading && (
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
                    })
                ),
                Icon && !isLoading && _jsx(Icon, { className: 'h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105' }),
                _jsx('span', { className: 'inline-flex items-center gap-1.5', children: children }),
                TrailingIcon && (
                    _jsx('span', {
                        className: 'ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-current transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110',
                        children: _jsx(TrailingIcon, { className: 'h-3 w-3' })
                    })
                )
            ],
        })
    );
};

export default Button;
