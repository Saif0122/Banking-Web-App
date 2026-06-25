import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';

// Set up test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-at-least-32-chars-long-or-more';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '10000'; // high limit for tests
process.env.MONGOMS_VERSION = '5.0.26';

// Mock morgan globally to suppress HTTP logs in test output
jest.mock('morgan', () => () => (req, res, next) => next());

let mongoServer;

beforeAll(async () => {
  // Suppress mongoose warnings
  mongoose.set('strictQuery', true);

  // Spin up in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect before tests
  await mongoose.connect(mongoUri);
}, 600000);

afterEach(async () => {
  // Clear database after each test for test isolation
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // Close database after all tests
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
