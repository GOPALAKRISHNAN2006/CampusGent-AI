# Requirements Specification - CampusGent AI

This document specifies the system actors, roles, permissions, modules, and functional requirements for the **CampusGent AI** platform.

---

## 1. System Actors & Roles

The system uses Role-Based Access Control (RBAC) to enforce permissions. The actors are:

1. **Student**: The primary user who completes profiles, views analytics, receives AI recommendations, applies for jobs, prepares for interviews, and takes mock interviews.
2. **Faculty**: Academic mentors who monitor academic progress, attendance, and identify at-risk students based on AI insights.
3. **Placement Officer**: Careers team members who manage corporate relations, post jobs, run placement drives, shortlist students, and view placement rate analytics.
4. **Admin**: Platform administrators who manage users, departments, courses, skills, system configs, and inspect audit logs.

---

## 2. RBAC Permission Matrix

Every endpoint and service must enforce this permission model.

| Permission | Student | Faculty | Placement Officer | Admin | Description |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `profile:read` | Yes | Yes | Yes | Yes | View student or user profiles |
| `profile:write` | Yes | No | No | Yes | Create and update student profile |
| `academics:read` | Yes | Yes | Yes | Yes | View marks, GPA, and attendance data |
| `academics:write`| No | Yes | No | Yes | Input marks, GPA, and attendance |
| `jobs:read` | Yes | Yes | Yes | Yes | View job descriptions and requirements |
| `jobs:write` | No | No | Yes | Yes | Post, edit, and delete job postings |
| `applications:read`| Yes | Yes | Yes | Yes | View status of applications |
| `applications:write`| Yes | No | Yes | Yes | Submit, screen, or update applications |
| `ai:career` | Yes | No | No | Yes | Invoke LLM career recommendation engine |
| `ai:resume` | Yes | No | No | Yes | Invoke resume score and feedback tool |
| `ai:interview` | Yes | No | No | Yes | Run interactive AI mock interviews |
| `users:manage` | No | No | No | Yes | Create, delete, or modify system users |
| `system:logs` | No | No | No | Yes | View system configuration and audit logs |

---

## 3. Core Modules

### 3.1 Authentication & Profile Module
- JWT secure HTTP-only cookies with rotating refresh tokens.
- Mandatory password hashing using bcrypt.
- Profile setup wizard for students.
- Multi-step validation of educational and social attributes.

### 3.2 Job & Placement Module
- Job Posting dashboard for Placement Officers.
- Status workflows for applications: `APPLIED` -> `SCREENING` -> `SHORTLISTED` -> `INTERVIEW` -> `SELECTED` -> `REJECTED` -> `WITHDRAWN`.
- Automatic eligibility criteria filter (e.g. minimum CGPA, specific departments, backlog checks).

### 3.3 AI Career Intelligence Module
- **AI Career Advisor**: Analyzes student profile, provides dynamic roadmaps and targeted technologies.
- **AI Resume Analyzer**: Analyzes resume content structure, returns ATS readability metrics, weakness flags, and missing keywords.
- **AI Mock Interview**: Chat interface offering dynamic technical and behavioral interview simulations, ending in structured score cards.

### 3.4 Academic Tracking & Analytics Module
- Attendance and CGPA trend visualizations.
- AI detection of "at-risk" students (e.g., GPA < 6.0 or attendance < 75%) displayed on the Faculty Dashboard.
- Placement officer rate analytics (department ratios, salary stats, company volumes).

### 3.5 Global Search & Notifications Module
- Role-scoped global text search across jobs, students, and companies.
- Real-time in-app alerts for placement updates, interview invitations, and AI insights.
