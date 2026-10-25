import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import {
    Briefcase,
    Calendar,
    MapPin,
    Search,
    CheckCircle,
    XCircle,
    AlertCircle,
    Award,
    Clock,
    X,
} from 'lucide-react';

export const StudentApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [selectedOfferApp, setSelectedOfferApp] = useState(null);

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get('/jobs/student/applications');
            const data = res.data?.data;
            const apps = Array.isArray(data) ? data : (data?.applications || []);
            setApplications(apps);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error?.message || 'Failed to fetch job applications.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleRespondOffer = async (appId, decision) => {
        const isAccept = decision === 'ACCEPT';
        const confirmMsg = isAccept
            ? 'Are you sure you want to officially ACCEPT this employment offer? This is a binding institutional milestone.'
            : 'Are you sure you want to DECLINE this offer? This action cannot be reversed.';
        if (!window.confirm(confirmMsg)) return;

        setActionLoadingId(appId);
        try {
            const res = await apiClient.post(`/jobs/application/${appId}/respond-offer`, {
                decision,
                remarks: isAccept ? 'Accepted by candidate via student portal' : 'Declined by candidate',
            });
            if (res.data?.success) {
                setSelectedOfferApp(null);
                await fetchApplications();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit offer response.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleWithdraw = async (appId) => {
        const remarks = window.prompt('Please provide a brief reason for withdrawing your application:');
        if (remarks === null) return; // User cancelled prompt

        setActionLoadingId(appId);
        try {
            const res = await apiClient.post(`/jobs/application/${appId}/withdraw`, {
                remarks: remarks || 'Withdrawn by student',
            });
            if (res.data?.success) {
                await fetchApplications();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to withdraw application.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'OFFER_ACCEPTED':
                return { variant: 'success', text: 'OFFER ACCEPTED' };
            case 'OFFERED':
                return { variant: 'warning', text: 'OFFER LETTER RECEIVED' };
            case 'SELECTED':
                return { variant: 'success', text: 'SELECTED' };
            case 'INTERVIEW':
                return { variant: 'warning', text: 'INTERVIEW STAGE' };
            case 'SHORTLISTED':
                return { variant: 'info', text: 'SHORTLISTED' };
            case 'SCREENING':
                return { variant: 'default', text: 'SCREENING' };
            case 'OFFER_REJECTED':
            case 'REJECTED':
                return { variant: 'danger', text: status };
            case 'WITHDRAWN':
                return { variant: 'danger', text: 'WITHDRAWN' };
            case 'APPLIED':
            default:
                return { variant: 'default', text: 'APPLIED' };
        }
    };

    const filteredApps = applications.filter((app) => {
        const jobTitle = typeof app.job === 'object' ? (app.job?.title || '') : '';
        const company = typeof app.job === 'object' ? (app.job?.companyName || '') : '';
        const matchesSearch =
            !searchTerm ||
            jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const pendingOffers = applications.filter((app) => app.status === 'OFFERED');

    return (
        <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in p-2 sm:p-4">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-brand-900 dark:text-stone-100 flex items-center gap-2">
                    <Briefcase className="h-5.5 w-5.5 text-brand-600 dark:text-brand-400" />
                    <span>My Applications & Offers Tracker</span>
                </h1>
                <p className="text-xs text-brand-500 dark:text-stone-400 mt-1">
                    Monitor interview pipelines, review active job offers, and verify placement status.
                </p>
            </div>

            {/* High-Priority Active Offer Banner */}
            {pendingOffers.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 space-y-3">
                    <div className="flex items-start gap-3">
                        <Award className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-bounce" />
                        <div className="flex-1">
                            <h3 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                                Action Required: You have {pendingOffers.length} pending job offer{pendingOffers.length > 1 ? 's' : ''}!
                            </h3>
                            <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5">
                                Please review terms, compensation packages, and respond prior to the specified deadline.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {pendingOffers.map((app) => (
                            <div
                                key={app._id}
                                className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 shadow-sm flex flex-col justify-between space-y-3"
                            >
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                                            {app.job?.title}
                                        </h4>
                                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                            {app.offerDetails?.packageLpa ? `${app.offerDetails.packageLpa} LPA` : 'Offer Extended'}
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                                        {app.job?.companyName}
                                    </p>
                                    {app.offerDetails?.deadline && (
                                        <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400 mt-2 font-medium">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>Deadline: {new Date(app.offerDetails.deadline).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        disabled={actionLoadingId === app._id}
                                        onClick={() => handleRespondOffer(app._id, 'ACCEPT')}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1 text-[11px]"
                                    >
                                        <CheckCircle className="h-3.5 w-3.5" />
                                        <span>Accept Offer</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={actionLoadingId === app._id}
                                        onClick={() => handleRespondOffer(app._id, 'REJECT')}
                                        className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/40 flex items-center justify-center gap-1 text-[11px]"
                                    >
                                        <XCircle className="h-3.5 w-3.5" />
                                        <span>Decline</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-stone-900 p-3 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm">
                <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-600 dark:text-stone-300" />
                    <input
                        type="text"
                        placeholder="Search by role or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-1.5 border border-[#94805A] dark:border-stone-700 rounded-lg outline-none focus:border-brand-500 bg-transparent dark:text-stone-100 placeholder:text-[#786144] dark:placeholder:text-[#C9BF9F]"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-xs px-3 py-1.5 border border-[#94805A] dark:border-stone-700 rounded-lg outline-none bg-white dark:bg-stone-900 font-medium text-stone-700 dark:text-stone-300 w-full sm:w-44"
                    >
                        <option value="">All Statuses</option>
                        <option value="APPLIED">Applied</option>
                        <option value="SCREENING">Screening</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW">Interview Stage</option>
                        <option value="SELECTED">Selected</option>
                        <option value="OFFERED">Offer Extended</option>
                        <option value="OFFER_ACCEPTED">Offer Accepted</option>
                        <option value="OFFER_REJECTED">Offer Declined</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="WITHDRAWN">Withdrawn</option>
                    </select>
                </div>
            </div>

            {/* Main Application Table / Cards */}
            {loading ? (
                <LoadingState count={3} type="table" />
            ) : error ? (
                <ErrorState message={error} onRetry={fetchApplications} />
            ) : filteredApps.length === 0 ? (
                <EmptyState
                    icon={Briefcase}
                    title="No Applications Found"
                    description={
                        searchTerm || statusFilter
                            ? "No applications matched your current filters."
                            : "You haven't applied to any job listings yet. Check out the Placements portal to explore opportunities."
                    }
                />
            ) : (
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 font-bold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="p-3.5 pl-5">Position & Company</th>
                                    <th className="p-3.5">Location</th>
                                    <th className="p-3.5">Applied Date</th>
                                    <th className="p-3.5">Current Status</th>
                                    <th className="p-3.5">Compensation</th>
                                    <th className="p-3.5 pr-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                                {filteredApps.map((app) => {
                                    const badge = getStatusBadge(app.status);
                                    const canWithdraw = !['OFFER_ACCEPTED', 'REJECTED', 'WITHDRAWN'].includes(app.status);

                                    return (
                                        <tr key={app._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                                            <td className="p-3.5 pl-5">
                                                <div className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                                                    {app.job?.title || 'Job Listing'}
                                                </div>
                                                <div className="text-[11px] text-stone-600 dark:text-stone-300">
                                                    {app.job?.companyName || 'Campus Partner'}
                                                </div>
                                            </td>
                                            <td className="p-3.5 text-stone-700 dark:text-stone-300">
                                                <div className="flex items-center gap-1 text-[11px]">
                                                    <MapPin className="h-3 w-3 text-stone-600 dark:text-stone-300" />
                                                    <span>{app.job?.location || 'Remote'}</span>
                                                </div>
                                            </td>
                                            <td className="p-3.5 text-stone-600 dark:text-stone-300 text-[11px]">
                                                {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-3.5">
                                                <Badge variant={badge.variant} className="text-[9px] font-bold uppercase">
                                                    {badge.text}
                                                </Badge>
                                            </td>
                                            <td className="p-3.5 font-bold text-stone-700 dark:text-stone-300 text-[11px]">
                                                {app.offerDetails?.packageLpa
                                                    ? `${app.offerDetails.packageLpa} LPA`
                                                    : app.job?.salaryMax
                                                    ? `${app.job.salaryMax} LPA`
                                                    : 'Standard CTC'}
                                            </td>
                                            <td className="p-3.5 pr-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {app.status === 'OFFERED' && (
                                                        <Button
                                                            size="sm"
                                                            variant="primary"
                                                            onClick={() => handleRespondOffer(app._id, 'ACCEPT')}
                                                            disabled={actionLoadingId === app._id}
                                                            className="text-[10px] py-1 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white"
                                                        >
                                                            Accept
                                                        </Button>
                                                    )}
                                                    {canWithdraw && (
                                                        <button
                                                            onClick={() => handleWithdraw(app._id)}
                                                            disabled={actionLoadingId === app._id}
                                                            className="text-[11px] text-stone-600 hover:text-rose-700 dark:text-stone-300 dark:hover:text-rose-300 font-medium transition-colors"
                                                            title="Withdraw application"
                                                        >
                                                            Withdraw
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentApplications;
