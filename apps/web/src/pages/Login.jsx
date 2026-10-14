import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@campusgent/shared';
import { useAuth } from '../context/AuthContext.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Target,
    Users, Mail, Lock, GraduationCap, BookOpen, Briefcase,
    ShieldAlert, AlertCircle, KeyRound
} from 'lucide-react';

const EASE_APPLE = [0.16, 1, 0.3, 1];

const PORTALS = {
    STUDENT: {
        id: 'STUDENT',
        path: '/login/student',
        badge: 'STUDENT OPERATING PORTAL',
        title: 'Student Sign In',
        subtitle: 'Access your academic health, skill radar, and active placement drives.',
        icon: GraduationCap,
        leftTitle: 'Empowering your student career trajectory.',
        leftDescription: 'Connect course grades, code repositories, and placement opportunities into an explainable, recruiter-ready profile.',
        demoEmail: 'student@campusgent.edu',
        demoPass: 'Password@123',
        allowRegister: true,
        stats: [
            { icon: Target, label: 'Predictive Matching' },
            { icon: Users, label: 'Skill Gap Radar' },
            { icon: ShieldCheck, label: 'ATS Resume Scorer' },
        ],
    },
    FACULTY: {
        id: 'FACULTY',
        path: '/login/faculty',
        badge: 'FACULTY ACADEMIC SUITE',
        title: 'Faculty Portal Sign In',
        subtitle: 'Manage classroom rosters, internal assessment marks, and student interventions.',
        icon: BookOpen,
        leftTitle: 'Unified academic & mentorship intelligence.',
        leftDescription: 'Detect at-risk students automatically, view class performance trends, and collaborate directly with placement officers.',
        demoEmail: 'faculty@campusgent.edu',
        demoPass: 'Password@123',
        allowRegister: false,
        stats: [
            { icon: Target, label: 'At-Risk Early Warning' },
            { icon: Users, label: 'Class Attendance' },
            { icon: ShieldCheck, label: 'Faculty AI Insights' },
        ],
    },
    PLACEMENT_OFFICER: {
        id: 'PLACEMENT_OFFICER',
        path: '/login/placement',
        badge: 'PLACEMENT & RECRUITMENT COMMAND',
        title: 'Placement Officer Sign In',
        subtitle: 'Coordinate multi-stage recruitment drives, company funnels, and offer tracking.',
        icon: Briefcase,
        leftTitle: 'Autonomous placement operations hub.',
        leftDescription: 'Filter eligible candidates with zero backlogs, audit CTC distributions, and manage campus drive schedules seamlessly.',
        demoEmail: 'placement@campusgent.edu',
        demoPass: 'Password@123',
        allowRegister: false,
        stats: [
            { icon: Target, label: 'Company Recruitment' },
            { icon: Users, label: 'Candidate Funnel' },
            { icon: ShieldCheck, label: 'Salary Analytics' },
        ],
    },
    ADMIN: {
        id: 'ADMIN',
        path: '/login/admin',
        badge: 'ENTERPRISE SYSTEM ADMINISTRATION',
        title: 'Admin Command Sign In',
        subtitle: 'System health monitoring, user role management, and immutable security audit logs.',
        icon: ShieldAlert,
        leftTitle: 'System operations & security control.',
        leftDescription: 'Manage university departments, configure AI agent registries, inspect real-time system memory, and audit access trails.',
        demoEmail: 'admin@campusgent.edu',
        demoPass: 'Password@123',
        allowRegister: false,
        stats: [
            { icon: Target, label: '21 AI Agents Registry' },
            { icon: Users, label: 'Role Upgrade Guards' },
            { icon: ShieldCheck, label: 'Immutable Audit Trail' },
        ],
    },
};

