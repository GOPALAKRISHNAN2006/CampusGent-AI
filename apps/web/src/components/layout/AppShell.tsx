import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import { 
  LayoutDashboard, 
  UserCircle, 
  Briefcase, 
  Sparkles, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  GraduationCap, 
  Settings, 
  ShieldAlert, 
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  FolderKanban,
  CheckCheck,
  User,
  ListTodo,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckSquare,
  Users,
  Search,
  Plus
} from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
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
    } catch (err) {
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
        { label: 'Dashboard', path: '/', icon: LayoutDashboard }
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
        { label: 'Dashboard', path: '/', icon: LayoutDashboard }
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
        { label: 'Dashboard', path: '/', icon: LayoutDashboard }
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
    if (!user) return [];
    switch (user.role) {
      case 'PLACEMENT_OFFICER':
        return [
          { label: 'Dashboard', path: '/', icon: LayoutDashboard },
          { label: 'Create Placement Drive', path: '/placement/drives', icon: Briefcase },
          { label: 'Manage Jobs', path: '/jobs', icon: Settings },
          { label: 'Placement Analytics Agent', path: '/placement/analytics-agent', icon: Sparkles },
        ];
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return [
          { label: 'Dashboard', path: '/', icon: LayoutDashboard },
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
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-brand-50 flex text-xs">
      
      {/* --- SIDEBAR MOBILE DRAW LAYER --- */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-brand-950/45 md:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-brand-900 text-white flex flex-col transform transition-all duration-300 md:translate-x-0 md:relative shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed && canCollapse ? 'w-20' : 'w-64'}`}
      >
        {/* Sidebar Header Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-brand-800">
          <Link to="/" className="flex items-center gap-2 font-bold text-sm tracking-wider text-white">
            <Sparkles className="h-5 w-5 text-indigo-400 shrink-0 animate-pulse" />
            {(!isCollapsed || !canCollapse) && <span>CAMPUSGENT AI</span>}
          </Link>
          {canCollapse && (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="hidden md:flex p-1 hover:bg-brand-800 rounded-md text-brand-400 hover:text-white"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 px-3 py-5 space-y-4 overflow-y-auto">
          {isStudent ? (
            // Student Grouped Sidebar Navigation
            studentNavGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                {(!isCollapsed) && (
                  <span className="block px-3 text-[9px] font-bold text-brand-400 tracking-widest uppercase mb-1">
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
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors group relative ${
                        active 
                          ? 'bg-brand-800 text-indigo-300 border-l-2 border-indigo-400' 
                          : 'text-brand-300 hover:bg-brand-800 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      {!isCollapsed && <span>{link.label}</span>}
                      
                      {/* Tooltip on collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-16 bg-brand-950 text-white font-bold text-[10px] rounded px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-md">
                          {link.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))
          ) : isFaculty ? (
            // Faculty Grouped Sidebar Navigation
            facultyNavGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                {(!isCollapsed) && (
                  <span className="block px-3 text-[9px] font-bold text-brand-400 tracking-widest uppercase mb-1">
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
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors group relative ${
                        active 
                          ? 'bg-brand-800 text-indigo-300 border-l-2 border-indigo-400' 
                          : 'text-brand-300 hover:bg-brand-800 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      {!isCollapsed && <span>{link.label}</span>}
                      
                      {/* Tooltip on collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-16 bg-brand-950 text-white font-bold text-[10px] rounded px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-md">
                          {link.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))
          ) : isPlacementOfficer ? (
            // Placement Officer Grouped Navigation
            placementNavGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                {(!isCollapsed) && (
                  <span className="block px-3 text-[9px] font-bold text-brand-400 tracking-widest uppercase mb-1">
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
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors group relative ${
                        active 
                          ? 'bg-brand-800 text-indigo-300 border-l-2 border-indigo-400' 
                          : 'text-brand-300 hover:bg-brand-800 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      {!isCollapsed && <span>{link.label}</span>}
                      
                      {/* Tooltip on collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-16 bg-brand-950 text-white font-bold text-[10px] rounded px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-md">
                          {link.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))
          ) : (
            // Admin Navigation
            otherLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-colors ${
                    active ? 'bg-brand-800 text-indigo-300 border-l-2 border-indigo-400' : 'text-brand-300 hover:bg-brand-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-brand-800 space-y-2">
          {(!isCollapsed || !canCollapse) ? (
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="bg-brand-800 p-2.5 rounded-lg font-bold text-white shrink-0">
                {user?.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-brand-450 truncate">{user?.role}</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-10 h-10 bg-brand-800 rounded-lg flex items-center justify-center font-bold text-white shrink-0">
              {user?.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-red-300 hover:bg-brand-800 hover:text-red-200 transition-colors ${
              isCollapsed && canCollapse ? 'justify-center' : ''
            }`}
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {(!isCollapsed || !canCollapse) && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN PAGE CONTENT --- */}
      <div className="flex-1 flex flex-col overflow-x-hidden min-h-screen">
        
        {/* --- HEADER --- */}
        <header className="h-16 bg-white border-b border-brand-200/60 flex items-center justify-between px-6 shrink-0 relative z-30 shadow-sm">
          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="md:hidden p-2 hover:bg-brand-50 rounded-lg text-brand-700 shrink-0"
          >
            <Menu className="h-5.5 w-5.5" />
          </button>

          {/* Breadcrumbs / Search Title */}
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-[9px] font-bold text-brand-450 uppercase tracking-widest bg-brand-50 px-2.5 py-1 rounded shrink-0">
              {isStudent ? 'AUTONOMOUS STUDENT SUCCESS PLATFORM' : isFaculty ? 'COGNITIVE FACULTY SHELL' : isPlacementOfficer ? 'PLACEMENT COMMAND CENTER' : 'CAMPUSGENT COGNITIVE SHELL'}
            </span>
            {isPlacementOfficer && (
              <div className="flex items-center gap-2 bg-brand-50 border border-brand-200/60 px-3 py-1 rounded-lg w-64 text-brand-650">
                <Search className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search students, companies..." 
                  className="bg-transparent border-none outline-none text-[10px] w-full text-brand-800" 
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            
            {isPlacementOfficer && (
              <div className="relative">
                <button 
                  onClick={() => setShowQuickActions(!showQuickActions)} 
                  className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 text-[10px] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Quick Action</span>
                </button>
                {showQuickActions && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowQuickActions(false)} />
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-brand-200 rounded-xl shadow-lg py-1.5 z-50 text-[10.5px]">
                      <Link 
                        to="/placement/drives" 
                        onClick={() => setShowQuickActions(false)}
                        className="block px-4 py-2 hover:bg-brand-50 text-brand-700 font-semibold border-b border-brand-50"
                      >
                        Create Drive
                      </Link>
                      <Link 
                        to="/placement/companies" 
                        onClick={() => setShowQuickActions(false)}
                        className="block px-4 py-2 hover:bg-brand-50 text-brand-700 font-semibold border-b border-brand-50"
                      >
                        Add Company
                      </Link>
                      <Link 
                        to="/placement/applications" 
                        onClick={() => setShowQuickActions(false)}
                        className="block px-4 py-2 hover:bg-brand-50 text-brand-700 font-semibold"
                      >
                        View Applications
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Notification alert hub dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-brand-50 rounded-full relative transition-colors text-brand-650"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-red-500 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-brand-200 rounded-xl shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-brand-100 flex items-center justify-between">
                      <span className="font-bold text-brand-850 text-xs">Notifications</span>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllRead} 
                          className="text-[10px] font-bold text-indigo-650 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-brand-400">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div key={n._id} className={`px-4 py-3 border-b border-brand-50 text-[11px] ${n.read ? 'opacity-65' : 'bg-brand-50/30'}`}>
                          <div className="flex justify-between items-start mb-0.5">
                            <span className="font-bold text-brand-900">{n.title}</span>
                            <span className="text-[9px] text-brand-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-brand-650 leading-relaxed truncate">{n.message}</p>
                        </div>
                      ))
                    )}
                    <Link 
                      to={isFaculty ? "/faculty/notifications" : "/notifications"} 
                      onClick={() => setShowNotifications(false)}
                      className="block text-center pt-2 text-[10px] font-bold text-indigo-650 hover:underline border-t border-brand-50 mt-1"
                    >
                      View all notifications
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Help Button */}
            <button className="hidden sm:block p-2 hover:bg-brand-50 rounded-full text-brand-500">
              <HelpCircle className="h-5 w-5" />
            </button>

            {/* Profile Avatar & dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 hover:bg-brand-50 rounded-lg transition-colors text-left"
              >
                <div className="h-7 w-7 bg-brand-900 text-white rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="hidden md:inline font-bold text-brand-850 text-xs truncate max-w-[100px]">
                  {user?.name.split(' ')[0]}
                </span>
              </button>

              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-brand-200 rounded-xl shadow-lg py-1.5 z-50">
                    <Link 
                      to={isFaculty ? "/faculty/settings" : "/profile"} 
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-brand-50 text-brand-700 font-semibold transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                    <Link 
                      to={isFaculty ? "/faculty/settings" : "/settings"} 
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-brand-50 text-brand-700 font-semibold transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <div className="border-t border-brand-100 my-1" />
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleLogout();
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-brand-50 text-red-650 font-semibold transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </header>

        {/* --- PAGE MAIN BODY --- */}
        <main className="flex-1 p-6 md:p-8 bg-brand-50/30 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
export default AppShell;
