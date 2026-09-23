import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app.js';
describe('🏥 API Health Integration Test', () => {
    it('should return 200 OK for base health check endpoint', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            data: {
                status: 'OK',
                timestamp: expect.any(String),
                version: '1.0.0',
            },
        });
    });
});
describe('🔒 AI Agent Routes Security Integration Tests', () => {
    it('should return 401 Unauthorized when executing an agent without JWT token', async () => {
        const response = await request(app)
            .post('/api/v1/agents/execute/student_success')
            .send({ studentId: '654321098765432109876543' });
        expect(response.status).toBe(401);
    });
});
