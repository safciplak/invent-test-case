import { DataSource } from 'typeorm';

// Mock TypeORM's DataSource
jest.mock('../config/database', () => ({
  AppDataSource: {
    initialize: jest.fn().mockResolvedValue({}),
    getRepository: jest.fn(),
  },
})); 