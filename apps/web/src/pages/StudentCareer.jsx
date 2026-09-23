import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Sparkles, Brain, CheckCircle, AlertTriangle, ArrowRight, Play, RotateCw } from 'lucide-react';
export const StudentCareer = () => {
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingAgent, setLoadingAgent] = useState(false);
    const [insight, setInsight] = useState(null);
    const [error, setError] = useState(null);
    // Editable career parameters
    const [careerGoalsInput, setCareerGoalsInput] = useState('');
    const [careerInterestsInput, setCareerInterestsInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const fetchProfile = async () => {
        try {
            setLoadingProfile(true);
            const res = await apiClient.get('/students/profile');
            const data = res.data.data;
            setProfile(data);
            setCareerGoalsInput((data.careerGoals || []).join(', '));
            setCareerInterestsInput((data.careerInterests || []).join(', '));
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoadingProfile(false);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    const handleSaveParameters = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveSuccess(false);
        setError(null);
        try {
            const goals = careerGoalsInput.split(',').map(s => s.trim()).filter(Boolean);
            const interests = careerInterestsInput.split(',').map(s => s.trim()).filter(Boolean);
            const res = await apiClient.put('/students/profile', {
                semester: profile?.semester || 1,
                cgpa: profile?.cgpa || 0.0,
                careerGoals: goals,
                careerInterests: interests
            });
            setProfile(res.data.data);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to update career parameters.');
        }
        finally {
            setSaving(false);
        }
    };
    const runCareerAgent = async () => {
        setLoadingAgent(true);
        setError(null);
        try {
            const res = await apiClient.post('/ai/career-advisor');
            setInsight(res.data.data.insight);
        }
        catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to fetch AI career suggestions.');
        }
        finally {
            setLoadingAgent(false);
        }
    };
    if (loadingProfile) {
        return (_jsxs("div", { className: "space-y-6 max-w-5xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-10 w-44 bg-brand-100 rounded-lg" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx("div", { className: "h-64 bg-brand-100 rounded-xl md:col-span-1" }), _jsx("div", { className: "h-96 bg-brand-100 rounded-xl md:col-span-2" })] })] }));
    }
    return (_jsxs("div", { className: "space-y-6 max-w-5xl mx-auto", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-brand-900 flex items-center gap-2", children: [_jsx(Sparkles, { className: "h-6 w-6 text-indigo-500" }), _jsx("span", { children: "AI Career Planning Center" })] }), _jsx("p", { className: "text-sm text-brand-500 mt-1", children: "Define your industry target goals, review role alignment scores, and execute the AI Career Agent for a personalized roadmap." })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-start", children: [_jsxs("div", { className: "lg:col-span-1 space-y-6", children: [_jsxs(Card, { className: "border border-brand-200/60 shadow-sm", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-bold text-brand-900", children: "Career Goal Settings" }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSaveParameters, className: "space-y-4 text-xs", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider", children: "Target Roles / Job Interests" }), _jsx("input", { type: "text", value: careerInterestsInput, onChange: (e) => setCareerInterestsInput(e.target.value), placeholder: "e.g. Software Engineer, Backend Dev", className: "w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white" }), _jsx("span", { className: "text-[10px] text-brand-400 mt-1 block", children: "Comma separated list of job titles." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider", children: "Professional Milestones" }), _jsx("input", { type: "text", value: careerGoalsInput, onChange: (e) => setCareerGoalsInput(e.target.value), placeholder: "e.g. Learn System Design, Learn Kubernetes", className: "w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white" }), _jsx("span", { className: "text-[10px] text-brand-400 mt-1 block", children: "Comma separated goals." })] }), _jsx("div", { className: "flex items-center gap-3 pt-2", children: _jsx(Button, { type: "submit", isLoading: saving, className: "px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex-1", children: "Save Career Details" }) }), saveSuccess && (_jsx("p", { className: "text-[10px] font-semibold text-green-600", children: "Career parameters saved successfully!" }))] }) })] }), _jsxs(Card, { className: "border border-brand-200/60 shadow-sm", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-xs font-bold text-brand-500 uppercase tracking-wider", children: "Current Placement Profile" }) }), _jsxs(CardContent, { className: "space-y-3.5 text-xs text-brand-700", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { children: "Placement readiness:" }), _jsxs("span", { className: "font-bold text-indigo-650", children: [profile?.placementReadinessScore || 0, "%"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { children: "GPA context:" }), _jsxs("span", { className: "font-bold text-brand-900", children: [profile?.cgpa || '0.00', "/10.0"] })] })] })] })] }), _jsx("div", { className: "lg:col-span-2 space-y-6", children: _jsxs(Card, { className: "border border-brand-200/60 shadow-sm", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between gap-4 py-4 border-b border-brand-100", children: [_jsxs(CardTitle, { className: "text-sm font-bold flex items-center gap-2 text-brand-900", children: [_jsx(Brain, { className: "h-4 w-4 text-indigo-500" }), _jsx("span", { children: "AI Career Advisor Agent Insight" })] }), _jsxs(Button, { onClick: runCareerAgent, isLoading: loadingAgent, className: "text-xs flex gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shrink-0", children: [insight ? _jsx(RotateCw, { className: "h-3.5 w-3.5" }) : _jsx(Play, { className: "h-3.5 w-3.5" }), _jsx("span", { children: insight ? 'Re-Analyze Career Plan' : 'Generate Career Plan' })] })] }), _jsxs(CardContent, { className: "p-6", children: [error && (_jsx("div", { className: "p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl", children: error })), !insight && !loadingAgent && (_jsxs("div", { className: "text-center py-12 space-y-3", children: [_jsx("div", { className: "mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center", children: _jsx(Sparkles, { className: "h-6 w-6" }) }), _jsx("h3", { className: "text-xs font-bold text-brand-900", children: "Agent Ready to Run" }), _jsx("p", { className: "text-brand-500 text-xs max-w-md mx-auto", children: "Trigger the AI career advisor to execute. The agent will read your current skills, GPA, and projects, calculate target alignment scores, and map out a structured roadmap." })] })), loadingAgent && (_jsxs("div", { className: "text-center py-12 space-y-3", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto" }), _jsx("p", { className: "text-xs font-semibold text-brand-600", children: "AI Career Advisor is compiling corporate role trends..." })] })), insight && !loadingAgent && (_jsxs("div", { className: "space-y-6 text-xs", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5", children: [_jsxs("div", { className: "p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl md:col-span-1 flex flex-col justify-center items-center text-center", children: [_jsxs("span", { className: "text-3xl font-extrabold text-indigo-600", children: [insight.alignmentScore, "%"] }), _jsx("span", { className: "text-[10px] font-bold text-brand-500 uppercase tracking-wider mt-1", children: "Role Match score" })] }), _jsxs("div", { className: "p-4 bg-brand-50/50 border border-brand-100 rounded-xl md:col-span-2 space-y-1", children: [_jsx("span", { className: "text-[9px] uppercase font-bold text-brand-400", children: "Suggested Focus Track" }), _jsx("h4", { className: "font-bold text-brand-900 text-sm", children: insight.roleAlignment || 'Full Stack Software Engineer' }), _jsx("p", { className: "text-brand-650 leading-relaxed pt-1 text-[11px]", children: insight.reasoning })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [_jsxs("div", { className: "p-4 bg-green-50/20 border border-green-100 rounded-xl space-y-2", children: [_jsxs("h4", { className: "font-bold text-green-700 flex items-center gap-1.5", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-600" }), _jsx("span", { children: "Matched Strengths" })] }), _jsx("div", { className: "flex flex-wrap gap-1", children: (insight.matchedSkills || []).map((s) => (_jsx(Badge, { variant: "success", className: "text-[9px]", children: s }, s))) })] }), _jsxs("div", { className: "p-4 bg-amber-50/20 border border-amber-100 rounded-xl space-y-2", children: [_jsxs("h4", { className: "font-bold text-amber-700 flex items-center gap-1.5", children: [_jsx(AlertTriangle, { className: "h-4 w-4 text-amber-600" }), _jsx("span", { children: "Identified Skill Gaps" })] }), _jsx("div", { className: "flex flex-wrap gap-1", children: (insight.missingSkills || []).map((s) => (_jsx(Badge, { variant: "warning", className: "text-[9px]", children: s }, s))) })] })] }), _jsxs("div", { className: "border-t border-brand-100 pt-5 space-y-4", children: [_jsx("h4", { className: "font-bold text-brand-900 text-sm", children: "Sequenced Learning Roadmap" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: (insight.learningRoadmap || []).map((item, idx) => (_jsxs(Card, { className: "border border-brand-200/50 shadow-none", children: [_jsx(CardHeader, { className: "py-2.5 px-4 bg-brand-50/60 border-b border-brand-100", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h5", { className: "font-bold text-brand-900", children: item.quarter || `Phase ${idx + 1}` }), _jsxs("span", { className: "text-[9px] font-bold text-indigo-600 uppercase", children: ["Phase ", idx + 1] })] }) }), _jsxs(CardContent, { className: "p-4 space-y-2", children: [_jsx("p", { className: "font-bold text-brand-850", children: item.goal }), _jsx("ul", { className: "space-y-1 list-none pl-0", children: (item.actions || []).map((act, actIdx) => (_jsxs("li", { className: "flex items-start gap-1.5 text-brand-700", children: [_jsx(ArrowRight, { className: "h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" }), _jsx("span", { children: act })] }, actIdx))) })] })] }, idx))) })] })] }))] })] }) })] })] }));
};
export default StudentCareer;
