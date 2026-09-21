import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  CheckCheck, 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  FileCheck,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const PlacementOffers: React.FC = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      // Query applications with SELECTED or SHORTLISTED status acting as offer pipelines
      const res = await apiClient.get('/jobs/all-applications');
      const selectedApps = (res.data.data || []).filter(
        (a: any) => a.status === 'SELECTED' || a.status === 'SHORTLISTED'
      );
      setOffers(selectedApps);
    } catch (err: any) {
      setError('Failed to fetch offers registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleUpdateOfferStatus = async (appId: string, status: string) => {
    try {
      await apiClient.put(`/jobs/application/${appId}/status`, {
        status,
        remarks: `Offer status update to ${status} by Placement Cell`
      });
      fetchOffers();
    } catch (err: any) {
      alert('Failed to update offer status.');
    }
  };

  const filteredOffers = offers.filter((o) => {
    const matchesSearch = 
      (o.student?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.job?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.job?.title || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-brand-900">Job Offers Registry</h1>
        <p className="text-brand-500 mt-1">Track company CTC compensation packages extended to students, monitor acceptance, and verify joining targets.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* Analytics summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border border-brand-200/60 shadow-sm text-center">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block">Total Offers Released</span>
            <p className="text-xl font-black text-brand-900">{offers.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-brand-200/60 shadow-sm text-center">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block">Offers Accepted</span>
            <p className="text-xl font-black text-green-700">
              {offers.filter((o) => o.status === 'SELECTED').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-brand-200/60 shadow-sm text-center">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block">Pending Release Verification</span>
            <p className="text-xl font-black text-amber-700">
              {offers.filter((o) => o.status === 'SHORTLISTED').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-brand-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by candidate name or company..."
            className="pl-9 w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700"
          >
            <option value="ALL">All Outcomes</option>
            <option value="SELECTED">Offer Accepted</option>
            <option value="SHORTLISTED">Offer Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Card className="border border-brand-200/60 shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50 border-b border-brand-200 text-brand-650 font-bold uppercase text-[9px] tracking-wider">
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Company Recruiter</th>
                <th className="px-5 py-3">Designation Role</th>
                <th className="px-5 py-3">CTC Package (LPA)</th>
                <th className="px-5 py-3">Verification Status</th>
                <th className="px-5 py-3 text-right">Outcomes Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100 text-brand-800 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-brand-450 font-semibold animate-pulse">
                    Loading offers registry...
                  </td>
                </tr>
              ) : filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-brand-450 font-semibold">
                    No offers recorded.
                  </td>
                </tr>
              ) : (
                filteredOffers.map((o) => (
                  <tr key={o._id} className="hover:bg-brand-50/50 transition-colors">
                    <td className="px-5 py-4 font-bold text-brand-950">{o.student?.name}</td>
                    <td className="px-5 py-4 font-bold text-brand-900">{o.job?.companyName}</td>
                    <td className="px-5 py-4 font-semibold text-brand-650">{o.job?.title}</td>
                    <td className="px-5 py-4 font-black text-brand-900">{o.job?.salaryMax || '8.0'} LPA</td>
                    <td className="px-5 py-4">
                      <Badge variant={o.status === 'SELECTED' ? 'success' : 'warning'} className="font-bold text-[9px]">
                        {o.status === 'SELECTED' ? 'ACCEPTED' : 'PENDING APPROVAL'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right flex justify-end gap-2.5 mt-1">
                      <button
                        onClick={() => handleUpdateOfferStatus(o._id, 'SELECTED')}
                        disabled={o.status === 'SELECTED'}
                        className="text-[10px] text-green-700 hover:underline font-bold disabled:opacity-50 inline-flex items-center gap-0.5"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Accept Offer</span>
                      </button>
                      <span className="text-brand-200">|</span>
                      <button
                        onClick={() => handleUpdateOfferStatus(o._id, 'REJECTED')}
                        className="text-[10px] text-red-650 hover:underline font-bold inline-flex items-center gap-0.5"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Decline Offer</span>
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
export default PlacementOffers;
