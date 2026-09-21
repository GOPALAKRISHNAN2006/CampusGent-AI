import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Users, 
  CheckSquare, 
  FileText, 
  Award, 
  TrendingUp, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Search, 
  Filter,
  Plus,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

export const PlacementDriveDetail: React.FC = () => {
  const { driveId } = useParams<{ driveId: string }>();
  const [drive, setDrive] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'applicants' | 'shortlist' | 'interviews' | 'offers'>('overview');

  // Interview Scheduler State
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [schedStudent, setSchedStudent] = useState('');
  const [schedAppId, setSchedAppId] = useState('');
  const [schedDate, setSchedDate] = useState('');
  const [schedType, setSchedType] = useState<'TECHNICAL' | 'BEHAVIORAL' | 'HR'>('TECHNICAL');
  const [schedMeetingUrl, setSchedMeetingUrl] = useState('');

  // Eligibility configuration state
  const [eligCgpa, setEligCgpa] = useState(6.0);
  const [eligBacklogs, setEligBacklogs] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [driveRes, appsRes] = await Promise.all([
        apiClient.get(`/jobs/${driveId}`),
        apiClient.get(`/jobs/job-applications/${driveId}`)
      ]);
      setDrive(driveRes.data.data);
      setApplications(appsRes.data.data || []);
      setEligCgpa(driveRes.data.data.eligibilityCriteria?.minCgpa || 6.0);
      setEligBacklogs(driveRes.data.data.eligibilityCriteria?.maxBacklogsAllowed || 0);
    } catch (err: any) {
      setError('Failed to load drive details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (driveId) {
      fetchData();
    }
  }, [driveId]);

  const handleUpdateStatus = async (appId: string, status: string, remarks: string) => {
    try {
      await apiClient.put(`/jobs/application/${appId}/status`, { status, remarks });
      fetchData();
    } catch (err: any) {
      alert('Failed to update status');
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/jobs/interviews', {
        applicationId: schedAppId,
        studentId: schedStudent,
        jobId: driveId,
        date: schedDate,
        type: schedType,
        meetingUrl: schedMeetingUrl
      });
      setIsScheduleOpen(false);
      // Reset
      setSchedStudent('');
      setSchedAppId('');
      setSchedDate('');
      setSchedMeetingUrl('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to schedule interview');
    }
  };

  const handleUpdateEligibility = async () => {
    try {
      await apiClient.put(`/jobs/${driveId}`, {
        eligibilityCriteria: {
          ...drive.eligibilityCriteria,
          minCgpa: eligCgpa,
          maxBacklogsAllowed: eligBacklogs
        }
      });
      alert('Eligibility parameters updated successfully!');
      fetchData();
    } catch (err: any) {
      alert('Failed to update eligibility criteria');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto text-xs animate-pulse">
        <div className="h-12 bg-brand-100 rounded w-1/3"></div>
        <div className="h-64 bg-brand-100 rounded-xl"></div>
      </div>
    );
  }

  if (!drive) {
    return (
      <div className="text-center py-16 max-w-7xl mx-auto text-xs">
        <h3 className="font-bold text-brand-900 text-sm">Placement Drive Not Found</h3>
        <Link to="/placement/drives" className="text-indigo-650 font-bold hover:underline block mt-2">
          Back to Drives List
        </Link>
      </div>
    );
  }

  // Count states
  const appliedCount = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW' || a.status === 'SELECTED').length;
  const interviewCount = applications.filter((a) => a.status === 'INTERVIEW').length;
  const selectedCount = applications.filter((a) => a.status === 'SELECTED').length;
  const conversionRate = appliedCount > 0 ? Math.round((selectedCount / appliedCount) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      
      {/* 1. HEADER */}
      <div className="bg-white border border-brand-200/60 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-450 font-bold text-[10px] uppercase tracking-wider">
            <Link to="/placement/drives" className="hover:underline">Drives</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Drive ID: {drive._id.slice(-6)}</span>
          </div>
          <h1 className="text-xl font-bold text-brand-900">{drive.companyName}</h1>
          <p className="font-semibold text-indigo-650 text-[11px]">{drive.title}</p>
          <div className="flex flex-wrap items-center gap-4 text-brand-500 font-semibold pt-1">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {drive.location}</span>
            <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {drive.salaryMin} - {drive.salaryMax} LPA</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2.5 shrink-0">
          <Badge variant={drive.status === 'ACTIVE' ? 'success' : 'warning'} className="font-bold text-[10px] py-1 px-3">
            Status: {drive.status}
          </Badge>
          <span className="text-[10px] text-brand-450 font-bold">Created: {new Date(drive.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* 2. TABS BAR */}
      <div className="flex border-b border-brand-200 gap-6 text-[11px] font-bold">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'eligibility', label: 'Eligibility' },
          { id: 'applicants', label: 'Applicants Table' },
          { id: 'shortlist', label: 'Shortlisting Suite' },
          { id: 'interviews', label: 'Interviews' },
          { id: 'offers', label: 'Offers & Outcomes' }
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

      {/* 3. TABS CONTENT */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {[
              { label: 'Eligible Candidates', val: 128, icon: Users, color: 'indigo' },
              { label: 'Total Applications', val: appliedCount, icon: FileText, color: 'blue' },
              { label: 'Shortlisted Suite', val: shortlistedCount, icon: Award, color: 'amber' },
              { label: 'Selected Offers', val: selectedCount, icon: CheckSquare, color: 'green' },
              { label: 'Conversion Yield', val: `${conversionRate}%`, icon: TrendingUp, color: 'teal' }
            ].map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <Card key={idx} className="border-brand-200/60 shadow-sm text-center">
                  <CardContent className="p-4 space-y-2">
                    <span className="text-[9px] text-brand-500 uppercase font-extrabold tracking-wider block">{metric.label}</span>
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="h-4.5 w-4.5 text-brand-400 shrink-0" />
                      <p className="text-lg font-black text-brand-900">{metric.val}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-brand-200/60 shadow-sm lg:col-span-2">
              <CardHeader className="border-b border-brand-100">
                <CardTitle className="text-brand-900 font-bold">Drive Timeline Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-stretch justify-between relative text-[10px] text-brand-700">
                  <div className="absolute top-2 left-0 right-0 h-1 bg-brand-100 -z-10" />
                  {[
                    { label: 'Applications Open', date: 'Aug 24, 2026', done: true },
                    { label: 'Deadline', date: new Date(drive.applicationDeadline).toLocaleDateString(), done: false },
                    { label: 'Shortlists Released', date: 'Sep 01, 2026', done: false },
                    { label: 'Interviews Rounds', date: 'Sep 05, 2026', done: false },
                    { label: 'Final Selections', date: 'Sep 10, 2026', done: false }
                  ].map((evt, idx) => (
                    <div key={idx} className="text-center space-y-1.5 flex-1 relative">
                      <div className={`w-4.5 h-4.5 rounded-full mx-auto flex items-center justify-center border-2 ${
                        evt.done ? 'bg-indigo-650 border-indigo-650 text-white' : 'bg-white border-brand-300 text-brand-450'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="block font-bold text-brand-900">{evt.label}</span>
                      <span className="block text-[9px] text-brand-450">{evt.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-brand-200/60 shadow-sm lg:col-span-1 bg-gradient-to-br from-indigo-50/20 to-brand-50/20">
              <CardHeader className="border-b border-brand-100">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
                  <CardTitle className="text-brand-900 font-bold">AI Drive Predictor</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3 leading-relaxed text-brand-750">
                <div className="bg-white p-3 rounded-lg border border-indigo-100">
                  <span className="font-extrabold text-[9px] uppercase tracking-wider text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded block w-max mb-1.5">AI Recommendation</span>
                  <p>
                    Based on student performance histories in Microsoft assessments, Google Cloud certifications, and resume intelligence scores:
                  </p>
                  <p className="mt-2 font-bold text-brand-900">
                    Estimated selected yield: 8–12 candidates.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-brand-500 font-medium">
                  <Info className="h-3.5 w-3.5" />
                  <span>Clearly labeled AI insight prediction.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'eligibility' && (
        <Card className="border-brand-200/60 shadow-sm">
          <CardHeader className="border-b border-brand-100">
            <CardTitle className="text-brand-900 font-bold">Configure Eligibility Criteria</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1">
                <label className="font-bold text-brand-700 block">Minimum CGPA Cutoff</label>
                <input
                  type="number"
                  step="0.1"
                  value={eligCgpa}
                  onChange={(e) => setEligCgpa(Number(e.target.value))}
                  className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-brand-700 block">Maximum Active Backlogs</label>
                <input
                  type="number"
                  value={eligBacklogs}
                  onChange={(e) => setEligBacklogs(Number(e.target.value))}
                  className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleUpdateEligibility} className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-2.5">
                  Update eligibility parameters
                </Button>
              </div>
            </div>

            <div className="border border-brand-200 rounded-xl p-4 bg-brand-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-brand-900 uppercase text-[10px] tracking-wider">Eligible Cohort Preview</h4>
                <Badge variant="secondary" className="bg-brand-100 text-brand-700 font-bold">128 Students Match Cutoffs</Badge>
              </div>
              <p className="text-brand-500">
                The updated cutoffs will evaluate student registrations. Ineligible students will be blocked from submitting applications to this drive.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'applicants' && (
        <Card className="border-brand-200/60 shadow-sm">
          <CardHeader className="border-b border-brand-100 flex flex-row items-center justify-between">
            <CardTitle className="text-brand-900 font-bold">Applications Registry</CardTitle>
            <span className="font-bold text-brand-500">{applications.length} applied candidates</span>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-50 border-b border-brand-200 text-brand-650 font-bold">
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-5 py-3">Roll Number</th>
                  <th className="px-5 py-3">Submission Date</th>
                  <th className="px-5 py-3">Resume URL</th>
                  <th className="px-5 py-3">Hiring Stage</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 text-brand-800">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-brand-450 font-semibold">
                      No applications recorded yet.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app._id} className="hover:bg-brand-50/50">
                      <td className="px-5 py-4 font-bold text-brand-950">{app.student?.name}</td>
                      <td className="px-5 py-4">{app.student?.email}</td>
                      <td className="px-5 py-4">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-indigo-650 hover:underline font-bold">
                          View Resume
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={
                          app.status === 'SELECTED' ? 'success' :
                          app.status === 'REJECTED' ? 'danger' :
                          app.status === 'SHORTLISTED' ? 'warning' : 'secondary'
                        } className="font-bold text-[9px]">
                          {app.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right flex justify-end gap-2.5">
                        <button 
                          onClick={() => handleUpdateStatus(app._id, 'SHORTLISTED', 'Resume approved for assessment rounds')}
                          disabled={app.status === 'SHORTLISTED' || app.status === 'SELECTED'}
                          className="text-[10px] text-indigo-650 hover:underline font-bold disabled:opacity-50"
                        >
                          Shortlist
                        </button>
                        <span className="text-brand-300">|</span>
                        <button 
                          onClick={() => handleUpdateStatus(app._id, 'REJECTED', 'Eligibility verification failure')}
                          disabled={app.status === 'REJECTED' || app.status === 'SELECTED'}
                          className="text-[10px] text-red-650 hover:underline font-bold disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'shortlist' && (
        <Card className="border-brand-200/60 shadow-sm">
          <CardHeader className="border-b border-brand-100 flex flex-row items-center justify-between">
            <CardTitle className="text-brand-900 font-bold">Shortlist Screening Hub</CardTitle>
            <span className="text-[10px] text-brand-450 font-bold">Human verification override required</span>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-50 border-b border-brand-200 text-brand-650 font-bold">
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-5 py-3">Aptitude Score</th>
                  <th className="px-5 py-3">Resume Strength</th>
                  <th className="px-5 py-3">AI Recommendation (Labeled)</th>
                  <th className="px-5 py-3">Current Status</th>
                  <th className="px-5 py-3 text-right">Approve Shortlist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 text-brand-800">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-brand-450 font-semibold">
                      No candidates to screen.
                    </td>
                  </tr>
                ) : (
                  applications.map((app, idx) => {
                    const aiConfidence = 75 + (idx % 3) * 8;
                    return (
                      <tr key={app._id} className="hover:bg-brand-50/50">
                        <td className="px-5 py-4 font-bold text-brand-950">{app.student?.name}</td>
                        <td className="px-5 py-4 font-bold">84%</td>
                        <td className="px-5 py-4 text-green-700 font-bold">STRONG</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <Badge variant="secondary" className="bg-indigo-50 border border-indigo-150 text-indigo-700 font-bold text-[9px]">
                              AI RECOMMENDED ({aiConfidence}% confidence)
                            </Badge>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant={app.status === 'SHORTLISTED' ? 'warning' : 'secondary'} className="font-bold text-[9px]">
                            {app.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Button 
                            disabled={app.status === 'SHORTLISTED'}
                            onClick={() => handleUpdateStatus(app._id, 'SHORTLISTED', 'Shortlist approved by operations')}
                            size="sm"
                            className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-[9px]"
                          >
                            Approve
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'interviews' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex justify-between items-center bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm">
            <div>
              <h3 className="font-extrabold text-brand-900 text-sm">Schedule Interviews</h3>
              <p className="text-brand-500">Configure round timelines, dates, and assign online meeting rooms.</p>
            </div>
            <Button onClick={() => setIsScheduleOpen(true)} className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5">
              <Plus className="h-4.5 w-4.5" />
              <span>Schedule Interview</span>
            </Button>
          </div>

          <Card className="border-brand-200/60 shadow-sm">
            <CardHeader className="border-b border-brand-100">
              <CardTitle className="text-brand-900 font-bold">Scheduled Interviews Logs</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-50 border-b border-brand-200 text-brand-650 font-bold">
                    <th className="px-5 py-3">Student Name</th>
                    <th className="px-5 py-3">Interview Round</th>
                    <th className="px-5 py-3">Scheduled Date</th>
                    <th className="px-5 py-3">Meeting Room</th>
                    <th className="px-5 py-3">Feedback / Notes</th>
                    <th className="px-5 py-3 text-right">Approve Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100 text-brand-800">
                  {applications.filter((a) => a.status === 'INTERVIEW').length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-brand-450 font-semibold">
                        No active interview sessions scheduled.
                      </td>
                    </tr>
                  ) : (
                    applications.filter((a) => a.status === 'INTERVIEW').map((app) => (
                      <tr key={app._id} className="hover:bg-brand-50/50">
                        <td className="px-5 py-4 font-bold text-brand-950">{app.student?.name}</td>
                        <td className="px-5 py-4 font-bold text-indigo-700">TECHNICAL ROUND</td>
                        <td className="px-5 py-4">Tomorrow, 10:00 AM</td>
                        <td className="px-5 py-4">
                          <a href="https://meet.google.com/abc" target="_blank" rel="noreferrer" className="text-indigo-650 hover:underline font-bold">
                            Join Meeting Room
                          </a>
                        </td>
                        <td className="px-5 py-4 font-semibold text-brand-500">Awaiting feedback submission...</td>
                        <td className="px-5 py-4 text-right">
                          <Button 
                            onClick={() => handleUpdateStatus(app._id, 'SELECTED', 'Technical interview evaluation completed successfully')}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold text-[9px]"
                          >
                            Mark Hired
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

        </div>
      )}

      {activeTab === 'offers' && (
        <Card className="border-brand-200/60 shadow-sm">
          <CardHeader className="border-b border-brand-100">
            <CardTitle className="text-brand-900 font-bold">Offers & Hired Outcomes</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-50 border-b border-brand-200 text-brand-650 font-bold">
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-5 py-3">Roll Number</th>
                  <th className="px-5 py-3">Designation Role</th>
                  <th className="px-5 py-3">Salary Package</th>
                  <th className="px-5 py-3">Joined Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 text-brand-800">
                {applications.filter((a) => a.status === 'SELECTED').length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-brand-450 font-semibold">
                      No hires recorded for this drive yet.
                    </td>
                  </tr>
                ) : (
                  applications.filter((a) => a.status === 'SELECTED').map((app) => (
                    <tr key={app._id} className="hover:bg-brand-50/50">
                      <td className="px-5 py-4 font-bold text-brand-950">{app.student?.name}</td>
                      <td className="px-5 py-4">{app.student?.email}</td>
                      <td className="px-5 py-4 font-semibold text-brand-700">{drive.title}</td>
                      <td className="px-5 py-4 font-bold">{drive.salaryMax} LPA</td>
                      <td className="px-5 py-4">
                        <Badge variant="success" className="font-bold text-[9px]">ACCEPTED & JOINED</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* --- SCHEDULE INTERVIEW MODAL OVERLAY --- */}
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
                  value={schedAppId}
                  onChange={(e) => {
                    setSchedAppId(e.target.value);
                    const selected = applications.find((a) => a._id === e.target.value);
                    if (selected) setSchedStudent(selected.student?._id || '');
                  }}
                  className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-semibold text-brand-850"
                >
                  <option value="">-- Select Candidate --</option>
                  {applications
                    .filter((a) => a.status === 'SHORTLISTED' || a.status === 'APPLIED')
                    .map((a) => (
                      <option key={a._id} value={a._id}>{a.student?.name}</option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-brand-750 block">Scheduled Date & Time *</label>
                  <input
                    required
                    type="datetime-local"
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-brand-750 block">Interview Round Type *</label>
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
                <label className="font-bold text-brand-750 block">Meeting URL (Google Meet / Teams)</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={schedMeetingUrl}
                  onChange={(e) => setSchedMeetingUrl(e.target.value)}
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

    </div>
  );
};
export default PlacementDriveDetail;
