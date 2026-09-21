import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  FileText, 
  Search, 
  Filter, 
  Award, 
  UserCheck, 
  XCircle, 
  Calendar,
  Briefcase
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const PlacementApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/jobs/all-applications');
      setApplications(res.data.data || []);
    } catch (err: any) {
      setError('Unable to load applications list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    const jobIdParam = searchParams.get('jobId');
    if (jobIdParam) {
      setStageFilter('ALL');
    }
  }, [searchParams]);

  const handleUpdateStatus = async (appId: string, status: string, remarks: string) => {
    try {
      await apiClient.put(`/jobs/application/${appId}/status`, { status, remarks });
      fetchApplications();
    } catch (err: any) {
      alert('Failed to update application status.');
    }
  };

  // Filter logic
  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      (app.student?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.job?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.job?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = stageFilter === 'ALL' || app.status === stageFilter;

    // Filter by jobId in search query params
    const jobIdParam = searchParams.get('jobId');
    const matchesJobId = !jobIdParam || app.job?._id === jobIdParam;

    return matchesSearch && matchesStage && matchesJobId;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-brand-900">Applications Pipeline</h1>
        <p className="text-brand-500 mt-1">Review student applications, filter by recruitment stage, and transition hiring statuses.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-brand-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student, company, or job role..."
            className="pl-9 w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700"
          >
            <option value="ALL">All Stages</option>
            <option value="APPLIED">Applied</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <Card className="border border-brand-200/60 shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50 border-b border-brand-200 text-brand-650 font-bold uppercase text-[9px] tracking-wider">
                <th className="px-5 py-3">Student Details</th>
                <th className="px-5 py-3">Company & Job</th>
                <th className="px-5 py-3">Applied Date</th>
                <th className="px-5 py-3">Resume</th>
                <th className="px-5 py-3">Hiring Stage</th>
                <th className="px-5 py-3 text-right">Actions Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100 text-brand-800 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-brand-450 font-semibold animate-pulse">
                    Loading applications list...
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-brand-450 font-semibold">
                    No student applications match the specified filters.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app._id} className="hover:bg-brand-50/50 transition-colors">
                    <td className="px-5 py-4 font-bold text-brand-950">
                      <div>{app.student?.name}</div>
                      <div className="text-[10px] text-brand-450 font-normal mt-0.5">{app.student?.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-brand-900">{app.job?.companyName}</div>
                      <div className="text-[10px] text-indigo-650 font-semibold mt-0.5">{app.job?.title}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-brand-600">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-indigo-650 hover:underline font-bold inline-flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        <span>View PDF</span>
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
                    <td className="px-5 py-4 text-right flex justify-end gap-2.5 mt-1">
                      <button
                        onClick={() => handleUpdateStatus(app._id, 'SHORTLISTED', 'Screened & short-listed for recruitment rounds')}
                        disabled={app.status === 'SHORTLISTED' || app.status === 'SELECTED'}
                        className="text-[10px] text-indigo-650 hover:underline font-bold disabled:opacity-50 inline-flex items-center gap-0.5"
                      >
                        <Award className="h-3.5 w-3.5" />
                        <span>Shortlist</span>
                      </button>
                      <span className="text-brand-200">|</span>
                      <button
                        onClick={() => handleUpdateStatus(app._id, 'SELECTED', 'Hired & offer confirmed')}
                        disabled={app.status === 'SELECTED'}
                        className="text-[10px] text-green-700 hover:underline font-bold disabled:opacity-50 inline-flex items-center gap-0.5"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Mark Hired</span>
                      </button>
                      <span className="text-brand-200">|</span>
                      <button
                        onClick={() => handleUpdateStatus(app._id, 'REJECTED', 'Application status update to rejected by Placement Cell')}
                        disabled={app.status === 'REJECTED' || app.status === 'SELECTED'}
                        className="text-[10px] text-red-650 hover:underline font-bold disabled:opacity-50 inline-flex items-center gap-0.5"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
};
export default PlacementApplications;
