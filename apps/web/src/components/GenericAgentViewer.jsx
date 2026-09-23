import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Bot, RefreshCw } from 'lucide-react';
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
        }
        catch (err) {
            setError(err.response?.data?.error?.message || err.message || `Failed to execute ${title}.`);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6 max-w-5xl mx-auto animate-fade-in", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 p-6 text-white shadow-xl shadow-indigo-950/10", children: [_jsxs("div", { children: [_jsxs("div", { className: "mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-100", children: [_jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" }), "AI agent workspace"] }), _jsxs("h1", { className: "text-2xl font-bold flex items-center gap-2", children: [_jsx(Bot, { className: "h-6 w-6 text-indigo-200" }), _jsx("span", { children: title })] }), _jsx("p", { className: "text-sm text-indigo-100/75 mt-1 max-w-xl", children: description })] }), _jsxs(Button, { onClick: handleExecute, isLoading: loading, className: "shrink-0 flex gap-2 bg-white text-indigo-950 hover:bg-indigo-50", children: [_jsx(RefreshCw, { className: "h-4 w-4" }), _jsx("span", { children: insight ? 'Refresh analysis' : 'Run analysis' })] })] }), error && (_jsx("div", { className: "p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl", children: error })), !insight && !loading && (_jsx(Card, { className: "text-center p-12", children: _jsxs(CardContent, { className: "space-y-4", children: [_jsx("div", { className: "mx-auto w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center", children: _jsx(Bot, { className: "h-8 w-8" }) }), _jsx("h2", { className: "text-lg font-bold text-brand-900", children: "Your intelligence workspace is ready" }), _jsx("p", { className: "text-brand-500 text-sm max-w-md mx-auto", children: "Run the agent to turn your verified CampusGent profile data into a clear, actionable recommendation." }), _jsxs("div", { className: "flex flex-wrap justify-center gap-2 pt-2 text-[11px] font-semibold text-brand-500", children: [_jsx("span", { className: "rounded-full bg-emerald-50 px-3 py-1 text-emerald-700", children: "Profile-grounded" }), _jsx("span", { className: "rounded-full bg-indigo-50 px-3 py-1 text-indigo-700", children: "Audited output" }), _jsx("span", { className: "rounded-full bg-amber-50 px-3 py-1 text-amber-700", children: "Actionable next steps" })] })] }) })), insight && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx(CardTitle, { children: "Agent Output" }), _jsx("p", { className: "mt-1 text-xs text-brand-500", children: "Generated from your latest profile snapshot." })] }), _jsx("span", { className: "rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700", children: "Analysis complete" })] }) }), _jsx(CardContent, { className: "bg-gray-50 p-6 rounded-b-xl", children: typeof insight === 'object' ? (_jsx(DynamicJSONViewer, { data: insight, defaultExpanded: true })) : (_jsx("p", { className: "text-gray-800", children: String(insight) })) })] }))] }));
};
