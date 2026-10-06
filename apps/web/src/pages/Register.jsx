import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, UserRole } from '@campusgent/shared';
import { useAuth } from '../context/AuthContext.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Select } from '../components/ui/Select.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Sparkles, ArrowRight, User, Mail, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Register = () => {
    const { registerUser } = useAuth();
    const navigate = useNavigate();
    const [apiError, setApiError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            role: UserRole.STUDENT,
        },
    });

    const onSubmit = async (data) => {
        setApiError(null);
        try {
            await registerUser(data);
            navigate('/login');
        } catch (err) {
            setApiError(err.response?.data?.error?.message || 'Registration failed.');
        }
    };

    const roleOptions = [
        { value: UserRole.STUDENT, label: '🎓 Student' },
        { value: UserRole.FACULTY, label: '👨‍🏫 Faculty Mentor' },
        { value: UserRole.PLACEMENT_OFFICER, label: '💼 Placement Officer' },
    ];

    return (
        <div className="min-h-[100dvh] bg-[#1F150C] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-[#412D15] selection:text-[#E1DCC9] relative overflow-hidden">
            {/* Ambient specular mesh glows */}
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#412D15]/40 blur-3xl pointer-events-none animate-pulse-glow" />
            <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#E1DCC9]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 mx-auto w-full max-w-5xl double-bezel-dark p-2 sm:p-3 rounded-[2.5rem]">
                <div className="grid min-h-[calc(100vh-6rem)] w-full overflow-hidden rounded-[calc(2.5rem-0.5rem)] bg-white shadow-2xl border border-[#412D15]/60 lg:grid-cols-[1.05fr_0.95fr]">
                    {/* Left Brand Pane (Obsidian, Espresso & Bronze) */}
                    <section className="relative hidden overflow-hidden bg-[#000000] p-8 sm:p-12 text-white lg:flex lg:flex-col lg:justify-between border-r border-[#412D15]/70">
                        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#412D15]/40 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#E1DCC9]/15 blur-3xl pointer-events-none" />
                        
                        <div className="relative space-y-8">
                            <Link to="/" className="inline-flex items-center gap-2.5 group">
                                <div className="rounded-2xl bg-gradient-to-tr from-[#412D15] to-[#1F150C] border border-[#E1DCC9]/30 p-2.5 shadow-md group-hover:scale-105 transition-transform">
                                    <Sparkles className="h-5 w-5 text-[#E1DCC9] animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-xs font-black tracking-[0.16em] text-white leading-none">CAMPUSGENT</p>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#E1DCC9] mt-0.5">AI PLATFORM</p>
                                </div>
                            </Link>

                            <div className="max-w-md pt-6 space-y-3.5">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#E1DCC9]/30 bg-[#E1DCC9]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#E1DCC9]">
                                    Instant Campus Access
                                </div>
                                <h2 className="text-3xl xl:text-4xl font-black leading-tight text-white tracking-tight">
                                    Join the next generation of campus intelligence.
                                </h2>
                                <p className="text-xs sm:text-sm leading-relaxed text-[#E1DCC9]/80 font-normal">
                                    Create your verified profile to start generating skill maps, accessing placement drives, and collaborating with mentors.
                                </p>
                            </div>
                        </div>

                        <div className="relative space-y-2.5 pt-6 border-t border-[#412D15]/70 text-xs text-[#E1DCC9]/85 font-medium">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="h-4 w-4 text-[#E1DCC9] shrink-0" />
                                <span>Instant AI skill audit upon registration</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="h-4 w-4 text-[#E1DCC9] shrink-0" />
                                <span>Direct integration with active placement drives</span>
                            </div>
                        </div>
                    </section>

                    {/* Right Form Pane */}
                    <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-white">
                        <div className="w-full max-w-sm space-y-5">
                            <div className="space-y-1.5">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1F150C]">
                                    Create an Account
                                </h1>
                                <p className="text-xs text-[#6B5336] font-normal">
                                    Get started with CampusGent AI platform in seconds.
                                </p>
                            </div>

                            {apiError && (
                                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl animate-fade-in shadow-xs">
                                    {apiError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                                <Input
                                    label="Full Name"
                                    type="text"
                                    placeholder="Alex Johnson"
                                    icon={User}
                                    error={errors.name?.message}
                                    {...register('name')}
                                />
                                <Input
                                    label="University Email"
                                    type="email"
                                    placeholder="alex@university.edu"
                                    icon={Mail}
                                    error={errors.email?.message}
                                    {...register('email')}
                                />
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="Min. 8 characters"
                                    icon={Lock}
                                    error={errors.password?.message}
                                    {...register('password')}
                                />
                                <Select
                                    label="I am registering as a"
                                    options={roleOptions}
                                    error={errors.role?.message}
                                    {...register('role')}
                                />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-full py-3 mt-2"
                                    isLoading={isSubmitting}
                                    trailingIcon={ArrowRight}
                                >
                                    Create Account
                                </Button>
                            </form>

                            <p className="text-center text-xs text-[#6B5336] border-t border-[#E1DCC9] pt-4 font-normal">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-bold text-[#412D15] hover:text-[#000000] transition-colors underline"
                                >
                                    Sign In Here
                                </Link>
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Register;
