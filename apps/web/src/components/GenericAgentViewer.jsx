import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Bot, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { DynamicJSONViewer } from './ui/DynamicJSONViewer.jsx';

export const GenericAgentViewer = ({ agentName, title, description }) => {
    const [loading, setLoading] = useState(false);
    const [insight, setInsight] = useState(null);
    const [error, setError] = useState(null);

    const handleExecute = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.post(`/agents/execute/${agentName}`, {});
            setInsight(res.data.data?.insight ?? res.data.data);
        } catch (err) {
            setError(err.response?.data?.error?.message || err.message || `Failed to execute ${title}.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        _jsxs("div", {
            className: "space-y-6 max-w-5xl mx-auto animate-fade-in font-sans text-xs",
            children: [
                _jsxs("div", {
                    className: "flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-palette-black via-palette-espresso to-palette-bronze p-6 sm:p-8 text-white border border-palette-bronze/40 shadow-xl",
                    children: [
                        _jsxs("div", {
                            className: "space-y-2",
                            children: [
                                _jsxs("div", {
                                    className: "inline-flex items-center gap-2 rounded-full border border-palette-sandstone/30 bg-palette-espresso/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-palette-sandstone",
                                    children: [
                                        _jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" }),
                                        "AI Agent Intelligence Workspace"
                                    ]
                                }),
                                _jsxs("h1", {
                                    className: "text-2xl font-black flex items-center gap-2 text-white",
                                    children: [
                                        _jsx(Bot, { className: "h-6 w-6 text-palette-sandstone" }),
                                        _jsx("span", { children: title })
                                    ]
                                }),
                                _jsx("p", {
                                    className: "text-xs sm:text-sm text-palette-sandstone/85 max-w-xl font-normal leading-relaxed",
                                    children: description
                                })
                            ]
                        }),
                        _jsxs(Button, {
                            onClick: handleExecute,
                            isLoading: loading,
                            variant: "sandstone",
                            className: "shrink-0 flex gap-2 font-bold shadow-md",
                            children: [
                                _jsx(RefreshCw, { className: "h-4 w-4" }),
                                _jsx("span", { children: insight ? 'Refresh Analysis' : 'Run Agent Analysis' })
                            ]
                        })
                    ]
                }),

                error && (
                    _jsx("div", {
                        className: "p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl animate-fade-in",
                        children: error
                    })
                ),

                !insight && !loading && (
                    _jsx(Card, {
                        className: "text-center p-12 border-dashed border-2 border-palette-sandstone bg-white/70 shadow-none",
                        children: _jsxs(CardContent, {
                            className: "space-y-4 p-0",
                            children: [
                                _jsx("div", {
                                    className: "mx-auto w-14 h-14 bg-palette-sandstone-light text-palette-bronze border border-palette-sandstone rounded-2xl flex items-center justify-center shadow-xs",
                                    children: _jsx(Bot, { className: "h-7 w-7" })
                                }),
                                _jsx("h2", {
                                    className: "text-base font-bold text-palette-espresso",
                                    children: "Agent Workspace is Ready for Execution"
                                }),
                                _jsx("p", {
                                    className: "text-palette-espresso/70 text-xs max-w-md mx-auto leading-relaxed",
                                    children: "Click 'Run Agent Analysis' to execute this cognitive agent against your latest verified campus data."
                                }),
                                _jsxs("div", {
                                    className: "flex flex-wrap justify-center gap-2 pt-2 text-[11px] font-semibold",
                                    children: [
                                        _jsx("span", { className: "rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-emerald-800", children: "✓ Profile-Grounded" }),
                                        _jsx("span", { className: "rounded-full bg-palette-sandstone-light border border-palette-sandstone px-3 py-1 text-palette-espresso", children: "✓ Audited Reasoning" }),
                                        _jsx("span", { className: "rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-amber-800", children: "✓ Actionable Strategy" })
                                    ]
                                })
                            ]
                        })
                    })
                ),

                insight && (
                    _jsxs(Card, {
                        className: "border border-palette-sandstone/70 bg-white/90 shadow-subtle animate-fade-in",
                        children: [
                            _jsx(CardHeader, {
                                className: "border-b border-palette-sandstone/30",
                                children: _jsxs("div", {
                                    className: "flex items-center justify-between gap-3",
                                    children: [
                                        _jsxs("div", {
                                            children: [
                                                _jsx(CardTitle, { className: "text-palette-espresso", children: "Agent Output Intelligence" }),
                                                _jsx("p", { className: "mt-0.5 text-xs text-palette-espresso/60 font-normal", children: "Generated from verified profile snapshot." })
                                            ]
                                        }),
                                        _jsx("span", {
                                            className: "rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-emerald-800",
                                            children: "Analysis Complete"
                                        })
                                    ]
                                })
                            }),
                            _jsx(CardContent, {
                                className: "bg-palette-sandstone-canvas/50 p-6",
                                children: typeof insight === 'object' ? (
                                    _jsx(DynamicJSONViewer, { data: insight, defaultExpanded: true })
                                ) : (
                                    _jsx("p", { className: "text-palette-espresso leading-relaxed font-mono text-xs", children: String(insight) }))
                            })
                        ]
                    })
                )
            ]
        })
    );
};

export default GenericAgentViewer;
