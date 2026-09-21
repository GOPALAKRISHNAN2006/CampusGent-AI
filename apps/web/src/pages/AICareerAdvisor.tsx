import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Sparkles, Brain, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export const AICareerAdvisor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmap = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post('/ai/career-advisor');
      setInsight(res.data.data.insight);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to generate career advice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-500" />
            <span>AI Career Intelligence Advisor</span>
          </h1>
          <p className="text-sm text-brand-500 mt-1">
            Get personalized roadmap advice and skill alignments compiled from your profile.
          </p>
        </div>

        <Button onClick={fetchRoadmap} isLoading={loading} className="shrink-0 flex gap-2">
          <Brain className="h-4 w-4" />
          <span>Analyze Profile & Advice</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      {!insight && !loading && (
        <Card className="text-center p-12">
          <CardContent className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-brand-900">No Career Analysis Yet</h2>
            <p className="text-brand-500 text-sm max-w-md mx-auto">
              Click the button above to request the AI Career Advisor to parse your profile records, verify skills, and draft a roadmap.
            </p>
            <Button onClick={fetchRoadmap} isLoading={loading} variant="secondary">
              Generate Advice Now
            </Button>
          </CardContent>
        </Card>
      )}

      {insight && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alignment Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Role Alignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-4 bg-brand-50 rounded-xl">
                  <span className="text-3xl font-extrabold text-brand-900">{insight.alignmentScore}%</span>
                  <p className="text-xs text-brand-500 uppercase tracking-widest mt-1 font-bold">Match Score</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-brand-500 uppercase font-semibold">Suggested Track</span>
                  <p className="text-lg font-bold text-brand-900">{insight.roleAlignment}</p>
                </div>

                <div className="text-xs text-brand-600 leading-relaxed border-t border-brand-100 pt-4">
                  {insight.reasoning}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div>
                  <span className="font-semibold text-green-700 block mb-2 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Matched Strengths
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {insight.matchedSkills.map((s: string) => (
                      <Badge key={s} variant="success">{s}</Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t border-brand-100 pt-4">
                  <span className="font-semibold text-amber-700 block mb-2 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" /> Recommended Skills Gaps
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {insight.missingSkills.map((s: string) => (
                      <Badge key={s} variant="warning">{s}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Roadmap Cards */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-brand-800 px-1">Q4 Learning Roadmap</h2>
            <div className="space-y-4">
              {insight.learningRoadmap.map((item: any, idx: number) => (
                <Card key={idx}>
                  <CardHeader className="bg-brand-900/5 py-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-brand-950 text-sm">{item.quarter}</h3>
                      <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Phase {idx + 1}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs leading-relaxed">
                    <p className="font-semibold text-brand-800">{item.goal}</p>
                    <ul className="space-y-1.5 list-none pl-0">
                      {item.actions.map((act: string, aIdx: number) => (
                        <li key={aIdx} className="flex items-start gap-2 text-brand-700">
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
    </div>
  );
};
