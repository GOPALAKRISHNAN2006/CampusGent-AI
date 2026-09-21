# System Architecture - CampusGent AI

This document details the multi-tier software architecture and data flows of **CampusGent AI**.

---

## 1. High-Level Architecture Overview

CampusGent AI uses a modern, modular clean architecture organized as a Monorepo.

```
+-----------------------------------------------------------+
|                       FRONTEND (web)                      |
|  React (SPA) + TanStack Query + Axios + Tailwind CSS      |
+-----------------------------+-----------------------------+
                              | HTTPS REST / JSON
                              v
+-----------------------------------------------------------+
|                     BACKEND (server)                      |
|  Express.js + TypeScript + Winston Logs                   |
|                                                           |
|  +-----------------------------------------------------+  |
|  | Route / Middleware Layer (Auth, RBAC, Rate-Limit)   |  |
|  +--------------------------+--------------------------+  |
|                             |
|  +--------------------------v--------------------------+  |
|  | Controller Layer (Req Parse, Zod Validate)          |  |
|  +--------------------------+--------------------------+  |
|                             |
|  +--------------------------v--------------------------+  |
|  | Service Layer (Business rules, AI triggers)          |  |
|  +--------------------------+--------------------------+  |
|                             |
|  +--------------------------v--------------------------+  |
|  | Repository / Data Layer (Mongoose ODM / MongoDB)    |  |
|  +-----------------------------------------------------+  |
+-----------------------------+-----------------------------+
                              | MongoDB Wire Protocol
                              v
+-----------------------------------------------------------+
|                      DATABASE SYSTEM                      |
|  MongoDB Core Engine                                      |
+-----------------------------------------------------------+
```

---

## 2. AI Service Architecture

All AI processes run securely through the backend. The frontend never communicates directly with LLM providers to avoid api-key exposure and prompt manipulation.

```
[React App (Client)]
        |
        | 1. POST /api/v1/ai/career-advisor
        v
[Express Controller]
        |
        | 2. Input validation & Profile aggregation
        v
[AI Service Class]
        |
        | 3. Format system instruction prompt & inject student context
        v
[LLM Provider API (OpenAI / Gemini)]
        |
        | 4. Return structured JSON
        v
[AI Service Class] (Checks validity & structure)
        v
[Express Controller] -> [React App (Client)] (Renders feedback component)
```

---

## 3. Monorepo Structural Separation

The workspace is split into three scopes:

1. `apps/web`: Responsive single page application (Vite-powered React).
2. `apps/server`: TypeScript REST server (Node.js/Express).
3. `packages/shared`: Code reuse for roles, validation models (Zod schemas), and types.
