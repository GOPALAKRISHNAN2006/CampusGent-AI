import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { apiClient } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { DashboardHero, DashboardStat } from '../components/dashboard/DashboardPrimitives.jsx';
import {
    Users, GraduationCap, AlertTriangle, CheckSquare, Clock,
    ArrowRight, Sparkles, UserCheck, PlusCircle, FileText,
    FolderKanban, ArrowUpRight, ShieldAlert, CheckCircle2
} from 'lucide-react';

export const FacultyDashboard = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [riskStudents, setRiskStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Student creation states
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentEmail, setNewStudentEmail] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [addMessage, setAddMessage] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [classesRes, riskRes] = await Promise.all([
                apiClient.get('/faculty/classes'),
                apiClient.get('/faculty/at-risk')
            ]);
            setClasses(classesRes.data.data || []);
            setRiskStudents(riskRes.data.data || []);
        } catch (err) {
            setError('Failed to load faculty dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        setAddMessage(null);
        try {
            await apiClient.post('/students', {
                name: newStudentName,
                email: newStudentEmail,
            });
            setAddMessage({ type: 'success', text: 'Student account created. Default password: CampusGent@123' });
            setNewStudentName('');
            setNewStudentEmail('');
            const riskRes = await apiClient.get('/faculty/at-risk');
            setRiskStudents(riskRes.data.data || []);
        } catch (err) {
            setAddMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create student' });
        } finally {
            setIsAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
                <div className="h-44 bg-[#E1DCC9]/40 rounded-3xl" />
                <div className="h-20 bg-[#E1DCC9]/40 rounded-2xl" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="h-44 bg-[#E1DCC9]/40 rounded-2xl" />
                    <div className="h-44 bg-[#E1DCC9]/40 rounded-2xl" />
                    <div className="h-44 bg-[#E1DCC9]/40 rounded-2xl" />
                </div>
            </div>
        );
    }

    const totalMentees = classes.reduce((sum, c) => sum + (c.students?.length || 0), 0) || 48;
    const averageGpa = 7.8;
    const pendingAssessmentsCount = 3;
    const highRiskCount = riskStudents.filter(s => s.riskLevel === 'HIGH').length;

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in font-sans text-[#1F150C]">
            {/* Dashboard Hero */}
            <DashboardHero
                eyebrow="Cognitive Faculty Mentoring Hub"
                title={`Welcome, Professor ${user?.name?.split(' ').pop() || ''}.`}
                description={`Mentoring dashboard for ${classes.length || 3} active academic sections. Spot risk indicators early, record attendance, and guide student outcomes with context.`}
                icon={GraduationCap}
                tone="espresso"
                action={{ label: 'Review Risk Registry', href: '/faculty/at-risk' }}
            >
                <div className="min-w-[210px] rounded-2xl border border-[#E1DCC9]/30 bg-[#000000]/40 p-5 backdrop-blur-md shadow-bezel-dark">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#E1DCC9]">High-Risk Mentees</p>
                    <p className="mt-2 text-4xl font-black text-white tabular-nums">{highRiskCount}</p>
                    <p className="mt-1 text-[11px] text-[#E1DCC9]/80">Requires proactive intervention</p>
                </div>
            </DashboardHero>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 font-semibold rounded-2xl shadow-sm">
                    {error}
                </div>
            )}

            {/* Attention Alert Banner with Double-Bezel */}
            {riskStudents.length > 0 && (
                <div className="double-bezel p-1">
                    <div className="double-bezel-inner bg-[#F4EFE6] p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 relative overflow-hidden">
                        <div className="space-y-1.5 max-w-xl">
                            <span className="text-[9.5px] uppercase font-bold tracking-widest text-[#412D15] bg-[#E1DCC9]/60 px-2.5 py-0.5 rounded-full">
                                Mentorship Alert
                            </span>
                            <h3 className="font-bold text-sm text-[#1F150C]">Attendance & Performance Review Required</h3>
                            <p className="text-xs text-[#6B5336] leading-relaxed">
                                {riskStudents.length} students in your classes have attendance below the 75% threshold or declining test scores. Review risk indicators now.
                            </p>
                        </div>
                        <Link to="/faculty/at-risk" className="shrink-0">
                            <Button
                                variant="primary"
                                trailingIcon={ArrowRight}
                                className="px-5 py-2.5 shadow-bezel-inner"
                            >
                                Review Risk Registry
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* 4 Top Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardStat
                    label="Assigned Mentees"
                    value={totalMentees}
                    detail="Across active classes"
                    icon={Users}
                    tone="bronze"
                />
                <DashboardStat
                    label="Average Section GPA"
                    value={`${averageGpa} / 10`}
                    detail="Department benchmark"
                    icon={GraduationCap}
                    tone="sandstone"
                />
                <DashboardStat
                    label="Pending Tasks"
                    value={pendingAssessmentsCount}
                    detail="Assessments & grade logs"
                    icon={CheckSquare}
                    tone="espresso"
                />
                <DashboardStat
                    label="At-Risk Flagged"
                    value={riskStudents.length}
                    detail="Open intervention queue"
                    icon={AlertTriangle}
                    tone="rose"
                />
            </div>

            {/* Main 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Section (Schedule, Tools, Student Registration) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Today's Teaching Schedule Card */}
                    <Card bezel={true} className="bg-white/95">
                        <CardHeader className="pb-3 border-b border-[#E1DCC9]/70 flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold text-[#1F150C] uppercase tracking-wider flex items-center gap-2">
                                <Clock className="h-4 w-4 text-[#412D15]" />
                                <span>Today's Teaching Schedule</span>
                            </CardTitle>
                            <Link
                                to="/faculty/timetable"
                                className="text-xs font-bold text-[#412D15] hover:text-[#000000] transition-colors underline"
                            >
                                View Full Timetable →
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0 divide-y divide-[#E1DCC9]/50">
                            {classes.length === 0 ? (
                                <div className="p-6 text-center text-[#8F7554]">
                                    No teaching classes scheduled for today.
                                </div>
                            ) : (
                                classes.map((c) => (
                                    <div
                                        key={c._id}
                                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF7F2] transition-colors"
                                    >
                                        <div className="flex gap-3.5 items-center">
                                            <div className="bg-[#F4EFE6] border border-[#E1DCC9] text-[#1F150C] px-3 py-1.5 rounded-xl text-center shrink-0">
                                                <p className="font-extrabold text-xs">{c.timetable?.[0]?.time || '09:30 AM'}</p>
                                                <p className="text-[9px] font-bold uppercase tracking-wider text-[#412D15]">
                                                    {c.timetable?.[0]?.day || 'Today'}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#1F150C] text-sm leading-snug">{c.subjectName}</h4>
                                                <p className="text-[#6B5336] text-xs mt-0.5">
                                                    {c.courseCode} • {c.section} • Room {c.timetable?.[0]?.room || 'Lab 3'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Link to="/faculty/attendance">
                                                <Button size="sm" variant="secondary">Attendance</Button>
                                            </Link>
                                            <Link to={`/faculty/classes/${c._id}`}>
                                                <Button size="sm" variant="primary">Open Class</Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* 3 Quick Workspaces Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card bezel={true} className="bg-white/95">
                            <CardContent className="p-5 space-y-3">
                                <div className="bg-[#F4EFE6] border border-[#E1DCC9] p-2.5 rounded-xl text-[#412D15] w-fit">
                                    <UserCheck className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-[#1F150C] text-xs">Attendance Log</h4>
                                <p className="text-[11px] text-[#6B5336] leading-normal">Record class roll call and track leaves.</p>
                                <Link to="/faculty/attendance" className="block pt-1">
                                    <Button size="sm" variant="secondary" trailingIcon={ArrowRight} className="w-full text-xs justify-center">
                                        Take Attendance
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card bezel={true} className="bg-white/95">
                            <CardContent className="p-5 space-y-3">
                                <div className="bg-[#F4EFE6] border border-[#E1DCC9] p-2.5 rounded-xl text-[#412D15] w-fit">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-[#1F150C] text-xs">Assessments Hub</h4>
                                <p className="text-[11px] text-[#6B5336] leading-normal">Create quizzes, assignments, and exams.</p>
                                <Link to="/faculty/assessments" className="block pt-1">
                                    <Button size="sm" variant="secondary" trailingIcon={ArrowRight} className="w-full text-xs justify-center">
                                        Manage Exams
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card bezel={true} className="bg-white/95">
                            <CardContent className="p-5 space-y-3">
                                <div className="bg-[#F4EFE6] border border-[#E1DCC9] p-2.5 rounded-xl text-[#412D15] w-fit">
                                    <FolderKanban className="h-5 w-5" />
                                </div>
                                <h4 className="font-bold text-[#1F150C] text-xs">Marks Ledger</h4>
                                <p className="text-[11px] text-[#6B5336] leading-normal">Enter, calculate, and publish student scores.</p>
                                <Link to="/faculty/marks" className="block pt-1">
                                    <Button size="sm" variant="secondary" trailingIcon={ArrowRight} className="w-full text-xs justify-center">
                                        Record Marks
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Student Registration Form Card */}
                    <Card bezel={true} className="bg-white/95">
                        <CardHeader className="pb-2 border-b border-[#E1DCC9]/40">
                            <CardTitle className="text-xs font-bold text-[#412D15] uppercase tracking-wider flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" />
                                <span>Register New Student Mentee</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <form onSubmit={handleAddStudent} className="flex flex-col md:flex-row gap-4 items-end pt-1">
                                <div className="flex-1 w-full space-y-1">
                                    <Input
                                        label="Student Full Name"
                                        required={true}
                                        value={newStudentName}
                                        onChange={(e) => setNewStudentName(e.target.value)}
                                        placeholder="e.g. Priya Sharma"
                                    />
                                </div>
                                <div className="flex-1 w-full space-y-1">
                                    <Input
                                        label="Student University Email"
                                        type="email"
                                        required={true}
                                        value={newStudentEmail}
                                        onChange={(e) => setNewStudentEmail(e.target.value)}
                                        placeholder="e.g. priya@university.edu"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={isAdding}
                                    trailingIcon={ArrowRight}
                                    className="h-10 px-5 shrink-0"
                                >
                                    Register Student
                                </Button>
                            </form>
                            {addMessage && (
                                <div className={`mt-3 p-3 text-xs font-semibold rounded-xl ${
                                    addMessage.type === 'success'
                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                                }`}>
                                    {addMessage.text}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Section (AI Insights & At-Risk Alerts) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* AI Insights Card */}
                    <div className="rounded-3xl bg-gradient-to-br from-[#000000] to-[#1F150C] p-6 text-white border border-[#412D15]/80 shadow-bezel-dark space-y-4">
                        <div className="flex items-center gap-2 text-[#E1DCC9] font-bold text-xs uppercase tracking-wider">
                            <Sparkles className="h-4 w-4 animate-pulse" />
                            <span>AI Mentorship Insights</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-[#412D15] space-y-2 backdrop-blur-md">
                            <span className="text-[9px] uppercase font-bold text-[#E1DCC9] tracking-widest">
                                COGNITIVE RECOMMENDATION
                            </span>
                            <p className="text-xs text-[#E1DCC9]/85 leading-relaxed font-normal">
                                "Section B's database query average dropped by 8% over recent normalization tests. Consider scheduling a review tutorial before the upcoming campus drive."
                            </p>
                        </div>
                        <Link
                            to="/faculty/ai-insights"
                            className="text-xs font-bold text-[#E1DCC9] hover:text-white inline-flex items-center gap-1.5 transition-colors underline"
                        >
                            <span>Open Intelligence Hub</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {/* At-Risk Registry Quick View */}
                    <Card bezel={true} className="bg-white/95">
                        <CardHeader className="pb-2 border-b border-[#E1DCC9]/70 flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold text-[#1F150C] uppercase tracking-wider flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-rose-600" />
                                <span>Risk Registry Alerts</span>
                            </CardTitle>
                            <Link to="/faculty/at-risk" className="text-[11px] font-bold text-[#412D15] hover:text-[#000000] underline">
                                View All →
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0 divide-y divide-[#E1DCC9]/50">
                            {riskStudents.length === 0 ? (
                                <div className="p-4 text-center text-[#8F7554]">
                                    No students currently flagged in risk categories.
                                </div>
                            ) : (
                                riskStudents.slice(0, 3).map((s) => (
                                    <div
                                        key={s._id}
                                        className="p-3.5 flex items-center justify-between hover:bg-[#FAF7F2] transition-colors"
                                    >
                                        <div>
                                            <p className="font-bold text-[#1F150C] text-xs">{s.name}</p>
                                            <p className="text-[10px] text-[#6B5336]">
                                                CGPA: {s.cgpa || '6.2'} • Attnd: {s.attendance || 65}%
                                            </p>
                                        </div>
                                        <Badge
                                            variant={s.riskLevel === 'HIGH' ? 'danger' : 'warning'}
                                            dot={true}
                                            size="xs"
                                        >
                                            {s.riskLevel || 'HIGH'}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
