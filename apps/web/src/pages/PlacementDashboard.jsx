import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import {
    Briefcase, FileText, CheckCircle, TrendingUp, Clock,
    AlertTriangle, ArrowRight, ShieldAlert, Award, Calendar,
    ChevronRight, Sparkles, Users, ArrowUpRight, CheckCircle2,
    DollarSign, Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardHero, DashboardStat } from '../components/dashboard/DashboardPrimitives.jsx';

export const PlacementDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiClient.get('/analytics/placement');
                setStats(res.data.data);
            } catch (err) {
                setError('Unable to load placement metrics.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 max-w-7xl mx-auto text-xs animate-pulse">
                <div className="h-44 bg-palette-sandstone/40 rounded-3xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-28 bg-palette-sandstone/30 rounded-2xl" />
                    ))}
                </div>
                <div className="h-64 bg-palette-sandstone/30 rounded-2xl" />
            </div>
        );
    }

    const todayActivities = [
        { time: '09:30 AM', company: 'Google Cloud India', activity: 'Technical Interview Round 1', count: 24, type: 'Interviews' },
        { time: '11:00 AM', company: 'Amazon Web Services', activity: 'Pre-Placement Talk & Q&A', count: 120, type: 'PPT' },
        { time: '02:00 PM', company: 'Microsoft Research', activity: 'Shortlist Verification Deadline', count: 0, type: 'Deadline' }
    ];

    const attentionRequired = [
        { id: 1, title: '42 eligible candidates have not taken the mandatory technical audit', priority: 'HIGH', action: 'Review Candidates', link: '/placement/at-risk' },
        { id: 2, title: '3 active drives have pending recruiter shortlists awaiting verification', priority: 'HIGH', action: 'Open Drives', link: '/placement/drives' },
        { id: 3, title: '12 eligible finalists have not submitted resumes for SDE-1 roles', priority: 'MEDIUM', action: 'Contact Students', link: '/placement/students' },
        { id: 4, title: 'Recruiter CTC release approval pending for 18 offers', priority: 'LOW', action: 'View Offers', link: '/placement/offers' }
    ];

    const upcomingDrives = [
        { company: 'Google Inc.', role: 'Associate Cloud Engineer', ctc: '18.5 LPA', eligible: 94, applied: 72, date: 'Aug 28, 2026', status: 'Shortlisting' },
        { company: 'Amazon Web Services', role: 'Software Development Engineer', ctc: '16.0 LPA', eligible: 128, applied: 86, date: 'Tomorrow', status: 'Applications Open' },
        { company: 'Meta Platforms', role: 'Data Analyst Intern', ctc: '12.0 LPA', eligible: 110, applied: 65, date: 'Sep 02, 2026', status: 'Applications Open' }
    ];

    const recentRecruiterActivity = [
        { company: 'Amazon Web Services', event: 'Drive request confirmed for SDE-1 openings', time: '10 mins ago', status: 'PENDING' },
        { company: 'TCS Innovation Lab', event: 'Shortlisted candidate roster verified', time: '2 hours ago', status: 'COMPLETED' },
        { company: 'Microsoft India', event: 'Virtual campus hackathon dates confirmed', time: 'Yesterday', status: 'COMPLETED' }
    ];

    const totalApps = stats?.totalApplications || 480;
    const shortlistCount = stats?.applicationsByStatus?.SHORTLISTED || 210;
    const interviewCount = stats?.applicationsByStatus?.INTERVIEW || 132;
    const selectedCount = stats?.applicationsByStatus?.SELECTED || 84;

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in font-sans text-palette-espresso">
            {/* Placement Command Center Hero */}
            <DashboardHero
                eyebrow="Placement Operations Command Center"
                title="Drive placement outcomes with real-time confidence."
                description="Coordinate top recruiters, student readiness verification, applications, live interviews, and hiring outcomes from one decision-ready workspace."
                icon={Briefcase}
                tone="espresso"
                action={{ label: 'Open AI Placement Insights', href: '/placement/ai-insights' }}
            >
                <div className="grid grid-cols-3 gap-2.5 min-w-[280px]">
                    <div className="rounded-2xl border border-palette-sandstone/25 bg-palette-sandstone/10 p-3.5 backdrop-blur-md text-center shadow-xs">
                        <p className="text-[9.5px] font-bold uppercase tracking-wider text-palette-sandstone/80">Season</p>
                        <p className="mt-1 font-black text-sm text-white">2026–27</p>
                    </div>
                    <div className="rounded-2xl border border-palette-sandstone/25 bg-palette-sandstone/10 p-3.5 backdrop-blur-md text-center shadow-xs">
                        <p className="text-[9.5px] font-bold uppercase tracking-wider text-palette-sandstone/80">Active Drives</p>
                        <p className="mt-1 font-black text-sm text-white tabular-nums">{stats?.totalJobs || 12}</p>
                    </div>
                    <div className="rounded-2xl border border-palette-sandstone/25 bg-palette-sandstone/10 p-3.5 backdrop-blur-md text-center shadow-xs">
                        <p className="text-[9.5px] font-bold uppercase tracking-wider text-palette-sandstone/80">Placement Rate</p>
                        <p className="mt-1 font-black text-sm text-palette-sandstone tabular-nums">{stats?.placementRate || 82}%</p>
                    </div>
                </div>
            </DashboardHero>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 font-semibold rounded-2xl shadow-sm">
                    {error}
                </div>
            )}

            {/* 4 Top Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardStat
                    label="Total Placement Drives"
                    value={stats?.totalJobs || 14}
                    detail="Active recruiter pipeline"
                    icon={Briefcase}
                    tone="espresso"
                    trend="+3 this week"
                    trendUp={true}
                />
                <DashboardStat
                    label="Student Applications"
                    value={totalApps}
                    detail="Submitted across active drives"
                    icon={FileText}
                    tone="bronze"
                />
                <DashboardStat
                    label="Placed Candidates"
                    value={selectedCount}
                    detail="Confirmed corporate offers"
                    icon={CheckCircle}
                    tone="sandstone"
                    trend="82% target hit"
                    trendUp={true}
                />
                <DashboardStat
                    label="Operational Alerts"
                    value={attentionRequired.length}
                    detail="Requires review today"
                    icon={AlertTriangle}
                    tone="espresso"
                />
            </div>

            {/* Top Grid: Today Activity & Attention Required */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Today's Placement Activity */}
                <Card bezel={true} className="lg:col-span-1 bg-white/95">
                    <CardHeader className="border-b border-palette-sandstone/40 pb-3">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-palette-bronze" />
                            <CardTitle className="text-palette-espresso text-xs font-bold uppercase tracking-wider">
                                Today's Placement Activity
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 space-y-4">
                        {todayActivities.map((act, index) => (
                            <div key={index} className="flex gap-3 border-l-2 border-palette-bronze/40 pl-4 py-1 relative">
                                <div className="absolute w-2.5 h-2.5 rounded-full bg-palette-bronze -left-[6px] top-2 ring-2 ring-white shadow-xs" />
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-palette-espresso text-xs">{act.company}</span>
                                        <span className="text-[10px] text-palette-espresso/60 font-semibold">{act.time}</span>
                                    </div>
                                    <p className="text-palette-espresso/80 font-medium text-[11px]">{act.activity}</p>
                                    {act.count > 0 && (
                                        <Badge variant="bronze" size="xs">
                                            {act.count} Candidates Scheduled
                                        </Badge>
                                    )}
                                    <div className="flex gap-2.5 pt-1 text-[10.5px] font-bold text-palette-bronze">
                                        <Link to="/placement/drives" className="hover:underline">View Drive</Link>
                                        <span className="text-palette-sandstone">•</span>
                                        <Link to="/placement/interviews" className="hover:underline">Interview Room</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Right: Attention Required Alerts */}
                <Card bezel={true} className="lg:col-span-2 bg-white/95">
                    <CardHeader className="border-b border-palette-sandstone/40 pb-3 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4 text-palette-bronze" />
                            <CardTitle className="text-palette-espresso text-xs font-bold uppercase tracking-wider">
                                Urgent Operational Action Queue
                            </CardTitle>
                        </div>
                        <Badge variant="sandstone" dot={true} size="sm">
                            {attentionRequired.filter(i => i.priority === 'HIGH').length} Critical
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-0 divide-y divide-palette-sandstone/30">
                        {attentionRequired.map((item) => (
                            <div
                                key={item.id}
                                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-palette-sandstone-light/40 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <Badge
                                        variant={item.priority === 'HIGH' ? 'bronze' : item.priority === 'MEDIUM' ? 'sandstone' : 'neutral'}
                                        size="xs"
                                        className="mt-0.5"
                                    >
                                        {item.priority}
                                    </Badge>
                                    <span className="font-semibold text-palette-espresso text-xs">{item.title}</span>
                                </div>
                                <Link to={item.link} className="shrink-0">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        trailingIcon={ChevronRight}
                                        className="text-[11px] py-1 px-3 justify-center"
                                    >
                                        {item.action}
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Hiring Funnel Yield Pipeline Card */}
            <Card bezel={true} className="bg-white/95">
                <CardHeader className="border-b border-palette-sandstone/40 pb-3 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Award className="h-4.5 w-4.5 text-palette-bronze" />
                        <CardTitle className="text-palette-espresso text-xs font-bold uppercase tracking-wider">
                            Campus Hiring Yield & Conversion Pipeline
                        </CardTitle>
                    </div>
                    <span className="text-xs text-palette-espresso/60 font-medium">Full placement funnel conversion</span>
                </CardHeader>
                <CardContent className="p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                        {[
                            { label: 'Eligible', val: 620, pct: '100%' },
                            { label: 'Applied', val: totalApps, pct: `${Math.round((totalApps / 620) * 100)}%` },
                            { label: 'Shortlisted', val: shortlistCount, pct: `${Math.round((shortlistCount / 620) * 100)}%` },
                            { label: 'Interviewed', val: interviewCount, pct: `${Math.round((interviewCount / 620) * 100)}%` },
                            { label: 'Selected', val: selectedCount, pct: `${Math.round((selectedCount / 620) * 100)}%` },
                            { label: 'Offers Given', val: 76, pct: '12.2%' },
                            { label: 'Joined', val: 68, pct: '11.0%' }
                        ].map((stage) => (
                            <Link
                                key={stage.label}
                                to={stage.label === 'Applied' ? '/placement/applications' : '/placement/drives'}
                                className="group"
                            >
                                <div className="bg-palette-sandstone-canvas/60 border border-palette-sandstone/70 p-4 rounded-2xl text-center group-hover:border-palette-bronze group-hover:bg-palette-sandstone-light/60 transition-all cursor-pointer h-full flex flex-col justify-between space-y-2 shadow-xs">
                                    <span className="text-[10px] font-bold text-palette-espresso/60 uppercase tracking-wider">
                                        {stage.label}
                                    </span>
                                    <p className="text-2xl font-black text-palette-espresso tabular-nums">{stage.val}</p>
                                    <Badge variant="bronze" size="xs" className="mx-auto tabular-nums">
                                        {stage.pct}
                                    </Badge>
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Upcoming Placement Drives Card */}
            <Card bezel={true} className="bg-white/95">
                <CardHeader className="border-b border-palette-sandstone/40 pb-3 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4.5 w-4.5 text-palette-bronze" />
                        <CardTitle className="text-palette-espresso text-xs font-bold uppercase tracking-wider">
                            Upcoming Placement Drives
                        </CardTitle>
                    </div>
                    <Link
                        to="/placement/drives"
                        className="text-xs font-bold text-palette-bronze hover:text-palette-espresso transition-colors underline"
                    >
                        Manage All Drives →
                    </Link>
                </CardHeader>
                <CardContent className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {upcomingDrives.map((drv, index) => (
                        <div
                            key={index}
                            className="border border-palette-sandstone/70 rounded-2xl p-5 space-y-4 bg-white hover:shadow-card-hover hover:border-palette-bronze/50 transition-all double-bezel-inner"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-extrabold text-palette-espresso text-sm">{drv.company}</h4>
                                    <p className="text-palette-espresso/70 font-medium text-xs mt-0.5">{drv.role}</p>
                                </div>
                                <Badge
                                    variant={drv.status === 'Applications Open' ? 'bronze' : 'sandstone'}
                                    dot={true}
                                    size="xs"
                                >
                                    {drv.status}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 bg-palette-sandstone-canvas p-3 rounded-xl text-xs border border-palette-sandstone/50">
                                <div>
                                    <span className="text-palette-espresso/50 block uppercase font-bold text-[9.5px]">Package CTC</span>
                                    <span className="font-black text-palette-espresso tabular-nums">{drv.ctc}</span>
                                </div>
                                <div>
                                    <span className="text-palette-espresso/50 block uppercase font-bold text-[9.5px]">Drive Date</span>
                                    <span className="font-bold text-palette-espresso">{drv.date}</span>
                                </div>
                                <div className="col-span-2 border-t border-palette-sandstone/40 mt-1 pt-1.5 flex justify-between text-[11px] text-palette-espresso/70">
                                    <span>Eligible: <strong className="text-palette-espresso tabular-nums">{drv.eligible}</strong></span>
                                    <span>Applied: <strong className="text-palette-espresso tabular-nums">{drv.applied}</strong></span>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-1">
                                <Link to="/placement/drives" className="flex-1">
                                    <Button variant="primary" trailingIcon={ArrowRight} className="w-full text-xs py-1.5 justify-center">
                                        Open Drive
                                    </Button>
                                </Link>
                                <Link to="/placement/applications" className="flex-1">
                                    <Button variant="secondary" className="w-full text-xs py-1.5 justify-center">
                                        Applicants
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Bottom Grid: AI Placement Insights & Recruiter Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Placement Insights Card */}
                <div className="rounded-3xl bg-gradient-to-br from-palette-black via-palette-espresso to-palette-bronze p-6 sm:p-7 text-white border border-palette-bronze/40 shadow-bezel-dark lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between border-b border-palette-sandstone/20 pb-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4.5 w-4.5 text-palette-sandstone animate-pulse" />
                            <span className="font-bold text-sm text-white">Autonomous Placement Agent Intelligence</span>
                        </div>
                        <span className="text-[10px] font-bold text-palette-sandstone bg-palette-espresso/80 px-2.5 py-0.5 rounded-full border border-palette-sandstone/30">
                            AUDITED PREDICTIONS
                        </span>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-palette-sandstone/15 space-y-3 backdrop-blur-md">
                        <h4 className="font-bold text-white text-sm leading-snug">
                            "Software Developer role applications are up 14% this month following the Cloud Certification workshops."
                        </h4>
                        <p className="text-xs text-palette-sandstone/80 leading-relaxed font-normal">
                            Recommended Next Step: Launch targeted practice mock coding assessments for shortlisted Google Cloud candidates before Round 1.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-palette-sandstone">
                            <Link to="/placement/ai-insights" className="hover:text-white transition-colors underline-offset-4 hover:underline flex items-center gap-1">
                                <span>Open AI Intelligence Dashboard</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                            <Link to="/placement/readiness" className="hover:text-white transition-colors underline-offset-4 hover:underline flex items-center gap-1">
                                <span>View Readiness Benchmarks</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recruiter Activity Card */}
                <Card bezel={true} className="lg:col-span-1 bg-white/95">
                    <CardHeader className="border-b border-palette-sandstone/40 pb-3">
                        <div className="flex items-center gap-2">
                            <Users className="h-4.5 w-4.5 text-palette-bronze" />
                            <CardTitle className="text-palette-espresso text-xs font-bold uppercase tracking-wider">
                                Recruiter Feed
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5">
                        <div className="space-y-4">
                            {recentRecruiterActivity.map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-start text-xs">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.status === 'PENDING' ? 'bg-palette-bronze' : 'bg-emerald-600'}`} />
                                    <div className="flex-1 space-y-0.5">
                                        <div className="flex justify-between font-bold text-palette-espresso">
                                            <span>{item.company}</span>
                                            <span className="text-[9.5px] text-palette-espresso/50 font-normal">{item.time}</span>
                                        </div>
                                        <p className="text-palette-espresso/70 text-[11px]">{item.event}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PlacementDashboard;
