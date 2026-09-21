import React, { useEffect, useMemo, useState } from 'react';
import { Activity, BrainCircuit, History, Shield, Users, ArrowUpRight, Database, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Card, CardContent } from '../components/ui/Card';
import { DashboardHero, DashboardSectionTitle, DashboardStat } from '../components/dashboard/DashboardPrimitives';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get('/analytics/admin')
      .then((res) => setStats(res.data.data))
      .catch(() => setError('Failed to load administration metrics.'))
      .finally(() => setLoading(false));
  }, []);

  const totalAccounts = useMemo(
    () => Object.values(stats?.usersByRole || {}).reduce((a: number, b: any) => a + Number(b), 0),
    [stats]
  );

  if (loading) {
    return <div className="mx-auto max-w-7xl animate-pulse space-y-6"><div className="h-64 rounded-[1.75rem] bg-slate-200" /><div className="grid grid-cols-4 gap-4"><div className="h-32 rounded-2xl bg-slate-200" /><div className="h-32 rounded-2xl bg-slate-200" /><div className="h-32 rounded-2xl bg-slate-200" /><div className="h-32 rounded-2xl bg-slate-200" /></div></div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7 animate-fade-in">
      <DashboardHero
        eyebrow="Platform governance center"
        title="Keep the campus intelligence layer healthy."
        description="Monitor adoption, AI consumption, audit activity, and system trust from one operational overview."
        icon={Shield}
        tone="slate"
        action={{ label: 'Open AI observability', href: '/admin/agents' }}
      >
        <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
          <div className="flex items-center gap-2 text-emerald-200"><span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px] shadow-emerald-300" /> All systems operational</div>
          <p className="mt-3 text-xs text-white/60">Security controls and service health are being monitored continuously.</p>
        </div>
      </DashboardHero>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat label="Total accounts" value={totalAccounts} detail="Across all roles" icon={Users} />
        <DashboardStat label="AI tokens consumed" value={stats?.tokensSummary?.totalTokens || 0} detail="Usage this period" icon={BrainCircuit} tone="indigo" />
        <DashboardStat label="Audit events" value={stats?.auditLogsCount || 0} detail="Traceable platform actions" icon={History} tone="amber" />
        <DashboardStat label="System status" value="Online" detail="Healthy service posture" icon={Activity} tone="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-2xl border-slate-200/80">
          <CardContent className="space-y-5 p-6">
            <DashboardSectionTitle eyebrow="Adoption map" title="Platform accounts distribution" action={{ label: 'Review users', href: '/placement/students' }} />
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Students', stats?.usersByRole?.STUDENT || 0, 'bg-indigo-50 text-indigo-700'],
                ['Faculty mentors', stats?.usersByRole?.FACULTY || 0, 'bg-teal-50 text-teal-700'],
                ['Placement officers', stats?.usersByRole?.PLACEMENT_OFFICER || 0, 'bg-amber-50 text-amber-700'],
                ['Administrators', stats?.usersByRole?.ADMIN || 0, 'bg-rose-50 text-rose-700'],
              ].map(([label, value, style]) => (
                <div key={String(label)} className={`rounded-2xl p-4 ${style}`}>
                  <p className="text-2xl font-black">{value}</p>
                  <p className="mt-1 text-xs font-bold">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80">
          <CardContent className="space-y-5 p-6">
            <DashboardSectionTitle eyebrow="Operator shortcuts" title="Run the platform with confidence" />
            <div className="space-y-3">
              {[
                { href: '/admin/agents', icon: BrainCircuit, title: 'AI observability', text: 'Inspect agent health and governance.' },
                { href: '/placement/analytics', icon: Database, title: 'Placement oversight', text: 'Review institutional outcome signals.' },
                { href: '/settings', icon: LockKeyhole, title: 'Access settings', text: 'Manage account and security preferences.' },
              ].map(({ href, icon: Icon, title, text }) => (
                <Link key={href} to={href} className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-indigo-200 hover:bg-indigo-50/50">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600 group-hover:bg-white group-hover:text-indigo-600"><Icon className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1"><p className="text-xs font-bold text-slate-900">{title}</p><p className="mt-0.5 text-[11px] text-slate-500">{text}</p></div>
                  <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
