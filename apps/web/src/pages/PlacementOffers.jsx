import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Search, CheckCircle, XCircle } from 'lucide-react';
export const PlacementOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const fetchOffers = async () => {
        try {
            setLoading(true);
            setError(null);
            // Query applications with SELECTED or SHORTLISTED status acting as offer pipelines
            const res = await apiClient.get('/jobs/all-applications');
            const selectedApps = (res.data.data || []).filter((a) => a.status === 'SELECTED' || a.status === 'SHORTLISTED');
            setOffers(selectedApps);
        }
        catch (err) {
            setError('Failed to fetch offers registry.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOffers();
    }, []);
    const handleUpdateOfferStatus = async (appId, status) => {
        try {
            await apiClient.put(`/jobs/application/${appId}/status`, {
                status,
                remarks: `Offer status update to ${status} by Placement Cell`
            });
            fetchOffers();
        }
        catch (err) {
            alert('Failed to update offer status.');
        }
    };
    const filteredOffers = offers.filter((o) => {
        const matchesSearch = (o.student?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.job?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.job?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    return (_jsxs("div", { className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Job Offers Registry" }), _jsx("p", { className: "text-brand-500 mt-1", children: "Track company CTC compensation packages extended to students, monitor acceptance, and verify joining targets." })] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5", children: [_jsx(Card, { className: "border border-brand-200/60 shadow-sm text-center", children: _jsxs(CardContent, { className: "p-4 space-y-1", children: [_jsx("span", { className: "text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block", children: "Total Offers Released" }), _jsx("p", { className: "text-xl font-black text-brand-900", children: offers.length })] }) }), _jsx(Card, { className: "border border-brand-200/60 shadow-sm text-center", children: _jsxs(CardContent, { className: "p-4 space-y-1", children: [_jsx("span", { className: "text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block", children: "Offers Accepted" }), _jsx("p", { className: "text-xl font-black text-green-700", children: offers.filter((o) => o.status === 'SELECTED').length })] }) }), _jsx(Card, { className: "border border-brand-200/60 shadow-sm text-center", children: _jsxs(CardContent, { className: "p-4 space-y-1", children: [_jsx("span", { className: "text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block", children: "Pending Release Verification" }), _jsx("p", { className: "text-xl font-black text-amber-700", children: offers.filter((o) => o.status === 'SHORTLISTED').length })] }) })] }), _jsxs("div", { className: "bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between", children: [_jsxs("div", { className: "relative flex-1 w-full", children: [_jsx(Search, { className: "absolute left-3 top-3 h-4 w-4 text-brand-400" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search by candidate name or company...", className: "pl-9 w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white" })] }), _jsx("div", { className: "flex gap-2 w-full md:w-auto shrink-0", children: _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700", children: [_jsx("option", { value: "ALL", children: "All Outcomes" }), _jsx("option", { value: "SELECTED", children: "Offer Accepted" }), _jsx("option", { value: "SHORTLISTED", children: "Offer Pending" })] }) })] }), _jsx(Card, { className: "border border-brand-200/60 shadow-sm overflow-hidden", children: _jsx(CardContent, { className: "p-0 overflow-x-auto", children: _jsxs("table", { className: "w-full text-left border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-brand-50 border-b border-brand-200 text-brand-650 font-bold uppercase text-[9px] tracking-wider", children: [_jsx("th", { className: "px-5 py-3", children: "Student Name" }), _jsx("th", { className: "px-5 py-3", children: "Company Recruiter" }), _jsx("th", { className: "px-5 py-3", children: "Designation Role" }), _jsx("th", { className: "px-5 py-3", children: "CTC Package (LPA)" }), _jsx("th", { className: "px-5 py-3", children: "Verification Status" }), _jsx("th", { className: "px-5 py-3 text-right", children: "Outcomes Override" })] }) }), _jsx("tbody", { className: "divide-y divide-brand-100 text-brand-800 bg-white", children: loading ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-5 py-8 text-center text-brand-450 font-semibold animate-pulse", children: "Loading offers registry..." }) })) : filteredOffers.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-5 py-8 text-center text-brand-450 font-semibold", children: "No offers recorded." }) })) : (filteredOffers.map((o) => (_jsxs("tr", { className: "hover:bg-brand-50/50 transition-colors", children: [_jsx("td", { className: "px-5 py-4 font-bold text-brand-950", children: o.student?.name }), _jsx("td", { className: "px-5 py-4 font-bold text-brand-900", children: o.job?.companyName }), _jsx("td", { className: "px-5 py-4 font-semibold text-brand-650", children: o.job?.title }), _jsxs("td", { className: "px-5 py-4 font-black text-brand-900", children: [o.job?.salaryMax || '8.0', " LPA"] }), _jsx("td", { className: "px-5 py-4", children: _jsx(Badge, { variant: o.status === 'SELECTED' ? 'success' : 'warning', className: "font-bold text-[9px]", children: o.status === 'SELECTED' ? 'ACCEPTED' : 'PENDING APPROVAL' }) }), _jsxs("td", { className: "px-5 py-4 text-right flex justify-end gap-2.5 mt-1", children: [_jsxs("button", { onClick: () => handleUpdateOfferStatus(o._id, 'SELECTED'), disabled: o.status === 'SELECTED', className: "text-[10px] text-green-700 hover:underline font-bold disabled:opacity-50 inline-flex items-center gap-0.5", children: [_jsx(CheckCircle, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Accept Offer" })] }), _jsx("span", { className: "text-brand-200", children: "|" }), _jsxs("button", { onClick: () => handleUpdateOfferStatus(o._id, 'REJECTED'), className: "text-[10px] text-red-650 hover:underline font-bold inline-flex items-center gap-0.5", children: [_jsx(XCircle, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Decline Offer" })] })] })] }, o._id)))) })] }) }) })] }));
};
export default PlacementOffers;
