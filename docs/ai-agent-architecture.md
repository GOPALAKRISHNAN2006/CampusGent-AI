# AI Agent Architecture - CampusGent AI

This document specifies the master architecture, contract specifications, context mappings, and execution orchestrator of the **CampusGent AI** Agent Ecosystem.

---

## 1. The Ecosystem Layout

The agents function inside a linked ecosystem, feeding from a unified database state and consuming summarized context structures.

```
                    CAMPUSGENT AI
                          |
          +---------------+---------------+
          |               |               |
      Academic         Career         Placement
      Intelligence     Intelligence   Intelligence
          |               |               |
          v               v               v
   Student Success   Career Agent    Job Matching
   Agent             Resume Agent    Placement Agent
          |               |               |
          +---------------+---------------+
                          |
                    AI ORCHESTRATOR
                          |
          +---------------+---------------+
          |               |               |
     Learning Path    Mock Interview   Faculty Insights
          |               |               |
          +---------------+---------------+
                          |
                    Student Profile
                          |
                    Unified Student
                    Intelligence Graph
```

---

## 2. Agent Execution Interface (The Contract)

To guarantee consistency, all 21 AI agents implement the standard `IAgent` contract defined in [`apps/server/src/ai/types.ts`](file:///c:/Users/ELCOT/OneDrive/Desktop/STUDY%20FOLDER/CampusGent-AI/apps/server/src/ai/types.ts).

```typescript
export interface AgentMetadata {
  name: string;
  version: string;
  description: string;
  inputSchema: any;  // Zod validation model
  outputSchema: any; // Zod validation model
  permissions: string[];
  promptVersion: string;
}

export interface IAgent {
  metadata: AgentMetadata;
  execute(studentId: string, customParams?: any): Promise<any>;
}
```

---

## 3. Reusable Context Builder (`StudentIntelligenceSnapshot`)

To optimize tokens usage and maintain strict fact consistency, the `AIContextBuilder` class aggregates a normalized snapshot of the student's profile. This snapshot is the **source of truth** for all cognitive reasoning tasks.

```json
{
  "academic": {
    "cgpa": 8.4,
    "semester": 4,
    "backlogs": 0,
    "attendance": 88
  },
  "skills": [
    { "name": "React", "proficiency": "ADVANCED", "verified": true }
  ],
  "projects": [
    { "title": "CampusGent AI", "description": "AI agent platform using workspaces", "technologies": ["React", "Express"] }
  ],
  "applications": [
    { "jobTitle": "Frontend Engineer", "company": "Stripe", "status": "SHORTLISTED" }
  ]
}
```
*Note: AI agents never query MongoDB collections independently; they consume this pre-parsed, role-authorized snapshot.*
