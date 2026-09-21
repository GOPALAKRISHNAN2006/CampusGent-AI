import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  Link2, 
  Plus, 
  X, 
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Video
} from 'lucide-react';

export const PlacementInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tabs: Upcoming, Completed, Today
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'SCHEDULED'>('UPCOMING');

  // Schedule Interview modal state
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [schedDate, setSchedDate] = useState('');
  const [schedType, setSchedType] = useState<'TECHNICAL' | 'BEHAVIORAL' | 'HR'>('TECHNICAL');
  const [schedUrl, setSchedUrl] = useState('');

  // Feedback modal state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [activeInterviewId, setActiveInterviewId] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [interviewScore, setInterviewScore] = useState(80);
  const [interviewStatus, setInterviewStatus] = useState<'COMPLETED' | 'CANCELLED' | 'NO_SHOW'>('COMPLETED');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [interviewsRes, appsRes] = await Promise.all([
        apiClient.get('/jobs/all-interviews'),
        apiClient.get('/jobs/all-applications')
      ]);
      setInterviews(interviewsRes.data.data || []);
      setApplications(appsRes.data.data || []);
    } catch (err: any) {
      setError('Unable to load interviews logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/jobs/interviews', {
        applicationId: selectedApp,
        studentId: selectedStudent,
        jobId: selectedJob,
        date: schedDate,
        type: schedType,
        meetingUrl: schedUrl
      });
      setIsScheduleOpen(false);
      setSelectedApp('');
      setSelectedStudent('');
      setSelectedJob('');
      setSchedDate('');
      setSchedUrl('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to schedule interview');
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.put(`/jobs/interviews/${activeInterviewId}/status`, {
        status: interviewStatus,
        feedback: feedbackText,
        score: interviewScore
      });
      setIsFeedbackOpen(false);
      setActiveInterviewId('');
      setFeedbackText('');
      setInterviewScore(80);
      fetchData();
    } catch (err: any) {
      alert('Failed to submit feedback');
    }
  };

  // Filter interviews by active tab
  const filteredInterviews = interviews.filter((int) => {
    if (activeTab === 'UPCOMING') return int.status === 'SCHEDULED' && new Date(int.date) > new Date();
    if (activeTab === 'COMPLETED') return int.status === 'COMPLETED';
    // Fallback schedule
    return int.status === 'SCHEDULED';
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-900">Interviews Pipeline</h1>
          <p className="text-brand-500 mt-1">Schedule technical or HR rounds, assign video links, and record evaluation grades.</p>
        </div>
        <Button onClick={() => setIsScheduleOpen(true)} className="bg-indigo-650 hover:bg-indigo-700 text-white shrink-0 flex items-center gap-1.5 font-bold">
          <Plus className="h-4.5 w-4.5" />
          <span>Schedule New Interview</span>
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-brand-200 gap-6 text-[11px] font-bold">
        {[
          { id: 'UPCOMING', label: 'Upcoming Interviews' },
          { id: 'COMPLETED', label: 'Completed Rounds' },
          { id: 'SCHEDULED', label: 'All Scheduled Slots' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2.5 px-1 transition-colors ${
              activeTab === tab.id 
                ? 'border-b-2 border-indigo-600 text-indigo-650' 
                : 'text-brand-450 hover:text-brand-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Roster Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interviews Agenda logs */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 bg-brand-100 rounded-xl border border-brand-200"></div>
              ))}
            </div>
          ) : filteredInterviews.length === 0 ? (
            <Card className="text-center py-12 border border-brand-200/60 shadow-sm bg-white">
              <CardContent className="space-y-3">
                <CalendarIcon className="h-8 w-8 text-brand-400 mx-auto" />
                <h3 className="font-bold text-brand-900 text-sm">No interviews scheduled</h3>
                <p className="text-brand-500 text-xs">
                  There are no interview logs found matching the selected category.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredInterviews.map((int) => (
              <div key={int._id} className="border border-brand-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                      int.type === 'TECHNICAL' ? 'bg-indigo-100 text-indigo-700' :
                      int.type === 'BEHAVIORAL' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {int.type}
                    </span>
                    <h3 className="font-extrabold text-brand-950 text-[12px]">{int.student?.name}</h3>
                  </div>
                  <p className="font-bold text-brand-900">{int.job?.companyName} &mdash; <span className="font-semibold text-brand-500">{int.job?.title}</span></p>
                  <div className="flex flex-wrap items-center gap-4 text-brand-500 font-semibold pt-1">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {new Date(int.date).toLocaleString()}</span>
                    {int.meetingUrl && (
                      <a href={int.meetingUrl} target="_blank" rel="noreferrer" className="text-indigo-650 hover:underline inline-flex items-center gap-0.5">
                        <Video className="h-3.5 w-3.5" />
                        <span>Meeting Lobby</span>
                      </a>
                    )}
                  </div>
                  {int.feedback && (
                    <div className="bg-brand-50 p-2.5 rounded-lg border border-brand-100 text-brand-700">
                      <span className="font-bold block text-[9.5px]">Evaluation Feedback (Score: {int.score}%):</span>
                      <p className="mt-0.5 italic">"{int.feedback}"</p>
                    </div>
                  )}
                </div>
                <div className="flex md:flex-col justify-end items-end gap-2 shrink-0">
                  <Badge variant={int.status === 'COMPLETED' ? 'success' : int.status === 'SCHEDULED' ? 'warning' : 'danger'} className="font-bold text-[9px]">
                    {int.status}
                  </Badge>
                  {int.status === 'SCHEDULED' && (
                    <Button 
                      onClick={() => {
                        setActiveInterviewId(int._id);
                        setIsFeedbackOpen(true);
                      }} 
                      size="sm" 
                      className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-[9.5px] py-1.5 px-3"
                    >
                      Record Feedback
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Small Operational Calendar view */}
        <div className="lg:col-span-1">
          <Card className="border border-brand-200/60 shadow-sm bg-white">
            <CardHeader className="border-b border-brand-100">
              <CardTitle className="text-brand-900 font-bold">Interview Slots Calendar</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="p-4 bg-brand-50 rounded-xl text-center border border-brand-100">
                <CalendarIcon className="h-6 w-6 text-indigo-650 mx-auto" />
                <h4 className="font-extrabold text-brand-900 mt-2">August 2026</h4>
                <p className="text-brand-450 mt-1">Operational view of booked slots.</p>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-brand-500 text-[10px]">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                  <span key={d} className="py-1">{d}</span>
                ))}
                {Array.from({ length: 31 }).map((_, idx) => {
                  const day = idx + 1;
                  const isScheduled = day === 25 || day === 26 || day === 28;
                  return (
                    <div 
                      key={idx} 
                      className={`p-1.5 rounded-lg border text-brand-800 ${
                        isScheduled 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' 
                          : 'border-transparent'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* --- SCHEDULE MODAL --- */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-brand-950/40">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-slide-in flex flex-col justify-between">
            <div className="p-4 border-b border-brand-100 flex items-center justify-between bg-brand-50">
              <h3 className="font-bold text-brand-900 uppercase tracking-wider">Schedule Interview</h3>
              <button onClick={() => setIsScheduleOpen(false)} className="p-1 hover:bg-brand-200 rounded-full text-brand-450">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="font-bold text-brand-750 block">Select Candidate *</label>
                <select
                  required
                  value={selectedApp}
                  onChange={(e) => {
                    setSelectedApp(e.target.value);
                    const selected = applications.find((a) => a._id === e.target.value);
                    if (selected) {
                      setSelectedStudent(selected.student?._id || '');
                      setSelectedJob(selected.job?._id || '');
                    }
                  }}
                  className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850"
                >
                  <option value="">-- Select Candidate --</option>
                  {applications
                    .filter((a) => a.status === 'SHORTLISTED' || a.status === 'APPLIED')
                    .map((a) => (
                      <option key={a._id} value={a._id}>{a.student?.name} &mdash; {a.job?.companyName}</option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-brand-750 block">Date & Time *</label>
                  <input
                    required
                    type="datetime-local"
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-brand-750 block">Round Type *</label>
                  <select
                    value={schedType}
                    onChange={(e: any) => setSchedType(e.target.value)}
                    className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850"
                  >
                    <option value="TECHNICAL">Technical Round</option>
                    <option value="BEHAVIORAL">Behavioral Round</option>
                    <option value="HR">HR Round</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-750 block">Meeting Lobby URL</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/abc"
                  value={schedUrl}
                  onChange={(e) => setSchedUrl(e.target.value)}
                  className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsScheduleOpen(false)} className="flex-1 font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-indigo-650 hover:bg-indigo-700 text-white font-bold">
                  Schedule Slot
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- RECORD FEEDBACK MODAL --- */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-brand-950/40">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-slide-in flex flex-col justify-between">
            <div className="p-4 border-b border-brand-100 flex items-center justify-between bg-brand-50">
              <h3 className="font-bold text-brand-900 uppercase tracking-wider">Record Interview Outcome</h3>
              <button onClick={() => setIsFeedbackOpen(false)} className="p-1 hover:bg-brand-200 rounded-full text-brand-450">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <form onSubmit={handleFeedbackSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-brand-750 block">Evaluation Score (%)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    max="100"
                    value={interviewScore}
                    onChange={(e) => setInterviewScore(Number(e.target.value))}
                    className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-brand-750 block">Status Outcome</label>
                  <select
                    value={interviewStatus}
                    onChange={(e: any) => setInterviewStatus(e.target.value)}
                    className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850"
                  >
                    <option value="COMPLETED">Passed Round</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="NO_SHOW">Candidate No Show</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-brand-750 block">Interviewer Remarks *</label>
                <textarea
                  required
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Summarize round strengths/gaps..."
                  className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsFeedbackOpen(false)} className="flex-1 font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold">
                  Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default PlacementInterviews;
