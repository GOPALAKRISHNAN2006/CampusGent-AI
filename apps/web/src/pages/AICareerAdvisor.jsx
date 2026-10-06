import React, { useState } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Sparkles, Brain, CheckCircle, AlertTriangle, ArrowRight, Target, Compass, Layers } from 'lucide-react';

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
        <div className="space-y-6 max-w-5xl mx-auto text-xs animate-fade-in font-sans">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#000000] via-[#1F150C] to-[#412D15] p-6 sm:p-8 text-white border border-[#412D15]/80 shadow-2xl">
                <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#E1DCC9]/15 blur-3xl pointer-events-none animate-pulse-glow" />
                <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#412D15]/40 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2.5 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E1DCC9]/15 border border-[#E1DCC9]/30 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E1DCC9] backdrop-blur-md">
                            <Sparkles className="h-3.5 w-3.5 text-[#E1DCC9] animate-pulse" />
                            <span>Autonomous Career Roadmap Engine</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2.5 tracking-tight">
                            <Brain className="h-7 w-7 text-[#E1DCC9]" />
                            <span>AI Career Intelligence Advisor</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-[#E1DCC9]/85 font-normal leading-relaxed">
                            Get personalized roadmap advice, skill alignments, and target milestones compiled autonomously from your academic and placement profile.
                        </p>
                    </div>
                    <Button
                        onClick={fetchRoadmap}
                        isLoading={loading}
                        variant="sandstone"
                        size="lg"
                        className="shrink-0 font-bold"
                        trailingIcon={Sparkles}
                    >
                        Generate AI Roadmap
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl animate-fade-in shadow-xs">
                    {error}
                </div>
            )}

            {!insight && !loading && (
                <Card bezel className="text-center">
                    <CardContent className="space-y-5 p-10 sm:p-14">
                        <div className="mx-auto w-16 h-16 bg-[#FAF7F2] text-[#412D15] border border-[#E1DCC9] rounded-2xl flex items-center justify-center shadow-subtle ring-1 ring-black/5">
                            <Sparkles className="h-8 w-8 animate-pulse" />
                        </div>
                        <div className="space-y-1.5 max-w-md mx-auto">
                            <h2 className="text-lg font-bold text-[#1F150C]">
                                No Career Analysis Generated Yet
                            </h2>
                            <p className="text-[#6B5336] text-xs leading-relaxed font-normal">
                                Click the button above to request the AI Career Advisor to parse your profile records, verify skills, and draft a quarterly milestone roadmap.
                            </p>
                        </div>
                        <Button
                            onClick={fetchRoadmap}
                            isLoading={loading}
                            variant="primary"
                            size="md"
                            trailingIcon={ArrowRight}
                        >
                            Generate Advice Now
                        </Button>
                    </CardContent>
                </Card>
            )}

            {insight && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card bezel>
                            <CardHeader className="border-b border-[#E1DCC9]/60">
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-[#412D15]" />
                                    <span>Role Alignment</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5 p-5">
                                <div className="text-center py-5 bg-[#FAF7F2] border border-[#E1DCC9] rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
                                    <span className="text-4xl font-black text-[#1F150C] tabular-nums">
                                        {insight.alignmentScore}%
                                    </span>
                                    <p className="text-[10px] text-[#412D15] uppercase tracking-[0.18em] mt-1 font-extrabold">
                                        Match Score
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-[#6B5336] uppercase font-bold tracking-wider">
                                        Suggested Track
                                    </span>
                                    <p className="text-base font-extrabold text-[#1F150C]">
                                        {insight.roleAlignment}
                                    </p>
                                </div>
                                <div className="text-xs text-[#6B5336] leading-relaxed border-t border-[#E1DCC9]/60 pt-4 font-normal">
                                    {insight.reasoning}
                                </div>
                            </CardContent>
                        </Card>

                        <Card bezel>
                            <CardHeader className="border-b border-[#E1DCC9]/60">
                                <CardTitle className="flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-[#412D15]" />
                                    <span>Skills Inventory</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-xs p-5">
                                <div>
                                    <span className="font-bold text-emerald-800 mb-2.5 flex items-center gap-1.5 text-xs">
                                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                                        <span>Matched Strengths</span>
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {insight.matchedSkills?.map((s) => (
                                            <Badge key={s} variant="success" size="sm">{s}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="border-t border-[#E1DCC9]/60 pt-4">
                                    <span className="font-bold text-[#1F150C] mb-2.5 flex items-center gap-1.5 text-xs">
                                        <AlertTriangle className="h-4 w-4 text-[#412D15]" />
                                        <span>Recommended Skills Gaps</span>
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {insight.missingSkills?.map((s) => (
                                            <Badge key={s} variant="bronze" size="sm">{s}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column (Roadmap) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-sm font-extrabold text-[#1F150C] uppercase tracking-wider flex items-center gap-2">
                                <Compass className="h-4 w-4 text-[#412D15]" />
                                <span>Milestone Learning Roadmap</span>
                            </h2>
                            <span className="text-[10.5px] font-bold text-[#6B5336] uppercase tracking-wider">
                                {insight.learningRoadmap?.length || 0} Phases Planned
                            </span>
                        </div>
                        <div className="space-y-4">
                            {insight.learningRoadmap?.map((item, idx) => (
                                <Card key={idx} bezel hover className="transition-all">
                                    <CardHeader className="bg-[#FAF7F2] border-b border-[#E1DCC9]/60 py-3.5">
                                        <div className="flex justify-between items-center w-full">
                                            <h3 className="font-extrabold text-[#1F150C] text-sm">
                                                {item.quarter}
                                            </h3>
                                            <span className="text-[10px] uppercase font-bold text-[#412D15] bg-[#E1DCC9] px-2.5 py-0.5 rounded-full border border-[#C9BF9F]">
                                                Phase {idx + 1}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3.5 text-xs leading-relaxed p-5">
                                        <p className="font-bold text-[#1F150C] text-sm leading-snug">
                                            {item.goal}
                                        </p>
                                        <ul className="space-y-2.5 list-none pl-0">
                                            {item.actions?.map((act, aIdx) => (
                                                <li key={aIdx} className="flex items-start gap-2.5 text-[#6B5336] bg-[#FAF7F2]/60 p-2.5 rounded-xl border border-[#E1DCC9]/40">
                                                    <ArrowRight className="h-3.5 w-3.5 text-[#412D15] mt-0.5 shrink-0" />
                                                    <span className="leading-relaxed font-medium text-[#1F150C]">{act}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AICareerAdvisor;
