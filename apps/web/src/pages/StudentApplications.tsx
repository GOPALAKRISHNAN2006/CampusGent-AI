import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Briefcase,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const StudentApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/jobs/student/applications');
      setApplications(res.data.data.applications || []);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch job applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'SELECTED':
        return 'success';
      case 'REJECTED':
      case 'WITHDRAWN':
        return 'danger';
      case 'APPLIED':
        return 'default';
      case 'SCREENING':
      case 'SHORTLISTED':
      case 'INTERVIEW':
      default:
        return 'warning';
    }
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const jobTitle = app.job?.title || '';
    const company = app.job?.companyName || '';
    const matchesSearch = jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-10 w-44 bg-brand-100 rounded-lg"></div>
        <div className="h-64 bg-brand-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-xs">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-indigo-500" />
          <span>My Applications Tracker</span>
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Monitor status updates, timelines, and next actions for all submitted job applications.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-brand-200/60 rounded-xl shadow-sm">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-brand-400" />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 border border-brand-200 rounded-lg outline-none focus:border-indigo-500 bg-white"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-brand-200 rounded-lg outline-none bg-white font-semibold text-brand-700 w-full sm:w-40"
          >
            <option value="">All Statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="SCREENING">Screening</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      {filteredApps.length === 0 ? (
        <Card className="text-center p-12 border border-brand-200/60 shadow-sm text-brand-400">
          <CardContent className="space-y-2">
            <Briefcase className="h-8 w-8 mx-auto text-brand-300 animate-pulse" />
            <h3 className="font-bold text-brand-900 text-sm">No Applications Found</h3>
            <p className="max-w-md mx-auto text-brand-500 leading-relaxed text-xs">
              You haven't submitted any job applications yet or none match your filters. Visit Placements to apply.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table (hidden on mobile) */}
          <div className="hidden md:block bg-white border border-brand-200/60 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-brand-50 border-b border-brand-100 text-brand-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Company & Position</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6">Remarks / Next Steps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50 text-brand-850">
                {filteredApps.map((app) => (
                  <tr key={app._id} className="hover:bg-brand-50/20 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="space-y-0.5">
                        <span className="font-bold text-brand-950 block">{app.job?.title}</span>
                        <span className="font-medium text-brand-500 block">{app.job?.companyName}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-brand-700">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                        {app.job?.location}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-brand-650">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                        {new Date(app.createdAt || app.appliedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusBadgeVariant(app.status)} className="text-[9px] uppercase tracking-wider">
                        {app.status}
                      </Badge>
                    </td>
                    <td className="p-4 pr-6 text-brand-600">
                      {app.status === 'APPLIED' && 'Awaiting resume screening review.'}
                      {app.status === 'SCREENING' && 'Document verification in progress.'}
                      {app.status === 'SHORTLISTED' && 'Shortlisted for online code rounds.'}
                      {app.status === 'INTERVIEW' && 'Check email for interview panel details.'}
                      {app.status === 'SELECTED' && <span className="text-green-600 font-bold">Selected! Offer letter sent.</span>}
                      {app.status === 'REJECTED' && 'Application review completed.'}
                      {app.status === 'WITHDRAWN' && 'Withdrawn by student.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards (hidden on desktop) */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {filteredApps.map((app) => (
              <Card key={app._id} className="border border-brand-200/60 shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="font-bold text-brand-900 text-sm leading-snug">{app.job?.title}</h3>
                      <p className="font-semibold text-brand-500 mt-0.5">{app.job?.companyName}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(app.status)} className="text-[9px] uppercase">
                      {app.status}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-[10px] text-brand-500 font-medium pt-1 border-t border-brand-50">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-brand-400" />
                      <span>{app.job?.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-brand-400" />
                      <span>Applied: {new Date(app.createdAt || app.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="bg-brand-50/50 p-2.5 rounded-lg border border-brand-100 text-[10px] text-brand-650 leading-relaxed">
                    <span className="font-bold text-brand-800 block mb-0.5">Remarks:</span>
                    {app.status === 'APPLIED' && 'Awaiting resume screening review.'}
                    {app.status === 'SCREENING' && 'Document verification in progress.'}
                    {app.status === 'SHORTLISTED' && 'Shortlisted for online code rounds.'}
                    {app.status === 'INTERVIEW' && 'Check email for interview panel details.'}
                    {app.status === 'SELECTED' && 'Selected! Offer letter sent.'}
                    {app.status === 'REJECTED' && 'Application review completed.'}
                    {app.status === 'WITHDRAWN' && 'Withdrawn by student.'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default StudentApplications;
