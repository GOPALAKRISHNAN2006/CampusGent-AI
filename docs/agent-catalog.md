# Agent Catalog - CampusGent AI

This catalog documents the responsibilities, inputs, and outputs of the 21 agents in the **CampusGent AI** Ecosystem.

---

## 1. Academic Agents

### 1.1 Student Success Agent
- **Inputs**: GPA, attendance history, grades list, study progress.
- **Outputs**: Academic improvement plan, strengths, weaknesses, at-risk warnings.
- **Permissions**: `profile:read`

### 1.2 Learning Path Agent
- **Inputs**: Skill gaps, academic history, target career goals.
- **Outputs**: Step-by-step roadmap, learning targets, milestones.
- **Permissions**: `profile:read`

### 1.3 Student Risk Prediction Agent
- **Inputs**: Attendance changes, exam grades, activity indexes.
- **Outputs**: Academic risk level, human intervention recommendations.
- **Permissions**: `profile:read`

---

## 2. Career Agents

### 2.1 Career Recommendation Agent
- **Inputs**: Skills, projects, portfolio links, academic performance.
- **Outputs**: Suggested job roles, reasoning, gap analyses.
- **Permissions**: `profile:read`

### 2.2 Resume Intelligence Agent
- **Inputs**: Plain text resume, job requirements.
- **Outputs**: ATS score evaluation, weaknesses, keyword suggestions.
- **Permissions**: `profile:read`

### 2.3 Mock Interview Agent
- **Inputs**: Target role, job description, resume context.
- **Outputs**: Questions registry, evaluation scorecard.
- **Permissions**: `profile:read`

---

## 3. Placement Agents

### 3.1 Job Matching Agent
- **Inputs**: Student snapshot, job vacancy listings.
- **Outputs**: Match percentage, eligible status, matching/missing skills.
- **Permissions**: `profile:read`

### 3.2 Application Strategy Agent
- **Inputs**: Open vacancies, student profile match, deadlines.
- **Outputs**: Priority listings, resume adjustments tips.
- **Permissions**: `profile:read`

### 3.3 Placement Readiness Agent
- **Inputs**: Technical readiness, resume, interview scores.
- **Outputs**: Dynamic readiness index, weak areas, actions list.
- **Permissions**: `profile:read`
