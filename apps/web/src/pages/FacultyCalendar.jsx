import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { Calendar, Plus, Trash2, Filter, X, Clock, MapPin, Tag } from 'lucide-react';
import { apiClient } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export const FacultyCalendar = () => {
    const { user } = useAuth();
    const isPrivileged = user?.role === 'FACULTY' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState('ALL');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'ACADEMIC',
    });

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = {};
            if (selectedType !== 'ALL') {
                params.type = selectedType;
            }
            const res = await apiClient.get('/faculty/calendar', { params });
            if (res.data?.success) {
                setEvents(res.data.data || []);
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load academic calendar events.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedType]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await apiClient.post('/faculty/calendar', formData);
            if (res.data?.success) {
                setIsAddModalOpen(false);
                setFormData({
                    title: '',
                    description: '',
                    date: new Date().toISOString().split('T')[0],
                    type: 'ACADEMIC',
                });
                await fetchEvents();
            }
        } catch (err) {
            alert(err?.response?.data?.message || 'Failed to schedule academic event.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event from the academic schedule?')) {
            return;
        }
        setDeletingId(id);
        try {
            await apiClient.delete(`/faculty/calendar/${id}`);
            setEvents(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            alert(err?.response?.data?.message || 'Failed to delete event.');
        } finally {
            setDeletingId(null);
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'EXAM':
                return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900';
            case 'HOLIDAY':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900';
            case 'SYSTEM':
                return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900';
            case 'MEETING':
                return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900';
            default:
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900';
        }
    };

    const formatDateDisplay = (dateString) => {
        if (!dateString) return 'Date TBD';
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? dateString : d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            weekday: 'short',
        });
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in p-2 sm:p-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
                <div>
                    <h1 className="text-xl font-bold text-brand-900 dark:text-stone-100 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                        <span>Academic Calendar & Term Schedules</span>
                    </h1>
                    <p className="text-xs text-brand-500 dark:text-stone-400 mt-1">
                        Authoritative institutional examinations, evaluation deadlines, system audits, and holidays.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Type Filter */}
                    <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800/60 p-1 rounded-lg border border-stone-200 dark:border-stone-700">
                        <Filter className="h-3.5 w-3.5 text-stone-500 ml-1.5" />
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="bg-transparent text-[11px] font-medium text-stone-700 dark:text-stone-300 focus:outline-none pr-2 cursor-pointer"
                        >
                            <option value="ALL">All Types</option>
                            <option value="ACADEMIC">Academic</option>
                            <option value="EXAM">Examinations</option>
                            <option value="HOLIDAY">Holidays</option>
                            <option value="SYSTEM">System/Audits</option>
                            <option value="MEETING">Meetings</option>
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
                            <span>Add Event</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Content States */}
            {isLoading ? (
                <LoadingState count={4} type="card" />
            ) : error ? (
                <ErrorState message={error} onRetry={fetchEvents} />
            ) : events.length === 0 ? (
                <EmptyState
                    icon={Calendar}
                    title="No scheduled academic events"
                    description={
                        selectedType !== 'ALL'
                            ? `No events found matching type filter "${selectedType}".`
                            : "There are currently no upcoming academic events scheduled in the institutional registry."
                    }
                    actionLabel={isPrivileged ? "Schedule New Event" : undefined}
                    onAction={isPrivileged ? () => setIsAddModalOpen(true) : undefined}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.map((event) => (
                        <Card
                            key={event._id || event.id}
                            className="border border-stone-200 dark:border-stone-800 shadow-sm p-4 hover:border-brand-300 dark:hover:border-stone-700 transition-all flex flex-col justify-between group"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTypeColor(
                                            event.type
                                        )} uppercase tracking-wider`}
                                    >
                                        {event.type}
                                    </span>
                                    {isPrivileged && (
                                        <button
                                            onClick={() => handleDeleteEvent(event._id || event.id)}
                                            disabled={deletingId === (event._id || event.id)}
                                            className="text-stone-600 hover:text-rose-700 dark:text-stone-400 dark:hover:text-rose-300 transition-colors p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            title="Delete event"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm leading-snug">
                                    {event.title}
                                </h3>
                                {event.description && (
                                    <p className="text-stone-700 dark:text-stone-300 text-xs mt-1.5 line-clamp-2">
                                        {event.description}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-300">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Clock className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                                    {formatDateDisplay(event.date)}
                                </span>
                                {event.createdBy?.name && (
                                    <span className="text-[10px] text-stone-600 dark:text-stone-300">
                                        by {event.createdBy.name}
                                    </span>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Event Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                <Calendar className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
                                <span>Schedule Academic Event</span>
                            </h2>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-stone-600 hover:text-stone-800 dark:text-stone-300 dark:hover:text-stone-100"
                            >
                                <X className="h-4.5 w-4.5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                    Event Title *
                                </label>
                                <Input
                                    type="text"
                                    required
                                    placeholder="e.g. Mid-Term Examination Block 1"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                        Event Date *
                                    </label>
                                    <Input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                        Type *
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full h-10 px-3 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    >
                                        <option value="ACADEMIC">Academic</option>
                                        <option value="EXAM">Examination</option>
                                        <option value="HOLIDAY">Holiday</option>
                                        <option value="SYSTEM">System Audit</option>
                                        <option value="MEETING">Meeting</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                    Description / Instructions
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Provide key details, student submission requirements, or invigilation notes..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-2.5 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                                    {isSubmitting ? 'Saving...' : 'Publish Event'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyCalendar;
