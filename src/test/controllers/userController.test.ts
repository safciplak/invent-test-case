import { Request, Response } from 'express';
import { UserController } from '../../controllers/userController';
import { AppDataSource } from '../../config/database';

describe('UserController', () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockUserRepository: any;
  let mockBookBorrowRepository: any;
  let mockBookRepository: any;

  beforeEach(() => {
    mockUserRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockBookBorrowRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockBookRepository = {
      findOne: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock)
      .mockReturnValueOnce(mockUserRepository)
      .mockReturnValueOnce(mockBookBorrowRepository)
      .mockReturnValueOnce(mockBookRepository);

    userController = new UserController();
    
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ];

      mockUserRepository.find.mockResolvedValue(mockUsers);

      await userController.getUsers(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockUserRepository.find).toHaveBeenCalledWith({
        order: { name: 'ASC' },
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors', async () => {
      mockUserRepository.find.mockRejectedValue(new Error('Database error'));

      await userController.getUsers(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });

  describe('getUser', () => {
    it('should return user with book history', async () => {
      const mockUser = { id: 1, name: 'User 1' };
      const mockBorrows = [
        { book: { name: 'Book 1' }, returnDate: new Date(), score: 4 },
        { book: { name: 'Book 2' }, returnDate: null },
      ];

      mockRequest.params = { id: '1' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockBookBorrowRepository.find.mockResolvedValue(mockBorrows);

      await userController.getUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 1,
        name: 'User 1',
        books: {
          past: [{ name: 'Book 1', userScore: 4 }],
          present: [{ name: 'Book 2' }]
        }
      });
    });

    it('should return 404 when user not found', async () => {
      mockRequest.params = { id: '999' };
      mockUserRepository.findOne.mockResolvedValue(null);

      await userController.getUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'User not found'
      });
    });
  });

  describe('borrowBook', () => {
    it('should create a new borrow', async () => {
      const mockUser = { id: 1, name: 'User 1' };
      const mockBook = { id: 1, name: 'Book 1' };
      
      mockRequest.params = { userId: '1', bookId: '1' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockBookRepository.findOne.mockResolvedValue(mockBook);
      mockBookBorrowRepository.findOne.mockResolvedValue(null);
      
      await userController.borrowBook(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockBookBorrowRepository.create).toHaveBeenCalled();
      expect(mockBookBorrowRepository.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });

    it('should return 400 when book is already borrowed', async () => {
      mockRequest.params = { userId: '1', bookId: '1' };
      mockUserRepository.findOne.mockResolvedValue({ id: 1 });
      mockBookRepository.findOne.mockResolvedValue({ id: 1 });
      mockBookBorrowRepository.findOne.mockResolvedValue({ id: 1 });

      await userController.borrowBook(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Book is already borrowed'
      });
    });
  });

  describe('returnBook', () => {
    it('should return a borrowed book', async () => {
      const mockBorrow = {
        returnDate: null,
        score: null
      };

      mockRequest.params = { userId: '1', bookId: '1' };
      mockRequest.body = { score: 5 };
      mockBookBorrowRepository.findOne.mockResolvedValue(mockBorrow);

      await userController.returnBook(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockBookBorrowRepository.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });

    it('should return 404 when no active borrow found', async () => {
      mockRequest.params = { userId: '1', bookId: '1' };
      mockRequest.body = { score: 5 };
      mockBookBorrowRepository.findOne.mockResolvedValue(null);

      await userController.returnBook(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'No active borrow found for this book and user'
      });
    });
  });
}); 