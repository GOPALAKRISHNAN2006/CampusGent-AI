import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AppShell } from './components/layout/AppShell';
import { AICareerAdvisor } from './pages/AICareerAdvisor';
import { AIResumeAnalyzer } from './pages/AIResumeAnalyzer';
import { AIMockInterview } from './pages/AIMockInterview';
import { StudentDashboard } from './pages/StudentDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { PlacementDashboard } from './pages/PlacementDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AIInsightsDashboard } from './pages/AIInsightsDashboard';
import { AgentHealthDashboard } from './pages/AgentHealthDashboard';
import { StudentSuccessAgent } from './pages/StudentSuccessAgent';
import { PlacementReadinessAgent } from './pages/PlacementReadinessAgent';
import { LearningPathAgent } from './pages/LearningPathAgent';
import { FacultyInsightsAgent } from './pages/FacultyInsightsAgent';
import { PlacementAnalyticsAgent } from './pages/PlacementAnalyticsAgent';
import { JobMatchingAgent } from './pages/JobMatchingAgent';
import { ApplicationStrategyAgent } from './pages/ApplicationStrategyAgent';
import { SkillGapAgent } from './pages/SkillGapAgent';
import { CareerGrowthAgent } from './pages/CareerGrowthAgent';

// Redesigned Placement Module Pages
import { PlacementDrives } from './pages/PlacementDrives';
import { PlacementDriveDetail } from './pages/PlacementDriveDetail';
import { PlacementApplications } from './pages/PlacementApplications';
import { PlacementInterviews } from './pages/PlacementInterviews';
import { PlacementOffers } from './pages/PlacementOffers';
import { PlacementOutcomes } from './pages/PlacementOutcomes';
import { PlacementCompanies } from './pages/PlacementCompanies';
import { PlacementStudents } from './pages/PlacementStudents';
import { PlacementReadiness } from './pages/PlacementReadiness';
import { PlacementAtRisk } from './pages/PlacementAtRisk';
import { PlacementAnalytics } from './pages/PlacementAnalytics';
import { PlacementAIInsights } from './pages/PlacementAIInsights';
import { PlacementCalendar } from './pages/PlacementCalendar';
import { PlacementNotifications } from './pages/PlacementNotifications';
import { PlacementReports } from './pages/PlacementReports';
import { PlacementSettings } from './pages/PlacementSettings';

// Redesigned Student Module Pages
import { StudentProfile } from './pages/StudentProfile';
import { StudentAcademics } from './pages/StudentAcademics';
import { StudentLearning } from './pages/StudentLearning';
import { StudentCareer } from './pages/StudentCareer';
import { StudentPlacements } from './pages/StudentPlacements';
import { StudentResume } from './pages/StudentResume';
import { StudentSkillsProjects } from './pages/StudentSkillsProjects';
import { StudentApplications } from './pages/StudentApplications';
import { StudentNotifications } from './pages/StudentNotifications';
import { StudentSettings } from './pages/StudentSettings';

// Redesigned Faculty Module Pages
import { FacultyClasses } from './pages/FacultyClasses';
import { FacultyClassDetail } from './pages/FacultyClassDetail';
import { FacultyStudents } from './pages/FacultyStudents';
import { FacultyAttendance } from './pages/FacultyAttendance';
import { FacultyAssessments } from './pages/FacultyAssessments';
import { FacultyMarks } from './pages/FacultyMarks';
import { FacultyPerformance } from './pages/FacultyPerformance';
import { FacultyAtRisk } from './pages/FacultyAtRisk';
import { FacultyAIInsights } from './pages/FacultyAIInsights';
import { FacultyCourses } from './pages/FacultyCourses';
import { FacultyTimetable } from './pages/FacultyTimetable';
import { FacultyCalendar } from './pages/FacultyCalendar';
import { FacultyNotifications } from './pages/FacultyNotifications';
import { FacultySettings } from './pages/FacultySettings';
import { FacultyAnnouncements } from './pages/FacultyAnnouncements';

const DashboardSwitch: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'STUDENT') return <StudentDashboard />;
  if (user?.role === 'FACULTY') return <FacultyDashboard />;
  if (user?.role === 'PLACEMENT_OFFICER') return <PlacementDashboard />;
  return <AdminDashboard />;
};

// Protected Route Guard Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <AppShell>{children}</AppShell>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardSwitch />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/academics"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentAcademics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learning"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentLearning />
              </ProtectedRoute>
            }
          />

          <Route
            path="/career"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentCareer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/placements"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentPlacements />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentResume />
              </ProtectedRoute>
            }
          />

          <Route
            path="/skills-projects"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentSkillsProjects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/applications"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentNotifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentSettings />
              </ProtectedRoute>
            }
          />

          {/* Faculty Redesigned Routes */}
          <Route
            path="/faculty/classes"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultyClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/classes/:classId"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultyClassDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/students"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultyStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/attendance"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultyAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/assessments"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultyAssessments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/marks"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultyMarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/performance"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultyPerformance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/at-risk"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultyAtRisk />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/ai-insights"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultyAIInsights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/courses"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/timetable"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultyTimetable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/calendar"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultyCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/notifications"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultyNotifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/settings"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultySettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/announcements"
            element={
              <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}>
                <FacultyAnnouncements />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold text-brand-900">Job Board</h1>
                  <p className="text-brand-500">Explore career opportunities and track active vacancy lists.</p>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-career"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <AICareerAdvisor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-resume"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <AIResumeAnalyzer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-interview"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <AIMockInterview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/ai"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <AIInsightsDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/agents"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                <AgentHealthDashboard />
              </ProtectedRoute>
            }
          />

          {/* New Agent Pages */}
          <Route path="/student/success-agent" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentSuccessAgent /></ProtectedRoute>} />
          <Route path="/student/placement-readiness" element={<ProtectedRoute allowedRoles={['STUDENT']}><PlacementReadinessAgent /></ProtectedRoute>} />
          <Route path="/student/learning-path" element={<ProtectedRoute allowedRoles={['STUDENT']}><LearningPathAgent /></ProtectedRoute>} />
          <Route path="/faculty/insights-agent" element={<ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']}><FacultyInsightsAgent /></ProtectedRoute>} />
          <Route path="/placement/analytics-agent" element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER', 'ADMIN']}><PlacementAnalyticsAgent /></ProtectedRoute>} />
          
          {/* Redesigned Placement Officer Pages */}
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
          <Route path="/student/job-matching" element={<ProtectedRoute allowedRoles={['STUDENT']}><JobMatchingAgent /></ProtectedRoute>} />
          <Route path="/student/application-strategy" element={<ProtectedRoute allowedRoles={['STUDENT']}><ApplicationStrategyAgent /></ProtectedRoute>} />
          <Route path="/student/skill-gap" element={<ProtectedRoute allowedRoles={['STUDENT']}><SkillGapAgent /></ProtectedRoute>} />
          <Route path="/student/career-growth" element={<ProtectedRoute allowedRoles={['STUDENT']}><CareerGrowthAgent /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
