import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Brain, CheckCircle, GraduationCap, AlertOctagon, TrendingUp, RefreshCw, Compass, Bell, Target, ShieldAlert, Database } from 'lucide-react';
import { DynamicJSONViewer } from '../components/ui/DynamicJSONViewer';

export const AIInsightsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [targetStudentId, setTargetStudentId] = useState('');
  const [copilotQuery, setCopilotQuery] = useState('');
  const [loadingAgent, setLoadingAgent] = useState<string | null>(null);
  const [insights, setInsights] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  const runAgent = async (name: string, payload?: any) => {
    setLoadingAgent(name);
    setError(null);
    try {
      const res = await apiClient.post(`/agents/execute/${name}`, payload ? { customParams: payload } : {});
      setInsights((prev) => ({
        ...prev,
        [name]: res.data.data?.insight ?? res.data.data,
      }));
    } catch (err: any) {
      setError(err.response?.data?.error?.message || `Failed to execute agent "${name}"`);
    } finally {
      setLoadingAgent(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-indigo-500" />
          <span>Unified Student AI Intelligence Hub</span>
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Trigger and coordinate autonomous placement, success, and growth agents from a single control panel.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Agent 1: Student Success */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-5 w-5 text-indigo-500" />
              <span>Student Success AI Agent</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-1 text-xs">
            <p className="text-brand-500">Evaluates grades and attendance trends for at-risk factors.</p>
            {insights.student_success ? (
              <div className="bg-brand-50 p-3 rounded-lg space-y-2.5 max-h-[300px] overflow-y-auto">
                <div>
                  <span className="font-bold block text-brand-900">Academic Status:</span>
                  <p className="text-brand-700 leading-relaxed">{insights.student_success.overallStatus}</p>
                </div>
                <div>
                  <span className="font-bold block text-brand-900">Academic Risk Indicators:</span>
                  <p className="text-brand-700 leading-relaxed">{insights.student_success.academicRiskIndicators?.join(', ') || 'None'}</p>
                </div>
                <div>
                  <span className="font-bold block text-brand-900">Strengths:</span>
                  <p className="text-brand-700 leading-relaxed">{insights.student_success.strengths?.join(', ') || 'None'}</p>
                </div>
                <div>
                  <span className="font-bold block text-brand-900">Weaknesses:</span>
                  <p className="text-brand-700 leading-relaxed">{insights.student_success.weaknesses?.join(', ') || 'None'}</p>
                </div>
                <div>
                  <span className="font-bold block text-brand-900">Attention Required:</span>
                  <p className="text-brand-700 leading-relaxed">{insights.student_success.subjectsRequiringAttention?.join(', ') || 'None'}</p>
                </div>
                <div>
                  <span className="font-bold block text-brand-900">Short-term Actions:</span>
                  <p className="text-brand-700 leading-relaxed">{insights.student_success.shortTermActionPlan?.join(', ') || 'None'}</p>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-brand-400 italic">No analysis run yet</div>
            )}
          </CardContent>
          <div className="p-4 border-t border-brand-100">
            <Button
              onClick={() => runAgent('student_success')}
              isLoading={loadingAgent === 'student_success'}
              className="w-full text-xs py-2"
            >
              Analyze Academic Status
            </Button>
          </div>
        </Card>

        {/* Agent 2: Placement Readiness */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Placement Readiness AI Agent</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-1 text-xs">
            <p className="text-brand-500">Evaluates eligibility benchmarks, skills registry, and resume formats.</p>
            {insights.placement_readiness ? (
              <div className="bg-brand-50 p-3 rounded-lg space-y-2.5 max-h-[300px] overflow-y-auto">
                <div>
                  <span className="font-bold block text-brand-900">Placement Assessment:</span>
                  <p className="text-brand-700 leading-relaxed">{insights.placement_readiness.placementReadinessAssessment}</p>
                </div>
                <div>
                  <span className="font-bold block text-brand-900">Resume Readiness:</span>
                  <p className="text-brand-700 leading-relaxed">{insights.placement_readiness.resumeReadiness}</p>
                </div>
                <div>
                  <span className="font-bold block text-brand-900">Interview Readiness:</span>
                  <p className="text-brand-700 leading-relaxed">{insights.placement_readiness.interviewReadiness}</p>
                </div>
                <div>
                  <span className="font-bold block text-brand-900">Technical Readiness:</span>
                  <p className="text-brand-700 leading-relaxed">{insights.placement_readiness.technicalReadiness}</p>
                </div>
                <div>
                  <span className="font-bold block text-brand-900">Strengths:</span>
                  <p className="text-brand-700 leading-relaxed">{insights.placement_readiness.strengths?.join(', ') || 'None'}</p>
                </div>
                <div>
                  <span className="font-bold block text-brand-900">Weaknesses:</span>
                  <p className="text-brand-700 leading-relaxed">{insights.placement_readiness.weaknesses?.join(', ') || 'None'}</p>
                </div>
                <div>
                  <span className="font-bold block text-brand-900">Skill Gaps:</span>
                  <p className="text-brand-700 leading-relaxed">{insights.placement_readiness.skillGaps?.join(', ') || 'None'}</p>
                </div>
                <div>
                  <span className="font-bold block text-brand-900">Prep Priorities:</span>
                  <p className="text-brand-700 leading-relaxed">{insights.placement_readiness.preparationPriorities?.join(', ') || 'None'}</p>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-brand-400 italic">No analysis run yet</div>
            )}
          </CardContent>
          <div className="p-4 border-t border-brand-100">
            <Button
              onClick={() => runAgent('placement_readiness')}
              isLoading={loadingAgent === 'placement_readiness'}
              className="w-full text-xs py-2"
            >
              Audit Placement Eligibility
            </Button>
          </div>
        </Card>

        {/* Agent 3: Career Growth */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Brain className="h-5 w-5 text-amber-500" />
              <span>Career Recommendation AI</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-1 text-xs">
            <p className="text-brand-500">Maps profile capabilities to suggested tech industry specializations.</p>
            {insights.career_recommendation ? (
              <div className="bg-brand-50 p-3 rounded-lg space-y-2 max-h-[300px] overflow-y-auto">
                <div>
                  <span className="font-bold block text-brand-900 font-semibold mb-1">Recommendations:</span>
                  {insights.career_recommendation.recommendations ? (
                    insights.career_recommendation.recommendations.map((r: any, i: number) => (
                      <div key={i} className="mt-1 border-t border-brand-200 pt-1.5 space-y-1">
                        <span className="font-semibold text-indigo-700 block">{r.role}</span>
                        <p className="text-[10px] text-brand-700">{r.whyItMatches}</p>
                        <p className="text-[10px] text-brand-500 font-medium">Matching Skills: <span className="text-brand-600 font-normal">{r.matchingSkills?.join(', ') || 'None'}</span></p>
                        <p className="text-[10px] text-brand-500 font-medium">Missing Skills: <span className="text-brand-600 font-normal">{r.missingSkills?.join(', ') || 'None'}</span></p>
                        <p className="text-[10px] text-brand-500 font-medium">Suggested Project: <span className="text-brand-600 font-normal">{r.recommendedProjects?.[0] || 'None'}</span></p>
                      </div>
                    ))
                  ) : (
                    insights.career_recommendation.suggestedRoles?.map((r: any, i: number) => (
                      <div key={i} className="mt-1 border-t border-brand-200 pt-1">
                        <span className="font-semibold text-indigo-700">{r.role}</span>
                        <p className="text-[10px] text-brand-500">{r.reasoning}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-brand-400 italic">No recommendations run yet</div>
            )}
          </CardContent>
          <div className="p-4 border-t border-brand-100">
            <Button
              onClick={() => runAgent('career_recommendation')}
              isLoading={loadingAgent === 'career_recommendation'}
              className="w-full text-xs py-2"
            >
              Identify Optimal Roles
            </Button>
          </div>
        </Card>

        {/* Agent 4: Learning Path */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Compass className="h-5 w-5 text-indigo-500" />
              <span>Personalized Learning Path Agent</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-1 text-xs">
            <p className="text-brand-500">Generates custom curriculum, modules, practice tasks, and sequence priorities.</p>
            {insights.learning_path ? (
              <div className="bg-brand-50 p-3 rounded-lg space-y-2.5 max-h-[300px] overflow-y-auto">
                <div>
                  <span className="font-bold block text-brand-900">Target Career:</span>
                  <p className="text-brand-700 leading-relaxed font-semibold text-indigo-700">{insights.learning_path.targetCareer}</p>
                </div>
                <div>
                  <span className="font-bold block text-brand-900">Skill Level & Gaps:</span>
                  <p className="text-brand-500">Level: <span className="text-brand-700">{insights.learning_path.currentSkillLevel}</span></p>
                  <p className="text-brand-500">Gaps: <span className="text-brand-700">{insights.learning_path.skillGaps?.join(', ') || 'None'}</span></p>
                </div>
                <div>
                  <span className="font-bold block text-brand-900">Modules:</span>
                  {insights.learning_path.learningModules?.map((m: any, idx: number) => (
                    <div key={idx} className="mt-1 border-t border-brand-200 pt-1">
                      <span className="font-bold text-brand-800">{m.moduleTitle} ({m.estimatedPriority})</span>
                      <p className="text-[10px] text-brand-600">Topics: {m.topics?.join(', ')}</p>
                      <p className="text-[10px] text-brand-600">Tasks: {m.practiceTasks?.join(', ')}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <span className="font-bold block text-brand-900">Sequence / Milestones:</span>
                  <p className="text-brand-700 leading-relaxed">{insights.learning_path.recommendedSequence?.join(' -> ') || 'None'}</p>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-brand-400 italic">No recommendations run yet</div>
            )}
          </CardContent>
          <div className="p-4 border-t border-brand-100">
            <Button
              onClick={() => runAgent('learning_path')}
              isLoading={loadingAgent === 'learning_path'}
              className="w-full text-xs py-2"
            >
              Generate Learning Path
            </Button>
          </div>
        </Card>
      </div>

      {/* Career Growth Agent — Full-width Timeline Card */}
      <Card className="mt-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            <span>Career Growth & Progression Agent</span>
            <Badge variant="secondary" className="ml-auto text-[10px]">Timeline View</Badge>
          </CardTitle>
          <p className="text-xs text-brand-500 mt-1">Tracks long-term development across skills, projects, certifications, interviews, and applications.</p>
        </CardHeader>
        <CardContent>
          {insights.career_growth ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left: Stage + Progress */}
              <div className="space-y-4">
                <div className="text-center">
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold tracking-wide
                    ${insights.career_growth.currentCareerStage === 'READY' || insights.career_growth.currentCareerStage === 'PLACED'
                      ? 'bg-green-100 text-green-700'
                      : insights.career_growth.currentCareerStage === 'PREPARING'
                      ? 'bg-blue-100 text-blue-700'
                      : insights.career_growth.currentCareerStage === 'BUILDING'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-brand-100 text-brand-600'}`}>
                    Stage: {insights.career_growth.currentCareerStage}
                  </span>
                </div>
                <p className="text-xs text-brand-600 leading-relaxed">{insights.career_growth.overallProgress}</p>
                <div>
                  <span className="font-bold text-xs text-brand-900 block mb-1">Next Milestone</span>
                  <p className="text-xs text-indigo-700 bg-indigo-50 rounded p-2">{insights.career_growth.nextMilestone}</p>
                </div>
                <div>
                  <span className="font-bold text-xs text-brand-900 block mb-1">Strengths</span>
                  <ul className="space-y-0.5">
                    {insights.career_growth.strengths?.map((s: string, i: number) => (
                      <li key={i} className="text-xs text-brand-700 flex items-start gap-1">
                        <span className="text-green-500 mt-0.5">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-bold text-xs text-brand-900 block mb-1">Development Areas</span>
                  <ul className="space-y-0.5">
                    {insights.career_growth.developmentAreas?.map((d: string, i: number) => (
                      <li key={i} className="text-xs text-brand-700 flex items-start gap-1">
                        <span className="text-amber-500 mt-0.5">→</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Center: Timeline */}
              <div>
                <span className="font-bold text-xs text-brand-900 block mb-3">Career Timeline</span>
                <div className="relative border-l-2 border-indigo-200 pl-4 space-y-4">
                  {insights.career_growth.timeline?.map((t: any, i: number) => (
                    <div key={i} className="relative">
                      <span className={`absolute -left-[22px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white
                        ${t.category === 'SKILL' ? 'bg-blue-500'
                        : t.category === 'PROJECT' ? 'bg-purple-500'
                        : t.category === 'CERTIFICATION' ? 'bg-green-500'
                        : t.category === 'INTERVIEW' ? 'bg-amber-500'
                        : t.category === 'APPLICATION' ? 'bg-indigo-500'
                        : 'bg-brand-400'}`} />
                      <p className="text-[10px] text-brand-400 uppercase tracking-wide">{t.period}</p>
                      <p className="text-xs font-medium text-brand-800">{t.event}</p>
                      <p className="text-[10px] text-brand-500 italic">{t.impact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Recommendations */}
              <div className="space-y-4">
                <div>
                  <span className="font-bold text-xs text-brand-900 block mb-1">Recommended Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {insights.career_growth.recommendedSkills?.map((s: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-xs text-brand-900 block mb-1">Recommended Projects</span>
                  <ul className="space-y-0.5">
                    {insights.career_growth.recommendedProjects?.map((p: string, i: number) => (
                      <li key={i} className="text-xs text-brand-700 flex items-start gap-1">
                        <span className="text-purple-500 mt-0.5">◆</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-bold text-xs text-brand-900 block mb-1">Recommended Experiences</span>
                  <ul className="space-y-0.5">
                    {insights.career_growth.recommendedExperiences?.map((e: string, i: number) => (
                      <li key={i} className="text-xs text-brand-700 flex items-start gap-1">
                        <span className="text-indigo-500 mt-0.5">★</span> {e}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-brand-400 italic text-sm">Career growth analysis not yet generated</div>
          )}
        </CardContent>
        <div className="p-4 border-t border-brand-100">
          <Button
            onClick={() => runAgent('career_growth')}
            isLoading={loadingAgent === 'career_growth'}
            className="w-full text-xs py-2 md:w-auto"
          >
            Analyse Career Trajectory
          </Button>
        </div>
      </Card>

      {/* Student Risk Agent Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertOctagon className="h-5 w-5 text-red-500" />
            <span>AI Student Risk Assessment Agent</span>
            <Badge variant="secondary" className="ml-auto text-[10px]">Early Intervention</Badge>
          </CardTitle>
          <p className="text-xs text-brand-500 mt-1">
            Predictive indicator highlighting potential academic, behavioral, or engagement risks requiring advisor assistance.
          </p>
        </CardHeader>
        <CardContent>
          {insights.student_risk ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-brand-50 p-4 rounded-lg">
                <div>
                  <span className="font-bold text-[10px] text-brand-400 uppercase tracking-wide block">Risk Status</span>
                  <span className={`inline-block mt-1 px-2.5 py-1 rounded text-xs font-bold
                    ${insights.student_risk.riskIndicator === 'HIGH' ? 'bg-red-100 text-red-700'
                    : insights.student_risk.riskIndicator === 'MEDIUM' ? 'bg-amber-100 text-amber-700'
                    : 'bg-green-100 text-green-700'}`}>
                    {insights.student_risk.riskIndicator}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[10px] text-brand-400 uppercase tracking-wide block">Severity Level</span>
                  <span className={`inline-block mt-1 px-2.5 py-1 rounded text-xs font-bold
                    ${insights.student_risk.severity === 'CRITICAL' || insights.student_risk.severity === 'HIGH' ? 'bg-red-100 text-red-700'
                    : insights.student_risk.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700'
                    : 'bg-green-100 text-green-700'}`}>
                    {insights.student_risk.severity}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[10px] text-brand-400 uppercase tracking-wide block">Prediction Confidence</span>
                  <span className="block mt-1 text-sm font-semibold text-brand-800">
                    {insights.student_risk.confidence}%
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[10px] text-brand-400 uppercase tracking-wide block">Agent Validation</span>
                  <span className="inline-flex items-center gap-1 mt-1 text-xs text-brand-600">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" /> Verified Zod Output
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="font-bold text-xs text-brand-900 block mb-2">Observable Risk Evidence</span>
                  {insights.student_risk.evidence && insights.student_risk.evidence.length > 0 ? (
                    <ul className="space-y-1">
                      {insights.student_risk.evidence.map((item: string, i: number) => (
                        <li key={i} className="text-xs text-brand-700 flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-brand-500 italic">No negative indicators observed.</p>
                  )}
                </div>

                <div>
                  <span className="font-bold text-xs text-brand-900 block mb-2">Suggested Faculty/Admin Intervention</span>
                  <div className="p-3 bg-indigo-50 rounded-lg text-xs text-indigo-800 leading-relaxed font-medium">
                    {insights.student_risk.recommendedHumanIntervention}
                  </div>
                </div>
              </div>

              <div className="p-3 border border-amber-200 bg-amber-50/50 rounded-lg text-[10px] text-amber-800 flex items-start gap-2">
                <AlertOctagon className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold block uppercase tracking-wide text-amber-900 mb-0.5">AI-Assisted Guidance Policy</span>
                  {insights.student_risk.label || "AI-assisted recommendation. Faculty/admin must make the final decision."} This report does not represent automated disciplinary action or academic holds.
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-brand-400 italic text-sm">Risk analysis not yet generated</div>
          )}
        </CardContent>
        <div className="p-4 border-t border-brand-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Button
            onClick={() => runAgent('student_risk')}
            isLoading={loadingAgent === 'student_risk'}
            className="w-full text-xs py-2 md:w-auto bg-red-600 hover:bg-red-700 text-white"
          >
            Assess Risk Factors
          </Button>
          <span className="text-[10px] text-brand-400 italic">
            Note: All triggers and risk outputs are recorded in the central Audit log.
          </span>
        </div>
      </Card>

      {/* Student Engagement Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bell className="h-5 w-5 text-indigo-500" />
            <span>AI Student Engagement & Reminders Agent</span>
            <Badge variant="secondary" className="ml-auto text-[10px]">Actionable Reminders</Badge>
          </CardTitle>
          <p className="text-xs text-brand-500 mt-1">
            Generates high-value reminders (upcoming deadlines, resume improvements, mock practice recommendations) without optimization for addictive hooks.
          </p>
        </CardHeader>
        <CardContent>
          {insights.student_engagement ? (
            <div className="space-y-4">
              {/* Alert Status Banners */}
              {insights.student_engagement.meaningfulAlert && insights.student_engagement.alerts?.length > 0 ? (
                <div className="space-y-2">
                  <span className="font-bold text-[10px] text-brand-400 uppercase tracking-wide block">Active System Alerts</span>
                  {insights.student_engagement.alerts.map((alert: any, i: number) => (
                    <div key={i} className={`p-3 rounded-lg text-xs flex items-start gap-2 border
                      ${alert.priority === 'HIGH' ? 'bg-red-50 border-red-200 text-red-800'
                      : alert.priority === 'MEDIUM' ? 'bg-amber-50 border-amber-200 text-amber-800'
                      : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                      <Bell className="h-4 w-4 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold block">{alert.title}</span>
                        <span>{alert.message}</span>
                        <span className="block mt-1 text-[10px] font-semibold uppercase opacity-75">
                          Category: {alert.type} | Priority: {alert.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs">
                  ✅ Your platform activity is fully on track! No urgent action reminders or critical skill gaps detected.
                </div>
              )}

              {/* Recommendations */}
              <div>
                <span className="font-bold text-xs text-brand-900 block mb-2">Recommended Next Actions</span>
                {insights.student_engagement.recommendations && insights.student_engagement.recommendations.length > 0 ? (
                  <ul className="space-y-1.5">
                    {insights.student_engagement.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="text-xs text-brand-700 flex items-start gap-2">
                        <span className="text-indigo-500 mt-0.5">◆</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-brand-500 italic">No recommendations run yet.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-brand-400 italic text-sm">Engagement analysis not yet generated</div>
          )}
        </CardContent>
        <div className="p-4 border-t border-brand-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Button
            onClick={() => runAgent('student_engagement')}
            isLoading={loadingAgent === 'student_engagement'}
            className="w-full text-xs py-2 md:w-auto"
          >
            Review Engagement Alerts
          </Button>
          <span className="text-[10px] text-brand-400 italic">
            Reminders are filtered to prevent notification spam.
          </span>
        </div>
      </Card>

      {/* Placement Preparation Agent Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Target className="h-5 w-5 text-emerald-600" />
            <span>AI Placement Preparation Coordinator</span>
            <Badge variant="secondary" className="ml-auto text-[10px]">4-Week Roadmap</Badge>
          </CardTitle>
          <p className="text-xs text-brand-500 mt-1">
            Synthesises Skill Gap, Resume, Job Matching, Mock Interview, and Learning Path outputs into a personalised preparation plan. No data is recalculated.
          </p>
        </CardHeader>
        <CardContent>
          {insights.placement_preparation ? (
            <div className="space-y-5">
              {/* Highest-Value Next Actions */}
              {insights.placement_preparation.highestValueNextActions?.length > 0 && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="font-bold text-xs text-emerald-900 block mb-2 flex items-center gap-1">
                    <Target className="h-3.5 w-3.5" /> Highest-Value Next Actions
                  </span>
                  <ol className="list-decimal list-inside space-y-1">
                    {insights.placement_preparation.highestValueNextActions.map((action: string, i: number) => (
                      <li key={i} className="text-xs text-emerald-800">{action}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Source Summary */}
              {insights.placement_preparation.sourceSummary && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    { label: 'Readiness Score', value: `${insights.placement_preparation.sourceSummary.placementReadinessScore}/100` },
                    { label: 'Resume ATS', value: insights.placement_preparation.sourceSummary.resumeScore != null ? `${insights.placement_preparation.sourceSummary.resumeScore}/100` : 'N/A' },
                    { label: 'Open Applications', value: insights.placement_preparation.sourceSummary.openApplications },
                    { label: 'Mock Interviews Done', value: insights.placement_preparation.sourceSummary.completedMockInterviews },
                    { label: 'Critical Gaps', value: insights.placement_preparation.sourceSummary.criticalSkillGaps?.length ?? 0 },
                  ].map((stat, i) => (
                    <div key={i} className="bg-brand-50 rounded-lg p-2 text-center">
                      <div className="text-base font-bold text-brand-900">{stat.value}</div>
                      <div className="text-[10px] text-brand-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Current Priorities */}
              <div>
                <span className="font-bold text-xs text-brand-900 block mb-1">Current Priorities</span>
                <ul className="space-y-1">
                  {(insights.placement_preparation.currentPriorities || []).map((p: string, i: number) => (
                    <li key={i} className="text-xs text-brand-700 flex items-start gap-1.5">
                      <span className="text-emerald-500 mt-0.5 font-bold">{i + 1}.</span>{p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weekly Milestones */}
              {insights.placement_preparation.weeklyMilestones?.length > 0 && (
                <div>
                  <span className="font-bold text-xs text-brand-900 block mb-2">4-Week Roadmap</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {insights.placement_preparation.weeklyMilestones.map((m: any) => (
                      <div key={m.week} className="border border-brand-100 rounded-lg p-3 bg-brand-50">
                        <div className="font-bold text-xs text-brand-800 mb-1">Week {m.week} — {m.goal}</div>
                        <ul className="space-y-0.5">
                          {(m.tasks || []).map((t: string, j: number) => (
                            <li key={j} className="text-[11px] text-brand-600 flex items-start gap-1">
                              <span className="text-emerald-400 mt-0.5">◆</span>{t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Three columns: Technical, DSA, Resume */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { label: 'Technical Topics', key: 'technicalTopics', color: 'text-blue-700' },
                  { label: 'DSA Practice', key: 'dsaPractice', color: 'text-purple-700' },
                  { label: 'Resume Tasks', key: 'resumeTasks', color: 'text-amber-700' },
                ].map(({ label, key, color }) => (
                  <div key={key} className="border border-brand-100 rounded-lg p-3">
                    <span className={`font-bold text-[11px] block mb-1.5 ${color}`}>{label}</span>
                    <ul className="space-y-1">
                      {(insights.placement_preparation[key] || []).map((item: string, i: number) => (
                        <li key={i} className="text-[11px] text-brand-700 flex items-start gap-1">
                          <span className="opacity-50 mt-0.5">•</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-brand-400 italic text-sm">Preparation plan not yet generated</div>
          )}
        </CardContent>
        <div className="p-4 border-t border-brand-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Button
            onClick={() => runAgent('placement_preparation')}
            isLoading={loadingAgent === 'placement_preparation'}
            className="w-full text-xs py-2 md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Generate Preparation Plan
          </Button>
          <span className="text-[10px] text-brand-400 italic">
            Synthesises outputs from 6 peer agents — no data is recalculated.
          </span>
        </div>
      </Card>

      {/* Faculty Intervention Agent Card (Only visible to Faculty, Admin, and Super Admin) */}
      {user?.role !== 'STUDENT' && (
        <Card className="mt-6 border-indigo-200 bg-indigo-50/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <ShieldAlert className="h-5 w-5 text-indigo-600" />
              <span>AI Faculty Intervention Coordinator</span>
              <Badge variant="secondary" className="ml-auto text-[10px] bg-indigo-100 text-indigo-800">Faculty/Advisor Only</Badge>
            </CardTitle>
            <p className="text-xs text-brand-500 mt-1">
              Evaluates student metrics and provides evidence-backed mentoring or academic support action plans. Department-level boundaries apply.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 items-end max-w-md">
              <Input
                label="Target Student User ID"
                value={targetStudentId}
                onChange={(e) => setTargetStudentId(e.target.value)}
                placeholder="e.g. 654321098765432109876543"
                required
              />
            </div>

            {insights.faculty_intervention ? (
              <div className="space-y-4">
                <div className="p-3 bg-white border border-brand-100 rounded-lg space-y-2">
                  <span className="font-bold text-xs text-brand-900 block">Student Analysis: {insights.faculty_intervention.studentName}</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {[
                      { title: 'Academic Risk', key: 'academicRisk', subKey: 'riskLevel', details: insights.faculty_intervention.metrics.academicRisk },
                      { title: 'Attendance', key: 'attendance', subKey: 'attendanceRate', suffix: '%', details: insights.faculty_intervention.metrics.attendance },
                      { title: 'Learning Progress', key: 'learningProgress', subKey: 'progressState', details: insights.faculty_intervention.metrics.learningProgress },
                      { title: 'Skill Gaps', key: 'skillGaps', subKey: 'gaps', isList: true, details: insights.faculty_intervention.metrics.skillGaps },
                      { title: 'Placement Readiness', key: 'placementReadiness', subKey: 'readinessScore', details: insights.faculty_intervention.metrics.placementReadiness },
                      { title: 'Interview Performance', key: 'interviewPerformance', subKey: 'performanceState', details: insights.faculty_intervention.metrics.interviewPerformance },
                    ].map((metric, i) => (
                      <div key={i} className="border border-brand-100 rounded p-2 bg-brand-50/50">
                        <span className="font-bold text-[11px] text-brand-900 block">{metric.title}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-semibold text-brand-800">
                            {metric.isList ? metric.details[metric.subKey]?.join(', ') : metric.details[metric.subKey]}
                            {metric.suffix}
                          </span>
                        </div>
                        <p className="text-[10px] text-brand-500 mt-1 italic">Evidence: {metric.details.evidence}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <span className="font-bold text-xs text-brand-900 block mb-2">Evidence-Backed Recommendations</span>
                  <div className="space-y-2">
                    {insights.faculty_intervention.recommendations && insights.faculty_intervention.recommendations.length > 0 ? (
                      insights.faculty_intervention.recommendations.map((rec: any, i: number) => (
                        <div key={i} className="p-3 bg-white border border-brand-100 rounded-lg text-xs flex items-start gap-2.5">
                          <Badge variant="secondary" className="uppercase text-[9px] shrink-0">{rec.type}</Badge>
                          <div>
                            <span className="font-medium text-brand-800 block">{rec.action}</span>
                            <span className="text-[10px] text-brand-500 block mt-1 italic">Supporting Evidence: {rec.evidence}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-brand-500 italic">No recommendations run yet.</p>
                    )}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-[11px] leading-relaxed">
                  <span className="font-bold block uppercase tracking-wide text-amber-900 mb-0.5">AI-Assisted Guidance Policy</span>
                  Recommendations are generated automatically. Advisors/faculty members must verify all details and make the final decision. Student database records are not modified.
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-brand-400 italic text-sm">Intervention plan not yet assessed. Enter Student ID above.</div>
            )}
          </CardContent>
          <div className="p-4 border-t border-brand-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Button
              onClick={() => runAgent('faculty_intervention', { studentId: targetStudentId })}
              isLoading={loadingAgent === 'faculty_intervention'}
              disabled={!targetStudentId.trim()}
              className="w-full text-xs py-2 md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Assess Intervention Options
            </Button>
            <span className="text-[10px] text-brand-400 italic">
              Access is subject to department ownership matches.
            </span>
          </div>
        </Card>
      )}

      {/* Placement Officer Copilot Card (Only visible to Placement Officer, Admin, and Super Admin) */}
      {(user?.role === 'PLACEMENT_OFFICER' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
        <Card className="mt-6 border-indigo-200 bg-indigo-50/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Compass className="h-5 w-5 text-indigo-600" />
              <span>AI Placement Officer Copilot</span>
              <Badge variant="secondary" className="ml-auto text-[10px] bg-indigo-100 text-indigo-800">Placement Officer Only</Badge>
            </CardTitle>
            <p className="text-xs text-brand-500 mt-1">
              Ask natural language queries about student suitability, common missing skills, department readiness, and preparation needs. Backed by deterministic system aggregates.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                label="Ask the Copilot"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                placeholder="e.g. Show students who are highly suitable for Java backend jobs."
                required
              />
              <div className="flex gap-1.5 flex-wrap">
                {[
                  "Show students who are highly suitable for Java backend jobs.",
                  "Which skills are most commonly missing?",
                  "Which departments have the strongest placement readiness?",
                  "Which students need interview preparation?"
                ].map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCopilotQuery(q)}
                    className="text-[10px] bg-brand-100 hover:bg-brand-200 text-brand-700 px-2 py-0.5 rounded transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {insights.placement_officer_copilot ? (
              <div className="space-y-4 text-xs">
                {/* Interpretation */}
                <div className="p-3 bg-white border border-brand-100 rounded-lg">
                  <span className="font-bold text-brand-900 block mb-0.5">Interpretation Intent</span>
                  <p className="text-brand-700 leading-relaxed italic">{insights.placement_officer_copilot.interpretation}</p>
                </div>

                {/* Explanation */}
                <div className="p-3 bg-white border border-brand-100 rounded-lg">
                  <span className="font-bold text-brand-900 block mb-1">Copilot Analysis Summary</span>
                  <p className="text-brand-700 leading-relaxed whitespace-pre-wrap">{insights.placement_officer_copilot.explanation}</p>
                </div>

                {/* Deterministic Matches / Data */}
                {insights.placement_officer_copilot.deterministicData && (
                  <div className="p-3 bg-white border border-brand-100 rounded-lg space-y-2">
                    <span className="font-bold text-brand-900 block">Verified Data & Matches</span>
                    <div className="max-h-[300px] overflow-y-auto">
                      <DynamicJSONViewer data={insights.placement_officer_copilot.deterministicData} />
                    </div>
                  </div>
                )}

                {/* Recommended Action */}
                {insights.placement_officer_copilot.recommendedAction && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <span className="font-bold text-emerald-900 block mb-0.5 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Recommended Strategic Action
                    </span>
                    <p className="text-emerald-800 font-medium">{insights.placement_officer_copilot.recommendedAction}</p>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-[11px] leading-relaxed">
                  <span className="font-bold block uppercase tracking-wide text-amber-900 mb-0.5">Institutional Officer Disclaimer</span>
                  This output is an AI-assisted analysis derived from verified database statistics. All hiring, shortlisting, and institutional decisions must be manually validated by placement officials.
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-brand-400 italic text-sm">Enter a query or select a template above to ask the copilot.</div>
            )}
          </CardContent>
          <div className="p-4 border-t border-brand-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Button
              onClick={() => runAgent('placement_officer_copilot', { customParams: { query: copilotQuery } })}
              isLoading={loadingAgent === 'placement_officer_copilot'}
              disabled={!copilotQuery.trim()}
              className="w-full text-xs py-2 md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Submit Query
            </Button>
            <span className="text-[10px] text-brand-400 italic">
              Uses deterministic aggregates from the verified database.
            </span>
          </div>
        </Card>
      )}

      {/* Data Quality Agent Card (Only visible to Admin and Super Admin) */}
      {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
        <Card className="mt-6 border-red-200 bg-red-50/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Database className="h-5 w-5 text-red-600" />
              <span>AI Data Quality Compliance Auditor</span>
              <Badge variant="secondary" className="ml-auto text-[10px] bg-red-100 text-red-800">Admin Only</Badge>
            </CardTitle>
            <p className="text-xs text-brand-500 mt-1">
              Analyze schema integrity, duplicate records, stale insights, and invalid relationships across database collections. Action requires human confirmation.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.data_quality ? (
              <div className="space-y-4 text-xs">
                {/* Issues Table */}
                <div className="border border-brand-100 rounded-lg overflow-hidden bg-white">
                  <div className="bg-brand-50/50 p-2.5 font-bold border-b border-brand-100 flex justify-between items-center text-xs">
                    <span>Detected Compliance Anomaly Logs</span>
                    <Badge className="bg-red-600 text-white text-[9px]">{insights.data_quality.issues?.length || 0} Issues</Badge>
                  </div>
                  <div className="divide-y divide-brand-100">
                    {insights.data_quality.issues && insights.data_quality.issues.length > 0 ? (
                      insights.data_quality.issues.map((issue: any, index: number) => {
                        const isCrit = issue.severity === 'CRITICAL';
                        const isWarn = issue.severity === 'WARNING';
                        return (
                          <div key={index} className="p-3 space-y-2">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="font-bold text-brand-900">{issue.type}</span>
                              <Badge
                                className={
                                  isCrit
                                    ? 'bg-red-100 text-red-800 border-red-200'
                                    : isWarn
                                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                                    : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                                }
                              >
                                {issue.severity}
                              </Badge>
                            </div>
                            <p className="text-brand-700 font-mono text-[10px] bg-brand-50 p-1.5 rounded">
                              <span className="font-bold">Affected:</span> {issue.affectedRecord}
                            </p>
                            <p className="text-brand-600"><span className="font-bold text-brand-700">Evidence:</span> {issue.evidence}</p>
                            <p className="text-emerald-700 bg-emerald-50/50 p-2 rounded border border-emerald-100 font-medium">
                              <span className="font-bold text-emerald-900">Correction:</span> {issue.suggestedCorrection}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-emerald-600 font-medium">
                        🎉 Zero data quality compliance issues detected!
                      </div>
                    )}
                  </div>
                </div>

                {/* Disclaimer Warning */}
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-[11px] leading-relaxed">
                  <span className="font-bold block uppercase tracking-wide text-amber-900 mb-0.5">Destructive Actions & Human Confirmation Guard</span>
                  No authoritative database records have been modified. Administrators must manually confirm and execute any corrective actions.
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-brand-400 italic text-sm">Click below to start scanning the database for compliance anomalies.</div>
            )}
          </CardContent>
          <div className="p-4 border-t border-brand-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Button
              onClick={() => runAgent('data_quality', { studentId: targetStudentId })}
              isLoading={loadingAgent === 'data_quality'}
              className="w-full text-xs py-2 md:w-auto bg-red-600 hover:bg-red-700 text-white"
            >
              Scan Database Quality
            </Button>
            <span className="text-[10px] text-brand-400 italic">
              Strictly read-only compliance scan.
            </span>
          </div>
        </Card>
      )}

      {/* AI Governance Dashboard Card (Only visible to Admin and Super Admin) */}
      {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
        <Card className="mt-6 border-indigo-200 bg-indigo-50/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <ShieldAlert className="h-5 w-5 text-indigo-600" />
              <span>AI Governance & Telemetry Auditor</span>
              <Badge variant="secondary" className="ml-auto text-[10px] bg-indigo-100 text-indigo-800">Admin Governance Only</Badge>
            </CardTitle>
            <p className="text-xs text-brand-500 mt-1">
              Audit prompt execution records, latency metrics, model query costs, prompt injection attempts, and validator failures. Privacy boundaries are strictly enforced.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {insights.ai_governance ? (
              <div className="space-y-6 text-xs">
                {/* KPI Metrics Widgets */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white border border-brand-100 p-3 rounded-lg text-center shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-brand-400 block tracking-wider mb-1">Total Executions</span>
                    <span className="text-lg font-black text-brand-900">{insights.ai_governance.totalExecutions || 0}</span>
                  </div>
                  <div className="bg-white border border-brand-100 p-3 rounded-lg text-center shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-brand-400 block tracking-wider mb-1">Avg Latency</span>
                    <span className="text-lg font-black text-brand-900">{insights.ai_governance.averageLatencyMs || 0}ms</span>
                  </div>
                  <div className="bg-white border border-brand-100 p-3 rounded-lg text-center shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-brand-400 block tracking-wider mb-1">Cumulative Cost</span>
                    <span className="text-lg font-black text-brand-900">${(insights.ai_governance.totalCostUsd || 0).toFixed(5)}</span>
                  </div>
                  <div className="bg-white border border-brand-100 p-3 rounded-lg text-center shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-brand-400 block tracking-wider mb-1">Security Events</span>
                    <span className={`text-lg font-black ${insights.ai_governance.injectionAttemptsCount > 0 ? 'text-red-600' : 'text-brand-900'}`}>
                      {insights.ai_governance.injectionAttemptsCount || 0}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-brand-100 p-3 rounded-lg text-center shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-brand-400 block tracking-wider mb-1">API Failures</span>
                    <span className="text-lg font-black text-brand-950">{insights.ai_governance.failuresCount || 0}</span>
                  </div>
                  <div className="bg-white border border-brand-100 p-3 rounded-lg text-center shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-brand-400 block tracking-wider mb-1">Validation Failures</span>
                    <span className="text-lg font-black text-brand-950">{insights.ai_governance.validationFailuresCount || 0}</span>
                  </div>
                </div>

                {/* Narrative Summary */}
                <div className="p-3 bg-white border border-brand-100 rounded-lg">
                  <span className="font-bold text-brand-900 block mb-1">Governance Insight Summary</span>
                  <p className="text-brand-700 leading-relaxed whitespace-pre-wrap">{insights.ai_governance.insights}</p>
                </div>

                {/* Audit Trail List */}
                <div className="border border-brand-100 rounded-lg overflow-hidden bg-white">
                  <div className="bg-brand-50/50 p-2.5 font-bold border-b border-brand-100 text-xs">
                    AI Operations Trace Audits
                  </div>
                  <div className="divide-y divide-brand-100 max-h-[250px] overflow-y-auto">
                    {insights.ai_governance.auditTrail && insights.ai_governance.auditTrail.length > 0 ? (
                      insights.ai_governance.auditTrail.map((audit: any, index: number) => {
                        const isInj = audit.action === 'AI_PROMPT_INJECTION_ATTEMPT';
                        const isFail = audit.action === 'AI_FAILURE';
                        return (
                          <div key={index} className="p-2.5 hover:bg-brand-50/20 transition flex flex-col gap-1">
                            <div className="flex items-center justify-between flex-wrap gap-1 text-[10px]">
                              <span className="font-bold text-brand-900 flex items-center gap-1">
                                <Badge variant="outline" className="text-[9px] uppercase font-normal">{audit.feature}</Badge>
                                <span>{audit.action}</span>
                              </span>
                              <span className="text-brand-400 font-mono">
                                {new Date(audit.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className={`p-1.5 rounded text-[9px] overflow-x-auto ${isInj ? 'bg-red-50 border border-red-100' : isFail ? 'bg-amber-50 border border-amber-100' : 'bg-brand-50'}`}>
                              <DynamicJSONViewer data={audit.details} defaultExpanded={false} />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-brand-400 italic">No operations audit records currently in session.</div>
                    )}
                  </div>
                </div>

                {/* Privacy Warning */}
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-[11px] leading-relaxed">
                  <span className="font-bold block uppercase tracking-wide text-amber-900 mb-0.5">Privacy Boundary Warning</span>
                  Governance records only track operations telemetry, versions, and token usage counts. Logging of raw passwords, private keys, authorization credentials, or sensitive inputs is strictly disabled.
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-brand-400 italic text-sm">Click below to fetch AI governance operations telemetry.</div>
            )}
          </CardContent>
          <div className="p-4 border-t border-brand-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Button
              onClick={() => runAgent('ai_governance', { studentId: targetStudentId })}
              isLoading={loadingAgent === 'ai_governance'}
              className="w-full text-xs py-2 md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Scan AI Governance
            </Button>
            <span className="text-[10px] text-brand-400 italic">
              Audits prompt latency, model versions, and cost budgets.
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};
export default AIInsightsDashboard;
