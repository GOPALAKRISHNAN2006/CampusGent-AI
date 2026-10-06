import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
    ArrowRight, BrainCircuit, CheckCircle2, GraduationCap,
    LineChart, Sparkles, Users, Briefcase,
    ShieldCheck, Zap, ChevronRight, Award, Compass, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    FadeIn,
    SlideIn,
    ScaleIn,
    StaggerContainer,
    StaggerItem,
    BlurFadeIn,
    HoverLift,
    MagneticButton,
    AnimatedCounter,
    AnimatedProgress,
    EASE_APPLE,
    EASE_SPRING,
    EASE_OUT_EXPO,
} from '../components/ui/AnimationPrimitives.jsx';

const capabilities = [
    {
        icon: BrainCircuit,
        title: 'Autonomous Career Copilot',
        text: 'Turns raw coursework, GitHub repositories, verified certifications, and student aspirations into an actionable, evidence-grounded placement roadmap.',
        badge: 'AI COACHING',
        tone: 'from-[#412D15] via-[#31210F] to-[#1F150C]',
        featured: true,
        metrics: '94% Milestone Completion Rate'
    },
    {
        icon: LineChart,
        title: 'Real-Time Readiness Intelligence',
        text: 'Continuously audits student readiness across academic CGPA, coding benchmarks, ATS resume strength, and mock interview performance.',
        badge: 'PREDICTIVE SCORING',
        tone: 'from-[#1F150C] to-[#000000]',
        featured: false,
        metrics: '14,000+ Profiles Audited'
    },
    {
        icon: Users,
        title: 'Unified Campus Command Hub',
        text: 'Eliminates departmental silos. Gives students, faculty mentors, and placement officers a single verified source of truth.',
        badge: 'CAMPUS SYNC',
        tone: 'from-[#6B5336] via-[#412D15] to-[#1F150C]',
        featured: false,
        metrics: '3-Way Contextual Sync'
    },
];

const personas = [
    {
        role: 'For Students',
        icon: GraduationCap,
        tag: 'CAREER ACCELERATOR',
        headline: 'Clear direction from Day 1 to Offer Letter',
        description: 'Get tailored skill gap audits, instant resume analysis, and realistic AI mock interview simulations aligned with top tech recruiters.',
        highlights: ['Target role alignment scoring', 'AI resume optimizer & ATS score', 'Interactive interview simulations'],
        cta: 'Explore Student Portal',
        link: '/login'
    },
    {
        role: 'For Faculty Mentors',
        icon: Users,
        tag: 'EARLY INTERVENTION',
        headline: 'Intervene proactively with deep context',
        description: 'Spot at-risk students before exams or placement rounds. Track attendance, marks, and academic momentum with automated AI insights.',
        highlights: ['Automated at-risk student flags', 'Comprehensive class performance trends', 'Direct student progress tracking'],
        cta: 'Open Faculty Shell',
        link: '/login'
    },
    {
        role: 'For Placement Officers',
        icon: Briefcase,
        tag: 'COMMAND CENTER',
        headline: 'Orchestrate high-yield placement drives',
        description: 'Automate student eligibility shortlists, track recruiter interviews in real time, and gain predictive analytics on campus hiring outcomes.',
        highlights: ['One-click drive candidate shortlists', 'Live recruiter pipeline tracking', 'Comprehensive CTC & yield analytics'],
        cta: 'Access Command Hub',
        link: '/login'
    },
];

const impactStats = [
    { value: '98.4', suffix: '%', label: 'Drive Eligibility Accuracy' },
    { value: '4.2', suffix: 'x', label: 'Faster Recruiter Shortlists' },
    { value: '100', suffix: '%', label: 'Audited AI Recommendations' },
    { value: '24', suffix: ' / 7', label: 'Continuous Career Intelligence' },
];

