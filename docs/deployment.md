# Deployment Architecture - CampusGent AI

This document outlines the deployment configurations, Docker setups, CI/CD pipeline, and hosting strategies for **CampusGent AI**.

---

## 1. Hosting Environment Strategy

```
  [DNS: campusgent.com]
          |
     +----+----+
     | Cloudflare (SSL/WAF/Proxy)
     +----+----+
          |
     +----+------------------------------+------------------------------+
     |                                   |                              |
     v                                   v                              v
[Frontend Target]                 [Backend Target]               [Database Target]
Vercel / Netlify                  Render / AWS ECS / Railway     MongoDB Atlas
(Static SPA assets)               (Node.js Docker Container)     (Cluster Replica Set)
```

---

## 2. Docker Containers Layout

The system features three services:

1. **`web`**: Serves React static files compiled by Vite, proxied by Nginx.
2. **`server`**: Runs the compiled TypeScript REST API Node.js process.
3. **`mongodb`**: Database server used for local and testing environments.

---

## 3. GitHub Actions CI/CD Pipeline

The GitHub Actions configuration runs on every push and pull request to the `main` branch.

```
[Trigger: Push to main]
        |
  [Lint & Style] ----> Check ESLint & Prettier configs
        |
  [Typecheck] --------> Compile Shared & Server Types (`tsc --noEmit`)
        |
  [Test Suite] -------> Run Vitest & Supertest
        |
  [Docker Build] -----> Build web and server docker images
        |
  [Deploy Action] ----> Ship to host containers (Render / ECS)
```

---

## 4. Production Environment Requirements

Every production node requires these variables securely configured:
- `NODE_ENV=production`
- `PORT=5000`
- `MONGODB_URI` (Atlas connection string)
- `JWT_SECRET` (Strong cryptographic signature)
- `JWT_REFRESH_SECRET`
- `AI_API_KEY` (OpenAI / Gemini credential)
- `CLIENT_URL` (Allowed CORS Origin)
