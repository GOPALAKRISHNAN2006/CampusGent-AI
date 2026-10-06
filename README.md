# CampusGent AI — Intelligent University Operating Platform

**Unified Enterprise Platform for Student Success, Faculty Mentorship, Placement Intelligence & System Administration**

CampusGent AI is a commercial-grade, secure, multi-tenant university platform designed for Students, Faculty, Placement Officers, and Administrators. It integrates an ecosystem of **21 specialized AI agents**, real-time placement funnel analytics, automated intervention triggers, and strict Role-Based Access Control (RBAC).

---

## 🚀 Key Platform Capabilities

### 🎓 1. Student Operating Workspace
- **Academic Health & Attendance**: Real-time tracking of CGPA, semester progression, credit hours, and subject-wise attendance percentages.
- **Career & Skill Gap Radar**: AI-powered analysis comparing personal skill inventories against real-time target industry role requirements.
- **Placement Drive Hub**: One-click eligibility checking and application workflow for verified active campus placement drives.
- **AI Career Suite**:
  - **AI Career Advisor**: Structured roadmap generation broken into quarterly milestones.
  - **AI Resume Analyzer**: Section-by-section ATS compatibility evaluation, missing keywords, and structural feedback.
  - **AI Mock Interviewer**: Interactive multi-turn interview simulations with automated post-interview scorecard reports.

### 👩‍🏫 2. Faculty Academic Portal
- **Classroom Management**: Course rosters, class schedules, timetable view, and assignment score entry.
- **At-Risk Student Identification**: Automated threshold detection flagging students needing immediate academic intervention.
- **Faculty AI Insights Agent**: Class-wide performance trends, attendance degradation warnings, and customized teaching recommendations.

### 💼 3. Placement Officer Suite
- **Recruitment Drive Management**: Create, publish, and manage multi-stage campus placement drives.
- **Eligibility Engine**: Automatic filtering based on CGPA thresholds, backlog limits, and department constraints.
- **Candidate Funnel & Offers**: Shortlisting, interview scheduling, offer tracking, and salary analytics (highest, median, average CTC).
- **Placement Readiness Radar**: Explainable student readiness score breakdown across technical skills, resume quality, project portfolio, and interview confidence.

### 🛡️ 4. Administration & System Operations
- **User & Role Management**: Real-time role upgrades, user search, and department configuration.
- **System Health Monitor**: Live database connectivity status, Node.js process uptime, memory usage metrics (RSS/Heap), and active agent registry status.
- **Audit Logging**: Immutable security log of sensitive user actions, role updates, and system configuration modifications.
- **NoSQL Injection Guard**: Global recursive input sanitizer filtering operator keys (`$`, `.`) across request bodies, parameters, and queries.

---

## 🧬 Architecture Overview

```
+-------------------------------------------------------------------+
|                        REACT 18 FRONTEND                          |
|  Tailwind CSS | Lucide Icons | Framer Motion | TanStack Query     |
+---------------------------------+---------------------------------+
                                  | HTTPS REST + JSON API
                                  v
+-------------------------------------------------------------------+
|                        EXPRESS.JS BACKEND                         |
|  JWT Auth + RTR | NoSQL Sanitizer | RBAC Middleware | Winston Log |
+---------------------------------+---------------------------------+
                                  |
            +---------------------+---------------------+
            |                                           |
            v                                           v
+-----------------------+                   +-----------------------+
|    MONGODB DATABASE   |                   |  21 AI AGENT REGISTRY |
|  User | Profile | Job |                   |  Google Gemini API    |
|  Application | Audit  |                   |  (Fallback Mock Mode) |
+-----------------------+                   +-----------------------+
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, Framer Motion, Lucide Icons, React Hook Form, Zod.
- **Backend**: Node.js, Express 4, Mongoose ODM, Winston Logger, Morgan, Helmet, CORS, Cookie Parser.
- **AI Engine**: Google Gemini API (OpenAI-compatible endpoints) with automatic fallback mock provider for offline development.
- **Security**: HttpOnly cookie JWT Refresh Token Rotation (RTR), NoSQL query sanitizer, rate-limiting per IP/user, role & permission guards.

---

## ⚡ Quick Start & Development

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://localhost:27017` or MongoDB Atlas URI.

### 2. Installation
From the root workspace directory, install dependencies across all sub-packages:
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `apps/server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campusgent
JWT_SECRET=devsecretaccesskeytoken123456
JWT_REFRESH_SECRET=devsecretrefreshkeytoken123456
CLIENT_URL=http://localhost:5173
AI_API_URL=https://generativelanguage.googleapis.com/v1beta/openai
AI_MODEL=gemini-1.5-flash
AI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```
*(If `AI_API_KEY` is omitted or set to `your_gemini_api_key_here`, the system automatically runs the AI Service in deterministic fallback mock mode).*

### 4. Seed Database
Seed sample university data (Students, Faculty, Placement Officer, Admin, Departments, Jobs, Applications):
```bash
npm run seed --prefix apps/server
```

### 5. Launch Development Servers
Start both the Express backend and Vite frontend concurrently:
```bash
npm run dev
```
- Frontend app: [http://localhost:5173](http://localhost:5173)
- Backend API server: [http://localhost:5000](http://localhost:5000)

### 6. Verify Production Build
To test full monorepo build outputs:
```bash
npm run build --prefix apps/web
```

---

## 🧪 Testing

Execute backend integration tests using Vitest:
```bash
npm test
```

---

## 🐳 Docker Deployment

Run Nginx-fronted client, Express backend, and MongoDB in containers:
```bash
docker-compose up --build
```
Access the application at [http://localhost](http://localhost).
