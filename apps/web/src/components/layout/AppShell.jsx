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
            className: "min-h-screen bg-[#FAF7F2] flex text-xs font-sans antialiased text-[#1F150C]",
            children: [
                // Mobile backdrop
                sidebarOpen && (
                    _jsx("div", {
                        className: "fixed inset-0 z-40 bg-[#000000]/60 backdrop-blur-sm md:hidden transition-opacity",
                        onClick: () => setSidebarOpen(false)
                    })
                ),

                // Sidebar (Deep Espresso Noir with Bronze & Sandstone accents)
                _jsxs("aside", {
                    className: `fixed inset-y-0 left-0 z-50 bg-[#1F150C] text-[#E1DCC9] flex flex-col transform transition-all duration-300 md:translate-x-0 md:relative shrink-0 border-r border-[#412D15]/70 shadow-2xl md:shadow-none ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } ${isCollapsed && canCollapse ? 'w-20' : 'w-64'}`,
                    children: [
                        // Sidebar Brand Header
                        _jsxs("div", {
                            className: "h-16 flex items-center justify-between px-5 border-b border-[#412D15]/70 shrink-0",
                            children: [
                                _jsxs(Link, {
                                    to: "/dashboard",
                                    className: "flex items-center gap-2.5 font-bold tracking-wider text-white group",
                                    children: [
                                        _jsx("div", {
                                            className: "h-8 w-8 rounded-xl bg-gradient-to-br from-[#412D15] to-[#1F150C] border border-[#E1DCC9]/30 flex items-center justify-center text-[#E1DCC9] shadow-md shrink-0 group-hover:scale-105 transition-transform",
                                            children: _jsx(Sparkles, { className: "h-4.5 w-4.5 text-[#E1DCC9] animate-pulse" })
                                        }),
                                        (!isCollapsed || !canCollapse) && (
                                            _jsxs("div", {
                                                children: [
                                                    _jsx("span", { className: "block text-xs font-black tracking-[0.14em] text-white leading-none", children: "CAMPUSGENT" }),
                                                    _jsx("span", { className: "block text-[8.5px] font-bold uppercase tracking-[0.2em] text-[#E1DCC9]/80 mt-0.5", children: "AI PLATFORM" })
                                                ]
                                            })
                                        )
                                    ]
                                }),
                                canCollapse && (
                                    _jsx("button", {
                                        onClick: () => setIsCollapsed(!isCollapsed),
                                        className: "hidden md:flex p-1.5 hover:bg-[#412D15]/50 rounded-lg text-[#E1DCC9]/70 hover:text-white transition-colors cursor-pointer",
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
                                                    className: "block px-3 text-[9.5px] font-bold text-[#C9BF9F] tracking-widest uppercase mb-1.5 select-none",
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
                                                                ? 'bg-[#412D15]/45 text-[#E1DCC9] border-l-2 border-[#E1DCC9] shadow-sm font-bold'
                                                                : 'text-[#E1DCC9]/70 hover:bg-[#412D15]/25 hover:text-white'
                                                        }`,
                                                        children: [
                                                            _jsx(Icon, { className: `h-4 w-4 shrink-0 transition-colors ${active ? 'text-[#E1DCC9]' : 'text-[#E1DCC9]/70 group-hover:text-white'}` }),
                                                            !isCollapsed && _jsx("span", { className: "truncate", children: link.label }),
                                                            isCollapsed && (
                                                                _jsx("div", {
                                                                    className: "absolute left-16 bg-[#000000] border border-[#412D15] text-[#E1DCC9] font-bold text-[11px] rounded-lg px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl",
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
                                                    ? 'bg-[#412D15]/45 text-[#E1DCC9] border-l-2 border-[#E1DCC9] font-bold'
                                                    : 'text-[#E1DCC9]/70 hover:bg-[#412D15]/25 hover:text-white'
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
                            className: "p-3 border-t border-[#412D15]/70 space-y-2 bg-[#140D07]/90 shrink-0",
                            children: [
                                (!isCollapsed || !canCollapse) ? (
                                    _jsxs("div", {
                                        className: "flex items-center gap-3 px-2 py-1.5 rounded-xl bg-[#1F150C] border border-[#412D15]/70",
                                        children: [
                                            _jsx("div", {
                                                className: "h-8 w-8 rounded-lg bg-gradient-to-tr from-[#412D15] to-[#1F150C] border border-[#E1DCC9]/30 flex items-center justify-center font-black text-[#E1DCC9] text-[11px] shadow-sm shrink-0",
                                                children: user?.name ? user.name.slice(0, 2).toUpperCase() : 'CG'
                                            }),
                                            _jsxs("div", {
                                                className: "truncate flex-1 min-w-0",
                                                children: [
                                                    _jsx("p", { className: "font-bold text-white text-xs truncate leading-tight", children: user?.name }),
                                                    _jsx("p", { className: "text-[10px] text-[#E1DCC9]/80 font-medium truncate mt-0.5", children: user?.role?.replace('_', ' ') })
                                                ]
                                            })
                                        ]
                                    })
                                ) : (
                                    _jsx("div", {
                                        className: "mx-auto w-9 h-9 bg-gradient-to-tr from-[#412D15] to-[#1F150C] border border-[#E1DCC9]/30 rounded-xl flex items-center justify-center font-bold text-[#E1DCC9] text-xs shrink-0 shadow-sm",
                                        children: user?.name ? user.name.slice(0, 2).toUpperCase() : 'CG'
                                    })
                                ),
                                _jsxs("button", {
                                    onClick: handleLogout,
                                    className: `w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-rose-300 hover:bg-rose-500/15 transition-colors cursor-pointer ${
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
                    className: "flex-1 flex flex-col min-w-0 overflow-x-hidden min-h-screen bg-[#FAF7F2]",
                    children: [
                        // Top Navbar (Warm Frosted Glass)
                        _jsxs("header", {
                            className: "h-16 glass-navbar flex items-center justify-between px-5 sm:px-6 md:px-8 shrink-0 relative z-30 sticky top-0",
                            children: [
                                // Left: Mobile menu & Contextual Breadcrumb Badge
                                _jsxs("div", {
                                    className: "flex items-center gap-3.5",
                                    children: [
                                        _jsx("button", {
                                            onClick: () => setSidebarOpen(true),
                                            className: "md:hidden p-2 hover:bg-[#F4EFE6] rounded-xl text-[#1F150C] transition-colors cursor-pointer",
                                            children: _jsx(Menu, { className: "h-5 w-5" })
                                        }),
                                        _jsxs("div", {
                                            className: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4EFE6] border border-[#E1DCC9] text-[10px] font-bold text-[#1F150C] uppercase tracking-widest",
                                            children: [
                                                _jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[#412D15] animate-pulse shrink-0" }),
                                                _jsx("span", { children: getRoleHeaderBadge() })
                                            ]
                                        })
                                    ]
                                }),

                                // Center: Quick Search Bar
                                (isPlacementOfficer || isFaculty) && (
                                    _jsxs("div", {
                                        className: "hidden lg:flex items-center gap-2 bg-[#F4EFE6] border border-[#E1DCC9] px-3.5 py-1.5 rounded-xl w-72 text-[#1F150C] focus-within:border-[#412D15] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#412D15]/10 transition-all",
                                        children: [
                                            _jsx(Search, { className: "h-3.5 w-3.5 text-[#6B5336] shrink-0" }),
                                            _jsx("input", {
                                                type: "text",
                                                placeholder: "Search students, drives, skills...",
                                                className: "bg-transparent border-none outline-none text-xs w-full text-[#1F150C] placeholder:text-[#8F7554]"
                                            }),
                                            _jsx("kbd", { className: "px-1.5 py-0.5 text-[9px] font-mono text-[#6B5336] bg-white border border-[#E1DCC9] rounded", children: "Ctrl K" })
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
                                                        className: "bg-gradient-to-r from-[#1F150C] to-[#000000] hover:from-[#412D15] hover:to-[#1F150C] text-[#E1DCC9] border border-[#412D15] font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs shadow-sm transition-all cursor-pointer",
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
                                                                    className: "absolute right-0 mt-2 w-48 bg-white border border-[#E1DCC9] rounded-2xl shadow-xl py-1.5 z-50 text-xs animate-fade-in",
                                                                    children: [
                                                                        _jsx(Link, {
                                                                            to: "/placement/drives",
                                                                            onClick: () => setShowQuickActions(false),
                                                                            className: "block px-4 py-2 hover:bg-[#FAF7F2] text-[#1F150C] font-semibold border-b border-[#E1DCC9]/70",
                                                                            children: "+ Create Placement Drive"
                                                                        }),
                                                                        _jsx(Link, {
                                                                            to: "/placement/companies",
                                                                            onClick: () => setShowQuickActions(false),
                                                                            className: "block px-4 py-2 hover:bg-[#FAF7F2] text-[#1F150C] font-semibold border-b border-[#E1DCC9]/70",
                                                                            children: "+ Add Company Profile"
                                                                        }),
                                                                        _jsx(Link, {
                                                                            to: "/placement/applications",
                                                                            onClick: () => setShowQuickActions(false),
                                                                            className: "block px-4 py-2 hover:bg-[#FAF7F2] text-[#1F150C] font-semibold",
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
                                                    className: "p-2 hover:bg-[#F4EFE6] rounded-xl relative transition-colors text-[#412D15] hover:text-[#000000] cursor-pointer",
                                                    children: [
                                                        _jsx(Bell, { className: "h-5 w-5" }),
                                                        unreadCount > 0 && (
                                                            _jsx("span", {
                                                                className: "absolute top-1 right-1 bg-[#412D15] text-[#E1DCC9] font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs",
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
                                                                className: "absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E1DCC9] rounded-2xl shadow-xl py-2 z-50 max-h-[28rem] overflow-y-auto animate-fade-in",
                                                                children: [
                                                                    _jsxs("div", {
                                                                        className: "px-4 py-2.5 border-b border-[#E1DCC9]/70 flex items-center justify-between",
                                                                        children: [
                                                                            _jsxs("div", {
                                                                                className: "flex items-center gap-2",
                                                                                children: [
                                                                                    _jsx("span", { className: "font-bold text-[#1F150C] text-xs", children: "Notifications" }),
                                                                                    unreadCount > 0 && (
                                                                                        _jsxs("span", { className: "bg-[#F4EFE6] text-[#412D15] border border-[#E1DCC9] text-[10px] font-bold px-2 py-0.5 rounded-full", children: [unreadCount, " new"] })
                                                                                    )
                                                                                ]
                                                                            }),
                                                                            unreadCount > 0 && (
                                                                                _jsx("button", {
                                                                                    onClick: handleMarkAllRead,
                                                                                    className: "text-[11px] font-bold text-[#412D15] hover:text-[#000000] transition-colors cursor-pointer",
                                                                                    children: "Mark all read"
                                                                                })
                                                                            )
                                                                        ]
                                                                    }),
                                                                    notifications.length === 0 ? (
                                                                        _jsxs("div", {
                                                                            className: "px-4 py-8 text-center text-[#8F7554] space-y-1",
                                                                            children: [
                                                                                _jsx(Bell, { className: "h-6 w-6 mx-auto text-[#C9BF9F] mb-2" }),
                                                                                _jsx("p", { className: "text-xs font-semibold text-[#1F150C]", children: "All caught up!" }),
                                                                                _jsx("p", { className: "text-[11px] text-[#8F7554]", children: "No new notifications right now." })
                                                                            ]
                                                                        })
                                                                    ) : (
                                                                        notifications.slice(0, 5).map((n) => (
                                                                            _jsxs("div", {
                                                                                className: `px-4 py-3 border-b border-[#E1DCC9]/50 text-xs transition-colors hover:bg-[#FAF7F2] ${
                                                                                    n.read ? 'opacity-60' : 'bg-[#FAF7F2]'
                                                                                }`,
                                                                                children: [
                                                                                    _jsxs("div", {
                                                                                        className: "flex justify-between items-start mb-0.5",
                                                                                        children: [
                                                                                            _jsx("span", { className: "font-bold text-[#1F150C]", children: n.title }),
                                                                                            _jsx("span", { className: "text-[9.5px] text-[#8F7554] font-medium", children: new Date(n.createdAt).toLocaleDateString() })
                                                                                        ]
                                                                                    }),
                                                                                    _jsx("p", { className: "text-[#6B5336] leading-relaxed text-[11px] line-clamp-2", children: n.message })
                                                                                ]
                                                                            }, n._id)
                                                                        ))
                                                                    ),
                                                                    _jsx(Link, {
                                                                        to: isFaculty ? "/faculty/notifications" : isPlacementOfficer ? "/placement/notifications" : "/notifications",
                                                                        onClick: () => setShowNotifications(false),
                                                                        className: "block text-center py-2 text-[11px] font-bold text-[#412D15] hover:text-[#000000] transition-colors border-t border-[#E1DCC9]/70 mt-1",
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
                                                    className: "flex items-center gap-2 p-1.5 hover:bg-[#F4EFE6] rounded-xl transition-colors cursor-pointer text-left",
                                                    children: [
                                                        _jsx("div", {
                                                            className: "h-8 w-8 bg-gradient-to-br from-[#1F150C] to-[#000000] border border-[#412D15] text-[#E1DCC9] rounded-xl flex items-center justify-center font-black text-xs shadow-xs",
                                                            children: user?.name ? user.name.slice(0, 2).toUpperCase() : 'CG'
                                                        }),
                                                        _jsx("span", {
                                                            className: "hidden md:inline font-bold text-[#1F150C] text-xs truncate max-w-[110px]",
                                                            children: user?.name ? user.name.split(' ')[0] : 'Account'
                                                        })
                                                    ]
                                                }),
                                                showProfileMenu && (
                                                    _jsxs(_Fragment, {
                                                        children: [
                                                            _jsx("div", { className: "fixed inset-0 z-40", onClick: () => setShowProfileMenu(false) }),
                                                            _jsxs("div", {
                                                                className: "absolute right-0 mt-2 w-52 bg-white border border-[#E1DCC9] rounded-2xl shadow-xl py-2 z-50 animate-fade-in text-xs",
                                                                children: [
                                                                    _jsxs("div", {
                                                                        className: "px-4 py-2 border-b border-[#E1DCC9]/70",
                                                                        children: [
                                                                            _jsx("p", { className: "font-bold text-[#1F150C] truncate", children: user?.name }),
                                                                            _jsx("p", { className: "text-[10px] text-[#6B5336] font-medium truncate", children: user?.email })
                                                                        ]
                                                                    }),
                                                                    _jsxs(Link, {
                                                                        to: isFaculty ? "/faculty/settings" : isPlacementOfficer ? "/placement/settings" : "/profile",
                                                                        onClick: () => setShowProfileMenu(false),
                                                                        className: "flex items-center gap-2 px-4 py-2 hover:bg-[#FAF7F2] text-[#1F150C] font-semibold transition-colors",
                                                                        children: [
                                                                            _jsx(User, { className: "h-4 w-4 text-[#6B5336]" }),
                                                                            _jsx("span", { children: "My Profile" })
                                                                        ]
                                                                    }),
                                                                    _jsxs(Link, {
                                                                        to: isFaculty ? "/faculty/settings" : isPlacementOfficer ? "/placement/settings" : "/settings",
                                                                        onClick: () => setShowProfileMenu(false),
                                                                        className: "flex items-center gap-2 px-4 py-2 hover:bg-[#FAF7F2] text-[#1F150C] font-semibold transition-colors",
                                                                        children: [
                                                                            _jsx(Settings, { className: "h-4 w-4 text-[#6B5336]" }),
                                                                            _jsx("span", { children: "Settings" })
                                                                        ]
                                                                    }),
                                                                    _jsx("div", { className: "border-t border-[#E1DCC9]/70 my-1" }),
                                                                    _jsxs("button", {
                                                                        onClick: () => {
                                                                            setShowProfileMenu(false);
                                                                            handleLogout();
                                                                        },
                                                                        className: "w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-700 font-semibold transition-colors cursor-pointer",
                                                                        children: [
                                                                            _jsx(LogOut, { className: "h-4 w-4 text-rose-600" }),
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
