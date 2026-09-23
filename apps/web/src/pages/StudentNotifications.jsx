import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Bell, CheckCheck, Check, Sparkles, BookOpen, Briefcase, Info } from 'lucide-react';
export const StudentNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/notifications');
            setNotifications(res.data.data.notifications || []);
            setUnreadCount(res.data.data.unreadCount || 0);
        }
        catch (err) {
            setError('Failed to fetch notifications.');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchNotifications();
    }, []);
    const markSingleRead = async (id) => {
        try {
            await apiClient.put(`/notifications/${id}/read`);
            // Update local state
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        catch (err) {
            console.error(err);
        }
    };
    const markAllRead = async () => {
        try {
            await apiClient.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        }
        catch (err) {
            console.error(err);
        }
    };
    // Group notifications helper
    const groupNotifications = () => {
        const today = [];
        const yesterday = [];
        const earlier = [];
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        notifications.forEach(n => {
            const date = new Date(n.createdAt);
            const diffTime = Math.abs(now.getTime() - date.getTime());
            if (diffTime < oneDay && now.getDate() === date.getDate()) {
                today.push(n);
            }
            else if (diffTime < 2 * oneDay) {
                yesterday.push(n);
            }
            else {
                earlier.push(n);
            }
        });
        return { today, yesterday, earlier };
    };
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'academic':
                return _jsx(BookOpen, { className: "h-4 w-4 text-indigo-500" });
            case 'placement':
                return _jsx(Briefcase, { className: "h-4 w-4 text-green-500" });
            case 'career':
                return _jsx(Sparkles, { className: "h-4 w-4 text-amber-500" });
            case 'AI':
                return _jsx(Sparkles, { className: "h-4 w-4 text-indigo-600" });
            case 'system':
            default:
                return _jsx(Info, { className: "h-4 w-4 text-brand-500" });
        }
    };
    const { today, yesterday, earlier } = groupNotifications();
    if (loading) {
        return (_jsxs("div", { className: "space-y-6 max-w-4xl mx-auto animate-pulse", children: [_jsx("div", { className: "h-10 w-44 bg-brand-100 rounded-lg" }), _jsx("div", { className: "h-64 bg-brand-100 rounded-xl" })] }));
    }
    const renderSection = (title, list) => {
        if (list.length === 0)
            return null;
        return (_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-xs font-bold text-brand-500 uppercase tracking-wider px-1", children: title }), _jsx("div", { className: "space-y-2", children: list.map((n) => (_jsx(Card, { className: `border border-brand-200/50 transition-all ${n.read ? 'bg-white opacity-70' : 'bg-indigo-50/15 border-indigo-100/70 shadow-sm'}`, children: _jsxs(CardContent, { className: "p-4 flex items-start gap-4", children: [_jsx("div", { className: `p-2 rounded-xl shrink-0 ${n.read ? 'bg-brand-50 text-brand-500' : 'bg-indigo-50/70 text-indigo-700'}`, children: getNotificationIcon(n.type) }), _jsxs("div", { className: "flex-1 space-y-1", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs", children: [_jsx("span", { className: "font-bold text-brand-950", children: n.title }), _jsx("span", { className: "text-[10px] text-brand-400 font-semibold", children: new Date(n.createdAt).toLocaleDateString() })] }), _jsx("p", { className: "text-brand-700 leading-relaxed text-xs", children: n.message })] }), !n.read && (_jsx("button", { onClick: () => markSingleRead(n._id), className: "p-1 text-brand-400 hover:text-indigo-600 transition-colors shrink-0 tooltip", title: "Mark as read", children: _jsx(Check, { className: "h-4 w-4" }) }))] }) }, n._id))) })] }));
    };
    return (_jsxs("div", { className: "space-y-6 max-w-4xl mx-auto text-xs", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-brand-900 flex items-center gap-2", children: [_jsx(Bell, { className: "h-6 w-6 text-indigo-500" }), _jsx("span", { children: "Notification Hub" })] }), _jsx("p", { className: "text-sm text-brand-500 mt-1", children: "Keep updated with latest academic reports, job matches, mock evaluations, and system announcements." })] }), unreadCount > 0 && (_jsxs(Button, { onClick: markAllRead, variant: "secondary", className: "text-xs py-1.5 px-3 flex gap-1 items-center shrink-0 border-brand-200 hover:bg-brand-50", children: [_jsx(CheckCheck, { className: "h-4 w-4 text-indigo-650" }), _jsx("span", { children: "Mark all read" })] }))] }), error && (_jsx("div", { className: "p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg", children: error })), notifications.length === 0 ? (_jsx(Card, { className: "text-center p-12 border border-brand-200/60 shadow-sm text-brand-400", children: _jsxs(CardContent, { className: "space-y-2", children: [_jsx(Bell, { className: "h-8 w-8 mx-auto text-brand-300" }), _jsx("h3", { className: "font-bold text-brand-900 text-sm", children: "No Notifications Yet" }), _jsx("p", { className: "max-w-md mx-auto text-brand-500 text-xs", children: "We'll send you alerts when placement officers post jobs or AI agents complete evaluations." })] }) })) : (_jsxs("div", { className: "space-y-6", children: [renderSection('Today', today), renderSection('Yesterday', yesterday), renderSection('Earlier', earlier)] }))] }));
};
export default StudentNotifications;
