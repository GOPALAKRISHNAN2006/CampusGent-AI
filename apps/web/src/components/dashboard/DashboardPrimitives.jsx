import React from 'react';
import { ArrowUpRight, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
    FadeIn,
    SlideIn,
    StaggerContainer,
    StaggerItem,
    AnimatedCounter,
    AnimatedProgress,
    HoverLift,
    BlurFadeIn,
    GlowPulse,
    EASE_APPLE,
    EASE_SPRING,
} from '../ui/AnimationPrimitives.jsx';

/* ═══════════════════════════════════════════════════════════════
   DashboardHero — top hero banner with animated entrance
   ═══════════════════════════════════════════════════════════════ */
export const DashboardHero = ({
    eyebrow,
    title,
    description,
    icon: Icon = Sparkles,
    action,
    children,
    tone = 'indigo',
    badgeText = 'AI LIVE INTELLIGENCE'
}) => {
    const tones = {
        indigo: 'from-[#000000] via-[#1F150C] to-[#412D15] border-[#412D15]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_20px_40px_-15px_rgba(0,0,0,0.4)]',
        espresso: 'from-[#000000] via-[#1F150C] to-[#31210F] border-[#412D15]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_20px_40px_-15px_rgba(0,0,0,0.4)]',
        bronze: 'from-[#1F150C] via-[#31210F] to-[#412D15] border-[#412D15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_20px_40px_-15px_rgba(0,0,0,0.4)]',
        teal: 'from-[#000000] via-[#1F150C] to-[#412D15] border-[#412D15]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_20px_40px_-15px_rgba(0,0,0,0.4)]',
        slate: 'from-[#000000] via-[#1F150C] to-[#261A0C] border-[#412D15]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_20px_40px_-15px_rgba(0,0,0,0.4)]',
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE_APPLE }}
            className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${tones[tone] || tones.indigo} p-6 sm:p-8 text-white border shadow-xl`}
        >
            {/* Animated ambient specular mesh orbs */}
            <motion.div
                className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#E1DCC9]/15 blur-3xl pointer-events-none"
                animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.15, 0.25, 0.15],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-[#412D15]/40 blur-3xl pointer-events-none"
                animate={{
                    scale: [1, 1.05, 1],
                    x: [0, 20, 0],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute top-1/2 left-0 h-48 w-48 rounded-full bg-[#8F7554]/20 blur-3xl pointer-events-none"
                animate={{
                    y: [0, -15, 0],
                    opacity: [0.2, 0.35, 0.2],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div className="max-w-2xl space-y-3.5">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: EASE_APPLE }}
                        className="inline-flex items-center gap-2 rounded-full border border-[#E1DCC9]/30 bg-[#E1DCC9]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E1DCC9] backdrop-blur-md shadow-xs"
                    >
                        <Icon className="h-3.5 w-3.5 text-[#E1DCC9] animate-pulse" />
                        <span>{eyebrow}</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.3, ease: EASE_APPLE }}
                        className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-[1.12]"
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4, ease: EASE_APPLE }}
                        className="max-w-xl text-xs sm:text-sm leading-relaxed text-[#E1DCC9]/85 font-normal"
                    >
                        {description}
                    </motion.p>
                    {action && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.55, ease: EASE_APPLE }}
                        >
                            <Link
                                to={action.href}
                                className="group mt-4 inline-flex items-center gap-3 rounded-full bg-[#E1DCC9] pl-4 pr-1.5 py-1.5 text-xs font-bold text-[#1F150C] shadow-md transition-all duration-200 ease-apple hover:bg-white hover:shadow-lg active:scale-95"
                            >
                                <span>{action.label}</span>
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1F150C] text-[#E1DCC9] transition-transform duration-200 group-hover:scale-105 group-hover:translate-x-0.5">
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                </span>
                            </Link>
                        </motion.div>
                    )}
                </div>
                {children && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.55, delay: 0.45, ease: EASE_SPRING }}
                        className="relative shrink-0"
                    >
                        {children}
                    </motion.div>
                )}
            </div>
        </motion.section>
    );
};

/* ═══════════════════════════════════════════════════════════════
   DashboardStat — animated stat card with counter
   ═══════════════════════════════════════════════════════════════ */
export const DashboardStat = ({
    label,
    value,
    detail,
    icon: Icon,
    tone = 'indigo',
    trend,
    trendUp = true,
    bezel = false,
    index = 0,
}) => {
    const tones = {
        indigo: 'bg-[#FAF7F2] text-[#412D15] ring-[#E1DCC9]',
        bronze: 'bg-[#FAF7F2] text-[#412D15] ring-[#E1DCC9]',
        espresso: 'bg-[#1F150C] text-[#E1DCC9] ring-[#412D15]',
        sandstone: 'bg-[#E1DCC9] text-[#1F150C] ring-[#C9BF9F]',
        emerald: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
        amber: 'bg-amber-50 text-amber-900 ring-amber-200',
        rose: 'bg-rose-50 text-rose-700 ring-rose-200',
        cyan: 'bg-[#FAF7F2] text-[#412D15] ring-[#E1DCC9]',
        purple: 'bg-[#FAF7F2] text-[#412D15] ring-[#E1DCC9]',
        slate: 'bg-[#F4EFE6] text-[#1F150C] ring-[#E1DCC9]',
    };

    const content = (
        <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B5336]">
                    {label}
                </p>
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-[#1F150C] tabular-nums">
                    {value}
                </p>
                {(detail || trend) && (
                    <div className="flex items-center gap-1.5 pt-0.5">
                        {trend && (
                            <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${trendUp ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'}`}>
                                <TrendingUp className={`h-2.5 w-2.5 ${trendUp ? '' : 'rotate-180'}`} />
                                {trend}
                            </span>
                        )}
                        {detail && (
                            <span className="text-[11px] font-medium text-[#8F7554]">
                                {detail}
                            </span>
                        )}
                    </div>
                )}
            </div>
            <motion.div
                whileHover={{ scale: 1.1, rotate: 3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className={twMerge('rounded-xl p-3 ring-1 shrink-0 shadow-xs cursor-default', tones[tone] || tones.indigo)}
            >
                {Icon && <Icon className="h-5 w-5" />}
            </motion.div>
        </div>
    );

    const cardMotion = {
        initial: { opacity: 0, y: 24, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.45, delay: 0.1 + index * 0.08, ease: EASE_APPLE },
        whileHover: { y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } },
    };

    if (bezel) {
        return (
            <motion.div {...cardMotion} className="group double-bezel">
                <div className="double-bezel-inner p-5">
                    {content}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            {...cardMotion}
            className="group relative overflow-hidden rounded-2xl border border-[#E1DCC9] bg-white p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_3px_rgba(31,21,12,0.04)] glow-on-hover"
        >
            {content}
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════════════════════
   DashboardSectionTitle — animated section headers
   ═══════════════════════════════════════════════════════════════ */
export const DashboardSectionTitle = ({ eyebrow, title, action }) => (
    <FadeIn delay={0.1} y={16} className="flex items-end justify-between gap-4 mb-4">
        <div>
            {eyebrow && (
                <p className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#412D15] mb-0.5">
                    {eyebrow}
                </p>
            )}
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#1F150C]">
                {title}
            </h2>
        </div>
        {action && (
            <Link
                to={action.href}
                className="group text-xs font-semibold text-[#412D15] hover:text-[#1F150C] transition-colors flex items-center gap-1"
            >
                <span>{action.label}</span>
                <motion.span
                    className="inline-block"
                    whileHover={{ x: 3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                    →
                </motion.span>
            </Link>
        )}
    </FadeIn>
);

/* ═══════════════════════════════════════════════════════════════
   DashboardChecklist — staggered entrance checklist
   ═══════════════════════════════════════════════════════════════ */
export const DashboardChecklist = ({ items = [] }) => (
    <StaggerContainer staggerDelay={0.06} className="space-y-2.5">
        {items.map((item) => (
            <StaggerItem key={item}>
                <motion.div
                    whileHover={{ x: 4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                    className="flex items-start gap-2.5 text-xs font-medium text-[#1F150C] bg-[#FAF7F2] p-3 rounded-xl border border-[#E1DCC9] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] transition-colors hover:bg-white cursor-default"
                >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#412D15]" />
                    <span className="leading-snug">{item}</span>
                </motion.div>
            </StaggerItem>
        ))}
    </StaggerContainer>
);

export default DashboardHero;
