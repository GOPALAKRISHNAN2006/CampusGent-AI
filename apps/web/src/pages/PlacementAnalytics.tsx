import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Building, 
  BarChart,
  ChevronRight,
  Info
} from 'lucide-react';

export const PlacementAnalytics: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/analytics/placement');
        setStats(res.data.data);
      } catch (err: any) {
        setError('Failed to compute analytics aggregates.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto text-xs animate-pulse">
        <div className="h-10 bg-brand-100 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-brand-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  // Funnel drop-offs custom bars representation
  const funnelStages = [
    { label: 'Eligible Candidates', val: 620, pct: 100 },
    { label: 'Applied Students', val: stats?.totalApplications || 480, pct: 77 },
    { label: 'Shortlisted Screen', val: stats?.applicationsByStatus?.SHORTLISTED || 210, pct: 33 },
    { label: 'Interviews Rounds', val: stats?.applicationsByStatus?.INTERVIEW || 132, pct: 21 },
    { label: 'Offers Released (Hired)', val: stats?.applicationsByStatus?.SELECTED || 68, pct: 11 }
  ];

  const packageDistribution = [
    { range: 'Under 5 LPA', count: 18, pct: '12%' },
    { range: '5 LPA - 8 LPA', count: 64, pct: '44%' },
    { range: '8 LPA - 12 LPA', count: 38, pct: '26%' },
    { range: '12 LPA - 18 LPA', count: 16, pct: '11%' },
    { range: 'Over 18 LPA', count: 10, pct: '7%' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-brand-900">Placement Performance & Funnels</h1>
        <p className="text-brand-500 mt-1">Review statistical summaries of placement season packages, recruiters hiring volumes, and conversion drop-offs.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <Card className="border border-brand-200/60 shadow-sm text-center">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block">Placement Rate</span>
            <p className="text-xl font-black text-green-700">{stats?.placementRate || 78}%</p>
          </CardContent>
        </Card>
        <Card className="border border-brand-200/60 shadow-sm text-center">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block">Average CTC Package</span>
            <p className="text-xl font-black text-brand-900">{stats?.averageSalary || '7.5'} LPA</p>
          </CardContent>
        </Card>
        <Card className="border border-brand-200/60 shadow-sm text-center">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block">Median CTC Package</span>
            <p className="text-xl font-black text-brand-900">6.8 LPA</p>
          </CardContent>
        </Card>
        <Card className="border border-brand-200/60 shadow-sm text-center">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block">Highest Package</span>
            <p className="text-xl font-black text-indigo-700">42.5 LPA</p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel chart and Package breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Funnel visualizer */}
        <Card className="border border-brand-200/60 shadow-sm lg:col-span-2 bg-white">
          <CardHeader className="border-b border-brand-100 flex flex-row justify-between items-center">
            <div className="flex items-center gap-1.5">
              <BarChart className="h-4.5 w-4.5 text-indigo-650" />
              <CardTitle className="text-brand-900 font-bold">Hiring Conversion Funnel</CardTitle>
            </div>
            <span className="text-brand-450 font-semibold text-[9.5px] uppercase">Yield conversion drop-offs</span>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {funnelStages.map((stage, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center font-bold text-brand-800">
                  <span>{stage.label}</span>
                  <span>{stage.val} Candidates ({stage.pct}%)</span>
                </div>
                <div className="w-full h-3 bg-brand-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full transition-all duration-500" 
                    style={{ width: `${stage.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Salary Distribution */}
        <Card className="border border-brand-200/60 shadow-sm lg:col-span-1 bg-white">
          <CardHeader className="border-b border-brand-100">
            <CardTitle className="text-brand-900 font-bold">Package CTC Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 font-semibold text-brand-700">
            {packageDistribution.map((dist, idx) => (
              <div key={idx} className="flex justify-between items-center bg-brand-50 p-2.5 rounded-lg border border-brand-100">
                <span>{dist.range}</span>
                <div className="flex items-center gap-2">
                  <span className="text-brand-900">{dist.count} offers</span>
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-750 font-bold text-[9px]">{dist.pct}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

    </div>
  );
};
export default PlacementAnalytics;
