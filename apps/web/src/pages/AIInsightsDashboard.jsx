import React, { useState } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Input } from '../components/ui/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
    Sparkles, Brain, CheckCircle, GraduationCap, AlertOctagon,
    TrendingUp, Compass, Bell, Target, ShieldAlert, Database,
    ArrowRight, RefreshCw, Activity, Layers, Lock, Cpu
} from 'lucide-react';
import { DynamicJSONViewer } from '../components/ui/DynamicJSONViewer.jsx';

export const AIInsightsDashboard = () => {
    const { user } = useAuth();
    const [targetStudentId, setTargetStudentId] = useState('');
    const [copilotQuery, setCopilotQuery] = useState('');
    const [loadingAgent, setLoadingAgent] = useState(null);
    const [insights, setInsights] = useState({});
    const [error, setError] = useState(null);

    const runAgent = async (name, payload) => {
        setLoadingAgent(name);
        setError(null);
        try {
            const res = await apiClient.post(`/agents/execute/${name}`, payload ? { customParams: payload } : {});
            setInsights((prev) => ({
                ...prev,
                [name]: res.data.data?.insight ?? res.data.data,
            }));
        } catch (err) {
            setError(err.response?.data?.error?.message || `Failed to execute agent "${name}"`);
        } finally {
            setLoadingAgent(null);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in font-sans text-palette-espresso">
            {/* Header Hero Banner with Double-Bezel ambient look */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-palette-black via-palette-espresso to-palette-bronze p-6 sm:p-8 text-white border border-palette-bronze/40 shadow-bezel-dark">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-palette-sandstone/10 blur-3xl" />
                <div className="relative z-10 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-palette-espresso/90 border border-palette-sandstone/30 text-[10px] font-bold uppercase tracking-[0.16em] text-palette-sandstone shadow-sm">
                        <Cpu className="h-3.5 w-3.5 text-palette-sandstone animate-pulse" />
                        <span>Autonomous Multi-Agent Orchestrator</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-3">
                        <Sparkles className="h-7 w-7 text-palette-sandstone" />
                        <span>Unified Student AI Intelligence Hub</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-palette-sandstone/85 max-w-2xl font-normal leading-relaxed">
                        Trigger and coordinate autonomous placement, academic success, and career progression agents from a single verified intelligence control panel.
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl shadow-sm flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                    <span>{error}</span>
                </div>
            )}

            {/* 4 Primary Core Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. Student Success Agent */}
                <Card bezel={true} className="flex flex-col justify-between bg-white/95">
                    <div>
                        <CardHeader className="border-b border-palette-sandstone/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-xs font-bold text-palette-espresso">
                                <GraduationCap className="h-4 w-4 text-palette-bronze" />
                                <span>Student Success AI</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 p-4 text-xs">
                            <p className="text-palette-espresso/70 text-[11px] leading-relaxed">
                                Evaluates grade trajectories and attendance consistency for early risk mitigation.
                            </p>
                            {insights.student_success ? (
                                <div className="bg-palette-sandstone-canvas/70 border border-palette-sandstone/60 p-3 rounded-xl space-y-2 max-h-[260px] overflow-y-auto text-[11px]">
                                    <div>
                                        <span className="font-bold block text-palette-espresso">Academic Status:</span>
                                        <p className="text-palette-espresso/80 leading-snug">{insights.student_success.overallStatus}</p>
                                    </div>
                                    <div>
                                        <span className="font-bold block text-palette-espresso">Risk Indicators:</span>
                                        <p className="text-palette-espresso/80 leading-snug">{insights.student_success.academicRiskIndicators?.join(', ') || 'None detected'}</p>
                                    </div>
                                    <div>
                                        <span className="font-bold block text-palette-espresso">Strengths:</span>
                                        <p className="text-palette-espresso/80 leading-snug">{insights.student_success.strengths?.join(', ') || 'None'}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-palette-espresso/40 italic text-[11px]">
                                    Agent idle
                                </div>
                            )}
                        </CardContent>
                    </div>
                    <div className="p-4 border-t border-palette-sandstone/40">
                        <Button
                            onClick={() => runAgent('student_success')}
                            isLoading={loadingAgent === 'student_success'}
                            variant="primary"
                            trailingIcon={ArrowRight}
                            className="w-full text-xs py-2 justify-center"
                        >
                            Analyze Status
                        </Button>
                    </div>
                </Card>

                {/* 2. Placement Readiness Agent */}
                <Card bezel={true} className="flex flex-col justify-between bg-white/95">
                    <div>
                        <CardHeader className="border-b border-palette-sandstone/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-xs font-bold text-palette-espresso">
                                <TrendingUp className="h-4 w-4 text-palette-bronze" />
                                <span>Placement Readiness</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 p-4 text-xs">
                            <p className="text-palette-espresso/70 text-[11px] leading-relaxed">
                                Evaluates benchmark compliance, verified skills, and resume ATS readiness.
                            </p>
                            {insights.placement_readiness ? (
                                <div className="bg-palette-sandstone-canvas/70 border border-palette-sandstone/60 p-3 rounded-xl space-y-2 max-h-[260px] overflow-y-auto text-[11px]">
                                    <div>
                                        <span className="font-bold block text-palette-espresso">Assessment:</span>
                                        <p className="text-palette-espresso/80 leading-snug">{insights.placement_readiness.placementReadinessAssessment}</p>
                                    </div>
                                    <div>
                                        <span className="font-bold block text-palette-espresso">Resume Status:</span>
                                        <p className="text-palette-espresso/80 leading-snug">{insights.placement_readiness.resumeReadiness}</p>
                                    </div>
                                    <div>
                                        <span className="font-bold block text-palette-espresso">Skill Gaps:</span>
                                        <p className="text-palette-espresso/80 leading-snug">{insights.placement_readiness.skillGaps?.join(', ') || 'None'}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-palette-espresso/40 italic text-[11px]">
                                    Agent idle
                                </div>
                            )}
                        </CardContent>
                    </div>
                    <div className="p-4 border-t border-palette-sandstone/40">
                        <Button
                            onClick={() => runAgent('placement_readiness')}
                            isLoading={loadingAgent === 'placement_readiness'}
                            variant="primary"
                            trailingIcon={ArrowRight}
                            className="w-full text-xs py-2 justify-center"
                        >
                            Audit Readiness
                        </Button>
                    </div>
                </Card>

                {/* 3. Career Recommendation AI */}
                <Card bezel={true} className="flex flex-col justify-between bg-white/95">
                    <div>
                        <CardHeader className="border-b border-palette-sandstone/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-xs font-bold text-palette-espresso">
                                <Brain className="h-4 w-4 text-palette-bronze" />
                                <span>Career Recommendation</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 p-4 text-xs">
                            <p className="text-palette-espresso/70 text-[11px] leading-relaxed">
                                Maps verified competencies to tailored tech industry specializations.
                            </p>
                            {insights.career_recommendation ? (
                                <div className="bg-palette-sandstone-canvas/70 border border-palette-sandstone/60 p-3 rounded-xl space-y-2 max-h-[260px] overflow-y-auto text-[11px]">
                                    <span className="font-bold block text-palette-espresso">Role Matches:</span>
                                    {insights.career_recommendation.recommendations?.map((r, i) => (
                                        <div key={i} className="border-t border-palette-sandstone/60 pt-1.5 space-y-0.5">
                                            <span className="font-bold text-palette-espresso block">{r.role}</span>
                                            <p className="text-[10px] text-palette-espresso/70">{r.whyItMatches}</p>
                                        </div>
                                    )) || <p className="text-palette-espresso/60">No recommendations available</p>}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-palette-espresso/40 italic text-[11px]">
                                    Agent idle
                                </div>
                            )}
                        </CardContent>
                    </div>
                    <div className="p-4 border-t border-palette-sandstone/40">
                        <Button
                            onClick={() => runAgent('career_recommendation')}
                            isLoading={loadingAgent === 'career_recommendation'}
                            variant="primary"
                            trailingIcon={ArrowRight}
                            className="w-full text-xs py-2 justify-center"
                        >
                            Identify Roles
                        </Button>
                    </div>
                </Card>

                {/* 4. Personalized Learning Path */}
                <Card bezel={true} className="flex flex-col justify-between bg-white/95">
                    <div>
                        <CardHeader className="border-b border-palette-sandstone/40 pb-3">
                            <CardTitle className="flex items-center gap-2 text-xs font-bold text-palette-espresso">
                                <Compass className="h-4 w-4 text-palette-bronze" />
                                <span>Learning Path Agent</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 p-4 text-xs">
                            <p className="text-palette-espresso/70 text-[11px] leading-relaxed">
                                Generates personalized modules, practical project tasks, and sequencing.
                            </p>
                            {insights.learning_path ? (
                                <div className="bg-palette-sandstone-canvas/70 border border-palette-sandstone/60 p-3 rounded-xl space-y-2 max-h-[260px] overflow-y-auto text-[11px]">
                                    <div>
                                        <span className="font-bold block text-palette-espresso">Target:</span>
                                        <span className="text-palette-bronze font-bold">{insights.learning_path.targetCareer}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold block text-palette-espresso">Modules:</span>
                                        {insights.learning_path.learningModules?.slice(0, 2).map((m, idx) => (
                                            <div key={idx} className="border-t border-palette-sandstone/60 pt-1 text-[10px]">
                                                <span className="font-bold text-palette-espresso">{m.moduleTitle}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 text-center text-palette-espresso/40 italic text-[11px]">
                                    Agent idle
                                </div>
                            )}
                        </CardContent>
                    </div>
                    <div className="p-4 border-t border-palette-sandstone/40">
                        <Button
                            onClick={() => runAgent('learning_path')}
                            isLoading={loadingAgent === 'learning_path'}
                            variant="primary"
                            trailingIcon={ArrowRight}
                            className="w-full text-xs py-2 justify-center"
                        >
                            Generate Path
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Deep-Dive Agent Panels: Career Growth & Placement Prep */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Career Growth Timeline Agent */}
                <Card bezel={true} className="bg-white/95">
                    <CardHeader className="border-b border-palette-sandstone/40 pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-xs font-bold text-palette-espresso">
                            <TrendingUp className="h-4 w-4 text-palette-bronze" />
                            <span>Career Growth & Progression Timeline</span>
                        </CardTitle>
                        <Badge variant="sandstone" size="xs">Timeline Mode</Badge>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                        {insights.career_growth ? (
                            <div className="space-y-4 text-xs">
                                <div className="flex items-center justify-between bg-palette-sandstone-canvas p-3 rounded-xl border border-palette-sandstone/60">
                                    <span className="font-bold text-palette-espresso">Current Stage</span>
                                    <Badge variant="bronze" size="sm">
                                        {insights.career_growth.currentCareerStage || 'PREPARING'}
                                    </Badge>
                                </div>
                                <div>
                                    <span className="font-bold text-palette-espresso block mb-1">Overall Progress</span>
                                    <p className="text-palette-espresso/80 leading-relaxed">{insights.career_growth.overallProgress}</p>
                                </div>
                                {insights.career_growth.nextMilestone && (
                                    <div className="p-3 bg-palette-sandstone-light/60 rounded-xl border border-palette-sandstone/70">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-palette-bronze block">Next Milestone</span>
                                        <p className="text-palette-espresso font-bold text-xs mt-0.5">{insights.career_growth.nextMilestone}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-palette-espresso/40 italic">
                                Career growth analysis not yet executed.
                            </div>
                        )}
                    </CardContent>
                    <div className="p-4 border-t border-palette-sandstone/40">
                        <Button
                            onClick={() => runAgent('career_growth')}
                            isLoading={loadingAgent === 'career_growth'}
                            variant="secondary"
                            trailingIcon={ArrowRight}
                            className="w-full text-xs py-2 justify-center"
                        >
                            Analyze Career Trajectory
                        </Button>
                    </div>
                </Card>

                {/* Placement Prep Coordinator Agent */}
                <Card bezel={true} className="bg-white/95">
                    <CardHeader className="border-b border-palette-sandstone/40 pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-xs font-bold text-palette-espresso">
                            <Target className="h-4 w-4 text-palette-bronze" />
                            <span>AI Placement Prep Coordinator</span>
                        </CardTitle>
                        <Badge variant="sandstone" size="xs">4-Week Plan</Badge>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                        {insights.placement_preparation ? (
                            <div className="space-y-4 text-xs">
                                {insights.placement_preparation.highestValueNextActions?.length > 0 && (
                                    <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl space-y-1.5">
                                        <span className="font-bold text-emerald-900 block text-xs">Priority Next Actions:</span>
                                        <ul className="space-y-1">
                                            {insights.placement_preparation.highestValueNextActions.slice(0, 3).map((act, i) => (
                                                <li key={i} className="text-emerald-800 text-[11px] flex items-start gap-1.5">
                                                    <span className="font-bold">✓</span>
                                                    <span>{act}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div>
                                    <span className="font-bold text-palette-espresso block mb-1">Weekly Milestones</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(insights.placement_preparation.weeklyMilestones || []).slice(0, 2).map((m) => (
                                            <div key={m.week} className="p-2.5 rounded-lg border border-palette-sandstone/60 bg-palette-sandstone-canvas">
                                                <span className="font-bold text-palette-espresso text-[11px]">Week {m.week}</span>
                                                <p className="text-[10px] text-palette-espresso/70 mt-0.5">{m.goal}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-palette-espresso/40 italic">
                                Multi-agent synthesis plan not yet generated.
                            </div>
                        )}
                    </CardContent>
                    <div className="p-4 border-t border-palette-sandstone/40">
                        <Button
                            onClick={() => runAgent('placement_preparation')}
                            isLoading={loadingAgent === 'placement_preparation'}
                            variant="secondary"
                            trailingIcon={ArrowRight}
                            className="w-full text-xs py-2 justify-center"
                        >
                            Generate Preparation Plan
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Officer & Admin Copilot Panels */}
            {(user?.role === 'PLACEMENT_OFFICER' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                <Card bezel={true} className="bg-white/95">
                    <CardHeader className="border-b border-palette-sandstone/40 pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-xs font-bold text-palette-espresso">
                            <Compass className="h-4 w-4 text-palette-bronze" />
                            <span>AI Placement Officer Natural Language Copilot</span>
                        </CardTitle>
                        <Badge variant="bronze" size="xs">Officer Mode</Badge>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                        <div className="space-y-2">
                            <Input
                                label="Ask natural language questions regarding cohort readiness"
                                value={copilotQuery}
                                onChange={(e) => setCopilotQuery(e.target.value)}
                                placeholder="e.g. Show students who are highly suitable for Java backend jobs."
                            />
                            <div className="flex gap-2 flex-wrap">
                                {[
                                    "Show students who are highly suitable for Java backend jobs.",
                                    "Which skills are most commonly missing in CSE?",
                                    "Which departments have the strongest placement readiness?"
                                ].map((q, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCopilotQuery(q)}
                                        className="text-[10px] bg-palette-sandstone-light hover:bg-palette-sandstone border border-palette-sandstone/70 text-palette-espresso px-2.5 py-1 rounded-lg transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {insights.placement_officer_copilot && (
                            <div className="space-y-3 pt-2">
                                <div className="p-3 bg-palette-sandstone-canvas border border-palette-sandstone/60 rounded-xl space-y-1">
                                    <span className="font-bold text-palette-espresso text-xs">Copilot Summary:</span>
                                    <p className="text-palette-espresso/80 leading-relaxed text-xs whitespace-pre-wrap">
                                        {insights.placement_officer_copilot.explanation}
                                    </p>
                                </div>
                                {insights.placement_officer_copilot.deterministicData && (
                                    <div className="p-3 bg-white border border-palette-sandstone/60 rounded-xl">
                                        <span className="font-bold text-palette-espresso text-xs block mb-1">Aggregated Matches</span>
                                        <DynamicJSONViewer data={insights.placement_officer_copilot.deterministicData} />
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                    <div className="p-4 border-t border-palette-sandstone/40">
                        <Button
                            onClick={() => runAgent('placement_officer_copilot', { customParams: { query: copilotQuery } })}
                            isLoading={loadingAgent === 'placement_officer_copilot'}
                            disabled={!copilotQuery.trim()}
                            variant="primary"
                            trailingIcon={ArrowRight}
                            className="px-6 py-2"
                        >
                            Execute Natural Language Query
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AIInsightsDashboard;
