import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { Home } from './pages/Home.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';

const lazyPage = (loader, exportName) =>
    React.lazy(() => loader().then((module) => ({ default: module[exportName] })));

const AICareerAdvisor = lazyPage(() => import('./pages/AICareerAdvisor.jsx'), 'AICareerAdvisor');
const AIResumeAnalyzer = lazyPage(() => import('./pages/AIResumeAnalyzer.jsx'), 'AIResumeAnalyzer');
const AIMockInterview = lazyPage(() => import('./pages/AIMockInterview.jsx'), 'AIMockInterview');
const StudentDashboard = lazyPage(() => import('./pages/StudentDashboard.jsx'), 'StudentDashboard');
const FacultyDashboard = lazyPage(() => import('./pages/FacultyDashboard.jsx'), 'FacultyDashboard');
const PlacementDashboard = lazyPage(() => import('./pages/PlacementDashboard.jsx'), 'PlacementDashboard');
const AdminDashboard = lazyPage(() => import('./pages/AdminDashboard.jsx'), 'AdminDashboard');
const AIInsightsDashboard = lazyPage(() => import('./pages/AIInsightsDashboard.jsx'), 'AIInsightsDashboard');
const AgentHealthDashboard = lazyPage(() => import('./pages/AgentHealthDashboard.jsx'), 'AgentHealthDashboard');
const StudentSuccessAgent = lazyPage(() => import('./pages/StudentSuccessAgent.jsx'), 'StudentSuccessAgent');
const PlacementReadinessAgent = lazyPage(() => import('./pages/PlacementReadinessAgent.jsx'), 'PlacementReadinessAgent');
const LearningPathAgent = lazyPage(() => import('./pages/LearningPathAgent.jsx'), 'LearningPathAgent');
const FacultyInsightsAgent = lazyPage(() => import('./pages/FacultyInsightsAgent.jsx'), 'FacultyInsightsAgent');
const PlacementAnalyticsAgent = lazyPage(() => import('./pages/PlacementAnalyticsAgent.jsx'), 'PlacementAnalyticsAgent');
const JobMatchingAgent = lazyPage(() => import('./pages/JobMatchingAgent.jsx'), 'JobMatchingAgent');
const ApplicationStrategyAgent = lazyPage(() => import('./pages/ApplicationStrategyAgent.jsx'), 'ApplicationStrategyAgent');
const SkillGapAgent = lazyPage(() => import('./pages/SkillGapAgent.jsx'), 'SkillGapAgent');
const CareerGrowthAgent = lazyPage(() => import('./pages/CareerGrowthAgent.jsx'), 'CareerGrowthAgent');
const PlacementDrives = lazyPage(() => import('./pages/PlacementDrives.jsx'), 'PlacementDrives');
const PlacementDriveDetail = lazyPage(() => import('./pages/PlacementDriveDetail.jsx'), 'PlacementDriveDetail');
const PlacementApplications = lazyPage(() => import('./pages/PlacementApplications.jsx'), 'PlacementApplications');
const PlacementInterviews = lazyPage(() => import('./pages/PlacementInterviews.jsx'), 'PlacementInterviews');
const PlacementOffers = lazyPage(() => import('./pages/PlacementOffers.jsx'), 'PlacementOffers');
const PlacementOutcomes = lazyPage(() => import('./pages/PlacementOutcomes.jsx'), 'PlacementOutcomes');
const PlacementCompanies = lazyPage(() => import('./pages/PlacementCompanies.jsx'), 'PlacementCompanies');
const PlacementStudents = lazyPage(() => import('./pages/PlacementStudents.jsx'), 'PlacementStudents');
const PlacementReadiness = lazyPage(() => import('./pages/PlacementReadiness.jsx'), 'PlacementReadiness');
const PlacementAtRisk = lazyPage(() => import('./pages/PlacementAtRisk.jsx'), 'PlacementAtRisk');
const PlacementAnalytics = lazyPage(() => import('./pages/PlacementAnalytics.jsx'), 'PlacementAnalytics');
const PlacementAIInsights = lazyPage(() => import('./pages/PlacementAIInsights.jsx'), 'PlacementAIInsights');
const PlacementCalendar = lazyPage(() => import('./pages/PlacementCalendar.jsx'), 'PlacementCalendar');
const PlacementNotifications = lazyPage(() => import('./pages/PlacementNotifications.jsx'), 'PlacementNotifications');
const PlacementReports = lazyPage(() => import('./pages/PlacementReports.jsx'), 'PlacementReports');
const PlacementSettings = lazyPage(() => import('./pages/PlacementSettings.jsx'), 'PlacementSettings');
const StudentProfile = lazyPage(() => import('./pages/StudentProfile.jsx'), 'StudentProfile');
const StudentAcademics = lazyPage(() => import('./pages/StudentAcademics.jsx'), 'StudentAcademics');
const StudentLearning = lazyPage(() => import('./pages/StudentLearning.jsx'), 'StudentLearning');
const StudentCareer = lazyPage(() => import('./pages/StudentCareer.jsx'), 'StudentCareer');
const StudentPlacements = lazyPage(() => import('./pages/StudentPlacements.jsx'), 'StudentPlacements');
const StudentResume = lazyPage(() => import('./pages/StudentResume.jsx'), 'StudentResume');
const StudentSkillsProjects = lazyPage(() => import('./pages/StudentSkillsProjects.jsx'), 'StudentSkillsProjects');
const StudentApplications = lazyPage(() => import('./pages/StudentApplications.jsx'), 'StudentApplications');
const StudentNotifications = lazyPage(() => import('./pages/StudentNotifications.jsx'), 'StudentNotifications');
const StudentSettings = lazyPage(() => import('./pages/StudentSettings.jsx'), 'StudentSettings');
const FacultyClasses = lazyPage(() => import('./pages/FacultyClasses.jsx'), 'FacultyClasses');
const FacultyClassDetail = lazyPage(() => import('./pages/FacultyClassDetail.jsx'), 'FacultyClassDetail');
const FacultyStudents = lazyPage(() => import('./pages/FacultyStudents.jsx'), 'FacultyStudents');
const FacultyAttendance = lazyPage(() => import('./pages/FacultyAttendance.jsx'), 'FacultyAttendance');
const FacultyAssessments = lazyPage(() => import('./pages/FacultyAssessments.jsx'), 'FacultyAssessments');
const FacultyMarks = lazyPage(() => import('./pages/FacultyMarks.jsx'), 'FacultyMarks');
const FacultyPerformance = lazyPage(() => import('./pages/FacultyPerformance.jsx'), 'FacultyPerformance');
const FacultyAtRisk = lazyPage(() => import('./pages/FacultyAtRisk.jsx'), 'FacultyAtRisk');
const FacultyAIInsights = lazyPage(() => import('./pages/FacultyAIInsights.jsx'), 'FacultyAIInsights');
const FacultyCourses = lazyPage(() => import('./pages/FacultyCourses.jsx'), 'FacultyCourses');
const FacultyTimetable = lazyPage(() => import('./pages/FacultyTimetable.jsx'), 'FacultyTimetable');
const FacultyCalendar = lazyPage(() => import('./pages/FacultyCalendar.jsx'), 'FacultyCalendar');
const FacultyNotifications = lazyPage(() => import('./pages/FacultyNotifications.jsx'), 'FacultyNotifications');
const FacultySettings = lazyPage(() => import('./pages/FacultySettings.jsx'), 'FacultySettings');
const FacultyAnnouncements = lazyPage(() => import('./pages/FacultyAnnouncements.jsx'), 'FacultyAnnouncements');
const DashboardSwitch = () => {
    const { user } = useAuth();
    if (user?.role === 'STUDENT')
        return _jsx(StudentDashboard, {});
    if (user?.role === 'FACULTY')
        return _jsx(FacultyDashboard, {});
    if (user?.role === 'PLACEMENT_OFFICER')
        return _jsx(PlacementDashboard, {});
    return _jsx(AdminDashboard, {});
};
// Protected Route Guard Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-brand-50", children: _jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-600" }) }));
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return _jsx(AppShell, { children: children });
};
const RouteFallback = () => {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-brand-50", children: _jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-600" }) }));
    }
    return _jsx(Navigate, { to: user ? '/dashboard' : '/', replace: true });
};
function App() {
    return (_jsx(AuthProvider, { children: _jsx(Router, { children: _jsx(Suspense, { fallback: _jsx("div", { role: "status", "aria-live": "polite", className: "min-h-screen flex items-center justify-center bg-brand-50", children: _jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-600", "aria-label": "Loading page" }) }), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardSwitch, {}) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(StudentProfile, {}) }) }), _jsx(Route, { path: "/academics", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(StudentAcademics, {}) }) }), _jsx(Route, { path: "/learning", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(StudentLearning, {}) }) }), _jsx(Route, { path: "/career", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(StudentCareer, {}) }) }), _jsx(Route, { path: "/placements", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(StudentPlacements, {}) }) }), _jsx(Route, { path: "/resume", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(StudentResume, {}) }) }), _jsx(Route, { path: "/skills-projects", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(StudentSkillsProjects, {}) }) }), _jsx(Route, { path: "/applications", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(StudentApplications, {}) }) }), _jsx(Route, { path: "/notifications", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(StudentNotifications, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(StudentSettings, {}) }) }), _jsx(Route, { path: "/faculty/classes", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultyClasses, {}) }) }), _jsx(Route, { path: "/faculty/classes/:classId", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultyClassDetail, {}) }) }), _jsx(Route, { path: "/faculty/students", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultyStudents, {}) }) }), _jsx(Route, { path: "/faculty/attendance", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultyAttendance, {}) }) }), _jsx(Route, { path: "/faculty/assessments", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultyAssessments, {}) }) }), _jsx(Route, { path: "/faculty/marks", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultyMarks, {}) }) }), _jsx(Route, { path: "/faculty/performance", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultyPerformance, {}) }) }), _jsx(Route, { path: "/faculty/at-risk", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultyAtRisk, {}) }) }), _jsx(Route, { path: "/faculty/ai-insights", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultyAIInsights, {}) }) }), _jsx(Route, { path: "/faculty/courses", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultyCourses, {}) }) }), _jsx(Route, { path: "/faculty/timetable", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultyTimetable, {}) }) }), _jsx(Route, { path: "/faculty/calendar", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultyCalendar, {}) }) }), _jsx(Route, { path: "/faculty/notifications", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultyNotifications, {}) }) }), _jsx(Route, { path: "/faculty/settings", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultySettings, {}) }) }), _jsx(Route, { path: "/faculty/announcements", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultyAnnouncements, {}) }) }), _jsx(Route, { path: "/jobs", element: _jsx(ProtectedRoute, { children: _jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-2xl font-bold text-brand-900", children: "Job Board" }), _jsx("p", { className: "text-brand-500", children: "Explore career opportunities and track active vacancy lists." })] }) }) }), _jsx(Route, { path: "/ai-career", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(AICareerAdvisor, {}) }) }), _jsx(Route, { path: "/ai-resume", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(AIResumeAnalyzer, {}) }) }), _jsx(Route, { path: "/ai-interview", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(AIMockInterview, {}) }) }), _jsx(Route, { path: "/student/ai", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(AIInsightsDashboard, {}) }) }), _jsx(Route, { path: "/admin/agents", element: _jsx(ProtectedRoute, { allowedRoles: ['ADMIN', 'SUPER_ADMIN'], children: _jsx(AgentHealthDashboard, {}) }) }), _jsx(Route, { path: "/student/success-agent", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(StudentSuccessAgent, {}) }) }), _jsx(Route, { path: "/student/placement-readiness", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(PlacementReadinessAgent, {}) }) }), _jsx(Route, { path: "/student/learning-path", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(LearningPathAgent, {}) }) }), _jsx(Route, { path: "/faculty/insights-agent", element: _jsx(ProtectedRoute, { allowedRoles: ['FACULTY', 'ADMIN'], children: _jsx(FacultyInsightsAgent, {}) }) }), _jsx(Route, { path: "/placement/analytics-agent", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementAnalyticsAgent, {}) }) }), _jsx(Route, { path: "/placement/drives", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementDrives, {}) }) }), _jsx(Route, { path: "/placement/drives/:driveId", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementDriveDetail, {}) }) }), _jsx(Route, { path: "/placement/applications", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementApplications, {}) }) }), _jsx(Route, { path: "/placement/interviews", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementInterviews, {}) }) }), _jsx(Route, { path: "/placement/offers", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementOffers, {}) }) }), _jsx(Route, { path: "/placement/placements", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementOutcomes, {}) }) }), _jsx(Route, { path: "/placement/companies", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementCompanies, {}) }) }), _jsx(Route, { path: "/placement/students", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementStudents, {}) }) }), _jsx(Route, { path: "/placement/readiness", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementReadiness, {}) }) }), _jsx(Route, { path: "/placement/at-risk", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementAtRisk, {}) }) }), _jsx(Route, { path: "/placement/analytics", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementAnalytics, {}) }) }), _jsx(Route, { path: "/placement/ai-insights", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementAIInsights, {}) }) }), _jsx(Route, { path: "/placement/calendar", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementCalendar, {}) }) }), _jsx(Route, { path: "/placement/notifications", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementNotifications, {}) }) }), _jsx(Route, { path: "/placement/reports", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementReports, {}) }) }), _jsx(Route, { path: "/placement/settings", element: _jsx(ProtectedRoute, { allowedRoles: ['PLACEMENT_OFFICER', 'ADMIN'], children: _jsx(PlacementSettings, {}) }) }), _jsx(Route, { path: "/student/job-matching", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(JobMatchingAgent, {}) }) }), _jsx(Route, { path: "/student/application-strategy", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(ApplicationStrategyAgent, {}) }) }), _jsx(Route, { path: "/student/skill-gap", element: _jsx(ProtectedRoute, { allowedRoles: ['STUDENT'], children: _jsx(SkillGapAgent, {}) }) }), _jsx(Route, { path: "/student/career-growth", element: _jsx(ProtectedRoute, { allowedRoles:     ['STUDENT'], children: _jsx(CareerGrowthAgent, {}) }) }), _jsx(Route, { path: "*", element: _jsx(RouteFallback, {}) })] }) }) }) }));
}
export default App;
