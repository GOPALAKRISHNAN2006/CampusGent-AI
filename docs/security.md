# Security & Hardening Design - CampusGent AI

This document specifies the security controls, protocols, and defensive designs of **CampusGent AI**.

---

## 1. Authentication & Session Security

- **Password Hashing**: Stored using bcrypt with a work factor of 12. No plaintext password is ever logged or printed.
- **Access Tokens (JWT)**: Short lifespan (15 minutes). Sent in the `Authorization: Bearer <token>` header. Contains standard claims (`userId`, `role`, `permissions`).
- **Refresh Tokens**: Stored in a secure, HTTP-only, SameSite=Strict cookie. Lifespan of 7 days.
- **Refresh Token Rotation (RTR)**: Each time a refresh token is used, a new one is returned. Used tokens are added to a blacklisted store. If an old refresh token is reused, all tokens associated with the user session are immediately invalidated (anti-replay attack protection).

---

## 2. Defensive Controls

### 2.1 NoSQL Injection Protection
All database queries use Mongoose models with structured filters. Raw queries matching parameters directly are prohibited. All input variables are sanitized and parsed before database insertion.

### 2.2 Cross-Site Scripting (XSS) & Cross-Site Request Forgery (CSRF)
- React automatically escapes variables in JSX.
- Centralized `Helmet` configurations enforce strict Content Security Policies (CSP).
- HTTP-only flags on session cookies prevent client-side JavaScript access (`document.cookie`), mitigating XSS-based token theft.

### 2.3 Insecure Direct Object References (IDOR)
Any request accessing resource parameters (e.g., `GET /api/v1/students/:id`) compares the authenticated user's ID and role against the resource owner:
```typescript
if (req.user.role !== 'ADMIN' && req.user.id !== student.userId) {
  throw new UnauthorizedError("Access Denied");
}
```

### 2.4 Rate Limiting & Throttling
- Standard API endpoints: Limit of 100 requests per 15 minutes.
- Auth endpoints (`/login`, `/register`, `/forgot-password`): Limit of 5 attempts per 15 minutes per IP to block brute-force attempts.

---

## 3. File Upload Safety

For resume documents (PDF / DOCX):
1. **Filename Sanitization**: Uploaded files are renamed using UUID v4 names. Original filenames are stored inside MongoDB and not directly on the storage filesystem.
2. **MIME & Type Verification**: Validates file types by inspecting file extensions and checking content MIME types via middleware.
3. **Storage Separation**: Files are placed outside public or executable directories.
