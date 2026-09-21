# CampusGent AI

**Autonomous Student Success & Placement Intelligence Platform**

CampusGent AI is a production-quality, secure, role-based university platform designed to support students, faculty mentors, placement officers, and platform administrators. It leverages AI models to assist with career coaching, resume feedback, and conversational mock interview practice.

---

## 1. High-Level Architecture

The platform is structured as a TypeScript monorepo using npm workspaces:

```
+-----------------------------------------------------------+
|                       FRONTEND (web)                      |
|  React (SPA) + TanStack Query + Axios + Tailwind CSS      |
+-----------------------------+-----------------------------+
                              | HTTPS REST / JSON
                              v
+-----------------------------------------------------------+
|                     BACKEND (server)                      |
|  Express.js + TypeScript + Mongoose ODM                   |
+-----------------------------+-----------------------------+
                              | MongoDB Wire Protocol
                              v
+-----------------------------------------------------------+
|                      DATABASE SYSTEM                      |
|  MongoDB Core Engine                                      |
+-----------------------------------------------------------+
```

---

## 2. Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router v6, TanStack Query v5, Axios, Recharts, Lucide Icons, React Hook Form, Zod.
- **Backend**: Node.js, Express.js, TypeScript, REST APIs, Winston Logging.
- **Database**: MongoDB, Mongoose.
- **Authentication**: Stateless JWT access tokens + secure HttpOnly cookie refresh token rotation (RTR) to prevent token replay attacks.
- **DevOps**: Docker, Docker Compose, Vitest, Supertest.

---

## 3. Directory Layout

```
campusgent-ai/
  ├── apps/
  │    ├── web/                 # React SPA Client
  │    └── server/              # Express TypeScript REST Server
  ├── packages/
  │    └── shared/              # Shared Types and Zod Schema Validations
  ├── docs/                     # Architectural & Requirement specifications
  ├── docker-compose.yml        # Orchestrates client, server, and database containers
  ├── package.json              # Monorepo Workspace configuration
  └── tsconfig.json             # Root TypeScript compilation options
```

---

## 4. Getting Started Locally

### 4.1 Prerequisites
- Node.js v20 or higher
- MongoDB running locally or a MongoDB Atlas URI

### 4.2 Installation
From the repository root workspace, run:
```bash
npm install
```

### 4.3 Configure Environment
Create a `.env` file under `apps/server/.env` matching this template:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campusgent
JWT_SECRET=supersecretaccesskeytoken123456
JWT_REFRESH_SECRET=supersecretrefreshkeytoken123456
CLIENT_URL=http://localhost:5173
AI_API_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
AI_API_KEY=your-openai-api-key
```
*(If `AI_API_KEY` is omitted or set to `mock-key-for-now`, the system automatically runs the AI Service in fallback mock mode to allow immediate development without incurring API costs).*

### 4.4 Build & Run Dev Servers
Compile the workspaces:
```bash
# 1. Compile shared types
npm run build:shared

# 2. Compile server
npm run build:server

# 3. Start development servers concurrently
npm run dev
```
The React frontend starts on [http://localhost:5173](http://localhost:5173) and proxies API calls automatically to the backend on port `5000`.

---

## 5. Running Automated Tests

To execute Vitest integration tests for API endpoints:
```bash
npm test
```

---

## 6. Docker Deployment

To launch the entire platform (Client, Server, and MongoDB database) in containerized mode:
```bash
docker-compose up --build
```
The application will be served at [http://localhost](http://localhost) (mapped via Nginx inside the frontend container).
