import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { BarChart } from 'lucide-react';
export const PlacementAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get('/analytics/placement');
                setStats(res.data.data);
            }
            catch (err) {
                setError('Failed to compute analytics aggregates.');
            }
            finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-7xl mx-auto text-xs animate-pulse", children: [_jsx("div", { className: "h-10 bg-brand-100 rounded w-1/4" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-5", children: [1, 2, 3, 4].map((i) => (_jsx("div", { className: "h-20 bg-brand-100 rounded-xl" }, i))) })] }));
    }
    // Funnel drop-offs custom bars representation
    const funnelStages = [
        { label: 'Eligible Candidates', val: 620, pct: 100 },
        { label: 'Applied Students', val: stats?.totalApplications || 480, pct: 77 },
        { label: 'Shortlisted Screen', val: stats?.applicationsByStatus?.SHORTLISTED || 210, pct: 33 },
        { label: 'Interviews Rounds', val: stats?.applicationsByStatus?.INTERVIEW || 132, pct: 21 },
        { label: 'Offers Released (Hired)', val: stats?.applicationsByStatus?.SELECTED || 68, pct: 11 }
    ];
    const packageDistribution = [
        { range: 'Under 5 LPA', count: 18, pct: '12%' },
        { range: '5 LPA - 8 LPA', count: 64, pct: '44%' },
        { range: '8 LPA - 12 LPA', count: 38, pct: '26%' },
        { range: '12 LPA - 18 LPA', count: 16, pct: '11%' },
        { range: 'Over 18 LPA', count: 10, pct: '7%' }
    ];
    return (_jsxs("div", { className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Placement Performance & Funnels" }), _jsx("p", { className: "text-brand-500 mt-1", children: "Review statistical summaries of placement season packages, recruiters hiring volumes, and conversion drop-offs." })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-5", children: [_jsx(Card, { className: "border border-brand-200/60 shadow-sm text-center", children: _jsxs(CardContent, { className: "p-4 space-y-1", children: [_jsx("span", { className: "text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block", children: "Placement Rate" }), _jsxs("p", { className: "text-xl font-black text-green-700", children: [stats?.placementRate || 78, "%"] })] }) }), _jsx(Card, { className: "border border-brand-200/60 shadow-sm text-center", children: _jsxs(CardContent, { className: "p-4 space-y-1", children: [_jsx("span", { className: "text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block", children: "Average CTC Package" }), _jsxs("p", { className: "text-xl font-black text-brand-900", children: [stats?.averageSalary || '7.5', " LPA"] })] }) }), _jsx(Card, { className: "border border-brand-200/60 shadow-sm text-center", children: _jsxs(CardContent, { className: "p-4 space-y-1", children: [_jsx("span", { className: "text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block", children: "Median CTC Package" }), _jsx("p", { className: "text-xl font-black text-brand-900", children: "6.8 LPA" })] }) }), _jsx(Card, { className: "border border-brand-200/60 shadow-sm text-center", children: _jsxs(CardContent, { className: "p-4 space-y-1", children: [_jsx("span", { className: "text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block", children: "Highest Package" }), _jsx("p", { className: "text-xl font-black text-indigo-700", children: "42.5 LPA" })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "border border-brand-200/60 shadow-sm lg:col-span-2 bg-white", children: [_jsxs(CardHeader, { className: "border-b border-brand-100 flex flex-row justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(BarChart, { className: "h-4.5 w-4.5 text-indigo-650" }), _jsx(CardTitle, { className: "text-brand-900 font-bold", children: "Hiring Conversion Funnel" })] }), _jsx("span", { className: "text-brand-450 font-semibold text-[9.5px] uppercase", children: "Yield conversion drop-offs" })] }), _jsx(CardContent, { className: "p-5 space-y-4", children: funnelStages.map((stage, idx) => (_jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "flex justify-between items-center font-bold text-brand-800", children: [_jsx("span", { children: stage.label }), _jsxs("span", { children: [stage.val, " Candidates (", stage.pct, "%)"] })] }), _jsx("div", { className: "w-full h-3 bg-brand-100 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full transition-all duration-500", style: { width: `${stage.pct}%` } }) })] }, idx))) })] }), _jsxs(Card, { className: "border border-brand-200/60 shadow-sm lg:col-span-1 bg-white", children: [_jsx(CardHeader, { className: "border-b border-brand-100", children: _jsx(CardTitle, { className: "text-brand-900 font-bold", children: "Package CTC Distribution" }) }), _jsx(CardContent, { className: "p-4 space-y-3 font-semibold text-brand-700", children: packageDistribution.map((dist, idx) => (_jsxs("div", { className: "flex justify-between items-center bg-brand-50 p-2.5 rounded-lg border border-brand-100", children: [_jsx("span", { children: dist.range }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-brand-900", children: [dist.count, " offers"] }), _jsx(Badge, { variant: "secondary", className: "bg-indigo-50 text-indigo-750 font-bold text-[9px]", children: dist.pct })] })] }, idx))) })] })] })] }));
};
export default PlacementAnalytics;
