import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { FileText, CheckCircle, XCircle, AlertCircle, RefreshCw, UploadCloud, Sparkles, ArrowRight } from 'lucide-react';

export const AIResumeAnalyzer = () => {
    const [resumeText, setResumeText] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleAnalyzeText = async () => {
        if (!resumeText.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.post('/ai/resume-analyzer', { resumeText });
            setAnalysis(res.data.data?.insight || res.data.data);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to analyze resume text.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyzeFile = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('resumePdf', file);
            const res = await apiClient.post('/ai/resume-analyzer/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAnalysis(res.data.data?.insight || res.data.data);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to analyze PDF resume.');
        } finally {
            setLoading(false);
        }
    };

    return (
        _jsxs("div", {
            className: "space-y-6 max-w-5xl mx-auto text-xs animate-fade-in font-sans",
            children: [
                // Header Banner
                _jsxs("div", {
                    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0B0F19] text-white border border-slate-800 shadow-xl",
                    children: [
                        _jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                                _jsxs("div", {
                                    className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-[10px] font-bold uppercase tracking-wider text-indigo-300",
                                    children: [
                                        _jsx(Sparkles, { className: "h-3.5 w-3.5 text-indigo-300 animate-pulse" }),
                                        "Autonomous ATS Optimizer"
                                    ]
                                }),
                                _jsxs("h1", {
                                    className: "text-xl sm:text-2xl font-black text-white flex items-center gap-2",
                                    children: [
                                        _jsx(FileText, { className: "h-6 w-6 text-indigo-400" }),
                                        _jsx("span", { children: "AI Resume & ATS Structure Analyzer" })
                                    ]
                                }),
                                _jsx("p", {
                                    className: "text-xs text-slate-300 max-w-xl font-normal",
                                    children: "Upload your resume PDF or paste markdown to evaluate recruiter ATS compatibility, keyword density, and formatting compliance."
                                })
                            ]
                        })
                    ]
                }),

                // 2 Column Grid: Upload on Left, Feedback on Right
                _jsxs("div", {
                    className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                    children: [
                        // Left Column: PDF Upload or Paste
                        _jsxs("div", {
                            className: "space-y-4",
                            children: [
                                // Option 1: PDF Upload Card
                                _jsxs("div", {
                                    className: "bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-3",
                                    children: [
                                        _jsx("h3", { className: "text-[10.5px] font-bold uppercase text-slate-500 tracking-wider", children: "Option 1: Upload Resume PDF" }),
                                        _jsx("input", {
                                            type: "file",
                                            accept: ".pdf",
                                            className: "hidden",
                                            ref: fileInputRef,
                                            onChange: (e) => setFile(e.target.files?.[0] || null)
                                        }),
                                        _jsxs("div", {
                                            onClick: () => fileInputRef.current?.click(),
                                            className: "border-2 border-dashed border-slate-200 hover:border-indigo-400 p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/20",
                                            children: [
                                                _jsx("div", {
                                                    className: "h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2",
                                                    children: _jsx(UploadCloud, { className: "h-5 w-5" })
                                                }),
                                                _jsx("p", { className: "font-bold text-slate-800 text-xs", children: file ? file.name : "Click to select or drop resume PDF" }),
                                                _jsx("p", { className: "text-[11px] text-slate-400 mt-0.5", children: file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports PDF documents up to 10MB" })
                                            ]
                                        }),
                                        _jsxs(Button, {
                                            onClick: handleAnalyzeFile,
                                            disabled: !file,
                                            isLoading: loading && !!file,
                                            variant: "primary",
                                            className: "w-full py-2.5 flex gap-2 justify-center",
                                            children: [
                                                _jsx(RefreshCw, { className: "h-4 w-4" }),
                                                _jsx("span", { children: "Analyze Resume PDF" })
                                            ]
                                        })
                                    ]
                                }),

                                // Divider
                                _jsxs("div", {
                                    className: "flex items-center gap-3 text-slate-400",
                                    children: [
                                        _jsx("div", { className: "h-px bg-slate-200 flex-1" }),
                                        _jsx("span", { className: "text-[10px] font-bold uppercase", children: "OR PASTE TEXT" }),
                                        _jsx("div", { className: "h-px bg-slate-200 flex-1" })
                                    ]
                                }),

                                // Option 2: Paste Content
                                _jsxs("div", {
                                    className: "bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-3",
                                    children: [
                                        _jsx("h3", { className: "text-[10.5px] font-bold uppercase text-slate-500 tracking-wider", children: "Option 2: Paste Resume Content" }),
                                        _jsx("textarea", {
                                            value: resumeText,
                                            onChange: (e) => setResumeText(e.target.value),
                                            rows: 7,
                                            placeholder: "Paste plain-text or markdown resume summary here...",
                                            className: "w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400"
                                        }),
                                        _jsxs(Button, {
                                            onClick: handleAnalyzeText,
                                            disabled: !resumeText.trim(),
                                            isLoading: loading && !file,
                                            variant: "secondary",
                                            className: "w-full py-2.5 flex gap-2 justify-center",
                                            children: [
                                                _jsx(RefreshCw, { className: "h-4 w-4" }),
                                                _jsx("span", { children: "Analyze Text Content" })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),

                        // Right Column: Analysis Feedback
                        _jsxs("div", {
                            className: "space-y-4",
                            children: [
                                error && (
                                    _jsx("div", {
                                        className: "p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl",
                                        children: error
                                    })
                                ),

                                !analysis && !loading && (
                                    _jsx(Card, {
                                        className: "h-full flex items-center justify-center p-10 text-center text-slate-500 border-dashed border-2 border-slate-200",
                                        children: _jsxs(CardContent, {
                                            className: "space-y-2 p-0",
                                            children: [
                                                _jsx("div", {
                                                    className: "h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-2",
                                                    children: _jsx(FileText, { className: "h-6 w-6" })
                                                }),
                                                _jsx("h3", { className: "font-bold text-slate-800 text-sm", children: "No Analysis Generated Yet" }),
                                                _jsx("p", { className: "text-xs text-slate-400 max-w-xs mx-auto", children: "Upload your PDF or paste resume text on the left to view ATS compatibility scores and suggestions." })
                                            ]
                                        })
                                    })
                                ),

                                analysis && (
                                    _jsxs("div", {
                                        className: "space-y-4 animate-fade-in",
                                        children: [
                                            // Overall Score Card
                                            _jsx(Card, {
                                                className: "border border-slate-200/80 shadow-subtle",
                                                children: _jsxs(CardContent, {
                                                    className: "flex items-center justify-between p-5",
                                                    children: [
                                                        _jsxs("div", {
                                                            className: "space-y-1",
                                                            children: [
                                                                _jsx("h3", { className: "text-sm font-bold text-slate-900", children: "Overall ATS Compatibility Score" }),
                                                                _jsx("p", { className: "text-xs text-slate-500", children: "Evaluated against modern enterprise ATS parsers." })
                                                            ]
                                                        }),
                                                        _jsxs("div", {
                                                            className: `px-4 py-2.5 rounded-2xl text-xl font-black ${
                                                                (analysis.score || 85) >= 80
                                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                            }`,
                                                            children: [analysis.score || 85, " / 100"]
                                                        })
                                                    ]
                                                })
                                            }),

                                            // Strengths Card
                                            analysis.strengths && analysis.strengths.length > 0 && (
                                                _jsxs(Card, {
                                                    className: "border border-slate-200/80 shadow-subtle",
                                                    children: [
                                                        _jsx(CardHeader, {
                                                            className: "py-3",
                                                            children: _jsxs(CardTitle, {
                                                                className: "flex items-center gap-1.5 text-emerald-700 text-xs",
                                                                children: [
                                                                    _jsx(CheckCircle, { className: "h-4 w-4" }),
                                                                    _jsx("span", { children: "Resume Strengths" })
                                                                ]
                                                            })
                                                        }),
                                                        _jsx(CardContent, {
                                                            className: "space-y-2 py-3",
                                                            children: analysis.strengths.map((str, i) => (
                                                                _jsxs("p", { className: "text-slate-700 leading-relaxed text-xs flex items-start gap-2", children: [_jsx("span", { className: "text-emerald-500 font-bold", children: "✓" }), str] }, i)
                                                            ))
                                                        })
                                                    ]
                                                })
                                            ),

                                            // Weaknesses Card
                                            analysis.weaknesses && analysis.weaknesses.length > 0 && (
                                                _jsxs(Card, {
                                                    className: "border border-slate-200/80 shadow-subtle",
                                                    children: [
                                                        _jsx(CardHeader, {
                                                            className: "py-3",
                                                            children: _jsxs(CardTitle, {
                                                                className: "flex items-center gap-1.5 text-rose-700 text-xs",
                                                                children: [
                                                                    _jsx(XCircle, { className: "h-4 w-4" }),
                                                                    _jsx("span", { children: "Formatting Weaknesses" })
                                                                ]
                                                            })
                                                        }),
                                                        _jsx(CardContent, {
                                                            className: "space-y-2 py-3",
                                                            children: analysis.weaknesses.map((w, i) => (
                                                                _jsxs("p", { className: "text-slate-700 leading-relaxed text-xs flex items-start gap-2", children: [_jsx("span", { className: "text-rose-500 font-bold", children: "!" }), w] }, i)
                                                            ))
                                                        })
                                                    ]
                                                })
                                            ),

                                            // Missing Keywords Card
                                            analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
                                                _jsxs(Card, {
                                                    className: "border border-slate-200/80 shadow-subtle",
                                                    children: [
                                                        _jsx(CardHeader, {
                                                            className: "py-3",
                                                            children: _jsxs(CardTitle, {
                                                                className: "flex items-center gap-1.5 text-amber-800 text-xs",
                                                                children: [
                                                                    _jsx(AlertCircle, { className: "h-4 w-4" }),
                                                                    _jsx("span", { children: "Target Missing Keywords" })
                                                                ]
                                                            })
                                                        }),
                                                        _jsx(CardContent, {
                                                            className: "flex flex-wrap gap-1.5 py-3",
                                                            children: analysis.missingKeywords.map((k) => (
                                                                _jsx(Badge, { variant: "warning", size: "sm", children: k }, k)
                                                            ))
                                                        })
                                                    ]
                                                })
                                            ),

                                            // Suggestions / Action items
                                            analysis.suggestions && analysis.suggestions.length > 0 && (
                                                _jsxs(Card, {
                                                    className: "border border-slate-200/80 shadow-subtle",
                                                    children: [
                                                        _jsx(CardHeader, {
                                                            className: "py-3",
                                                            children: _jsxs(CardTitle, {
                                                                className: "text-slate-900 text-xs flex items-center gap-1.5",
                                                                children: [
                                                                    _jsx(Sparkles, { className: "h-4 w-4 text-indigo-600" }),
                                                                    _jsx("span", { children: "Proactive AI Recommendations" })
                                                                ]
                                                            })
                                                        }),
                                                        _jsx(CardContent, {
                                                            className: "space-y-2 py-3 text-xs",
                                                            children: analysis.suggestions.map((s, i) => (
                                                                _jsxs("div", {
                                                                    className: "flex items-start gap-2 text-slate-700 leading-relaxed",
                                                                    children: [
                                                                        _jsx("span", { className: "h-5 w-5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5", children: i + 1 }),
                                                                        _jsx("p", { children: s })
                                                                    ]
                                                                }, i)
                                                            ))
                                                        })
                                                    ]
                                                })
                                            )
                                        ]
                                    })
                                )
                            ]
                        })
                    ]
                })
            ]
        })
    );
};

export default AIResumeAnalyzer;
