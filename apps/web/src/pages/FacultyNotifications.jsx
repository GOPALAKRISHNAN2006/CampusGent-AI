import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Bell, Check, Clock } from 'lucide-react';
export const FacultyNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchAlerts = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/notifications');
            setNotifications(res.data.data.notifications || []);
        }
        catch (err) {
            setError('Failed to load notifications feed.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAlerts();
    }, []);
    const handleMarkAllRead = async () => {
        try {
            await apiClient.put('/notifications/read-all');
            fetchAlerts();
        }
        catch (err) {
            console.error(err);
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-8 w-44 bg-brand-100 rounded" }), _jsx("div", { className: "h-44 bg-brand-100 rounded-xl" })] }));
    }
    return (_jsxs("div", { className: "space-y-6 max-w-6xl mx-auto text-xs animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-xl font-bold text-brand-900 flex items-center gap-1.5", children: [_jsx(Bell, { className: "h-5.5 w-5.5 text-brand-500" }), _jsx("span", { children: "Faculty Notifications Hub" })] }), _jsx("p", { className: "text-xs text-brand-500 mt-1", children: "Review alerts regarding student attendance warnings and task submissions." })] }), notifications.some(n => !n.read) && (_jsxs(Button, { onClick: handleMarkAllRead, className: "bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl flex gap-1.5 items-center h-9", children: [_jsx(Check, { className: "h-4 w-4" }), _jsx("span", { children: "Mark All as Read" })] }))] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), _jsx(Card, { className: "border border-brand-200/60 shadow-sm overflow-hidden", children: _jsx(CardContent, { className: "p-0 divide-y divide-brand-100", children: notifications.length === 0 ? (_jsx("div", { className: "p-8 text-center text-brand-450", children: "No notifications yet." })) : (notifications.map((n) => (_jsxs("div", { className: `p-4 flex gap-4 items-start hover:bg-brand-50/20 transition-colors ${!n.read ? 'bg-brand-50/30' : ''}`, children: [_jsx("div", { className: "bg-indigo-50 text-indigo-700 p-2 rounded-lg shrink-0 mt-0.5", children: _jsx(Bell, { className: "h-4 w-4" }) }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex justify-between items-start gap-4", children: [_jsx("h4", { className: "font-bold text-brand-900 text-xs", children: n.title }), _jsxs("span", { className: "text-[9px] text-brand-400 font-semibold shrink-0 flex items-center gap-1", children: [_jsx(Clock, { className: "h-3.5 w-3.5" }), _jsx("span", { children: new Date(n.createdAt).toLocaleDateString() })] })] }), _jsx("p", { className: "text-brand-650 leading-relaxed text-[11px]", children: n.message })] })] }, n._id)))) }) })] }));
};
export default FacultyNotifications;
