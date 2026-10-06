import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import {
    FadeIn,
    SlideIn,
    ScaleIn,
    StaggerContainer,
    StaggerItem,
    AnimatedProgress,
    BlurFadeIn,
    HoverLift,
    EASE_APPLE,
    EASE_SPRING,
} from '../components/ui/AnimationPrimitives.jsx';
import {
    Sparkles, Trophy, Calendar, CheckSquare, TrendingUp,
    ArrowRight, User, Briefcase, BookOpen, Clock, ChevronRight,
    Target, Zap, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardHero, DashboardStat } from '../components/dashboard/DashboardPrimitives.jsx';

export const StudentDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, profileRes] = await Promise.all([
                apiClient.get('/analytics/student'),
                apiClient.get('/students/profile')
            ]);
            setStats(statsRes.data.data);
            setProfile(profileRes.data.data);
        } catch (err) {
            setError('Failed to load dashboard metrics.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const calculateCompletion = () => {
        if (!profile) return 0;
        let score = 0;
        let total = 9;
        if (profile.rollNumber) score++;
        if (profile.semester) score++;
        if (profile.cgpa > 0) score++;
        if (profile.githubProfile || profile.linkedinProfile) score++;
        if (profile.skills && profile.skills.length > 0) score++;
        if (profile.projects && profile.projects.length > 0) score++;
        if (profile.certifications && profile.certifications.length > 0) score++;
        if (profile.careerInterests && profile.careerInterests.length > 0) score++;
        if (profile.careerGoals && profile.careerGoals.length > 0) score++;
        return Math.round((score / total) * 100);
    };

    const gpaData = [
        { semester: 'Sem 1', gpa: 7.2 },
        { semester: 'Sem 2', gpa: 7.8 },
        { semester: 'Sem 3', gpa: 8.1 },
        { semester: 'Sem 4', gpa: stats?.cgpa || 8.4 },
    ];

    if (loading) {
        return (
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Animated skeleton loading */}
                <div className="h-44 skeleton-shimmer rounded-3xl" />
                <div className="h-20 skeleton-shimmer rounded-2xl" style={{ animationDelay: '0.15s' }} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[0, 1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: EASE_APPLE }}
                            className="h-28 skeleton-shimmer rounded-2xl"
                        />
                    ))}
                </div>
            </div>
        );
    }

    const completionPercent = calculateCompletion();

    let nextAction = {
        title: 'Conduct AI Practice Mock Interview',
        description: 'Prepare yourself for upcoming campus recruiting drives. Run the simulated AI technical round now.',
        cta: 'Start Mock Interview',
        link: '/ai-interview'
    };

    if (completionPercent < 80) {
        nextAction = {
            title: 'Complete Student Profile Evidence',
            description: 'Your placement profile completion is currently low. Register your projects and GitHub handles to unlock top recruiter shortlists.',
            cta: 'Complete Profile',
            link: '/profile'
        };
    } else if (!profile?.resumeUrl) {
        nextAction = {
            title: 'Analyze and Optimize Resume PDF',
            description: 'Upload your active resume to execute the AI structure check and identify missing keywords.',
            cta: 'Scan Resume',
            link: '/resume'
        };
    } else if ((profile?.skills || []).length < 5) {
        nextAction = {
            title: 'Declare Core Technical Competencies',
            description: 'List technical and coding competencies on your profile to enable higher match scoring by matching agents.',
            cta: 'Declare Skills',
            link: '/skills-projects'
        };
    }

    const readinessScore = stats?.readinessScore || profile?.placementReadinessScore || 78;

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-xs font-sans text-[#1F150C]">
            {/* Top Hero Banner (Obsidian, Espresso & Bronze) */}
            <DashboardHero
                eyebrow="Autonomous Student Success Center"
                title={`Welcome back, ${user?.name?.split(' ')[0] || 'Student'}.`}
                description={`${profile?.department?.name || 'Computer Science & Engineering'} · Semester ${profile?.semester || 6}. CampusGent transforms your academic progress into a clear, recruiter-ready placement trajectory.`}
                icon={Sparkles}
                action={{ label: 'Open Placement Plan', href: '/placements' }}
            >
                <div className="min-w-[220px] rounded-2xl border border-[#E1DCC9]/30 bg-[#000000]/40 p-5 backdrop-blur-md shadow-bezel-dark">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#E1DCC9]">Placement Readiness</p>
                        <span className="text-[10px] font-bold text-[#E1DCC9]/80">Top Tier</span>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.5, ease: EASE_SPRING }}
                        className="mt-2 text-4xl font-black text-white tabular-nums"
                    >
                        {readinessScore}%
                    </motion.p>
                    <div className="mt-3">
                        <AnimatedProgress value={readinessScore} delay={0.7} barClassName="bg-gradient-to-r from-[#412D15] to-[#E1DCC9]" className="bg-[#1F150C] border-none" />
                    </div>
                </div>
            </DashboardHero>

            {/* Error Message if any */}
            {error && (
                <FadeIn>
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 font-semibold rounded-2xl shadow-sm">
                        {error}
                    </div>
                </FadeIn>
            )}

            {/* Attention / Next Best Action Banner */}
            <FadeIn delay={0.15}>
                <div className="double-bezel p-1">
                    <div className="double-bezel-inner relative overflow-hidden bg-gradient-to-r from-[#1F150C] via-[#31210F] to-[#412D15] p-6 text-white flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <motion.div
                            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 bg-[#E1DCC9]/10 rounded-full blur-2xl"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <div className="space-y-1.5 max-w-xl relative">
                            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E1DCC9]/15 border border-[#E1DCC9]/30 text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#E1DCC9]">
                                <Zap className="h-3 w-3 text-[#E1DCC9] status-pulse" />
                                <span>Recommended Next Step</span>
                            </div>
                            <h3 className="font-black text-sm sm:text-base text-white">{nextAction.title}</h3>
                            <p className="text-xs text-[#E1DCC9]/85 leading-relaxed font-normal">{nextAction.description}</p>
                        </div>
                        <Link to={nextAction.link} className="shrink-0 relative">
                            <Button
                                variant="sandstone"
                                trailingIcon={ArrowRight}
                                className="font-bold px-5 py-2.5 shadow-bezel-inner"
                            >
                                {nextAction.cta}
                            </Button>
                        </Link>
                    </div>
                </div>
            </FadeIn>

            {/* 4 Top Stats with staggered entrance */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardStat
                    label="Cumulative GPA"
                    value={`${stats?.cgpa || '8.40'} / 10`}
                    detail="Academic Momentum"
                    icon={Trophy}
                    tone="bronze"
                    trend="+0.3 vs Sem 3"
                    trendUp={true}
                    index={0}
                />
                <DashboardStat
                    label="Class Attendance"
                    value={`${stats?.attendance || 88}%`}
                    detail="Min. requirement 75%"
                    icon={Calendar}
                    tone="sandstone"
                    trend="Safe Status"
                    trendUp={true}
                    index={1}
                />
                <DashboardStat
                    label="Skills Endorsed"
                    value={stats?.skillsCount || (profile?.skills?.length || 8)}
                    detail="Verified Portfolio Proof"
                    icon={CheckSquare}
                    tone="espresso"
                    index={2}
                />
                <DashboardStat
                    label="Profile Strength"
                    value={`${completionPercent}%`}
                    detail="Unlock verified drives"
                    icon={User}
                    tone="bronze"
                    index={3}
                />
            </div>

            {/* Grid: 2 Cols Left, 1 Col Right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Charts & Progress) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* CGPA Progression Card */}
                    <FadeIn delay={0.1}>
                        <Card bezel={true} className="bg-white/95">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-[#E1DCC9]/70">
                                <CardTitle className="text-xs font-bold text-[#1F150C] uppercase tracking-wider flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-[#412D15]" />
                                    <span>Academic CGPA Progression</span>
                                </CardTitle>
                                <Link
                                    to="/academics"
                                    className="text-[#412D15] hover:text-[#000000] font-bold flex items-center gap-1 transition-colors underline text-xs"
                                >
                                    <span>View Transcript</span>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                            </CardHeader>
                            <CardContent className="h-64 pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={gpaData} margin={{ top: 10, right: 20, left: -25, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorGpaBronze" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#412D15" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#412D15" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E1DCC9" />
                                        <XAxis dataKey="semester" stroke="#8F7554" fontSize={11} />
                                        <YAxis domain={[0, 10]} stroke="#8F7554" fontSize={11} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1F150C',
                                                borderRadius: '12px',
                                                color: '#E1DCC9',
                                                fontSize: '11px',
                                                border: '1px solid #412D15'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="gpa"
                                            stroke="#412D15"
                                            strokeWidth={2.5}
                                            fillOpacity={1}
                                            fill="url(#colorGpaBronze)"
                                            animationDuration={1500}
                                            animationEasing="ease-out"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </FadeIn>

                    {/* 2 Split Sub-Cards (Learning Roadmap & Target Role) */}
                    <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Learning Roadmap Card */}
                        <StaggerItem>
                            <HoverLift>
                                <Card bezel={true} className="bg-white/95 flex flex-col justify-between h-full">
                                    <CardHeader className="pb-2 border-b border-[#E1DCC9]/40">
                                        <CardTitle className="text-xs font-bold text-[#6B5336] uppercase tracking-wider flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-[#412D15]" />
                                            <span>Learning Roadmap</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-4">
                                        <div className="space-y-1.5">
                                            <span className="font-bold text-[#1F150C] block text-sm">Full Stack Development Track</span>
                                            <div className="flex items-center justify-between text-[11px] text-[#6B5336]">
                                                <span>Progress</span>
                                                <span className="font-bold text-[#412D15] tabular-nums">68% Complete</span>
                                            </div>
                                            <AnimatedProgress value={68} delay={0.3} />
                                        </div>
                                        <div className="p-3 border border-[#E1DCC9] rounded-xl bg-[#FAF7F2] space-y-1">
                                            <span className="text-[9.5px] uppercase font-bold text-[#6B5336] tracking-wider">Next Up:</span>
                                            <p className="font-bold text-[#1F150C] text-xs">Advanced React State & Async Patterns</p>
                                        </div>
                                        <Link to="/learning" className="inline-block pt-1 w-full">
                                            <Button variant="secondary" trailingIcon={ArrowRight} className="w-full text-xs py-2 justify-center">
                                                Continue Learning
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </HoverLift>
                        </StaggerItem>

                        {/* Target Role Alignment Card */}
                        <StaggerItem>
                            <HoverLift>
                                <Card bezel={true} className="bg-white/95 flex flex-col justify-between h-full">
                                    <CardHeader className="pb-2 border-b border-[#E1DCC9]/40">
                                        <CardTitle className="text-xs font-bold text-[#6B5336] uppercase tracking-wider flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 text-[#412D15]" />
                                            <span>Target Role Alignment</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-4">
                                        <div className="space-y-1">
                                            <span className="font-bold text-[#1F150C] block text-sm">
                                                {profile?.careerInterests?.[0] || 'Software Development Engineer'}
                                            </span>
                                            <span className="text-[11px] text-[#6B5336] font-medium">Skill Match Benchmark: 92%</span>
                                        </div>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {(profile?.skills || [{ name: 'React' }, { name: 'Node.js' }, { name: 'TypeScript' }]).slice(0, 3).map((s) => (
                                                <Badge key={s.name} variant="bronze" size="xs">{s.name}</Badge>
                                            ))}
                                            {(profile?.skills || []).length > 3 && (
                                                <span className="text-[10px] text-[#6B5336] font-semibold self-center">
                                                    +{profile.skills.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                        <Link to="/career" className="inline-block pt-1 w-full">
                                            <Button variant="secondary" trailingIcon={ArrowRight} className="w-full text-xs py-2 justify-center">
                                                Open Career Roadmap
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </HoverLift>
                        </StaggerItem>
                    </StaggerContainer>
                </div>

                {/* Right Column (Recommended & Recent Activity) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* AI Recommendations Card */}
                    <SlideIn direction="right" delay={0.15}>
                        <Card bezel={true} className="bg-white/95">
                            <CardHeader className="pb-2 border-b border-[#E1DCC9]/40">
                                <CardTitle className="text-xs font-bold text-[#6B5336] uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-[#412D15]" />
                                    <span>AI Recommendations</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-3">
                                {[
                                    {
                                        title: 'Audit Database & SQL Skills',
                                        desc: 'Your placement audit reports a database query knowledge gap.',
                                        cta: 'Add Skill Proof',
                                        link: '/skills-projects'
                                    },
                                    {
                                        title: 'ATS Resume Optimizer',
                                        desc: 'Scan your resume formatting against top recruiter benchmarks.',
                                        cta: 'Scan Resume PDF',
                                        link: '/resume'
                                    },
                                    {
                                        title: 'Simulate Technical Round',
                                        desc: 'Practice live coding & HR questions with instant AI feedback.',
                                        cta: 'Launch Simulator',
                                        link: '/ai-interview'
                                    },
                                ].map((rec, i) => (
                                    <motion.div
                                        key={rec.title}
                                        initial={{ opacity: 0, x: 16 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: EASE_APPLE }}
                                        whileHover={{ x: 4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                                        className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E1DCC9] hover:bg-[#F4EFE6] transition-colors space-y-1 group cursor-default"
                                    >
                                        <h4 className="font-bold text-[#1F150C] text-xs">{rec.title}</h4>
                                        <p className="text-[11px] text-[#6B5336] leading-relaxed">{rec.desc}</p>
                                        <Link to={rec.link} className="text-[11px] font-bold text-[#412D15] group-hover:text-[#000000] inline-flex items-center gap-1 pt-1 underline">
                                            <span>{rec.cta}</span>
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </SlideIn>

                    {/* Recent Activity Timeline */}
                    <SlideIn direction="right" delay={0.25}>
                        <Card bezel={true} className="bg-white/95">
                            <CardHeader className="pb-2 border-b border-[#E1DCC9]/40">
                                <CardTitle className="text-xs font-bold text-[#6B5336] uppercase tracking-wider flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-[#412D15]" />
                                    <span>Recent Activity</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <div className="relative pl-4 border-l border-[#E1DCC9] space-y-4 text-xs">
                                    {[
                                        { time: 'Today', text: 'Cumulative GPA Context Refreshed', color: 'bg-[#412D15]' },
                                        { time: 'Yesterday', text: 'Applied to Amazon SDE-1 Drive', color: 'bg-[#6B5336]' },
                                        { time: '3 days ago', text: 'Completed AI Career Readiness Audit', color: 'bg-[#C9BF9F]' },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={item.time}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: 0.3 + i * 0.12, ease: EASE_APPLE }}
                                            className="relative"
                                        >
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                whileInView={{ scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.3, delay: 0.35 + i * 0.12, ease: EASE_SPRING }}
                                                className={`absolute -left-[21px] top-1 ${item.color} h-2.5 w-2.5 rounded-full ring-4 ring-white shadow-xs`}
                                            />
                                            <span className="text-[10px] text-[#8F7554] font-semibold block">{item.time}</span>
                                            <span className="font-bold text-[#1F150C] text-xs">{item.text}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
