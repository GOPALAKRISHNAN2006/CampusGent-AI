import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import {
    User, GraduationCap, Award, Link as LinkIcon, Github, Linkedin,
    Globe, Plus, Trash2, Edit2, CheckCircle, Briefcase, AlertCircle,
    Mail, Shield, BookOpen, X
} from 'lucide-react';

export const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [editTab, setEditTab] = useState('personal');

    // Form states
    const [formData, setFormData] = useState({
        rollNumber: '',
        semester: 1,
        cgpa: 0,
        resumeUrl: '',
        githubProfile: '',
        linkedinProfile: '',
        portfolioUrl: '',
        skills: [],
        projects: [],
        certifications: [],
        careerInterests: [],
        careerGoals: []
    });

    const [modalError, setModalError] = useState(null);

    // Dynamic Skill input state
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillProficiency, setNewSkillProficiency] = useState('BEGINNER');

    // Dynamic Project input state
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        technologies: '',
        githubUrl: '',
        demoUrl: ''
    });

    // Dynamic Certification input state
    const [newCert, setNewCert] = useState({
        name: '',
        issuingOrg: '',
        issueDate: '',
        credentialUrl: ''
    });

    const [saving, setSaving] = useState(false);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/students/profile');
            const data = res.data.data;
            setProfile(data);
            setFormData({
                rollNumber: data.rollNumber || '',
                semester: data.semester || 1,
                cgpa: data.cgpa || 0,
                resumeUrl: data.resumeUrl || '',
                githubProfile: data.githubProfile || '',
                linkedinProfile: data.linkedinProfile || '',
                portfolioUrl: data.portfolioUrl || '',
                skills: data.skills || [],
                projects: data.projects || [],
                certifications: data.certifications || [],
                careerInterests: data.careerInterests || [],
                careerGoals: data.careerGoals || []
            });
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to retrieve student profile information.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
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

    const normalizeUrl = (url) => {
        if (!url) return '';
        const trimmed = url.trim();
        if (!trimmed) return '';
        if (!/^https?:\/\//i.test(trimmed)) {
            return `https://${trimmed}`;
        }
        return trimmed;
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setModalError(null);
            const payload = {
                rollNumber: formData.rollNumber?.trim() || undefined,
                semester: Math.max(1, Math.min(8, Number(formData.semester) || 1)),
                cgpa: Math.max(0, Math.min(10, Number(formData.cgpa) || 0)),
                resumeUrl: normalizeUrl(formData.resumeUrl),
                githubProfile: normalizeUrl(formData.githubProfile),
                linkedinProfile: normalizeUrl(formData.linkedinProfile),
                portfolioUrl: normalizeUrl(formData.portfolioUrl),
                skills: (formData.skills || []).map((s) => ({
                    name: s.name,
                    proficiency: s.proficiency || 'BEGINNER',
                    verified: s.verified || false
                })),
                projects: (formData.projects || []).map((p) => ({
                    title: p.title,
                    description: p.description || '',
                    technologies: Array.isArray(p.technologies) ? p.technologies : (p.technologies ? [p.technologies] : []),
                    githubUrl: normalizeUrl(p.githubUrl),
                    demoUrl: normalizeUrl(p.demoUrl)
                })),
                certifications: (formData.certifications || []).map((c) => ({
                    name: c.name,
                    issuingOrg: c.issuingOrg || '',
                    issueDate: c.issueDate || new Date().toISOString().slice(0, 10),
                    credentialUrl: normalizeUrl(c.credentialUrl)
                })),
                careerInterests: formData.careerInterests || [],
                careerGoals: formData.careerGoals || []
            };
            await apiClient.put('/students/profile', payload);
            await fetchProfile();
            setIsEditing(false);
        } catch (err) {
            const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to save student profile information.';
            setModalError(msg);
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    // Skill Handlers
    const addSkill = () => {
        if (!newSkillName.trim()) return;
        const name = newSkillName.trim();
        if (formData.skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
            setNewSkillName('');
            return;
        }
        setFormData({
            ...formData,
            skills: [...formData.skills, { name, proficiency: newSkillProficiency, verified: false }]
        });
        setNewSkillName('');
    };

    const removeSkill = (index) => {
        const updated = [...formData.skills];
        updated.splice(index, 1);
        setFormData({ ...formData, skills: updated });
    };

    // Project Handlers
    const addProject = () => {
        if (!newProject.title.trim()) return;
        const techs = newProject.technologies
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
        setFormData({
            ...formData,
            projects: [
                ...formData.projects,
                {
                    title: newProject.title.trim(),
                    description: newProject.description.trim(),
                    technologies: techs,
                    githubUrl: newProject.githubUrl.trim(),
                    demoUrl: newProject.demoUrl.trim()
                }
            ]
        });
        setNewProject({ title: '', description: '', technologies: '', githubUrl: '', demoUrl: '' });
    };

    const removeProject = (index) => {
        const updated = [...formData.projects];
        updated.splice(index, 1);
        setFormData({ ...formData, projects: updated });
    };

    // Certification Handlers
    const addCertification = () => {
        if (!newCert.name.trim() || !newCert.issuingOrg.trim() || !newCert.issueDate) return;
        setFormData({
            ...formData,
            certifications: [
                ...formData.certifications,
                {
                    name: newCert.name.trim(),
                    issuingOrg: newCert.issuingOrg.trim(),
                    issueDate: newCert.issueDate,
                    credentialUrl: newCert.credentialUrl.trim()
                }
            ]
        });
        setNewCert({ name: '', issuingOrg: '', issueDate: '', credentialUrl: '' });
    };

    const removeCertification = (index) => {
        const updated = [...formData.certifications];
        updated.splice(index, 1);
        setFormData({ ...formData, certifications: updated });
    };

    if (loading) {
        return (
            <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
                <div className="h-40 bg-[#FAF7F2] border border-[#E1DCC9] rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="h-48 bg-[#FAF7F2] border border-[#E1DCC9] rounded-xl md:col-span-1" />
                    <div className="h-96 bg-[#FAF7F2] border border-[#E1DCC9] rounded-xl md:col-span-3" />
                </div>
            </div>
        );
    }

    const completionPercent = calculateCompletion();

    const tabs = [
        { id: 'overview', label: 'Profile Overview', icon: User },
        { id: 'academic', label: 'Academic Performance', icon: GraduationCap },
        { id: 'skills', label: 'Verified Skills', icon: BookOpen },
        { id: 'projects', label: 'Featured Projects', icon: Briefcase },
        { id: 'certifications', label: 'Certifications', icon: Award },
        { id: 'career', label: 'Career Goals', icon: Award }
    ];

    return (
        <>
            <div className="space-y-6 max-w-6xl w-full mx-auto">
                {/* Hero Profile Banner */}
                <div className="bg-white border border-[#E1DCC9] rounded-2xl shadow-subtle overflow-hidden relative">
                    <div className="h-28 sm:h-32 bg-gradient-to-r from-[#1F150C] via-[#31210F] to-[#0A0704] relative p-4 sm:p-6 flex items-start justify-between">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-[#E1DCC9] border border-white/15">
                            <GraduationCap className="h-3.5 w-3.5 text-[#E1DCC9]" />
                            <span>{profile?.department?.name || 'Engineering Student'}</span>
                        </div>
                        <div className="text-[11px] sm:text-xs font-semibold text-[#E1DCC9]/90 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#E1DCC9]/20">
                            Student ID: {profile?.rollNumber || 'Not set'}
                        </div>
                    </div>
                    <div className="p-4 sm:p-6 pt-0">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
                            <div className="flex items-end gap-3 sm:gap-4">
                                <div className="-mt-12 sm:-mt-14 h-20 w-20 sm:h-24 sm:w-24 bg-[#1F150C] border-4 border-white text-[#E1DCC9] rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md shrink-0 z-10">
                                    {profile?.user?.name
                                        ? profile.user.name
                                              .split(' ')
                                              .map((n) => n[0])
                                              .join('')
                                              .slice(0, 2)
                                              .toUpperCase()
                                        : 'ST'}
                                </div>
                                <div className="pt-2 sm:pt-0 pb-1 min-w-0">
                                    <h1 className="text-2xl sm:text-3xl font-black text-[#1F150C] leading-tight">
                                        {profile?.user?.name || 'Student Account'}
                                    </h1>
                                    <div className="text-xs text-[#6B5336] mt-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2 font-semibold">
                                        <GraduationCap className="h-3.5 w-3.5 text-[#412D15] shrink-0" />
                                        <span>{profile?.department?.name || 'Computer Science & Engineering'}</span>
                                        <span className="text-[#C9BF9F]">•</span>
                                        <span>B.Tech / Semester {profile?.semester || 1}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-end pb-1">
                                <Button
                                    onClick={() => {
                                        setModalError(null);
                                        setIsEditing(true);
                                    }}
                                    variant="primary"
                                    size="sm"
                                    className="text-xs flex items-center gap-2 px-4 py-2 font-bold shadow-sm cursor-pointer"
                                >
                                    <Edit2 className="h-3.5 w-3.5" />
                                    <span>Edit Profile</span>
                                </Button>
                            </div>
                        </div>

                        {/* Profile Completion Bar */}
                        <div className="pt-3 border-t border-[#E1DCC9]/50 flex items-center gap-3">
                            <span className="text-[11px] font-bold text-[#6B5336] uppercase tracking-wider shrink-0">
                                Profile Completeness
                            </span>
                            <div className="flex-1 bg-[#F4EFE6] h-2.5 rounded-full overflow-hidden border border-[#E1DCC9]/50">
                                <div
                                    className="bg-gradient-to-r from-[#412D15] to-[#1F150C] h-full transition-all duration-500 rounded-full"
                                    style={{ width: `${completionPercent}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-[#412D15] whitespace-nowrap">
                                {completionPercent}% Completed
                            </span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex gap-2.5 items-start">
                        <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Main Content Layout with Responsive Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    {/* Navigation Pills (Horizontal scroll on mobile/tablet, vertical sidebar on desktop) */}
                    <div className="md:col-span-1 bg-white border border-[#E1DCC9] rounded-2xl p-2 sm:p-2.5 shadow-subtle overflow-hidden">
                        <div className="flex md:flex-col overflow-x-auto gap-1 pb-1 md:pb-0 scrollbar-none">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap shrink-0 text-left cursor-pointer ${
                                            isActive
                                                ? 'bg-[#1F150C] text-[#E1DCC9] shadow-subtle'
                                                : 'text-[#6B5336] hover:bg-[#FAF7F2] hover:text-[#1F150C]'
                                        }`}
                                    >
                                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#E1DCC9]' : 'text-[#8F7554]'}`} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tab Panels */}
                    <div className="md:col-span-3 space-y-6 min-w-0">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <Card className="border border-[#E1DCC9] shadow-subtle">
                                    <CardHeader>
                                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#1F150C]">
                                            <User className="h-4 w-4 text-[#412D15]" />
                                            <span>Bio & Contact Information</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                                            <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E1DCC9]/70 space-y-1">
                                                <span className="text-[#8F7554] font-medium text-[11px]">Email Address</span>
                                                <p className="font-bold text-[#1F150C] flex items-center gap-1.5 mt-0.5 truncate">
                                                    <Mail className="h-3.5 w-3.5 text-[#412D15] shrink-0" />
                                                    <span className="truncate">{profile?.user?.email}</span>
                                                </p>
                                            </div>
                                            <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E1DCC9]/70 space-y-1">
                                                <span className="text-[#8F7554] font-medium text-[11px]">Roll / Registration Number</span>
                                                <p className="font-bold text-[#1F150C] flex items-center gap-1.5 mt-0.5">
                                                    <Shield className="h-3.5 w-3.5 text-[#412D15] shrink-0" />
                                                    <span>{profile?.rollNumber || 'Not configured'}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 pt-2 border-t border-[#E1DCC9]/50">
                                            <span className="text-xs font-bold text-[#412D15]">Professional Handles</span>
                                            <div className="flex flex-wrap gap-2.5 sm:gap-3 text-xs">
                                                {profile?.githubProfile ? (
                                                    <a
                                                        href={profile.githubProfile}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E1DCC9] text-[#1F150C] font-semibold hover:border-[#412D15] transition-colors"
                                                    >
                                                        <Github className="h-3.5 w-3.5 text-[#1F150C]" />
                                                        <span>GitHub Profile</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-[#8F7554] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2]/60 border border-[#E1DCC9]/50">
                                                        <Github className="h-3.5 w-3.5 opacity-50" />
                                                        <span>GitHub not linked</span>
                                                    </span>
                                                )}
                                                {profile?.linkedinProfile ? (
                                                    <a
                                                        href={profile.linkedinProfile}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E1DCC9] text-[#1F150C] font-semibold hover:border-[#412D15] transition-colors"
                                                    >
                                                        <Linkedin className="h-3.5 w-3.5 text-blue-700" />
                                                        <span>LinkedIn Profile</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-[#8F7554] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2]/60 border border-[#E1DCC9]/50">
                                                        <Linkedin className="h-3.5 w-3.5 opacity-50" />
                                                        <span>LinkedIn not linked</span>
                                                    </span>
                                                )}
                                                {profile?.portfolioUrl ? (
                                                    <a
                                                        href={profile.portfolioUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E1DCC9] text-[#1F150C] font-semibold hover:border-[#412D15] transition-colors"
                                                    >
                                                        <Globe className="h-3.5 w-3.5 text-[#412D15]" />
                                                        <span>Personal Portfolio</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-[#8F7554] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2]/60 border border-[#E1DCC9]/50">
                                                        <Globe className="h-3.5 w-3.5 opacity-50" />
                                                        <span>Portfolio not linked</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Card className="border border-[#E1DCC9] shadow-subtle">
                                        <CardHeader>
                                            <CardTitle className="text-xs font-bold text-[#6B5336] uppercase tracking-wider">
                                                Academic Overview
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-[#6B5336]">Cumulative GPA:</span>
                                                <span className="font-bold text-[#1F150C] text-sm">
                                                    {profile?.cgpa ? Number(profile.cgpa).toFixed(2) : '0.00'} / 10.0
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-[#6B5336]">Current Semester:</span>
                                                <span className="font-bold text-[#1F150C]">
                                                    Semester {profile?.semester || 1}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-[#6B5336]">Placement Readiness:</span>
                                                <span className="font-bold text-[#412D15]">
                                                    {profile?.placementReadinessScore || 0}%
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border border-[#E1DCC9] shadow-subtle">
                                        <CardHeader>
                                            <CardTitle className="text-xs font-bold text-[#6B5336] uppercase tracking-wider">
                                                Top Declared Skills
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex flex-wrap gap-1.5">
                                            {profile?.skills && profile.skills.length > 0 ? (
                                                profile.skills.slice(0, 8).map((s) => (
                                                    <Badge
                                                        key={s.name}
                                                        variant={s.verified ? 'success' : 'secondary'}
                                                        className="text-[10px]"
                                                    >
                                                        {s.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <p className="text-xs text-[#8F7554] italic">
                                                    No skills registered yet.
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {activeTab === 'academic' && (
                            <Card className="border border-[#E1DCC9] shadow-subtle">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#1F150C]">
                                        <GraduationCap className="h-4 w-4 text-[#412D15]" />
                                        <span>Academic Transcript & Summary</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 text-center">
                                        <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E1DCC9]/70 space-y-1">
                                            <span className="text-xs text-[#8F7554] font-medium">Cumulative GPA</span>
                                            <p className="text-2xl font-black text-[#1F150C]">
                                                {profile?.cgpa ? Number(profile.cgpa).toFixed(2) : '0.00'}/10
                                            </p>
                                        </div>
                                        <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E1DCC9]/70 space-y-1">
                                            <span className="text-xs text-[#8F7554] font-medium">Current Semester</span>
                                            <p className="text-2xl font-black text-[#1F150C]">
                                                Sem {profile?.semester || 1}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E1DCC9]/70 space-y-1">
                                            <span className="text-xs text-[#8F7554] font-medium">Completed Semesters</span>
                                            <p className="text-2xl font-black text-[#1F150C]">
                                                {Math.max(0, (profile?.semester || 1) - 1)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="border-t border-[#E1DCC9]/70 pt-4 space-y-2.5">
                                        <h3 className="text-xs font-bold text-[#412D15] uppercase tracking-wider">
                                            Performance Criteria & Placement Status
                                        </h3>
                                        <div className="space-y-2 text-xs text-[#6B5336] leading-relaxed">
                                            <p>• Verified eligibility for placement drives requires GPA ≥ 6.5 and no active backlogs.</p>
                                            <p>
                                                • Academic Standing:{' '}
                                                <span className="font-bold text-emerald-700">IN GOOD STANDING</span>.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'skills' && (
                            <Card className="border border-[#E1DCC9] shadow-subtle">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#1F150C]">
                                        <BookOpen className="h-4 w-4 text-[#412D15]" />
                                        <span>Skills Inventory ({profile?.skills?.length || 0})</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {profile?.skills && profile.skills.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            {profile.skills.map((s) => (
                                                <div
                                                    key={s.name}
                                                    className="p-3.5 bg-[#FAF7F2] border border-[#E1DCC9] rounded-xl flex items-center justify-between gap-3 text-xs"
                                                >
                                                    <div className="space-y-0.5">
                                                        <span className="text-xs font-bold text-[#1F150C] block">
                                                            {s.name}
                                                        </span>
                                                        <span className="text-[10px] font-semibold text-[#8F7554] uppercase tracking-wider block">
                                                            {s.proficiency}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        {s.verified ? (
                                                            <Badge variant="success" className="text-[10px] flex gap-1 items-center">
                                                                <CheckCircle className="h-3 w-3" />
                                                                <span>Verified</span>
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="text-[10px]">
                                                                Self-Declared
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-[#8F7554] text-xs italic">
                                            No skills declared yet. Click Edit Profile to add skills.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'projects' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <h2 className="text-sm font-bold text-[#1F150C] flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-[#412D15]" />
                                        <span>Featured Projects ({profile?.projects?.length || 0})</span>
                                    </h2>
                                </div>
                                {profile?.projects && profile.projects.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {profile.projects.map((p, idx) => (
                                            <Card key={idx} className="border border-[#E1DCC9] shadow-subtle">
                                                <CardContent className="p-4 sm:p-5 space-y-3">
                                                    <div className="space-y-1">
                                                        <h3 className="font-bold text-[#1F150C] text-sm leading-snug">
                                                            {p.title}
                                                        </h3>
                                                        <p className="text-xs text-[#6B5336] leading-relaxed">
                                                            {p.description}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {p.technologies?.map((t) => (
                                                            <Badge key={t} variant="secondary" className="text-[10px]">
                                                                {t}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 pt-2 border-t border-[#E1DCC9]/50 text-xs font-semibold">
                                                        {p.githubUrl && (
                                                            <a
                                                                href={p.githubUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1.5 text-[#1F150C] hover:underline"
                                                            >
                                                                <Github className="h-3.5 w-3.5 text-[#412D15]" />
                                                                <span>View Source</span>
                                                            </a>
                                                        )}
                                                        {p.demoUrl && (
                                                            <a
                                                                href={p.demoUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1.5 text-[#412D15] hover:underline"
                                                            >
                                                                <Globe className="h-3.5 w-3.5" />
                                                                <span>Live Demo</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Card className="text-center p-8 border border-[#E1DCC9] shadow-subtle">
                                        <CardContent className="space-y-2">
                                            <Briefcase className="h-8 w-8 mx-auto text-[#C9BF9F]" />
                                            <p className="text-[#8F7554] text-xs italic">
                                                No projects registered yet.
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}

                        {activeTab === 'certifications' && (
                            <Card className="border border-[#E1DCC9] shadow-subtle">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#1F150C]">
                                        <Award className="h-4 w-4 text-[#412D15]" />
                                        <span>Certifications & Credentials ({profile?.certifications?.length || 0})</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {profile?.certifications && profile.certifications.length > 0 ? (
                                        <div className="space-y-3">
                                            {profile.certifications.map((c, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3.5 sm:p-4 bg-[#FAF7F2] border border-[#E1DCC9] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                                                >
                                                    <div className="space-y-0.5">
                                                        <h4 className="font-bold text-[#1F150C]">{c.name}</h4>
                                                        <p className="text-[#6B5336] font-medium">Issued by: {c.issuingOrg}</p>
                                                        <p className="text-[10px] text-[#8F7554]">
                                                            Date: {c.issueDate ? new Date(c.issueDate).toLocaleDateString() : 'N/A'}
                                                        </p>
                                                    </div>
                                                    {c.credentialUrl && (
                                                        <a
                                                            href={c.credentialUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-xs text-[#1F150C] hover:underline font-bold self-start sm:self-center"
                                                        >
                                                            <LinkIcon className="h-3.5 w-3.5 text-[#412D15]" />
                                                            <span>Verify Credential</span>
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-[#8F7554] text-xs italic">
                                            No certifications added yet. Click Edit Profile to add credentials.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'career' && (
                            <div className="space-y-6">
                                <Card className="border border-[#E1DCC9] shadow-subtle">
                                    <CardHeader>
                                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#1F150C]">
                                            <Award className="h-4 w-4 text-[#412D15]" />
                                            <span>Target Career Alignments</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-xs">
                                        <div className="space-y-2.5">
                                            <h3 className="font-bold text-[#412D15] uppercase tracking-wider text-[11px]">
                                                Career Interests
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {profile?.careerInterests && profile.careerInterests.length > 0 ? (
                                                    profile.careerInterests.map((interest) => (
                                                        <Badge key={interest} variant="secondary">
                                                            {interest}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-[#8F7554] italic">No career interests set.</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="border-t border-[#E1DCC9]/70 pt-4 space-y-2.5">
                                            <h3 className="font-bold text-[#412D15] uppercase tracking-wider text-[11px]">
                                                Professional Goals
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {profile?.careerGoals && profile.careerGoals.length > 0 ? (
                                                    profile.careerGoals.map((goal) => (
                                                        <Badge key={goal} variant="default">
                                                            {goal}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-[#8F7554] italic">No career goals set.</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* EDIT PROFILE MODAL: Isolated outside container to prevent space-y margin bleed */}
            {isEditing && (
                <div
                    className="fixed inset-0 !m-0 m-0 z-50 bg-[#000000]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="bg-white border border-[#E1DCC9] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
                        {/* Modal Header */}
                        <div className="px-5 sm:px-6 py-4 border-b border-[#E1DCC9] flex items-center justify-between bg-[#FAF7F2]">
                            <h2 className="font-bold text-[#1F150C] text-sm flex items-center gap-2">
                                <Edit2 className="h-4 w-4 text-[#412D15]" />
                                <span>Edit Student Profile Context</span>
                            </h2>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-1 -mr-1 rounded-lg text-[#8F7554] hover:text-[#1F150C] hover:bg-[#E1DCC9]/40 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                                aria-label="Close dialog"
                            >
                                <X className="h-4 w-4" />
                                <span className="hidden sm:inline">Close</span>
                            </button>
                        </div>

                        {/* Modal Tabs Bar */}
                        <div className="flex border-b border-[#E1DCC9] overflow-x-auto text-xs font-bold bg-[#FAF7F2]/60 scrollbar-none shrink-0">
                            {[
                                { id: 'personal', label: 'Personal & Handles' },
                                { id: 'academic', label: 'Academic Context' },
                                { id: 'skills', label: 'Skills Inventory' },
                                { id: 'projects', label: 'Featured Projects' },
                                { id: 'certifications', label: 'Certifications' },
                                { id: 'career', label: 'Career Interests' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setEditTab(tab.id)}
                                    className={`px-4 py-3 shrink-0 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                                        editTab === tab.id
                                            ? 'border-[#1F150C] text-[#1F150C] font-black bg-white'
                                            : 'border-transparent text-[#6B5336] hover:text-[#1F150C]'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Modal Scrollable Body */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
                            {modalError && (
                                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex gap-2.5 items-center">
                                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                                    <span className="font-semibold">{modalError}</span>
                                </div>
                            )}

                            {editTab === 'personal' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-[#6B5336] mb-1.5 tracking-wider">
                                                Registration / Roll Number
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.rollNumber}
                                                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                                                className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 bg-white text-[#1F150C]"
                                                placeholder="e.g. 24IT1056"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-[#6B5336] mb-1.5 tracking-wider">
                                                Resume Document / PDF URL
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.resumeUrl}
                                                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                                                className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 bg-white text-[#1F150C]"
                                                placeholder="https://example.com/resume.pdf"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-[#6B5336] mb-1.5 tracking-wider">
                                                GitHub Profile URL
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.githubProfile}
                                                onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
                                                className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 bg-white text-[#1F150C]"
                                                placeholder="https://github.com/username"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-[#6B5336] mb-1.5 tracking-wider">
                                                LinkedIn Profile URL
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.linkedinProfile}
                                                onChange={(e) => setFormData({ ...formData, linkedinProfile: e.target.value })}
                                                className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 bg-white text-[#1F150C]"
                                                placeholder="https://linkedin.com/in/username"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-[10px] font-bold uppercase text-[#6B5336] mb-1.5 tracking-wider">
                                                Portfolio / Website URL
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.portfolioUrl}
                                                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                                className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 bg-white text-[#1F150C]"
                                                placeholder="https://username.dev"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {editTab === 'academic' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-[#6B5336] mb-1.5 tracking-wider">
                                                Cumulative GPA (Out of 10.0)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="10"
                                                value={formData.cgpa}
                                                onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                                                className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 bg-white text-[#1F150C]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-[#6B5336] mb-1.5 tracking-wider">
                                                Current Semester
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="8"
                                                value={formData.semester}
                                                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                                                className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] focus:ring-2 focus:ring-[#412D15]/10 bg-white text-[#1F150C]"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {editTab === 'skills' && (
                                <div className="space-y-4">
                                    <div className="p-4 border border-[#E1DCC9] bg-[#FAF7F2] rounded-xl flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                                        <div className="flex-1 w-full">
                                            <label className="block text-[10px] font-bold uppercase text-[#6B5336] mb-1 tracking-wider">
                                                Skill Name
                                            </label>
                                            <input
                                                type="text"
                                                value={newSkillName}
                                                onChange={(e) => setNewSkillName(e.target.value)}
                                                placeholder="e.g. React.js, Python, System Design"
                                                className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] bg-white text-[#1F150C]"
                                            />
                                        </div>
                                        <div className="w-full sm:w-44">
                                            <label className="block text-[10px] font-bold uppercase text-[#6B5336] mb-1 tracking-wider">
                                                Proficiency
                                            </label>
                                            <select
                                                value={newSkillProficiency}
                                                onChange={(e) => setNewSkillProficiency(e.target.value)}
                                                className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] bg-white font-medium text-[#1F150C]"
                                            >
                                                <option value="BEGINNER">BEGINNER</option>
                                                <option value="INTERMEDIATE">INTERMEDIATE</option>
                                                <option value="ADVANCED">ADVANCED</option>
                                                <option value="EXPERT">EXPERT</option>
                                            </select>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={addSkill}
                                            variant="primary"
                                            className="px-4 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0"
                                        >
                                            <Plus className="h-4 w-4" />
                                            <span>Add Skill</span>
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="block text-[10px] font-bold uppercase text-[#6B5336] tracking-wider">
                                            Registered Skills
                                        </span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {formData.skills.map((s, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-2.5 border border-[#E1DCC9] rounded-xl flex items-center justify-between bg-white text-xs"
                                                >
                                                    <div>
                                                        <span className="font-bold text-[#1F150C]">{s.name}</span>
                                                        <span className="text-[10px] uppercase font-semibold text-[#8F7554] ml-2">
                                                            ({s.proficiency})
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(idx)}
                                                        className="text-rose-600 hover:text-rose-800 p-1 transition-colors cursor-pointer"
                                                        aria-label="Remove skill"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {editTab === 'projects' && (
                                <div className="space-y-4">
                                    <div className="p-4 border border-[#E1DCC9] bg-[#FAF7F2] rounded-xl space-y-3">
                                        <span className="block text-[10px] font-bold uppercase text-[#412D15] tracking-wider">
                                            Add Featured Project
                                        </span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#6B5336] mb-1">
                                                    Project Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newProject.title}
                                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                                    placeholder="e.g. Distributed Task Orchestrator"
                                                    className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] bg-white text-[#1F150C]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#6B5336] mb-1">
                                                    Technologies (Comma separated)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newProject.technologies}
                                                    onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                                                    placeholder="e.g. React, Node.js, Docker, Redis"
                                                    className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] bg-white text-[#1F150C]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#6B5336] mb-1">
                                                    GitHub Repository URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={newProject.githubUrl}
                                                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                                                    placeholder="https://github.com/..."
                                                    className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] bg-white text-[#1F150C]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#6B5336] mb-1">
                                                    Live Demo URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={newProject.demoUrl}
                                                    onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                                                    placeholder="https://..."
                                                    className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] bg-white text-[#1F150C]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-semibold text-[#6B5336] mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                value={newProject.description}
                                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                                placeholder="Brief summary of architecture, functions and features..."
                                                rows={2}
                                                className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] bg-white text-[#1F150C]"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                type="button"
                                                onClick={addProject}
                                                variant="primary"
                                                size="sm"
                                                className="text-xs px-4 py-2"
                                            >
                                                Add Project
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="block text-[10px] font-bold uppercase text-[#6B5336] tracking-wider">
                                            Projects List ({formData.projects.length})
                                        </span>
                                        <div className="space-y-2">
                                            {formData.projects.map((p, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3 border border-[#E1DCC9] rounded-xl bg-white flex items-start justify-between gap-3 text-xs"
                                                >
                                                    <div className="space-y-1">
                                                        <span className="font-bold text-[#1F150C] block">{p.title}</span>
                                                        <p className="text-[11px] text-[#6B5336] leading-snug">{p.description}</p>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {p.technologies?.map((t) => (
                                                                <Badge key={t} variant="secondary" className="text-[9px]">
                                                                    {t}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProject(idx)}
                                                        className="text-rose-600 hover:text-rose-800 p-1 shrink-0 cursor-pointer"
                                                        aria-label="Remove project"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {editTab === 'certifications' && (
                                <div className="space-y-4">
                                    <div className="p-4 border border-[#E1DCC9] bg-[#FAF7F2] rounded-xl space-y-3">
                                        <span className="block text-[10px] font-bold uppercase text-[#412D15] tracking-wider">
                                            Add Certification
                                        </span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#6B5336] mb-1">
                                                    Certificate Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newCert.name}
                                                    onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                                                    placeholder="e.g. AWS Certified Developer"
                                                    className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] bg-white text-[#1F150C]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#6B5336] mb-1">
                                                    Issuing Authority
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newCert.issuingOrg}
                                                    onChange={(e) => setNewCert({ ...newCert, issuingOrg: e.target.value })}
                                                    placeholder="e.g. Amazon Web Services"
                                                    className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] bg-white text-[#1F150C]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#6B5336] mb-1">
                                                    Issue Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={newCert.issueDate}
                                                    onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                                                    className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] bg-white text-[#1F150C]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#6B5336] mb-1">
                                                    Credential URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={newCert.credentialUrl}
                                                    onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                                                    placeholder="https://..."
                                                    className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] bg-white text-[#1F150C]"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                type="button"
                                                onClick={addCertification}
                                                variant="primary"
                                                size="sm"
                                                className="text-xs px-4 py-2"
                                            >
                                                Add Certification
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="block text-[10px] font-bold uppercase text-[#6B5336] tracking-wider">
                                            Certifications ({formData.certifications.length})
                                        </span>
                                        <div className="space-y-2">
                                            {formData.certifications.map((c, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3 border border-[#E1DCC9] rounded-xl bg-white flex items-center justify-between gap-3 text-xs"
                                                >
                                                    <div className="space-y-0.5">
                                                        <span className="font-bold text-[#1F150C] block">{c.name}</span>
                                                        <span className="text-[10px] text-[#6B5336]">{c.issuingOrg}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCertification(idx)}
                                                        className="text-rose-600 hover:text-rose-800 p-1 shrink-0 cursor-pointer"
                                                        aria-label="Remove certification"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {editTab === 'career' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-[#6B5336] mb-1.5 tracking-wider">
                                            Career Interests (Comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.careerInterests.join(', ')}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    careerInterests: e.target.value
                                                        .split(',')
                                                        .map((s) => s.trim())
                                                        .filter(Boolean)
                                                })
                                            }
                                            className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] bg-white text-[#1F150C]"
                                            placeholder="e.g. Full-Stack Engineer, AI Engineer, Cloud Architect"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase text-[#6B5336] mb-1.5 tracking-wider">
                                            Professional Goals (Comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.careerGoals.join(', ')}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    careerGoals: e.target.value
                                                        .split(',')
                                                        .map((s) => s.trim())
                                                        .filter(Boolean)
                                                })
                                            }
                                            className="w-full text-xs border border-[#E1DCC9] rounded-xl p-2.5 outline-none focus:border-[#412D15] bg-white text-[#1F150C]"
                                            placeholder="e.g. Master Distributed Systems, Clear Google Cloud Professional certification"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer with CLEAR, READABLE CANCEL BUTTON */}
                        <div className="px-5 sm:px-6 py-3.5 border-t border-[#E1DCC9] flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 bg-[#FAF7F2]">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsEditing(false)}
                                className="w-full sm:w-auto text-xs px-5 py-2 font-bold border border-[#E1DCC9] text-[#1F150C] hover:bg-[#F4EFE6]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleSave}
                                isLoading={saving}
                                className="w-full sm:w-auto text-xs px-6 py-2 font-bold"
                            >
                                Save All Changes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentProfile;
