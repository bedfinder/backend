import { app } from '..';
import request from 'supertest';

describe('server', () => {
  test('should listening', async done => {
    const res = await request(app).get('/__internal/health');

    expect(res.status).toBe(200);
    done();
  });
  afterAll(done => {
    app.removeAllListeners();
    done();
  });
});
