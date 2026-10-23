import React, { useEffect, useMemo, useState } from 'react';
import { Activity, BrainCircuit, History, Shield, Users, ArrowUpRight, Database, LockKeyhole, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { DashboardHero, DashboardSectionTitle, DashboardStat } from '../components/dashboard/DashboardPrimitives.jsx';

export const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiClient.get('/analytics/admin')
            .then((res) => setStats(res.data.data))
            .catch(() => setError('Failed to load administration metrics.'))
            .finally(() => setLoading(false));
    }, []);

    const totalAccounts = useMemo(() => Object.values(stats?.usersByRole || {}).reduce((a, b) => a + Number(b), 0), [stats]);

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl animate-pulse space-y-6">
                <div className="h-64 rounded-[1.75rem] bg-stone-200 dark:bg-stone-800" />
                <div className="grid grid-cols-4 gap-4">
                    <div className="h-32 rounded-2xl bg-stone-200 dark:bg-stone-800" />
                    <div className="h-32 rounded-2xl bg-stone-200 dark:bg-stone-800" />
                    <div className="h-32 rounded-2xl bg-stone-200 dark:bg-stone-800" />
                    <div className="h-32 rounded-2xl bg-stone-200 dark:bg-stone-800" />
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-7 animate-fade-in font-sans text-xs">
            <DashboardHero
                eyebrow="Platform governance center"
                title="Keep the campus intelligence layer healthy."
                description="Monitor adoption, AI consumption, audit activity, and system trust from one operational overview."
                icon={Shield}
                tone="slate"
                action={{ label: 'Open AI observability', href: '/admin/agents' }}
            >
                <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                    <div className="flex items-center gap-2 text-emerald-200 font-bold">
                        <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px] shadow-emerald-300" />
                        All systems operational
                    </div>
                    <p className="mt-3 text-xs text-white/70">
                        Security controls and service health are being monitored continuously.
                    </p>
                </div>
            </DashboardHero>

            {error && (
                <div role="alert" className="rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs font-semibold text-rose-700 dark:text-rose-300">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardStat label="Total accounts" value={totalAccounts} detail="Across all roles" icon={Users} />
                <DashboardStat label="AI tokens consumed" value={stats?.tokensSummary?.totalTokens || 0} detail="Usage this period" icon={BrainCircuit} tone="indigo" />
                <DashboardStat label="Audit events" value={stats?.auditLogsCount || 0} detail="Traceable platform actions" icon={History} tone="amber" />
                <DashboardStat label="System status" value="Online" detail="Healthy service posture" icon={Activity} tone="emerald" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <Card className="rounded-2xl border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900">
                    <CardContent className="space-y-5 p-6">
                        <DashboardSectionTitle
                            eyebrow="Adoption map"
                            title="Platform accounts distribution"
                            action={{ label: 'Manage users', href: '/admin/users' }}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                ['Students', stats?.usersByRole?.STUDENT || 0, 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'],
                                ['Faculty mentors', stats?.usersByRole?.FACULTY || 0, 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'],
                                ['Placement officers', stats?.usersByRole?.PLACEMENT_OFFICER || 0, 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'],
                                ['Administrators', stats?.usersByRole?.ADMIN || 0, 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'],
                            ].map(([label, value, style]) => (
                                <div key={String(label)} className={`rounded-2xl p-4 ${style}`}>
                                    <p className="text-2xl font-black">{value}</p>
                                    <p className="mt-1 text-xs font-bold">{label}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900">
                    <CardContent className="space-y-5 p-6">
                        <DashboardSectionTitle eyebrow="Operator shortcuts" title="Run the platform with confidence" />
                        <div className="space-y-3">
                            {[
                                { href: '/admin/users', icon: Users, title: 'User Management', text: 'Audit and modify platform role permissions.' },
                                { href: '/admin/departments', icon: Building2, title: 'Academic Departments', text: 'Configure faculty departments and codes.' },
                                { href: '/admin/audit-logs', icon: History, title: 'Security Audit Trail', text: 'Traceable authentication and access events.' },
                                { href: '/admin/agents', icon: BrainCircuit, title: 'AI Observability', text: 'Inspect agent health and governance.' },
                                { href: '/admin/settings', icon: LockKeyhole, title: 'Access Settings', text: 'Manage account and governance preferences.' },
                            ].map(({ href, icon: Icon, title, text }) => (
                                <Link key={href} to={href} className="group flex items-center gap-3 rounded-xl border border-stone-200 dark:border-stone-800 p-3 transition hover:border-[#412D15] dark:hover:border-[#E1DCC9] hover:bg-[#FAF7F2] dark:hover:bg-[#1F150C]">
                                    <div className="rounded-lg bg-stone-100 dark:bg-stone-800 p-2 text-stone-700 dark:text-stone-300 group-hover:bg-[#412D15] group-hover:text-[#E1DCC9] dark:group-hover:bg-[#E1DCC9] dark:group-hover:text-[#1F150C] transition-colors">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-stone-900 dark:text-stone-100">{title}</p>
                                        <p className="mt-0.5 text-[11px] text-stone-600 dark:text-stone-300">{text}</p>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-stone-600 dark:text-stone-400 group-hover:text-[#412D15] dark:group-hover:text-[#E1DCC9]" />
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
