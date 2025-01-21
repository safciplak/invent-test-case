import { Book } from '../../entities/Book';
import { BookBorrow } from '../../entities/BookBorrow';

describe('Book Entity', () => {
  it('should create a book instance', () => {
    const book = new Book();
    book.id = 1;
    book.name = 'Test Book';
    book.borrows = [];

    expect(book).toBeInstanceOf(Book);
    expect(book.id).toBe(1);
    expect(book.name).toBe('Test Book');
    expect(book.borrows).toEqual([]);
  });

  it('should handle book borrows relationship', () => {
    const book = new Book();
    const bookBorrow1 = new BookBorrow();
    const bookBorrow2 = new BookBorrow();

    book.borrows = [bookBorrow1, bookBorrow2];

    expect(book.borrows).toHaveLength(2);
    expect(book.borrows).toContain(bookBorrow1);
    expect(book.borrows).toContain(bookBorrow2);
  });
}); 