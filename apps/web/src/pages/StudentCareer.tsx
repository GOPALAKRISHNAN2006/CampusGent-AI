import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Sparkles,
  Brain,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  Play,
  RotateCw
} from 'lucide-react';

export const StudentCareer: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingAgent, setLoadingAgent] = useState(false);
  const [insight, setInsight] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveParameters = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update career parameters.');
    } finally {
      setSaving(false);
    }
  };

  const runCareerAgent = async () => {
    setLoadingAgent(true);
    setError(null);
    try {
      const res = await apiClient.post('/ai/career-advisor');
      setInsight(res.data.data.insight);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch AI career suggestions.');
    } finally {
      setLoadingAgent(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-10 w-44 bg-brand-100 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-brand-100 rounded-xl md:col-span-1"></div>
          <div className="h-96 bg-brand-100 rounded-xl md:col-span-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-indigo-500" />
          <span>AI Career Planning Center</span>
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Define your industry target goals, review role alignment scores, and execute the AI Career Agent for a personalized roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Parameters Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-brand-900">Career Goal Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveParameters} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider">Target Roles / Job Interests</label>
                  <input
                    type="text"
                    value={careerInterestsInput}
                    onChange={(e) => setCareerInterestsInput(e.target.value)}
                    placeholder="e.g. Software Engineer, Backend Dev"
                    className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                  />
                  <span className="text-[10px] text-brand-400 mt-1 block">Comma separated list of job titles.</span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider">Professional Milestones</label>
                  <input
                    type="text"
                    value={careerGoalsInput}
                    onChange={(e) => setCareerGoalsInput(e.target.value)}
                    placeholder="e.g. Learn System Design, Learn Kubernetes"
                    className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                  />
                  <span className="text-[10px] text-brand-400 mt-1 block">Comma separated goals.</span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    isLoading={saving}
                    className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex-1"
                  >
                    Save Career Details
                  </Button>
                </div>
                {saveSuccess && (
                  <p className="text-[10px] font-semibold text-green-600">Career parameters saved successfully!</p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Current Status snapshot */}
          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider">Current Placement Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs text-brand-700">
              <div className="flex justify-between items-center">
                <span>Placement readiness:</span>
                <span className="font-bold text-indigo-650">{profile?.placementReadinessScore || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>GPA context:</span>
                <span className="font-bold text-brand-900">{profile?.cgpa || '0.00'}/10.0</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: AI Career Advisor */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-4 py-4 border-b border-brand-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-900">
                <Brain className="h-4 w-4 text-indigo-500" />
                <span>AI Career Advisor Agent Insight</span>
              </CardTitle>
              <Button
                onClick={runCareerAgent}
                isLoading={loadingAgent}
                className="text-xs flex gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shrink-0"
              >
                {insight ? <RotateCw className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{insight ? 'Re-Analyze Career Plan' : 'Generate Career Plan'}</span>
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                  {error}
                </div>
              )}

              {!insight && !loadingAgent && (
                <div className="text-center py-12 space-y-3">
                  <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xs font-bold text-brand-900">Agent Ready to Run</h3>
                  <p className="text-brand-500 text-xs max-w-md mx-auto">
                    Trigger the AI career advisor to execute. The agent will read your current skills, GPA, and projects, calculate target alignment scores, and map out a structured roadmap.
                  </p>
                </div>
              )}

              {loadingAgent && (
                <div className="text-center py-12 space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-xs font-semibold text-brand-600">AI Career Advisor is compiling corporate role trends...</p>
                </div>
              )}

              {insight && !loadingAgent && (
                <div className="space-y-6 text-xs">
                  {/* Grid Score */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl md:col-span-1 flex flex-col justify-center items-center text-center">
                      <span className="text-3xl font-extrabold text-indigo-600">{insight.alignmentScore}%</span>
                      <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider mt-1">Role Match score</span>
                    </div>

                    <div className="p-4 bg-brand-50/50 border border-brand-100 rounded-xl md:col-span-2 space-y-1">
                      <span className="text-[9px] uppercase font-bold text-brand-400">Suggested Focus Track</span>
                      <h4 className="font-bold text-brand-900 text-sm">{insight.roleAlignment || 'Full Stack Software Engineer'}</h4>
                      <p className="text-brand-650 leading-relaxed pt-1 text-[11px]">{insight.reasoning}</p>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-4 bg-green-50/20 border border-green-100 rounded-xl space-y-2">
                      <h4 className="font-bold text-green-700 flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Matched Strengths</span>
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {(insight.matchedSkills || []).map((s: string) => (
                          <Badge key={s} variant="success" className="text-[9px]">{s}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50/20 border border-amber-100 rounded-xl space-y-2">
                      <h4 className="font-bold text-amber-700 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span>Identified Skill Gaps</span>
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {(insight.missingSkills || []).map((s: string) => (
                          <Badge key={s} variant="warning" className="text-[9px]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Roadmap Timeline */}
                  <div className="border-t border-brand-100 pt-5 space-y-4">
                    <h4 className="font-bold text-brand-900 text-sm">Sequenced Learning Roadmap</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(insight.learningRoadmap || []).map((item: any, idx: number) => (
                        <Card key={idx} className="border border-brand-200/50 shadow-none">
                          <CardHeader className="py-2.5 px-4 bg-brand-50/60 border-b border-brand-100">
                            <div className="flex justify-between items-center">
                              <h5 className="font-bold text-brand-900">{item.quarter || `Phase ${idx + 1}`}</h5>
                              <span className="text-[9px] font-bold text-indigo-600 uppercase">Phase {idx + 1}</span>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 space-y-2">
                            <p className="font-bold text-brand-850">{item.goal}</p>
                            <ul className="space-y-1 list-none pl-0">
                              {(item.actions || []).map((act: string, actIdx: number) => (
                                <li key={actIdx} className="flex items-start gap-1.5 text-brand-700">
                                  <ArrowRight className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
                                  <span>{act}</span>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default StudentCareer;
