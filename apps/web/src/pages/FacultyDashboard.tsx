import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { apiClient } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { DashboardHero, DashboardStat } from '../components/dashboard/DashboardPrimitives';
import {
  Users,
  GraduationCap,
  AlertTriangle,
  CheckSquare,
  Plus,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  UserCheck,
  ChevronRight,
  PlusCircle,
  FileText,
  FolderKanban
} from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [riskStudents, setRiskStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Student creation states
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addMessage, setAddMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [classesRes, riskRes] = await Promise.all([
        apiClient.get('/faculty/classes'),
        apiClient.get('/faculty/at-risk')
      ]);
      setClasses(classesRes.data.data || []);
      setRiskStudents(riskRes.data.data || []);
    } catch (err: any) {
      setError('Failed to load faculty dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setAddMessage(null);
    try {
      await apiClient.post('/students', {
        name: newStudentName,
        email: newStudentEmail,
      });
      setAddMessage({ type: 'success', text: 'Student account created. Default password: CampusGent@123' });
      setNewStudentName('');
      setNewStudentEmail('');
      // Refresh risk registry since a new student was registered
      const riskRes = await apiClient.get('/faculty/at-risk');
      setRiskStudents(riskRes.data.data || []);
    } catch (err: any) {
      setAddMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create student' });
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-28 bg-brand-100 rounded-2xl"></div>
        <div className="h-24 bg-brand-100 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-44 bg-brand-100 rounded-xl"></div>
          <div className="h-44 bg-brand-100 rounded-xl"></div>
          <div className="h-44 bg-brand-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalMentees = classes.reduce((sum, c) => sum + (c.students?.length || 0), 0);
  const averageGpa = 7.8; // Standard baseline
  const pendingAssessmentsCount = 3;

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in">
      
      <DashboardHero
        eyebrow="Faculty intelligence workspace"
        title={`Good morning, Professor ${user?.name.split(' ').pop() || ''}.`}
        description={`Your mentoring cockpit for ${classes.length} active classes. Spot risk earlier, intervene with context, and keep every learner moving.`}
        icon={GraduationCap}
        tone="teal"
        action={{ label: 'Review at-risk students', href: '/faculty/at-risk' }}
      >
        <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-100/70">High-risk mentees</p>
          <p className="mt-2 text-4xl font-black">{riskStudents.filter(s => s.riskLevel === 'HIGH').length}</p>
          <p className="mt-1 text-xs text-white/60">Requires focused intervention</p>
        </div>
      </DashboardHero>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* 2. ATTENTION REQUIRED SECTION */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1.5 max-w-xl">
          <span className="text-[9px] uppercase font-bold tracking-widest text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded">
            Action Items
          </span>
          <h3 className="font-bold text-sm text-amber-900">Attendance Review Required</h3>
          <p className="text-xs text-amber-700 leading-relaxed">
            {riskStudents.length} students in your classes have dropped below the 75% attendance threshold. Please review risk indicators and set up interventions.
          </p>
        </div>
        <Link to="/faculty/at-risk" className="shrink-0">
          <Button className="bg-amber-600 hover:bg-amber-750 text-white font-bold px-5 py-2.5 rounded-xl border-0 shadow-sm flex gap-1.5 items-center">
            <span>Review Risk Registry</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* 3. METRIC OVERVIEW ROW */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat label="Assigned mentees" value={totalMentees} detail="Across active classes" icon={Users} tone="indigo" />
        <DashboardStat label="Average section GPA" value={`${averageGpa}/10`} detail="Department baseline" icon={GraduationCap} tone="emerald" />
        <DashboardStat label="Pending tasks" value={pendingAssessmentsCount} detail="Assessments & reviews" icon={CheckSquare} tone="amber" />
        <DashboardStat label="At-risk students" value={riskStudents.length} detail="Open intervention queue" icon={AlertTriangle} tone="rose" />
      </div>

      <div className="hidden">
        <Card className="border border-brand-200/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">Assigned Mentees</span>
              <p className="text-xl font-extrabold text-brand-900">{totalMentees}</p>
            </div>
            <div className="bg-brand-100 p-2 text-brand-700 rounded-lg shrink-0">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-brand-200/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">Average Section GPA</span>
              <p className="text-xl font-extrabold text-brand-900">{averageGpa}/10</p>
            </div>
            <div className="bg-green-50 p-2 text-green-700 rounded-lg shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-brand-200/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">Pending Tasks</span>
              <p className="text-xl font-extrabold text-brand-900">{pendingAssessmentsCount}</p>
            </div>
            <div className="bg-amber-50 p-2 text-amber-700 rounded-lg shrink-0">
              <CheckSquare className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-brand-200/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">At Risk Count</span>
              <p className="text-xl font-extrabold text-red-650">{riskStudents.length}</p>
            </div>
            <div className="bg-red-50 p-2 text-red-700 rounded-lg shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. MAIN TWO-COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Span 2: Scheduled Classes and Performance overview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Teaching Timetable */}
          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-brand-50 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-450" />
                <span>Today's teaching schedule</span>
              </CardTitle>
              <Link to="/faculty/timetable" className="text-xs font-bold text-indigo-650 hover:underline">
                View Timetable
              </Link>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-brand-100">
              {classes.length === 0 ? (
                <div className="p-6 text-center text-brand-400">
                  No teaching classes scheduled for today.
                </div>
              ) : (
                classes.map((c) => (
                  <div key={c._id} className="p-4 flex items-center justify-between hover:bg-brand-50/20 transition-colors">
                    <div className="flex gap-4 items-center">
                      <div className="bg-indigo-50 text-indigo-750 px-3 py-1.5 rounded-lg text-center shrink-0">
                        <p className="font-extrabold text-xs">{c.timetable[0]?.time || '09:00 AM'}</p>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-500">{c.timetable[0]?.day || 'Monday'}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-900 text-sm leading-snug">{c.subjectName}</h4>
                        <p className="text-brand-500 text-[10px]">
                          {c.courseCode} • {c.section} • Room {c.timetable[0]?.room || '201'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/faculty/attendance">
                        <Button size="sm" variant="secondary" className="text-[10px] font-semibold border-brand-200 text-brand-700 hover:bg-brand-50">
                          Take Attendance
                        </Button>
                      </Link>
                      <Link to={`/faculty/classes/${c._id}`}>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-semibold">
                          Open Class
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-brand-200/60 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-750 w-fit">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-brand-950 text-xs">Attendance Check</h4>
                <p className="text-[10px] text-brand-500 leading-normal">Submit attendance logs directly.</p>
                <Link to="/faculty/attendance" className="block pt-1">
                  <Button size="sm" variant="secondary" className="w-full text-[10px] border-brand-200 text-brand-700 font-semibold hover:bg-brand-50">
                    Open Attendance Log
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border border-brand-200/60 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="bg-green-50 p-2.5 rounded-xl text-green-700 w-fit">
                  <FileText className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-brand-950 text-xs">Assessments Workspace</h4>
                <p className="text-[10px] text-brand-500 leading-normal">Create and publish upcoming exams.</p>
                <Link to="/faculty/assessments" className="block pt-1">
                  <Button size="sm" variant="secondary" className="w-full text-[10px] border-brand-200 text-brand-700 font-semibold hover:bg-brand-50">
                    Manage Assessments
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border border-brand-200/60 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="bg-amber-50 p-2.5 rounded-xl text-amber-700 w-fit">
                  <FolderKanban className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-brand-950 text-xs">Marks Ledger</h4>
                <p className="text-[10px] text-brand-500 leading-normal">Enter, calculate, and publish grades.</p>
                <Link to="/faculty/marks" className="block pt-1">
                  <Button size="sm" variant="secondary" className="w-full text-[10px] border-brand-200 text-brand-700 font-semibold hover:bg-brand-50">
                    Record Student Marks
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Add Student Section */}
          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                <PlusCircle className="h-4.5 w-4.5" />
                <span>Create Student Account</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddStudent} className="flex flex-col md:flex-row gap-4 items-end pt-1">
                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-bold uppercase text-brand-450 mb-1 tracking-wider">Student Name</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-bold uppercase text-brand-450 mb-1 tracking-wider">Student Email</label>
                  <input
                    type="email"
                    required
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                    placeholder="e.g. rahul@example.com"
                  />
                </div>
                <Button type="submit" isLoading={isAdding} className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs px-6 py-2.5 font-bold h-10">
                  Register student
                </Button>
              </form>
              {addMessage && (
                <div className={`mt-3 p-2.5 text-xs font-semibold rounded-lg ${addMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {addMessage.text}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Span 1: AI Advisor, At-risk list summary, and Recent Activities */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* AI Advisor Recommendations (Faculty insights) */}
          <Card className="border border-brand-200/60 shadow-sm relative overflow-hidden bg-brand-900 text-white">
            <CardHeader className="pb-2 border-b border-brand-800">
              <CardTitle className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>AI Insights Advisor</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-3">
              <div className="space-y-2">
                <span className="text-[9px] uppercase font-black tracking-widest text-indigo-350 bg-indigo-950/40 px-2 py-0.5 rounded block w-fit">
                  AI RECOMMENDATION
                </span>
                <p className="text-xs text-brand-100 leading-relaxed font-medium">
                  "Section B's database average dropped by 8% over recent normalization test sessions. Consider offering a remedial tutorial on Normalization joins."
                </p>
              </div>
              <div className="border-t border-brand-800 my-2"></div>
              <Link to="/faculty/ai-insights" className="text-xs font-bold text-indigo-400 hover:text-white inline-flex items-center gap-1.5 transition-colors">
                <span>Open Intelligence Hub</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </CardContent>
          </Card>

          {/* At-Risk Students Summary List */}
          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader className="pb-2 border-b border-brand-50 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span>Risk registry alerts</span>
              </CardTitle>
              <Link to="/faculty/at-risk" className="text-[10px] font-bold text-indigo-650 hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-brand-100">
              {riskStudents.length === 0 ? (
                <div className="p-4 text-center text-brand-450">
                  No students currently flagged in risk categories.
                </div>
              ) : (
                riskStudents.slice(0, 3).map((s) => (
                  <div key={s._id} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-brand-900 text-xs">{s.name}</p>
                      <p className="text-[9px] text-brand-450">CGPA: {s.cgpa} • Attnd: {s.attendance}%</p>
                    </div>
                    <Badge variant={s.riskLevel === 'HIGH' ? 'danger' : 'warning'} className="text-[9px] py-0.5 px-2">
                      {s.riskLevel}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Activity Timeline */}
          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-400" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="relative pl-4 border-l border-brand-100 space-y-4">
                <div className="relative text-[10px]">
                  <span className="absolute -left-[20.5px] top-1 bg-white border border-indigo-600 h-2.5 w-2.5 rounded-full"></span>
                  <span className="text-brand-400 font-semibold block">Today</span>
                  <span className="font-bold text-brand-900">Attendance submitted for Web Development</span>
                </div>
                <div className="relative text-[10px]">
                  <span className="absolute -left-[20.5px] top-1 bg-white border border-brand-200 h-2.5 w-2.5 rounded-full"></span>
                  <span className="text-brand-400 font-semibold block">Yesterday</span>
                  <span className="font-bold text-brand-900">Created Quiz 2 for Database Systems</span>
                </div>
                <div className="relative text-[10px]">
                  <span className="absolute -left-[20.5px] top-1 bg-white border border-brand-200 h-2.5 w-2.5 rounded-full"></span>
                  <span className="text-brand-400 font-semibold block">2 days ago</span>
                  <span className="font-bold text-brand-900">Marks published for Mid Term 1 exam</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default FacultyDashboard;
