import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { BookBorrow } from '../entities/BookBorrow';
import { Book } from '../entities/Book';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);
  private bookBorrowRepository = AppDataSource.getRepository(BookBorrow);
  private bookRepository = AppDataSource.getRepository(Book);

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.userRepository.find({
        order: { name: 'ASC' }
      });
      res.json(users.map(user => ({ id: user.id, name: user.name })));
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const borrows = await this.bookBorrowRepository.find({
        where: { user: { id: userId } },
        relations: ['book'],
        order: { borrowDate: 'DESC' }
      });

      const past = borrows
        .filter(borrow => borrow.returnDate)
        .map(borrow => ({
          name: borrow.book.name,
          userScore: borrow.score
        }));

      const present = borrows
        .filter(borrow => !borrow.returnDate)
        .map(borrow => ({
          name: borrow.book.name
        }));

      res.json({
        id: user.id,
        name: user.name,
        books: { past, present }
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = this.userRepository.create({ name: req.body.name });
      await this.userRepository.save(user);
      res.status(201).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async borrowBook(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const bookId = parseInt(req.params.bookId);

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const book = await this.bookRepository.findOne({ where: { id: bookId } });
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      // Check if book is already borrowed
      const activeBorrow = await this.bookBorrowRepository.findOne({
        where: { book: { id: bookId }, returnDate: null }
      });

      if (activeBorrow) {
        return res.status(400).json({ error: 'Book is already borrowed' });
      }

      const borrow = this.bookBorrowRepository.create({
        user,
        book,
        borrowDate: new Date()
      });

      await this.bookBorrowRepository.save(borrow);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async returnBook(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const bookId = parseInt(req.params.bookId);
      const { score } = req.body;

      const borrow = await this.bookBorrowRepository.findOne({
        where: {
          user: { id: userId },
          book: { id: bookId },
          returnDate: null
        }
      });

      if (!borrow) {
        return res.status(404).json({ error: 'No active borrow found for this book and user' });
      }

      borrow.returnDate = new Date();
      borrow.score = score;
      await this.bookBorrowRepository.save(borrow);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}