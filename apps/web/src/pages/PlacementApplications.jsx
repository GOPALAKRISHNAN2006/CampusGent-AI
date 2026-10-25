import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { FileText, Search, Award, UserCheck, XCircle, Clock, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const PlacementApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [searchParams] = useSearchParams();

    // Search & Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState('ALL');

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get('/jobs/all-applications');
            setApplications(Array.isArray(res.data?.data) ? res.data.data : []);
        } catch (err) {
            setError(err.response?.data?.error?.message || err.response?.data?.message || 'Unable to load applications list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        const jobIdParam = searchParams.get('jobId');
        if (jobIdParam) {
            setStageFilter('ALL');
        }
    }, [searchParams]);

    const handleUpdateStatus = async (appId, status, remarks) => {
        try {
            setUpdatingId(appId);
            setFeedback(null);
            await apiClient.put(`/jobs/application/${appId}/status`, { status, remarks });
            setFeedback({ type: 'success', message: `Application status updated to ${status} successfully.` });
            await fetchApplications();
            setTimeout(() => setFeedback(null), 4000);
        } catch (err) {
            const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update application status.';
            setFeedback({ type: 'error', message: msg });
            alert(msg);
        } finally {
            setUpdatingId(null);
        }
    };

    // Filter logic
    const filteredApps = applications.filter((app) => {
        const studentName = app.student?.name || '';
        const jobTitle = app.job?.title || '';
        const companyName = app.job?.companyName || '';
        const matchesSearch =
            studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            companyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStage = stageFilter === 'ALL' || app.status === stageFilter;
        const jobIdParam = searchParams.get('jobId');
        const matchesJobId = !jobIdParam || app.job?._id === jobIdParam;
        return matchesSearch && matchesStage && matchesJobId;
    });

    const getBadgeVariant = (status) => {
        switch (status) {
            case 'SELECTED':
            case 'OFFER_ACCEPTED':
                return 'success';
            case 'REJECTED':
            case 'WITHDRAWN':
                return 'danger';
            case 'SHORTLISTED':
            case 'INTERVIEW':
            case 'OFFERED':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-brand-900 dark:text-stone-100">
                        Applications Pipeline
                    </h1>
                    <p className="text-brand-500 dark:text-stone-400 mt-1">
                        Review student applications, filter by recruitment stage, and transition hiring statuses.
                    </p>
                </div>
                <button
                    onClick={fetchApplications}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-50 text-[11px] self-start sm:self-auto cursor-pointer"
                >
                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {feedback && (
                <div
                    className={`p-3 rounded-xl text-xs font-semibold border ${
                        feedback.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                    }`}
                >
                    {feedback.message}
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
                    {error}
                </div>
            )}

            {/* Filter Bar */}
            <div className="bg-white dark:bg-stone-900 border border-brand-200/60 dark:border-stone-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-brand-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by student, company, or job role..."
                        className="pl-9 w-full text-xs border border-brand-200 dark:border-stone-700 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white dark:bg-stone-800 dark:text-stone-100"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto shrink-0">
                    <select
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value)}
                        className="text-xs border border-brand-200 dark:border-stone-700 rounded-lg p-2.5 outline-none bg-white dark:bg-stone-800 font-bold text-brand-700 dark:text-stone-200"
                    >
                        <option value="ALL">All Stages</option>
                        <option value="APPLIED">Applied</option>
                        <option value="SCREENING">Screening</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="SELECTED">Selected / Hired</option>
                        <option value="OFFERED">Offered</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="WITHDRAWN">Withdrawn</option>
                    </select>
                </div>
            </div>

            {/* Applications Table */}
            <Card className="border border-brand-200/60 dark:border-stone-800 shadow-sm overflow-hidden bg-white dark:bg-stone-900">
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-50 dark:bg-stone-800/60 border-b border-brand-200 dark:border-stone-800 text-brand-650 dark:text-stone-400 font-bold uppercase text-[9px] tracking-wider">
                                <th className="px-5 py-3">Student Details</th>
                                <th className="px-5 py-3">Company & Job</th>
                                <th className="px-5 py-3">Applied Date</th>
                                <th className="px-5 py-3">Resume</th>
                                <th className="px-5 py-3">Hiring Stage</th>
                                <th className="px-5 py-3 text-right">Actions Override</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-100 dark:divide-stone-800 text-brand-800 dark:text-stone-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-8 text-center text-brand-450 font-semibold animate-pulse">
                                        Loading applications list...
                                    </td>
                                </tr>
                            ) : filteredApps.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-8 text-center text-brand-450 font-semibold">
                                        No student applications match the specified filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredApps.map((app) => {
                                    const isUpdating = updatingId === app._id;
                                    return (
                                        <tr key={app._id} className="hover:bg-brand-50/50 dark:hover:bg-stone-800/40 transition-colors">
                                            <td className="px-5 py-4 font-bold text-brand-950 dark:text-stone-100">
                                                <div>{app.student?.name || 'Candidate'}</div>
                                                <div className="text-[10px] text-brand-450 dark:text-stone-400 font-normal mt-0.5">
                                                    {app.student?.email}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-brand-900 dark:text-stone-200">
                                                    {app.job?.companyName || 'Company'}
                                                </div>
                                                <div className="text-[10px] text-indigo-650 dark:text-indigo-400 font-semibold mt-0.5">
                                                    {app.job?.title || 'Role'}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 font-semibold text-brand-600 dark:text-stone-400">
                                                {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-5 py-4">
                                                {app.resumeUrl ? (
                                                    <a
                                                        href={app.resumeUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-indigo-650 dark:text-indigo-400 hover:underline font-bold inline-flex items-center gap-1"
                                                    >
                                                        <FileText className="h-3.5 w-3.5" />
                                                        <span>View PDF</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-stone-400">No PDF</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <Badge variant={getBadgeVariant(app.status)} className="font-bold text-[9px]">
                                                    {app.status}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Shortlist */}
                                                    <button
                                                        onClick={() => handleUpdateStatus(app._id, 'SHORTLISTED', 'Screened & short-listed for recruitment rounds')}
                                                        disabled={isUpdating || app.status === 'SHORTLISTED'}
                                                        className="text-[10px] text-indigo-650 dark:text-indigo-400 hover:underline font-bold disabled:opacity-40 inline-flex items-center gap-0.5 cursor-pointer"
                                                        title="Mark as Shortlisted"
                                                    >
                                                        <Award className="h-3.5 w-3.5" />
                                                        <span>Shortlist</span>
                                                    </button>
                                                    <span className="text-brand-200 dark:text-stone-700">|</span>

                                                    {/* Interview */}
                                                    <button
                                                        onClick={() => handleUpdateStatus(app._id, 'INTERVIEW', 'Candidate scheduled for interview round')}
                                                        disabled={isUpdating || app.status === 'INTERVIEW'}
                                                        className="text-[10px] text-amber-700 dark:text-amber-400 hover:underline font-bold disabled:opacity-40 inline-flex items-center gap-0.5 cursor-pointer"
                                                        title="Mark for Interview"
                                                    >
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span>Interview</span>
                                                    </button>
                                                    <span className="text-brand-200 dark:text-stone-700">|</span>

                                                    {/* Mark Hired / Selected */}
                                                    <button
                                                        onClick={() => handleUpdateStatus(app._id, 'SELECTED', 'Hired & offer confirmed')}
                                                        disabled={isUpdating || app.status === 'SELECTED'}
                                                        className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline font-bold disabled:opacity-40 inline-flex items-center gap-0.5 cursor-pointer"
                                                        title="Mark Candidate as Hired"
                                                    >
                                                        <UserCheck className="h-3.5 w-3.5" />
                                                        <span>Mark Hired</span>
                                                    </button>
                                                    <span className="text-brand-200 dark:text-stone-700">|</span>

                                                    {/* Reject */}
                                                    <button
                                                        onClick={() => handleUpdateStatus(app._id, 'REJECTED', 'Application marked as rejected by Placement Cell')}
                                                        disabled={isUpdating || app.status === 'REJECTED'}
                                                        className="text-[10px] text-red-650 dark:text-rose-400 hover:underline font-bold disabled:opacity-40 inline-flex items-center gap-0.5 cursor-pointer"
                                                        title="Reject Application"
                                                    >
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        <span>Reject</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
};

export default PlacementApplications;
