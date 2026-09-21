# REST API Design Specification - CampusGent AI

This document specifies the REST API design, endpoint layout, versioning, request validations, and response schemas.

---

## 1. Versioning & Formats

All APIs are versioned under `/api/v1/`.

### 1.1 Success Response Structure
```json
{
  "success": true,
  "data": {}
}
```

### 1.2 Error Response Structure
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error description",
    "details": []
  }
}
```

---

## 2. API Endpoints

### 2.1 Authentication & Registration (`/api/v1/auth`)

- **`POST /register`**: Registers a new user.
  - *Payload*: `{ "name", "email", "password", "role" }`
- **`POST /login`**: Logs in a user. Generates HTTP-only cookie with refresh token and returns access token.
  - *Payload*: `{ "email", "password" }`
- **`POST /logout`**: Clears authorization cookies and revokes refresh tokens.
- **`POST /refresh`**: Refreshes expired access tokens.
- **`GET /me`**: Returns profile summary of the logged-in user.

### 2.2 Student Profiles (`/api/v1/students`)

- **`GET /profile`**: Retrieves student profile.
- **`PUT /profile`**: Updates student profile credentials (skills, projects, education links).
- **`POST /resume/upload`**: Securely parses and stores pdf resume files.

### 2.3 Job & Placement Portal (`/api/v1/jobs`)

- **`GET /`**: Searchable/filterable job postings. Supports pagination.
- **`GET /:id`**: Retrives full job details.
- **`POST /`**: Create a new job listing (Placement Officer/Admin).
- **`PUT /:id`**: Edit job fields.
- **`DELETE /:id`**: Remove job posting.

### 2.4 Applications (`/api/v1/applications`)

- **`POST /`**: Submit application for a job vacancy.
  - *Payload*: `{ "jobId", "resumeUrl" }`
- **`GET /student`**: Get all applications submitted by the logged-in student.
- **`GET /job/:jobId`**: Retrieve applications for a specific job (Placement Officer).
- **`PUT /:id/status`**: Update student application status.
  - *Payload*: `{ "status", "remarks" }`

### 2.5 AI Career Tools (`/api/v1/ai`)

- **`POST /career-advisor`**: Invokes AI Career Advisor to generate skills gap analysis and a custom training path.
- **`POST /resume-analyzer`**: Upload/input resume text to retrieve structured feedback, weak phrasing alerts, and ATS score.
- **`POST /interview-prep`**: Retrieve customized list of behavioral and technical questions for a target job.
- **`POST /mock-interview/start`**: Initiates a dynamic conversational interview session.
- **`POST /mock-interview/chat`**: Sends user response, returns next questions, and gives micro-feedback.

### 2.6 Analytics & System Logs (`/api/v1/analytics`)

- **`GET /student`**: Attendance trends, academic reports, progress percentages.
- **`GET /placement`**: Placement drives statistics, hiring yields, department ratio.
- **`GET /admin`**: API usage counters, token costs, active users, audit logs.
