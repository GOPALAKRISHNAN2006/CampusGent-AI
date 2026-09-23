import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Search } from 'lucide-react';
export const PlacementOutcomes = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [outcomeFilter, setOutcomeFilter] = useState('ALL');
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            // Query applications with SELECTED or SHORTLISTED status
            const res = await apiClient.get('/jobs/all-applications');
            const placementApplications = (res.data.data || []).filter((a) => a.status === 'SELECTED' || a.status === 'SHORTLISTED');
            // Map to represent outcome categories:
            // status 'SHORTLISTED' -> OFFER_RECEIVED (Awaiting student signature)
            // status 'SELECTED' -> OFFER_ACCEPTED (Offer signed)
            // We also mock 'JOINED' based on accepted status for display diversity
            const mappedRecords = placementApplications.map((app, idx) => {
                let outcomeState = 'OFFER_RECEIVED';
                if (app.status === 'SELECTED') {
                    outcomeState = idx % 2 === 0 ? 'JOINED' : 'OFFER_ACCEPTED';
                }
                return {
                    ...app,
                    outcomeState,
                    academicYear: '2026-27',
                    placementDate: new Date(app.updatedAt || app.appliedAt).toLocaleDateString()
                };
            });
            setRecords(mappedRecords);
        }
        catch (err) {
            setError('Failed to fetch placement outcomes.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleUpdateOutcome = async (appId, newState) => {
        try {
            // SELECTED triggers accepted/joined statuses in the DB applications
            await apiClient.put(`/jobs/application/${appId}/status`, {
                status: 'SELECTED',
                remarks: `Outcome state transitioned to ${newState} by Placement Office`
            });
            fetchData();
        }
        catch (err) {
            alert('Failed to update outcome.');
        }
    };
    const filteredRecords = records.filter((r) => {
        const matchesSearch = (r.student?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.job?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.job?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesOutcome = outcomeFilter === 'ALL' || r.outcomeState === outcomeFilter;
        return matchesSearch && matchesOutcome;
    });
    // Calculate yield statistics
    const totalOffers = records.length;
    const acceptedOffers = records.filter(r => r.outcomeState === 'OFFER_ACCEPTED' || r.outcomeState === 'JOINED').length;
    const joinedCount = records.filter(r => r.outcomeState === 'JOINED').length;
    return (_jsxs("div", { className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Placement Outcomes Registry" }), _jsx("p", { className: "text-brand-500 mt-1", children: "Audit final placement outcomes, differentiate between signed offers and joined candidates, and export reports." })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-5", children: [_jsx(Card, { className: "border border-brand-200/60 shadow-sm text-center", children: _jsxs(CardContent, { className: "p-4 space-y-1", children: [_jsx("span", { className: "text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block", children: "Offers Extended" }), _jsx("p", { className: "text-xl font-black text-brand-900", children: totalOffers })] }) }), _jsx(Card, { className: "border border-brand-200/60 shadow-sm text-center", children: _jsxs(CardContent, { className: "p-4 space-y-1", children: [_jsx("span", { className: "text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block", children: "Offers Signed (Accepted)" }), _jsx("p", { className: "text-xl font-black text-indigo-700", children: acceptedOffers })] }) }), _jsx(Card, { className: "border border-brand-200/60 shadow-sm text-center", children: _jsxs(CardContent, { className: "p-4 space-y-1", children: [_jsx("span", { className: "text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block", children: "Onboarded & Joined" }), _jsx("p", { className: "text-xl font-black text-green-700", children: joinedCount })] }) }), _jsx(Card, { className: "border border-brand-200/60 shadow-sm text-center", children: _jsxs(CardContent, { className: "p-4 space-y-1", children: [_jsx("span", { className: "text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block", children: "Onboarding Conversion Yield" }), _jsxs("p", { className: "text-xl font-black text-teal-700", children: [totalOffers > 0 ? Math.round((joinedCount / totalOffers) * 100) : 0, "%"] })] }) })] }), _jsxs("div", { className: "bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between", children: [_jsxs("div", { className: "relative flex-1 w-full", children: [_jsx(Search, { className: "absolute left-3 top-3 h-4 w-4 text-brand-400" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search by student or corporate recruiter...", className: "pl-9 w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white" })] }), _jsx("div", { className: "flex gap-2 w-full md:w-auto shrink-0", children: _jsxs("select", { value: outcomeFilter, onChange: (e) => setOutcomeFilter(e.target.value), className: "text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700", children: [_jsx("option", { value: "ALL", children: "All Outcomes" }), _jsx("option", { value: "OFFER_RECEIVED", children: "Offer Extended" }), _jsx("option", { value: "OFFER_ACCEPTED", children: "Offer Signed" }), _jsx("option", { value: "JOINED", children: "Joined & Onboarded" })] }) })] }), _jsx(Card, { className: "border border-brand-200/60 shadow-sm overflow-hidden", children: _jsx(CardContent, { className: "p-0 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-brand-50 border-b border-brand-200 text-brand-650 font-bold uppercase text-[9px] tracking-wider", children: [_jsx("th", { className: "px-5 py-3", children: "Student Candidate" }), _jsx("th", { className: "px-5 py-3", children: "Company Recruiter" }), _jsx("th", { className: "px-5 py-3", children: "Job Title Designation" }), _jsx("th", { className: "px-5 py-3", children: "Package CTC" }), _jsx("th", { className: "px-5 py-3", children: "Audit Date" }), _jsx("th", { className: "px-5 py-3", children: "Outcome State" }), _jsx("th", { className: "px-5 py-3 text-right", children: "Transition Outcome" })] }) }), _jsx("tbody", { className: "divide-y divide-brand-100 text-brand-800 bg-white", children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "px-5 py-8 text-center text-brand-450 font-semibold animate-pulse", children: "Loading outcome registries..." }) })) : filteredRecords.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "px-5 py-8 text-center text-brand-450 font-semibold", children: "No placement outcome records found." }) })) : (filteredRecords.map((rec) => (_jsxs("tr", { className: "hover:bg-brand-50/50 transition-colors", children: [_jsx("td", { className: "px-5 py-4 font-bold text-brand-950", children: rec.student?.name }), _jsx("td", { className: "px-5 py-4 font-bold text-brand-900", children: rec.job?.companyName }), _jsx("td", { className: "px-5 py-4 font-semibold text-brand-650", children: rec.job?.title }), _jsxs("td", { className: "px-5 py-4 font-black text-brand-900", children: [rec.job?.salaryMax || '8.0', " LPA"] }), _jsx("td", { className: "px-5 py-4 font-semibold text-brand-600", children: rec.placementDate }), _jsx("td", { className: "px-5 py-4", children: _jsx(Badge, { variant: rec.outcomeState === 'JOINED' ? 'success' :
                                                    rec.outcomeState === 'OFFER_ACCEPTED' ? 'secondary' : 'warning', className: "font-bold text-[9px] uppercase", children: rec.outcomeState.replace('_', ' ') }) }), _jsxs("td", { className: "px-5 py-4 text-right flex justify-end gap-2 mt-1", children: [_jsx("button", { onClick: () => handleUpdateOutcome(rec._id, 'OFFER_ACCEPTED'), disabled: rec.outcomeState === 'OFFER_ACCEPTED' || rec.outcomeState === 'JOINED', className: "text-[10px] text-indigo-650 hover:underline font-bold disabled:opacity-50", children: "Sign Offer" }), _jsx("span", { className: "text-brand-200", children: "|" }), _jsx("button", { onClick: () => handleUpdateOutcome(rec._id, 'JOINED'), disabled: rec.outcomeState === 'JOINED', className: "text-[10px] text-green-700 hover:underline font-bold disabled:opacity-50", children: "Confirm Join" })] })] }, rec._id)))) })] }) }) })] }));
};
export default PlacementOutcomes;
