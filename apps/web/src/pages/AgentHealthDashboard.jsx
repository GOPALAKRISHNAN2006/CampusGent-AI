import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Activity, ShieldAlert, CheckCircle, FileJson } from 'lucide-react';
export const AgentHealthDashboard = () => {
    // Static audit list mapping to our 21 catalog agents
    const agentsStatus = [
        { name: "StudentSuccessAgent", category: "Academic", status: "HEALTHY", latency: "340ms", policy: "v1.0.0" },
        { name: "PlacementReadinessAgent", category: "Placement", status: "HEALTHY", latency: "420ms", policy: "v1.0.0" },
        { name: "LearningPathAgent", category: "Learning", status: "HEALTHY", latency: "510ms", policy: "v1.0.0" },
        { name: "FacultyInsightsAgent", category: "Faculty", status: "HEALTHY", latency: "280ms", policy: "v1.0.0" },
        { name: "PlacementAnalyticsAgent", category: "Placement", status: "HEALTHY", latency: "310ms", policy: "v1.0.0" },
        { name: "CareerRecommendationAgent", category: "Career", status: "HEALTHY", latency: "490ms", policy: "v1.0.0" },
        { name: "MockInterviewAgent", category: "Interview", status: "HEALTHY", latency: "620ms", policy: "v1.0.0" },
        { name: "ResumeIntelligenceAgent", category: "Resume", status: "HEALTHY", latency: "440ms", policy: "v1.0.0" },
        { name: "JobMatchingAgent", category: "Jobs", status: "HEALTHY", latency: "380ms", policy: "v1.0.0" },
        { name: "ApplicationStrategyAgent", category: "Placement", status: "HEALTHY", latency: "300ms", policy: "v1.0.0" },
        { name: "SkillGapAgent", category: "Skills", status: "HEALTHY", latency: "250ms", policy: "v1.0.0" },
        { name: "CareerGrowthAgent", category: "Career", status: "HEALTHY", latency: "410ms", policy: "v1.0.0" },
        { name: "StudentRiskAgent", category: "Academic", status: "HEALTHY", latency: "290ms", policy: "v1.0.0" },
        { name: "OpportunityAgent", category: "Placement", status: "HEALTHY", latency: "320ms", policy: "v1.0.0" },
        { name: "StudentEngagementAgent", category: "Academic", status: "HEALTHY", latency: "220ms", policy: "v1.0.0" },
        { name: "PlacementPreparationAgent", category: "Placement", status: "HEALTHY", latency: "450ms", policy: "v1.0.0" },
        { name: "FacultyInterventionAgent", category: "Faculty", status: "HEALTHY", latency: "330ms", policy: "v1.0.0" },
        { name: "PlacementOfficerCopilot", category: "Placement", status: "HEALTHY", latency: "390ms", policy: "v1.0.0" },
        { name: "AdminIntelligenceAgent", category: "Admin", status: "HEALTHY", latency: "270ms", policy: "v1.0.0" },
        { name: "DataQualityAgent", category: "Admin", status: "HEALTHY", latency: "350ms", policy: "v1.0.0" },
        { name: "AIGovernanceAgent", category: "Admin", status: "HEALTHY", latency: "310ms", policy: "v1.0.0" },
    ];
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-brand-900 flex items-center gap-2", children: [_jsx(Activity, { className: "h-6 w-6 text-indigo-500" }), _jsx("span", { children: "Ecosystem Observability & AI Governance" })] }), _jsx("p", { className: "text-sm text-brand-500 mt-1", children: "Monitor execution latency averages, policy conformance compliance matrices, and health indexes for the 21 agents." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5 text-xs", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-5 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-brand-900", children: "Total Registered Agents" }), _jsx("p", { className: "text-2xl font-black mt-1", children: "21 / 21" })] }), _jsx(CheckCircle, { className: "h-8 w-8 text-green-500" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-5 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-brand-900", children: "System Conformance Conformance" }), _jsx("p", { className: "text-2xl font-black mt-1", children: "100%" })] }), _jsx(FileJson, { className: "h-8 w-8 text-indigo-500" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-5 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-brand-900", children: "Governance Policy Version" }), _jsx("p", { className: "text-2xl font-black mt-1", children: "v1.0.0" })] }), _jsx(ShieldAlert, { className: "h-8 w-8 text-indigo-500" })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Master Agents Registry Health status" }) }), _jsx(CardContent, { className: "overflow-x-auto p-0", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-brand-50 border-b border-brand-200 text-xs font-semibold text-brand-600 uppercase", children: [_jsx("th", { className: "px-6 py-3", children: "Agent Identification" }), _jsx("th", { className: "px-6 py-3", children: "Category classification" }), _jsx("th", { className: "px-6 py-3", children: "Audit Conformance" }), _jsx("th", { className: "px-6 py-3", children: "Average Latency" }), _jsx("th", { className: "px-6 py-3", children: "Prompt Version" })] }) }), _jsx("tbody", { className: "divide-y divide-brand-100 text-xs text-brand-800", children: agentsStatus.map((agent) => (_jsxs("tr", { className: "hover:bg-brand-50/50", children: [_jsx("td", { className: "px-6 py-4 font-bold text-brand-950", children: agent.name }), _jsx("td", { className: "px-6 py-4", children: agent.category }), _jsx("td", { className: "px-6 py-4", children: _jsx(Badge, { variant: "success", children: agent.status }) }), _jsx("td", { className: "px-6 py-4 font-mono", children: agent.latency }), _jsx("td", { className: "px-6 py-4 font-mono text-brand-500", children: agent.policy })] }, agent.name))) })] }) })] })] }));
};
export default AgentHealthDashboard;
