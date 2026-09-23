import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Bell, Check } from 'lucide-react';
export const PlacementNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchAlerts = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get('/notifications');
            setNotifications(res.data.data.notifications || []);
        }
        catch (err) {
            setError('Unable to fetch alerts.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAlerts();
    }, []);
    const handleMarkRead = async (id) => {
        try {
            await apiClient.put(`/notifications/${id}/read`);
            fetchAlerts();
        }
        catch (err) {
            alert('Failed to mark alert as read.');
        }
    };
    const handleMarkAllRead = async () => {
        try {
            await apiClient.put('/notifications/read-all');
            fetchAlerts();
        }
        catch (err) {
            alert('Failed to mark all alerts as read.');
        }
    };
    return (_jsxs("div", { className: "space-y-6 max-w-7xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-brand-900", children: "Operations Alerts Hub" }), _jsx("p", { className: "text-brand-500 mt-1", children: "Review active system notifications, eligibility approvals alerts, and recruiter feedback dispatches." })] }), notifications.some((n) => !n.read) && (_jsxs(Button, { onClick: handleMarkAllRead, className: "bg-indigo-650 hover:bg-indigo-700 text-white shrink-0 font-bold flex items-center gap-1", children: [_jsx(Check, { className: "h-4 w-4" }), _jsx("span", { children: "Mark All as Read" })] }))] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), _jsx(Card, { className: "border border-brand-200/60 shadow-sm bg-white overflow-hidden", children: _jsx(CardContent, { className: "p-0", children: loading ? (_jsx("p", { className: "p-6 text-center text-brand-450 font-semibold animate-pulse", children: "Loading notifications..." })) : notifications.length === 0 ? (_jsxs("div", { className: "p-12 text-center space-y-3", children: [_jsx(Bell, { className: "h-8 w-8 text-brand-400 mx-auto" }), _jsx("h3", { className: "font-bold text-brand-900 text-sm", children: "No new alerts" }), _jsx("p", { className: "text-brand-500 text-xs", children: "Your operations notifications tray is completely cleared." })] })) : (_jsx("div", { className: "divide-y divide-brand-100", children: notifications.map((n) => (_jsxs("div", { className: `p-4 flex items-start justify-between gap-4 transition-colors ${n.read ? 'opacity-60 bg-white' : 'bg-brand-50/20'}`, children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 bg-indigo-50 text-indigo-700 rounded-lg shrink-0 mt-0.5", children: _jsx(Bell, { className: "h-4 w-4" }) }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-extrabold text-brand-950", children: n.title }), _jsx(Badge, { variant: "secondary", className: "bg-brand-100 text-brand-700 font-bold text-[8.5px] uppercase", children: n.type || 'System' })] }), _jsx("p", { className: "text-brand-700 font-semibold leading-relaxed", children: n.message }), _jsx("span", { className: "block text-[9px] text-brand-400 font-bold", children: new Date(n.createdAt).toLocaleString() })] })] }), !n.read && (_jsxs("button", { onClick: () => handleMarkRead(n._id), className: "text-[10px] text-indigo-650 hover:underline font-bold shrink-0 flex items-center gap-0.5 border border-brand-200 bg-white px-2.5 py-1 rounded", children: [_jsx(Check, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Mark Read" })] }))] }, n._id))) })) }) })] }));
};
export default PlacementNotifications;
