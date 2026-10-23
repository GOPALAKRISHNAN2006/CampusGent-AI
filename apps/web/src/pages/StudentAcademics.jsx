import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GraduationCap, TrendingUp, Award, BookOpen, Brain, CheckCircle, XCircle, AlertTriangle, Play, RotateCw } from 'lucide-react';

export const StudentAcademics = () => {
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profile, setProfile] = useState(null);
    const [loadingAgent, setLoadingAgent] = useState(false);
    const [insight, setInsight] = useState(null);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            setLoadingProfile(true);
            const res = await apiClient.get('/students/profile');
            setProfile(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingProfile(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const runSuccessAgent = async () => {
        setLoadingAgent(true);
        setError(null);
        try {
            const res = await apiClient.post('/agents/execute/student_success', {});
            setInsight(res.data.data?.insight ?? res.data.data);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to analyze academic performance.');
        } finally {
            setLoadingAgent(false);
        }
    };

    const gpaData = [
        { semester: 'Sem 1', gpa: 7.2 },
        { semester: 'Sem 2', gpa: 7.8 },
        { semester: 'Sem 3', gpa: 8.1 },
        { semester: 'Sem 4', gpa: profile?.cgpa || 8.4 },
    ];

    const recentAssessments = [
        { name: 'Database Systems Midterm', date: 'Aug 12, 2026', score: '88/100', status: 'PASS' },
        { name: 'Software Engineering Quiz 2', date: 'Aug 08, 2026', score: '18/20', status: 'PASS' },
        { name: 'Java Programming Lab Test', date: 'Jul 28, 2026', score: '45/50', status: 'PASS' },
    ];

    if (loadingProfile) {
        return (
            <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
                <div className="h-10 w-44 bg-brand-100 dark:bg-[#21180F] rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="h-28 bg-brand-100 dark:bg-[#21180F] rounded-xl" />
                    <div className="h-28 bg-brand-100 dark:bg-[#21180F] rounded-xl" />
                    <div className="h-28 bg-brand-100 dark:bg-[#21180F] rounded-xl" />
                </div>
                <div className="h-64 bg-brand-100 dark:bg-[#21180F] rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-brand-900 dark:text-[#F5F0E8] flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-indigo-500 dark:text-[#C49A5A]" />
                    <span>Academic Performance Portal</span>
                </h1>
                <p className="text-sm text-brand-500 dark:text-[#C8BFAF] mt-1">
                    Review your course grades, GPA trends, active class attendance audit, and trigger AI success insights.
                </p>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                <Card className="border border-brand-200/60 dark:border-[#403426] shadow-sm">
                    <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-brand-500 dark:text-[#C8BFAF] uppercase tracking-wider block">Cumulative GPA</span>
                            <p className="text-xl sm:text-2xl font-extrabold text-brand-900 dark:text-[#F5F0E8]">
                                {profile?.cgpa || '0.00'}/10.0
                            </p>
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-950/40 p-2 sm:p-2.5 rounded-xl text-indigo-600 dark:text-[#C49A5A] shrink-0">
                            <TrendingUp className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-brand-200/60 dark:border-[#403426] shadow-sm">
                    <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-brand-500 dark:text-[#C8BFAF] uppercase tracking-wider block">Attendance Rate</span>
                            <p className="text-xl sm:text-2xl font-extrabold text-brand-900 dark:text-[#F5F0E8]">88%</p>
                        </div>
                        <div className="bg-green-50 dark:bg-emerald-950/40 p-2 sm:p-2.5 rounded-xl text-green-600 dark:text-[#4ade80] shrink-0">
                            <CheckCircle className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-brand-200/60 dark:border-[#403426] shadow-sm">
                    <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-brand-500 dark:text-[#C8BFAF] uppercase tracking-wider block">Credits Earned</span>
                            <p className="text-xl sm:text-2xl font-extrabold text-brand-900 dark:text-[#F5F0E8]">76 / 120</p>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-950/40 p-2 sm:p-2.5 rounded-xl text-amber-600 dark:text-[#fbbf24] shrink-0">
                            <Award className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-brand-200/60 dark:border-[#403426] shadow-sm">
                    <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-brand-500 dark:text-[#C8BFAF] uppercase tracking-wider block">Active Semester</span>
                            <p className="text-xl sm:text-2xl font-extrabold text-brand-900 dark:text-[#F5F0E8]">Semester {profile?.semester || 1}</p>
                        </div>
                        <div className="bg-brand-100 dark:bg-[#21180F] p-2 sm:p-2.5 rounded-xl text-brand-600 dark:text-[#E1DCC9] shrink-0">
                            <BookOpen className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts & Assessments Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* CGPA Line Chart */}
                <Card className="lg:col-span-2 border border-brand-200/60 dark:border-[#403426] shadow-sm">
                    <CardHeader className="border-b border-brand-100 dark:border-[#403426]">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-900 dark:text-[#F5F0E8]">
                            <TrendingUp className="h-4 w-4 text-brand-500 dark:text-[#C49A5A]" />
                            <span>CGPA Progression Chart</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={gpaData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#403426" opacity={0.35} />
                                <XAxis dataKey="semester" stroke="#A69B89" fontSize={11} />
                                <YAxis domain={[0, 10]} stroke="#A69B89" fontSize={11} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#17120D',
                                        borderColor: '#403426',
                                        borderRadius: '12px',
                                        color: '#F5F0E8',
                                        fontSize: '11px',
                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                                    }}
                                    itemStyle={{ color: '#4ade80', fontWeight: 'bold' }}
                                    labelStyle={{ color: '#C8BFAF', fontWeight: 'bold' }}
                                />
                                <Line type="monotone" dataKey="gpa" stroke="#4ade80" strokeWidth={2.5} activeDot={{ r: 6, fill: '#4ade80' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Assessments */}
                <Card className="lg:col-span-1 border border-brand-200/60 dark:border-[#403426] shadow-sm">
                    <CardHeader className="border-b border-brand-100 dark:border-[#403426]">
                        <CardTitle className="text-sm font-bold text-brand-900 dark:text-[#F5F0E8]">Recent Assessments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 overflow-y-auto">
                        {recentAssessments.map((a, idx) => (
                            <div key={idx} className="p-3 border border-brand-100 dark:border-[#403426] bg-transparent dark:bg-[#1A140E]/60 rounded-xl flex items-center justify-between text-xs">
                                <div className="space-y-0.5 max-w-[70%]">
                                    <h4 className="font-bold text-brand-900 dark:text-[#F5F0E8] truncate">{a.name}</h4>
                                    <span className="text-[10px] text-brand-400 dark:text-[#A69B89] block">{a.date}</span>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="font-bold text-brand-900 dark:text-[#F5F0E8] block">{a.score}</span>
                                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 block">{a.status}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* AI Student Success Agent Card */}
            <Card className="border border-brand-200/60 dark:border-[#403426] shadow-sm">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-brand-100 dark:border-[#403426]">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-900 dark:text-[#F5F0E8]">
                        <Brain className="h-4 w-4 text-indigo-500 dark:text-[#C49A5A]" />
                        <span>AI Student Success Agent Intelligence</span>
                    </CardTitle>
                    <Button
                        onClick={runSuccessAgent}
                        isLoading={loadingAgent}
                        className="text-xs flex items-center justify-center gap-1.5 py-1.5 px-3 bg-gradient-to-r from-[#1F150C] via-[#140D07] to-[#000000] hover:from-[#412D15] hover:to-[#1F150C] text-[#E1DCC9] font-semibold w-full sm:w-auto shrink-0 border border-[#412D15]"
                    >
                        {insight ? <RotateCw className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        <span>{insight ? 'Re-Analyze Performance' : 'Run Performance Audit'}</span>
                    </Button>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-rose-950/40 border border-red-200 dark:border-rose-900 text-red-700 dark:text-rose-300 text-xs font-semibold rounded-xl">
                            {error}
                        </div>
                    )}
                    {!insight && !loadingAgent && (
                        <div className="text-center py-8 space-y-3">
                            <div className="mx-auto w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-[#C49A5A] rounded-full flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
                                <Brain className="h-6 w-6" />
                            </div>
                            <h3 className="text-xs font-bold text-brand-900 dark:text-[#F5F0E8]">Agent Ready to Run</h3>
                            <p className="text-brand-500 dark:text-[#C8BFAF] text-xs max-w-md mx-auto">
                                Trigger the AI agent to run a deep audit of your current CGPA, course history, and attendance records, yielding actionable study recommendations.
                            </p>
                        </div>
                    )}
                    {loadingAgent && (
                        <div className="text-center py-12 space-y-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C49A5A] mx-auto" />
                            <p className="text-xs font-semibold text-brand-600 dark:text-[#C8BFAF]">AI Student Success Agent is reviewing your transcripts...</p>
                        </div>
                    )}
                    {insight && !loadingAgent && (
                        <div className="space-y-6 text-xs">
                            <div className="p-4 bg-indigo-50/50 dark:bg-[#21180F] border border-indigo-100 dark:border-[#403426] rounded-xl">
                                <span className="text-[10px] font-bold text-indigo-600 dark:text-[#C49A5A] uppercase tracking-widest block">Agent Overall Status Summary</span>
                                <p className="text-sm font-bold text-brand-900 dark:text-[#F5F0E8] mt-1 leading-normal">
                                    {insight.overallStatus || 'Your academic progress is consistent. Continue maintaining focus.'}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="p-4 bg-green-50/20 dark:bg-emerald-950/20 border border-green-100 dark:border-emerald-800/40 rounded-xl space-y-2">
                                    <h4 className="font-bold text-green-700 dark:text-emerald-400 flex items-center gap-1.5">
                                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-emerald-400" />
                                        <span>Identified Academic Strengths</span>
                                    </h4>
                                    <ul className="list-disc pl-4 space-y-1 text-brand-700 dark:text-[#F5F0E8] leading-relaxed">
                                        {(insight.strengths || []).map((s, idx) => (
                                            <li key={idx}>{s}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-4 bg-red-50/20 dark:bg-rose-950/20 border border-red-100 dark:border-rose-800/40 rounded-xl space-y-2">
                                    <h4 className="font-bold text-red-700 dark:text-rose-400 flex items-center gap-1.5">
                                        <XCircle className="h-4 w-4 text-red-600 dark:text-rose-400" />
                                        <span>Focus Areas & Weaknesses</span>
                                    </h4>
                                    <ul className="list-disc pl-4 space-y-1 text-brand-700 dark:text-[#F5F0E8] leading-relaxed">
                                        {(insight.weaknesses || []).map((w, idx) => (
                                            <li key={idx}>{w}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-brand-850 dark:text-[#F5F0E8] flex items-center gap-1.5">
                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        <span>Subjects Requiring Special Attention</span>
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(insight.subjectsRequiringAttention || []).length > 0 ? (
                                            (insight.subjectsRequiringAttention || []).map((subj) => (
                                                <Badge key={subj} variant="warning" className="text-[10px]">
                                                    {subj}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-brand-450 dark:text-[#A69B89] italic">None identified</span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-brand-850 dark:text-[#F5F0E8] flex items-center gap-1.5">
                                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                                        <span>Academic Risk Indicators</span>
                                    </h4>
                                    <ul className="list-disc pl-4 space-y-1 text-brand-700 dark:text-[#F5F0E8] leading-relaxed">
                                        {(insight.academicRiskIndicators || []).length > 0 ? (
                                            (insight.academicRiskIndicators || []).map((risk, idx) => (
                                                <li key={idx}>{risk}</li>
                                            ))
                                        ) : (
                                            <li className="text-brand-450 dark:text-[#A69B89] italic list-none -ml-4">No risk metrics detected. Good work!</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div className="border-t border-brand-100 dark:border-[#403426] pt-5 space-y-4">
                                <h4 className="font-bold text-brand-900 dark:text-[#F5F0E8] text-sm">Action Plan Recommendation</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <h5 className="font-semibold text-brand-700 dark:text-[#C8BFAF] uppercase tracking-wide">Short-Term Action Items</h5>
                                        <ul className="list-decimal pl-4 space-y-1 text-brand-700 dark:text-[#F5F0E8] leading-relaxed">
                                            {(insight.shortTermActionPlan || []).map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <h5 className="font-semibold text-brand-700 dark:text-[#C8BFAF] uppercase tracking-wide">Long-Term Recommendations</h5>
                                        <ul className="list-decimal pl-4 space-y-1 text-brand-700 dark:text-[#F5F0E8] leading-relaxed">
                                            {(insight.longTermAcademicRecommendations || []).map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentAcademics;
