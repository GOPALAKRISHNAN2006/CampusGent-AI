import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  GraduationCap,
  TrendingUp,
  Award,
  BookOpen,
  Brain,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  RotateCw
} from 'lucide-react';

export const StudentAcademics: React.FC = () => {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [loadingAgent, setLoadingAgent] = useState(false);
  const [insight, setInsight] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await apiClient.get('/students/profile');
      setProfile(res.data.data);
    } catch (err: any) {
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
    } catch (err: any) {
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
        <div className="h-10 w-44 bg-brand-100 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="h-28 bg-brand-100 rounded-xl"></div>
          <div className="h-28 bg-brand-100 rounded-xl"></div>
          <div className="h-28 bg-brand-100 rounded-xl"></div>
        </div>
        <div className="h-64 bg-brand-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-indigo-500" />
          <span>Academic Performance Portal</span>
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Review your course grades, GPA trends, active class attendance audit, and trigger AI success insights.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="border border-brand-200/60 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">Cumulative GPA</span>
              <p className="text-2xl font-extrabold text-brand-900">{profile?.cgpa || '0.00'}/10.0</p>
            </div>
            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 shrink-0">
              <TrendingUp className="h-5.5 w-5.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-brand-200/60 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">Attendance Rate</span>
              <p className="text-2xl font-extrabold text-brand-900">88%</p>
            </div>
            <div className="bg-green-50 p-2.5 rounded-xl text-green-600 shrink-0">
              <CheckCircle className="h-5.5 w-5.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-brand-200/60 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">Credits Earned</span>
              <p className="text-2xl font-extrabold text-brand-900">76 / 120</p>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600 shrink-0">
              <Award className="h-5.5 w-5.5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-brand-200/60 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">Active Semester</span>
              <p className="text-2xl font-extrabold text-brand-900">Semester {profile?.semester || 1}</p>
            </div>
            <div className="bg-brand-100 p-2.5 rounded-xl text-brand-600 shrink-0">
              <BookOpen className="h-5.5 w-5.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GPA Performance Trend */}
        <Card className="lg:col-span-2 border border-brand-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-900">
              <TrendingUp className="h-4 w-4 text-brand-500" />
              <span>CGPA Progression Chart</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gpaData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="gpa" stroke="#2A7C13" strokeWidth={2.5} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Academic Assessments */}
        <Card className="lg:col-span-1 border border-brand-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-brand-900">Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto">
            {recentAssessments.map((a, idx) => (
              <div key={idx} className="p-3 border border-brand-100 rounded-xl flex items-center justify-between text-xs">
                <div className="space-y-0.5 max-w-[70%]">
                  <h4 className="font-bold text-brand-900 truncate">{a.name}</h4>
                  <span className="text-[10px] text-brand-400 block">{a.date}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-brand-900 block">{a.score}</span>
                  <span className="text-[9px] font-bold text-green-600 block">{a.status}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI STUDENT SUCCESS INSIGHTS SECTION */}
      <Card className="border border-brand-200/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4 py-4 border-b border-brand-100">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-900">
            <Brain className="h-4 w-4 text-indigo-500" />
            <span>AI Student Success Agent Intelligence</span>
          </CardTitle>
          <Button
            onClick={runSuccessAgent}
            isLoading={loadingAgent}
            className="text-xs flex gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shrink-0"
          >
            {insight ? <RotateCw className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{insight ? 'Re-Analyze Performance' : 'Run Performance Audit'}</span>
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          {!insight && !loadingAgent && (
            <div className="text-center py-8 space-y-3">
              <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xs font-bold text-brand-900">Agent Ready to Run</h3>
              <p className="text-brand-500 text-xs max-w-md mx-auto">
                Trigger the AI agent to run a deep audit of your current CGPA, course history, and attendance records, yielding actionable study recommendations.
              </p>
            </div>
          )}

          {loadingAgent && (
            <div className="text-center py-12 space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-xs font-semibold text-brand-600">AI Student Success Agent is reviewing your transcripts...</p>
            </div>
          )}

          {insight && !loadingAgent && (
            <div className="space-y-6 text-xs">
              {/* Overall Status Banner */}
              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">Agent Overall Status Summary</span>
                <p className="text-sm font-bold text-brand-900 mt-1 leading-normal">
                  {insight.overallStatus || 'Your academic progress is consistent. Continue maintaining focus.'}
                </p>
              </div>

              {/* Grid of Strengths and Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 bg-green-50/20 border border-green-100 rounded-xl space-y-2">
                  <h4 className="font-bold text-green-700 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Identified Academic Strengths</span>
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-brand-700 leading-relaxed">
                    {(insight.strengths || []).map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-red-50/20 border border-red-100 rounded-xl space-y-2">
                  <h4 className="font-bold text-red-700 flex items-center gap-1.5">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span>Focus Areas & Weaknesses</span>
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-brand-700 leading-relaxed">
                    {(insight.weaknesses || []).map((w: string, idx: number) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Subjects / Risk Factors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <h4 className="font-bold text-brand-850 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Subjects Requiring Special Attention</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(insight.subjectsRequiringAttention || []).length > 0 ? (
                      (insight.subjectsRequiringAttention || []).map((subj: string) => (
                        <Badge key={subj} variant="warning" className="text-[10px]">
                          {subj}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-brand-450 italic">None identified</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-brand-850 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Academic Risk Indicators</span>
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-brand-700 leading-relaxed">
                    {(insight.academicRiskIndicators || []).length > 0 ? (
                      (insight.academicRiskIndicators || []).map((risk: string, idx: number) => (
                        <li key={idx}>{risk}</li>
                      ))
                    ) : (
                      <li className="text-brand-450 italic list-none -ml-4">No risk metrics detected. Good work!</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Action Plans */}
              <div className="border-t border-brand-100 pt-5 space-y-4">
                <h4 className="font-bold text-brand-900 text-sm">Action Plan Recommendation</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <h5 className="font-semibold text-brand-700 uppercase tracking-wide">Short-Term Action Items</h5>
                    <ul className="list-decimal pl-4 space-y-1 text-brand-700 leading-relaxed">
                      {(insight.shortTermActionPlan || []).map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-semibold text-brand-700 uppercase tracking-wide">Long-Term Recommendations</h5>
                    <ul className="list-decimal pl-4 space-y-1 text-brand-700 leading-relaxed">
                      {(insight.longTermAcademicRecommendations || []).map((item: string, idx: number) => (
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
