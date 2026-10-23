import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { Search, CheckCircle, XCircle, Award, Send, X, Clock, Filter } from 'lucide-react';

export const PlacementOffers = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Issue offer modal state
    const [selectedAppForOffer, setSelectedAppForOffer] = useState(null);
    const [offerFormData, setOfferFormData] = useState({
        packageLpa: '',
        designation: '',
        joiningLocation: '',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
    });
    const [submittingOffer, setSubmittingOffer] = useState(false);

    const fetchOffers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get('/jobs/all-applications');
            const allApps = res.data?.data || [];
            // Target candidate states: SELECTED, OFFERED, OFFER_ACCEPTED, OFFER_REJECTED
            const offerApps = allApps.filter((a) =>
                ['SELECTED', 'OFFERED', 'OFFER_ACCEPTED', 'OFFER_REJECTED'].includes(a.status)
            );
            setApplications(offerApps);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch job offers and selection registry.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    const openOfferModal = (app) => {
        setSelectedAppForOffer(app);
        setOfferFormData({
            packageLpa: app.offerDetails?.packageLpa || app.job?.salaryMax || 8,
            designation: app.offerDetails?.designation || app.job?.title || 'Software Engineer',
            joiningLocation: app.offerDetails?.joiningLocation || app.job?.location || 'Bengaluru / Remote',
            deadline: app.offerDetails?.deadline
                ? new Date(app.offerDetails.deadline).toISOString().split('T')[0]
                : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            notes: app.offerDetails?.decisionRemarks || '',
        });
    };

    const handleIssueOfferSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAppForOffer) return;

        setSubmittingOffer(true);
        try {
            const res = await apiClient.post(`/jobs/application/${selectedAppForOffer._id}/issue-offer`, {
                packageLpa: Number(offerFormData.packageLpa),
                designation: offerFormData.designation,
                joiningLocation: offerFormData.joiningLocation,
                deadline: offerFormData.deadline,
                notes: offerFormData.notes,
            });
            if (res.data?.success) {
                setSelectedAppForOffer(null);
                await fetchOffers();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to extend employment offer.');
        } finally {
            setSubmittingOffer(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'OFFER_ACCEPTED':
                return { variant: 'success', text: 'OFFER ACCEPTED' };
            case 'OFFERED':
                return { variant: 'warning', text: 'OFFER LETTER EXTENDED' };
            case 'SELECTED':
                return { variant: 'info', text: 'SELECTED (AWAITING OFFER)' };
            case 'OFFER_REJECTED':
                return { variant: 'danger', text: 'OFFER DECLINED' };
            default:
                return { variant: 'default', text: status };
        }
    };

    const filteredApps = applications.filter((o) => {
        const matchesSearch =
            (o.student?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.job?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.job?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalOffers = applications.filter((o) => ['OFFERED', 'OFFER_ACCEPTED', 'OFFER_REJECTED'].includes(o.status)).length;
    const acceptedOffers = applications.filter((o) => o.status === 'OFFER_ACCEPTED').length;
    const pendingDecisions = applications.filter((o) => o.status === 'OFFERED').length;
    const pendingOfferIssuance = applications.filter((o) => o.status === 'SELECTED').length;

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in p-2 sm:p-4">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-brand-900 dark:text-stone-100 flex items-center gap-2">
                    <Award className="h-5.5 w-5.5 text-brand-600 dark:text-brand-400" />
                    <span>Campus Placement Offers & Selection Registry</span>
                </h1>
                <p className="text-xs text-brand-500 dark:text-stone-400 mt-1">
                    Extend formal offer letters to selected candidates, monitor student responses, and track joining outcomes.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="border border-stone-200 dark:border-stone-800 shadow-sm text-center">
                    <CardContent className="p-4 space-y-1">
                        <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider block">
                            Offers Extended
                        </span>
                        <p className="text-xl font-black text-stone-900 dark:text-stone-100">{totalOffers}</p>
                    </CardContent>
                </Card>
                <Card className="border border-stone-200 dark:border-stone-800 shadow-sm text-center">
                    <CardContent className="p-4 space-y-1">
                        <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider block">
                            Offers Accepted
                        </span>
                        <p className="text-xl font-black text-emerald-600">{acceptedOffers}</p>
                    </CardContent>
                </Card>
                <Card className="border border-stone-200 dark:border-stone-800 shadow-sm text-center">
                    <CardContent className="p-4 space-y-1">
                        <span className="text-[10px] text-amber-600 uppercase font-bold tracking-wider block">
                            Pending Student Decisions
                        </span>
                        <p className="text-xl font-black text-amber-600">{pendingDecisions}</p>
                    </CardContent>
                </Card>
                <Card className="border border-stone-200 dark:border-stone-800 shadow-sm text-center">
                    <CardContent className="p-4 space-y-1">
                        <span className="text-[10px] text-blue-600 uppercase font-bold tracking-wider block">
                            Awaiting Offer Letters
                        </span>
                        <p className="text-xl font-black text-blue-600">{pendingOfferIssuance}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-3 rounded-xl shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-600 dark:text-stone-300" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by candidate name, recruiter company, or designation..."
                        className="pl-8 w-full text-xs border border-[#94805A] dark:border-stone-700 rounded-lg py-1.5 pr-3 outline-none focus:border-brand-500 bg-transparent dark:text-stone-100 placeholder:text-[#786144] dark:placeholder:text-[#C9BF9F]"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto shrink-0">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-xs border border-[#94805A] dark:border-stone-700 rounded-lg py-1.5 px-3 outline-none bg-white dark:bg-stone-900 font-medium text-stone-700 dark:text-stone-300"
                    >
                        <option value="ALL">All Outcomes</option>
                        <option value="SELECTED">Selected (Ready for Offer)</option>
                        <option value="OFFERED">Offer Extended (Pending Decision)</option>
                        <option value="OFFER_ACCEPTED">Offer Accepted</option>
                        <option value="OFFER_REJECTED">Offer Declined</option>
                    </select>
                </div>
            </div>

            {/* Main Offers Table */}
            {loading ? (
                <LoadingState count={3} type="table" />
            ) : error ? (
                <ErrorState message={error} onRetry={fetchOffers} />
            ) : filteredApps.length === 0 ? (
                <EmptyState
                    icon={Award}
                    title="No Offers Found"
                    description="No student application records matched the selected offer criteria."
                />
            ) : (
                <Card className="border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 font-bold uppercase text-[9px] tracking-wider">
                                    <th className="px-5 py-3">Candidate</th>
                                    <th className="px-5 py-3">Company Recruiter</th>
                                    <th className="px-5 py-3">Designation Role</th>
                                    <th className="px-5 py-3">Compensation (LPA)</th>
                                    <th className="px-5 py-3">Placement Status</th>
                                    <th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-900">
                                {filteredApps.map((o) => {
                                    const badge = getStatusBadge(o.status);
                                    const currentPackage = o.offerDetails?.packageLpa || o.job?.salaryMax;

                                    return (
                                        <tr key={o._id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="font-bold text-stone-900 dark:text-stone-100">
                                                    {o.student?.name || 'Candidate'}
                                                </div>
                                                <div className="text-[10px] text-stone-600 dark:text-stone-300">
                                                    {o.student?.email}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 font-bold text-stone-850 dark:text-stone-200">
                                                {o.job?.companyName}
                                            </td>
                                            <td className="px-5 py-3.5 text-stone-700 dark:text-stone-300 font-medium">
                                                {o.offerDetails?.designation || o.job?.title}
                                            </td>
                                            <td className="px-5 py-3.5 font-bold text-stone-900 dark:text-stone-100">
                                                {currentPackage ? `${currentPackage} LPA` : 'TBD'}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <Badge variant={badge.variant} className="font-bold text-[9px] uppercase">
                                                    {badge.text}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                {(o.status === 'SELECTED' || o.status === 'OFFERED') && (
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        onClick={() => openOfferModal(o)}
                                                        className="text-[10px] py-1 px-2.5 inline-flex items-center gap-1"
                                                    >
                                                        <Send className="h-3 w-3" />
                                                        <span>{o.status === 'SELECTED' ? 'Issue Offer' : 'Update Offer'}</span>
                                                    </Button>
                                                )}
                                                {o.status === 'OFFER_ACCEPTED' && (
                                                    <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold inline-flex items-center gap-1">
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                        Placed
                                                    </span>
                                                )}
                                                {o.status === 'OFFER_REJECTED' && (
                                                    <span className="text-[11px] text-rose-700 dark:text-rose-300 font-bold inline-flex items-center gap-1">
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        Declined
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}

            {/* Issue Offer Modal */}
            {selectedAppForOffer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                            <div>
                                <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                    <Send className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
                                    <span>Issue Formal Employment Offer</span>
                                </h2>
                                <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">
                                    Candidate: {selectedAppForOffer.student?.name} • {selectedAppForOffer.job?.companyName}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedAppForOffer(null)}
                                className="text-stone-600 hover:text-stone-800 dark:text-stone-300 dark:hover:text-stone-100"
                            >
                                <X className="h-4.5 w-4.5" />
                            </button>
                        </div>

                        <form onSubmit={handleIssueOfferSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                        CTC Package (LPA) *
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        required
                                        placeholder="e.g. 12.5"
                                        value={offerFormData.packageLpa}
                                        onChange={(e) => setOfferFormData({ ...offerFormData, packageLpa: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                        Acceptance Deadline *
                                    </label>
                                    <Input
                                        type="date"
                                        required
                                        value={offerFormData.deadline}
                                        onChange={(e) => setOfferFormData({ ...offerFormData, deadline: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                    Designation / Role Title
                                </label>
                                <Input
                                    type="text"
                                    required
                                    placeholder="e.g. Associate Software Engineer"
                                    value={offerFormData.designation}
                                    onChange={(e) => setOfferFormData({ ...offerFormData, designation: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                    Joining Location
                                </label>
                                <Input
                                    type="text"
                                    placeholder="e.g. Bengaluru / Hyderabad / Hybrid"
                                    value={offerFormData.joiningLocation}
                                    onChange={(e) => setOfferFormData({ ...offerFormData, joiningLocation: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                                    Offer Letter Notes / Stipulations
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Mention probation duration, signing bonuses, or document submission requirements..."
                                    value={offerFormData.notes}
                                    onChange={(e) => setOfferFormData({ ...offerFormData, notes: e.target.value })}
                                    className="w-full p-2.5 text-xs bg-white dark:bg-stone-900 border border-[#94805A] dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-[#786144] dark:placeholder:text-[#C9BF9F] text-stone-900 dark:text-stone-100"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedAppForOffer(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="sm"
                                    disabled={submittingOffer}
                                >
                                    {submittingOffer ? 'Extending Offer...' : 'Transmit Offer'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlacementOffers;
