import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './components/ui/Toast.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { Home } from './pages/Home.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

const lazyPage = (loader, exportName) =>
  React.lazy(() => loader().then((module) => ({ default: module[exportName] })));

// Lazy-loaded pages
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

// Placement pages
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

// Student pages
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

// Faculty pages
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
  if (user?.role === 'STUDENT') return <StudentDashboard />;
  if (user?.role === 'FACULTY') return <FacultyDashboard />;
  if (user?.role === 'PLACEMENT_OFFICER') return <PlacementDashboard />;
  return <AdminDashboard />;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AppShell>{children}</AppShell>;
};

const RouteFallback = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-600" />
      </div>
    );
  }

  return <Navigate to={user ? '/dashboard' : '/'} replace />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense
            fallback={
              <div role="status" aria-live="polite" className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-600" aria-label="Loading page" />
              </div>
            }
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />

              {/* Protected Dashboard Route */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardSwitch /></ProtectedRoute>} />

              {/* Student Routes */}
              <Route path="/profile" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentProfile /></ProtectedRoute>} />
              <Route path="/academics" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentAcademics /></ProtectedRoute>} />
              <Route path="/learning" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentLearning /></ProtectedRoute>} />
              <Route path="/career" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentCareer /></ProtectedRoute>} />
              <Route path="/placements" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentPlacements /></ProtectedRoute>} />
              <Route path="/resume" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentResume /></ProtectedRoute>} />
              <Route path="/skills-projects" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentSkillsProjects /></ProtectedRoute>} />
              <Route path="/applications" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentApplications /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentNotifications /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentSettings /></ProtectedRoute>} />
              <Route path="/jobs" element={<ProtectedRoute allowedRoles={['STUDENT', 'PLACEMENT_OFFICER']}><StudentPlacements /></ProtectedRoute>} />

              {/* AI Agent Tools */}
              <Route path="/ai-career" element={<ProtectedRoute allowedRoles={['STUDENT']}><AICareerAdvisor /></ProtectedRoute>} />
              <Route path="/ai-resume" element={<ProtectedRoute allowedRoles={['STUDENT']}><AIResumeAnalyzer /></ProtectedRoute>} />
              <Route path="/ai-interview" element={<ProtectedRoute allowedRoles={['STUDENT']}><AIMockInterview /></ProtectedRoute>} />
              <Route path="/student/ai" element={<ProtectedRoute allowedRoles={['STUDENT']}><AIInsightsDashboard /></ProtectedRoute>} />
              <Route path="/student/success-agent" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentSuccessAgent /></ProtectedRoute>} />
              <Route path="/student/placement-readiness" element={<ProtectedRoute allowedRoles={['STUDENT']}><PlacementReadinessAgent /></ProtectedRoute>} />
              <Route path="/student/learning-path" element={<ProtectedRoute allowedRoles={['STUDENT']}><LearningPathAgent /></ProtectedRoute>} />
              <Route path="/student/job-matching" element={<ProtectedRoute allowedRoles={['STUDENT']}><JobMatchingAgent /></ProtectedRoute>} />
              <Route path="/student/application-strategy" element={<ProtectedRoute allowedRoles={['STUDENT']}><ApplicationStrategyAgent /></ProtectedRoute>} />
              <Route path="/student/skill-gap" element={<ProtectedRoute allowedRoles={['STUDENT']}><SkillGapAgent /></ProtectedRoute>} />
              <Route path="/student/career-growth" element={<ProtectedRoute allowedRoles={['STUDENT']}><CareerGrowthAgent /></ProtectedRoute>} />

              {/* Faculty Routes */}
              <Route path="/faculty/classes" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyClasses /></ProtectedRoute>} />
              <Route path="/faculty/classes/:classId" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyClassDetail /></ProtectedRoute>} />
              <Route path="/faculty/students" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyStudents /></ProtectedRoute>} />
              <Route path="/faculty/attendance" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyAttendance /></ProtectedRoute>} />
              <Route path="/faculty/assessments" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyAssessments /></ProtectedRoute>} />
              <Route path="/faculty/marks" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyMarks /></ProtectedRoute>} />
              <Route path="/faculty/performance" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyPerformance /></ProtectedRoute>} />
              <Route path="/faculty/at-risk" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyAtRisk /></ProtectedRoute>} />
              <Route path="/faculty/ai-insights" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyAIInsights /></ProtectedRoute>} />
              <Route path="/faculty/courses" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyCourses /></ProtectedRoute>} />
              <Route path="/faculty/timetable" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyTimetable /></ProtectedRoute>} />
              <Route path="/faculty/calendar" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyCalendar /></ProtectedRoute>} />
              <Route path="/faculty/notifications" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyNotifications /></ProtectedRoute>} />
              <Route path="/faculty/settings" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultySettings /></ProtectedRoute>} />
              <Route path="/faculty/announcements" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyAnnouncements /></ProtectedRoute>} />
              <Route path="/faculty/insights-agent" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyInsightsAgent /></ProtectedRoute>} />

              {/* Placement Officer Routes */}
              <Route path="/placement/drives" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementDrives /></ProtectedRoute>} />
              <Route path="/placement/drives/:driveId" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementDriveDetail /></ProtectedRoute>} />
              <Route path="/placement/applications" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementApplications /></ProtectedRoute>} />
              <Route path="/placement/interviews" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementInterviews /></ProtectedRoute>} />
              <Route path="/placement/offers" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementOffers /></ProtectedRoute>} />
              <Route path="/placement/placements" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementOutcomes /></ProtectedRoute>} />
              <Route path="/placement/companies" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementCompanies /></ProtectedRoute>} />
              <Route path="/placement/students" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementStudents /></ProtectedRoute>} />
              <Route path="/placement/readiness" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementReadiness /></ProtectedRoute>} />
              <Route path="/placement/at-risk" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementAtRisk /></ProtectedRoute>} />
              <Route path="/placement/analytics" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementAnalytics /></ProtectedRoute>} />
              <Route path="/placement/ai-insights" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementAIInsights /></ProtectedRoute>} />
              <Route path="/placement/calendar" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementCalendar /></ProtectedRoute>} />
              <Route path="/placement/notifications" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementNotifications /></ProtectedRoute>} />
              <Route path="/placement/reports" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementReports /></ProtectedRoute>} />
              <Route path="/placement/settings" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementSettings /></ProtectedRoute>} />
              <Route path="/placement/analytics-agent" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementAnalyticsAgent /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/agents" element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}><AgentHealthDashboard /></ProtectedRoute>} />

              {/* Fallback 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