export const Home = () => {
    return (
        <div className="min-h-[100dvh] bg-[#FAF7F2] text-[#1F150C] overflow-hidden font-sans selection:bg-[#412D15] selection:text-[#E1DCC9]">
            {/* Animated ambient luminous background orbs */}
            <motion.div
                className="fixed -top-40 -left-40 h-[42rem] w-[42rem] rounded-full bg-[#412D15]/10 blur-[140px] pointer-events-none"
                animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.16, 0.1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="fixed top-1/4 -right-40 h-[40rem] w-[40rem] rounded-full bg-[#E1DCC9]/60 blur-[150px] pointer-events-none"
                animate={{ x: [0, 30, 0], opacity: [0.6, 0.75, 0.6] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="fixed bottom-0 left-1/3 h-[36rem] w-[36rem] rounded-full bg-[#1F150C]/5 blur-[130px] pointer-events-none"
                animate={{ y: [0, -25, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Floating Island Navigation Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_APPLE }}
                className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10 glass-navbar mt-3 sm:mt-5 rounded-full border border-[#E1DCC9] shadow-subtle"
            >
                <Link to="/" className="flex items-center gap-2.5 group">
                    <motion.div
                        whileHover={{ scale: 1.08, rotate: 3 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#1F150C] to-[#412D15] text-[#E1DCC9] border border-[#E1DCC9]/30 shadow-md"
                    >
                        <Sparkles className="h-5 w-5 animate-pulse text-[#E1DCC9]" />
                    </motion.div>
                    <div>
                        <span className="block text-xs sm:text-sm font-black tracking-[0.16em] text-[#1F150C] leading-none">CAMPUSGENT</span>
                        <span className="block text-[8.5px] font-bold uppercase tracking-[0.2em] text-[#412D15] mt-0.5">AI PLATFORM</span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-[#6B5336]">
                    {['Platform Capabilities', 'Who We Serve', 'Institutional Impact'].map((label, i) => (
                        <motion.a
                            key={label}
                            href={`#${['platform', 'personas', 'impact'][i]}`}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 + i * 0.08, ease: EASE_APPLE }}
                            className="hover:text-[#1F150C] transition-colors relative group"
                        >
                            {label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#412D15] rounded-full transition-all duration-300 group-hover:w-full" />
                        </motion.a>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="rounded-full px-4 py-2 text-xs font-bold text-[#1F150C] hover:bg-[#F4EFE6] transition-all"
                    >
                        Sign In
                    </Link>
                    <MagneticButton strength={0.12}>
                        <Link
                            to="/register"
                            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1F150C] via-[#140D07] to-[#000000] hover:from-[#412D15] hover:to-[#1F150C] pl-4 pr-1.5 py-1.5 text-xs font-bold text-[#E1DCC9] border border-[#412D15] shadow-md transition-all duration-200 ease-apple active:scale-95"
                        >
                            <span>Get Started</span>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-current transition-transform duration-200 group-hover:scale-110 group-hover:translate-x-0.5">
                                <ArrowRight className="h-3 w-3" />
                            </span>
                        </Link>
                    </MagneticButton>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="relative z-20 space-y-24 sm:space-y-36 py-12 sm:py-24">
                {/* Hero Section */}
                <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* Left Hero Copy */}
                    <div className="space-y-6 text-left">
                        <BlurFadeIn delay={0.1}>
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#E1DCC9] bg-white/90 px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#1F150C] shadow-xs backdrop-blur-md">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-[#412D15]" />
                                <span>Next-Gen Campus Intelligence 2.0</span>
                            </div>
                        </BlurFadeIn>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: EASE_APPLE }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1F150C] leading-[1.06]"
                        >
                            Accelerate Campus Potential into{' '}
                            <span className="text-shimmer">
                                Verified Placement Outcomes.
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.35, ease: EASE_APPLE }}
                            className="max-w-xl text-base sm:text-lg text-[#6B5336] leading-relaxed font-normal"
                        >
                            CampusGent AI connects academic rigor, verified portfolio evidence, mentor interventions, and placement drives into one calm, autonomous intelligence workspace.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.45, ease: EASE_APPLE }}
                            className="flex flex-col sm:flex-row gap-4 pt-2"
                        >
                            <MagneticButton strength={0.1}>
                                <Link
                                    to="/register"
                                    className="group inline-flex items-center justify-between gap-4 rounded-full bg-gradient-to-r from-[#1F150C] via-[#140D07] to-[#000000] hover:from-[#412D15] hover:to-[#1F150C] pl-6 pr-2 py-2.5 text-sm font-bold text-[#E1DCC9] border border-[#412D15] shadow-lg hover:shadow-glow transition-all duration-200 ease-apple hover:-translate-y-0.5 active:scale-95"
                                >
                                    <span>Start Your Journey</span>
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-current transition-transform duration-200 group-hover:scale-110 group-hover:translate-x-0.5">
                                        <ArrowRight className="h-4 w-4" />
                                    </span>
                                </Link>
                            </MagneticButton>
                            <a
                                href="#platform"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E1DCC9] bg-white/80 hover:bg-[#F4EFE6] px-6 py-3.5 text-xs font-bold text-[#1F150C] shadow-xs transition-all hover:border-[#412D15]/40 backdrop-blur-md"
                            >
                                <span>Explore Platform Capabilities</span>
                                <ChevronRight className="h-3.5 w-3.5 text-[#6B5336]" />
                            </a>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6, ease: EASE_APPLE }}
                            className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-[#6B5336]"
                        >
                            {[
                                { icon: CheckCircle2, text: 'Profile-grounded AI' },
                                { icon: ShieldCheck, text: '100% Audited Insights' },
                                { icon: Zap, text: 'Real-Time Sync' },
                            ].map(({ icon: Icon, text }, i) => (
                                <motion.div
                                    key={text}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.65 + i * 0.08, ease: EASE_APPLE }}
                                    className="flex items-center gap-2"
                                >
                                    <Icon className="h-4 w-4 text-[#412D15]" />
                                    <span>{text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Hero Double-Bezel Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 40, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: EASE_SPRING }}
                        className="relative"
                    >
                        <motion.div
                            className="absolute -inset-4 rounded-[3rem] bg-gradient-to-r from-[#412D15]/20 to-[#E1DCC9]/40 blur-2xl pointer-events-none"
                            animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.7, 0.5] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <div className="double-bezel-dark p-2 sm:p-3 rounded-[2.5rem]">
                            <div className="rounded-[calc(2.5rem-0.75rem)] bg-[#1F150C] p-5 sm:p-7 text-white shadow-2xl space-y-4 border border-[#412D15]/60">
                                {/* Preview Header */}
                                <div className="flex items-center justify-between border-b border-[#412D15]/80 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#412D15] to-[#1F150C] border border-[#E1DCC9]/30 flex items-center justify-center text-[#E1DCC9] font-black text-xs shadow-xs">
                                            <GraduationCap className="h-4.5 w-4.5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white">Student Command Center</p>
                                            <p className="text-[10px] text-[#E1DCC9]/70 font-medium">Computer Science · Semester 6</p>
                                        </div>
                                    </div>
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E1DCC9]/15 border border-[#E1DCC9]/30 text-[9.5px] font-bold text-[#E1DCC9] uppercase tracking-wider">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#E1DCC9] status-pulse" />
                                        <span>AI Live</span>
                                    </span>
                                </div>

                                {/* Readiness Gauge Card */}
                                <div className="rounded-2xl bg-[#000000]/80 border border-[#412D15]/80 p-4 space-y-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9BF9F]">Placement Readiness Score</span>
                                        <span className="text-xs font-bold text-[#E1DCC9] tabular-nums">+14% this month</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl sm:text-4xl font-black text-white tabular-nums">
                                            <AnimatedCounter target={88} suffix="%" duration={2} />
                                        </span>
                                        <span className="text-xs font-semibold text-[#E1DCC9]/70">Top 5% candidate tier</span>
                                    </div>
                                    <AnimatedProgress value={88} delay={0.8} barClassName="bg-gradient-to-r from-[#412D15] via-[#8F7554] to-[#E1DCC9]" className="bg-[#1F150C] border-[#412D15]" />
                                </div>

                                {/* Split Mini Cards */}
                                <StaggerContainer staggerDelay={0.12} delay={0.6} className="grid grid-cols-2 gap-3">
                                    <StaggerItem>
                                        <div className="rounded-2xl bg-[#000000]/60 border border-[#412D15]/60 p-3.5 space-y-1">
                                            <p className="text-[9.5px] font-bold uppercase tracking-wider text-[#C9BF9F]">Target Role Match</p>
                                            <p className="text-sm font-black text-white">Full Stack SDE</p>
                                            <p className="text-[10.5px] font-bold text-[#E1DCC9] tabular-nums">92% Fit Score</p>
                                        </div>
                                    </StaggerItem>
                                    <StaggerItem>
                                        <div className="rounded-2xl bg-[#000000]/60 border border-[#412D15]/60 p-3.5 space-y-1">
                                            <p className="text-[9.5px] font-bold uppercase tracking-wider text-[#C9BF9F]">Active Placement Drives</p>
                                            <p className="text-sm font-black text-white">06 Eligible</p>
                                            <p className="text-[10.5px] font-bold text-[#E1DCC9] truncate">Google, AWS, TCS</p>
                                        </div>
                                    </StaggerItem>
                                </StaggerContainer>

                                {/* Autonomous Next Action Prompt */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.9, ease: EASE_APPLE }}
                                    whileHover={{ scale: 1.01, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                                    className="flex items-center gap-3 rounded-2xl bg-[#412D15]/40 border border-[#412D15]/80 p-3.5 shadow-sm cursor-default"
                                >
                                    <div className="h-8 w-8 rounded-xl bg-[#412D15] flex items-center justify-center text-[#E1DCC9] shrink-0 shadow-xs">
                                        <Sparkles className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10.5px] font-bold text-white">Recommended Next Action</p>
                                        <p className="text-[10px] text-[#E1DCC9]/85 truncate font-normal">Run AI Mock Technical Interview for AWS Drive</p>
                                    </div>
                                    <span className="text-xs font-bold text-[#E1DCC9] shrink-0">Start →</span>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Platform Capabilities (Asymmetric Bento Grid) */}
                <section id="platform" className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 space-y-12">
                    <FadeIn delay={0.1} className="max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#E1DCC9] bg-[#F4EFE6] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#412D15]">
                            <Compass className="h-3 w-3" />
                            <span>Engineered for Institutional Excellence</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1F150C]">
                            Everything your campus needs to turn intent into career outcomes.
                        </h2>
                        <p className="text-sm text-[#6B5336] leading-relaxed">
                            Purpose-built multi-agent architecture delivering personalized guidance, institutional visibility, and placement operations in one unified workspace.
                        </p>
                    </FadeIn>

                    <StaggerContainer staggerDelay={0.12} className="grid gap-6 md:grid-cols-3">
                        {capabilities.map(({ icon: Icon, title, text, badge, tone, metrics, featured }) => (
                            <StaggerItem key={title} className={featured ? 'md:col-span-2' : 'md:col-span-1'}>
                                <HoverLift lift={-6}>
                                    <div className="group double-bezel h-full">
                                        <div className="double-bezel-inner p-7 sm:p-8 flex flex-col justify-between h-full space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <motion.div
                                                        whileHover={{ scale: 1.08, rotate: 5 }}
                                                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${tone} text-[#E1DCC9] border border-[#E1DCC9]/20 shadow-md`}
                                                    >
                                                        <Icon className="h-6 w-6" />
                                                    </motion.div>
                                                    <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#412D15] bg-[#F4EFE6] border border-[#E1DCC9] px-3 py-1 rounded-full shadow-xs">
                                                        {badge}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg sm:text-xl font-bold text-[#1F150C] tracking-tight">{title}</h3>
                                                <p className="text-xs sm:text-sm leading-relaxed text-[#6B5336] font-normal">{text}</p>
                                            </div>
                                            <div className="pt-4 border-t border-[#E1DCC9]/60 flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-[#412D15]">{metrics}</span>
                                                <motion.span
                                                    className="text-xs font-bold text-[#1F150C]"
                                                    whileHover={{ x: 4 }}
                                                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                                >
                                                    →
                                                </motion.span>
                                            </div>
                                        </div>
                                    </div>
                                </HoverLift>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </section>

                {/* Who We Serve (Persona Showcase) */}
                <section id="personas" className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 space-y-12">
                    <FadeIn className="text-center max-w-2xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#E1DCC9] bg-[#F4EFE6] px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#412D15]">
                            <Star className="h-3 w-3 text-[#412D15]" />
                            <span>Tailored Role Experiences</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1F150C]">
                            Designed for every stakeholder on campus.
                        </h2>
                    </FadeIn>

                    <StaggerContainer staggerDelay={0.1} className="grid gap-6 lg:grid-cols-3">
                        {personas.map(({ role, icon: Icon, tag, headline, description, highlights, cta, link }) => (
                            <StaggerItem key={role}>
                                <HoverLift lift={-6}>
                                    <div className="group double-bezel flex flex-col h-full">
                                        <div className="double-bezel-inner p-7 flex-1 flex flex-col justify-between space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <motion.div
                                                        whileHover={{ scale: 1.08, rotate: -3 }}
                                                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                                        className="h-10 w-10 rounded-2xl bg-[#F4EFE6] border border-[#E1DCC9] text-[#412D15] flex items-center justify-center shadow-xs"
                                                    >
                                                        <Icon className="h-5 w-5" />
                                                    </motion.div>
                                                    <div>
                                                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#412D15]">{tag}</span>
                                                        <h3 className="text-base font-extrabold text-[#1F150C]">{role}</h3>
                                                    </div>
                                                </div>
                                                <h4 className="text-sm font-bold text-[#1F150C] leading-snug">{headline}</h4>
                                                <p className="text-xs text-[#6B5336] leading-relaxed font-normal">{description}</p>
                                            </div>
                                            <div className="space-y-3 pt-4 border-t border-[#E1DCC9]/70">
                                                <div className="space-y-2">
                                                    {highlights.map((h) => (
                                                        <div key={h} className="flex items-center gap-2 text-xs font-medium text-[#1F150C]">
                                                            <CheckCircle2 className="h-3.5 w-3.5 text-[#412D15] shrink-0" />
                                                            <span>{h}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Link
                                                    to={link}
                                                    className="mt-3 block text-center rounded-xl bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E1DCC9] py-2 text-xs font-bold text-[#1F150C] transition-colors"
                                                >
                                                    {cta} →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </HoverLift>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </section>

                {/* Institutional Impact Stats Banner */}
                <section id="impact" className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                    <ScaleIn>
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#000000] via-[#1F150C] to-[#31210F] p-8 sm:p-14 text-white border border-[#412D15]/80 shadow-2xl space-y-8">
                            <motion.div
                                className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#E1DCC9]/15 blur-3xl pointer-events-none"
                                animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <motion.div
                                className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-[#412D15]/50 blur-3xl pointer-events-none"
                                animate={{ x: [0, 15, 0], opacity: [0.5, 0.65, 0.5] }}
                                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            />

                            <FadeIn className="relative max-w-2xl space-y-3">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#E1DCC9]/30 bg-[#E1DCC9]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E1DCC9]">
                                    <Award className="h-3.5 w-3.5" />
                                    <span>Measurable Campus Outcomes</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                                    Ready to elevate your campus placement ecosystem?
                                </h2>
                                <p className="text-xs sm:text-sm text-[#E1DCC9]/85 font-normal leading-relaxed">
                                    Join forward-thinking colleges empowering thousands of engineering and management graduates.
                                </p>
                            </FadeIn>

                            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4 border-t border-[#412D15]/80">
                                {impactStats.map(({ value, suffix, label }) => (
                                    <StaggerItem key={label} className="space-y-1">
                                        <p className="text-3xl sm:text-4xl font-black text-white tabular-nums">
                                            <AnimatedCounter target={parseFloat(value)} suffix={suffix} duration={2} decimals={value.includes('.') ? 1 : 0} />
                                        </p>
                                        <p className="text-xs text-[#E1DCC9]/75 font-medium">{label}</p>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>

                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.4, ease: EASE_APPLE }}
                                className="pt-4"
                            >
                                <MagneticButton strength={0.1}>
                                    <Link
                                        to="/register"
                                        className="group inline-flex items-center gap-3 rounded-full bg-[#E1DCC9] pl-6 pr-2 py-2.5 text-xs font-black text-[#1F150C] shadow-lg transition-all duration-200 ease-apple hover:bg-white hover:shadow-glow active:scale-95"
                                    >
                                        <span>Launch Your CampusGent Workspace</span>
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F150C] text-[#E1DCC9] transition-transform duration-200 group-hover:scale-105 group-hover:translate-x-0.5">
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </span>
                                    </Link>
                                </MagneticButton>
                            </motion.div>
                        </div>
                    </ScaleIn>
                </section>
            </main>

            {/* Footer */}
            <FadeIn y={16} className="border-t border-[#E1DCC9] bg-white px-5 py-8 sm:px-8 lg:px-10 relative z-20 text-xs text-[#6B5336]">
                <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 font-semibold">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#412D15]" />
                        <span className="font-black text-[#1F150C]">CampusGent AI</span>
                        <span>· © 2026. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="hover:text-[#1F150C] transition-colors">Student Portal</Link>
                        <Link to="/login" className="hover:text-[#1F150C] transition-colors">Faculty Mentors</Link>
                        <Link to="/login" className="hover:text-[#1F150C] transition-colors">Placement Officers</Link>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
};

export default Home;
