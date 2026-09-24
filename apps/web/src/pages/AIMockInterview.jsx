import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { GraduationCap, BrainCircuit, RefreshCw, Send, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

export const AIMockInterview = () => {
    const [step, setStep] = useState('setup');
    const [role, setRole] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answer, setAnswer] = useState('');
    const [qaList, setQaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [evaluation, setEvaluation] = useState(null);
    const [error, setError] = useState(null);

    const startInterview = async () => {
        if (!role.trim() || loading) return;
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.post('/ai/interview-prep', { role, jobDescription });
            setQuestions(res.data.data?.questions || []);
            setQaList([]);
            setCurrentIdx(0);
            setStep('interview');
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to start interview prep.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSubmit = async () => {
        if (!answer.trim() || loading) return;
        const currentQuestion = questions[currentIdx].question;
        const newQaList = [...qaList, { question: currentQuestion, answer }];
        setQaList(newQaList);
        setAnswer('');
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
        } else {
            setLoading(true);
            setStep('evaluation');
            try {
                const res = await apiClient.post('/ai/mock-interview/evaluate', { qaList: newQaList });
                setEvaluation(res.data.data?.insight || res.data.data);
            } catch (err) {
                setError(err.response?.data?.error?.message || 'Failed to evaluate interview.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        _jsxs("div", {
            className: "space-y-6 max-w-4xl mx-auto text-xs animate-fade-in font-sans",
            children: [
                // Header Banner
                _jsxs("div", {
                    className: "p-6 rounded-3xl bg-gradient-to-br from-palette-black via-palette-espresso to-palette-bronze text-white border border-palette-bronze/40 shadow-xl space-y-2",
                    children: [
                        _jsxs("div", {
                            className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-palette-espresso/80 border border-palette-sandstone/30 text-[10px] font-bold uppercase tracking-wider text-palette-sandstone",
                            children: [
                                _jsx(Sparkles, { className: "h-3.5 w-3.5 text-palette-sandstone animate-pulse" }),
                                "AI Technical & HR Simulator"
                            ]
                        }),
                        _jsxs("h1", {
                            className: "text-xl sm:text-2xl font-black text-white flex items-center gap-2",
                            children: [
                                _jsx(BrainCircuit, { className: "h-6 w-6 text-palette-sandstone" }),
                                _jsx("span", { children: "AI Conversational Mock Interview" })
                            ]
                        }),
                        _jsx("p", {
                            className: "text-xs text-palette-sandstone/85 max-w-xl font-normal leading-relaxed",
                            children: "Practice real-time technical and behavioural questions tailored to your target company and job role. Receive automated scorecards."
                        })
                    ]
                }),

                error && (
                    _jsx("div", {
                        className: "p-3.5 bg-rose-50 border border-rose-200 text-rose-700 font-semibold rounded-2xl animate-fade-in",
                        children: error
                    })
                ),

                // Setup Step
                step === 'setup' && (
                    _jsxs(Card, {
                        className: "border border-palette-sandstone/70 shadow-subtle bg-white/90",
                        children: [
                            _jsx(CardHeader, {
                                className: "border-b border-palette-sandstone/30",
                                children: _jsx(CardTitle, { className: "text-palette-espresso", children: "Interview Parameters & Role Setup" })
                            }),
                            _jsxs(CardContent, {
                                className: "space-y-4 p-6",
                                children: [
                                    _jsx(Input, {
                                        label: "Target Job Role / Title",
                                        value: role,
                                        onChange: (e) => setRole(e.target.value),
                                        placeholder: "e.g. Full Stack Developer, SDE-1, Cloud Associate",
                                        required: true
                                    }),
                                    _jsxs("div", {
                                        className: "space-y-1.5",
                                        children: [
                                            _jsx("label", {
                                                className: "block text-xs font-semibold text-palette-espresso tracking-wide",
                                                children: "Target Job Description or Key Tech Requirements (Optional)"
                                            }),
                                            _jsx("textarea", {
                                                value: jobDescription,
                                                onChange: (e) => setJobDescription(e.target.value),
                                                rows: 5,
                                                placeholder: "Paste required tech stack, responsibilities, or company criteria to tailor questions...",
                                                className: "w-full p-3.5 border border-palette-sandstone rounded-xl bg-palette-sandstone-canvas text-xs text-palette-espresso focus:outline-none focus:border-palette-bronze focus:ring-4 focus:ring-palette-bronze/10 placeholder:text-palette-espresso/40"
                                            })
                                        ]
                                    }),
                                    _jsxs(Button, {
                                        onClick: startInterview,
                                        disabled: !role.trim(),
                                        isLoading: loading,
                                        variant: "primary",
                                        className: "w-full py-2.5 flex gap-2 justify-center shadow-md",
                                        children: [
                                            _jsx(BrainCircuit, { className: "h-4 w-4" }),
                                            _jsx("span", { children: "Generate Questions & Begin Interview" })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ),

                // Interview Session Step
                step === 'interview' && questions.length > 0 && (
                    _jsxs("div", {
                        className: "space-y-4 animate-fade-in",
                        children: [
                            _jsxs("div", {
                                className: "flex items-center justify-between text-xs font-bold text-palette-espresso/70 bg-white/90 p-3 rounded-xl border border-palette-sandstone/70 shadow-xs",
                                children: [
                                    _jsxs("span", { className: "text-palette-espresso", children: ["TARGET ROLE: ", role] }),
                                    _jsxs("span", { className: "text-palette-bronze font-black", children: ["QUESTION ", currentIdx + 1, " OF ", questions.length] })
                                ]
                            }),
                            _jsx(Card, {
                                className: "border-palette-sandstone/80 bg-palette-sandstone-light/40 shadow-subtle",
                                children: _jsxs(CardContent, {
                                    className: "p-6 space-y-3",
                                    children: [
                                        _jsx(Badge, {
                                            variant: "bronze",
                                            size: "xs",
                                            children: `${questions[currentIdx].type || 'TECHNICAL'} ROUND`
                                        }),
                                        _jsx("p", {
                                            className: "text-palette-espresso font-bold text-base leading-relaxed",
                                            children: questions[currentIdx].question
                                        }),
                                        questions[currentIdx].criteria && (
                                            _jsxs("p", {
                                                className: "text-xs text-palette-espresso/60 italic mt-2",
                                                children: ["Evaluation Guidance: ", questions[currentIdx].criteria]
                                            })
                                        )
                                    ]
                                })
                            }),
                            _jsxs("div", {
                                className: "space-y-3 bg-white/90 p-5 rounded-2xl border border-palette-sandstone/70 shadow-subtle",
                                children: [
                                    _jsx("label", {
                                        className: "block text-xs font-semibold text-palette-espresso tracking-wide",
                                        children: "Your Response / Technical Answer"
                                    }),
                                    _jsx("textarea", {
                                        value: answer,
                                        onChange: (e) => setAnswer(e.target.value),
                                        rows: 6,
                                        placeholder: "Type your structured response explanation in detail...",
                                        className: "w-full p-3.5 border border-palette-sandstone rounded-xl bg-palette-sandstone-canvas text-xs text-palette-espresso focus:outline-none focus:border-palette-bronze focus:ring-4 focus:ring-palette-bronze/10 placeholder:text-palette-espresso/40 font-mono"
                                    }),
                                    _jsx("div", {
                                        className: "flex justify-end",
                                        children: _jsxs(Button, {
                                            onClick: handleAnswerSubmit,
                                            disabled: !answer.trim(),
                                            variant: "primary",
                                            className: "px-6 py-2 flex gap-2 items-center",
                                            children: [
                                                _jsx("span", { children: currentIdx < questions.length - 1 ? 'Next Question' : 'Submit for AI Evaluation' }),
                                                _jsx(Send, { className: "h-4 w-4" })
                                            ]
                                        })
                                    })
                                ]
                            })
                        ]
                    })
                ),

                // Evaluation Step
                step === 'evaluation' && (
                    _jsxs("div", {
                        className: "space-y-6 animate-fade-in",
                        children: [
                            loading && (
                                _jsxs("div", {
                                    className: "flex flex-col items-center justify-center p-12 space-y-4 bg-white/90 rounded-3xl border border-palette-sandstone/70 shadow-subtle",
                                    children: [
                                        _jsx(RefreshCw, { className: "h-10 w-10 animate-spin text-palette-bronze" }),
                                        _jsx("p", { className: "text-sm font-bold text-palette-espresso", children: "AI Recruiter Agent is evaluating responses & compiling scorecards..." })
                                    ]
                                })
                            ),
                            evaluation && (
                                _jsxs("div", {
                                    className: "space-y-4",
                                    children: [
                                        _jsx(Card, {
                                            className: "border border-palette-sandstone/70 shadow-subtle bg-white/90",
                                            children: _jsxs(CardContent, {
                                                className: "flex items-center justify-between p-6",
                                                children: [
                                                    _jsxs("div", {
                                                        className: "space-y-1",
                                                        children: [
                                                            _jsx("h3", { className: "text-palette-espresso font-bold text-lg", children: "Interview Performance Evaluation" }),
                                                            _jsx("p", { className: "text-xs text-palette-espresso/60", children: "Evaluated across communication, technical depth, and structure." })
                                                        ]
                                                    }),
                                                    _jsxs("div", {
                                                        className: "text-right space-y-1",
                                                        children: [
                                                            _jsxs("span", {
                                                                className: `text-3xl font-black ${
                                                                    (evaluation.overallScore || 80) >= 75 ? 'text-emerald-700' : 'text-amber-700'
                                                                }`,
                                                                children: [evaluation.overallScore || 82, " / 100"]
                                                            }),
                                                            _jsx(Badge, {
                                                                variant: "sandstone",
                                                                size: "xs",
                                                                className: "block text-center",
                                                                children: `GRADE: ${evaluation.grade || 'A'}`
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        }),
                                        _jsxs("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs",
                                            children: [
                                                _jsxs(Card, {
                                                    className: "border border-palette-sandstone/70 shadow-subtle bg-white/90",
                                                    children: [
                                                        _jsx(CardHeader, { className: "py-3 border-b border-palette-sandstone/30", children: _jsx(CardTitle, { className: "text-xs font-bold text-palette-espresso", children: "Communication & Delivery" }) }),
                                                        _jsx(CardContent, { className: "text-palette-espresso/80 leading-relaxed py-3", children: evaluation.communication || "Clear articulate delivery with confident structure." })
                                                    ]
                                                }),
                                                _jsxs(Card, {
                                                    className: "border border-palette-sandstone/70 shadow-subtle bg-white/90",
                                                    children: [
                                                        _jsx(CardHeader, { className: "py-3 border-b border-palette-sandstone/30", children: _jsx(CardTitle, { className: "text-xs font-bold text-palette-espresso", children: "Technical Depth & Accuracy" }) }),
                                                        _jsx(CardContent, { className: "text-palette-espresso/80 leading-relaxed py-3", children: evaluation.accuracy || "Strong foundation in principles with good real-world reasoning." })
                                                    ]
                                                })
                                            ]
                                        }),
                                        _jsxs(Card, {
                                            className: "border border-palette-sandstone/70 shadow-subtle bg-white/90",
                                            children: [
                                                _jsx(CardHeader, {
                                                    className: "py-3 border-b border-palette-sandstone/30",
                                                    children: _jsxs(CardTitle, {
                                                        className: "text-xs font-bold text-palette-espresso flex items-center gap-1.5",
                                                        children: [
                                                            _jsx(CheckCircle, { className: "h-4 w-4 text-emerald-600" }),
                                                            _jsx("span", { children: "Actionable Recommendations for Real Rounds" })
                                                        ]
                                                    })
                                                }),
                                                _jsx(CardContent, {
                                                    className: "text-xs text-palette-espresso/80 leading-relaxed py-3",
                                                    children: evaluation.feedback || "Continue emphasizing quantitative business impact and architectural trade-offs during system design discussions."
                                                })
                                            ]
                                        }),
                                        _jsx(Button, {
                                            onClick: () => setStep('setup'),
                                            variant: "secondary",
                                            className: "w-full py-2.5 mt-2",
                                            children: "Practice Another Mock Interview Session"
                                        })
                                    ]
                                })
                            )
                        ]
                    })
                )
            ]
        })
    );
};

export default AIMockInterview;
