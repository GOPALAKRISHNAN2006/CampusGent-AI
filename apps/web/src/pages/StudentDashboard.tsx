import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Sparkles,
  Trophy,
  Calendar,
  CheckSquare,
  TrendingUp,
  ArrowRight,
  User,
  Briefcase,
  BookOpen,
  FileText,
  Clock,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardHero, DashboardSectionTitle, DashboardStat } from '../components/dashboard/DashboardPrimitives';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, profileRes] = await Promise.all([
        apiClient.get('/analytics/student'),
        apiClient.get('/students/profile')
      ]);
      setStats(statsRes.data.data);
      setProfile(profileRes.data.data);
    } catch (err: any) {
      setError('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const calculateCompletion = () => {
    if (!profile) return 0;
    let score = 0;
    let total = 9;
    if (profile.rollNumber) score++;
    if (profile.semester) score++;
    if (profile.cgpa > 0) score++;
    if (profile.githubProfile || profile.linkedinProfile) score++;
    if (profile.skills && profile.skills.length > 0) score++;
    if (profile.projects && profile.projects.length > 0) score++;
    if (profile.certifications && profile.certifications.length > 0) score++;
    if (profile.careerInterests && profile.careerInterests.length > 0) score++;
    if (profile.careerGoals && profile.careerGoals.length > 0) score++;
    return Math.round((score / total) * 100);
  };

  // GPA chart progression mock data
  const gpaData = [
    { semester: 'Sem 1', gpa: 7.2 },
    { semester: 'Sem 2', gpa: 7.8 },
    { semester: 'Sem 3', gpa: 8.1 },
    { semester: 'Sem 4', gpa: stats?.cgpa || 8.4 },
  ];

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-28 bg-brand-100 rounded-2xl"></div>
        <div className="h-16 bg-brand-100 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="h-24 bg-brand-100 rounded-xl"></div>
          <div className="h-24 bg-brand-100 rounded-xl"></div>
          <div className="h-24 bg-brand-100 rounded-xl"></div>
          <div className="h-24 bg-brand-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const completionPercent = calculateCompletion();

  // Next Best Action logic based on profile metrics
  let nextAction = {
    title: 'Conduct Mock Practice Interview',
    description: 'Prepare yourself for upcoming campus recruiting drives. Run the AI interview simulator now.',
    cta: 'Start Mock Interview',
    link: '/ai-interview'
  };

  if (completionPercent < 80) {
    nextAction = {
      title: 'Complete Student Profile context',
      description: 'Your placement profile completion is currently low. Register your projects and LinkedIn handles to unlock drives.',
      cta: 'Complete Profile',
      link: '/profile'
    };
  } else if (!profile?.resumeUrl) {
    nextAction = {
      title: 'Upload active Resume PDF',
      description: 'You haven\'t uploaded or analyzed your resume. Execute the AI structure check to identify formatting issues.',
      cta: 'Improve Resume',
      link: '/resume'
    };
  } else if ((profile?.skills || []).length < 5) {
    nextAction = {
      title: 'Declare technical Skills and Certifications',
      description: 'List technical and coding competencies on your profile to enable better match scoring by matching agents.',
      cta: 'Declare Skills',
      link: '/skills-projects'
    };
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in">
      <DashboardHero
        eyebrow="Student success command center"
        title={`Build your next breakthrough, ${user?.name.split(' ')[0] || 'student'}.`}
        description={`${profile?.department?.name || 'Your academic journey'} · Semester ${profile?.semester || 1}. CampusGent turns your activity into a clear, evidence-backed placement plan.`}
        icon={Sparkles}
        action={{ label: 'Open my placement plan', href: '/placements' }}
      >
        <div className="min-w-[210px] rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-100/70">Placement readiness</p>
          <p className="mt-2 text-4xl font-black">{stats?.readinessScore || profile?.placementReadinessScore || 72}%</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-cyan-300" style={{ width: `${stats?.readinessScore || profile?.placementReadinessScore || 72}%` }} /></div>
        </div>
      </DashboardHero>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* PRIMARY ACTION / ATTENTION AREA */}
      <div className="bg-indigo-900 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-32 w-32 bg-indigo-850 rounded-full filter blur-xl opacity-35 -mr-10 -mt-10"></div>
        
        <div className="space-y-1.5 max-w-xl relative">
          <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-350 bg-indigo-950/40 px-2.5 py-0.5 rounded">
            Attention Required
          </span>
          <h3 className="font-bold text-sm text-white">{nextAction.title}</h3>
          <p className="text-xs text-indigo-150 leading-relaxed">{nextAction.description}</p>
        </div>

        <Link to={nextAction.link} className="shrink-0 relative">
          <Button className="bg-white text-indigo-950 hover:bg-indigo-50 font-bold px-5 py-2.5 rounded-xl border-0 shadow-sm flex gap-1.5 items-center">
            <span>{nextAction.cta}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* METRIC OVERVIEW ROW */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat label="Cumulative GPA" value={`${stats?.cgpa || '0.00'}/10`} detail="Academic momentum" icon={Trophy} />
        <DashboardStat label="Class attendance" value={`${stats?.attendance || 88}%`} detail="Keep above 75%" icon={Calendar} tone="emerald" />
        <DashboardStat label="Skills declared" value={stats?.skillsCount || 0} detail="Profile evidence" icon={CheckSquare} tone="amber" />
        <DashboardStat label="Profile completion" value={`${completionPercent}%`} detail="Unlock better matches" icon={User} tone="cyan" />
      </div>

      {/* MAIN TWO-COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Performance Summary & Modules (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* GPA Line Chart */}
          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-brand-50">
              <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-brand-450" />
                <span>Academic CGPA progression</span>
              </CardTitle>
              <Link to="/academics" className="text-indigo-650 hover:underline font-semibold flex items-center gap-0.5">
                <span>View Transcript</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="h-64 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gpaData} margin={{ top: 10, right: 30, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="semester" stroke="#94a3b8" fontSize={10} />
                  <YAxis domain={[0, 10]} stroke="#94a3b8" fontSize={10} />
                  <Tooltip />
                  <Line type="monotone" dataKey="gpa" stroke="#2A7C13" strokeWidth={2} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Learning Progress Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-brand-200/60 shadow-sm flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-brand-400" />
                  <span>Learning Roadmap</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <span className="font-bold text-brand-900 block leading-snug">Full Stack Development Path</span>
                  <span className="text-[10px] text-brand-400 font-medium">68% Complete</span>
                </div>
                
                <div className="p-3 border border-brand-100 rounded-xl bg-brand-50/20 text-brand-700 leading-snug space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-brand-400">Next Lesson:</span>
                  <p className="font-bold text-brand-900">Advanced Express Middleware</p>
                </div>
                <Link to="/learning" className="inline-block pt-1">
                  <Button size="sm" variant="secondary" className="text-[10px] py-1 px-3 border-brand-200 text-brand-700 font-semibold hover:bg-brand-50">
                    Continue Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border border-brand-200/60 shadow-sm flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-brand-400" />
                  <span>Target Role Alignment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <span className="font-bold text-brand-900 block leading-snug">
                    {profile?.careerInterests?.[0] || 'Software Engineer'}
                  </span>
                  <span className="text-[10px] text-brand-400 font-medium">Goal Alignment Match Score</span>
                </div>

                <div className="flex gap-1 flex-wrap">
                  {(profile?.skills || []).slice(0, 3).map((s: any) => (
                    <Badge key={s.name} variant="secondary" className="text-[9px]">{s.name}</Badge>
                  ))}
                  {(profile?.skills || []).length > 3 && (
                    <span className="text-[10px] text-brand-450 font-semibold ml-1">+{profile.skills.length - 3} more</span>
                  )}
                </div>

                <Link to="/career" className="inline-block pt-1">
                  <Button size="sm" variant="secondary" className="text-[10px] py-1 px-3 border-brand-200 text-brand-700 font-semibold hover:bg-brand-50">
                    Open Career Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side: Recommendations & Activities (Span 1) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recommendations Center */}
          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>Recommended For You</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="p-3 border border-brand-50 rounded-xl bg-indigo-50/15 hover:bg-indigo-50/30 transition-colors cursor-pointer space-y-1">
                <h4 className="font-bold text-brand-950 text-[11px]">Improve SQL Knowledge Gaps</h4>
                <p className="text-[10px] text-brand-600 leading-relaxed">Your placement audit reports a database query skill gap.</p>
                <Link to="/skills-projects" className="text-[10px] font-bold text-indigo-650 inline-block pt-1">Add Skill &rarr;</Link>
              </div>

              <div className="p-3 border border-brand-50 rounded-xl bg-indigo-50/15 hover:bg-indigo-50/30 transition-colors cursor-pointer space-y-1">
                <h4 className="font-bold text-brand-950 text-[11px]">Audit Resume ATS Score</h4>
                <p className="text-[10px] text-brand-600 leading-relaxed">Update missing keyword counts on your active template.</p>
                <Link to="/resume" className="text-[10px] font-bold text-indigo-650 inline-block pt-1">Scan Resume &rarr;</Link>
              </div>

              <div className="p-3 border border-brand-50 rounded-xl bg-indigo-50/15 hover:bg-indigo-50/30 transition-colors cursor-pointer space-y-1">
                <h4 className="font-bold text-brand-950 text-[11px]">Practice HR Mock Rounds</h4>
                <p className="text-[10px] text-brand-600 leading-relaxed">Practice HR simulation questions to build communication depth.</p>
                <Link to="/ai-interview" className="text-[10px] font-bold text-indigo-650 inline-block pt-1">Start Simulator &rarr;</Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities Timeline */}
          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-400" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative pl-4 border-l border-brand-100 space-y-4">
                <div className="relative text-[10px]">
                  <span className="absolute -left-[20.5px] top-1 bg-white border border-indigo-600 h-2.5 w-2.5 rounded-full"></span>
                  <span className="text-brand-400 font-semibold block">Today</span>
                  <span className="font-bold text-brand-900">Modified Cumulative GPA Context</span>
                </div>
                <div className="relative text-[10px]">
                  <span className="absolute -left-[20.5px] top-1 bg-white border border-brand-200 h-2.5 w-2.5 rounded-full"></span>
                  <span className="text-brand-400 font-semibold block">Yesterday</span>
                  <span className="font-bold text-brand-900">Submitted application to job Match vacancy</span>
                </div>
                <div className="relative text-[10px]">
                  <span className="absolute -left-[20.5px] top-1 bg-white border border-brand-200 h-2.5 w-2.5 rounded-full"></span>
                  <span className="text-brand-400 font-semibold block">3 days ago</span>
                  <span className="font-bold text-brand-900">Executed AI Success Performance audit</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default StudentDashboard;
