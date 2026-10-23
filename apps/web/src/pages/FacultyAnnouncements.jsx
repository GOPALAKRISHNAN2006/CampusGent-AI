import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { Bell, Info, AlertTriangle, Flame, Plus, Trash2, Filter, X, Users, Calendar } from 'lucide-react';
import { apiClient } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export const FacultyAnnouncements = () => {
    const { user } = useAuth();
    const isPrivileged = user?.role === 'FACULTY' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPriority, setSelectedPriority] = useState('ALL');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        priority: 'MEDIUM',
        targetRoles: ['STUDENT', 'FACULTY'],
    });

    const fetchAnnouncements = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = {};
            if (selectedPriority !== 'ALL') {
                params.priority = selectedPriority;
            }
            const res = await apiClient.get('/faculty/announcements', { params });
            if (res.data?.success) {
                setAnnouncements(res.data.data || []);
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load institutional announcements.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedPriority]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await apiClient.post('/faculty/announcements', formData);
            if (res.data?.success) {
                setIsAddModalOpen(false);
                setFormData({
                    title: '',
                    content: '',
                    priority: 'MEDIUM',
                    targetRoles: ['STUDENT', 'FACULTY'],
                });
                await fetchAnnouncements();
            }
        } catch (err) {
            alert(err?.response?.data?.message || 'Failed to publish announcement.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (!window.confirm('Are you sure you want to delete this circular/announcement?')) {
            return;
        }
        setDeletingId(id);
        try {
            await apiClient.delete(`/faculty/announcements/${id}`);
            setAnnouncements(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            alert(err?.response?.data?.message || 'Failed to delete announcement.');
        } finally {
            setDeletingId(null);
        }
    };

    const toggleTargetRole = (role) => {
        setFormData(prev => {
            const current = [...prev.targetRoles];
            const index = current.indexOf(role);
            if (index > -1) {
                if (current.length === 1) return prev; // At least one target role required
                current.splice(index, 1);
            } else {
                current.push(role);
            }
            return { ...prev, targetRoles: current };
        });
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'URGENT':
                return {
                    icon: <Flame className="h-4 w-4 text-rose-600 animate-pulse" />,
                    style: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
                };
            case 'HIGH':
                return {
                    icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
                    style: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
                };
            case 'LOW':
                return {
                    icon: <Info className="h-4 w-4 text-stone-500" />,
                    style: 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
                };
            default:
                return {
                    icon: <Info className="h-4 w-4 text-blue-600" />,
                    style: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
                };
        }
    };

    const formatDateDisplay = (dateString) => {
        if (!dateString) return 'Recent';
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? dateString : d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in p-2 sm:p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
                <div>
                    <h1 className="text-xl font-bold text-brand-900 dark:text-stone-100 flex items-center gap-2">
                        <Bell className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                        <span>Circulars & Official Announcements</span>
                    </h1>
                    <p className="text-xs text-brand-500 dark:text-stone-400 mt-1">
                        Review academic directives, placement circulars, and departmental notices.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Priority Filter */}
                    <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800/60 p-1 rounded-lg border border-stone-200 dark:border-stone-700">
                        <Filter className="h-3.5 w-3.5 text-stone-500 ml-1.5" />
                        <select
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                            className="bg-transparent text-[11px] font-medium text-stone-700 dark:text-stone-300 focus:outline-none pr-2 cursor-pointer"
                        >
                            <option value="ALL">All Priorities</option>
                            <option value="URGENT">Urgent</option>
                            <option value="HIGH">High Priority</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                    </div>

                    {isPrivileged && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-1.5"
                        >
                            <Plus className="h-4 w-4" />
                            <span>New Announcement</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Content States */}
            {isLoading ? (
                <LoadingState count={3} type="card" />
            ) : error ? (
                <ErrorState message={error} onRetry={fetchAnnouncements} />
            ) : announcements.length === 0 ? (
                <EmptyState
                    icon={Bell}
                    title="No announcements found"
                    description={
                        selectedPriority !== 'ALL'
                            ? `No announcements found with priority "${selectedPriority}".`
                            : "There are currently no circulars or notices posted for your department/role."
                    }
                    actionLabel={isPrivileged ? "Post New Circular" : undefined}
                    onAction={isPrivileged ? () => setIsAddModalOpen(true) : undefined}
                />
            ) : (
                <div className="space-y-4">
                    {announcements.map((ann) => {
                        const badge = getPriorityBadge(ann.priority);
                        return (
                            <Card
                                key={ann._id || ann.id}
                                className="border border-stone-200 dark:border-stone-800 shadow-sm p-5 hover:border-brand-300 dark:hover:border-stone-700 transition-all flex flex-col justify-between group"
                            >
                                <div className="flex items-start gap-3.5">
                                    <div className={`p-2.5 rounded-xl border shrink-0 ${badge.style}`}>
                                        {badge.icon}
                                    </div>
                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm leading-snug">
                                                    {ann.title}
                                                </h3>
                                                <span
                                                    className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badge.style}`}
                                                >
                                                    {ann.priority}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className="text-[11px] text-stone-600 dark:text-stone-300 font-medium flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDateDisplay(ann.publishedAt || ann.createdAt)}
                                                </span>
                                                {isPrivileged && (
                                                    <button
                                                        onClick={() => handleDeleteAnnouncement(ann._id || ann.id)}
                                                        disabled={deletingId === (ann._id || ann.id)}
                                                        className="text-stone-600 hover:text-rose-700 dark:text-stone-400 dark:hover:text-rose-300 transition-colors p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                        title="Delete announcement"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-xs pt-1 whitespace-pre-line">
                                            {ann.content}
                                        </p>

                                        {/* Target Audience & Author Metadata */}
                                        <div className="flex items-center gap-3 pt-3 mt-2 border-t border-stone-100 dark:border-stone-800/80 text-[10px] text-stone-600 dark:text-stone-300">
                                            <span className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                Audience: {ann.targetRoles?.join(', ') || 'All Roles'}
                                            </span>
                                            {ann.author?.name && (
                                                <span>• Posted by {ann.author.name}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Add Announcement Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                <Bell className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
                                <span>Publish Official Circular</span>
                            </h2>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-stone-600 hover:text-stone-800 dark:text-stone-300 dark:hover:text-stone-100"
                            >
                                <X className="h-4.5 w-4.5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                    Subject / Title *
                                </label>
                                <Input
                                    type="text"
                                    required
                                    placeholder="e.g. Schedule for End-Semester Practical Assessments"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                    Priority Level *
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full h-10 px-3 text-xs bg-white dark:bg-stone-900 border border-[#94805A] dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-stone-800 dark:text-stone-200"
                                >
                                    <option value="LOW">Low (General Information)</option>
                                    <option value="MEDIUM">Medium (Standard Circular)</option>
                                    <option value="HIGH">High (Important Deadline)</option>
                                    <option value="URGENT">Urgent (Immediate Action Required)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                    Target Roles *
                                </label>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {['STUDENT', 'FACULTY', 'PLACEMENT_OFFICER'].map((role) => {
                                        const isSelected = formData.targetRoles.includes(role);
                                        return (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => toggleTargetRole(role)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                                    isSelected
                                                        ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950/50 dark:border-brand-500 dark:text-brand-300'
                                                        : 'border-[#94805A]/70 text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300'
                                                }`}
                                            >
                                                {role}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                    Circular Content / Directive *
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    placeholder="Enter the official announcement text, instructions, and reference links..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full p-2.5 text-xs bg-white dark:bg-stone-900 border border-[#94805A] dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-[#786144] dark:placeholder:text-[#C9BF9F] text-stone-900 dark:text-stone-100"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsAddModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Publishing...' : 'Publish Circular'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyAnnouncements;