export const Login = ({ role }) => {
    const { login, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [apiError, setApiError] = useState(null);

    // Determine target portal by prop or route pathname
    let currentRole = role;
    if (!currentRole) {
        if (location.pathname.includes('/faculty')) currentRole = 'FACULTY';
        else if (location.pathname.includes('/placement')) currentRole = 'PLACEMENT_OFFICER';
        else if (location.pathname.includes('/admin')) currentRole = 'ADMIN';
        else currentRole = 'STUDENT';
    }

    const portal = PORTALS[currentRole] || PORTALS.STUDENT;

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const handleFillDemo = () => {
        setValue('email', portal.demoEmail, { shouldValidate: true });
        setValue('password', portal.demoPass, { shouldValidate: true });
    };

    const onSubmit = async (data) => {
        setApiError(null);
        try {
            const userData = await login(data);
            
            // Check if user role matches portal constraint
            if (currentRole !== 'STUDENT' && userData?.role === 'STUDENT') {
                await logout();
                setApiError(`Access denied: This portal is reserved for ${portal.title.replace(' Sign In', '')} accounts. Students must log in via the Student Portal.`);
                return;
            }

            if (currentRole === 'ADMIN' && userData?.role !== 'ADMIN' && userData?.role !== 'SUPER_ADMIN') {
                await logout();
                setApiError('Access denied: Administrative privileges required.');
                return;
            }

            navigate('/dashboard');
        } catch (err) {
            setApiError(err.response?.data?.error?.message || 'Login failed, check your credentials.');
        }
    };

    const PortalIcon = portal.icon;

    return (
        <div className="min-h-[100dvh] bg-[#1F150C] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-[#412D15] selection:text-[#E1DCC9] relative overflow-hidden">
            {/* Animated ambient specular glows */}
            <motion.div
                className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#412D15]/40 blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#E1DCC9]/15 blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: EASE_APPLE }}
                className="relative z-10 mx-auto w-full max-w-5xl double-bezel-dark p-2 sm:p-3 rounded-[2.5rem]"
            >
                <div className="grid min-h-[calc(100vh-6rem)] w-full overflow-hidden rounded-[calc(2.5rem-0.5rem)] bg-white shadow-2xl border border-[#412D15]/60 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* Left Brand Showcase Pane */}
                    <section className="relative hidden overflow-hidden bg-[#000000] p-8 sm:p-12 text-white lg:flex lg:flex-col lg:justify-between border-r border-[#412D15]/70">
                        <motion.div
                            className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#412D15]/40 blur-3xl pointer-events-none"
                            animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.55, 0.4] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                            className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#E1DCC9]/15 blur-3xl pointer-events-none"
                            animate={{ y: [0, -20, 0], opacity: [0.15, 0.25, 0.15] }}
                            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: EASE_APPLE }}
                            className="relative space-y-8"
                        >
                            <Link to="/" className="inline-flex items-center gap-2.5 group">
                                <motion.div
                                    whileHover={{ scale: 1.08, rotate: 3 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                    className="rounded-2xl bg-gradient-to-tr from-[#412D15] to-[#1F150C] border border-[#E1DCC9]/30 p-2.5 shadow-md"
                                >
                                    <Sparkles className="h-5 w-5 text-[#E1DCC9] animate-pulse" />
                                </motion.div>
                                <div>
                                    <p className="text-xs font-black tracking-[0.16em] text-white leading-none">CAMPUSGENT</p>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E1DCC9] mt-0.5">AI PLATFORM</p>
                                </div>
                            </Link>
                            
                            <div className="max-w-md pt-6 space-y-3.5">
                                <motion.div
                                    key={portal.badge}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, ease: EASE_APPLE }}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#E1DCC9]/30 bg-[#E1DCC9]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E1DCC9]"
                                >
                                    <PortalIcon className="h-3 w-3" />
                                    {portal.badge}
                                </motion.div>
                                <motion.h2
                                    key={portal.leftTitle}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, ease: EASE_APPLE }}
                                    className="text-3xl xl:text-4xl font-black leading-tight text-white tracking-tight"
                                >
                                    {portal.leftTitle}
                                </motion.h2>
                                <motion.p
                                    key={portal.leftDescription}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, ease: EASE_APPLE }}
                                    className="text-xs sm:text-sm leading-relaxed text-[#E1DCC9]/80 font-normal"
                                >
                                    {portal.leftDescription}
                                </motion.p>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8, ease: EASE_APPLE }}
                            className="relative grid gap-2.5 sm:grid-cols-3 pt-6 border-t border-[#412D15]/70"
                        >
                            {portal.stats.map(({ icon: Icon, label }) => (
                                <motion.div
                                    key={label}
                                    whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                                    className="flex items-center gap-2 rounded-xl border border-[#412D15] bg-[#1F150C] px-3 py-2.5 text-[11px] font-semibold text-[#E1DCC9] cursor-default"
                                >
                                    <Icon className="h-3.5 w-3.5 text-[#E1DCC9] shrink-0" />
                                    <span className="truncate">{label}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>

                    {/* Right Form Pane */}
                    <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-white">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4, ease: EASE_APPLE }}
                            className="w-full max-w-sm space-y-5"
                        >
                            {/* Portal Switcher Tabs */}
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B5336]">Select Portal</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-[#FAF7F2] rounded-xl border border-[#E1DCC9]">
                                    {[
                                        { id: 'STUDENT', path: '/login/student', label: 'Student' },
                                        { id: 'FACULTY', path: '/login/faculty', label: 'Faculty' },
                                        { id: 'PLACEMENT_OFFICER', path: '/login/placement', label: 'Placement' },
                                        { id: 'ADMIN', path: '/login/admin', label: 'Admin' },
                                    ].map((t) => {
                                        const isActive = currentRole === t.id;
                                        return (
                                            <Link
                                                key={t.id}
                                                to={t.path}
                                                className={`text-center py-2 sm:py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all ${
                                                    isActive
                                                        ? 'bg-[#1F150C] text-[#E1DCC9] shadow-xs'
                                                        : 'text-[#6B5336] hover:bg-[#E1DCC9]/40 hover:text-[#1F150C]'
                                                }`}
                                            >
                                                {t.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-1.5 pt-1">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#412D15]/10 text-[#412D15] text-[10px] font-black uppercase tracking-wider">
                                    <PortalIcon className="h-3 w-3" />
                                    {portal.title}
                                </div>
                                <h1 className="text-2xl font-black tracking-tight text-[#1F150C]">
                                    {portal.title}
                                </h1>
                                <p className="text-xs text-[#6B5336] font-normal">
                                    {portal.subtitle}
                                </p>
                            </div>

                            <AnimatePresence>
                                {apiError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                        transition={{ duration: 0.25, ease: EASE_APPLE }}
                                        role="alert"
                                        className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800 shadow-xs flex items-start gap-2"
                                    >
                                        <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                                        <span>{apiError}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Demo credential auto-fill pill */}
                            <button
                                type="button"
                                onClick={handleFillDemo}
                                className="w-full text-left p-2.5 rounded-xl border border-dashed border-[#6B5336]/40 bg-[#FAF7F2] hover:bg-[#FAF7F2]/80 transition-colors flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <KeyRound className="h-3.5 w-3.5 text-[#412D15] group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-semibold text-[#1F150C]">
                                        Use Test Account: <span className="font-mono text-[10px] text-[#6B5336]">{portal.demoEmail}</span>
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-[#412D15] bg-[#E1DCC9]/60 px-2 py-0.5 rounded-md">Fill</span>
                            </button>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                                <Input
                                    label="Institutional Email"
                                    type="email"
                                    placeholder={portal.demoEmail}
                                    icon={Mail}
                                    error={errors.email?.message}
                                    {...register('email')}
                                />
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    icon={Lock}
                                    error={errors.password?.message}
                                    {...register('password')}
                                />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-full py-3 mt-1"
                                    isLoading={isSubmitting}
                                    trailingIcon={ArrowRight}
                                >
                                    Sign In to {portal.title.replace(' Sign In', '')}
                                </Button>
                            </form>

                            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#8F7554] pt-1">
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#412D15]" />
                                <span>Encrypted session with token rotation</span>
                            </div>

                            {portal.allowRegister ? (
                                <p className="text-center text-xs text-[#6B5336] border-t border-[#E1DCC9] pt-3.5 font-normal">
                                    New student without an account?{' '}
                                    <Link
                                        to="/register"
                                        className="font-bold text-[#412D15] hover:text-[#000000] transition-colors underline"
                                    >
                                        Register Here
                                    </Link>
                                </p>
                            ) : (
                                <div className="text-center text-[11px] text-[#6B5336] border-t border-[#E1DCC9] pt-3 leading-relaxed">
                                    <span className="font-semibold text-[#1F150C]">{portal.title.replace(' Sign In', '')}</span> accounts are pre-provisioned.
                                    <br />
                                    Need institutional access? Contact system administration.
                                </div>
                            )}
                        </motion.div>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
