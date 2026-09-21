import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  BookOpen,
  Brain,
  CheckCircle,
  Play,
  RotateCw,
  Award,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';

export const StudentLearning: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
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

  const runLearningAgent = async () => {
    setLoadingAgent(true);
    setError(null);
    try {
      const res = await apiClient.post('/agents/execute/learning_path', {});
      setInsight(res.data.data?.insight ?? res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch learning recommendations.');
    } finally {
      setLoadingAgent(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-10 w-44 bg-brand-100 rounded-lg"></div>
        <div className="h-44 bg-brand-100 rounded-xl"></div>
        <div className="h-64 bg-brand-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-indigo-500" />
          <span>Autonomous Learning Dashboard</span>
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Track course modules, progress milestones, and execute the Learning Path Agent for personalized curriculum suggestions.
        </p>
      </div>

      {/* Overview Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <Card className="md:col-span-2 border border-brand-200/60 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">Active Learning Roadmap</span>
                <h2 className="text-lg font-bold text-brand-900 mt-2">Full Stack Web Engineering Path</h2>
                <p className="text-xs text-brand-500 mt-1">Focused on React, Node.js, Express, MongoDB, and AWS Foundations.</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-extrabold text-brand-900">68%</span>
                <p className="text-[10px] font-semibold text-brand-400">Total Completion</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="bg-brand-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-[68%] transition-all"></div>
              </div>
              <div className="flex justify-between text-[10px] text-brand-500 pt-1">
                <span>Completed: 17 modules</span>
                <span>Remaining: 8 modules</span>
              </div>
            </div>

            <div className="p-3 border border-brand-100 rounded-xl bg-brand-50/30 flex items-center justify-between text-xs pt-3">
              <div className="space-y-0.5">
                <span className="text-brand-400 font-semibold uppercase text-[9px]">Up Next:</span>
                <p className="font-bold text-brand-900">Advanced Express Middleware & Error Handling</p>
              </div>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] py-1 px-3 flex gap-1 items-center shrink-0">
                <span>Continue Learning</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Course Stats */}
        <Card className="md:col-span-1 border border-brand-200/60 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider">Curriculum Focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-xs">
              <div className="h-9 w-9 bg-brand-100 text-brand-700 rounded-xl flex items-center justify-center font-bold">
                8.4
              </div>
              <div>
                <span className="text-brand-400 font-semibold uppercase text-[9px] block">Target Role GPA Filter</span>
                <p className="font-bold text-brand-900">CGPA Requirement Met</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="h-9 w-9 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center font-bold">
                12
              </div>
              <div>
                <span className="text-brand-400 font-semibold uppercase text-[9px] block">Completed Certifications</span>
                <p className="font-bold text-brand-900">{profile?.certifications?.length || 0} Badges Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI LEARNING AGENT INTELLIGENCE SECTION */}
      <Card className="border border-brand-200/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4 py-4 border-b border-brand-100">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-900">
            <Brain className="h-4 w-4 text-indigo-500" />
            <span>AI Learning Path Planner Suggestions</span>
          </CardTitle>
          <Button
            onClick={runLearningAgent}
            isLoading={loadingAgent}
            className="text-xs flex gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shrink-0"
          >
            {insight ? <RotateCw className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{insight ? 'Refresh Path Insights' : 'Analyze Skills & Suggest Path'}</span>
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
                Execute the AI agent to map your target careers against your verified skills, exposing gap metrics and suggesting sequenced study modules.
              </p>
            </div>
          )}

          {loadingAgent && (
            <div className="text-center py-12 space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-xs font-semibold text-brand-600">AI Learning Agent is drafting your custom roadmap...</p>
            </div>
          )}

          {insight && !loadingAgent && (
            <div className="space-y-6 text-xs">
              {/* Summary Block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-brand-50/50 p-4 border border-brand-100 rounded-xl">
                <div>
                  <span className="text-[9px] uppercase font-bold text-brand-400">Target Role Career</span>
                  <p className="font-bold text-brand-900 text-sm mt-0.5">{insight.targetCareer || 'Full Stack Web Developer'}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-brand-400">Skill Proficiency Level</span>
                  <p className="font-bold text-brand-900 text-sm mt-0.5">{insight.currentSkillLevel || 'INTERMEDIATE'}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-indigo-500">Milestones Scheduled</span>
                  <p className="font-bold text-indigo-700 text-sm mt-0.5">{(insight.milestones || []).length} Milestones</p>
                </div>
              </div>

              {/* Skills Gaps */}
              <div className="space-y-2">
                <h4 className="font-bold text-brand-900 text-sm">Key Highlighted Skill Gaps</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(insight.skillGaps || []).map((gap: string) => (
                    <Badge key={gap} variant="danger" className="text-[10px]">
                      {gap}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Study Modules Listing */}
              <div className="space-y-4 pt-3 border-t border-brand-100">
                <h4 className="font-bold text-brand-900 text-sm">Sequenced Learning Curriculum</h4>
                <div className="grid grid-cols-1 gap-4">
                  {(insight.learningModules || []).map((mod: any, idx: number) => (
                    <Card key={idx} className="border border-brand-200/50 hover:border-brand-200 shadow-none">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Module {idx + 1}</span>
                            <h3 className="font-bold text-brand-900 text-sm mt-1">{mod.moduleTitle}</h3>
                          </div>
                          <Badge variant={mod.estimatedPriority === 'HIGH' ? 'danger' : 'default'} className="text-[9px]">
                            {mod.estimatedPriority || 'NORMAL'} PRIORITY
                          </Badge>
                        </div>

                        {/* Topics */}
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-brand-450">Topics Covered</span>
                          <div className="flex flex-wrap gap-1.5">
                            {mod.topics.map((t: string) => (
                              <span key={t} className="px-2 py-0.5 bg-brand-100/50 text-brand-800 rounded text-[10px]">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Practice tasks and projects */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-brand-450">Lab Practice Tasks</span>
                            <ul className="list-disc pl-4 text-brand-600 space-y-0.5">
                              {mod.practiceTasks.map((pt: string, pIdx: number) => (
                                <li key={pIdx}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-brand-450">Featured Capstones</span>
                            <ul className="list-disc pl-4 text-brand-600 space-y-0.5">
                              {mod.projects.map((proj: string, prIdx: number) => (
                                <li key={prIdx}>{proj}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Milestones timeline */}
              <div className="border-t border-brand-100 pt-5 space-y-3">
                <h4 className="font-bold text-brand-900 text-sm">Target Milestones Sequence</h4>
                <div className="relative pl-6 border-l border-brand-200 space-y-4 mt-2">
                  {(insight.recommendedSequence || insight.milestones || []).map((seq: string, idx: number) => (
                    <div key={idx} className="relative text-xs">
                      {/* Node Bullet */}
                      <span className="absolute -left-[30px] top-1 bg-white border-2 border-indigo-600 h-4 w-4 rounded-full flex items-center justify-center">
                        <span className="bg-indigo-600 h-1.5 w-1.5 rounded-full"></span>
                      </span>
                      <p className="font-bold text-brand-900">Milestone {idx + 1}</p>
                      <p className="text-brand-650 mt-0.5 leading-relaxed">{seq}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default StudentLearning;
