import React from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

const EASE_APPLE = [0.16, 1, 0.3, 1];

export const Card = ({ children, className, hover = false, bezel = false, glass = false, animate = false, delay = 0, ...props }) => {
    const MotionTag = animate ? motion.div : 'div';
    const motionProps = animate ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px 0px' },
        transition: { duration: 0.5, delay, ease: EASE_APPLE },
    } : {};

    const hoverProps = hover && animate ? {
        whileHover: { y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } },
    } : {};

    if (bezel) {
        return (
            <MotionTag
                className={twMerge(
                    'p-1 rounded-[1.5rem] bg-black/[0.03] border border-[#E1DCC9]/90 shadow-bezel-outer transition-all duration-300 ease-apple',
                    hover && 'hover:-translate-y-1 hover:shadow-card-hover hover:border-[#412D15]/40',
                    className
                )}
                {...motionProps}
                {...hoverProps}
                {...props}
            >
                <div className="rounded-[calc(1.5rem-0.25rem)] bg-white border border-[#E1DCC9]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] overflow-hidden">
                    {children}
                </div>
            </MotionTag>
        );
    }

    return (
        <MotionTag
            className={twMerge(
                glass ? 'glass-card' : 'bg-white border border-[#E1DCC9]',
                'shadow-subtle rounded-2xl overflow-hidden transition-all duration-300 ease-apple shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_3px_rgba(31,21,12,0.05)]',
                hover && 'hover:-translate-y-1 hover:shadow-card-hover hover:border-[#412D15]/50',
                className
            )}
            {...motionProps}
            {...hoverProps}
            {...props}
        >
            {children}
        </MotionTag>
    );
};

export const CardHeader = ({ children, className, ...props }) => {
    return (
        <div
            className={twMerge('px-5 py-4 border-b border-[#E1DCC9]/60 flex items-center justify-between gap-3', className)}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardTitle = ({ children, className, ...props }) => {
    return (
        <h3
            className={twMerge('text-sm font-bold text-[#1F150C] tracking-tight leading-snug', className)}
            {...props}
        >
            {children}
        </h3>
    );
};

export const CardDescription = ({ children, className, ...props }) => {
    return (
        <p
            className={twMerge('text-xs text-[#6B5336] font-normal mt-0.5 leading-relaxed', className)}
            {...props}
        >
            {children}
        </p>
    );
};

export const CardContent = ({ children, className, ...props }) => {
    return (
        <div
            className={twMerge('p-5 text-[#1F150C]', className)}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardFooter = ({ children, className, ...props }) => {
    return (
        <div
            className={twMerge('px-5 py-3.5 bg-[#FAF7F2]/80 border-t border-[#E1DCC9]/60 flex items-center justify-between', className)}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
