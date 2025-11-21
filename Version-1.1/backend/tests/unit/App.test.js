const request = require('supertest');

// Mock environment variables and mongoose before requiring App
process.env.MONGO_URI = 'mongodb://localhost:27017/test';

// Mock mongoose to prevent actual connection
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
  Schema: class MockSchema {
    constructor(definition) {
      this.definition = definition;
      this.methods = {};
    }
    pre(method, fn) {
      return this;
    }
  },
  model: jest.fn().mockReturnValue({}),
}));

// Mock authentication middleware
jest.mock('../../middleware/AuthMiddleware', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 1, role: 'owner' };
    next();
  },
  authorizeRole: (...roles) => (req, res, next) => next(),
}));

const app = require('../../App');

describe('App.js', () => {
  it('should return API status message on GET /', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'API funcionando correctamente' });
  });

  it('should respond to requests without crashing', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});
