import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@campusgent/shared';
import { useAuth } from '../context/AuthContext.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Target, Users, Mail, Lock } from 'lucide-react';

const EASE_APPLE = [0.16, 1, 0.3, 1];
const EASE_SPRING = [0.32, 0.72, 0, 1];

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [apiError, setApiError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data) => {
        setApiError(null);
        try {
            await login(data);
            navigate('/dashboard');
        } catch (err) {
            setApiError(err.response?.data?.error?.message || 'Login failed, check your credentials.');
        }
    };

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
            {/* Orbiting particle */}
            <motion.div
                className="absolute top-1/2 left-1/2 h-3 w-3 rounded-full bg-[#E1DCC9]/20 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '-60px -60px' }}
            />

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: EASE_APPLE }}
                className="relative z-10 mx-auto w-full max-w-5xl double-bezel-dark p-2 sm:p-3 rounded-[2.5rem]"
            >
                <div className="grid min-h-[calc(100vh-6rem)] w-full overflow-hidden rounded-[calc(2.5rem-0.5rem)] bg-white shadow-2xl border border-[#412D15]/60 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* Left Brand Showcase Pane (Obsidian, Espresso & Bronze) */}
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
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5, ease: EASE_APPLE }}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#E1DCC9]/30 bg-[#E1DCC9]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E1DCC9]"
                                >
                                    Autonomous Placement Suite
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.55, ease: EASE_APPLE }}
                                    className="text-3xl xl:text-4xl font-black leading-tight text-white tracking-tight"
                                >
                                    Turn your campus potential into a verified career story.
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.65, ease: EASE_APPLE }}
                                    className="text-xs sm:text-sm leading-relaxed text-[#E1DCC9]/80 font-normal"
                                >
                                    One connected workspace for academic momentum, predictive skill scoring, AI interview coaching, and recruiter shortlists.
                                </motion.p>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8, ease: EASE_APPLE }}
                            className="relative grid gap-2.5 sm:grid-cols-3 pt-6 border-t border-[#412D15]/70"
                        >
                            {[
                                { icon: Target, label: 'Predictive Matching' },
                                { icon: Users, label: 'Mentor Sync' },
                                { icon: ShieldCheck, label: '100% Audited AI' },
                            ].map(({ icon: Icon, label }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.9 + i * 0.1, ease: EASE_APPLE }}
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
                            className="w-full max-w-sm space-y-6"
                        >
                            {/* Mobile Header */}
                            <div className="lg:hidden flex items-center gap-2 mb-2">
                                <div className="rounded-xl bg-[#1F150C] p-2 text-[#E1DCC9]">
                                    <Sparkles className="h-4 w-4" />
                                </div>
                                <span className="text-xs font-black tracking-wider text-[#1F150C]">CAMPUSGENT AI</span>
                            </div>

                            <div className="space-y-1.5">
                                <motion.h1
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5, ease: EASE_APPLE }}
                                    className="text-2xl sm:text-3xl font-black tracking-tight text-[#1F150C]"
                                >
                                    Welcome back
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.6, ease: EASE_APPLE }}
                                    className="text-xs text-[#6B5336] font-normal"
                                >
                                    Sign in to access your dashboard and career insights.
                                </motion.p>
                            </div>

                            <AnimatePresence>
                                {apiError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                        transition={{ duration: 0.25, ease: EASE_APPLE }}
                                        role="alert"
                                        className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800 shadow-xs"
                                    >
                                        {apiError}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.form
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.65, ease: EASE_APPLE }}
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="name@university.edu"
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
                                    className="w-full py-3 mt-2"
                                    isLoading={isSubmitting}
                                    trailingIcon={ArrowRight}
                                >
                                    Sign In Securely
                                </Button>
                            </motion.form>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.85, ease: EASE_APPLE }}
                                className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#8F7554] pt-2"
                            >
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#412D15]" />
                                <span>Encrypted session with token rotation</span>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.95, ease: EASE_APPLE }}
                                className="text-center text-xs text-[#6B5336] border-t border-[#E1DCC9] pt-4 font-normal"
                            >
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="font-bold text-[#412D15] hover:text-[#000000] transition-colors underline"
                                >
                                    Register Here
                                </Link>
                            </motion.p>
                        </motion.div>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
