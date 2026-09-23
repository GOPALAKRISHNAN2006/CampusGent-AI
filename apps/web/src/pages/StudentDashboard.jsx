import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, Trophy, Calendar, CheckSquare, TrendingUp, ArrowRight, User, Briefcase, BookOpen, Clock, ChevronRight } from 'lucide-react';
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
        }
        catch (err) {
            setError('Failed to load dashboard metrics.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDashboardData();
    }, []);
    const calculateCompletion = () => {
        if (!profile)
            return 0;
        let score = 0;
        let total = 9;
        if (profile.rollNumber)
            score++;
        if (profile.semester)
            score++;
        if (profile.cgpa > 0)
            score++;
        if (profile.githubProfile || profile.linkedinProfile)
            score++;
        if (profile.skills && profile.skills.length > 0)
            score++;
        if (profile.projects && profile.projects.length > 0)
            score++;
        if (profile.certifications && profile.certifications.length > 0)
            score++;
        if (profile.careerInterests && profile.careerInterests.length > 0)
            score++;
        if (profile.careerGoals && profile.careerGoals.length > 0)
            score++;
        return Math.round((score / total) * 100);
    };
    // GPA chart progression mock data
    const gpaData = [
        { semester: 'Sem 1', gpa: 7.2 },
        { semester: 'Sem 2', gpa: 7.8 },
        { semester: 'Sem 3', gpa: 8.1 },
        { semester: 'Sem 4', gpa: stats?.cgpa || 8.4 },
    ];
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-28 bg-brand-100 rounded-2xl" }), _jsx("div", { className: "h-16 bg-brand-100 rounded-xl" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-5", children: [_jsx("div", { className: "h-24 bg-brand-100 rounded-xl" }), _jsx("div", { className: "h-24 bg-brand-100 rounded-xl" }), _jsx("div", { className: "h-24 bg-brand-100 rounded-xl" }), _jsx("div", { className: "h-24 bg-brand-100 rounded-xl" })] })] }));
    }
    const completionPercent = calculateCompletion();
    // Next Best Action logic based on profile metrics
    let nextAction = {
        title: 'Conduct Mock Practice Interview',
        description: 'Prepare yourself for upcoming campus recruiting drives. Run the AI interview simulator now.',
        cta: 'Start Mock Interview',
        link: '/ai-interview'
    };
    if (completionPercent < 80) {
        nextAction = {
            title: 'Complete Student Profile context',
            description: 'Your placement profile completion is currently low. Register your projects and LinkedIn handles to unlock drives.',
            cta: 'Complete Profile',
            link: '/profile'
        };
    }
    else if (!profile?.resumeUrl) {
        nextAction = {
            title: 'Upload active Resume PDF',
            description: 'You haven\'t uploaded or analyzed your resume. Execute the AI structure check to identify formatting issues.',
            cta: 'Improve Resume',
            link: '/resume'
        };
    }
    else if ((profile?.skills || []).length < 5) {
        nextAction = {
            title: 'Declare technical Skills and Certifications',
            description: 'List technical and coding competencies on your profile to enable better match scoring by matching agents.',
            cta: 'Declare Skills',
            link: '/skills-projects'
        };
    }
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto text-xs animate-fade-in", children: [_jsx(DashboardHero, { eyebrow: "Student success command center", title: `Build your next breakthrough, ${user?.name.split(' ')[0] || 'student'}.`, description: `${profile?.department?.name || 'Your academic journey'} · Semester ${profile?.semester || 1}. CampusGent turns your activity into a clear, evidence-backed placement plan.`, icon: Sparkles, action: { label: 'Open my placement plan', href: '/placements' }, children: _jsxs("div", { className: "min-w-[210px] rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur", children: [_jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-100/70", children: "Placement readiness" }), _jsxs("p", { className: "mt-2 text-4xl font-black", children: [stats?.readinessScore || profile?.placementReadinessScore || 72, "%"] }), _jsx("div", { className: "mt-3 h-1.5 overflow-hidden rounded-full bg-white/15", children: _jsx("div", { className: "h-full rounded-full bg-cyan-300", style: { width: `${stats?.readinessScore || profile?.placementReadinessScore || 72}%` } }) })] }) }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), _jsxs("div", { className: "bg-indigo-900 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 relative overflow-hidden", children: [_jsx("div", { className: "absolute right-0 top-0 h-32 w-32 bg-indigo-850 rounded-full filter blur-xl opacity-35 -mr-10 -mt-10" }), _jsxs("div", { className: "space-y-1.5 max-w-xl relative", children: [_jsx("span", { className: "text-[9px] uppercase font-bold tracking-widest text-indigo-350 bg-indigo-950/40 px-2.5 py-0.5 rounded", children: "Attention Required" }), _jsx("h3", { className: "font-bold text-sm text-white", children: nextAction.title }), _jsx("p", { className: "text-xs text-indigo-150 leading-relaxed", children: nextAction.description })] }), _jsx(Link, { to: nextAction.link, className: "shrink-0 relative", children: _jsxs(Button, { className: "bg-white text-indigo-950 hover:bg-indigo-50 font-bold px-5 py-2.5 rounded-xl border-0 shadow-sm flex gap-1.5 items-center", children: [_jsx("span", { children: nextAction.cta }), _jsx(ArrowRight, { className: "h-4 w-4" })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [_jsx(DashboardStat, { label: "Cumulative GPA", value: `${stats?.cgpa || '0.00'}/10`, detail: "Academic momentum", icon: Trophy }), _jsx(DashboardStat, { label: "Class attendance", value: `${stats?.attendance || 88}%`, detail: "Keep above 75%", icon: Calendar, tone: "emerald" }), _jsx(DashboardStat, { label: "Skills declared", value: stats?.skillsCount || 0, detail: "Profile evidence", icon: CheckSquare, tone: "amber" }), _jsx(DashboardStat, { label: "Profile completion", value: `${completionPercent}%`, detail: "Unlock better matches", icon: User, tone: "cyan" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs(Card, { className: "border border-slate-200/80 shadow-sm", children: [_jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between border-b border-brand-50", children: [_jsxs(CardTitle, { className: "text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(TrendingUp, { className: "h-4 w-4 text-brand-450" }), _jsx("span", { children: "Academic CGPA progression" })] }), _jsxs(Link, { to: "/academics", className: "text-indigo-650 hover:underline font-semibold flex items-center gap-0.5", children: [_jsx("span", { children: "View Transcript" }), _jsx(ChevronRight, { className: "h-3 w-3" })] })] }), _jsx(CardContent, { className: "h-64 pt-4", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: gpaData, margin: { top: 10, right: 30, left: -25, bottom: 0 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9" }), _jsx(XAxis, { dataKey: "semester", stroke: "#94a3b8", fontSize: 10 }), _jsx(YAxis, { domain: [0, 10], stroke: "#94a3b8", fontSize: 10 }), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "gpa", stroke: "#2A7C13", strokeWidth: 2, activeDot: { r: 6 } })] }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { className: "border border-brand-200/60 shadow-sm flex flex-col justify-between", children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs(CardTitle, { className: "text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(BookOpen, { className: "h-4 w-4 text-brand-400" }), _jsx("span", { children: "Learning Roadmap" })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("span", { className: "font-bold text-brand-900 block leading-snug", children: "Full Stack Development Path" }), _jsx("span", { className: "text-[10px] text-brand-400 font-medium", children: "68% Complete" })] }), _jsxs("div", { className: "p-3 border border-brand-100 rounded-xl bg-brand-50/20 text-brand-700 leading-snug space-y-0.5", children: [_jsx("span", { className: "text-[9px] uppercase font-bold text-brand-400", children: "Next Lesson:" }), _jsx("p", { className: "font-bold text-brand-900", children: "Advanced Express Middleware" })] }), _jsx(Link, { to: "/learning", className: "inline-block pt-1", children: _jsx(Button, { size: "sm", variant: "secondary", className: "text-[10px] py-1 px-3 border-brand-200 text-brand-700 font-semibold hover:bg-brand-50", children: "Continue Learning" }) })] })] }), _jsxs(Card, { className: "border border-brand-200/60 shadow-sm flex flex-col justify-between", children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs(CardTitle, { className: "text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(Briefcase, { className: "h-4 w-4 text-brand-400" }), _jsx("span", { children: "Target Role Alignment" })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("span", { className: "font-bold text-brand-900 block leading-snug", children: profile?.careerInterests?.[0] || 'Software Engineer' }), _jsx("span", { className: "text-[10px] text-brand-400 font-medium", children: "Goal Alignment Match Score" })] }), _jsxs("div", { className: "flex gap-1 flex-wrap", children: [(profile?.skills || []).slice(0, 3).map((s) => (_jsx(Badge, { variant: "secondary", className: "text-[9px]", children: s.name }, s.name))), (profile?.skills || []).length > 3 && (_jsxs("span", { className: "text-[10px] text-brand-450 font-semibold ml-1", children: ["+", profile.skills.length - 3, " more"] }))] }), _jsx(Link, { to: "/career", className: "inline-block pt-1", children: _jsx(Button, { size: "sm", variant: "secondary", className: "text-[10px] py-1 px-3 border-brand-200 text-brand-700 font-semibold hover:bg-brand-50", children: "Open Career Plan" }) })] })] })] })] }), _jsxs("div", { className: "lg:col-span-1 space-y-6", children: [_jsxs(Card, { className: "border border-brand-200/60 shadow-sm", children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs(CardTitle, { className: "text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(Sparkles, { className: "h-4 w-4 text-indigo-500" }), _jsx("span", { children: "Recommended For You" })] }) }), _jsxs(CardContent, { className: "space-y-3 pt-2", children: [_jsxs("div", { className: "p-3 border border-brand-50 rounded-xl bg-indigo-50/15 hover:bg-indigo-50/30 transition-colors cursor-pointer space-y-1", children: [_jsx("h4", { className: "font-bold text-brand-950 text-[11px]", children: "Improve SQL Knowledge Gaps" }), _jsx("p", { className: "text-[10px] text-brand-600 leading-relaxed", children: "Your placement audit reports a database query skill gap." }), _jsx(Link, { to: "/skills-projects", className: "text-[10px] font-bold text-indigo-650 inline-block pt-1", children: "Add Skill \u2192" })] }), _jsxs("div", { className: "p-3 border border-brand-50 rounded-xl bg-indigo-50/15 hover:bg-indigo-50/30 transition-colors cursor-pointer space-y-1", children: [_jsx("h4", { className: "font-bold text-brand-950 text-[11px]", children: "Audit Resume ATS Score" }), _jsx("p", { className: "text-[10px] text-brand-600 leading-relaxed", children: "Update missing keyword counts on your active template." }), _jsx(Link, { to: "/resume", className: "text-[10px] font-bold text-indigo-650 inline-block pt-1", children: "Scan Resume \u2192" })] }), _jsxs("div", { className: "p-3 border border-brand-50 rounded-xl bg-indigo-50/15 hover:bg-indigo-50/30 transition-colors cursor-pointer space-y-1", children: [_jsx("h4", { className: "font-bold text-brand-950 text-[11px]", children: "Practice HR Mock Rounds" }), _jsx("p", { className: "text-[10px] text-brand-600 leading-relaxed", children: "Practice HR simulation questions to build communication depth." }), _jsx(Link, { to: "/ai-interview", className: "text-[10px] font-bold text-indigo-650 inline-block pt-1", children: "Start Simulator \u2192" })] })] })] }), _jsxs(Card, { className: "border border-brand-200/60 shadow-sm", children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs(CardTitle, { className: "text-xs font-bold text-brand-500 uppercase tracking-wider flex items-center gap-1.5", children: [_jsx(Clock, { className: "h-4 w-4 text-brand-400" }), _jsx("span", { children: "Recent Activity" })] }) }), _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "relative pl-4 border-l border-brand-100 space-y-4", children: [_jsxs("div", { className: "relative text-[10px]", children: [_jsx("span", { className: "absolute -left-[20.5px] top-1 bg-white border border-indigo-600 h-2.5 w-2.5 rounded-full" }), _jsx("span", { className: "text-brand-400 font-semibold block", children: "Today" }), _jsx("span", { className: "font-bold text-brand-900", children: "Modified Cumulative GPA Context" })] }), _jsxs("div", { className: "relative text-[10px]", children: [_jsx("span", { className: "absolute -left-[20.5px] top-1 bg-white border border-brand-200 h-2.5 w-2.5 rounded-full" }), _jsx("span", { className: "text-brand-400 font-semibold block", children: "Yesterday" }), _jsx("span", { className: "font-bold text-brand-900", children: "Submitted application to job Match vacancy" })] }), _jsxs("div", { className: "relative text-[10px]", children: [_jsx("span", { className: "absolute -left-[20.5px] top-1 bg-white border border-brand-200 h-2.5 w-2.5 rounded-full" }), _jsx("span", { className: "text-brand-400 font-semibold block", children: "3 days ago" }), _jsx("span", { className: "font-bold text-brand-900", children: "Executed AI Success Performance audit" })] })] }) })] })] })] })] }));
};
export default StudentDashboard;
