import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiClient } from '../../api/client.js';
import { LayoutDashboard, UserCircle, Briefcase, Sparkles, LogOut, Menu, Bell, GraduationCap, Settings, ShieldAlert, BookOpen, FileText, ChevronLeft, ChevronRight, HelpCircle, FolderKanban, User, ListTodo, Calendar, TrendingUp, AlertCircle, CheckSquare, Users, Search, Plus } from 'lucide-react';
export const AppShell = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    // Fetch alerts
    const fetchAlerts = async () => {
        try {
            if (user) {
                const res = await apiClient.get('/notifications');
                setNotifications(res.data.data.notifications || []);
                setUnreadCount(res.data.data.unreadCount || 0);
            }
        }
        catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, [user]);
    const handleMarkAllRead = async () => {
        try {
            await apiClient.put('/notifications/read-all');
            fetchAlerts();
        }
        catch (err) {
            console.error(err);
        }
    };
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    // Grouped Navigation for STUDENT
    const studentNavGroups = [
        {
            group: 'OVERVIEW',
            links: [
                { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
            ]
        },
        {
            group: 'ACADEMIC',
            links: [
                { label: 'Academics', path: '/academics', icon: GraduationCap },
                { label: 'Learning Path', path: '/learning', icon: BookOpen }
            ]
        },
        {
            group: 'CAREER',
            links: [
                { label: 'Career Roadmap', path: '/career', icon: Sparkles },
                { label: 'Placements & Jobs', path: '/placements', icon: Briefcase },
                { label: 'Resume Optimizer', path: '/resume', icon: FileText }
            ]
        },
        {
            group: 'PROFILE',
            links: [
                { label: 'My Profile', path: '/profile', icon: UserCircle },
                { label: 'Skills & Projects', path: '/skills-projects', icon: FolderKanban },
                { label: 'Applications', path: '/applications', icon: ListTodo }
            ]
        },
        {
            group: 'SYSTEM',
            links: [
                { label: 'Notifications', path: '/notifications', icon: Bell },
                { label: 'Settings', path: '/settings', icon: Settings }
            ]
        }
    ];
    // Grouped Navigation for FACULTY
    const facultyNavGroups = [
        {
            group: 'OVERVIEW',
            links: [
                { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
            ]
        },
        {
            group: 'TEACHING',
            links: [
                { label: 'My Classes', path: '/faculty/classes', icon: BookOpen },
                { label: 'Courses', path: '/faculty/courses', icon: GraduationCap },
                { label: 'Timetable', path: '/faculty/timetable', icon: Calendar }
            ]
        },
        {
            group: 'STUDENTS',
            links: [
                { label: 'Students', path: '/faculty/students', icon: UserCircle },
                { label: 'Attendance', path: '/faculty/attendance', icon: CheckSquare },
                { label: 'Assessments', path: '/faculty/assessments', icon: FileText },
                { label: 'Marks', path: '/faculty/marks', icon: FolderKanban }
            ]
        },
        {
            group: 'ANALYTICS',
            links: [
                { label: 'Performance', path: '/faculty/performance', icon: TrendingUp },
                { label: 'At-Risk Students', path: '/faculty/at-risk', icon: AlertCircle },
                { label: 'AI Insights', path: '/faculty/ai-insights', icon: Sparkles }
            ]
        },
        {
            group: 'ACADEMIC',
            links: [
                { label: 'Calendar', path: '/faculty/calendar', icon: Calendar },
                { label: 'Announcements', path: '/faculty/announcements', icon: Bell }
            ]
        },
        {
            group: 'SYSTEM',
            links: [
                { label: 'Notifications', path: '/faculty/notifications', icon: Bell },
                { label: 'Settings', path: '/faculty/settings', icon: Settings }
            ]
        }
    ];
    // Grouped Navigation for PLACEMENT_OFFICER
    const placementNavGroups = [
        {
            group: 'OVERVIEW',
            links: [
                { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
            ]
        },
        {
            group: 'PLACEMENT OPERATIONS',
            links: [
                { label: 'Placement Drives', path: '/placement/drives', icon: Briefcase },
                { label: 'Applications', path: '/placement/applications', icon: ListTodo },
                { label: 'Interviews', path: '/placement/interviews', icon: Users },
                { label: 'Offers', path: '/placement/offers', icon: CheckSquare },
                { label: 'Placements', path: '/placement/placements', icon: GraduationCap }
            ]
        },
        {
            group: 'RECRUITERS',
            links: [
                { label: 'Companies', path: '/placement/companies', icon: Briefcase }
            ]
        },
        {
            group: 'STUDENTS',
            links: [
                { label: 'Students', path: '/placement/students', icon: UserCircle },
                { label: 'Eligibility', path: '/placement/readiness?tab=eligibility', icon: CheckSquare },
                { label: 'Readiness', path: '/placement/readiness', icon: TrendingUp },
                { label: 'At-Risk Students', path: '/placement/at-risk', icon: AlertCircle }
            ]
        },
        {
            group: 'ANALYTICS',
            links: [
                { label: 'Placement Analytics', path: '/placement/analytics', icon: TrendingUp },
                { label: 'AI Insights', path: '/placement/ai-insights', icon: Sparkles }
            ]
        },
        {
            group: 'ACADEMIC / EVENTS',
            links: [
                { label: 'Calendar', path: '/placement/calendar', icon: Calendar }
            ]
        },
        {
            group: 'SYSTEM',
            links: [
                { label: 'Notifications', path: '/placement/notifications', icon: Bell },
                { label: 'Reports', path: '/placement/reports', icon: FileText },
                { label: 'Settings', path: '/placement/settings', icon: Settings }
            ]
        }
    ];
    // Flat Links for other roles (to keep them working exactly as before)
    const getOtherRoleLinks = () => {
        if (!user)
            return [];
        switch (user.role) {
            case 'PLACEMENT_OFFICER':
                return [
                    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                    { label: 'Create Placement Drive', path: '/placement/drives', icon: Briefcase },
                    { label: 'Manage Jobs', path: '/jobs', icon: Settings },
                    { label: 'Placement Analytics Agent', path: '/placement/analytics-agent', icon: Sparkles },
                ];
            case 'ADMIN':
            case 'SUPER_ADMIN':
                return [
                    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                    { label: 'AI Observability', path: '/admin/agents', icon: Settings },
                    { label: 'Placement Oversight', path: '/placement/students', icon: Users },
                    { label: 'Analytics & Reports', path: '/placement/analytics', icon: ShieldAlert },
                ];
            default:
                return [];
        }
    };
    const [showQuickActions, setShowQuickActions] = useState(false);
    const otherLinks = getOtherRoleLinks();
    const isStudent = user?.role === 'STUDENT';
    const isFaculty = user?.role === 'FACULTY';
    const isPlacementOfficer = user?.role === 'PLACEMENT_OFFICER';
    const canCollapse = isStudent || isFaculty || isPlacementOfficer;
    // Helper to check active state
    const isActive = (path) => location.pathname === path;
    return (_jsxs("div", { className: "min-h-screen bg-brand-50 flex text-xs", children: [sidebarOpen && (_jsx("div", { className: "fixed inset-0 z-40 bg-brand-950/45 md:hidden transition-opacity", onClick: () => setSidebarOpen(false) })), _jsxs("aside", { className: `fixed inset-y-0 left-0 z-50 bg-brand-900 text-white flex flex-col transform transition-all duration-300 md:translate-x-0 md:relative shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed && canCollapse ? 'w-20' : 'w-64'}`, children: [_jsxs("div", { className: "h-16 flex items-center justify-between px-5 border-b border-brand-800", children: [_jsxs(Link, { to: "/dashboard", className: "flex items-center gap-2 font-bold text-sm tracking-wider text-white", children: [_jsx(Sparkles, { className: "h-5 w-5 text-indigo-400 shrink-0 animate-pulse" }), (!isCollapsed || !canCollapse) && _jsx("span", { children: "CAMPUSGENT AI" })] }), canCollapse && (_jsx("button", { onClick: () => setIsCollapsed(!isCollapsed), className: "hidden md:flex p-1 hover:bg-brand-800 rounded-md text-brand-400 hover:text-white", children: isCollapsed ? _jsx(ChevronRight, { className: "h-4 w-4" }) : _jsx(ChevronLeft, { className: "h-4 w-4" }) }))] }), _jsx("nav", { className: "flex-1 px-3 py-5 space-y-4 overflow-y-auto", children: isStudent ? (
                        // Student Grouped Sidebar Navigation
                        studentNavGroups.map((group) => (_jsxs("div", { className: "space-y-1", children: [(!isCollapsed) && (_jsx("span", { className: "block px-3 text-[9px] font-bold text-brand-400 tracking-widest uppercase mb-1", children: group.group })), group.links.map((link) => {
                                    const Icon = link.icon;
                                    const active = isActive(link.path);
                                    return (_jsxs(Link, { to: link.path, onClick: () => setSidebarOpen(false), className: `flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors group relative ${active
                                            ? 'bg-brand-800 text-indigo-300 border-l-2 border-indigo-400'
                                            : 'text-brand-300 hover:bg-brand-800 hover:text-white'}`, children: [_jsx(Icon, { className: "h-4.5 w-4.5 shrink-0" }), !isCollapsed && _jsx("span", { children: link.label }), isCollapsed && (_jsx("div", { className: "absolute left-16 bg-brand-950 text-white font-bold text-[10px] rounded px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-md", children: link.label }))] }, link.path));
                                })] }, group.group)))) : isFaculty ? (
                        // Faculty Grouped Sidebar Navigation
                        facultyNavGroups.map((group) => (_jsxs("div", { className: "space-y-1", children: [(!isCollapsed) && (_jsx("span", { className: "block px-3 text-[9px] font-bold text-brand-400 tracking-widest uppercase mb-1", children: group.group })), group.links.map((link) => {
                                    const Icon = link.icon;
                                    const active = isActive(link.path);
                                    return (_jsxs(Link, { to: link.path, onClick: () => setSidebarOpen(false), className: `flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors group relative ${active
                                            ? 'bg-brand-800 text-indigo-300 border-l-2 border-indigo-400'
                                            : 'text-brand-300 hover:bg-brand-800 hover:text-white'}`, children: [_jsx(Icon, { className: "h-4.5 w-4.5 shrink-0" }), !isCollapsed && _jsx("span", { children: link.label }), isCollapsed && (_jsx("div", { className: "absolute left-16 bg-brand-950 text-white font-bold text-[10px] rounded px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-md", children: link.label }))] }, link.path));
                                })] }, group.group)))) : isPlacementOfficer ? (
                        // Placement Officer Grouped Navigation
                        placementNavGroups.map((group) => (_jsxs("div", { className: "space-y-1", children: [(!isCollapsed) && (_jsx("span", { className: "block px-3 text-[9px] font-bold text-brand-400 tracking-widest uppercase mb-1", children: group.group })), group.links.map((link) => {
                                    const Icon = link.icon;
                                    const active = isActive(link.path);
                                    return (_jsxs(Link, { to: link.path, onClick: () => setSidebarOpen(false), className: `flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors group relative ${active
                                            ? 'bg-brand-800 text-indigo-300 border-l-2 border-indigo-400'
                                            : 'text-brand-300 hover:bg-brand-800 hover:text-white'}`, children: [_jsx(Icon, { className: "h-4.5 w-4.5 shrink-0" }), !isCollapsed && _jsx("span", { children: link.label }), isCollapsed && (_jsx("div", { className: "absolute left-16 bg-brand-950 text-white font-bold text-[10px] rounded px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-md", children: link.label }))] }, link.path));
                                })] }, group.group)))) : (
                        // Admin Navigation
                        otherLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.path);
                            return (_jsxs(Link, { to: link.path, onClick: () => setSidebarOpen(false), className: `flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors ${active ? 'bg-brand-800 text-indigo-300 border-l-2 border-indigo-400' : 'text-brand-300 hover:bg-brand-800 hover:text-white'}`, children: [_jsx(Icon, { className: "h-4.5 w-4.5 shrink-0" }), _jsx("span", { children: link.label })] }, link.path));
                        })) }), _jsxs("div", { className: "p-4 border-t border-brand-800 space-y-2", children: [(!isCollapsed || !canCollapse) ? (_jsxs("div", { className: "flex items-center gap-3 px-2 py-1", children: [_jsx("div", { className: "bg-brand-800 p-2.5 rounded-lg font-bold text-white shrink-0", children: user?.name.slice(0, 2).toUpperCase() }), _jsxs("div", { className: "truncate", children: [_jsx("p", { className: "font-bold text-white truncate", children: user?.name }), _jsx("p", { className: "text-[10px] text-brand-450 truncate", children: user?.role })] })] })) : (_jsx("div", { className: "mx-auto w-10 h-10 bg-brand-800 rounded-lg flex items-center justify-center font-bold text-white shrink-0", children: user?.name.slice(0, 2).toUpperCase() })), _jsxs("button", { onClick: handleLogout, className: `w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-red-300 hover:bg-brand-800 hover:text-red-200 transition-colors ${isCollapsed && canCollapse ? 'justify-center' : ''}`, children: [_jsx(LogOut, { className: "h-4.5 w-4.5 shrink-0" }), (!isCollapsed || !canCollapse) && _jsx("span", { children: "Log Out" })] })] })] }), _jsxs("div", { className: "flex-1 flex flex-col overflow-x-hidden min-h-screen", children: [_jsxs("header", { className: "h-16 bg-white border-b border-brand-200/60 flex items-center justify-between px-6 shrink-0 relative z-30 shadow-sm", children: [_jsx("button", { onClick: () => setSidebarOpen(true), className: "md:hidden p-2 hover:bg-brand-50 rounded-lg text-brand-700 shrink-0", children: _jsx(Menu, { className: "h-5.5 w-5.5" }) }), _jsxs("div", { className: "hidden sm:flex items-center gap-4", children: [_jsx("span", { className: "text-[9px] font-bold text-brand-450 uppercase tracking-widest bg-brand-50 px-2.5 py-1 rounded shrink-0", children: isStudent ? 'AUTONOMOUS STUDENT SUCCESS PLATFORM' : isFaculty ? 'COGNITIVE FACULTY SHELL' : isPlacementOfficer ? 'PLACEMENT COMMAND CENTER' : 'CAMPUSGENT COGNITIVE SHELL' }), isPlacementOfficer && (_jsxs("div", { className: "flex items-center gap-2 bg-brand-50 border border-brand-200/60 px-3 py-1 rounded-lg w-64 text-brand-650", children: [_jsx(Search, { className: "h-3.5 w-3.5 text-brand-400 shrink-0" }), _jsx("input", { type: "text", placeholder: "Search students, companies...", className: "bg-transparent border-none outline-none text-[10px] w-full text-brand-800" })] }))] }), _jsxs("div", { className: "flex items-center gap-4", children: [isPlacementOfficer && (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setShowQuickActions(!showQuickActions), className: "bg-indigo-650 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 text-[10px] transition-colors", children: [_jsx(Plus, { className: "h-3.5 w-3.5" }), _jsx("span", { children: "Quick Action" })] }), showQuickActions && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-40", onClick: () => setShowQuickActions(false) }), _jsxs("div", { className: "absolute right-0 mt-2 w-44 bg-white border border-brand-200 rounded-xl shadow-lg py-1.5 z-50 text-[10.5px]", children: [_jsx(Link, { to: "/placement/drives", onClick: () => setShowQuickActions(false), className: "block px-4 py-2 hover:bg-brand-50 text-brand-700 font-semibold border-b border-brand-50", children: "Create Drive" }), _jsx(Link, { to: "/placement/companies", onClick: () => setShowQuickActions(false), className: "block px-4 py-2 hover:bg-brand-50 text-brand-700 font-semibold border-b border-brand-50", children: "Add Company" }), _jsx(Link, { to: "/placement/applications", onClick: () => setShowQuickActions(false), className: "block px-4 py-2 hover:bg-brand-50 text-brand-700 font-semibold", children: "View Applications" })] })] }))] })), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setShowNotifications(!showNotifications), className: "p-2 hover:bg-brand-50 rounded-full relative transition-colors text-brand-650", children: [_jsx(Bell, { className: "h-5 w-5" }), unreadCount > 0 && (_jsx("span", { className: "absolute top-1.5 right-1.5 bg-red-500 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center", children: unreadCount }))] }), showNotifications && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-40", onClick: () => setShowNotifications(false) }), _jsxs("div", { className: "absolute right-0 mt-2 w-80 bg-white border border-brand-200 rounded-xl shadow-lg py-2 z-50 max-h-96 overflow-y-auto", children: [_jsxs("div", { className: "px-4 py-2 border-b border-brand-100 flex items-center justify-between", children: [_jsx("span", { className: "font-bold text-brand-850 text-xs", children: "Notifications" }), unreadCount > 0 && (_jsx("button", { onClick: handleMarkAllRead, className: "text-[10px] font-bold text-indigo-650 hover:underline", children: "Mark all read" }))] }), notifications.length === 0 ? (_jsx("div", { className: "px-4 py-6 text-center text-xs text-brand-400", children: "No notifications yet" })) : (notifications.slice(0, 5).map((n) => (_jsxs("div", { className: `px-4 py-3 border-b border-brand-50 text-[11px] ${n.read ? 'opacity-65' : 'bg-brand-50/30'}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-0.5", children: [_jsx("span", { className: "font-bold text-brand-900", children: n.title }), _jsx("span", { className: "text-[9px] text-brand-400", children: new Date(n.createdAt).toLocaleDateString() })] }), _jsx("p", { className: "text-brand-650 leading-relaxed truncate", children: n.message })] }, n._id)))), _jsx(Link, { to: isFaculty ? "/faculty/notifications" : "/notifications", onClick: () => setShowNotifications(false), className: "block text-center pt-2 text-[10px] font-bold text-indigo-650 hover:underline border-t border-brand-50 mt-1", children: "View all notifications" })] })] }))] }), _jsx("button", { className: "hidden sm:block p-2 hover:bg-brand-50 rounded-full text-brand-500", children: _jsx(HelpCircle, { className: "h-5 w-5" }) }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setShowProfileMenu(!showProfileMenu), className: "flex items-center gap-2 p-1 hover:bg-brand-50 rounded-lg transition-colors text-left", children: [_jsx("div", { className: "h-7 w-7 bg-brand-900 text-white rounded-lg flex items-center justify-center font-bold text-xs shrink-0", children: user?.name.slice(0, 2).toUpperCase() }), _jsx("span", { className: "hidden md:inline font-bold text-brand-850 text-xs truncate max-w-[100px]", children: user?.name.split(' ')[0] })] }), showProfileMenu && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-40", onClick: () => setShowProfileMenu(false) }), _jsxs("div", { className: "absolute right-0 mt-2 w-44 bg-white border border-brand-200 rounded-xl shadow-lg py-1.5 z-50", children: [_jsxs(Link, { to: isFaculty ? "/faculty/settings" : "/profile", onClick: () => setShowProfileMenu(false), className: "flex items-center gap-2 px-4 py-2 hover:bg-brand-50 text-brand-700 font-semibold transition-colors", children: [_jsx(User, { className: "h-4 w-4" }), _jsx("span", { children: "My Profile" })] }), _jsxs(Link, { to: isFaculty ? "/faculty/settings" : "/settings", onClick: () => setShowProfileMenu(false), className: "flex items-center gap-2 px-4 py-2 hover:bg-brand-50 text-brand-700 font-semibold transition-colors", children: [_jsx(Settings, { className: "h-4 w-4" }), _jsx("span", { children: "Settings" })] }), _jsx("div", { className: "border-t border-brand-100 my-1" }), _jsxs("button", { onClick: () => {
                                                                    setShowProfileMenu(false);
                                                                    handleLogout();
                                                                }, className: "w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-brand-50 text-red-650 font-semibold transition-colors", children: [_jsx(LogOut, { className: "h-4 w-4" }), _jsx("span", { children: "Log Out" })] })] })] }))] })] })] }), _jsx("main", { className: "flex-1 p-6 md:p-8 bg-brand-50/30 overflow-y-auto", children: children })] })] }));
};
export default AppShell;
