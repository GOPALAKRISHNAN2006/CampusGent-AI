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
                    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-br from-palette-black via-palette-espresso to-palette-bronze text-white border border-palette-bronze/40 shadow-xl",
                    children: [
                        _jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                                _jsxs("div", {
                                    className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-palette-espresso/80 border border-palette-sandstone/30 text-[10px] font-bold uppercase tracking-wider text-palette-sandstone",
                                    children: [
                                        _jsx(Sparkles, { className: "h-3.5 w-3.5 text-palette-sandstone animate-pulse" }),
                                        "Autonomous ATS Optimizer"
                                    ]
                                }),
                                _jsxs("h1", {
                                    className: "text-xl sm:text-2xl font-black text-white flex items-center gap-2",
                                    children: [
                                        _jsx(FileText, { className: "h-6 w-6 text-palette-sandstone" }),
                                        _jsx("span", { children: "AI Resume & ATS Structure Analyzer" })
                                    ]
                                }),
                                _jsx("p", {
                                    className: "text-xs text-palette-sandstone/85 max-w-xl font-normal",
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
                                    className: "bg-white/90 p-5 rounded-2xl border border-palette-sandstone/70 shadow-subtle space-y-3",
                                    children: [
                                        _jsx("h3", { className: "text-[10.5px] font-bold uppercase text-palette-espresso/60 tracking-wider", children: "Option 1: Upload Resume PDF" }),
                                        _jsx("input", {
                                            type: "file",
                                            accept: ".pdf",
                                            className: "hidden",
                                            ref: fileInputRef,
                                            onChange: (e) => setFile(e.target.files?.[0] || null)
                                        }),
                                        _jsxs("div", {
                                            onClick: () => fileInputRef.current?.click(),
                                            className: "border-2 border-dashed border-palette-sandstone hover:border-palette-bronze p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-palette-sandstone-canvas/50 hover:bg-palette-sandstone-light/60",
                                            children: [
                                                _jsx("div", {
                                                    className: "h-10 w-10 rounded-xl bg-palette-sandstone-light text-palette-bronze flex items-center justify-center mb-2",
                                                    children: _jsx(UploadCloud, { className: "h-5 w-5" })
                                                }),
                                                _jsx("p", { className: "font-bold text-palette-espresso text-xs", children: file ? file.name : "Click to select or drop resume PDF" }),
                                                _jsx("p", { className: "text-[11px] text-palette-espresso/50 mt-0.5", children: file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports PDF documents up to 10MB" })
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
                                    className: "flex items-center gap-3 text-palette-espresso/40",
                                    children: [
                                        _jsx("div", { className: "h-px bg-palette-sandstone/60 flex-1" }),
                                        _jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider", children: "OR PASTE TEXT" }),
                                        _jsx("div", { className: "h-px bg-palette-sandstone/60 flex-1" })
                                    ]
                                }),

                                // Option 2: Paste Content
                                _jsxs("div", {
                                    className: "bg-white/90 p-5 rounded-2xl border border-palette-sandstone/70 shadow-subtle space-y-3",
                                    children: [
                                        _jsx("h3", { className: "text-[10.5px] font-bold uppercase text-palette-espresso/60 tracking-wider", children: "Option 2: Paste Resume Content" }),
                                        _jsx("textarea", {
                                            value: resumeText,
                                            onChange: (e) => setResumeText(e.target.value),
                                            rows: 7,
                                            placeholder: "Paste plain-text or markdown resume summary here...",
                                            className: "w-full p-3.5 border border-palette-sandstone rounded-xl bg-palette-sandstone-canvas text-xs font-mono text-palette-espresso focus:outline-none focus:border-palette-bronze focus:ring-4 focus:ring-palette-bronze/10 placeholder:text-palette-espresso/40"
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
                                        className: "h-full flex items-center justify-center p-10 text-center text-palette-espresso/60 border-dashed border-2 border-palette-sandstone bg-white/70",
                                        children: _jsxs(CardContent, {
                                            className: "space-y-2 p-0",
                                            children: [
                                                _jsx("div", {
                                                    className: "h-12 w-12 rounded-2xl bg-palette-sandstone text-palette-bronze flex items-center justify-center mx-auto mb-2",
                                                    children: _jsx(FileText, { className: "h-6 w-6" })
                                                }),
                                                _jsx("h3", { className: "font-bold text-palette-espresso text-sm", children: "No Analysis Generated Yet" }),
                                                _jsx("p", { className: "text-xs text-palette-espresso/60 max-w-xs mx-auto", children: "Upload your PDF or paste resume text on the left to view ATS compatibility scores and suggestions." })
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
                                                className: "border border-palette-sandstone/70 shadow-subtle bg-white/90",
                                                children: _jsxs(CardContent, {
                                                    className: "flex items-center justify-between p-5",
                                                    children: [
                                                        _jsxs("div", {
                                                            className: "space-y-1",
                                                            children: [
                                                                _jsx("h3", { className: "text-sm font-bold text-palette-espresso", children: "Overall ATS Compatibility Score" }),
                                                                _jsx("p", { className: "text-xs text-palette-espresso/60", children: "Evaluated against modern enterprise ATS parsers." })
                                                            ]
                                                        }),
                                                        _jsxs("div", {
                                                            className: `px-4 py-2.5 rounded-2xl text-xl font-black ${
                                                                (analysis.score || 85) >= 80
                                                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                                            }`,
                                                            children: [analysis.score || 85, " / 100"]
                                                        })
                                                    ]
                                                })
                                            }),

                                            // Strengths Card
                                            analysis.strengths && analysis.strengths.length > 0 && (
                                                _jsxs(Card, {
                                                    className: "border border-palette-sandstone/70 shadow-subtle bg-white/90",
                                                    children: [
                                                        _jsx(CardHeader, {
                                                            className: "py-3 border-b border-palette-sandstone/30",
                                                            children: _jsxs(CardTitle, {
                                                                className: "flex items-center gap-1.5 text-emerald-800 text-xs",
                                                                children: [
                                                                    _jsx(CheckCircle, { className: "h-4 w-4 text-emerald-600" }),
                                                                    _jsx("span", { children: "Resume Strengths" })
                                                                ]
                                                            })
                                                        }),
                                                        _jsx(CardContent, {
                                                            className: "space-y-2 py-3",
                                                            children: analysis.strengths.map((str, i) => (
                                                                _jsxs("p", { className: "text-palette-espresso/80 leading-relaxed text-xs flex items-start gap-2", children: [_jsx("span", { className: "text-emerald-600 font-bold", children: "✓" }), str] }, i)
                                                            ))
                                                        })
                                                    ]
                                                })
                                            ),

                                            // Weaknesses Card
                                            analysis.weaknesses && analysis.weaknesses.length > 0 && (
                                                _jsxs(Card, {
                                                    className: "border border-palette-sandstone/70 shadow-subtle bg-white/90",
                                                    children: [
                                                        _jsx(CardHeader, {
                                                            className: "py-3 border-b border-palette-sandstone/30",
                                                            children: _jsxs(CardTitle, {
                                                                className: "flex items-center gap-1.5 text-rose-800 text-xs",
                                                                children: [
                                                                    _jsx(XCircle, { className: "h-4 w-4 text-rose-600" }),
                                                                    _jsx("span", { children: "Formatting Weaknesses" })
                                                                ]
                                                            })
                                                        }),
                                                        _jsx(CardContent, {
                                                            className: "space-y-2 py-3",
                                                            children: analysis.weaknesses.map((w, i) => (
                                                                _jsxs("p", { className: "text-palette-espresso/80 leading-relaxed text-xs flex items-start gap-2", children: [_jsx("span", { className: "text-rose-600 font-bold", children: "!" }), w] }, i)
                                                            ))
                                                        })
                                                    ]
                                                })
                                            ),

                                            // Missing Keywords Card
                                            analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
                                                _jsxs(Card, {
                                                    className: "border border-palette-sandstone/70 shadow-subtle bg-white/90",
                                                    children: [
                                                        _jsx(CardHeader, {
                                                            className: "py-3 border-b border-palette-sandstone/30",
                                                            children: _jsxs(CardTitle, {
                                                                className: "flex items-center gap-1.5 text-palette-espresso text-xs",
                                                                children: [
                                                                    _jsx(AlertCircle, { className: "h-4 w-4 text-palette-bronze" }),
                                                                    _jsx("span", { children: "Target Missing Keywords" })
                                                                ]
                                                            })
                                                        }),
                                                        _jsx(CardContent, {
                                                            className: "flex flex-wrap gap-1.5 py-3",
                                                            children: analysis.missingKeywords.map((k) => (
                                                                _jsx(Badge, { variant: "bronze", size: "sm", children: k }, k)
                                                            ))
                                                        })
                                                    ]
                                                })
                                            ),

                                            // Suggestions / Action items
                                            analysis.suggestions && analysis.suggestions.length > 0 && (
                                                _jsxs(Card, {
                                                    className: "border border-palette-sandstone/70 shadow-subtle bg-white/90",
                                                    children: [
                                                        _jsx(CardHeader, {
                                                            className: "py-3 border-b border-palette-sandstone/30",
                                                            children: _jsxs(CardTitle, {
                                                                className: "text-palette-espresso text-xs flex items-center gap-1.5",
                                                                children: [
                                                                    _jsx(Sparkles, { className: "h-4 w-4 text-palette-bronze" }),
                                                                    _jsx("span", { children: "Proactive AI Recommendations" })
                                                                ]
                                                            })
                                                        }),
                                                        _jsx(CardContent, {
                                                            className: "space-y-2 py-3 text-xs",
                                                            children: analysis.suggestions.map((s, i) => (
                                                                _jsxs("div", {
                                                                    className: "flex items-start gap-2 text-palette-espresso/80 leading-relaxed",
                                                                    children: [
                                                                        _jsx("span", { className: "h-5 w-5 rounded-full bg-palette-sandstone-light text-palette-bronze font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-palette-sandstone", children: i + 1 }),
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
