import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@campusgent/shared';
import { useAuth } from '../context/AuthContext.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Target, Users, Mail, Lock } from 'lucide-react';

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
        _jsx("div", {
            className: "min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-indigo-600 selection:text-white",
            children: _jsxs("div", {
                className: "mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-800/50 lg:grid-cols-[1.1fr_0.9fr]",
                children: [
                    // Left Brand Showcase Pane
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
                                                className: "inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-300",
                                                children: "Autonomous Placement Suite"
                                            }),
                                            _jsx("h2", {
                                                className: "text-3xl xl:text-4xl font-black leading-tight text-white",
                                                children: "Turn your campus potential into a verified career story."
                                            }),
                                            _jsx("p", {
                                                className: "text-xs sm:text-sm leading-relaxed text-slate-300 font-normal",
                                                children: "One connected workspace for academic momentum, predictive skill scoring, AI interview coaching, and recruiter shortlists."
                                            })
                                        ]
                                    })
                                ]
                            }),
                            _jsx("div", {
                                className: "relative grid gap-2.5 sm:grid-cols-3 pt-6 border-t border-slate-800",
                                children: [
                                    { icon: Target, label: 'Predictive Matching' },
                                    { icon: Users, label: 'Mentor Sync' },
                                    { icon: ShieldCheck, label: '100% Audited AI' },
                                ].map(({ icon: Icon, label }) => (
                                    _jsxs("div", {
                                        className: "flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5 text-[11px] font-semibold text-slate-200",
                                        children: [
                                            _jsx(Icon, { className: "h-3.5 w-3.5 text-indigo-400 shrink-0" }),
                                            _jsx("span", { className: "truncate", children: label })
                                        ]
                                    }, label)
                                ))
                            })
                        ]
                    }),

                    // Right Form Pane
                    _jsx("section", {
                        className: "flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-white",
                        children: _jsxs("div", {
                            className: "w-full max-w-sm space-y-6",
                            children: [
                                // Mobile Header
                                _jsxs("div", {
                                    className: "lg:hidden flex items-center gap-2 mb-2",
                                    children: [
                                        _jsx("div", {
                                            className: "rounded-xl bg-indigo-600 p-2 text-white",
                                            children: _jsx(Sparkles, { className: "h-4 w-4" })
                                        }),
                                        _jsx("span", { className: "text-xs font-black tracking-wider text-slate-900", children: "CAMPUSGENT AI" })
                                    ]
                                }),
                                _jsxs("div", {
                                    className: "space-y-1.5",
                                    children: [
                                        _jsx("h1", {
                                            className: "text-2xl sm:text-3xl font-black tracking-tight text-slate-950",
                                            children: "Welcome back"
                                        }),
                                        _jsx("p", {
                                            className: "text-xs text-slate-500 font-normal",
                                            children: "Sign in to access your dashboard and career insights."
                                        })
                                    ]
                                }),
                                apiError && (
                                    _jsx("div", {
                                        role: "alert",
                                        className: "rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 animate-fade-in",
                                        children: apiError
                                    })
                                ),
                                _jsxs("form", {
                                    onSubmit: handleSubmit(onSubmit),
                                    className: "space-y-4",
                                    children: [
                                        _jsx(Input, {
                                            label: "Email Address",
                                            type: "email",
                                            placeholder: "name@university.edu",
                                            icon: Mail,
                                            error: errors.email?.message,
                                            ...register('email')
                                        }),
                                        _jsx(Input, {
                                            label: "Password",
                                            type: "password",
                                            placeholder: "••••••••",
                                            icon: Lock,
                                            error: errors.password?.message,
                                            ...register('password')
                                        }),
                                        _jsxs(Button, {
                                            type: "submit",
                                            variant: "primary",
                                            className: "w-full py-2.5 mt-2",
                                            isLoading: isSubmitting,
                                            children: [
                                                "Sign In Securely",
                                                _jsx(ArrowRight, { className: "h-4 w-4 ml-1" })
                                            ]
                                        })
                                    ]
                                }),
                                _jsxs("div", {
                                    className: "flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400 pt-2",
                                    children: [
                                        _jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-emerald-500" }),
                                        "Encrypted session with token rotation"
                                    ]
                                }),
                                _jsxs("p", {
                                    className: "text-center text-xs text-slate-500 border-t border-slate-100 pt-4 font-normal",
                                    children: [
                                        "Don't have an account?",
                                        ' ',
                                        _jsx(Link, {
                                            to: "/register",
                                            className: "font-bold text-indigo-600 hover:text-indigo-800 transition-colors",
                                            children: "Register Here"
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

export default Login;
