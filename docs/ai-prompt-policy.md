# AI Prompt Management & Policy - CampusGent AI

This document specifies formatting templates, model selections, and prompt versioning controls for **CampusGent AI**.

---

## 1. System Prompt Policy

To maintain structured compliance:
1. **JSON Output Only**: Every agent system instruction ends with a strict directive: *"Your output must be a single, valid JSON object matching the requested schema. Do not include markdown code blocks or wrapper wrappers."*
2. **Deterministic Fallbacks**: If the LLM generates malformed JSON, backend parsers capture the error, attempt one retry, and default to a fallback template rather than crashing the request.
3. **No Code Execution**: Agents must never generate code that the backend executes (no dynamic SQL query creation or Node `eval` processes).

---

## 2. Prompt Version Controls

Prompts are indexed inside [`apps/server/src/ai/prompt.registry.ts`](file:///c:/Users/ELCOT/OneDrive/Desktop/STUDY%20FOLDER/CampusGent-AI/apps/server/src/ai/prompt.registry.ts) mapping prompts to semver strings:
- **v1.0.0**: Scaffolding baseline templates.
- **v1.1.0**: Isolation of untrusted variables.

Every AIInsight saved in MongoDB stores the corresponding `promptVersion` to ease debugging.
