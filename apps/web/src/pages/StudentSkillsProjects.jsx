import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { BookOpen, Briefcase, Plus, Trash2, Github, Globe, Search, CheckCircle2 } from 'lucide-react';
export const StudentSkillsProjects = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Search & Filter
    const [skillSearch, setSkillSearch] = useState('');
    const [proficiencyFilter, setProficiencyFilter] = useState('');
    // Skill Dialog Fields
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillProficiency, setNewSkillProficiency] = useState('BEGINNER');
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
        }
        catch (err) {
            setError('Failed to load profile context details.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!newSkillName.trim())
            return;
        const name = newSkillName.trim();
        // Avoid duplicates
        if ((profile?.skills || []).some((s) => s.name.toLowerCase() === name.toLowerCase())) {
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
        }
        catch (err) {
            setError('Failed to add skill.');
        }
        finally {
            setSaving(false);
        }
    };
    const handleDeleteSkill = async (skillName) => {
        setError(null);
        try {
            const updatedSkills = (profile?.skills || []).filter((s) => s.name !== skillName);
            const res = await apiClient.put('/students/profile', {
                semester: profile?.semester || 1,
                cgpa: profile?.cgpa || 0.0,
                skills: updatedSkills
            });
            setProfile(res.data.data);
        }
        catch (err) {
            setError('Failed to remove skill.');
        }
    };
    const handleAddProject = async (e) => {
        e.preventDefault();
        if (!newProject.title.trim())
            return;
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
        }
        catch (err) {
            setError('Failed to add project.');
        }
        finally {
            setSaving(false);
        }
    };
    const handleDeleteProject = async (index) => {
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
        }
        catch (err) {
            setError('Failed to remove project.');
        }
    };
    // Filter skills
    const filteredSkills = (profile?.skills || []).filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(skillSearch.toLowerCase());
        const matchesProficiency = !proficiencyFilter || s.proficiency === proficiencyFilter;
        return matchesSearch && matchesProficiency;
    });
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-5xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-10 w-44 bg-brand-100 rounded-lg" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx("div", { className: "h-80 bg-brand-100 rounded-xl" }), _jsx("div", { className: "h-80 bg-brand-100 rounded-xl" })] })] }));
    }
    return (_jsxs("div", { className: "space-y-6 max-w-5xl mx-auto text-xs", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-brand-900 flex items-center gap-2", children: [_jsx(BookOpen, { className: "h-6 w-6 text-indigo-500" }), _jsx("span", { children: "Skills & Project Center" })] }), _jsx("p", { className: "text-sm text-brand-500 mt-1", children: "Add technical competencies and document featured project repositories to build placement profiles." })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold rounded-lg", children: error })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-6 items-start", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs(Card, { className: "border border-brand-200/60 shadow-sm", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-bold text-brand-900", children: "Add Technical Skill" }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleAddSkill, className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[9px] font-bold uppercase text-brand-500 mb-1 tracking-wider", children: "Skill Name" }), _jsx("input", { type: "text", value: newSkillName, onChange: (e) => setNewSkillName(e.target.value), placeholder: "e.g. JavaScript, Docker, SQL", className: "w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white text-brand-900 font-semibold", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[9px] font-bold uppercase text-brand-500 mb-1 tracking-wider", children: "Proficiency Level" }), _jsxs("select", { value: newSkillProficiency, onChange: (e) => setNewSkillProficiency(e.target.value), className: "w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white font-medium text-brand-800", children: [_jsx("option", { value: "BEGINNER", children: "BEGINNER" }), _jsx("option", { value: "INTERMEDIATE", children: "INTERMEDIATE" }), _jsx("option", { value: "ADVANCED", children: "ADVANCED" }), _jsx("option", { value: "EXPERT", children: "EXPERT" })] })] }), _jsxs(Button, { type: "submit", isLoading: saving, className: "w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex gap-1.5 justify-center", children: [_jsx(Plus, { className: "h-4 w-4" }), _jsx("span", { children: "Add Skill" })] })] }) })] }), _jsxs(Card, { className: "border border-brand-200/60 shadow-sm", children: [_jsx(CardHeader, { className: "pb-3 border-b border-brand-100", children: _jsxs("div", { className: "flex justify-between items-center gap-2", children: [_jsx(CardTitle, { className: "text-sm font-bold text-brand-900", children: "Declared Skills" }), _jsxs("div", { className: "flex gap-1.5", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-2 top-2 h-3.5 w-3.5 text-brand-400" }), _jsx("input", { type: "text", placeholder: "Search...", value: skillSearch, onChange: (e) => setSkillSearch(e.target.value), className: "w-24 text-[10px] pl-6 pr-2 py-1.5 border border-brand-200 rounded-lg outline-none focus:border-indigo-500 bg-white" })] }), _jsxs("select", { value: proficiencyFilter, onChange: (e) => setProficiencyFilter(e.target.value), className: "w-20 text-[10px] px-1 py-1 border border-brand-200 rounded-lg outline-none bg-white font-semibold text-brand-700", children: [_jsx("option", { value: "", children: "All" }), _jsx("option", { value: "BEGINNER", children: "Beginner" }), _jsx("option", { value: "INTERMEDIATE", children: "Intermed" }), _jsx("option", { value: "ADVANCED", children: "Advanced" }), _jsx("option", { value: "EXPERT", children: "Expert" })] })] })] }) }), _jsx(CardContent, { className: "p-3", children: filteredSkills.length === 0 ? (_jsx("p", { className: "text-center py-6 text-brand-400 italic", children: "No matching skills found." })) : (_jsx("div", { className: "space-y-1.5 max-h-80 overflow-y-auto pr-1", children: filteredSkills.map((s) => (_jsxs("div", { className: "p-2 border border-brand-50 rounded-lg bg-brand-50/20 flex items-center justify-between gap-3 hover:bg-brand-50/50", children: [_jsxs("div", { children: [_jsx("span", { className: "font-bold text-brand-900", children: s.name }), _jsx("span", { className: "text-[9px] uppercase font-bold text-brand-400 ml-2 tracking-wider", children: s.proficiency })] }), _jsxs("div", { className: "flex items-center gap-2", children: [s.verified ? (_jsxs(Badge, { variant: "success", className: "text-[8px] flex gap-0.5 items-center", children: [_jsx(CheckCircle2, { className: "h-3 w-3" }), " Verified"] })) : (_jsx(Badge, { variant: "default", className: "text-[8px] bg-brand-100 text-brand-600", children: "Self-Declared" })), _jsx("button", { onClick: () => handleDeleteSkill(s.name), className: "text-red-500 hover:text-red-700 p-1 transition-colors shrink-0", children: _jsx(Trash2, { className: "h-3.5 w-3.5" }) })] })] }, s.name))) })) })] })] }), _jsxs("div", { className: "lg:col-span-3 space-y-6", children: [_jsxs(Card, { className: "border border-brand-200/60 shadow-sm", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-bold text-brand-900", children: "Register Featured Project" }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleAddProject, className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[9px] font-bold uppercase text-brand-500 mb-1 tracking-wider", children: "Project Title" }), _jsx("input", { type: "text", value: newProject.title, onChange: (e) => setNewProject({ ...newProject, title: e.target.value }), placeholder: "e.g. Portfolio Manager", className: "w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white text-brand-900 font-semibold", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[9px] font-bold uppercase text-brand-500 mb-1 tracking-wider", children: "Technologies Used" }), _jsx("input", { type: "text", value: newProject.technologies, onChange: (e) => setNewProject({ ...newProject, technologies: e.target.value }), placeholder: "React, TypeScript, Tailwind", className: "w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[9px] font-bold uppercase text-brand-500 mb-1 tracking-wider", children: "GitHub URL" }), _jsx("input", { type: "url", value: newProject.githubUrl, onChange: (e) => setNewProject({ ...newProject, githubUrl: e.target.value }), placeholder: "https://github.com/...", className: "w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[9px] font-bold uppercase text-brand-500 mb-1 tracking-wider", children: "Live Demo URL" }), _jsx("input", { type: "url", value: newProject.demoUrl, onChange: (e) => setNewProject({ ...newProject, demoUrl: e.target.value }), placeholder: "https://...", className: "w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[9px] font-bold uppercase text-brand-500 mb-1 tracking-wider", children: "Description" }), _jsx("textarea", { value: newProject.description, onChange: (e) => setNewProject({ ...newProject, description: e.target.value }), placeholder: "Brief description of application features...", rows: 3, className: "w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white" })] }), _jsx("div", { className: "flex justify-end", children: _jsx(Button, { type: "submit", isLoading: saving, className: "px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold", children: "Register Project" }) })] }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-sm font-bold text-brand-900", children: "Featured Projects List" }), (profile?.projects || []).length === 0 ? (_jsx(Card, { className: "text-center p-8 border border-brand-200/60 shadow-sm text-brand-400", children: _jsxs(CardContent, { className: "space-y-1", children: [_jsx(Briefcase, { className: "h-7 w-7 mx-auto text-brand-300" }), _jsx("p", { className: "italic", children: "No projects added yet." })] }) })) : (_jsx("div", { className: "grid grid-cols-1 gap-4", children: (profile.projects || []).map((proj, idx) => (_jsx(Card, { className: "border border-brand-200/60 shadow-sm transition-shadow hover:shadow-md", children: _jsxs(CardContent, { className: "p-5 space-y-3", children: [_jsxs("div", { className: "flex justify-between items-start gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h3", { className: "font-bold text-brand-900 text-sm", children: proj.title }), _jsx("p", { className: "text-brand-600 leading-relaxed", children: proj.description })] }), _jsx("button", { onClick: () => handleDeleteProject(idx), className: "text-red-500 hover:text-red-750 p-1.5 transition-colors shrink-0", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }), _jsx("div", { className: "flex flex-wrap gap-1", children: proj.technologies.map((t) => (_jsx(Badge, { variant: "secondary", className: "text-[9px]", children: t }, t))) }), _jsxs("div", { className: "flex gap-4 pt-2 border-t border-brand-100 text-xs font-semibold text-indigo-600", children: [proj.githubUrl && (_jsxs("a", { href: proj.githubUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1 hover:underline", children: [_jsx(Github, { className: "h-4 w-4 text-brand-500" }), _jsx("span", { children: "GitHub Source" })] })), proj.demoUrl && (_jsxs("a", { href: proj.demoUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1 hover:underline", children: [_jsx(Globe, { className: "h-4 w-4 text-brand-500" }), _jsx("span", { children: "Live Application" })] }))] })] }) }, idx))) }))] })] })] })] }));
};
export default StudentSkillsProjects;
