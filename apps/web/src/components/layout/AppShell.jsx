import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiClient } from '../../api/client.js';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, UserCircle, Briefcase, Sparkles, LogOut, Menu,
    Bell, GraduationCap, Settings, ShieldAlert, BookOpen, FileText,
    ChevronLeft, ChevronRight, FolderKanban, User,
    ListTodo, Calendar, TrendingUp, AlertCircle, CheckSquare, Users,
    Search, Plus, X, ExternalLink
} from 'lucide-react';

const EASE_APPLE = [0.16, 1, 0.3, 1];

/* Dropdown animation variant */
const dropdownVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.96, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.22, ease: EASE_APPLE } },
    exit: { opacity: 0, y: -4, scale: 0.98, filter: 'blur(2px)', transition: { duration: 0.15, ease: EASE_APPLE } },
};

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
    const [showQuickActions, setShowQuickActions] = useState(false);

    // Fetch alerts
    const fetchAlerts = async () => {
        try {
            if (user) {
                const res = await apiClient.get('/notifications');
                setNotifications(res.data.data?.notifications || []);
                setUnreadCount(res.data.data?.unreadCount || 0);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const handleMarkAllRead = async () => {
        try {
            await apiClient.put('/notifications/read-all');
            fetchAlerts();
        } catch (err) {
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
            group: 'CAREER & AI',
            links: [
                { label: 'Career Roadmap', path: '/career', icon: Sparkles },
                { label: 'Placements & Jobs', path: '/placements', icon: Briefcase },
                { label: 'Resume Optimizer', path: '/resume', icon: FileText }
            ]
        },
        {
            group: 'PORTFOLIO',
            links: [
                { label: 'My Profile', path: '/profile', icon: UserCircle },
                { label: 'Skills & Projects', path: '/skills-projects', icon: FolderKanban },
                { label: 'Applications', path: '/applications', icon: ListTodo }
            ]
        },
        {
            group: 'PREFERENCES',
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
            group: 'ANALYTICS & AI',
            links: [
                { label: 'Performance', path: '/faculty/performance', icon: TrendingUp },
                { label: 'At-Risk Students', path: '/faculty/at-risk', icon: AlertCircle },
                { label: 'AI Insights', path: '/faculty/ai-insights', icon: Sparkles }
            ]
        },
        {
            group: 'SYSTEM',
            links: [
                { label: 'Calendar', path: '/faculty/calendar', icon: Calendar },
                { label: 'Announcements', path: '/faculty/announcements', icon: Bell },
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
            group: 'OPERATIONS',
            links: [
                { label: 'Placement Drives', path: '/placement/drives', icon: Briefcase },
                { label: 'Applications', path: '/placement/applications', icon: ListTodo },
                { label: 'Interviews', path: '/placement/interviews', icon: Users },
                { label: 'Offers', path: '/placement/offers', icon: CheckSquare },
                { label: 'Placements', path: '/placement/placements', icon: GraduationCap }
            ]
        },
        {
            group: 'RECRUITERS & TALENT',
            links: [
                { label: 'Companies', path: '/placement/companies', icon: Briefcase },
                { label: 'Students', path: '/placement/students', icon: UserCircle },
                { label: 'Readiness & Eligibility', path: '/placement/readiness', icon: TrendingUp },
                { label: 'At-Risk Registry', path: '/placement/at-risk', icon: AlertCircle }
            ]
        },
        {
            group: 'INTELLIGENCE',
            links: [
                { label: 'Placement Analytics', path: '/placement/analytics', icon: TrendingUp },
                { label: 'AI Insights', path: '/placement/ai-insights', icon: Sparkles },
                { label: 'Calendar', path: '/placement/calendar', icon: Calendar },
                { label: 'Reports', path: '/placement/reports', icon: FileText }
            ]
        },
        {
            group: 'SYSTEM',
            links: [
                { label: 'Notifications', path: '/placement/notifications', icon: Bell },
                { label: 'Settings', path: '/placement/settings', icon: Settings }
            ]
        }
    ];

    // Admin Navigation
    const adminNavLinks = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'AI Observability', path: '/admin/agents', icon: Settings },
        { label: 'Placement Oversight', path: '/placement/students', icon: Users },
        { label: 'Analytics & Reports', path: '/placement/analytics', icon: ShieldAlert },
    ];

    const isStudent = user?.role === 'STUDENT';
    const isFaculty = user?.role === 'FACULTY';
    const isPlacementOfficer = user?.role === 'PLACEMENT_OFFICER';
    const canCollapse = isStudent || isFaculty || isPlacementOfficer;

    const isActive = (path) => {
        if (path.includes('?')) {
            return location.pathname === path.split('?')[0];
        }
        return location.pathname === path;
    };

    const getRoleNavGroups = () => {
        if (isStudent) return studentNavGroups;
        if (isFaculty) return facultyNavGroups;
        if (isPlacementOfficer) return placementNavGroups;
        return null;
    };

    const navGroups = getRoleNavGroups();

    const getRoleHeaderBadge = () => {
        if (isStudent) return 'Autonomous Student Success Platform';
        if (isFaculty) return 'Cognitive Faculty Shell';
        if (isPlacementOfficer) return 'Placement Command Center';
        return 'CampusGent Intelligence Platform';
    };

    const sidebarWidthClass = isCollapsed && canCollapse ? 'w-20' : 'w-64';
    const mainMarginClass = isCollapsed && canCollapse ? 'md:pl-20' : 'md:pl-64';

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-xs font-sans antialiased text-[#1F150C] relative">
            {/* Mobile backdrop overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-40 bg-[#000000]/70 backdrop-blur-sm md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* FIXED Left Sidebar (Espresso Noir with Double-Bezel nested elements) */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 bg-[#1F150C] text-[#E1DCC9] flex flex-col transition-all duration-300 ease-apple border-r border-[#412D15]/80 shadow-[4px_0_24px_rgba(0,0,0,0.25)] ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                } ${sidebarWidthClass}`}
            >
                {/* Sidebar Brand Header */}
                <div className="h-16 flex items-center justify-between px-4 sm:px-5 border-b border-[#412D15]/80 shrink-0 bg-[#140D07]/60">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 font-bold tracking-wider text-white group min-w-0"
                    >
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#412D15] to-[#1F150C] border border-[#E1DCC9]/40 flex items-center justify-center text-[#E1DCC9] shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                            <Sparkles className="h-4.5 w-4.5 text-[#E1DCC9] animate-pulse" />
                        </div>
                        {(!isCollapsed || !canCollapse) && (
                            <div className="truncate">
                                <span className="block text-xs font-black tracking-[0.14em] text-white leading-none">
                                    CAMPUSGENT
                                </span>
                                <span className="block text-[8.5px] font-bold uppercase tracking-[0.2em] text-[#E1DCC9]/80 mt-0.5">
                                    AI PLATFORM
                                </span>
                            </div>
                        )}
                    </Link>

                    {canCollapse && (
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden md:flex p-1.5 hover:bg-[#412D15]/60 rounded-lg text-[#E1DCC9]/70 hover:text-white transition-colors cursor-pointer"
                            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        </button>
                    )}

                    {/* Mobile close button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden p-1.5 hover:bg-[#412D15]/60 rounded-lg text-[#E1DCC9]/70 hover:text-white transition-colors cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Nav Links Scrollable Viewport */}
                <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#412D15] scrollbar-track-transparent">
                    {navGroups ? (
                        navGroups.map((group) => (
                            <div key={group.group} className="space-y-1">
                                {!isCollapsed && (
                                    <span className="block px-3 text-[9px] font-bold text-[#C9BF9F]/80 tracking-[0.18em] uppercase mb-1.5 select-none">
                                        {group.group}
                                    </span>
                                )}
                                {group.links.map((link) => {
                                    const Icon = link.icon;
                                    const active = isActive(link.path);
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all duration-200 ease-apple group relative ${
                                                active
                                                    ? 'bg-gradient-to-r from-[#412D15] via-[#31210F] to-[#1F150C] text-[#FAF7F2] border-l-[3px] border-[#E1DCC9] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.3)] font-bold'
                                                    : 'text-[#E1DCC9]/75 hover:bg-[#412D15]/40 hover:text-white'
                                            }`}
                                        >
                                            <Icon
                                                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                                                    active
                                                        ? 'text-[#E1DCC9] scale-110'
                                                        : 'text-[#E1DCC9]/70 group-hover:text-white group-hover:scale-105'
                                                }`}
                                            />
                                            {(!isCollapsed || !canCollapse) && (
                                                <span className="truncate">{link.label}</span>
                                            )}
                                            {isCollapsed && canCollapse && (
                                                <div className="absolute left-16 bg-[#000000] border border-[#412D15] text-[#E1DCC9] font-bold text-[11px] rounded-lg px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl">
                                                    {link.label}
                                                </div>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        ))
                    ) : (
                        adminNavLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.path);
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all duration-200 ease-apple group relative ${
                                        active
                                            ? 'bg-gradient-to-r from-[#412D15] via-[#31210F] to-[#1F150C] text-[#FAF7F2] border-l-[3px] border-[#E1DCC9] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.3)] font-bold'
                                            : 'text-[#E1DCC9]/75 hover:bg-[#412D15]/40 hover:text-white'
                                    }`}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {(!isCollapsed || !canCollapse) && (
                                        <span className="truncate">{link.label}</span>
                                    )}
                                </Link>
                            );
                        })
                    )}
                </nav>

                {/* Fixed Sidebar Bottom User Profile Card */}
                <div className="p-3 border-t border-[#412D15]/80 space-y-2 bg-[#140D07] shrink-0">
                    {(!isCollapsed || !canCollapse) ? (
                        <div className="flex items-center gap-3 p-2 rounded-2xl bg-[#1F150C] border border-[#412D15] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#412D15] to-[#1F150C] border border-[#E1DCC9]/40 flex items-center justify-center font-black text-[#E1DCC9] text-xs shadow-xs shrink-0 ring-1 ring-white/10">
                                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CG'}
                            </div>
                            <div className="truncate flex-1 min-w-0">
                                <p className="font-bold text-white text-xs truncate leading-tight">
                                    {user?.name || 'User Account'}
                                </p>
                                <p className="text-[9.5px] uppercase tracking-wider text-[#E1DCC9]/75 font-semibold truncate mt-0.5">
                                    {user?.role?.replace('_', ' ')}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto w-10 h-10 bg-gradient-to-tr from-[#412D15] to-[#1F150C] border border-[#E1DCC9]/40 rounded-xl flex items-center justify-center font-bold text-[#E1DCC9] text-xs shrink-0 shadow-xs ring-1 ring-white/10">
                            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CG'}
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-rose-300 hover:bg-rose-500/15 transition-all duration-150 cursor-pointer ${
                            isCollapsed && canCollapse ? 'justify-center' : ''
                        }`}
                        title="Log Out"
                    >
                        <LogOut className="h-4 w-4 shrink-0 text-rose-400" />
                        {(!isCollapsed || !canCollapse) && <span>Log Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Viewport (offset by fixed sidebar width) */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-apple ${mainMarginClass}`}>
                {/* Top Sticky Navbar */}
                <header className="h-16 glass-navbar flex items-center justify-between px-5 sm:px-6 md:px-8 shrink-0 sticky top-0 z-30">
                    {/* Left: Mobile menu toggle & Contextual Breadcrumb Badge */}
                    <div className="flex items-center gap-3.5">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 hover:bg-[#F4EFE6] rounded-xl text-[#1F150C] transition-colors cursor-pointer"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4EFE6] border border-[#E1DCC9] text-[10px] font-bold text-[#1F150C] uppercase tracking-widest shadow-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#412D15] animate-pulse shrink-0" />
                            <span>{getRoleHeaderBadge()}</span>
                        </div>
                    </div>

                    {/* Center: Quick Search Bar */}
                    {(isPlacementOfficer || isFaculty) && (
                        <div className="hidden lg:flex items-center gap-2 bg-[#F4EFE6] border border-[#E1DCC9] px-3.5 py-1.5 rounded-xl w-72 text-[#1F150C] focus-within:border-[#412D15] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#412D15]/10 transition-all shadow-xs">
                            <Search className="h-3.5 w-3.5 text-[#6B5336] shrink-0" />
                            <input
                                type="text"
                                placeholder="Search students, drives, skills..."
                                className="bg-transparent border-none outline-none text-xs w-full text-[#1F150C] placeholder:text-[#8F7554]"
                            />
                            <kbd className="px-1.5 py-0.5 text-[9px] font-mono text-[#6B5336] bg-white border border-[#E1DCC9] rounded">
                                Ctrl K
                            </kbd>
                        </div>
                    )}

                    {/* Right: Actions & Profile Menu */}
                    <div className="flex items-center gap-3">
                        {/* Quick Action Button for Placement Officers */}
                        {isPlacementOfficer && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowQuickActions(!showQuickActions)}
                                    className="bg-gradient-to-r from-[#1F150C] to-[#000000] hover:from-[#412D15] hover:to-[#1F150C] text-[#E1DCC9] border border-[#412D15] font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs shadow-sm transition-all cursor-pointer"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Quick Action</span>
                                </button>
                                <AnimatePresence>
                                {showQuickActions && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowQuickActions(false)} />
                                        <motion.div
                                            variants={dropdownVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="absolute right-0 mt-2 w-48 bg-white border border-[#E1DCC9] rounded-2xl shadow-xl py-1.5 z-50 text-xs"
                                        >
                                            <Link
                                                to="/placement/drives"
                                                onClick={() => setShowQuickActions(false)}
                                                className="block px-4 py-2 hover:bg-[#FAF7F2] text-[#1F150C] font-semibold border-b border-[#E1DCC9]/70 transition-colors"
                                            >
                                                + Create Placement Drive
                                            </Link>
                                            <Link
                                                to="/placement/companies"
                                                onClick={() => setShowQuickActions(false)}
                                                className="block px-4 py-2 hover:bg-[#FAF7F2] text-[#1F150C] font-semibold border-b border-[#E1DCC9]/70 transition-colors"
                                            >
                                                + Add Company Profile
                                            </Link>
                                            <Link
                                                to="/placement/applications"
                                                onClick={() => setShowQuickActions(false)}
                                                className="block px-4 py-2 hover:bg-[#FAF7F2] text-[#1F150C] font-semibold transition-colors"
                                            >
                                                Review Applications
                                            </Link>
                                        </motion.div>
                                    </>
                                )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Notifications Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 hover:bg-[#F4EFE6] rounded-xl relative transition-colors text-[#412D15] hover:text-[#000000] cursor-pointer"
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-[#412D15] text-[#E1DCC9] font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>
                            <AnimatePresence>
                            {showNotifications && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                                    <motion.div
                                        variants={dropdownVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E1DCC9] rounded-2xl shadow-xl py-2 z-50 max-h-[28rem] overflow-y-auto">
                                        <div className="px-4 py-2.5 border-b border-[#E1DCC9]/70 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-[#1F150C] text-xs">Notifications</span>
                                                {unreadCount > 0 && (
                                                    <span className="bg-[#F4EFE6] text-[#412D15] border border-[#E1DCC9] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                        {unreadCount} new
                                                    </span>
                                                )}
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={handleMarkAllRead}
                                                    className="text-[11px] font-bold text-[#412D15] hover:text-[#000000] transition-colors cursor-pointer"
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-8 text-center text-[#8F7554] space-y-1">
                                                <Bell className="h-6 w-6 mx-auto text-[#C9BF9F] mb-2" />
                                                <p className="text-xs font-semibold text-[#1F150C]">All caught up!</p>
                                                <p className="text-[11px] text-[#8F7554]">No new notifications right now.</p>
                                            </div>
                                        ) : (
                                            notifications.slice(0, 5).map((n) => (
                                                <div
                                                    key={n._id}
                                                    className={`px-4 py-3 border-b border-[#E1DCC9]/50 text-xs transition-colors hover:bg-[#FAF7F2] ${
                                                        n.read ? 'opacity-60' : 'bg-[#FAF7F2]'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <span className="font-bold text-[#1F150C]">{n.title}</span>
                                                        <span className="text-[9.5px] text-[#8F7554] font-medium">
                                                            {new Date(n.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-[#6B5336] leading-relaxed text-[11px] line-clamp-2">
                                                        {n.message}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                        <Link
                                            to={isFaculty ? "/faculty/notifications" : isPlacementOfficer ? "/placement/notifications" : "/notifications"}
                                            onClick={() => setShowNotifications(false)}
                                            className="block text-center py-2 text-[11px] font-bold text-[#412D15] hover:text-[#000000] transition-colors border-t border-[#E1DCC9]/70 mt-1"
                                        >
                                            View all notifications →
                                        </Link>
                                    </motion.div>
                                </>
                            )}
                            </AnimatePresence>
                        </div>

                        {/* Profile Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 p-1.5 hover:bg-[#F4EFE6] rounded-xl transition-colors cursor-pointer text-left"
                            >
                                <div className="h-8 w-8 bg-gradient-to-br from-[#1F150C] to-[#000000] border border-[#412D15] text-[#E1DCC9] rounded-xl flex items-center justify-center font-black text-xs shadow-xs">
                                    {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CG'}
                                </div>
                                <span className="hidden md:inline font-bold text-[#1F150C] text-xs truncate max-w-[110px]">
                                    {user?.name ? user.name.split(' ')[0] : 'Account'}
                                </span>
                            </button>
                            <AnimatePresence>
                            {showProfileMenu && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                                    <motion.div
                                        variants={dropdownVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="absolute right-0 mt-2 w-52 bg-white border border-[#E1DCC9] rounded-2xl shadow-xl py-2 z-50 text-xs">
                                        <div className="px-4 py-2 border-b border-[#E1DCC9]/70">
                                            <p className="font-bold text-[#1F150C] truncate">{user?.name}</p>
                                            <p className="text-[10px] text-[#6B5336] font-medium truncate">{user?.email}</p>
                                        </div>
                                        <Link
                                            to={isFaculty ? "/faculty/settings" : isPlacementOfficer ? "/placement/settings" : "/profile"}
                                            onClick={() => setShowProfileMenu(false)}
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-[#FAF7F2] text-[#1F150C] font-semibold transition-colors"
                                        >
                                            <User className="h-4 w-4 text-[#6B5336]" />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link
                                            to={isFaculty ? "/faculty/settings" : isPlacementOfficer ? "/placement/settings" : "/settings"}
                                            onClick={() => setShowProfileMenu(false)}
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-[#FAF7F2] text-[#1F150C] font-semibold transition-colors"
                                        >
                                            <Settings className="h-4 w-4 text-[#6B5336]" />
                                            <span>Settings</span>
                                        </Link>
                                        <div className="border-t border-[#E1DCC9]/70 my-1" />
                                        <button
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                handleLogout();
                                            }}
                                            className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-700 font-semibold transition-colors cursor-pointer"
                                        >
                                            <LogOut className="h-4 w-4 text-rose-600" />
                                            <span>Log Out</span>
                                        </button>
                                    </motion.div>
                                </>
                            )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Dynamic Main Page Content Viewport */}
                <main className="flex-1 p-5 sm:p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: EASE_APPLE }}
                        className="space-y-6"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default AppShell;
