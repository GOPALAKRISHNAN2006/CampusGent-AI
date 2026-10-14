import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import {
    GraduationCap, Plus, Search, Building2, BookOpen,
    CheckCircle2, AlertCircle, X, Shield
} from 'lucide-react';

export const AdminDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Modal state for creating a new department
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [creating, setCreating] = useState(false);

    // Filter
    const [searchTerm, setSearchTerm] = useState('');

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get('/admin/departments');
            setDepartments(res.data.data?.departments || []);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to load department registry.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !code.trim()) return;
        setCreating(true);
        setError(null);
        try {
            await apiClient.post('/admin/departments', {
                name: name.trim(),
                code: code.trim().toUpperCase(),
                description: description.trim()
            });
            setSuccessMsg(`Department "${name}" (${code.toUpperCase()}) created successfully.`);
            setIsCreateOpen(false);
            setName('');
            setCode('');
            setDescription('');
            fetchDepartments();
            setTimeout(() => setSuccessMsg(null), 4000);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to create department.');
        } finally {
            setCreating(false);
        }
    };

    const filteredDepartments = departments.filter((dept) => {
        const query = searchTerm.toLowerCase();
        return (
            dept.name?.toLowerCase().includes(query) ||
            dept.code?.toLowerCase().includes(query) ||
            dept.description?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in font-sans text-[#1F150C]">
            {/* Header Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F150C] via-[#31210F] to-[#412D15] p-6 sm:p-8 text-white border border-[#412D15] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E1DCC9]/15 border border-[#E1DCC9]/30 text-[10px] font-bold uppercase tracking-[0.16em] text-[#E1DCC9]">
                        <Building2 className="h-3.5 w-3.5 text-[#E1DCC9]" />
                        <span>Institutional Structure</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2.5">
                        <GraduationCap className="h-7 w-7 text-[#E1DCC9]" />
                        <span>Academic Departments</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#E1DCC9]/85 font-normal leading-relaxed">
                        Configure institutional faculties, academic department codes, and organizational classifications across campus.
                    </p>
                </div>

                <Button
                    onClick={() => setIsCreateOpen(true)}
                    variant="sandstone"
                    className="shrink-0 font-bold flex items-center gap-2 px-4 py-2.5 shadow-md"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add Department</span>
                </Button>
            </div>

            {/* Notifications */}
            {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-2xl flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                </div>
            )}
            {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 font-bold rounded-2xl flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Search Toolbar */}
            <Card className="border border-[#E1DCC9] shadow-sm bg-white">
                <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <div className="flex-1 relative">
                        <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F7554]" />
                        <input
                            type="text"
                            placeholder="Search departments by code, title, or scope..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E1DCC9] text-[#1F150C] focus:bg-white focus:border-[#412D15] focus:outline-none transition-all"
                        />
                    </div>
                    <Badge variant="neutral" className="text-xs font-bold py-1 px-3">
                        {filteredDepartments.length} Departments
                    </Badge>
                </CardContent>
            </Card>

            {/* Department Grid */}
            {loading ? (
                <div className="p-12 text-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#412D15] mx-auto" />
                    <p className="text-xs text-[#8F7554] font-semibold">Loading departments...</p>
                </div>
            ) : filteredDepartments.length === 0 ? (
                <Card className="p-12 text-center text-[#8F7554] border border-[#E1DCC9] bg-white">
                    <Building2 className="h-10 w-10 mx-auto text-[#C9BF9F] mb-2" />
                    <p className="text-sm font-bold text-[#1F150C]">No departments found</p>
                    <p className="text-xs text-[#8F7554]">Click "Add Department" to register a new academic faculty.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredDepartments.map((dept) => (
                        <Card key={dept._id} className="border border-[#E1DCC9] bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                            <CardHeader className="border-b border-[#E1DCC9]/50 pb-3">
                                <div className="flex justify-between items-start gap-2">
                                    <Badge variant="bronze" className="text-[10px] uppercase font-mono tracking-wider">
                                        {dept.code}
                                    </Badge>
                                    <span className="text-[10px] text-[#8F7554] font-medium">
                                        {new Date(dept.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <CardTitle className="text-sm font-extrabold text-[#1F150C] mt-2 leading-tight">
                                    {dept.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="pt-3 pb-4 space-y-3 flex-1 flex flex-col justify-between">
                                <p className="text-xs text-[#6B5336] leading-relaxed line-clamp-3">
                                    {dept.description || 'Standard institutional engineering and management faculty program.'}
                                </p>
                                <div className="pt-3 border-t border-[#E1DCC9]/60 flex items-center justify-between text-[11px] text-[#8F7554] font-semibold">
                                    <span className="flex items-center gap-1.5 text-emerald-800">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active Registry
                                    </span>
                                    <span className="font-mono text-[10px]">ID: {dept._id?.slice(-6)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Department Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <Card className="w-full max-w-md bg-white border border-[#E1DCC9] shadow-2xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-[#FAF7F2] border-b border-[#E1DCC9] p-5 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-[#412D15]" />
                                <CardTitle className="text-sm font-bold text-[#1F150C]">Create Academic Department</CardTitle>
                            </div>
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="p-1 hover:bg-[#F4EFE6] rounded-lg text-[#6B5336] transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </CardHeader>

                        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5336]">
                                    Department Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Artificial Intelligence & Data Science"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-[#E1DCC9] bg-[#FAF7F2] text-xs font-semibold text-[#1F150C] focus:bg-white focus:outline-none focus:border-[#412D15]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5336]">
                                    Department Code *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. AIDS or CSE"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className="w-full p-2.5 rounded-xl border border-[#E1DCC9] bg-[#FAF7F2] text-xs font-mono font-bold text-[#1F150C] focus:bg-white focus:outline-none focus:border-[#412D15]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5336]">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Brief outline of curriculum focus, syllabus, and facilities..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-[#E1DCC9] bg-[#FAF7F2] text-xs text-[#1F150C] focus:bg-white focus:outline-none focus:border-[#412D15]"
                                />
                            </div>

                            <div className="flex justify-end gap-2.5 pt-2">
                                <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" isLoading={creating} className="font-bold">
                                    Create Department
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AdminDepartments;
