import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  BookOpen,
  Briefcase,
  Plus,
  Trash2,
  Github,
  Globe,
  Award,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const StudentSkillsProjects: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [skillSearch, setSkillSearch] = useState('');
  const [proficiencyFilter, setProficiencyFilter] = useState('');

  // Skill Dialog Fields
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('BEGINNER');

  // Project Dialog Fields
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    demoUrl: ''
  });

  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/students/profile');
      setProfile(res.data.data);
    } catch (err: any) {
      setError('Failed to load profile context details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const name = newSkillName.trim();
    
    // Avoid duplicates
    if ((profile?.skills || []).some((s: any) => s.name.toLowerCase() === name.toLowerCase())) {
      setNewSkillName('');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const updatedSkills = [...(profile?.skills || []), { name, proficiency: newSkillProficiency }];
      const res = await apiClient.put('/students/profile', {
        semester: profile?.semester || 1,
        cgpa: profile?.cgpa || 0.0,
        skills: updatedSkills
      });
      setProfile(res.data.data);
      setNewSkillName('');
    } catch (err: any) {
      setError('Failed to add skill.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (skillName: string) => {
    setError(null);
    try {
      const updatedSkills = (profile?.skills || []).filter((s: any) => s.name !== skillName);
      const res = await apiClient.put('/students/profile', {
        semester: profile?.semester || 1,
        cgpa: profile?.cgpa || 0.0,
        skills: updatedSkills
      });
      setProfile(res.data.data);
    } catch (err) {
      setError('Failed to remove skill.');
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const techs = newProject.technologies.split(',').map((t) => t.trim()).filter(Boolean);
      const updatedProjects = [
        ...(profile?.projects || []),
        {
          title: newProject.title.trim(),
          description: newProject.description.trim(),
          technologies: techs,
          githubUrl: newProject.githubUrl.trim(),
          demoUrl: newProject.demoUrl.trim()
        }
      ];

      const res = await apiClient.put('/students/profile', {
        semester: profile?.semester || 1,
        cgpa: profile?.cgpa || 0.0,
        projects: updatedProjects
      });
      setProfile(res.data.data);
      setNewProject({ title: '', description: '', technologies: '', githubUrl: '', demoUrl: '' });
    } catch (err) {
      setError('Failed to add project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (index: number) => {
    setError(null);
    try {
      const updatedProjects = [...(profile?.projects || [])];
      updatedProjects.splice(index, 1);
      const res = await apiClient.put('/students/profile', {
        semester: profile?.semester || 1,
        cgpa: profile?.cgpa || 0.0,
        projects: updatedProjects
      });
      setProfile(res.data.data);
    } catch (err) {
      setError('Failed to remove project.');
    }
  };

  // Filter skills
  const filteredSkills = (profile?.skills || []).filter((s: any) => {
    const matchesSearch = s.name.toLowerCase().includes(skillSearch.toLowerCase());
    const matchesProficiency = !proficiencyFilter || s.proficiency === proficiencyFilter;
    return matchesSearch && matchesProficiency;
  });

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="h-10 w-44 bg-brand-100 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-brand-100 rounded-xl"></div>
          <div className="h-80 bg-brand-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-xs">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-indigo-500" />
          <span>Skills & Project Center</span>
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Add technical competencies and document featured project repositories to build placement profiles.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Left Side: Skills Management (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Skill Card */}
          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-brand-900">Add Technical Skill</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSkill} className="space-y-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brand-500 mb-1 tracking-wider">Skill Name</label>
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g. JavaScript, Docker, SQL"
                    className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white text-brand-900 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brand-500 mb-1 tracking-wider">Proficiency Level</label>
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
                  type="submit"
                  isLoading={saving}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex gap-1.5 justify-center"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Skill</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Skills List Card */}
          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader className="pb-3 border-b border-brand-100">
              <div className="flex justify-between items-center gap-2">
                <CardTitle className="text-sm font-bold text-brand-900">Declared Skills</CardTitle>
                <div className="flex gap-1.5">
                  <div className="relative">
                    <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-brand-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      className="w-24 text-[10px] pl-6 pr-2 py-1.5 border border-brand-200 rounded-lg outline-none focus:border-indigo-500 bg-white"
                    />
                  </div>
                  <select
                    value={proficiencyFilter}
                    onChange={(e) => setProficiencyFilter(e.target.value)}
                    className="w-20 text-[10px] px-1 py-1 border border-brand-200 rounded-lg outline-none bg-white font-semibold text-brand-700"
                  >
                    <option value="">All</option>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermed</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              {filteredSkills.length === 0 ? (
                <p className="text-center py-6 text-brand-400 italic">No matching skills found.</p>
              ) : (
                <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                  {filteredSkills.map((s) => (
                    <div key={s.name} className="p-2 border border-brand-50 rounded-lg bg-brand-50/20 flex items-center justify-between gap-3 hover:bg-brand-50/50">
                      <div>
                        <span className="font-bold text-brand-900">{s.name}</span>
                        <span className="text-[9px] uppercase font-bold text-brand-400 ml-2 tracking-wider">
                          {s.proficiency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {s.verified ? (
                          <Badge variant="success" className="text-[8px] flex gap-0.5 items-center">
                            <CheckCircle2 className="h-3 w-3" /> Verified
                          </Badge>
                        ) : (
                          <Badge variant="default" className="text-[8px] bg-brand-100 text-brand-600">
                            Self-Declared
                          </Badge>
                        )}
                        <button
                          onClick={() => handleDeleteSkill(s.name)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Projects Management (Span 3) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Add Project Card */}
          <Card className="border border-brand-200/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-brand-900">Register Featured Project</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProject} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-brand-500 mb-1 tracking-wider">Project Title</label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="e.g. Portfolio Manager"
                      className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white text-brand-900 font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-brand-500 mb-1 tracking-wider">Technologies Used</label>
                    <input
                      type="text"
                      value={newProject.technologies}
                      onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                      placeholder="React, TypeScript, Tailwind"
                      className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-brand-500 mb-1 tracking-wider">GitHub URL</label>
                    <input
                      type="url"
                      value={newProject.githubUrl}
                      onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-brand-500 mb-1 tracking-wider">Live Demo URL</label>
                    <input
                      type="url"
                      value={newProject.demoUrl}
                      onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-brand-500 mb-1 tracking-wider">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Brief description of application features..."
                    rows={3}
                    className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    isLoading={saving}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  >
                    Register Project
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Project List Grid */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-brand-900">Featured Projects List</h2>
            {(profile?.projects || []).length === 0 ? (
              <Card className="text-center p-8 border border-brand-200/60 shadow-sm text-brand-400">
                <CardContent className="space-y-1">
                  <Briefcase className="h-7 w-7 mx-auto text-brand-300" />
                  <p className="italic">No projects added yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {(profile.projects || []).map((proj: any, idx: number) => (
                  <Card key={idx} className="border border-brand-200/60 shadow-sm transition-shadow hover:shadow-md">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h3 className="font-bold text-brand-900 text-sm">{proj.title}</h3>
                          <p className="text-brand-600 leading-relaxed">{proj.description}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteProject(idx)}
                          className="text-red-500 hover:text-red-750 p-1.5 transition-colors shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Tech badges */}
                      <div className="flex flex-wrap gap-1">
                        {proj.technologies.map((t: string) => (
                          <Badge key={t} variant="secondary" className="text-[9px]">
                            {t}
                          </Badge>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex gap-4 pt-2 border-t border-brand-100 text-xs font-semibold text-indigo-600">
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                            <Github className="h-4 w-4 text-brand-500" />
                            <span>GitHub Source</span>
                          </a>
                        )}
                        {proj.demoUrl && (
                          <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                            <Globe className="h-4 w-4 text-brand-500" />
                            <span>Live Application</span>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentSkillsProjects;
