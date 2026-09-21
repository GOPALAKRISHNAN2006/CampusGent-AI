# Database Design - CampusGent AI

This document specifies the MongoDB collections, relationships, indices, and constraints of the platform.

---

## 1. Schema Definitions

The application uses Mongoose schemas to interface with MongoDB.

### 1.1 User Model
- **Collection**: `users`
- **Fields**:
  - `_id`: ObjectId
  - `name`: String (Required)
  - `email`: String (Required, Unique, Indexed)
  - `passwordHash`: String (Required)
  - `role`: String (Enum: `STUDENT`, `FACULTY`, `PLACEMENT_OFFICER`, `ADMIN`, `SUPER_ADMIN`)
  - `status`: String (Enum: `ACTIVE`, `INACTIVE`, `PENDING_VERIFICATION`)
  - `department`: ObjectId (Ref: `Department`, Optional)
  - `lastLoginAt`: Date
  - `createdAt`: Date
  - `updatedAt`: Date

### 1.2 StudentProfile Model
- **Collection**: `student_profiles`
- **Fields**:
  - `_id`: ObjectId
  - `user`: ObjectId (Ref: `User`, Unique, Required)
  - `rollNumber`: String (Required, Unique)
  - `department`: ObjectId (Ref: `Department`, Required)
  - `semester`: Number (Required)
  - `cgpa`: Number (Required)
  - `skills`: [{ skill: ObjectId (Ref: `Skill`), proficiency: String, verified: Boolean }]
  - `projects`: [{ title: String, description: String, technologies: [String], githubUrl: String, demoUrl: String }]
  - `certifications`: [{ name: String, issuingOrg: String, issueDate: Date, credentialUrl: String }]
  - `resumeUrl`: String
  - `githubProfile`: String
  - `linkedinProfile`: String
  - `portfolioUrl`: String
  - `careerInterests`: [String]
  - `careerGoals`: [String]
  - `placementReadinessScore`: Number
  - `createdAt`: Date
  - `updatedAt`: Date

### 1.3 FacultyProfile Model
- **Collection**: `faculty_profiles`
- **Fields**:
  - `_id`: ObjectId
  - `user`: ObjectId (Ref: `User`, Unique, Required)
  - `employeeId`: String (Required, Unique)
  - `department`: ObjectId (Ref: `Department`, Required)
  - `assignedSubjects`: [ObjectId] (Ref: `Subject`)
  - `createdAt`: Date
  - `updatedAt`: Date

### 1.4 Job Model
- **Collection**: `jobs`
- **Fields**:
  - `_id`: ObjectId
  - `company`: ObjectId (Ref: `Company`, Required)
  - `title`: String (Required)
  - `description`: String (Required)
  - `location`: String (Required)
  - `employmentType`: String (Enum: `FULL_TIME`, `PART_TIME`, `INTERNSHIP`, `CONTRACT`)
  - `salaryRange`: { min: Number, max: Number, currency: String }
  - `requiredSkills`: [ObjectId] (Ref: `Skill`)
  - `experienceRequired`: Number (In years)
  - `eligibilityCriteria`: { minCgpa: Number, allowedDepartments: [ObjectId] (Ref: `Department`), maxBacklogsAllowed: Number }
  - `applicationDeadline`: Date (Required)
  - `status`: String (Enum: `DRAFT`, `ACTIVE`, `CLOSED`, `ARCHIVED`)
  - `createdAt`: Date
  - `updatedAt`: Date

### 1.5 JobApplication Model
- **Collection**: `job_applications`
- **Fields**:
  - `_id`: ObjectId
  - `student`: ObjectId (Ref: `User`, Required, Indexed)
  - `job`: ObjectId (Ref: `Job`, Required, Indexed)
  - `status`: String (Enum: `APPLIED`, `SCREENING`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`, `WITHDRAWN`)
  - `appliedAt`: Date
  - `resumeUrl`: String
  - `notes`: String
  - `timeline`: [{ status: String, updatedAt: Date, updatedBy: ObjectId (Ref: `User`), remarks: String }]

### 1.6 Additional Collections
- `departments`: Handles college branches (`CSE`, `ECE`, `MECH`, etc.).
- `skills`: Stores standardized skill taxonomy (technical, soft).
- `interviews`: Tracks interview schedules, meeting URLs, statuses, and performance scoring.
- `notifications`: Tracks alerts for academic, placement, AI, and system events.
- `audit_logs`: Records logins, role changes, credentials changes, and administrative mutations.
- `refresh_tokens`: Enables secure JWT rotations with revocation capability.
- `ai_usages`: Records tokens used, latency, prompts, and endpoint calls for usage analytics.

---

## 2. Indices
- `users.email`: Unique index.
- `student_profiles.rollNumber`: Unique index.
- `job_applications.student_job`: Compound index (`student` + `job`) to prevent duplicate applications.
- `jobs.status_deadline`: Compound index for querying open job applications.
