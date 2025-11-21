const request = require('supertest');
const app = require('../../App');

describe('App.js', () => {
  it('should render the home page on GET /', async () => {
    // Mock the render method on res
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
