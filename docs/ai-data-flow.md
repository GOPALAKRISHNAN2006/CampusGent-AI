# AI Data Flow & Cache Specifications - CampusGent AI

This document specifies data movement pipelines, caching parameters, and cache invalidation events.

---

## 1. Unified Event Flow

When student records change, corresponding cached AI insights (roadmaps, skills audits) immediately expire to prevent stale recommendation states.

```
[Student edits profile (React UI)]
               |
               v
[PUT /api/v1/students/profile]
               |
               v
[MongoDB Profile Updates] -> Trigger Event: `student.profile.updated`
                                    |
                                    v
                       [Invalidate Stale Insights]
                                    |
                                    v
                       [Clear AIInsight cache]
```

---

## 2. Event Registry & Invalidation Mapping

The system triggers cache clearance routines on the following events:

| Event Name | Affected Collections | Invalidation Action |
| :--- | :--- | :--- |
| `student.profile.updated` | `student_profiles` | Expire corresponding `CAREER_ROADMAP` insights |
| `job.created` / `job.updated` | `jobs` | Expire matches rankings in `AIInsight` |
| `interview.completed` | `interviews` | Invalidate previous mock scorecard caches |

---

## 3. Caching Strategy
- **Roadmaps & Recommendations**: Cached inside `ai_insights` collections with a 24-hour TTL.
- **ATS Resume Scores**: Cached until `resumeUrl` changes.
- **Interview QA lists**: Cached during the lifecycle of the interview session.
