import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  User,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Briefcase,
  AlertCircle,
  Mail,
  Shield,
  BookOpen
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'skills' | 'projects' | 'certifications' | 'career'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editTab, setEditTab] = useState<'personal' | 'academic' | 'skills' | 'projects' | 'certifications' | 'career'>('personal');

  // Form states
  const [formData, setFormData] = useState<any>({
    rollNumber: '',
    semester: 1,
    cgpa: 0,
    githubProfile: '',
    linkedinProfile: '',
    portfolioUrl: '',
    skills: [],
    projects: [],
    certifications: [],
    careerInterests: [],
    careerGoals: []
  });

  // Dynamic Skill input state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('BEGINNER');

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
        githubProfile: data.githubProfile || '',
        linkedinProfile: data.linkedinProfile || '',
        portfolioUrl: data.portfolioUrl || '',
        skills: data.skills || [],
        projects: data.projects || [],
        certifications: data.certifications || [],
        careerInterests: data.careerInterests || [],
        careerGoals: data.careerGoals || []
      });
    } catch (err: any) {
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

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const payload = {
        rollNumber: formData.rollNumber,
        semester: Number(formData.semester),
        cgpa: Number(formData.cgpa),
        githubProfile: formData.githubProfile,
        linkedinProfile: formData.linkedinProfile,
        portfolioUrl: formData.portfolioUrl,
        skills: formData.skills.map((s: any) => ({ name: s.name, proficiency: s.proficiency })),
        projects: formData.projects,
        certifications: formData.certifications,
        careerInterests: formData.careerInterests,
        careerGoals: formData.careerGoals
      };

      await apiClient.put('/students/profile', payload);
      await fetchProfile();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to save student profile information.');
    } finally {
      setSaving(false);
    }
  };

  // Skill Handlers
  const addSkill = () => {
    if (!newSkillName.trim()) return;
    const name = newSkillName.trim();
    if (formData.skills.some((s: any) => s.name.toLowerCase() === name.toLowerCase())) {
      setNewSkillName('');
      return;
    }
    setFormData({
      ...formData,
      skills: [...formData.skills, { name, proficiency: newSkillProficiency, verified: false }]
    });
    setNewSkillName('');
  };

  const removeSkill = (index: number) => {
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

  const removeProject = (index: number) => {
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

  const removeCertification = (index: number) => {
    const updated = [...formData.certifications];
    updated.splice(index, 1);
    setFormData({ ...formData, certifications: updated });
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-40 bg-brand-100 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-48 bg-brand-100 rounded-xl md:col-span-1"></div>
          <div className="h-96 bg-brand-100 rounded-xl md:col-span-3"></div>
        </div>
      </div>
    );
  }

  const completionPercent = calculateCompletion();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* PROFILE HEADER CARD */}
      <div className="bg-white border border-brand-200/60 rounded-2xl shadow-sm overflow-hidden relative">
        <div className="h-24 bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-950 opacity-90 relative">
          <div className="absolute right-6 bottom-4 text-xs font-medium text-brand-300">
            Student ID: {profile?.rollNumber || 'Not set'}
          </div>
        </div>

        <div className="p-6 pt-0 flex flex-col md:flex-row md:items-end gap-6 relative -mt-10">
          {/* Avatar */}
          <div className="h-24 w-24 bg-brand-900 border-4 border-white text-white rounded-2xl flex items-center justify-center font-bold text-3xl shadow-md shrink-0">
            {profile?.user?.name ? profile.user.name.split(' ').map((n: any) => n[0]).join('').slice(0, 2).toUpperCase() : 'ST'}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-brand-900 leading-none">{profile?.user?.name}</h1>
                <p className="text-sm text-brand-500 mt-1 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-brand-400" />
                  <span>{profile?.department?.name || 'Department not initialized'}</span>
                  <span>•</span>
                  <span>B.Tech / Semester {profile?.semester}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 self-start md:self-end">
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="secondary" 
                  className="text-xs flex gap-2 border-brand-200 hover:border-brand-300"
                >
                  <Edit2 className="h-3.5 w-3.5 text-brand-600" />
                  <span>Edit Profile</span>
                </Button>
              </div>
            </div>

            {/* Profile Completion Bar */}
            <div className="pt-3 flex items-center gap-3">
              <div className="flex-1 bg-brand-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-500" 
                  style={{ width: `${completionPercent}%` }}
                ></div>
              </div>
              <span className="text-xs font-semibold text-brand-700 whitespace-nowrap">
                {completionPercent}% Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* TABS LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 bg-white border border-brand-200/60 rounded-xl p-3 shadow-sm space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Profile Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'academic' ? 'bg-indigo-50 text-indigo-700' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Academic Performance</span>
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'skills' ? 'bg-indigo-50 text-indigo-700' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Verified Skills</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'projects' ? 'bg-indigo-50 text-indigo-700' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Featured Projects</span>
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'certifications' ? 'bg-indigo-50 text-indigo-700' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Certifications</span>
          </button>
          <button
            onClick={() => setActiveTab('career')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'career' ? 'bg-indigo-50 text-indigo-700' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Career Goals</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="md:col-span-3 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* About Box */}
              <Card className="border border-brand-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-900">
                    <User className="h-4 w-4 text-brand-500" />
                    <span>Bio & Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-brand-50/50 rounded-lg space-y-1">
                      <span className="text-brand-400 font-medium">Email Address</span>
                      <p className="font-semibold text-brand-900 flex items-center gap-1.5 mt-0.5">
                        <Mail className="h-3.5 w-3.5 text-brand-500" />
                        {profile?.user?.email}
                      </p>
                    </div>

                    <div className="p-3 bg-brand-50/50 rounded-lg space-y-1">
                      <span className="text-brand-400 font-medium">Roll / Registration Number</span>
                      <p className="font-semibold text-brand-900 flex items-center gap-1.5 mt-0.5">
                        <Shield className="h-3.5 w-3.5 text-brand-500" />
                        {profile?.rollNumber || 'Not configured'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-brand-500">Professional Handles</span>
                    <div className="flex flex-wrap gap-3">
                      {profile?.githubProfile ? (
                        <a href={profile.githubProfile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline">
                          <Github className="h-4 w-4" />
                          <span>GitHub</span>
                        </a>
                      ) : (
                        <span className="text-xs text-brand-400 flex items-center gap-1.5">
                          <Github className="h-4 w-4" /> Github not linked
                        </span>
                      )}

                      {profile?.linkedinProfile ? (
                        <a href={profile.linkedinProfile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline">
                          <Linkedin className="h-4 w-4" />
                          <span>LinkedIn</span>
                        </a>
                      ) : (
                        <span className="text-xs text-brand-400 flex items-center gap-1.5">
                          <Linkedin className="h-4 w-4" /> LinkedIn not linked
                        </span>
                      )}

                      {profile?.portfolioUrl ? (
                        <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline">
                          <Globe className="h-4 w-4" />
                          <span>Portfolio</span>
                        </a>
                      ) : (
                        <span className="text-xs text-brand-400 flex items-center gap-1.5">
                          <Globe className="h-4 w-4" /> Portfolio not linked
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Snapshot Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Academic Summary */}
                <Card className="border border-brand-200/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider">Academic Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-brand-500">Cumulative GPA:</span>
                      <span className="font-bold text-brand-900">{profile?.cgpa || '0.00'}/10.0</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-brand-500">Current Semester:</span>
                      <span className="font-bold text-brand-900">Semester {profile?.semester || 1}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-brand-500">Placement Readiness Score:</span>
                      <span className="font-bold text-indigo-600">{profile?.placementReadinessScore || 0}%</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Summary */}
                <Card className="border border-brand-200/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider">Top Declared Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-1.5">
                    {profile?.skills && profile.skills.length > 0 ? (
                      profile.skills.slice(0, 8).map((s: any) => (
                        <Badge key={s.name} variant={s.verified ? 'success' : 'default'} className="text-[10px]">
                          {s.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-brand-400 italic">No skills registered yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC */}
          {activeTab === 'academic' && (
            <Card className="border border-brand-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-900">
                  <GraduationCap className="h-4 w-4 text-brand-500" />
                  <span>Academic Transcript & Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-brand-50/50 rounded-xl space-y-1">
                    <span className="text-xs text-brand-400 font-medium">Cumulative GPA</span>
                    <p className="text-2xl font-extrabold text-brand-900">{profile?.cgpa || '0.00'}/10</p>
                  </div>
                  <div className="p-4 bg-brand-50/50 rounded-xl space-y-1">
                    <span className="text-xs text-brand-400 font-medium">Current Semester</span>
                    <p className="text-2xl font-extrabold text-brand-900">Sem {profile?.semester || 1}</p>
                  </div>
                  <div className="p-4 bg-brand-50/50 rounded-xl space-y-1">
                    <span className="text-xs text-brand-400 font-medium">Completed Semesters</span>
                    <p className="text-2xl font-extrabold text-brand-900">{(profile?.semester || 1) - 1}</p>
                  </div>
                </div>

                <div className="border-t border-brand-100 pt-4 space-y-3">
                  <h3 className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Performance Audit Criteria</h3>
                  <div className="space-y-2.5 text-xs text-brand-600">
                    <p>• Verified eligibility for placement drives requires GPA &ge; 6.5 and no active backlogs.</p>
                    <p>• Student current academic status: <span className="font-bold text-green-600">IN GOOD STANDING</span>.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: SKILLS */}
          {activeTab === 'skills' && (
            <Card className="border border-brand-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-900">
                  <BookOpen className="h-4 w-4 text-brand-500" />
                  <span>Skills Inventory ({profile?.skills?.length || 0})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.skills && profile.skills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.skills.map((s: any) => (
                      <div key={s.name} className="p-3 bg-brand-50/50 border border-brand-100 rounded-xl flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-brand-900 block">{s.name}</span>
                          <span className="text-[10px] font-semibold text-brand-400 uppercase tracking-wider block">{s.proficiency}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {s.verified ? (
                            <Badge variant="success" className="text-[10px] flex gap-1 items-center">
                              <CheckCircle className="h-3 w-3" />
                              <span>Verified</span>
                            </Badge>
                          ) : (
                            <Badge variant="default" className="text-[10px]">
                              Self-Declared
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-brand-400 text-xs italic">
                    No skills declared yet. Click Edit Profile to add skills.
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-sm font-bold text-brand-900 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-brand-500" />
                  <span>Featured Projects ({profile?.projects?.length || 0})</span>
                </h2>
              </div>

              {profile?.projects && profile.projects.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {profile.projects.map((p: any, idx: number) => (
                    <Card key={idx} className="border border-brand-200/60 shadow-sm">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <h3 className="font-bold text-brand-950 text-sm leading-snug">{p.title}</h3>
                            <p className="text-xs text-brand-600 leading-relaxed">{p.description}</p>
                          </div>
                        </div>

                        {/* Tech pills */}
                        <div className="flex flex-wrap gap-1.5">
                          {p.technologies.map((t: string) => (
                            <Badge key={t} variant="secondary" className="text-[10px]">
                              {t}
                            </Badge>
                          ))}
                        </div>

                        {/* Links */}
                        <div className="flex gap-4 pt-2 border-t border-brand-100 text-xs font-semibold">
                          {p.githubUrl && (
                            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-600 hover:underline">
                              <Github className="h-4 w-4 text-brand-500" />
                              <span>View Source</span>
                            </a>
                          )}
                          {p.demoUrl && (
                            <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-600 hover:underline">
                              <Globe className="h-4 w-4 text-brand-500" />
                              <span>Live Demo</span>
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center p-8 border border-brand-200/60 shadow-sm">
                  <CardContent className="space-y-2">
                    <Briefcase className="h-8 w-8 mx-auto text-brand-300" />
                    <p className="text-brand-500 text-xs italic">No projects registered yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* TAB 5: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <Card className="border border-brand-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-900">
                  <Award className="h-4 w-4 text-brand-500" />
                  <span>Certifications & Credentials ({profile?.certifications?.length || 0})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.certifications && profile.certifications.length > 0 ? (
                  <div className="space-y-3">
                    {profile.certifications.map((c: any, idx: number) => (
                      <div key={idx} className="p-4 bg-brand-50/50 border border-brand-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                        <div className="space-y-1">
                          <h4 className="font-bold text-brand-900">{c.name}</h4>
                          <p className="text-brand-500 font-medium">Issued by: {c.issuingOrg}</p>
                          <p className="text-[10px] text-brand-400">Date: {new Date(c.issueDate).toLocaleDateString()}</p>
                        </div>
                        {c.credentialUrl && (
                          <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-semibold self-start sm:self-center">
                            <LinkIcon className="h-3.5 w-3.5" />
                            <span>Verify Credentials</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-brand-400 text-xs italic">
                    No certifications added yet. Click Edit Profile to add credentials.
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* TAB 6: CAREER GOALS */}
          {activeTab === 'career' && (
            <div className="space-y-6">
              <Card className="border border-brand-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-900">
                    <Award className="h-4 w-4 text-brand-500" />
                    <span>Target Career Alignments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-brand-500 uppercase tracking-wider">Career Interests</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {profile?.careerInterests && profile.careerInterests.length > 0 ? (
                        profile.careerInterests.map((interest: string) => (
                          <Badge key={interest} variant="secondary">
                            {interest}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-brand-400 italic">No career interests set.</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-brand-100 pt-4 space-y-3">
                    <h3 className="font-semibold text-brand-500 uppercase tracking-wider">Professional Goals</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {profile?.careerGoals && profile.careerGoals.length > 0 ? (
                        profile.careerGoals.map((goal: string) => (
                          <Badge key={goal} variant="default">
                            {goal}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-brand-400 italic">No career goals set.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL OVERLAY */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-brand-950/65 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-brand-200 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-brand-100 flex items-center justify-between bg-brand-50">
              <h2 className="font-bold text-brand-900 text-sm flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-brand-600" />
                <span>Edit Student Profile Context</span>
              </h2>
              <button 
                onClick={() => setIsEditing(false)} 
                className="text-brand-400 hover:text-brand-700 text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>

            {/* Edit Sub Navigation */}
            <div className="flex border-b border-brand-100 overflow-x-auto text-[11px] font-bold bg-brand-50/50">
              <button
                onClick={() => setEditTab('personal')}
                className={`px-4 py-3 shrink-0 transition-colors border-b-2 ${editTab === 'personal' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-brand-500 hover:text-brand-900'}`}
              >
                Personal & Handles
              </button>
              <button
                onClick={() => setEditTab('academic')}
                className={`px-4 py-3 shrink-0 transition-colors border-b-2 ${editTab === 'academic' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-brand-500 hover:text-brand-900'}`}
              >
                Academic Context
              </button>
              <button
                onClick={() => setEditTab('skills')}
                className={`px-4 py-3 shrink-0 transition-colors border-b-2 ${editTab === 'skills' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-brand-500 hover:text-brand-900'}`}
              >
                Skills Inventory
              </button>
              <button
                onClick={() => setEditTab('projects')}
                className={`px-4 py-3 shrink-0 transition-colors border-b-2 ${editTab === 'projects' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-brand-500 hover:text-brand-900'}`}
              >
                Featured Projects
              </button>
              <button
                onClick={() => setEditTab('certifications')}
                className={`px-4 py-3 shrink-0 transition-colors border-b-2 ${editTab === 'certifications' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-brand-500 hover:text-brand-900'}`}
              >
                Certifications
              </button>
              <button
                onClick={() => setEditTab('career')}
                className={`px-4 py-3 shrink-0 transition-colors border-b-2 ${editTab === 'career' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-brand-500 hover:text-brand-900'}`}
              >
                Career Interests
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {/* EDIT TAB 1: PERSONAL */}
              {editTab === 'personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider">Registration / Roll Number</label>
                      <input
                        type="text"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                        placeholder="e.g. 24IT1056"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider">GitHub Profile URL</label>
                      <input
                        type="url"
                        value={formData.githubProfile}
                        onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider">LinkedIn Profile URL</label>
                      <input
                        type="url"
                        value={formData.linkedinProfile}
                        onChange={(e) => setFormData({ ...formData, linkedinProfile: e.target.value })}
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider">Portfolio / Website URL</label>
                      <input
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                        placeholder="https://username.dev"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* EDIT TAB 2: ACADEMIC */}
              {editTab === 'academic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider">Cumulative GPA (Out of 10.0)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={formData.cgpa}
                        onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider">Current Semester</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* EDIT TAB 3: SKILLS */}
              {editTab === 'skills' && (
                <div className="space-y-4">
                  {/* Skill Add Input */}
                  <div className="p-4 border border-brand-100 bg-brand-50/50 rounded-xl flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1 tracking-wider">Skill Name</label>
                      <input
                        type="text"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        placeholder="e.g. React"
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                      />
                    </div>
                    <div className="w-full sm:w-44">
                      <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1 tracking-wider">Proficiency</label>
                      <select
                        value={newSkillProficiency}
                        onChange={(e: any) => setNewSkillProficiency(e.target.value)}
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white font-medium text-brand-800"
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
                      className="px-4 py-2.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex gap-1.5 shrink-0"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>

                  {/* Registered Skills Grid */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold uppercase text-brand-500 tracking-wider">Skills List</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {formData.skills.map((s: any, idx: number) => (
                        <div key={idx} className="p-2 border border-brand-100 rounded-lg flex items-center justify-between bg-white text-xs">
                          <div>
                            <span className="font-semibold text-brand-800">{s.name}</span>
                            <span className="text-[9px] uppercase font-bold text-brand-400 ml-2">({s.proficiency})</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeSkill(idx)} 
                            className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* EDIT TAB 4: PROJECTS */}
              {editTab === 'projects' && (
                <div className="space-y-4">
                  {/* Project Input Form */}
                  <div className="p-4 border border-brand-100 bg-brand-50/50 rounded-xl space-y-3">
                    <span className="block text-[10px] font-bold uppercase text-brand-500 tracking-wider">Add Featured Project</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-semibold text-brand-600 mb-1">Project Title</label>
                        <input
                          type="text"
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          placeholder="e.g. Campus Management SaaS"
                          className="w-full text-xs border border-brand-200 rounded-lg p-2 outline-none focus:border-indigo-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-semibold text-brand-600 mb-1">Technologies (Comma separated)</label>
                        <input
                          type="text"
                          value={newProject.technologies}
                          onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                          placeholder="e.g. React, Node.js, MongoDB"
                          className="w-full text-xs border border-brand-200 rounded-lg p-2 outline-none focus:border-indigo-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-semibold text-brand-600 mb-1">GitHub Repo URL</label>
                        <input
                          type="url"
                          value={newProject.githubUrl}
                          onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full text-xs border border-brand-200 rounded-lg p-2 outline-none focus:border-indigo-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-semibold text-brand-600 mb-1">Live Demo URL</label>
                        <input
                          type="url"
                          value={newProject.demoUrl}
                          onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full text-xs border border-brand-200 rounded-lg p-2 outline-none focus:border-indigo-500 bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-brand-600 mb-1">Description</label>
                      <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Brief summary of functions and features..."
                        rows={2}
                        className="w-full text-xs border border-brand-200 rounded-lg p-2 outline-none focus:border-indigo-500 bg-white"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={addProject} 
                        className="px-4 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                      >
                        Add Project
                      </Button>
                    </div>
                  </div>

                  {/* Project List */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold uppercase text-brand-500 tracking-wider">Projects Added</span>
                    <div className="space-y-2">
                      {formData.projects.map((p: any, idx: number) => (
                        <div key={idx} className="p-3 border border-brand-100 rounded-xl bg-white flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="font-bold text-brand-900 block">{p.title}</span>
                            <p className="text-[11px] text-brand-500 leading-snug">{p.description}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.technologies.map((t: string) => (
                                <Badge key={t} variant="secondary" className="text-[8px]">{t}</Badge>
                              ))}
                            </div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeProject(idx)} 
                            className="text-red-500 hover:text-red-700 p-1 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* EDIT TAB 5: CERTIFICATIONS */}
              {editTab === 'certifications' && (
                <div className="space-y-4">
                  {/* Certification Input Form */}
                  <div className="p-4 border border-brand-100 bg-brand-50/50 rounded-xl space-y-3">
                    <span className="block text-[10px] font-bold uppercase text-brand-500 tracking-wider">Add Certification</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-semibold text-brand-600 mb-1">Certificate Title</label>
                        <input
                          type="text"
                          value={newCert.name}
                          onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                          placeholder="e.g. AWS Certified Solutions Architect"
                          className="w-full text-xs border border-brand-200 rounded-lg p-2 outline-none focus:border-indigo-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-semibold text-brand-600 mb-1">Issuing Authority</label>
                        <input
                          type="text"
                          value={newCert.issuingOrg}
                          onChange={(e) => setNewCert({ ...newCert, issuingOrg: e.target.value })}
                          placeholder="e.g. Amazon Web Services"
                          className="w-full text-xs border border-brand-200 rounded-lg p-2 outline-none focus:border-indigo-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-semibold text-brand-600 mb-1">Issue Date</label>
                        <input
                          type="date"
                          value={newCert.issueDate}
                          onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                          className="w-full text-xs border border-brand-200 rounded-lg p-2 outline-none focus:border-indigo-500 bg-white text-brand-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-semibold text-brand-600 mb-1">Credential URL</label>
                        <input
                          type="url"
                          value={newCert.credentialUrl}
                          onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full text-xs border border-brand-200 rounded-lg p-2 outline-none focus:border-indigo-500 bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={addCertification} 
                        className="px-4 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                      >
                        Add Certification
                      </Button>
                    </div>
                  </div>

                  {/* Certifications List */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold uppercase text-brand-500 tracking-wider">Certifications Added</span>
                    <div className="space-y-2">
                      {formData.certifications.map((c: any, idx: number) => (
                        <div key={idx} className="p-3 border border-brand-100 rounded-xl bg-white flex items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-brand-900 block">{c.name}</span>
                            <span className="text-[10px] text-brand-500">Issued by: {c.issuingOrg}</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeCertification(idx)} 
                            className="text-red-500 hover:text-red-700 p-1 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* EDIT TAB 6: CAREER INTERESTS */}
              {editTab === 'career' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider">Career Interests (Comma separated)</label>
                    <input
                      type="text"
                      value={formData.careerInterests.join(', ')}
                      onChange={(e) => setFormData({
                        ...formData,
                        careerInterests: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      })}
                      className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                      placeholder="e.g. Software Engineer, Backend Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider">Professional Goals (Comma separated)</label>
                    <input
                      type="text"
                      value={formData.careerGoals.join(', ')}
                      onChange={(e) => setFormData({
                        ...formData,
                        careerGoals: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      })}
                      className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                      placeholder="e.g. Master React Native, Pass AWS exam"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-brand-100 flex justify-end gap-3 bg-brand-50">
              <Button 
                onClick={() => setIsEditing(false)} 
                className="bg-brand-100 hover:bg-brand-200 text-brand-700 text-xs px-4 py-2 border-0"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                isLoading={saving} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-5 py-2"
              >
                Save All Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default StudentProfile;
