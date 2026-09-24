import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiClient } from '../../api/client.js';
import {
    LayoutDashboard, UserCircle, Briefcase, Sparkles, LogOut, Menu,
    Bell, GraduationCap, Settings, ShieldAlert, BookOpen, FileText,
    ChevronLeft, ChevronRight, HelpCircle, FolderKanban, User,
    ListTodo, Calendar, TrendingUp, AlertCircle, CheckSquare, Users,
    Search, Plus, X, ExternalLink
} from 'lucide-react';

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

    return (
        _jsxs("div", {
            className: "min-h-screen bg-slate-50 flex text-xs font-sans antialiased text-slate-800",
            children: [
                // Mobile backdrop
                sidebarOpen && (
                    _jsx("div", {
                        className: "fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden transition-opacity",
                        onClick: () => setSidebarOpen(false)
                    })
                ),

                // Sidebar
                _jsxs("aside", {
                    className: `fixed inset-y-0 left-0 z-50 bg-[#0B0F19] text-slate-300 flex flex-col transform transition-all duration-300 md:translate-x-0 md:relative shrink-0 border-r border-slate-800/80 shadow-2xl md:shadow-none ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } ${isCollapsed && canCollapse ? 'w-20' : 'w-64'}`,
                    children: [
                        // Sidebar Brand Header
                        _jsxs("div", {
                            className: "h-16 flex items-center justify-between px-5 border-b border-slate-800/80 shrink-0",
                            children: [
                                _jsxs(Link, {
                                    to: "/dashboard",
                                    className: "flex items-center gap-2.5 font-bold tracking-wider text-white group",
                                    children: [
                                        _jsx("div", {
                                            className: "h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0 group-hover:scale-105 transition-transform",
                                            children: _jsx(Sparkles, { className: "h-4.5 w-4.5 text-white animate-pulse" })
                                        }),
                                        (!isCollapsed || !canCollapse) && (
                                            _jsxs("div", {
                                                children: [
                                                    _jsx("span", { className: "block text-xs font-black tracking-[0.14em] text-white leading-none", children: "CAMPUSGENT" }),
                                                    _jsx("span", { className: "block text-[8.5px] font-bold uppercase tracking-[0.2em] text-indigo-400 mt-0.5", children: "AI PLATFORM" })
                                                ]
                                            })
                                        )
                                    ]
                                }),
                                canCollapse && (
                                    _jsx("button", {
                                        onClick: () => setIsCollapsed(!isCollapsed),
                                        className: "hidden md:flex p-1.5 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer",
                                        children: isCollapsed ? _jsx(ChevronRight, { className: "h-4 w-4" }) : _jsx(ChevronLeft, { className: "h-4 w-4" })
                                    })
                                )
                            ]
                        }),

                        // Nav Links Container
                        _jsx("nav", {
                            className: "flex-1 px-3 py-4 space-y-4 overflow-y-auto",
                            children: navGroups ? (
                                navGroups.map((group) => (
                                    _jsxs("div", {
                                        className: "space-y-1",
                                        children: [
                                            !isCollapsed && (
                                                _jsx("span", {
                                                    className: "block px-3 text-[9.5px] font-bold text-slate-400 tracking-widest uppercase mb-1.5 select-none",
                                                    children: group.group
                                                })
                                            ),
                                            group.links.map((link) => {
                                                const Icon = link.icon;
                                                const active = isActive(link.path);
                                                return (
                                                    _jsxs(Link, {
                                                        to: link.path,
                                                        onClick: () => setSidebarOpen(false),
                                                        className: `flex items-center gap-3 px-3 py-2 rounded-xl font-semibold transition-all duration-150 group relative ${
                                                            active
                                                                ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500 shadow-sm font-bold'
                                                                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                                                        }`,
                                                        children: [
                                                            _jsx(Icon, { className: `h-4 w-4 shrink-0 transition-colors ${active ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'}` }),
                                                            !isCollapsed && _jsx("span", { className: "truncate", children: link.label }),
                                                            isCollapsed && (
                                                                _jsx("div", {
                                                                    className: "absolute left-16 bg-slate-900 border border-slate-700 text-white font-bold text-[11px] rounded-lg px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl",
                                                                    children: link.label
                                                                })
                                                            )
                                                        ]
                                                    }, link.path)
                                                );
                                            })
                                        ]
                                    }, group.group)
                                ))
                            ) : (
                                adminNavLinks.map((link) => {
                                    const Icon = link.icon;
                                    const active = isActive(link.path);
                                    return (
                                        _jsxs(Link, {
                                            to: link.path,
                                            onClick: () => setSidebarOpen(false),
                                            className: `flex items-center gap-3 px-3 py-2 rounded-xl font-semibold transition-all ${
                                                active
                                                    ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500 font-bold'
                                                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                                            }`,
                                            children: [
                                                _jsx(Icon, { className: "h-4 w-4 shrink-0" }),
                                                _jsx("span", { children: link.label })
                                            ]
                                        }, link.path)
                                    );
                                })
                            )
                        }),

                        // Sidebar Bottom User Profile Pill
                        _jsxs("div", {
                            className: "p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/40 shrink-0",
                            children: [
                                (!isCollapsed || !canCollapse) ? (
                                    _jsxs("div", {
                                        className: "flex items-center gap-3 px-2 py-1.5 rounded-xl bg-slate-900/70 border border-slate-800",
                                        children: [
                                            _jsx("div", {
                                                className: "h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center font-black text-white text-[11px] shadow-sm shrink-0",
                                                children: user?.name ? user.name.slice(0, 2).toUpperCase() : 'CG'
                                            }),
                                            _jsxs("div", {
                                                className: "truncate flex-1 min-w-0",
                                                children: [
                                                    _jsx("p", { className: "font-bold text-white text-xs truncate leading-tight", children: user?.name }),
                                                    _jsx("p", { className: "text-[10px] text-indigo-300 font-medium truncate mt-0.5", children: user?.role?.replace('_', ' ') })
                                                ]
                                            })
                                        ]
                                    })
                                ) : (
                                    _jsx("div", {
                                        className: "mx-auto w-9 h-9 bg-gradient-to-tr from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm",
                                        children: user?.name ? user.name.slice(0, 2).toUpperCase() : 'CG'
                                    })
                                ),
                                _jsxs("button", {
                                    onClick: handleLogout,
                                    className: `w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer ${
                                        isCollapsed && canCollapse ? 'justify-center' : ''
                                    }`,
                                    children: [
                                        _jsx(LogOut, { className: "h-4 w-4 shrink-0" }),
                                        (!isCollapsed || !canCollapse) && _jsx("span", { children: "Log Out" })
                                    ]
                                })
                            ]
                        })
                    ]
                }),

                // Main Content Shell
                _jsxs("div", {
                    className: "flex-1 flex flex-col min-w-0 overflow-x-hidden min-h-screen bg-slate-50",
                    children: [
                        // Top Navbar (Frosted Glass)
                        _jsxs("header", {
                            className: "h-16 glass-navbar flex items-center justify-between px-5 sm:px-6 md:px-8 shrink-0 relative z-30 sticky top-0",
                            children: [
                                // Left: Mobile menu & Contextual Breadcrumb Badge
                                _jsxs("div", {
                                    className: "flex items-center gap-3.5",
                                    children: [
                                        _jsx("button", {
                                            onClick: () => setSidebarOpen(true),
                                            className: "md:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-700 transition-colors cursor-pointer",
                                            children: _jsx(Menu, { className: "h-5 w-5" })
                                        }),
                                        _jsxs("div", {
                                            className: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-[10px] font-bold text-slate-700 uppercase tracking-widest",
                                            children: [
                                                _jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" }),
                                                _jsx("span", { children: getRoleHeaderBadge() })
                                            ]
                                        })
                                    ]
                                }),

                                // Center: Quick Search Bar
                                (isPlacementOfficer || isFaculty) && (
                                    _jsxs("div", {
                                        className: "hidden lg:flex items-center gap-2 bg-slate-100/80 border border-slate-200/80 px-3.5 py-1.5 rounded-xl w-72 text-slate-600 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all",
                                        children: [
                                            _jsx(Search, { className: "h-3.5 w-3.5 text-slate-400 shrink-0" }),
                                            _jsx("input", {
                                                type: "text",
                                                placeholder: "Search students, drives, skills...",
                                                className: "bg-transparent border-none outline-none text-xs w-full text-slate-800 placeholder:text-slate-400"
                                            }),
                                            _jsx("kbd", { className: "px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-white border border-slate-200 rounded", children: "Ctrl K" })
                                        ]
                                    })
                                ),

                                // Right: Actions & Profile Menu
                                _jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        // Quick Action Button for Placement Officers
                                        isPlacementOfficer && (
                                            _jsxs("div", {
                                                className: "relative",
                                                children: [
                                                    _jsxs("button", {
                                                        onClick: () => setShowQuickActions(!showQuickActions),
                                                        className: "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs shadow-sm hover:shadow-indigo-500/25 transition-all cursor-pointer",
                                                        children: [
                                                            _jsx(Plus, { className: "h-3.5 w-3.5" }),
                                                            _jsx("span", { children: "Quick Action" })
                                                        ]
                                                    }),
                                                    showQuickActions && (
                                                        _jsxs(_Fragment, {
                                                            children: [
                                                                _jsx("div", { className: "fixed inset-0 z-40", onClick: () => setShowQuickActions(false) }),
                                                                _jsxs("div", {
                                                                    className: "absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 text-xs animate-fade-in",
                                                                    children: [
                                                                        _jsx(Link, {
                                                                            to: "/placement/drives",
                                                                            onClick: () => setShowQuickActions(false),
                                                                            className: "block px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold border-b border-slate-100",
                                                                            children: "+ Create Placement Drive"
                                                                        }),
                                                                        _jsx(Link, {
                                                                            to: "/placement/companies",
                                                                            onClick: () => setShowQuickActions(false),
                                                                            className: "block px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold border-b border-slate-100",
                                                                            children: "+ Add Company Profile"
                                                                        }),
                                                                        _jsx(Link, {
                                                                            to: "/placement/applications",
                                                                            onClick: () => setShowQuickActions(false),
                                                                            className: "block px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold",
                                                                            children: "Review Applications"
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        })
                                                    )
                                                ]
                                            })
                                        ),

                                        // Notifications Menu
                                        _jsxs("div", {
                                            className: "relative",
                                            children: [
                                                _jsxs("button", {
                                                    onClick: () => setShowNotifications(!showNotifications),
                                                    className: "p-2 hover:bg-slate-100 rounded-xl relative transition-colors text-slate-600 hover:text-slate-900 cursor-pointer",
                                                    children: [
                                                        _jsx(Bell, { className: "h-5 w-5" }),
                                                        unreadCount > 0 && (
                                                            _jsx("span", {
                                                                className: "absolute top-1 right-1 bg-rose-500 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs",
                                                                children: unreadCount > 9 ? '9+' : unreadCount
                                                            })
                                                        )
                                                    ]
                                                }),
                                                showNotifications && (
                                                    _jsxs(_Fragment, {
                                                        children: [
                                                            _jsx("div", { className: "fixed inset-0 z-40", onClick: () => setShowNotifications(false) }),
                                                            _jsxs("div", {
                                                                className: "absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 max-h-[28rem] overflow-y-auto animate-fade-in",
                                                                children: [
                                                                    _jsxs("div", {
                                                                        className: "px-4 py-2.5 border-b border-slate-100 flex items-center justify-between",
                                                                        children: [
                                                                            _jsxs("div", {
                                                                                className: "flex items-center gap-2",
                                                                                children: [
                                                                                    _jsx("span", { className: "font-bold text-slate-900 text-xs", children: "Notifications" }),
                                                                                    unreadCount > 0 && (
                                                                                        _jsxs("span", { className: "bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full", children: [unreadCount, " new"] })
                                                                                    )
                                                                                ]
                                                                            }),
                                                                            unreadCount > 0 && (
                                                                                _jsx("button", {
                                                                                    onClick: handleMarkAllRead,
                                                                                    className: "text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer",
                                                                                    children: "Mark all read"
                                                                                })
                                                                            )
                                                                        ]
                                                                    }),
                                                                    notifications.length === 0 ? (
                                                                        _jsxs("div", {
                                                                            className: "px-4 py-8 text-center text-slate-400 space-y-1",
                                                                            children: [
                                                                                _jsx(Bell, { className: "h-6 w-6 mx-auto text-slate-300 mb-2" }),
                                                                                _jsx("p", { className: "text-xs font-semibold text-slate-600", children: "All caught up!" }),
                                                                                _jsx("p", { className: "text-[11px] text-slate-400", children: "No new notifications right now." })
                                                                            ]
                                                                        })
                                                                    ) : (
                                                                        notifications.slice(0, 5).map((n) => (
                                                                            _jsxs("div", {
                                                                                className: `px-4 py-3 border-b border-slate-50 text-xs transition-colors hover:bg-slate-50/80 ${
                                                                                    n.read ? 'opacity-60' : 'bg-indigo-50/30'
                                                                                }`,
                                                                                children: [
                                                                                    _jsxs("div", {
                                                                                        className: "flex justify-between items-start mb-0.5",
                                                                                        children: [
                                                                                            _jsx("span", { className: "font-bold text-slate-900", children: n.title }),
                                                                                            _jsx("span", { className: "text-[9.5px] text-slate-400 font-medium", children: new Date(n.createdAt).toLocaleDateString() })
                                                                                        ]
                                                                                    }),
                                                                                    _jsx("p", { className: "text-slate-600 leading-relaxed text-[11px] line-clamp-2", children: n.message })
                                                                                ]
                                                                            }, n._id)
                                                                        ))
                                                                    ),
                                                                    _jsx(Link, {
                                                                        to: isFaculty ? "/faculty/notifications" : isPlacementOfficer ? "/placement/notifications" : "/notifications",
                                                                        onClick: () => setShowNotifications(false),
                                                                        className: "block text-center py-2 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors border-t border-slate-100 mt-1",
                                                                        children: "View all notifications →"
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                )
                                            ]
                                        }),

                                        // Profile Menu
                                        _jsxs("div", {
                                            className: "relative",
                                            children: [
                                                _jsxs("button", {
                                                    onClick: () => setShowProfileMenu(!showProfileMenu),
                                                    className: "flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-left",
                                                    children: [
                                                        _jsx("div", {
                                                            className: "h-8 w-8 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-xs",
                                                            children: user?.name ? user.name.slice(0, 2).toUpperCase() : 'CG'
                                                        }),
                                                        _jsx("span", {
                                                            className: "hidden md:inline font-bold text-slate-800 text-xs truncate max-w-[110px]",
                                                            children: user?.name ? user.name.split(' ')[0] : 'Account'
                                                        })
                                                    ]
                                                }),
                                                showProfileMenu && (
                                                    _jsxs(_Fragment, {
                                                        children: [
                                                            _jsx("div", { className: "fixed inset-0 z-40", onClick: () => setShowProfileMenu(false) }),
                                                            _jsxs("div", {
                                                                className: "absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fade-in text-xs",
                                                                children: [
                                                                    _jsxs("div", {
                                                                        className: "px-4 py-2 border-b border-slate-100",
                                                                        children: [
                                                                            _jsx("p", { className: "font-bold text-slate-900 truncate", children: user?.name }),
                                                                            _jsx("p", { className: "text-[10px] text-slate-500 font-medium truncate", children: user?.email })
                                                                        ]
                                                                    }),
                                                                    _jsxs(Link, {
                                                                        to: isFaculty ? "/faculty/settings" : isPlacementOfficer ? "/placement/settings" : "/profile",
                                                                        onClick: () => setShowProfileMenu(false),
                                                                        className: "flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold transition-colors",
                                                                        children: [
                                                                            _jsx(User, { className: "h-4 w-4 text-slate-400" }),
                                                                            _jsx("span", { children: "My Profile" })
                                                                        ]
                                                                    }),
                                                                    _jsxs(Link, {
                                                                        to: isFaculty ? "/faculty/settings" : isPlacementOfficer ? "/placement/settings" : "/settings",
                                                                        onClick: () => setShowProfileMenu(false),
                                                                        className: "flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold transition-colors",
                                                                        children: [
                                                                            _jsx(Settings, { className: "h-4 w-4 text-slate-400" }),
                                                                            _jsx("span", { children: "Settings" })
                                                                        ]
                                                                    }),
                                                                    _jsx("div", { className: "border-t border-slate-100 my-1" }),
                                                                    _jsxs("button", {
                                                                        onClick: () => {
                                                                            setShowProfileMenu(false);
                                                                            handleLogout();
                                                                        },
                                                                        className: "w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-600 font-semibold transition-colors cursor-pointer",
                                                                        children: [
                                                                            _jsx(LogOut, { className: "h-4 w-4 text-rose-500" }),
                                                                            _jsx("span", { children: "Log Out" })
                                                                        ]
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                )
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),

                        // Dynamic Main Page Viewport
                        _jsx("main", {
                            className: "flex-1 p-5 sm:p-6 md:p-8 lg:p-10 overflow-y-auto max-w-7xl w-full mx-auto space-y-6",
                            children: children
                        })
                    ]
                })
            ]
        })
    );
};

export default AppShell;
