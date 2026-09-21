# Testing Strategy - CampusGent AI

This document specifies the testing frameworks, strategies, and verification vectors for **CampusGent AI**.

---

## 1. Testing Matrix

The validation matrix covers the three system components:

```
+-----------------------------------------------------------+
|                        E2E TESTING                        |
|             Playwright (Simulates user browsers)          |
+-----------------------------+-----------------------------+
                              v
+-----------------------------+-----------------------------+
|                      INTEGRATION TESTING                  |
|          Supertest (REST APIs) + Mongoose Memory DB       |
+-----------------------------+-----------------------------+
                              v
+-----------------------------+-----------------------------+
|                         UNIT TESTING                      |
|         Vitest (Helper functions, schema checks, RBAC)    |
+-----------------------------------------------------------+
```

---

## 2. Test Suites Setup

### 2.1 Backend Unit & Integration Tests
- **Framework**: Vitest & Supertest.
- **Database**: Mongoose connected to a local/CI test MongoDB database (or MongoDB memory server).
- **Target Areas**:
  - `auth`: Registers, logs in, generates cookies, handles refresh token rotation, blocks invalid tokens.
  - `rbac`: Rejects users without required credentials (e.g. Students accessing `jobs:write`).
  - `ai.service`: Validates formatted prompts, JSON schema parsing, and mock fallbacks.

### 2.2 Frontend Unit Tests
- **Framework**: Vitest, React Testing Library, and happy-dom.
- **Target Areas**:
  - Form validation: Zod validation boundaries on Registration forms and Profile setup forms.
  - Component rendering: AppShell sidebar switches, analytical charts loading states, empty UI placeholders.

### 2.3 E2E Tests
- **Framework**: Playwright.
- **Critical Flow Paths**:
  - Student registers, logs in, fills profile, requests career recommendation roadmap, views open jobs, applies.
  - Placement officer logs in, creates job listing, reviews student profile, triggers status update to `INTERVIEW`, schedules slot.

---

## 3. Security Penetration Verification

Run verification scripts to ensure security barriers are functioning:
1. **Escalation vectors**: Attempt `GET /api/v1/users/manage` with a `STUDENT` JWT role. Expect code `403 Forbidden`.
2. **Brute Force checks**: Attempt login with incorrect credentials 6 times. Expect code `429 Too Many Requests`.
3. **IDOR checks**: Attempt updating a profile `PUT /api/v1/students/profile` of a different user using a student's session. Expect code `403 Forbidden`.
