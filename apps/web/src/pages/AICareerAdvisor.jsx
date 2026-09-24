import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Sparkles, Brain, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const AICareerAdvisor = () => {
    const [loading, setLoading] = useState(false);
    const [insight, setInsight] = useState(null);
    const [error, setError] = useState(null);

    const fetchRoadmap = async () => {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.post('/ai/career-advisor');
            setInsight(res.data.data.insight);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to generate career advice.');
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
                                        "Autonomous Career Roadmap Engine"
                                    ]
                                }),
                                _jsxs("h1", {
                                    className: "text-xl sm:text-2xl font-black text-white flex items-center gap-2",
                                    children: [
                                        _jsx(Brain, { className: "h-6 w-6 text-palette-sandstone" }),
                                        _jsx("span", { children: "AI Career Intelligence Advisor" })
                                    ]
                                }),
                                _jsx("p", {
                                    className: "text-xs text-palette-sandstone/85 max-w-xl font-normal leading-relaxed",
                                    children: "Get personalized roadmap advice, skill alignments, and target milestones compiled autonomously from your academic and placement profile."
                                })
                            ]
                        }),
                        _jsxs(Button, {
                            onClick: fetchRoadmap,
                            isLoading: loading,
                            variant: "sandstone",
                            className: "shrink-0 flex gap-2 font-bold",
                            children: [
                                _jsx(Sparkles, { className: "h-4 w-4" }),
                                _jsx("span", { children: "Generate AI Roadmap" })
                            ]
                        })
                    ]
                }),

                error && (
                    _jsx("div", {
                        className: "p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl",
                        children: error
                    })
                ),

                !insight && !loading && (
                    _jsx(Card, {
                        className: "text-center p-12 border border-palette-sandstone/70 bg-white/90 shadow-subtle",
                        children: _jsxs(CardContent, {
                            className: "space-y-4",
                            children: [
                                _jsx("div", {
                                    className: "mx-auto w-16 h-16 bg-palette-sandstone-light text-palette-bronze border border-palette-sandstone rounded-full flex items-center justify-center shadow-xs",
                                    children: _jsx(Sparkles, { className: "h-8 w-8" })
                                }),
                                _jsx("h2", {
                                    className: "text-lg font-bold text-palette-espresso",
                                    children: "No Career Analysis Yet"
                                }),
                                _jsx("p", {
                                    className: "text-palette-espresso/70 text-xs max-w-md mx-auto",
                                    children: "Click the button above to request the AI Career Advisor to parse your profile records, verify skills, and draft a quarterly milestone roadmap."
                                }),
                                _jsx(Button, {
                                    onClick: fetchRoadmap,
                                    isLoading: loading,
                                    variant: "primary",
                                    children: "Generate Advice Now"
                                })
                            ]
                        })
                    })
                ),

                insight && (
                    _jsxs("div", {
                        className: "grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in",
                        children: [
                            // Left Column
                            _jsxs("div", {
                                className: "lg:col-span-1 space-y-6",
                                children: [
                                    _jsxs(Card, {
                                        className: "border border-palette-sandstone/70 bg-white/90 shadow-subtle",
                                        children: [
                                            _jsx(CardHeader, {
                                                className: "border-b border-palette-sandstone/30",
                                                children: _jsx(CardTitle, { className: "text-palette-espresso", children: "Role Alignment" })
                                            }),
                                            _jsxs(CardContent, {
                                                className: "space-y-5 p-5",
                                                children: [
                                                    _jsxs("div", {
                                                        className: "text-center py-4 bg-palette-sandstone-canvas border border-palette-sandstone/50 rounded-xl",
                                                        children: [
                                                            _jsxs("span", {
                                                                className: "text-3xl font-black text-palette-espresso",
                                                                children: [insight.alignmentScore, "%"]
                                                            }),
                                                            _jsx("p", {
                                                                className: "text-[10px] text-palette-bronze uppercase tracking-widest mt-1 font-extrabold",
                                                                children: "Match Score"
                                                            })
                                                        ]
                                                    }),
                                                    _jsxs("div", {
                                                        className: "space-y-1",
                                                        children: [
                                                            _jsx("span", {
                                                                className: "text-[10px] text-palette-espresso/60 uppercase font-bold tracking-wider",
                                                                children: "Suggested Track"
                                                            }),
                                                            _jsx("p", {
                                                                className: "text-base font-extrabold text-palette-espresso",
                                                                children: insight.roleAlignment
                                                            })
                                                        ]
                                                    }),
                                                    _jsx("div", {
                                                        className: "text-xs text-palette-espresso/80 leading-relaxed border-t border-palette-sandstone/40 pt-4",
                                                        children: insight.reasoning
                                                    })
                                                ]
                                            })
                                        ]
                                    }),

                                    _jsxs(Card, {
                                        className: "border border-palette-sandstone/70 bg-white/90 shadow-subtle",
                                        children: [
                                            _jsx(CardHeader, {
                                                className: "border-b border-palette-sandstone/30",
                                                children: _jsx(CardTitle, { className: "text-palette-espresso", children: "Skills Inventory" })
                                            }),
                                            _jsxs(CardContent, {
                                                className: "space-y-4 text-xs p-5",
                                                children: [
                                                    _jsxs("div", {
                                                        children: [
                                                            _jsxs("span", {
                                                                className: "font-bold text-emerald-800 mb-2 flex items-center gap-1.5",
                                                                children: [
                                                                    _jsx(CheckCircle, { className: "h-4 w-4 text-emerald-600" }),
                                                                    " Matched Strengths"
                                                                ]
                                                            }),
                                                            _jsx("div", {
                                                                className: "flex flex-wrap gap-1.5",
                                                                children: insight.matchedSkills.map((s) => (
                                                                    _jsx(Badge, { variant: "sandstone", size: "sm", children: s }, s)
                                                                ))
                                                            })
                                                        ]
                                                    }),
                                                    _jsxs("div", {
                                                        className: "border-t border-palette-sandstone/40 pt-4",
                                                        children: [
                                                            _jsxs("span", {
                                                                className: "font-bold text-palette-espresso mb-2 flex items-center gap-1.5",
                                                                children: [
                                                                    _jsx(AlertTriangle, { className: "h-4 w-4 text-palette-bronze" }),
                                                                    " Recommended Skills Gaps"
                                                                ]
                                                            }),
                                                            _jsx("div", {
                                                                className: "flex flex-wrap gap-1.5",
                                                                children: insight.missingSkills.map((s) => (
                                                                    _jsx(Badge, { variant: "bronze", size: "sm", children: s }, s)
                                                                ))
                                                            })
                                                        ]
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }),

                            // Right Column (Roadmap)
                            _jsxs("div", {
                                className: "lg:col-span-2 space-y-4",
                                children: [
                                    _jsx("h2", {
                                        className: "text-sm font-extrabold text-palette-espresso px-1 uppercase tracking-wider",
                                        children: "Milestone Learning Roadmap"
                                    }),
                                    _jsx("div", {
                                        className: "space-y-4",
                                        children: insight.learningRoadmap.map((item, idx) => (
                                            _jsxs(Card, {
                                                className: "border border-palette-sandstone/70 bg-white/90 shadow-subtle",
                                                children: [
                                                    _jsx(CardHeader, {
                                                        className: "bg-palette-sandstone-canvas/70 border-b border-palette-sandstone/30 py-3",
                                                        children: _jsxs("div", {
                                                            className: "flex justify-between items-center",
                                                            children: [
                                                                _jsx("h3", {
                                                                    className: "font-extrabold text-palette-espresso text-sm",
                                                                    children: item.quarter
                                                                }),
                                                                _jsxs("span", {
                                                                    className: "text-[10px] uppercase font-bold text-palette-bronze bg-palette-sandstone px-2.5 py-0.5 rounded-full border border-palette-sandstone",
                                                                    children: ["Phase ", idx + 1]
                                                                })
                                                            ]
                                                        })
                                                    }),
                                                    _jsxs(CardContent, {
                                                        className: "space-y-3 text-xs leading-relaxed p-5",
                                                        children: [
                                                            _jsx("p", {
                                                                className: "font-bold text-palette-espresso",
                                                                children: item.goal
                                                            }),
                                                            _jsx("ul", {
                                                                className: "space-y-2 list-none pl-0",
                                                                children: item.actions.map((act, aIdx) => (
                                                                    _jsxs("li", {
                                                                        className: "flex items-start gap-2 text-palette-espresso/80",
                                                                        children: [
                                                                            _jsx(ArrowRight, { className: "h-3.5 w-3.5 text-palette-bronze mt-0.5 shrink-0" }),
                                                                            _jsx("span", { children: act })
                                                                        ]
                                                                    }, aIdx)
                                                                ))
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }, idx)
                                        ))
                                    })
                                ]
                            })
                        ]
                    })
                )
            ]
        })
    );
};

export default AICareerAdvisor;
