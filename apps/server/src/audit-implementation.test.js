import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { User } from './models/User.js';
import { Company } from './models/Company.js';
import { Department } from './models/Department.js';

describe('🧪 Post-Audit Implementation Verification Suite', () => {
  let adminUser;
  let studentUser;
  let placementUser;
  let adminToken;
  let studentToken;
  let placementToken;

  beforeAll(async () => {
    await connectDB();

    // Create or locate test users with valid passwordHash
    const dummyHash = '$2b$12$e8xOq8iUqV9c49mN0sN.Qe7b7Z4G/cW6D9h1O5eQ9bZ';
    adminUser = await User.findOneAndUpdate(
      { email: 'admin.testsuite@campusgent.edu' },
      {
        name: 'Admin Test Suite',
        email: 'admin.testsuite@campusgent.edu',
        passwordHash: dummyHash,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
      { upsert: true, new: true }
    );

    studentUser = await User.findOneAndUpdate(
      { email: 'student.testsuite@campusgent.edu' },
      {
        name: 'Student Test Suite',
        email: 'student.testsuite@campusgent.edu',
        passwordHash: dummyHash,
        role: 'STUDENT',
        status: 'ACTIVE',
      },
      { upsert: true, new: true }
    );

    placementUser = await User.findOneAndUpdate(
      { email: 'placement.testsuite@campusgent.edu' },
      {
        name: 'Placement Test Suite',
        email: 'placement.testsuite@campusgent.edu',
        passwordHash: dummyHash,
        role: 'PLACEMENT_OFFICER',
        status: 'ACTIVE',
      },
      { upsert: true, new: true }
    );

    adminToken = jwt.sign(
      { id: adminUser._id.toString(), email: adminUser.email, role: 'ADMIN' },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    studentToken = jwt.sign(
      { id: studentUser._id.toString(), email: studentUser.email, role: 'STUDENT' },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    placementToken = jwt.sign(
      { id: placementUser._id.toString(), email: placementUser.email, role: 'PLACEMENT_OFFICER' },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('1. Admin Protection & RBAC Endpoints', () => {
    it('should reject unauthenticated requests to admin users', async () => {
      const res = await request(app).get('/api/v1/admin/users');
      expect(res.status).toBe(401);
    });

    it('should reject student token on admin users with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(res.status).toBe(403);
    });

    it('should allow admin token to fetch user directory', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.users)).toBe(true);
    });

    it('should allow admin token to fetch departments list', async () => {
      const res = await request(app)
        .get('/api/v1/admin/departments')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.departments)).toBe(true);
    });

    it('should allow admin token to fetch audit logs', async () => {
      const res = await request(app)
        .get('/api/v1/admin/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.auditLogs)).toBe(true);
    });

    it('should allow admin token to query live telemetry health with registered agents', async () => {
      const res = await request(app)
        .get('/api/v1/admin/health')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.database).toBeDefined();
      expect(res.body.data.activeAgents).toBeDefined();
      expect(Array.isArray(res.body.data.registeredAgents)).toBe(true);
    });
  });

  describe('2. User Settings Persistence', () => {
    it('should reject unauthenticated request to /auth/settings', async () => {
      const res = await request(app).get('/api/v1/auth/settings');
      expect(res.status).toBe(401);
    });

    it('should load settings for authenticated student', async () => {
      const res = await request(app)
        .get('/api/v1/auth/settings')
        .set('Authorization', `Bearer ${studentToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(studentUser.email);
    });

    it('should update preferences and persist them in database', async () => {
      const res = await request(app)
        .put('/api/v1/auth/settings')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          preferences: {
            emailAlerts: false,
            twoFactorAuth: true,
            theme: 'dark',
          },
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify directly from DB
      const updatedUser = await User.findById(studentUser._id);
      expect(updatedUser.preferences.emailAlerts).toBe(false);
      expect(updatedUser.preferences.twoFactorAuth).toBe(true);
      expect(updatedUser.preferences.theme).toBe('dark');
    });
  });

  describe('3. Corporate Partners / Company Model & API Integration', () => {
    const testCompanyName = `Test Enterprise ${Date.now()}`;

    it('should forbid students from creating corporate partners (403)', async () => {
      const res = await request(app)
        .post('/api/v1/companies')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          name: testCompanyName,
          industry: 'Cloud Infrastructure',
        });
      expect(res.status).toBe(403);
    });

    it('should allow placement officer to create a corporate partner with full metadata', async () => {
      const res = await request(app)
        .post('/api/v1/companies')
        .set('Authorization', `Bearer ${placementToken}`)
        .send({
          name: testCompanyName,
          industry: 'Artificial Intelligence',
          recruiterName: 'Ananya Sharma',
          recruiterEmail: 'recruitment@testenterprise.com',
          recruiterPhone: '+91 98111 22334',
          website: 'https://testenterprise.com',
          notes: 'Premium recruitment partner for AI roles',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.company.name).toBe(testCompanyName);

      // Verify in DB
      const found = await Company.findOne({ name: testCompanyName });
      expect(found).not.toBeNull();
      expect(found.recruiterName).toBe('Ananya Sharma');
    });

    it('should prevent creating duplicate companies with the same name', async () => {
      const res = await request(app)
        .post('/api/v1/companies')
        .set('Authorization', `Bearer ${placementToken}`)
        .send({
          name: testCompanyName,
          industry: 'Artificial Intelligence',
        });
      expect(res.status).toBe(400);
      const msg = res.body.error?.message || res.body.message || '';
      expect(msg).toContain('already registered');
    });

    it('should allow authenticated users to list corporate partners with drive metrics', async () => {
      const res = await request(app)
        .get('/api/v1/companies')
        .set('Authorization', `Bearer ${placementToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.companies)).toBe(true);
      const companyEntry = res.body.data.companies.find((c) => c.name === testCompanyName);
      expect(companyEntry).toBeDefined();
      expect(companyEntry.activeDrivesCount).toBeDefined();
      expect(companyEntry.totalDrivesCount).toBeDefined();
    });
  });

  afterAll(async () => {
    // Cleanup test records
    await Company.deleteMany({ name: /^Test Enterprise/ });
    await User.deleteMany({ email: /.*testsuite@campusgent.edu/ });
  });
});
