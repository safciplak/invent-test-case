import { Request, Response } from 'express';
import { BookController } from '../../controllers/bookController';
import { AppDataSource } from '../../config/database';

describe('BookController', () => {
  let bookController: BookController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockBookRepository: any;
  let mockBookBorrowRepository: any;

  beforeEach(() => {
    mockBookRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockBookBorrowRepository = {
      find: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock)
      .mockReturnValueOnce(mockBookRepository)
      .mockReturnValueOnce(mockBookBorrowRepository);

    bookController = new BookController();
    
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe('getBooks', () => {
    it('should return all books', async () => {
      const mockBooks = [
        { id: 1, name: 'Book 1' },
        { id: 2, name: 'Book 2' },
      ];

      mockBookRepository.find.mockResolvedValue(mockBooks);

      await bookController.getBooks(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockBookRepository.find).toHaveBeenCalledWith({
        order: { name: 'ASC' },
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockBooks);
    });

    it('should handle errors', async () => {
      mockBookRepository.find.mockRejectedValue(new Error('Database error'));

      await bookController.getBooks(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });

  describe('getBook', () => {
    it('should return book with average score', async () => {
      const mockBook = { id: 1, name: 'Book 1' };
      const mockBorrows = [
        { score: 4 },
        { score: 5 },
        { score: 3 }
      ];

      mockRequest.params = { id: '1' };
      mockBookRepository.findOne.mockResolvedValue(mockBook);
      mockBookBorrowRepository.find.mockResolvedValue(mockBorrows);

      await bookController.getBook(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Book 1',
        score: 4
      });
    });

    it('should return -1 score when no borrows', async () => {
      const mockBook = { id: 1, name: 'Book 1' };
      mockRequest.params = { id: '1' };
      mockBookRepository.findOne.mockResolvedValue(mockBook);
      mockBookBorrowRepository.find.mockResolvedValue([]);

      await bookController.getBook(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Book 1',
        score: -1
      });
    });

    it('should return 404 when book not found', async () => {
      mockRequest.params = { id: '999' };
      mockBookRepository.findOne.mockResolvedValue(null);

      await bookController.getBook(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Book not found'
      });
    });
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const mockBook = { name: 'New Book' };
      mockRequest.body = mockBook;
      mockBookRepository.create.mockReturnValue(mockBook);
      mockBookRepository.save.mockResolvedValue(mockBook);

      await bookController.createBook(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockBookRepository.create).toHaveBeenCalledWith(mockBook);
      expect(mockBookRepository.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle errors during creation', async () => {
      mockRequest.body = { name: 'New Book' };
      mockBookRepository.save.mockRejectedValue(new Error('Database error'));

      await bookController.createBook(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error'
      });
    });
  });
}); 