import request from 'supertest';
import app from '../index.js'; // Make sure index.js exports the `app`

describe('GET /api/jobs', () => {
  it('should return 200 and jobs array', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
