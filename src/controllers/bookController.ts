import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Book } from '../entities/Book';
import { BookBorrow } from '../entities/BookBorrow';
import { Not, IsNull } from 'typeorm';

export class BookController {
  private bookRepository = AppDataSource.getRepository(Book);
  private bookBorrowRepository = AppDataSource.getRepository(BookBorrow);

  async getBooks(req: Request, res: Response) {
    try {
      const books = await this.bookRepository.find({
        order: { name: 'ASC' }
      });
      res.json(books.map(book => ({ id: book.id, name: book.name })));
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getBook(req: Request, res: Response) {
    try {
      const bookId = parseInt(req.params.id);
      const book = await this.bookRepository.findOne({ where: { id: bookId } });

      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      const borrows = await this.bookBorrowRepository.find({
        where: { book: { id: bookId }, returnDate: Not(IsNull()) },
        select: ['score']
      });

      const scores = borrows.map(borrow => borrow.score).filter(score => score !== null);
      const averageScore = scores.length > 0
        ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2))
        : -1;

      res.json({
        id: book.id,
        name: book.name,
        score: averageScore
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createBook(req: Request, res: Response) {
    try {
      const book = this.bookRepository.create({ name: req.body.name });
      await this.bookRepository.save(book);
      res.status(201).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}