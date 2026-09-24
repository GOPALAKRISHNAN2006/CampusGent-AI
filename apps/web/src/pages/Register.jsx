import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        _jsx("div", {
            className: "min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-indigo-600 selection:text-white",
            children: _jsxs("div", {
                className: "mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-800/50 lg:grid-cols-[1.05fr_0.95fr]",
                children: [
                    // Left Brand Pane
                    _jsxs("section", {
                        className: "relative hidden overflow-hidden bg-[#0B0F19] p-8 sm:p-12 text-white lg:flex lg:flex-col lg:justify-between border-r border-slate-800",
                        children: [
                            _jsx("div", { className: "absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-600/25 blur-3xl pointer-events-none" }),
                            _jsx("div", { className: "absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" }),
                            _jsxs("div", {
                                className: "relative space-y-8",
                                children: [
                                    _jsxs(Link, {
                                        to: "/",
                                        className: "inline-flex items-center gap-2.5",
                                        children: [
                                            _jsx("div", {
                                                className: "rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 p-2.5 shadow-md shadow-indigo-600/30",
                                                children: _jsx(Sparkles, { className: "h-5 w-5 text-white animate-pulse" })
                                            }),
                                            _jsxs("div", {
                                                children: [
                                                    _jsx("p", { className: "text-xs font-black tracking-[0.16em] text-white leading-none", children: "CAMPUSGENT" }),
                                                    _jsx("p", { className: "text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-400 mt-0.5", children: "AI PLATFORM" })
                                                ]
                                            })
                                        ]
                                    }),
                                    _jsxs("div", {
                                        className: "max-w-md pt-6 space-y-3",
                                        children: [
                                            _jsx("div", {
                                                className: "inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300",
                                                children: "Instant Campus Access"
                                            }),
                                            _jsx("h2", {
                                                className: "text-3xl xl:text-4xl font-black leading-tight text-white",
                                                children: "Join the next generation of campus intelligence."
                                            }),
                                            _jsx("p", {
                                                className: "text-xs sm:text-sm leading-relaxed text-slate-300 font-normal",
                                                children: "Create your verified profile to start generating skill maps, accessing placement drives, and collaborating with mentors."
                                            })
                                        ]
                                    })
                                ]
                            }),
                            _jsxs("div", {
                                className: "relative space-y-2 pt-6 border-t border-slate-800 text-xs text-slate-300 font-medium",
                                children: [
                                    _jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            _jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-400" }),
                                            "Instant AI skill audit upon registration"
                                        ]
                                    }),
                                    _jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            _jsx(CheckCircle2, { className: "h-4 w-4 text-indigo-400" }),
                                            "Direct integration with active placement drives"
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),

                    // Right Form Pane
                    _jsx("section", {
                        className: "flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-white",
                        children: _jsxs("div", {
                            className: "w-full max-w-sm space-y-5",
                            children: [
                                _jsxs("div", {
                                    className: "space-y-1.5",
                                    children: [
                                        _jsx("h1", {
                                            className: "text-2xl sm:text-3xl font-black tracking-tight text-slate-950",
                                            children: "Create an Account"
                                        }),
                                        _jsx("p", {
                                            className: "text-xs text-slate-500 font-normal",
                                            children: "Get started with CampusGent AI platform in seconds."
                                        })
                                    ]
                                }),
                                apiError && (
                                    _jsx("div", {
                                        className: "p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl animate-fade-in",
                                        children: apiError
                                    })
                                ),
                                _jsxs("form", {
                                    onSubmit: handleSubmit(onSubmit),
                                    className: "space-y-3.5",
                                    children: [
                                        _jsx(Input, {
                                            label: "Full Name",
                                            type: "text",
                                            placeholder: "Alex Johnson",
                                            icon: User,
                                            error: errors.name?.message,
                                            ...register('name')
                                        }),
                                        _jsx(Input, {
                                            label: "University Email",
                                            type: "email",
                                            placeholder: "alex@university.edu",
                                            icon: Mail,
                                            error: errors.email?.message,
                                            ...register('email')
                                        }),
                                        _jsx(Input, {
                                            label: "Password",
                                            type: "password",
                                            placeholder: "Min. 8 characters",
                                            icon: Lock,
                                            error: errors.password?.message,
                                            ...register('password')
                                        }),
                                        _jsx(Select, {
                                            label: "I am registering as a",
                                            options: roleOptions,
                                            error: errors.role?.message,
                                            ...register('role')
                                        }),
                                        _jsxs(Button, {
                                            type: "submit",
                                            variant: "primary",
                                            className: "w-full py-2.5 mt-2",
                                            isLoading: isSubmitting,
                                            children: [
                                                "Create Account",
                                                _jsx(ArrowRight, { className: "h-4 w-4 ml-1" })
                                            ]
                                        })
                                    ]
                                }),
                                _jsxs("p", {
                                    className: "text-center text-xs text-slate-500 border-t border-slate-100 pt-4 font-normal",
                                    children: [
                                        "Already have an account?",
                                        ' ',
                                        _jsx(Link, {
                                            to: "/login",
                                            className: "font-bold text-indigo-600 hover:text-indigo-800 transition-colors",
                                            children: "Sign In Here"
                                        })
                                    ]
                                })
                            ]
                        })
                    })
                ]
            })
        })
    );
};

export default Register;
