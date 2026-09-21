import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  BookOpen, 
  Users, 
  CheckSquare, 
  FileText, 
  TrendingUp, 
  Clock, 
  Calendar, 
  Sparkles, 
  ChevronRight,
  PlusCircle,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export const FacultyClassDetail: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'attendance' | 'assessments' | 'marks' | 'ai-insights'>('overview');
  
  const [classData, setClassData] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  const [marksList, setMarksList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New assessment states
  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTotalMarks, setNewTotalMarks] = useState(100);
  const [newDate, setNewDate] = useState('');

  const fetchClassWorkspace = async () => {
    try {
      setLoading(true);
      const [classRes, assessRes, logsRes] = await Promise.all([
        apiClient.get(`/faculty/classes/${classId}`),
        apiClient.get(`/faculty/assessments?classId=${classId}`),
        apiClient.get(`/faculty/attendance?classId=${classId}`)
      ]);
      setClassData(classRes.data.data);
      setAssessments(assessRes.data.data || []);
      setAttendanceLogs(logsRes.data.data || []);
      if (assessRes.data.data?.length > 0) {
        setSelectedAssessment(assessRes.data.data[0]._id);
      }
    } catch (err: any) {
      setError('Failed to load class details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchClassWorkspace();
    }
  }, [classId]);

  // Load marks when selected assessment changes
  useEffect(() => {
    const fetchMarks = async () => {
      if (selectedAssessment) {
        try {
          const res = await apiClient.get(`/faculty/marks?assessmentId=${selectedAssessment}`);
          setMarksList(res.data.data || []);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchMarks();
  }, [selectedAssessment]);

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/faculty/assessments', {
        classId,
        title: newTitle,
        totalMarks: newTotalMarks,
        date: newDate
      });
      setShowAddAssessment(false);
      setNewTitle('');
      // Reload assessments list
      const res = await apiClient.get(`/faculty/assessments?classId=${classId}`);
      setAssessments(res.data.data || []);
    } catch (err) {
      alert('Failed to publish assessment');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-12 bg-brand-100 rounded-lg"></div>
        <div className="h-44 bg-brand-100 rounded-xl"></div>
      </div>
    );
  }

  const { classDetails, stats } = classData || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in">
      
      {/* Page Header Banner */}
      <div className="bg-white border border-brand-200/60 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <span className="text-[9px] font-bold text-indigo-650 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
            Class Workspace • {classDetails?.courseCode}
          </span>
          <h1 className="text-xl font-bold text-brand-900 mt-1">{classDetails?.subjectName}</h1>
          <p className="text-xs text-brand-500 mt-0.5">
            {classDetails?.section} • Semester {classDetails?.semester} • {classDetails?.students?.length || 0} enrolled students
          </p>
        </div>
        <Link to="/faculty/classes">
          <Button variant="secondary" className="text-[10px] border-brand-200 text-brand-700 hover:bg-brand-50 font-bold px-4 py-2">
            Back to Classes
          </Button>
        </Link>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-brand-200 gap-1 overflow-x-auto pb-px">
        {(['overview', 'students', 'attendance', 'assessments', 'marks', 'ai-insights'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 font-bold border-b-2 transition-all capitalize whitespace-nowrap -mb-px text-[11px] ${
              activeTab === tab 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-brand-450 hover:text-brand-700 hover:border-brand-300'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="border border-brand-200/60 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">Attendance Average</span>
                  <p className="text-xl font-extrabold text-brand-900">{stats?.attendanceAverage || 85}%</p>
                </div>
                <div className="bg-indigo-50 p-2 text-indigo-700 rounded-lg">
                  <UserCheck className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-brand-200/60 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">Class Marks Average</span>
                  <p className="text-xl font-extrabold text-brand-900">{stats?.classMarksAverage || 7.6}/10</p>
                </div>
                <div className="bg-green-50 p-2 text-green-700 rounded-lg">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-brand-200/60 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">Assessments</span>
                  <p className="text-xl font-extrabold text-brand-900">{stats?.assessmentsCount || 0}</p>
                </div>
                <div className="bg-amber-50 p-2 text-amber-700 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-brand-200/60 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">Total Enrolled</span>
                  <p className="text-xl font-extrabold text-brand-900">{stats?.studentsCount || 0}</p>
                </div>
                <div className="bg-brand-100 p-2 text-brand-700 rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scheduled Timetable details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border border-brand-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-4.5 w-4.5 text-brand-400" />
                    <span>Timetable details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-brand-100">
                  {classDetails?.timetable?.map((slot: any, idx: number) => (
                    <div key={idx} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-brand-900 text-sm leading-snug">{slot.day}</p>
                        <p className="text-brand-450 text-[10px]">Lectures slot</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-indigo-650 text-xs">{slot.time}</p>
                        <p className="text-brand-450 text-[9px] uppercase tracking-wider">Room {slot.room}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* AI Assistant Insight */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border border-brand-200/60 shadow-sm bg-brand-900 text-white">
                <CardHeader>
                  <CardTitle className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
                    <span>AI Insights advisor</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded">
                      Class Insight
                    </span>
                    <p className="text-xs text-brand-100 leading-relaxed font-medium mt-2">
                      "Student attendance averages for {classDetails?.subjectName} are stable at {stats?.attendanceAverage || 85}%. Run an audit to verify academic risk scores before next assessment schedules."
                    </p>
                  </div>
                  <div className="border-t border-brand-850 pt-2"></div>
                  <button 
                    onClick={() => setActiveTab('ai-insights')} 
                    className="text-xs font-bold text-indigo-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Analyze Student Gaps</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <Card className="border border-brand-200/60 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider">
              Enrolled students roster ({classDetails?.students?.length || 0} students)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-50 border-b border-brand-200 text-xs font-semibold text-brand-600 uppercase">
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Roll Number</th>
                  <th className="px-6 py-3">CGPA</th>
                  <th className="px-6 py-3">Roster Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 text-xs text-brand-800">
                {classDetails?.students?.map((s: any) => (
                  <tr key={s._id} className="hover:bg-brand-50/50">
                    <td className="px-6 py-4 font-semibold text-brand-900">{s.user?.name || 'Mentee'}</td>
                    <td className="px-6 py-4">{s.rollNumber}</td>
                    <td className="px-6 py-4">{s.cgpa}/10</td>
                    <td className="px-6 py-4">
                      <Badge variant={s.cgpa < 6.0 ? 'warning' : 'success'}>
                        {s.cgpa < 6.0 ? 'Needs Attention' : 'Active'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-brand-850">Class Attendance History</h3>
            <Link to="/faculty/attendance">
              <Button className="bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl flex gap-1.5 items-center h-9">
                <PlusCircle className="h-4 w-4" />
                <span>Mark Attendance</span>
              </Button>
            </Link>
          </div>

          <Card className="border border-brand-200/60 shadow-sm overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-50 border-b border-brand-200 text-xs font-semibold text-brand-600 uppercase">
                    <th className="px-6 py-3">Session Date</th>
                    <th className="px-6 py-3">Presents Count</th>
                    <th className="px-6 py-3">Absents Count</th>
                    <th className="px-6 py-3">Attendance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100 text-xs text-brand-800">
                  {attendanceLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-brand-450">
                        No attendance records submitted yet.
                      </td>
                    </tr>
                  ) : (
                    attendanceLogs.map((log) => {
                      const presents = log.records.filter((r: any) => r.status === 'PRESENT' || r.status === 'LATE').length;
                      const absents = log.records.length - presents;
                      const rate = Math.round((presents / log.records.length) * 100);
                      return (
                        <tr key={log._id} className="hover:bg-brand-50/50">
                          <td className="px-6 py-4 font-semibold text-brand-900">
                            {new Date(log.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-green-700 font-semibold">{presents} Present</td>
                          <td className="px-6 py-4 text-red-650 font-semibold">{absents} Absent</td>
                          <td className="px-6 py-4 font-bold">{rate}%</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'assessments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-brand-850">Class Assessments & Tests</h3>
            <Button 
              onClick={() => setShowAddAssessment(!showAddAssessment)} 
              className="bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl flex gap-1.5 items-center h-9"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Assessment</span>
            </Button>
          </div>

          {showAddAssessment && (
            <Card className="border border-indigo-200 bg-indigo-50/10 p-5 rounded-2xl">
              <form onSubmit={handleCreateAssessment} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-500 mb-1">Assessment Name</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                    placeholder="e.g. Mid Term Quiz 1"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-500 mb-1">Total Marks</label>
                  <input
                    type="number"
                    required
                    value={newTotalMarks}
                    onChange={(e) => setNewTotalMarks(Number(e.target.value))}
                    className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-500 mb-1">Schedule Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
                <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setShowAddAssessment(false)} className="text-[10px] border-brand-200">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold">
                    Publish Test
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.length === 0 ? (
              <div className="col-span-full py-8 text-center text-brand-450">
                No assessments registered for this class.
              </div>
            ) : (
              assessments.map((a) => (
                <Card key={a._id} className="border border-brand-200/60 shadow-sm flex flex-col justify-between p-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-brand-400 block">
                      Published {new Date(a.date).toLocaleDateString()}
                    </span>
                    <h4 className="font-bold text-brand-900 text-sm">{a.title}</h4>
                    <p className="text-brand-500 text-[10px]">Total Marks: {a.totalMarks} points</p>
                  </div>
                  <div className="pt-4 flex items-center justify-between">
                    <Badge variant={a.status === 'COMPLETED' ? 'success' : 'warning'}>
                      {a.status}
                    </Badge>
                    <Link to="/faculty/marks">
                      <Button size="sm" variant="secondary" className="text-[9px] border-brand-200 font-bold hover:bg-brand-50">
                        Record Scores
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'marks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-bold text-sm text-brand-850">Class Assessment Marks Sheet</h3>
            <div className="flex gap-2 items-center">
              <span className="text-brand-450 font-bold text-[10px]">Select Assessment:</span>
              <select
                value={selectedAssessment}
                onChange={(e) => setSelectedAssessment(e.target.value)}
                className="text-xs border border-brand-200 rounded-lg p-2 outline-none bg-white font-bold text-brand-700"
              >
                {assessments.map((a) => (
                  <option key={a._id} value={a._id}>{a.title}</option>
                ))}
              </select>
            </div>
          </div>

          <Card className="border border-brand-200/60 shadow-sm overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-50 border-b border-brand-200 text-xs font-semibold text-brand-600 uppercase">
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3">Roll Number</th>
                    <th className="px-6 py-3">Score Obtained</th>
                    <th className="px-6 py-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100 text-xs text-brand-800">
                  {marksList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-brand-450">
                        No marks recorded for this assessment. Select another or open the Marks workspace.
                      </td>
                    </tr>
                  ) : (
                    marksList.map((m) => (
                      <tr key={m._id} className="hover:bg-brand-50/50">
                        <td className="px-6 py-4 font-semibold text-brand-900">{m.student?.user?.name || 'Student'}</td>
                        <td className="px-6 py-4">{m.student?.rollNumber}</td>
                        <td className="px-6 py-4 font-extrabold text-brand-950">{m.marksObtained} points</td>
                        <td className="px-6 py-4 text-brand-500 italic">{m.remarks || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'ai-insights' && (
        <div className="space-y-6">
          <h3 className="font-bold text-sm text-brand-850 flex items-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
            <span>AI Analytical Risk Evaluation Insights</span>
          </h3>

          <Card className="border border-brand-200/60 shadow-sm bg-indigo-50/10 p-5 rounded-2xl relative overflow-hidden">
            <div className="space-y-3 relative">
              <span className="text-[9px] uppercase font-bold text-indigo-750 bg-indigo-150 px-2.5 py-0.5 rounded block w-fit">
                AI RECOGNITION EVIDENCE
              </span>
              <p className="text-xs text-brand-850 leading-relaxed font-semibold">
                "Subject average trends indicate a stable performance spread. Gopalakrishnan M has maintained high grades (8.4 CGPA). However, Rahul Sharma is at warning levels with low attendance (68%) and low CGPA (5.4)."
              </p>
              <div className="pt-2 flex gap-3">
                <Link to="/faculty/ai-insights">
                  <Button className="bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl">
                    Open AI insights Page
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}
      
    </div>
  );
};
export default FacultyClassDetail;
